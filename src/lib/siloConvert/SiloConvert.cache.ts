import { Clipboard } from "@/classes/Clipboard";
import { TV } from "@/classes/TokenValue";
import { diamondPriceABI } from "@/constants/abi/diamondPriceABI";
import { abiSnippets } from "@/constants/abiSnippets";
import { MAIN_TOKEN } from "@/constants/tokens";
import { PriceContractPriceResult, decodePriceResult } from "@/encoders/ecosystem/price";
import { beanstalkPriceAddress } from "@/generated/contractHooks";
import { AdvancedPipeWorkflow } from "@/lib/farm/workflow";
import { ExchangeWell } from "@/lib/well/ExchangeWell";
import { PoolData } from "@/state/usePriceData";
import { resolveChainId } from "@/utils/chain";
import { getChainToken, getChainTokenMap, getTokenIndex } from "@/utils/token";
import { tokensEqual } from "@/utils/token";
import { Token } from "@/utils/types";
import { AddressLookup } from "@/utils/types.generic";
import { Address, decodeFunctionResult, encodeFunctionData } from "viem";
import { SiloConvertContext } from "./SiloConvert";

/**
 * SiloConvertCache is a class that caches the price struct data, well data to assist in quoting conversions.
 *
 * We opt to cache this data separately from what is managed by Wagmi's hooks to have greater control over when
 * the cache is updated.
 *
 * Refetching price & well data via the hooks causes re-renders throughout the app that could cause performance bottlenecks,
 * so we introduce a degree of redundancy to ensure we have the most up to date data.
 */

/**
 * Extended pool data for the SiloConvertCache.
 */
export interface ExtendedPoolData extends PoolData {
  /** The non-BEAN underlying token in the LP pair */
  pair: {
    /** the pair token */
    token: Token;
    /** the index of the pair token in the pool */
    index: number;
    /** the price of the pair token */
    price: TV;
  };
  /** The prices of the underlying tokens in the pool */
  prices: TV[];
}

/**
 * Extended price result for the SiloConvertCache.
 */
export type ExtendedPriceResult = PriceContractPriceResult<TV, Token, ExtendedPoolData>;

/**
 * The interval to refetch the cache.
 */
const REFETCH_INTERVAL = 1000 * 15; // 15 seconds

export class SiloConvertCache {
  /** Shared context */
  #context: SiloConvertContext;

  /** Mapping of LP tokens to their pair token */
  #lp2Pair: AddressLookup<Token>;

  /** The cached price contract Price() result */
  #priceStruct: ExtendedPriceResult | undefined = undefined;

  /** A map of well addresses to their raw well data. */
  #rawWellData: Awaited<ReturnType<typeof ExchangeWell.loadWells>> = {};

  /** The last time the cache was updated. */
  #lastUpdateTimestamp: number = 0;

  constructor(context: SiloConvertContext) {
    this.#context = context;
    this.#lp2Pair = getLpTokensToPairs(context.chainId);
  }

  /**
   * Resets the cache.
   */
  clear() {
    // rawWellData doesn't need to be cleared as it doesn't change.
    this.#priceStruct = undefined;
    this.#lastUpdateTimestamp = 0;
  }

  /**
   * Returns the cached price struct.
   */
  getPriceStruct() {
    if (!this.#priceStruct) {
      throw new Error("Price data not found. Run update() first.");
    }

    return this.#priceStruct;
  }

  /**
   * Returns the cached deltaB.
   */
  getDeltaB() {
    if (!this.#priceStruct) {
      throw new Error("Cannot get deltaB as price data not found. Run update() first.");
    }

    return this.#priceStruct.deltaB;
  }

