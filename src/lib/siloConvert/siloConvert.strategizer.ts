import { TV } from "@/classes/TokenValue";
import { CONVERT_DOWN_PENALTY_RATE } from "@/constants/silo";
import { FarmToMode, Token } from "@/utils/types";
import { Prettify } from "@/utils/types.generic";
import { exists } from "@/utils/utils";
import { SiloConvertQuoteOptions } from "./SiloConvert";
import { ExtendedPoolData, SiloConvertPriceCache } from "./SiloConvert.cache";
import { SiloConvertMaxConvertQuoter } from "./SiloConvert.maxConvertQuoter";
import { SiloConvertStrategy } from "./strategies/core";
import { SiloConvertType } from "./strategies/core/types";
import {
  DefaultConvertStrategy,
  SiloConvertLP2LPEq2EqStrategy as LP2LPEq2Eq,
  SiloConvertLP2LPSingleSidedMainTokenStrategy as LP2LPSingleSidedMain,
  SiloConvertLP2LPSingleSidedPairTokenStrategy as LP2LPSingleSidedPair,
  SiloConvertLP2MainPipelineConvertStrategy as LP2MainPipeline,
  SiloConvertLP2MainWithdrawPairStrategy as LP2MainWithdrawPair,
  SiloConvertMain2LPDepositPairStrategy as Main2LPDepositPair,
} from "./strategies/implementations";
import { ErrorHandlerFactory } from "./strategies/validation/ErrorHandlerFactory";
import {
  CacheError,
  MaxConvertQuotationError,
  StrategySelectionError,
} from "./strategies/validation/SiloConvertErrors";
import { SiloConvertContext } from "./types";

interface StrategyWithAmount<T extends SiloConvertType> {
  strategy: SiloConvertStrategy<T>;
  amount: TV;
}

export interface SiloConvertRoute<T extends SiloConvertType> {
  source: Token;
  target: Token;
  strategies: Prettify<StrategyWithAmount<T>>[];
  convertType: T;
}
/**
 * SiloConvertStrategizer
 *
 * Architecture notes:
 *
 * The Strategizer is the brain of the conversion system, responsible for:
 * 1. Analyzing market conditions and token relationships
 * 2. Selecting optimal conversion strategies based on ΔP analysis
 * 3. Determining conversion amounts and route selection
 *
 * [Strategy Selection Logic]
 * The strategizer uses the following decision matrix for LP ↔ LP conversions:
 * - If ΔP(source) > 0 & ΔP(target) < 0: Use Single-Sided Pair Token (SSPT) strategy
 * - If ΔP(source) < 0 & ΔP(target) > 0: Use Single-Sided Main Token (SSMT) strategy
 * - If ΔP(source) & ΔP(target) have same sign: Use Equal-to-Equal (EQ2EQ) strategy
 *
 * [Route Optimization]
 * When the requested amount exceeds the maximum safe amount for a preferred strategy,
 * the strategizer automatically splits the conversion into multiple routes:
 * 1. Maximum amount via the optimal strategy (SSPT/SSMT)
 * 2. Remainder via the fallback strategy (EQ2EQ)
 *
 */
export class Strategizer {
  constructor(
    private readonly context: SiloConvertContext,
    private readonly cache: SiloConvertPriceCache,
    private readonly maxConvertQuoter: SiloConvertMaxConvertQuoter,
  ) {}

  static MIN_DELTA_B = 100;

  async strategize(
    source: Token,
    target: Token,
    amountIn: TV,
    options: SiloConvertQuoteOptions,
  ): Promise<SiloConvertRoute<SiloConvertType>[]> {
    const eh = ErrorHandlerFactory.createStrategizerHandler(source, target);

    return eh.wrapAsync(async () => {
      await eh.wrapAsync(async () => this.cache.update(), "strategize_cache_update", {
        source: source.symbol,
        target: target.symbol,
        amountIn: amountIn.toHuman(),
      });

      const isLP2LP = source.isLP && target.isLP;

      if (options.isPairWithdrawal) {
        return this.strategizeLP2MainWithdrawPair(source, target, amountIn);
      }

      if (!isLP2LP) {
        return this.strategizeLPAndMain(source, target, amountIn, options);
      }

      return this.strategizeLP2LP(source, target, amountIn);
    }, "strategize");
  }

