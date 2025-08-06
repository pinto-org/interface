import { Clipboard } from "@/classes/Clipboard";
import { ITTLCache, InMemoryTTLCache } from "@/classes/TTLCache";
import { TV } from "@/classes/TokenValue";
import { diamondABI } from "@/constants/abi/diamondABI";
import { CONVERT_DOWN_PENALTY_RATE_WITH_BUFFER, NO_MAX_CONVERT_AMOUNT } from "@/constants/silo";
import { MAIN_TOKEN, PINTO_WSOL_TOKEN } from "@/constants/tokens";
import encoders from "@/encoders";
import decodeJunctionResult from "@/encoders/junction/decodeJunction";
import { decodeJunctionSub } from "@/encoders/junction/junctionSub";
import { decodeGetMaxAmountIn } from "@/encoders/silo/convert";
import { decodeCalcReserveAtRatioLiquidity } from "@/encoders/well/calcReserveAtRatioLiquidity";
import { decodeGetRemoveLiquidityImbalanceIn } from "@/encoders/well/getRemoveLiquidityImbalancedIn";
import { AdvancedFarmWorkflow, AdvancedPipeWorkflow } from "@/lib/farm/workflow";
import { SiloConvertPriceCache } from "@/lib/siloConvert/SiloConvert.cache";
import { SiloConvertContext } from "@/lib/siloConvert/types";
import { ExchangeWell, ExtendedRawWellData } from "@/lib/well/ExchangeWell";
import { resolveChainId } from "@/utils/chain";
import { pickCratesMultiple } from "@/utils/convert";
import { tokensEqual } from "@/utils/token";
import { DepositData, Token } from "@/utils/types";
import { HashString } from "@/utils/types.generic";
import { readContract } from "viem/actions";
import { DefaultConvertStrategy } from "./strategies/implementations/DefaultConvertStrategy";
import { SiloConvertLP2MainPipelineConvertStrategy } from "./strategies/implementations/LP2MainPipelineConvertStrategy";
import { ErrorHandlerFactory } from "./strategies/validation/ErrorHandlerFactory";
import { MaxConvertQuotationError } from "./strategies/validation/SiloConvertErrors";

interface ConvertTokens {
  source: Token;
  target: Token;
}

/**
 * Scaling down min threshold for stable swap wells.
 *
 * Due to the nature of stable swap & it's usage of the lookup table, the amounts we recieve from the contract
 * can be off by a certain amount.
 *
 * This is a temporary fix to ensure we don't run into issues with small amounts.
 */
const MIN_THRESHOLD = 150;

/**
 * SiloConvertMaxConvertQuoter
 *
 * Architecture notes:
 *
 * The SiloConvertMaxConvertQuoter is responsible for calculating the maximum convertible
 * amount between any two tokens in the Silo. It handles both:
 * 1. LP ↔ Main token conversions (default converts)
 * 2. LP ↔ LP conversions (pipeline converts)
 *
 * [Max Convert Calculation Strategy]
 * For default converts (LP ↔ Main token), the quoter uses a jump algorithm to find
 * the maximum safe conversion amount that maintains system stability.
 *
 * For LP ↔ LP converts, the quoter must consider:
 * - The ΔP (delta B) of both source and target wells
 * - Available liquidity in both wells
 * - Strategy-specific constraints (SSMT, SSPT, EQ2EQ)
 *
 * [Scalar Caching]
 * The quoter implements caching for scalar values to avoid redundant calculations.
 * The cache tracks:
 * - Hit/miss ratios for performance monitoring
 * - Staleness detection for cache invalidation
 *
 */

export interface MaxConvertResult {
  max: TV;
  maxAtRate: TV | undefined;
}

export class SiloConvertMaxConvertQuoter {
  private readonly context: SiloConvertContext;
  private readonly cache: SiloConvertPriceCache;
  private readonly scalarCache: ITTLCache<number>;
  private readonly maxConvertCache: ITTLCache<MaxConvertResult>;

  // ---------- Constructor ----------

  constructor(
    context: SiloConvertContext,
    cache: SiloConvertPriceCache,
    scalarCache?: ITTLCache<number>,
    maxConvertCache?: ITTLCache<MaxConvertResult>,
  ) {
    this.context = context;
    this.cache = cache;
    this.scalarCache = scalarCache || new InMemoryTTLCache<number>();
    this.maxConvertCache = maxConvertCache || new InMemoryTTLCache<MaxConvertResult>();
  }

