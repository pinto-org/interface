import { Clipboard } from "@/classes/Clipboard";
import { TV } from "@/classes/TokenValue";
import { diamondABI } from "@/constants/abi/diamondABI";
import { diamondPriceABI } from "@/constants/abi/diamondPriceABI";
import { abiSnippets } from "@/constants/abiSnippets";
import { MAIN_TOKEN } from "@/constants/tokens";
import encodePrice, {
  PriceContractPriceResult,
  decodeGetWell,
  decodePriceResult,
  encodeGetWell,
} from "@/encoders/ecosystem/price";
import { beanstalkPriceAddress } from "@/generated/contractHooks";
import { AdvancedPipeWorkflow } from "@/lib/farm/workflow";
import { SiloConvertContext } from "@/lib/siloConvert/types";
import { ExchangeWell } from "@/lib/well/ExchangeWell";
import { BasePoolData, PoolData } from "@/state/usePriceData";
import { resolveChainId } from "@/utils/chain";
import { stringEq } from "@/utils/string";
import { getChainToken, getChainTokenMap, getTokenIndex } from "@/utils/token";
import { tokensEqual } from "@/utils/token";
import { AdvancedPipeCall, Token } from "@/utils/types";
import { AddressLookup, HashString } from "@/utils/types.generic";
import {
  Address,
  ContractFunctionParameters,
  MulticallResponse,
  MulticallReturnType,
  decodeFunctionResult,
  encodeFunctionData,
} from "viem";
import { multicall } from "viem/actions";

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

/**
 * SiloConvertCache
 *
 * Architecture notes:
 *
 * The SiloConvertCache manages all cached data required for conversion quotations,
 * including price data, well information, and pool states.
 *
 * [Cache Strategy]
 * The cache uses a 15-second refresh interval for price-sensitive data.
 * We opt to cache this data separately from what is managed by Wagmi's hooks to have greater control over when the cache is updated.
 *
 * Refetching price & well data via the hooks causes re-renders throughout the app that could cause performance bottlenecks,
 * so we introduce a degree of redundancy to ensure we have the most up to date data.
 *
 * [Data Sources]
 * The cache aggregates data from multiple sources:
 * 1. Price contract for real-time token pricing
 * 2. Well contracts for liquidity pool states
 *
 * [Extended Well Data]
 * The cache enriches basic well data with:
 * - Pair token information and metadata
 * - Current ΔP (delta B) calculations
 */
export class SiloConvertPriceCache {
  /** Shared context */
  private context: SiloConvertContext;

  /** Mapping of LP tokens to their pair token */
  private lp2Pair: AddressLookup<Token>;

  /** Mapping of dewhitelisted LP tokens to their pair token */
  private dewhitelistedLP: AddressLookup<Token>;

  /** The cached price contract Price() result */
  private priceStruct: ExtendedPriceResult | undefined = undefined;

  /** A map of well addresses to their raw well data. */
  private rawWellData: Awaited<ReturnType<typeof ExchangeWell.loadWells>> = {};

  /** The last time the cache was updated. */
  lastUpdateTimestamp: number = 0;

  /**
   * A set of well addresses that failed to return any form of price data from the price / diamond contract
   */
  private invalidWells: Set<string> = new Set();

  constructor(context: SiloConvertContext) {
    this.context = context;
    this.lp2Pair = getLpTokensToPairs(context.chainId);
    this.dewhitelistedLP = getDewhitelistedLPs(context.chainId);
  }

  /**
   * Resets the cache.
   */
  clear() {
    // rawWellData doesn't need to be cleared as it doesn't change.
    this.priceStruct = undefined;
    this.lastUpdateTimestamp = 0;
  }

  /**
   * Returns the cached price struct.
   */
  getPriceStruct() {
    if (!this.priceStruct) {
      throw new Error("Price data not found. Run update() first.");
    }

    return this.priceStruct;
  }

  /**
   * Returns the cached deltaB.
   */
  getDeltaB() {
    if (!this.priceStruct) {
      throw new Error("Cannot get deltaB as price data not found. Run update() first.");
    }

    return this.priceStruct.deltaB;
  }