  /**
   * LP<>Main conversion
   * @param source
   * @param target
   * @param amountIn
   * @returns
   */
  async strategizeLPAndMain(
    source: Token,
    target: Token,
    amountIn: TV,
    options: SiloConvertQuoteOptions = {},
  ): Promise<SiloConvertRoute<SiloConvertType>[]> {
    const eh = ErrorHandlerFactory.createStrategizerHandler(source, target);

    return eh.wrapAsync(async () => {
      await eh.wrapAsync(async () => this.cache.update(), "strategizeLPAndMain_cache_update", {
        source: source.symbol,
        target: target.symbol,
        amountIn: amountIn.toHuman(),
      });

      eh.validateConversionTokens("default", source, target);

      if (source.isMain && target.isLP) {
        // If user provided secondaryAmount and fromMode, only return the Main2LPDeposit route
        if (options.secondaryAmount?.gt(0) && exists(options.fromMode)) {
          return this.strategizeMain2LPDeposit(source, target, amountIn, options);
        }
        // Otherwise, use the original down convert behavior
        return this.strategizeLPAndMainDownConvert(source, target, amountIn);
      }

      // Only options for source and target are LP<>Main.
      const defaultRoute: SiloConvertRoute<SiloConvertType> = {
        source,
        target,
        strategies: [
          {
            strategy: new DefaultConvertStrategy(source, target, this.context),
            amount: amountIn,
          },
        ],
        convertType: "LPAndMain",
      };

      // always include the default convert route
      const routes: SiloConvertRoute<SiloConvertType>[] = [defaultRoute];

      const sourceWell = source.isLP ? this.cache.getWell(source.address) : undefined;

      // if SourceWell exists, target must be main due to validation above.
      if (sourceWell && !this.maxConvertQuoter.isAggDisabledToken(source)) {
        routes.push({
          source,
          target,
          strategies: [
            {
              strategy: new LP2MainPipeline(sourceWell, target, this.context),
              amount: amountIn,
            },
          ],
          convertType: "LP2MainPipeline",
        });
      }

      return routes;
    }, "strategizeLPAndMain");
  }

  /**
   * LP2MainWithdrawPair
   *
   * This strategy is used to convert from LP 2 Main while simultaneously withdrawing the underlying liquidity from the LP token to their desired balance.
   *
   * @param source
   * @param target
   * @param amountIn
   * @returns
   */
  async strategizeLP2MainWithdrawPair(
    source: Token,
    target: Token,
    amountIn: TV,
  ): Promise<SiloConvertRoute<SiloConvertType>[]> {
    const eh = ErrorHandlerFactory.createStrategizerHandler(source, target);

    return eh.wrapAsync(async () => {
      await eh.wrapAsync(async () => this.cache.update(), "strategizeLP2MainWithdrawPair_cache_update", {
        source: source.symbol,
        target: target.symbol,
        amountIn: amountIn.toHuman(),
      });

      eh.validateConversionTokens("LP2Main", source, target);

      const sourceWell = source.isLP ? this.cache.getWell(source.address) : undefined;

      const sw = eh.assertDefined(sourceWell, "Source well must be defined for LP2MainWithdrawPair");

      return [
        {
          source,
          target,
          strategies: [
            {
              strategy: new LP2MainWithdrawPair(sw, target, this.context, FarmToMode.EXTERNAL),
              amount: amountIn,
            },
          ],
          convertType: "LP2MainWithdrawPair",
        },
      ];
    }, "strategizeLP2MainWithdrawPair");
  }

  /**
   * Main2LPDeposit
   *
   * This strategy is used to convert from Main Token (PINTO) to LP Token while depositing pair token from external wallet.
   *
   * @param source
   * @param target
   * @param amountIn
   * @returns
   */
  async strategizeMain2LPDeposit(
    source: Token,
    target: Token,
    amountIn: TV,
    options: SiloConvertQuoteOptions,
  ): Promise<SiloConvertRoute<SiloConvertType>[]> {
    const eh = ErrorHandlerFactory.createStrategizerHandler(source, target);

    return eh.wrapAsync(async () => {
      await eh.wrapAsync(async () => this.cache.update(), "strategizeMain2LPDeposit_cache_update", {
        source: source.symbol,
        target: target.symbol,
        amountIn: amountIn.toHuman(),
      });

      eh.validateConversionTokens("Main2LP", source, target);

      const targetWell = target.isLP ? this.cache.getWell(target.address) : undefined;

      const tw = eh.assertDefined(targetWell, "Target well must be defined for Main2LPDeposit");

      const secondaryAmount = eh.assertDefined(
        options.secondaryAmount,
        "Secondary amount is required for Main2LPDeposit strategy",
      );
      const fromMode = eh.assertDefined(options.fromMode, "From mode is required for Main2LPDeposit strategy");

      return [
        {
          source,
          target,
          strategies: [
            {
              strategy: new Main2LPDepositPair(source, tw, this.context, secondaryAmount, fromMode),
              amount: amountIn,
            },
          ],
          convertType: "Main2LPDeposit",
        },
      ];
    }, "strategizeMain2LPDeposit");
  }