  // ===================================================================
  // ------------------------- Public Methods --------------------------
  // ===================================================================

  /**
   * Checks if the token has a pair token that is one we disallow being swapped via the swap aggregator.
   * If true, we have no choice but to withdraw & add liquidity as single-sided BEAN.
   */
  isAggDisabledToken(token: Token) {
    const PINTOWSOL = PINTO_WSOL_TOKEN[resolveChainId(this.context.chainId)];
    return tokensEqual(token, PINTOWSOL);
  }

  /**
   * Clears both the scalars cache and max convert cache.
   */
  clear() {
    this.scalarCache.clear();
    this.maxConvertCache.clear();
  }

  /**
   * Get scalar cache metrics for monitoring
   */
  getScalarCacheMetrics() {
    return {
      scalar: this.scalarCache.getMetrics(),
      maxConvert: this.maxConvertCache.getMetrics(),
    };
  }

  /**
   * Given a source & target token, returns the max convert amount.
   * If farmerDeposits are provided, it will return a tested scaled max convert.
   * Results are cached for 15 seconds to avoid duplicate expensive calculations.
   */
  async quoteMaxConvert(
    source: Token,
    target: Token,
    farmerDeposits: DepositData[] | undefined = undefined,
  ): Promise<MaxConvertResult> {
    const errorHandler = ErrorHandlerFactory.createMaxConvertQuoterHandler(source, target);

    return errorHandler.wrapAsync(async () => {
      // Basic validation
      errorHandler.assert(!!source && !!target, "Missing source or target token");
      errorHandler.assert(!tokensEqual(source, target), "Cannot convert token to itself");

      // Generate cache keys
      const tokensCacheKey = errorHandler.wrapCache(
        () => this.maxConvertCache.generateKey([source.address, target.address]),
        "generate base cache key",
        `${source.address}-${target.address}`, // fallback
      );

      const depositsHash = hashDeposits(farmerDeposits);
      const withDepositsKey =
        farmerDeposits?.length && depositsHash
          ? this.maxConvertCache.generateKey(tokensCacheKey, depositsHash)
          : undefined;

      // Check cache first
      const cached = this.maxConvertCache.get(withDepositsKey ?? tokensCacheKey);

      // If cached, return the result first
      if (cached) {
        console.debug("[MaxConvertQuoter/quoteMaxConvert]: using cached result", {
          source: source.symbol,
          target: target.symbol,
          cached: cached.max.toHuman(),
          cachedAtRate: cached.maxAtRate?.toHuman(),
          cacheMetrics: this.maxConvertCache.getMetrics(),
        });
        return cached;
      }

      // Cache miss
      const results: MaxConvertResult = {
        max: TV.ZERO,
        maxAtRate: undefined,
      };

      if (source.isMain || target.isMain) {
        const [res, resAtRate] = await Promise.all([
          this.getDefaultConvertMaxConvert({ source, target }, farmerDeposits),
          this.getMaxAmountInAtRate(source, target),
        ]);
        results.max = res;
        results.maxAtRate = resAtRate;
      } else if (source.isLP && target.isLP) {
        results.max = await this.getMaxConvertLPToLP({ source, target });
      } else {
        errorHandler.validateConversionTokens("default", source, target); // This will throw appropriate error
        throw new Error("Unreachable: validation should have thrown");
      }

      // Cache the result
      if (withDepositsKey) {
        this.maxConvertCache.set(withDepositsKey, results);
      }
      // Store the result in the tokens cache Key as well
      this.maxConvertCache.set(tokensCacheKey, results);

      console.debug("[MaxConvertQuoter/quoteMaxConvert]: calculated and cached result", {
        source: source.symbol,
        target: target.symbol,
        max: results.max.toHuman(),
        maxAtRate: results.maxAtRate?.toHuman(),
        cacheMetrics: this.maxConvertCache.getMetrics(),
      });

      return results;
    }, "quote max convert");
  }