  /**
   * Returns the USD price of a token.
   */
  getTokenPrice(address: Address, wellAddress?: Address) {
    if (!this.priceStruct) {
      throw new Error("Cannot get token price as price data not found. Run update() first.");
    }

    const tokenMap = getChainTokenMap(this.context.chainId);
    const token = tokenMap[getTokenIndex(address)];

    if (!token) {
      throw new Error(`Error finding token for ${address}`);
    }

    // If the token is a main token and no well address is provided, return the price of BEAN
    if (token.isMain && !wellAddress) {
      return this.priceStruct.price;
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
    const well = Object.values(this.priceStruct.pools).find((data) => tokensEqual(data.pair.token, token));
    if (!well) {
      throw new Error(`Could not determine Well where ${address} is a reserve token`);
    }

    return well.pair.price;
  }

  getIsWellAvailable(well: Address) {
    if (this.invalidWells.has(getTokenIndex(well))) {
      return false;
    }

    return true;
  }

  /**
   * Returns the Extended Well data for a given Well address.
   */
  getWell(address: Address) {
    if (!this.priceStruct) {
      throw new Error("Cannot get Well as price data not found. Run update() first.");
    }

    const well = this.priceStruct.pools[getTokenIndex(address)];

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
    console.debug("[SiloConvertCache/update] updating cache...");
    const diff = Date.now() - this.lastUpdateTimestamp;
    if (force || this.lastUpdateTimestamp === 0 || diff > REFETCH_INTERVAL) {
      const priceResult = await this.fetchMulticall();
      this.invalidWells = priceResult.erroredWells;
      this.priceStruct = priceResult;
      this.lastUpdateTimestamp = Date.now();
      console.debug("[PipelineConvert/Cache/update]: ", this);
    }
  }

  /**
   * Loads raw well data from on chain.
   */
  async loadWellData() {
    const hasRawWellData = !!Object.keys(this.rawWellData).length;

    if (!hasRawWellData) {
      this.rawWellData = await ExchangeWell.loadWells(
        getLPTokens(this.context.chainId).map((pool) => pool.address),
        this.context.wagmiConfig,
      );
      console.debug("[SiloConvertCache/loadWellData]: ", this.rawWellData);
    }

    return this.rawWellData;
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

  getPriceCallStructs(): AdvancedPipeCall[] {
    return [
      encodePrice(this.context.chainId),
      ...Object.values(this.dewhitelistedLP).map((tk) => encodeGetWell(this.context.chainId, tk.address)),
    ];
  }

  decodePriceCallResults(results: HashString[]) {
    // +1 for the price call
    const expectedLength = Object.keys(this.dewhitelistedLP).length + 1;

    if (results.length < expectedLength) {
      throw new Error(`Cannot decode price call results. Expected ${expectedLength} results but got ${results.length}`);
    }

    const [priceData, ...dewhitelistedLPResults] = results;
    const priceResult = decodePriceResult(priceData);

    priceResult.pools = { ...priceResult.pools };

    Object.values(this.dewhitelistedLP).forEach((tk, idx) => {
      const res = decodeGetWell(dewhitelistedLPResults[idx]);
      priceResult.pools[getTokenIndex(tk.address)] = res;
    });

    return priceResult;
  }

  /**
   * Constructs an AdvancedPipeWorkflow for fetching the price data.
   */
  constructPriceAdvPipe(options?: { noTokenPrices?: boolean }) {
    const advPipe = new AdvancedPipeWorkflow(this.context.chainId, this.context.wagmiConfig);

    this.getPriceCallStructs().forEach((callStruct) => {
      advPipe.add(callStruct);
    });

    if (options?.noTokenPrices) {
      return advPipe;
    }

    Object.values(this.lp2Pair).forEach((data) => {
      advPipe.add({
        target: this.context.diamond,
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

  async fetchMulticall() {
    const client = this.context.wagmiConfig.getClient({ chainId: this.context.chainId });
    const tokenMap = getChainTokenMap(this.context.chainId);

    const erroredWells: Set<string> = new Set();

    const calls = this.getMultiCallPriceContracts();

    const { priceCalls, dewhitelistedWellLPCalls, lpPairTokenPriceCalls } = calls;

    const datas = await multicall(client, {
      contracts: [...priceCalls, ...dewhitelistedWellLPCalls, ...lpPairTokenPriceCalls],
      allowFailure: true,
    });

    const [priceData, ...remaining] = datas;
    const dewhitelistedLPData = remaining.slice(0, dewhitelistedWellLPCalls.length) as MulticallReturnType<
      typeof dewhitelistedWellLPCalls,
      true
    >;
    const lpPairTokenPriceData = remaining.slice(dewhitelistedWellLPCalls.length, remaining.length);

    const priceResult = priceData.result;

    if (!priceResult || typeof priceResult !== "object" || !("ps" in priceResult)) {
      throw new Error("[SiloConvertCache/fetchMulticall] Price data error");
    }

    const map: AddressLookup<ExtendedPoolData> = {};

    const dwLPs = Object.values(this.dewhitelistedLP);

    const dwLPData = dewhitelistedLPData
      .map((d, i) => {
        if (d.result && typeof d.result === "object") {
          return d.result;
        }

        console.debug(
          `[SiloConvertCache/fetchMulticall] Error decoding dewhitelisted LP data for ${dwLPs[i]?.address}. Adding to erroredWells set.`,
        );
        const erroredWell = Object.values(this.dewhitelistedLP)[i]?.address;
        erroredWells.add(Object.values(this.dewhitelistedLP)[i]?.address);
        return undefined;
      })
      .filter((d) => d !== undefined);

    const reducedPs = priceResult.ps.reduce<AddressLookup<BasePoolData<Address, bigint>>>((prev, curr) => {
      prev[getTokenIndex(curr.pool)] = {
        ...curr,
        tokens: [curr.tokens[0], curr.tokens[1]] satisfies Address[],
        balances: [curr.balances[0], curr.balances[1]] satisfies bigint[],
      };
      return prev;
    }, {});

    for (const [index, [lpTokenIndex, pairToken]] of Object.entries(this.lp2Pair).entries()) {
      const data = lpPairTokenPriceData[index];
      const result = data.result;

      if (!result || typeof result !== "bigint") {
        continue;
      }

      let poolResult = reducedPs[getTokenIndex(lpTokenIndex)];

      if (!poolResult) {
        const mayPoolResult = dwLPData.find((d) => stringEq(d.pool, lpTokenIndex));
        if (mayPoolResult) {
          poolResult = {
            ...mayPoolResult,
            tokens: [mayPoolResult.tokens[0], mayPoolResult.tokens[1]] satisfies Address[],
            balances: [mayPoolResult.balances[0], mayPoolResult.balances[1]] satisfies bigint[],
          };
        } else {
          erroredWells.add(lpTokenIndex);
          console.debug(
            `[SiloConvertCache/fetchMulticall] No pool result found for ${lpTokenIndex}. Adding to erroredWells set.`,
          );
          continue;
        }
      }

      const wellTokens = poolResult.tokens.map((t) => getChainToken(this.context.chainId, t));
      if (!wellTokens.length) {
        erroredWells.add(lpTokenIndex);
        console.debug(
          `[SiloConvertCache/fetchMulticall] No well tokens found with address: ${lpTokenIndex}. Adding to erroredWells set.`,
        );
        continue;
      }

      const pairPrice = TV.fromBigInt(result, pairToken.decimals);
      const poolPrice = TV.fromBigInt(poolResult.price, 6);

      const pairData = {
        token: pairToken,
        index: wellTokens[0].isMain ? 1 : 0,
        price: pairPrice,
      };

      map[lpTokenIndex] = {
        pool: tokenMap[lpTokenIndex],
        price: TV.fromBigInt(poolResult.price, 6),
        pair: pairData,
        tokens: wellTokens,
        liquidity: TV.fromBigInt(poolResult.liquidity, 6),
        lpUsd: TV.fromBigInt(poolResult.lpUsd, 6),
        lpBdv: TV.fromBigInt(poolResult.lpBdv, 6),
        deltaB: TV.fromBigInt(poolResult.deltaB, 6),
        balances: wellTokens.map((t, i) => TV.fromBigInt(poolResult.balances[i], t.decimals)),
        prices: wellTokens.map((t) => (t.isMain ? poolPrice : pairData.price)),
      };
    }

    if (!dewhitelistedLPData.length || !lpPairTokenPriceData.length) {
      throw new Error("No dewhitelistedLPData or lpPairTokenPriceData found");
    }

    return {
      deltaB: TV.fromBigInt(priceResult.deltaB, 6),
      price: TV.fromBigInt(priceResult.price, 6),
      liquidity: TV.fromBigInt(priceResult.liquidity, 6),
      pools: map,
      erroredWells,
    };
  }

  /**
   * Fetches the relevant pool data from on chain
   */
  async fetch(): Promise<ExtendedPriceResult> {
    console.debug("[SiloConvertCache/fetch] fetching price data...");
    const tokenMap = getChainTokenMap(this.context.chainId);
    const mainToken = MAIN_TOKEN[resolveChainId(this.context.chainId)];

    const advPipe = this.constructPriceAdvPipe();

    const others = await this.fetchMulticall();

    // Fetch price contract data & price oracle data

    const advPipeResult = await advPipe.readStatic();
    const sliceIdx = Object.keys(this.dewhitelistedLP).length + 1;
    const priceFragments = advPipeResult.slice(0, sliceIdx);
    const tokenUsdData = advPipeResult.slice(sliceIdx, advPipeResult.length);

    const priceResult = this.decodePriceCallResults(priceFragments);

    const map: AddressLookup<ExtendedPoolData> = {};

    for (const [index, [lpTokenIndex, pairToken]] of Object.entries(this.lp2Pair).entries()) {
      const pairPriceBigInt = decodeFunctionResult({
        abi: abiSnippets.price.getTokenUsdPrice,
        functionName: "getTokenUsdPrice",
        data: tokenUsdData[index],
      });

      const poolResult = priceResult.pools[lpTokenIndex];
      const wellTokens = poolResult?.tokens.map((t) => getChainToken(this.context.chainId, t));

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

  /**
   *
   * constructs the contracts for the price multicall
   */
  private getMultiCallPriceContracts() {
    const priceAddress = beanstalkPriceAddress[resolveChainId(this.context.chainId)];

    // Put this in an array so TS doesn't complain about the type mismatch when not in an array
    const priceCalls: ContractFunctionParameters<typeof diamondPriceABI, "view", "price">[] = [
      {
        address: priceAddress,
        abi: diamondPriceABI,
        functionName: "price",
        args: [],
      },
    ];
    const dewhitelistedWellLPCalls: ContractFunctionParameters<typeof diamondPriceABI, "view", "getWell">[] =
      Object.values(this.dewhitelistedLP).map((dwlp) => {
        return {
          address: priceAddress,
          abi: diamondPriceABI,
          functionName: "getWell",
          args: [dwlp.address],
        };
      });
    const lpPairTokenPriceCalls = Object.values(this.lp2Pair).map((data) => {
      return {
        address: this.context.diamond,
        abi: diamondABI,
        functionName: "getTokenUsdPrice",
        args: [data.address],
      } as const;
    });

    return {
      priceCalls,
      dewhitelistedWellLPCalls,
      lpPairTokenPriceCalls,
    } as const;
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

function getDewhitelistedLPs(chainId: number) {
  const tokenMap = getChainTokenMap(chainId);

  return Object.entries(tokenMap).reduce<AddressLookup<Token>>((prev, [tokenIndex, token]) => {
    if (token.isLP && !token.isWhitelisted) {
      prev[getTokenIndex(tokenIndex)] = token;
    }
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