  async strategizeLP2LP(source: Token, target: Token, amountIn: TV) {
    try {
      await this.cache.update();
    } catch (error) {
      throw new CacheError(
        "strategizeLP2LP cache update",
        error instanceof Error ? error.message : "Unknown cache error",
        { source: source.symbol, target: target.symbol, amountIn: amountIn.toHuman() },
      );
    }

    let sourceWell: ExtendedPoolData;
    let targetWell: ExtendedPoolData;

    try {
      sourceWell = this.cache.getWell(source.address);
      targetWell = this.cache.getWell(target.address);
    } catch (error) {
      throw new StrategySelectionError(
        source,
        target,
        `Failed to get well data: ${error instanceof Error ? error.message : "Unknown error"}`,
        { sourceAddress: source.address, targetAddress: target.address },
      );
    }

    const isAggDisabled =
      this.maxConvertQuoter.isAggDisabledToken(source) || this.maxConvertQuoter.isAggDisabledToken(target);

    const shared: Omit<SiloConvertRoute<SiloConvertType>, "strategies"> = {
      source,
      target,
      convertType: "LP2LP",
    };

    const strategies: StrategyWithAmount<"LP2LP">[] = [];

    // if dex aggregators are disabled for either token, we can only use a single sided main token strategy.
    if (isAggDisabled) {
      if (this.maxConvertQuoter.isAggDisabledToken(source)) {
        console.warn(`[Strategizer] Aggregator disabled for source token: ${source.symbol}`);
      }
      if (this.maxConvertQuoter.isAggDisabledToken(target)) {
        console.warn(`[Strategizer] Aggregator disabled for target token: ${target.symbol}`);
      }

      try {
        const defaultStrategy = new LP2LPSingleSidedMain(sourceWell, targetWell, this.context);

        const route = {
          ...shared,
          strategies: [
            {
              strategy: defaultStrategy,
              amount: amountIn,
            },
          ],
        };

        return [route];
      } catch (error) {
        throw new StrategySelectionError(
          source,
          target,
          `Failed to create single-sided main token strategy when aggregator is disabled: ${error instanceof Error ? error.message : "Unknown error"}`,
          { isAggDisabled, sourceWell: sourceWell.pool.address, targetWell: targetWell.pool.address },
        );
      }
    }

    const convertTokens = { source, target };

    const sourceDeltaP = sourceWell.deltaB;
    const targetDeltaP = targetWell.deltaB;

    let maxConvert: TV | undefined = undefined;
    let amountUsed: TV = TV.fromHuman("0", source.decimals);

    // if conditions allow for single sided main token convert, add the strategy.
    if (sourceDeltaP.lt(Strategizer.MIN_DELTA_B) && targetDeltaP.gt(Strategizer.MIN_DELTA_B)) {
      try {
        maxConvert = await this.maxConvertQuoter.getSingleSidedMainTokenMaxConvert(convertTokens);
        amountUsed = TV.min(amountIn, maxConvert);
        strategies.push({
          strategy: new LP2LPSingleSidedMain(sourceWell, targetWell, this.context),
          amount: amountUsed,
        });
      } catch (error) {
        throw new MaxConvertQuotationError(
          source,
          target,
          `Failed to quote single-sided main token max convert: ${error instanceof Error ? error.message : "Unknown error"}`,
          {
            sourceDeltaP: sourceDeltaP.toHuman(),
            targetDeltaP: targetDeltaP.toHuman(),
            strategy: "single-sided-main-token",
          },
        );
      }
    }
    // if conditions allow for single sided pair token convert, add the strategy.
    else if (sourceDeltaP.gt(Strategizer.MIN_DELTA_B) && targetDeltaP.lt(Strategizer.MIN_DELTA_B)) {
      try {
        maxConvert = await this.maxConvertQuoter.getSingleSidedPairTokenMaxConvert(convertTokens);
        amountUsed = TV.min(amountIn, maxConvert);
        strategies.push({
          strategy: new LP2LPSingleSidedPair(sourceWell, targetWell, this.context),
          amount: amountUsed,
        });
      } catch (error) {
        throw new MaxConvertQuotationError(
          source,
          target,
          `Failed to quote single-sided pair token max convert: ${error instanceof Error ? error.message : "Unknown error"}`,
          {
            sourceDeltaP: sourceDeltaP.toHuman(),
            targetDeltaP: targetDeltaP.toHuman(),
            strategy: "single-sided-pair-token",
          },
        );
      }
    }

    // If either nothing is used or the amountIn was partially used
    // Default to adding the eq2eq strategy.
    if (!amountUsed.eq(amountIn)) {
      try {
        strategies.push({
          strategy: new LP2LPEq2Eq(sourceWell, targetWell, this.context),
          amount: amountIn.sub(amountUsed),
        });
      } catch (error) {
        throw new StrategySelectionError(
          source,
          target,
          `Failed to create equal-to-equal strategy: ${error instanceof Error ? error.message : "Unknown error"}`,
          {
            amountIn: amountIn.toHuman(),
            amountUsed: amountUsed.toHuman(),
            remainingAmount: amountIn.sub(amountUsed).toHuman(),
            strategy: "equal-to-equal",
          },
        );
      }
    }

    if (strategies.length === 0) {
      throw new StrategySelectionError(source, target, "No valid strategies found for LP to LP conversion", {
        sourceDeltaP: sourceDeltaP.toHuman(),
        targetDeltaP: targetDeltaP.toHuman(),
        amountIn: amountIn.toHuman(),
        isAggDisabled,
      });
    }

    try {
      return [
        {
          ...shared,
          strategies,
        },
      ];
    } catch (error) {
      throw new StrategySelectionError(
        source,
        target,
        `Failed to construct LP2LP route: ${error instanceof Error ? error.message : "Unknown error"}`,
        { strategiesCount: strategies.length },
      );
    }
  }