  /**
   * Returns the maximum amount that can be converted of `source` to `target` such that the price after the convert is equal to the rate.
   * @param source - The source token
   * @param target - The target token
   * @param rate - The rate to use
   *
   * @note Only supported for BEAN -> LP Token (as it is the only case where applicable).
   */
  async getMaxAmountInAtRate(
    source: Token,
    target: Token,
    rate: TV = CONVERT_DOWN_PENALTY_RATE_WITH_BUFFER,
  ): Promise<TV | undefined> {
    const errorHandler = ErrorHandlerFactory.createMaxConvertQuoterHandler(source, target);

    return errorHandler.wrapAsync(async () => {
      // Validate Inputs

      // Contract will throw if source !== BEAN || target !== LP
      if (!source.isMain || !target.isLP) {
        return undefined;
      }

      // Get max amount in at rate
      const maxAmountInAtRate = await readContract(
        this.context.wagmiConfig.getClient({ chainId: this.context.chainId }),
        {
          abi: diamondABI,
          address: this.context.diamond,
          functionName: "getMaxAmountInAtRate" as const,
          args: [source.address, target.address, rate.toBigInt()] as const,
        },
      );

      return TV.fromBigInt(maxAmountInAtRate, source.decimals);
    }, "Quote max convert at rate");
  }

  // ===================================================================
  // ------------------------- Default Convert -------------------------
  // ===================================================================

  /**
   * Gets the max convert from the source to the target.
   * @throws MaxConvertQuotationError if calculation fails
   * @throws InvalidConversionTokensError if tokens are invalid for default convert
   */
  private async getDefaultConvertMaxConvert(convertTokens: ConvertTokens, farmerDeposits?: DepositData[]): Promise<TV> {
    const { source, target } = convertTokens;
    const errorHandler = ErrorHandlerFactory.createMaxConvertQuoterHandler(source, target);

    return errorHandler.wrapAsync(async () => {
      // Validate conversion tokens
      errorHandler.validateConversionTokens("default", source, target);

      const lpToken = source.isMain ? target : source;
      errorHandler.assertDefined(lpToken, "LP token must be defined for default convert");

      // Get raw well data and update cache in parallel
      const [rawWellData] = await Promise.all([
        errorHandler.wrapAsync(() => this.cache.getRawWellData(lpToken.address), "get raw well data", {
          lpTokenAddress: lpToken.address,
        }),
        errorHandler.wrapAsync(() => this.cache.update(), "update cache"),
      ]);

      // Get max amount from contract
      const client = this.context.wagmiConfig.getClient({ chainId: this.context.chainId });
      errorHandler.assertDefined(client, `No wagmi client available for chain ID: ${this.context.chainId}`);

      const maxAmountIn = await errorHandler.wrapAsync(
        () =>
          readContract(client, {
            abi: diamondABI,
            address: this.context.diamond,
            functionName: "getMaxAmountIn" as const,
            args: [source.address, target.address] as const,
          }),
        "read max amount from contract",
        {
          diamond: this.context.diamond,
          chainId: this.context.chainId,
        },
      );

      // Validate contract response
      errorHandler.validateContractResponse(maxAmountIn, "getMaxAmountIn");

      // Scale the max amount
      const { scaledAmountIn, scalingReason } = errorHandler.wrap(
        () =>
          this.scaleDefaultConvertMaxAmountIn(convertTokens, TV.fromBigInt(maxAmountIn, source.decimals), rawWellData),
        "scale max amount",
        {
          maxAmountIn: maxAmountIn.toString(),
          sourceDecimals: source.decimals,
        },
      );

      console.debug("[MaxConvertQuoter/getDefaultConvertMaxConvert]: ", {
        source: source.symbol,
        target: target.symbol,
        maxConvertResult: maxAmountIn.toString(),
        scaledAmountIn: scaledAmountIn.toHuman(),
        scalingReason,
      });

      // If farmer deposits are provided, find safe max convert
      if (farmerDeposits) {
        return await this.findSafeDefaultMaxConvert(convertTokens, scaledAmountIn, farmerDeposits);
      }

      return scaledAmountIn;
    }, "get default convert max convert");
  }

