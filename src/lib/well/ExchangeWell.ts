import { TV } from "@/classes/TokenValue";
import { abiSnippets } from "@/constants/abiSnippets";
import { WELL_FUNCTION_ADDRESSES } from "@/constants/address";
import { resolveChainId } from "@/utils/chain";
import { stringEq } from "@/utils/string";
import { getTokenIndex } from "@/utils/token";
import { CallStruct, Token } from "@/utils/types";
import { AddressLookup } from "@/utils/types.generic";
import { exists } from "@/utils/utils";
import { multicall } from "@wagmi/core";
import { Address, ContractFunctionParameters } from "viem";
import { Config as WagmiConfig } from "wagmi";

export interface RawWellData {
  tokens: Address[];
  wellFunction: CallStruct;
  pumps: CallStruct[];
  wellData: `0x${string}`;
  aquifer: `0x${string}`;
}

export type WellFunctionType = "stable2" | "cp2";

export interface ExtendedRawWellData extends RawWellData {
  wellFunctionType: WellFunctionType;
}

export class ExchangeWell {
  static loadWells = async (addresses: Address[], config: WagmiConfig): Promise<AddressLookup<ExtendedRawWellData>> => {
    if (!addresses.length) return {};

    const contracts: ContractFunctionParameters<typeof abiSnippets.wells.well>[] = addresses.map((address) => {
      return {
        abi: abiSnippets.wells.well,
        address,
        functionName: "well",
        args: [],
      };
    });

    const data = await multicall(config, { contracts: contracts, allowFailure: true });

    const wells = data.reduce<AddressLookup<ExtendedRawWellData>>((acc, datum, i) => {
      if (!datum.result) return acc;

      const address = addresses[i];
      const [tokens, wellFunction, pumps, wellData, aquifer] = datum.result;

      acc[getTokenIndex(address)] = {
        tokens: tokens as `0x${string}`[],
        pumps: pumps as CallStruct[],
        wellFunction,
        wellData,
        aquifer,
        wellFunctionType: ExchangeWell.deriveWellFunctionType(
          resolveChainId(config.state.chainId),
          wellFunction.target,
        ),
      };

      return acc;
    }, {});

    return wells;
  };

  /**
   * Returns the ideal ratios for the reserves given the pair price only for jth token index
   *
   * Example: for Well AB:
   *    where target price of A is $1 & oracle price of B is $100
   *    reserves = [1_000_000 A, 10_000 B]
   *    A has 6 decimals, B has 18 decimals
   *
   * return [price of A in B decimals, price of B in A decimals]
   *
   * gives us the ratio [100 * (10 ** 6), 1 * (10 ** 18)]
   */
  static getRatiosJ(tokens: Token[], prices: TV[]) {
    if (tokens.length !== 2 || prices.length !== 2) {
      throw new Error("[ExchangeWell/getRatiosJ]: only supports 2 tokens");
    }

    let nonMainIndex: number | undefined = undefined;

    const reversedPrices = [...prices.reverse()];

    const r = tokens.map((token, i) => {
      if (!token.isMain) {
        if (exists(nonMainIndex)) {
          throw new Error("[ExchangeWell/getRatiosJ]: only supports one non-main token");
        }
        nonMainIndex = i;
      }
      const otherPrice = reversedPrices[i];

      if (!token.isMain) {
        return TV.fromHuman(1, token.decimals);
      }

      return TV.fromHuman(otherPrice.toHuman(), token.decimals);
    });

    if (!exists(nonMainIndex)) {
      throw new Error("[ExchangeWell/getRatiosJ]: expected one non-main token");
    }

    return r;
  }

  // ---------- PRIVATE METHODS ----------

  private static deriveWellFunctionType(chainId: number, wellFunction: Address) {
    const knownWellFunctions = WELL_FUNCTION_ADDRESSES[resolveChainId(chainId)];
    if (stringEq(wellFunction, knownWellFunctions.stable2)) return "stable2";
    if (stringEq(wellFunction, knownWellFunctions.cp2)) return "cp2";

    throw new Error(`Unknown well function type for ${wellFunction}`);
  }
}