  /**
   * Main -> LP Down Convert
   * @param source
   * @param target
   * @param amountIn
   *
   * Returns 2 different routes based on
   * 1. the WP (Well Price)
   * 2. MCAR (Max Convert Amount at Rate)
   * 3. amountIn
   * 4. GSPR (Grown Stalk Penalty Rate) (At time of writing, 1.005)
   *
   * If WP > GSPR & amountIn < MCAR
   * -> return 1 strategy. (should NOT incur Grown Stalk Penalty b/c we are not converting below the GSPR)
   *
   * If WP < GSPR & amountIn < MCAR
   * -> 1 strategy. (SHOULD incur Grown Stalk Penalty since we are converting below the GSPR)
   *
   * If WP > GSPR & MCAR < amountIn
   * -> 2 strategies.
   * 1. Convert down to the GSPR with a buffer. (SHOULD NOT incur Grown Stalk Penalty)
   * 2. Convert down towards the Value Target (SHOULD incur Grown Stalk Penalty)
   *
   */
  private async strategizeLPAndMainDownConvert(
    source: Token,
    target: Token,
    amountIn: TV,
  ): Promise<SiloConvertRoute<SiloConvertType>[]> {
    const eh = ErrorHandlerFactory.createStrategizerHandler(source, target);

    return eh.wrapAsync(async () => {
      // no need to update cache for this operation
      eh.validateConversionTokens("Main2LP", source, target);

      const maxConvert = await this.maxConvertQuoter.quoteMaxConvert(source, target);

      eh.assert(amountIn.lte(maxConvert.max), "Amount in must be <= max convert amount", {
        amountIn: amountIn.toHuman(),
        max: maxConvert.max.toHuman(),
        maxAtRate: maxConvert.maxAtRate?.toHuman(),
      });

      const targetWell = await this.cache.getWell(target.address);
      const targetWellPrice = targetWell.price;

      let grownStalkPenaltyExpected = false;

      // TODO: To actually calculate if the grown stalk penalty will be applied, we need to:
      // diamond.getGaugeValue(1) returns bytes,
      // abi.decode(bytes, (uint256,uint256)) = (uint256 penaltyRatio, uint256 rollingRateAbovePeg)
      // check if penalty ratio = 0

      // However, a large chunk of mints are required for penaltyRatio to be == 0, so we will just use the well price for now.

      // 1. Check if the target well price is less than the penalty rate.
      if (targetWellPrice.lt(CONVERT_DOWN_PENALTY_RATE)) {
        grownStalkPenaltyExpected = true;
      } else {
        // At this point we know that the well price > GSPR.
        const maxAtRate = eh.assertDefined(
          maxConvert.maxAtRate,
          "Expected maxConvertAtRate to be defined for default down convert",
        );

        // 2. Check if the amountIn is greater than the maxAtRate.
        if (amountIn.gt(maxAtRate)) {
          grownStalkPenaltyExpected = true;
        }
      }

      return [
        {
          source,
          target,
          convertType: "LPAndMain",
          strategies: [
            {
              strategy: new DefaultConvertStrategy(source, target, this.context, { grownStalkPenaltyExpected }),
              amount: amountIn,
            },
          ],
        },
      ];
    }, "splitUpMain2LP");
  }
}

export { Strategizer as SiloConvertStrategizer };
