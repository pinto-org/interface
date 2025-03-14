import { Clipboard } from "@/classes/Clipboard";
import { TV } from "@/classes/TokenValue";
import { diamondPriceABI } from "@/constants/abi/diamondPriceABI";
import { beanstalkPriceAddress } from "@/generated/contractHooks";
import { BasePoolData } from "@/state/usePriceData";
import { getTokenIndex } from "@/utils/token";
import { AddressMap, Token } from "@/utils/types";
import { AdvancedPipeCall } from "@/utils/types";
import { HashString } from "@/utils/types.generic";
import { Address, decodeFunctionResult } from "viem";
import { encodeFunctionData } from "viem";

export default function encodePrice(chainId: number): AdvancedPipeCall {
  const encoded = encodeFunctionData({
    abi: diamondPriceABI,
    functionName: "price",
    args: [],
  });

  return {
    target: beanstalkPriceAddress[chainId],
    callData: encoded,
    clipboard: Clipboard.encode([]),
  };
}

export interface PriceContractPriceResult<
  T extends TV | bigint = bigint,
  V extends Token | Address = Address,
  P extends BasePoolData<V, T> = BasePoolData<V, T>,
> {
  price: T;
  liquidity: T;
  deltaB: T;
  pools: AddressMap<P>;
}

export function decodePriceResult(result: HashString): PriceContractPriceResult<bigint> {
  const decoded = decodeFunctionResult({
    abi: diamondPriceABI,
    functionName: "price",
    data: result,
  });

  const poolData = decoded.ps.reduce<AddressMap<BasePoolData<Address, bigint>>>((prev, curr) => {
    prev[getTokenIndex(curr.pool)] = {
      pool: curr.pool,
      tokens: curr.tokens as [Address, Address],
      balances: curr.balances as [bigint, bigint],
      price: curr.price as bigint,
      liquidity: curr.liquidity as bigint,
      deltaB: curr.deltaB as bigint,
      lpUsd: curr.lpUsd as bigint,
      lpBdv: curr.lpBdv as bigint,
    };
    return prev;
  }, {});

  return {
    pools: poolData,
    price: decoded.price as bigint,
    liquidity: decoded.liquidity as bigint,
    deltaB: decoded.deltaB as bigint,
  };
}