  /**
   * Quotes the maximum convert from the source to the target.
   * Sometimes the maximum convert is quoted higher than what is allowed, so we find the highest scalar that doesn't revert.
   *
   * Implements a jump algorithm where it will try 100% first, scalars[0]
   * If that fails, it will iteratively:
   *    - try scalars[i + 1]
   *    - if failure, continue
   *    - try scalars[i]
   *       - if success, return scalars[i], otherwise return scalars[i+1]
   *
   * @returns The max convert that doesn't revert.
   */
  private async findSafeDefaultMaxConvert(
    tokens: ConvertTokens,
    maxConvert: TV,
    farmerDeposits: DepositData[],
  ): Promise<TV> {
    const { source, target } = tokens;
    const errorHandler = ErrorHandlerFactory.createMaxConvertQuoterHandler(source, target);

    return errorHandler.wrapAsync(async () => {
      // Validate inputs
      errorHandler.validateConversionTokens("default", source, target);
      errorHandler.validateAmount(maxConvert, "max convert amount");
      errorHandler.assert(!!farmerDeposits, "Farmer deposits are required");

      // Calculate farmer available amount
      const farmerAvailableAmount = errorHandler.wrap(
        () =>
          farmerDeposits.reduce((prev, curr) => {
            if (!curr?.amount) {
              throw new Error(`Invalid deposit data: missing amount for deposit ${curr?.idHex || "unknown"}`);
            }
            return prev.add(curr.amount);
          }, TV.ZERO),
        "calculate farmer available amount",
        { depositsCount: farmerDeposits.length },
      );

      // Early returns for simple cases
      if (farmerDeposits.length === 0 || farmerAvailableAmount.isZero) {
        console.debug("[MaxConvertQuoter/findSafeDefaultMaxConvert]: no farmer deposits or zero amount", {
          depositsCount: farmerDeposits.length,
          farmerAvailableAmount: farmerAvailableAmount.toHuman(),
        });
        return maxConvert;
      }

      if (farmerAvailableAmount.lt(maxConvert)) {
        console.debug("[MaxConvertQuoter/findSafeDefaultMaxConvert]: convertible amount < than max convert", {
          maxConvert: maxConvert.toHuman(),
          farmerAvailableAmount: farmerAvailableAmount.toHuman(),
        });
        return maxConvert;
      }

      // Check cache first
      const cacheKey = errorHandler.wrapCache(
        () => this.generateTokensCacheKey(source, target),
        "generate cache key",
        `${source.address}-${target.address}`, // fallback
      );

      const cachedScalar = errorHandler.wrapCache(
        () => this.scalarCache.get(cacheKey),
        "read cached scalar",
        undefined, // fallback - cache miss
      );

      if (cachedScalar !== undefined && !Number.isNaN(cachedScalar) && cachedScalar > 0) {
        console.debug("[MaxConvertQuoter/findSafeDefaultMaxConvert]: using cached scalar", {
          cachedScalar,
          cacheMetrics: this.scalarCache.getMetrics(),
        });
        return maxConvert.mul(cachedScalar);
      }

      // Compute optimal scalar using jump algorithm
      const optimalScalar = await this.computeOptimalScalar(tokens, maxConvert, farmerDeposits);

      // Validate optimal scalar
      errorHandler.validateScalar(optimalScalar, "optimal scalar");

      // Cache the result
      errorHandler.wrapCache(
        () => this.scalarCache.set(cacheKey, optimalScalar),
        "cache optimal scalar",
        undefined, // non-fatal if cache write fails
      );

      const result = maxConvert.mul(optimalScalar);
      errorHandler.validateAmount(result, "final result");

      return result;
    }, "find safe default max convert");
  }