  /**
   * Returns the USD price of a token.
   */
  getTokenPrice(address: Address, wellAddress?: Address) {
    if (!this.#priceStruct) {
      throw new Error("Cannot get token price as price data not found. Run update() first.");
    }

    const tokenMap = getChainTokenMap(this.#context.chainId);
    const token = tokenMap[getTokenIndex(address)];

    if (!token) {
      throw new Error(`Error finding token for ${address}`);
    }

    // If the token is a main token and no well address is provided, return the price of BEAN
    if (token.isMain && !wellAddress) {
      return this.#priceStruct.price;
    }
    // Return the Well BEAN price
    if (token.isMain && wellAddress) {
      return this.getWell(wellAddress).price;
    }
    // Return the Well LP USD price
    if (token.isLP) {
      return this.getWell(token.address).lpUsd;
    }
    // At this point we know that the token is a pair token
    // If Well address is provided, return Well Pair Token USD price
    if (!token.isLP && wellAddress) {
      const well = this.getWell(wellAddress);
      return well.pair.price;
    }
    // If well address is not provided, loop through all wells and find the Well that contains the token
    const well = Object.values(this.#priceStruct.pools).find((data) => tokensEqual(data.pair.token, token));
    if (!well) {
      throw new Error(`Could not determine Well where ${address} is a reserve token`);
    }

    return well.pair.price;
  }

  /**
   * Returns the Extended Well data for a given Well address.
   */
  getWell(address: Address) {
    if (!this.#priceStruct) {
      throw new Error("Cannot get Well as price data not found. Run update() first.");
    }

    const well = this.#priceStruct.pools[getTokenIndex(address)];

    if (!well) {
      throw new Error(`Well for ${address} not found`);
    }

    return well;
  }

  /**
   * Updates the cache.
   * @param force - Whether to force the update.
   */
  async update(force: boolean = false) {
    const diff = Date.now() - this.#lastUpdateTimestamp;

    if (force || this.#lastUpdateTimestamp === 0 || diff > REFETCH_INTERVAL) {
      const priceResult = await this.#fetch();
      this.#priceStruct = priceResult;
      this.#lastUpdateTimestamp = Date.now();
      console.debug("[PipelineConvert/Cache/update]: ", this);
    }
  }

  /**
   * Loads raw well data from on chain.
   */
  async loadWellData() {
    const hasRawWellData = !!Object.keys(this.#rawWellData).length;

    if (!hasRawWellData) {
      this.#rawWellData = await ExchangeWell.loadWells(
        getLPTokens(this.#context.chainId).map((pool) => pool.address),
        this.#context.wagmiConfig,
      );
      console.debug("[SiloConvertCache/loadWellData]: ", this.#rawWellData);
    }

    return this.#rawWellData;
  }

  /**
   * Loads the wells from on chain.
   */
  async getRawWellData(address: Address) {
    const rawWellData = await this.loadWellData();

    const wellData = rawWellData[getTokenIndex(address)];

    if (!wellData) {
      throw new Error(`Raw well data for ${address} not found`);
    }

    return wellData;
  }

  /**
   * Constructs an AdvancedPipeWorkflow for fetching the price data.
   */
  constructPriceAdvPipe(options?: { noTokenPrices?: boolean }) {
    const advPipe = new AdvancedPipeWorkflow(this.#context.chainId, this.#context.wagmiConfig);

    advPipe.add({
      target: beanstalkPriceAddress[this.#context.chainId],
      callData: encodeFunctionData({
        abi: diamondPriceABI,
        functionName: "price",
        args: [],
      }),
      clipboard: Clipboard.encode([]),
    });

    if (options?.noTokenPrices) {
      return advPipe;
    }

    Object.values(this.#lp2Pair).forEach((data) => {
      advPipe.add({
        target: this.#context.diamond,
        callData: encodeFunctionData({
          abi: abiSnippets.price.getTokenUsdPrice,
          functionName: "getTokenUsdPrice",
          args: [data.address],
        }),
        clipboard: Clipboard.encode([]),
      });
    });

    return advPipe;
  }

  /**
   * Fetches the relevant pool data from on chain
   */
  async #fetch(): Promise<ExtendedPriceResult> {
    const tokenMap = getChainTokenMap(this.#context.chainId);
    const mainToken = MAIN_TOKEN[resolveChainId(this.#context.chainId)];

    const advPipe = this.constructPriceAdvPipe();

    // Fetch price contract data & price oracle data
    const [priceData, ...tokenUsdData] = await advPipe.readStatic();

    const priceResult = decodePriceResult(priceData);

    const map: AddressLookup<ExtendedPoolData> = {};

    for (const [index, [lpTokenIndex, pairToken]] of Object.entries(this.#lp2Pair).entries()) {
      const pairPriceBigInt = decodeFunctionResult({
        abi: abiSnippets.price.getTokenUsdPrice,
        functionName: "getTokenUsdPrice",
        data: tokenUsdData[index],
      });

      const poolResult = priceResult.pools[lpTokenIndex];
      const wellTokens = poolResult?.tokens.map((t) => getChainToken(this.#context.chainId, t));

      if (!poolResult) {
        throw new Error(`Pool result not found for ${lpTokenIndex}`);
      }
      if (!wellTokens.length) {
        throw new Error(`No well tokens found with address: ${lpTokenIndex}`);
      }

      const poolPrice = TV.fromBigInt(poolResult.price, mainToken.decimals);

      const pairData = {
        token: pairToken,
        index: wellTokens[0].isMain ? 1 : 0,
        price: TV.fromBigInt(pairPriceBigInt, mainToken.decimals),
      };

      map[lpTokenIndex] = {
        pool: tokenMap[lpTokenIndex],
        price: poolPrice,
        pair: pairData,
        tokens: wellTokens,
        liquidity: TV.fromBigInt(poolResult.liquidity, 6),
        lpUsd: TV.fromBigInt(poolResult.lpUsd, mainToken.decimals),
        lpBdv: TV.fromBigInt(poolResult.lpBdv, mainToken.decimals),
        deltaB: TV.fromBigInt(poolResult.deltaB, mainToken.decimals),
        balances: wellTokens.map((t, i) => TV.fromBigInt(poolResult.balances[i], t.decimals)),
        prices: wellTokens.map((t) => (t.isMain ? poolPrice : pairData.price)),
      };
    }

    return {
      deltaB: TV.fromBigInt(priceResult.deltaB, 6),
      price: TV.fromBigInt(priceResult.price, 6),
      liquidity: TV.fromBigInt(priceResult.liquidity, 6),
      pools: map,
    };
  }
}

/**
 * Returns a map of LP tokens to their pair tokens.
 */
function getLpTokensToPairs(chainId: number) {
  const tokenMap = getChainTokenMap(chainId);

  return Object.entries(tokenMap).reduce<AddressLookup<Token>>((prev, [tokenIndex, token]) => {
    if (!token.isLP || !token.tokens?.length) {
      return prev;
    }

    const reserveTokens = token.tokens.map((t) => tokenMap[getTokenIndex(t)]);
    if (reserveTokens.length !== 2) {
      // Should never happen but sanity check
      throw new Error(`Expected Binary reserve tokens but got ${reserveTokens.length} tokens for ${token.symbol} Well`);
    }

    prev[tokenIndex] = reserveTokens[0].isMain ? reserveTokens[1] : reserveTokens[0];

    return prev;
  }, {});
}

/**
 * Returns all LP tokens for a given chain.
 */
function getLPTokens(chainId: number) {
  const tokenMap = getChainTokenMap(chainId);
  const lpTokens = Object.values(tokenMap).filter((t) => t.isLP);
  return lpTokens;
}
