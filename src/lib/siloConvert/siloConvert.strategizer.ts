import { TV } from "@/classes/TokenValue";
import { Token } from "@/utils/types";
import { Prettify } from "@/utils/types.generic";
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
} from "./strategies/implementations";
import {
  CacheError,
  InvalidConversionTokensError,
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

  async strategize(source: Token, target: Token, amountIn: TV): Promise<SiloConvertRoute<SiloConvertType>[]> {
    try {
      await this.cache.update();
    } catch (error) {
      throw new CacheError("strategize cache update", error instanceof Error ? error.message : "Unknown cache error", {
        source: source.symbol,
        target: target.symbol,
        amountIn: amountIn.toHuman(),
      });
    }

    const isLP2LP = source.isLP && target.isLP;

    if (!isLP2LP) {
      return this.strategizeLPAndMain(source, target, amountIn);
    }

    return this.strategizeLP2LP(source, target, amountIn);
  }

  async strategizeLPAndMain(source: Token, target: Token, amountIn: TV): Promise<SiloConvertRoute<SiloConvertType>[]> {
    try {
      await this.cache.update();
    } catch (error) {
      throw new CacheError(
        "strategizeLPAndMain cache update",
        error instanceof Error ? error.message : "Unknown cache error",
        { source: source.symbol, target: target.symbol, amountIn: amountIn.toHuman() },
      );
    }

    if (source.isLP && target.isLP) {
      throw new InvalidConversionTokensError(
        source,
        target,
        "default",
        "Expected only 1 LP token for LP/Main conversion, but got 2 LP tokens",
      );
    }

    if (source.isMain && target.isMain) {
      throw new InvalidConversionTokensError(
        source,
        target,
        "default",
        "Expected only 1 main token for LP/Main conversion, but got 2 main tokens",
      );
    }

    // Only options for source and target are LP || main.

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
    // Remove conversion limits - always allow LP2MainPipeline if well exists
    if (sourceWell) {
      try {
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
      } catch (error) {
        throw new StrategySelectionError(
          source,
          target,
          `Failed to create LP2MainPipeline strategy: ${error instanceof Error ? error.message : "Unknown error"}`,
          { sourceWell: sourceWell.pool.address },
        );
      }
    }

    return routes;
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
}

export { Strategizer as SiloConvertStrategizer };