  /**
   * Tests a default convert scalar w/ the Farmer's deposits using both direct and pipeline convert strategies.
   *
   * @returns The scaled maxAmountIn if it doesn't revert, otherwise undefined.
   */
  private async testDefaultConvertScalar(
    { source, target }: ConvertTokens,
    farmerDeposits: DepositData[],
    workflow: AdvancedFarmWorkflow,
    maxAmountIn: TV,
    scalar: number,
  ) {
    // Validation is handled by calling method

    const scaledMaxAmountIn = maxAmountIn.mul(scalar);
    const crates = pickCratesMultiple(farmerDeposits, "bdv", "asc", [scaledMaxAmountIn]);

    // Test 1: Try DefaultConvertStrategy (direct silo convert)
    workflow.clear();
    let amount: TV | undefined;

    try {
      const defaultStrategy = new DefaultConvertStrategy(source, target, this.context);
      await defaultStrategy.quote(crates[0], workflow, 0.5);
      await workflow.simulate({ account: this.context.account });
      amount = scaledMaxAmountIn;

      console.debug(
        `[MaxConvertQuoter/testDefaultConvertScalar]: scalar ${scalar} succeeded with DefaultConvertStrategy`,
        {
          amount,
          maxAmountIn,
          scalar,
          strategy: "DefaultConvert",
        },
      );

      return amount;
    } catch (_e) {
      // Default strategy failed, try pipeline strategy
    }

    // Test 2: Try LP2MainPipeline strategy (pipeline convert via 0x routing)
    // Only try pipeline if source is LP, target is main, and aggregator is not disabled
    if (source.isLP && target.isMain && !this.isAggDisabledToken(source)) {
      workflow.clear();

      try {
        const sourceWell = this.cache.getWell(source.address);
        const pipelineStrategy = new SiloConvertLP2MainPipelineConvertStrategy(sourceWell, target, this.context);

        await pipelineStrategy.quote(crates[0], workflow, 0.5);
        await workflow.simulate({ account: this.context.account });
        amount = scaledMaxAmountIn;

        console.debug(`[MaxConvertQuoter/testDefaultConvertScalar]: scalar ${scalar} succeeded with LP2MainPipeline`, {
          amount,
          maxAmountIn,
          scalar,
          strategy: "LP2MainPipeline",
        });

        return amount;
      } catch (_e) {
        // Pipeline strategy also failed
      }
    }

    console.debug(`[MaxConvertQuoter/testDefaultConvertScalar]: scalar ${scalar} failed with all strategies`, {
      amount: undefined,
      maxAmountIn,
      scalar,
    });

    return undefined;
  }

  /**
   * Scales down the max amount in if needed.
   * The number returned by getMaxAmountIn is too high, so we scale the result down.
   */
  private scaleDefaultConvertMaxAmountIn({ source, target }: ConvertTokens, max: TV, rawWellData: ExtendedRawWellData) {
    // Validation is handled by calling method

    const lpToken = source.isMain ? target : source;
    const scalingReason: string[] = [];

    let scaledAmountIn = max;

    // Scale down the result if the well is a stable2 well & we converting from the main token.
    // This is because the maxAmountIn() returns a value that is too high.
    // Converting to the main token from a stableswap well doesn't need to be scaled down.
    if (rawWellData.wellFunctionType === "stable2" && source.isMain) {
      // We for some reason run into issues with small amounts, so just return 0 below min threshold.
      if (max.lt(MIN_THRESHOLD)) {
        return {
          scaledAmountIn: TV.fromHuman("0", source.decimals),
          scalingReason: ["stable2", "below-min-threshold"],
        };
      }

      const threshold = STABLE_SCALE_DOWN_THRESHOLDS.find((t) => max.gte(t.threshold));

      // type check
      if (!threshold) throw new Error("Convert Router: No threshold found for max convert");

      scalingReason.push("stable2");
      scaledAmountIn = max.mul(threshold.scale);
    }

    // Scale down the result if we are constrained by the overall ΔP.
    const overallDeltaB = this.cache.getDeltaB();
    const wellDeltaB = this.cache.getWell(lpToken.address).deltaB;

    // If we are constrained by the overall ΔP, we need to scale down the result
    const overallDeltaBConstrained = overallDeltaB.abs().lt(wellDeltaB.abs());
    if (overallDeltaBConstrained) {
      const ratio = overallDeltaB.abs().div(wellDeltaB.abs());
      const scaled = scaledAmountIn.mul(ratio);
      scaledAmountIn = scaled.mul(0.99);
      scalingReason.push("overall-ΔP-constrained");
    }

    return { scaledAmountIn, scalingReason };
  }

  // ===================================================================
  // ------------------------- LP<>LP Converts -------------------------
  // ===================================================================

  /**
   * Gets the max convert from a LP to another LP.
   *
   * @throws Error if the source or target is not a LP token.
   */
  private async getMaxConvertLPToLP({ source, target }: ConvertTokens) {
    // Validation is handled by calling method

    await this.cache.update();

    // If aggregator is disabled for either token, use single-sided main token strategy
    if (this.isAggDisabledToken(source) || this.isAggDisabledToken(target)) {
      return this.getSingleSidedMainTokenMaxConvert({ source, target });
    }

    // For LP2LP conversions, we should test actual conversion strategies instead of
    // returning the hardcoded NO_MAX_CONVERT_AMOUNT. The previous assumption that
    // "we can always convert LP<>LP in equal proportions" is incorrect - we need to
    // account for actual liquidity constraints and strategy limitations.

    // Try to get a reasonable max based on available liquidity and strategy constraints
    // For now, return zero to indicate no reliable max can be determined without testing
    // This will force the system to use actual conversion quotes instead of relying on
    // potentially incorrect maximum values
    console.debug(
      "[MaxConvertQuoter/getMaxConvertLPToLP]: LP2LP conversion - returning 0 to force quote-based validation",
      {
        source: source.symbol,
        target: target.symbol,
        reason: "LP2LP conversions require strategy-specific testing",
      },
    );

    return TV.ZERO;
  }

