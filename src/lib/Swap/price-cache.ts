import { TV } from "@/classes/TokenValue";
import { diamondPriceABI } from "@/constants/abi/diamondPriceABI";
import { abiSnippets } from "@/constants/abiSnippets";
import { beanstalkAddress, beanstalkPriceAddress } from "@/generated/contractHooks";
import { SwapContext } from "@/lib/Swap/swap-router";
import { resolveChainId } from "@/utils/chain";
import { getTokenIndex, tokensEqual } from "@/utils/token";
import { Token } from "@/utils/types";
import { multicall } from "@wagmi/core";
import { ContractFunctionParameters } from "viem";

const TWO_MINS = 1000 * 60 * 2;

export class SwapPriceCache {
  /**
   * Token Prices
   */
  #priceMap: Map<Token, TV>;

  /**
   * Well PINTO prices
   */
  #wellPriceMap: Map<Token, TV>;

  #context: SwapContext;

  #lastFetchedTimestamp: number = 0;

  constructor(context: SwapContext) {
    this.#context = context;
    this.#priceMap = new Map<Token, TV>();
    this.#wellPriceMap = new Map<Token, TV>();
  }

  get priceMap() {
    return this.#priceMap;
  }

  /**
   * Clear the price map and reset the last fetched timestamp.
   */
  clear() {
    this.#priceMap.clear();
    this.#lastFetchedTimestamp = 0;
  }

  /**
   * Get the price of a token.
   * @param token - The token to get the price of.
   * @returns The price of the token or undefined if the token is not in the price map.
   */
  getPrice(token: Token) {
    if (tokensEqual(token, this.#context.mainToken)) {
      return this.#priceMap.get(this.#context.mainToken);
    }

    if (tokensEqual(token, this.#context.native) || tokensEqual(token, this.#context.wrappedNative)) {
      return this.#priceMap.get(this.#context.wrappedNative);
    }

    // ensure we are using the same instance of the token as the price map
    const index = getTokenIndex(token);
    const safeInstanceToken = this.#context.tokenMap[index];

    return safeInstanceToken ? this.#priceMap.get(safeInstanceToken) : undefined;
  }

  /**
   * Update the price map.
   * @param force - Whether to force an update even if the prices were recently fetched.
   */
  async updatePrices(force: boolean = false) {
    const now = Date.now();

    const diff = now - this.#lastFetchedTimestamp;

    if (force || diff > TWO_MINS) {
      const { priceMap, wellPriceMap } = await this.#fetchPrices();
      this.#priceMap = priceMap;
      this.#wellPriceMap = wellPriceMap;
      this.#lastFetchedTimestamp = now;
    }
  }

  async #fetchPrices() {
    const { tokens, contracts, price: priceContract } = this.#buildMulticall();

    const prices = await multicall(this.#context.config, {
      contracts: [...contracts, priceContract],
      allowFailure: false,
    });

    const priceMap = new Map<Token, TV>();
    const wellPriceMap = new Map<Token, TV>();

    for (const [index, price] of prices.entries()) {
      const token = tokens[index];

      if (typeof price === "bigint") {
        if (token.isWrappedNative) {
          priceMap.set(this.#context.native, TV.fromBlockchain(price, 6));
        }
        priceMap.set(token, TV.fromBlockchain(price, 6));
      } else if (price.price) {
        priceMap.set(this.#context.mainToken, TV.fromBlockchain(price.price, 6));

        price.ps.forEach((pool) => {
          const well = this.#context.tokenMap[getTokenIndex(pool.pool)];
          if (well) {
            wellPriceMap.set(well, TV.fromBlockchain(pool.price, 6));
            priceMap.set(well, TV.fromBlockchain(pool.lpUsd, 6));
          }
        });
      }
    }

    return {
      priceMap,
      wellPriceMap,
    };
  }

  #buildMulticall() {
    const tokens = Object.keys(this.#context.underlying2LP).map((token) => {
      return this.#context.tokenMap[getTokenIndex(token)];
    });
    const contracts = tokens.map<ContractFunctionParameters<typeof abiSnippets.price.getTokenUsdPrice>>((token) => {
      return {
        address: beanstalkAddress[resolveChainId(this.#context.chainId)],
        abi: abiSnippets.price.getTokenUsdPrice,
        functionName: "getTokenUsdPrice",
        args: [token.address],
      };
    });

    const price: ContractFunctionParameters<typeof diamondPriceABI> = {
      address: beanstalkPriceAddress[resolveChainId(this.#context.chainId)],
      abi: diamondPriceABI,
      functionName: "price",
      args: [],
    };

    return {
      tokens,
      contracts: contracts,
      price,
    };
  }
}