  /**
   * Gets the max convert from a single sided pair token to another single sided pair token.
   *
   * Example: PINTOWETH -> PINTOcbETH. We quote remove single sided WETH & add single sided cbETH
   *
   * @throws Error if the source or target is not a single sided pair token.
   */
  async getSingleSidedPairTokenMaxConvert({ source, target }: ConvertTokens): Promise<TV> {
    // Validation is handled by calling method

    const sourceWell = this.cache.getWell(source.address);
    const targetWell = this.cache.getWell(target.address);

    // Find the Well with the smaller absolute value of deltaP.
    // The amount we can convert single sided is limited by this well.
    const restrictiveWell = sourceWell.deltaB.abs().gt(targetWell.deltaB.abs()) ? targetWell : sourceWell;
    const sourceIsRestrictive = restrictiveWell === sourceWell;

    // obtain the ideal well reserve ratios for the restrictive well
    const ratios = ExchangeWell.getRatiosJ(restrictiveWell.tokens, restrictiveWell.prices);

    // Get the raw well data for the restrictive well.
    const rawWellData = await this.cache.getRawWellData(restrictiveWell.pool.address);

    const pipe = new AdvancedPipeWorkflow(this.context.chainId, this.context.wagmiConfig);

    // 1. Calculate the reserves at the ideal ratios.
    pipe.add(
      encoders.well.calcReserveAtRatioLiquidity(
        rawWellData.wellFunction.target,
        restrictiveWell.balances,
        1,
        ratios,
        rawWellData.wellFunction.data,
      ),
    );
    // 2. Subtract the reserves at the ideal ratios from the current reserves to get the amount of single sided liquidity we can remove.
    pipe.add(
      encoders.junction.sub(
        restrictiveWell.balances[1].toBigInt(),
        restrictiveWell.balances[1].toBigInt(),
        Clipboard.encodeSlot(0, 0, sourceIsRestrictive ? 1 : 0),
      ),
    );

    // 3.a. If the source well is the restrictive well,
    if (sourceIsRestrictive) {
      // get the amount of LP tokens we can remove based on the imbalance in the source well from step 2.
      pipe.add(
        encoders.well.getRemoveLiquidityImbalancedIn(
          restrictiveWell.pool.address,
          [0n, 0n],
          Clipboard.encodeSlot(1, 0, 3),
        ),
      );
    }
    // 3b. If the target well is the restrictive Well
    else {
      // get the amount of LP tokens we will receive for adding the single sided liquidity from step 2.
      // scale up to to 18 decimals for max precision
      pipe.add(
        encoders.junction.mul(0n, BigInt(10 ** (18 - targetWell.pair.token.decimals)), Clipboard.encodeSlot(1, 0, 0)),
      );
      // 4. (targetPairTokenAmount * targetPairTokenUSD) / sourcePairTokenUSD
      // scale all numbers to 18 decimals for max precision
      pipe.add(
        encoders.junction.mulDiv(
          0n,
          targetWell.pair.price.reDecimal(18).toBigInt(),
          sourceWell.pair.price.reDecimal(18).toBigInt(),
          Clipboard.encodeSlot(2, 0, 0),
        ),
      );
      // 5. scale down to the source well pair token decimals
      pipe.add(
        encoders.junction.div(0n, BigInt(10 ** (18 - sourceWell.pair.token.decimals)), Clipboard.encodeSlot(3, 0, 0)),
      );
      // 6. calculate the equivalent amount of the source well pair token we will be removing in LP token terms.
      pipe.add(
        encoders.well.getRemoveLiquidityImbalancedIn(sourceWell.pool.address, [0n, 0n], Clipboard.encodeSlot(4, 0, 3)),
      );
    }

    const result = await pipe.readStatic();

    if (!result.length) {
      throw new Error("Failed to fetch max convert");
    }

    return this.decodeSingleSidedPairAdvPipeResult({ source, target }, sourceIsRestrictive, result);
  }

  /**
   * Gets the max convert LP<>LP via a single-sided LP remove / add liquidity strategy.
   *
   * @returns MaxConvertSummary
   */
  async getSingleSidedMainTokenMaxConvert({ source, target }: ConvertTokens): Promise<TV> {
    // Validation is handled by calling method

    const mainToken = MAIN_TOKEN[resolveChainId(this.context.chainId)];

    const pipe = new AdvancedPipeWorkflow(this.context.chainId, this.context.wagmiConfig);

    // 1. max convertible Source LP -> BEAN
    pipe.add({
      ...encoders.silo.getMaxAmountIn(source.address, mainToken.address),
      target: this.context.diamond,
    });

    // 2.max convertible BEAN -> Target LP
    pipe.add({
      ...encoders.silo.getMaxAmountIn(mainToken.address, target.address),
      target: this.context.diamond,
    });

    // 3. max convertible Source LP -> BEAN from step 2.
    // The amount we can max targetLP convert in terms of the source LP token
    pipe.add({
      ...encoders.well.getRemoveLiquidityImbalancedIn(source.address, [0n, 0n], Clipboard.encodeSlot(1, 0, 2)),
      target: source.address,
    });

    const rawResult = await pipe.readStatic();

    const maxSource2Main = TV.fromBigInt(decodeGetMaxAmountIn(rawResult[0]), source.decimals);
    const maxMain2Target = TV.fromBigInt(decodeGetMaxAmountIn(rawResult[1]), mainToken.decimals);
    const maxSource2MainFromTarget = TV.fromBigInt(decodeGetRemoveLiquidityImbalanceIn(rawResult[2]), source.decimals);

    const maxSourceLPIn = TV.min(maxSource2Main, maxSource2MainFromTarget);

    console.debug("[Convert/getSingleSidedMainTokenMaxConvert]: ", {
      maxSource2Main,
      maxMain2Target,
      maxSource2MainFromTarget,
      max: maxSourceLPIn,
    });

    return maxSourceLPIn;
  }

  // ===================================================================
  // ------------------------- Utility methods -------------------------
  // ===================================================================

  private decodeSingleSidedPairAdvPipeResult(
    { source, target }: ConvertTokens,
    sourceIsRestrictive: boolean,
    result: HashString[],
  ) {
    if (result.length !== 3 && result.length !== 6) {
      throw new Error("Convert Router: Invalid result length");
    }

    // index 0
    const calcReserveAtRatioLiquidity = decodeCalcReserveAtRatioLiquidity(result[0]);
    // index 1
    const deltaReserves = decodeJunctionSub(result[1]);
    // index 2 | 5
    const maxSourceLP = TV.fromBigInt(decodeGetRemoveLiquidityImbalanceIn(result[result.length - 1]), source.decimals);

    let debugData: Record<string, unknown> = {
      source,
      target,
      sourceIsRestrictive,
      "1deltaReserves": deltaReserves,
    };

    if (sourceIsRestrictive) {
      debugData = {
        ...debugData,
        "2maxSourceLP": maxSourceLP.toBigInt(),
        "00currReserves": [
          this.cache.getWell(source.address).balances[0].toBigInt(),
          this.cache.getWell(source.address).balances[1].toBigInt(),
        ],
        "0idealLPReserves": [this.cache.getWell(source.address).balances[0].toBigInt(), calcReserveAtRatioLiquidity],
      };
    } else {
      debugData = {
        ...debugData,
        "00currReserves": [
          this.cache.getWell(target.address).balances[0].toBigInt(),
          this.cache.getWell(target.address).balances[1].toBigInt(),
        ],
        "0idealLPReserves": [this.cache.getWell(target.address).balances[0].toBigInt(), calcReserveAtRatioLiquidity],
        "3reserveDiffScaledUp": decodeJunctionResult("mul", result[2]),
        "4sourcePairTokenAmountScaled": decodeJunctionResult("mulDiv", result[3]),
        "5sourcePairTokenAmount": decodeJunctionResult("div", result[4]),
        "6maxSourceLP": maxSourceLP.toBigInt(),
      };
    }

    console.debug("[Convert/decodeSingleSidedPairAdvPipeResult]: ", debugData);

    return maxSourceLP;
  }

  /**
   * Computes the optimal scalar using a jump algorithm to find the highest
   * scalar that doesn't cause the conversion to revert.
   */
  private async computeOptimalScalar(
    tokens: ConvertTokens,
    maxConvert: TV,
    farmerDeposits: DepositData[],
  ): Promise<number> {
    const scalars = SCALE_DOWN_SCALARS;
    const workflow = new AdvancedFarmWorkflow(this.context.chainId, this.context.wagmiConfig);

    // try scalar[0] 100% first.
    const res = await this.testDefaultConvertScalar(tokens, farmerDeposits, workflow, maxConvert, scalars[0]).catch(
      (e) => {
        throw new MaxConvertQuotationError(tokens.source, tokens.target, "Failed to test default convert scalar", {
          maxConvert,
          error: e,
        });
      },
    );
    if (res) {
      return scalars[0];
    }

    // we start at index 1 b/c we know that 100% will fail.
    const startIndex = 1;
    const jumpAmount = 2;

    // Jump in pairs: for each odd index, try the previous one.
    // For example, try index 3. If it works, then test index 2.
    for (let i = startIndex; i < scalars.length - 1; i += jumpAmount) {
      const jIndex = i + 1;
      const jInBounds = jIndex <= scalars.length - 1;

      const jScalar = scalars[jIndex];
      const iScalar = scalars[i];

      let jMax: TV | undefined = undefined;

      // Try scalar[jIndex] if in bounds.
      if (jInBounds) {
        jMax = await this.testDefaultConvertScalar(tokens, farmerDeposits, workflow, maxConvert, jScalar);
      }

      // If it failed, continue.
      if (!jMax && jInBounds) continue;

      // Try scalar[i]
      const iMax = await this.testDefaultConvertScalar(tokens, farmerDeposits, workflow, maxConvert, iScalar);
      // If iMax is defined, return iScalar.
      if (iMax) {
        return iScalar;
      }
      // if jMax is defined, return jScalar.
      if (jMax) {
        return jScalar;
      }
    }

    // Everything fails, return the most conservative scalar
    return scalars[scalars.length - 1];
  }

  private generateTokensCacheKey(source: Token, target: Token, depositsData?: DepositData[]): string {
    const depositsKey = depositsData ? depositsData.map((d) => d.idHex.substring(0, 8)).join("-") : undefined;
    return this.maxConvertCache.generateKey([source.address, target.address], depositsKey ?? "");
  }
}

// Helper Methods

// Note: baseErrMessage is no longer used - error handling is now done via MaxConvertQuoterErrorHandler

const hashDeposits = (deposits: DepositData[] | undefined): string => {
  return deposits?.map((d) => d.idHex.substring(0, 8)).join("-") ?? "";
};

// Note: validateConversionTokens is now handled by MaxConvertQuoterErrorHandler.validateConversionTokens()

// total of 15 scalars
const SCALE_DOWN_SCALARS: number[] = [
  1, // 100%
  0.99999, // 99.999%
  0.9999, // 99.99%
  0.99975, // 99.975%
  0.9995, // 99.95%
  0.99925, // 99.925%
  0.999, // 99.90%
  0.9975, // 99.75%
  0.995, // 99.5%
  0.99, // 99%
  0.95, // 95%
  0.9, // 90%
  0.75, // 75%
  0.5, // 50%
  0.25, // 25%
  0.1, // 10%
] as const;

/**
 * Lookup table for scaling down the max amount in for stable swap wells.
 *
 * @note These scalars are approximate as they were found experimentally & may need greater precision.
 */
const STABLE_SCALE_DOWN_THRESHOLDS: { threshold: number; scale: number }[] = [
  { threshold: 100_000, scale: 0.999 },
  { threshold: 75_000, scale: 0.998 },
  { threshold: 50_000, scale: 0.997 },
  { threshold: 25_000, scale: 0.996 },
  { threshold: 10_000, scale: 0.995 },
  { threshold: 5_000, scale: 0.99 },
  { threshold: 2_500, scale: 0.97 },
  { threshold: 1_750, scale: 0.95 },
  { threshold: 1_000, scale: 0.925 },
  { threshold: 750, scale: 0.9 },
  { threshold: 500, scale: 0.875 },
  { threshold: 250, scale: 0.7 },
  { threshold: MIN_THRESHOLD, scale: 0.5 },
] as const;
