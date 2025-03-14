import { Clipboard } from "@/classes/Clipboard";
import { TV } from "@/classes/TokenValue";
import { abiSnippets } from "@/constants/abiSnippets";
import { MAIN_TOKEN } from "@/constants/tokens";
import encoders from "@/encoders";
import { PriceContractPriceResult, decodePriceResult } from "@/encoders/ecosystem/price";
import junctionGte from "@/encoders/junction/junctionGte";
import { AdvancedFarmWorkflow, AdvancedPipeWorkflow } from "@/lib/farm/workflow";
import { resolveChainId } from "@/utils/chain";
import { pickCratesMultiple } from "@/utils/convert";
import { DepositData, Token } from "@/utils/types";
import { HashString } from "@/utils/types.generic";
import defaultWagmiConfig from "@/utils/wagmi/config";
import { Config } from "@wagmi/core";
import { Address, decodeFunctionResult } from "viem";
import { SiloConvertCache } from "./SiloConvert.cache";
import { SiloConvertMaxConvertQuoter } from "./SiloConvert.maxConvertQuoter";
import {
  ConvertStrategyQuote,
  SiloConvertSourceSummary,
  SiloConvertStrategy,
  SiloConvertTargetSummary,
} from "./strategies/ConvertStrategy";
import { DefaultConvertStrategy, DefaultConvertStrategyResult } from "./strategies/DefaultConvertStrategy";
import {
  LP2LPConvertStrategyResult,
  LP2LPStrategy,
  SourceSummaryLP2LP,
  TargetSummaryLP2LP,
} from "./strategies/LP2LPConvertStrategy";
import { SiloConvertLP2LPEq2EqStrategy } from "./strategies/strategy.lp2lpEq2Eq";
import { SiloConvertLP2LPSingleSidedMainTokenStrategy } from "./strategies/strategy.lp2lpSingleSidedMainToken";
import { SiloConvertLP2LPSingleSidedPairTokenStrategy } from "./strategies/strategy.lp2lpSingleSidedPairToken";

/**
 * Architecture notes:
 *
 * SiloConvert is the outer-facing class that is used to
 * 1. quote the maximum convert between 2 tokens (if applicable)
 * 2. quote the convert between 2 tokens
 * 3. provide an executable advancedFarm workflow
 *
 * To fetch the maximum convert, we utilize the SiloConvertMaxConvertQuoter class.
 * (more on this in ./SiloConvert.maxConvertQuoter.ts)
 *
 * If the source or target is the main token, we refer to it as a 'default convert'.
 * For default converts specifically, we utilize the Diamond's 'convert()' function.
 * For any LP<>LP converts, we utilize the Diamond's 'pipelineConvert()' function.
 *
 * If we are converting LP<>LP, we must calculate the following information:
 * - Which strategies do we utilize?
 * - Given the strategies, how much can we convert via each strategy?
 *
 * [Convert Strategies]
 * Broadly speaking, we can break down LP<>LP converts into 3 separate strategies:
 * 1. Remove single sided liquidity as PINTO from LP 1 -> deposit single sided liquidity as PINTO into LP 2
 *    - Referred to in the code as a 'singleSidedMainToken' strategy (SSMT)
 * 2. Remove single sided liquidity as non-PINTO from LP 1 -> deposit single sided liquidity as non-PINTO into LP 2
 *    - Referred to in the code as a 'singleSidedPairToken' strategy (SSPT)
 * 3. Remove liquidity in equal proportions from LP 1 -> deposit equal proportions of liquidity into LP 2
 *    - Referred to in the code as an 'equal2Equal' strategy (EQ2EQ)
 *
 * For strategies 2 & 3, we swap between LP 1's pair token -> LP 2's pair token leveraging the 0x API.
 *
 * [Strategy Selection]
 * Strategy selection is primarily done by comparing the instantaneous ΔP of the source and target wells.
 *
 * Given Well A & Well B, and we want to convert from Well A -> Well B, we can determine the following:
 * 1. If ΔP(A) > 0 & ΔP(B) < 0, we utilize the SSPT strategy.
 * 2. If ΔP(A) < 0 & ΔP(B) > 0, we utilize the SSMT strategy.
 * 3. If ΔP(A) & ΔP(B) have the same sign, we utilize the EQ2EQ strategy.
 *
 * [Max Convert Calculation]
 * In the case where we utilize SSPT or SSMT, we must calculate the maximum amount of single sided liquidity we can remove / deposit w/o causing ΔP to negate on either Well.
 * Thus, if |ΔP(A)| > |ΔP(B)|, we find the max amount we can add to Well B such that ΔP(B) does not negate.
 * Conversely, if |ΔP(A)| < |ΔP(B)|, we find the max amount we can remove from Well A such that ΔP(A) does not negate.
 *
 * Additionally, in the case where the amount the user wishes to convert exceeds the max convert, we split the amount into 2 parts:
 * 1. The max amount that can be converted via the SSPT / SSMT strategy.
 * 2. The remainder of the amount that is converted via the EQ2EQ strategy.
 *
 *
 */

/**
 * The result of a pipeline convert from on-chain.
 */
export interface ConvertResultStruct<T = TV> {
  /**
   * The updated stem of the Silo token we are converting to.
   */
  toStem: T;
  /**
   * The amount of the source Silo token we are converting from.
   */
  fromAmount: T;
  /**
   * The amount of the target Silo token we are converting to.
   */
  toAmount: T;
  /**
   * bdv of the source Silo token we are attempting to convert from.
   */
  fromBdv: T;
  /**
   * bdv of the target Silo token after the convert.
   */
  toBdv: T;
}

export interface SiloConvertSummary {
  quotes: (DefaultConvertStrategyResult | LP2LPConvertStrategyResult)[];
  results: ConvertResultStruct<TV>[];
  workflow: AdvancedFarmWorkflow;
  totalAmountOut: TV;
  postPriceData: PriceContractPriceResult | undefined;
}

/**
 * shared context for all silo convert related operations
 */
export interface SiloConvertContext {
  diamond: Address;
  account: Address;
  wagmiConfig: Config;
  chainId: number;
}

export class SiloConvert {
  readonly context: SiloConvertContext;

  private static MIN_DELTA_B = 100;

  cache: SiloConvertCache;

  maxConvertQuoter: SiloConvertMaxConvertQuoter;

  strategies: SiloConvertStrategy[] = [];

  amounts: TV[] = [];

  constructor(diamondAddress: Address, account: Address, config: Config, chainId: number) {
    this.context = {
      diamond: diamondAddress,
      account: account,
      wagmiConfig: config,
      chainId: chainId,
    };

    this.cache = new SiloConvertCache(this.context);
    this.maxConvertQuoter = new SiloConvertMaxConvertQuoter(this.context, this.cache);
  }

  /**
   * Resets the strategies, amounts, and caches.
   */
  clear() {
    this.strategies = [];
    this.amounts = [];
    this.cache = new SiloConvertCache(this.context);
    this.maxConvertQuoter = new SiloConvertMaxConvertQuoter(this.context, this.cache);
  }

  /**
   * Given a source and target token, returns the max convert amount.
   */
  async getMaxConvert(source: Token, target: Token, deposits?: DepositData[], forceUpdateCache?: boolean): Promise<TV> {
    // update cache if requested
    await this.cache.update(forceUpdateCache);

    return this.maxConvertQuoter.quoteMaxConvert(source, target, deposits);
  }

  /**
   * Given a source and target token, returns the convert result.
   */
  async quote(
    source: Token,
    target: Token,
    farmerDeposits: DepositData[],
    amountIn: TV,
    slippage: number,
    forceUpdateCache: boolean = false,
  ): Promise<SiloConvertSummary> {
    await this.cache.update(forceUpdateCache);

    const advancedFarm = new AdvancedFarmWorkflow(this.context.chainId, this.context.wagmiConfig);

    const isDefaultConvert = source.isMain || target.isMain;

    let quoterResult: Awaited<ReturnType<typeof this.quoteDefaultConvert> | ReturnType<typeof this.quoteLP2LP>>;

    if (isDefaultConvert) {
      quoterResult = await this.quoteDefaultConvert(source, target, farmerDeposits, amountIn, slippage, advancedFarm);
    } else {
      quoterResult = await this.quoteLP2LP(source, target, farmerDeposits, amountIn, slippage, advancedFarm);
    }

    const { quotes, totalAmountOut, decoder } = quoterResult;

    console.debug("[SiloConvert/quote] quotes: ", {
      quotes,
      totalAmountOut,
    });

    try {
      const sim = await advancedFarm.simulate({
        account: this.context.account,
        after: this.cache.constructPriceAdvPipe({ noTokenPrices: true }),
      });

      const simResults = [...sim.result];
      // Pop the last result from the sim results which is the price result
      const priceResult = simResults.pop();

      const mainToken = MAIN_TOKEN[resolveChainId(this.context.chainId)];

      const results: ConvertResultStruct<TV>[] = decoder(simResults).map((result) => {
        return {
          toStem: TV.fromBigInt(result.toStem, mainToken.decimals),
          fromAmount: TV.fromBigInt(result.fromAmount, source.decimals),
          toAmount: TV.fromBigInt(result.toAmount, target.decimals),
          fromBdv: TV.fromBigInt(result.fromBdv, mainToken.decimals),
          toBdv: TV.fromBigInt(result.toBdv, mainToken.decimals),
        };
      });

      const decodedAdvPipePriceCall = priceResult ? AdvancedPipeWorkflow.decodeResult(priceResult) : undefined;
      const postPriceData = decodedAdvPipePriceCall?.length ? decodePriceResult(decodedAdvPipePriceCall[0]) : undefined;

      const result: SiloConvertSummary = {
        quotes,
        results,
        workflow: advancedFarm,
        totalAmountOut,
        postPriceData,
      };

      console.debug("[SiloConvert/quote] result: ", result);
      return result;
    } catch (e) {
      console.error("[SiloConvert/quote] FAILED: ", e);
      throw new Error("Failed to fetch quote");
    }
  }

  /**
   * Quotes a convert between a source and target token where one of the tokens is the BEAN.
   */
  private async quoteDefaultConvert(
    source: Token,
    target: Token,
    farmerDeposits: DepositData[],
    amountIn: TV,
    slippage: number,
    workflow: AdvancedFarmWorkflow,
  ) {
    const strategy = new DefaultConvertStrategy(source, target, this.context);
    this.strategies = [strategy];
    this.amounts = [amountIn];

    const pickedDeposits = pickCratesMultiple(farmerDeposits, "bdv", "asc", [amountIn]);

    const quotes: ConvertStrategyQuote<SiloConvertSourceSummary, SiloConvertTargetSummary>[] = [];

    const quote = await strategy.quote(pickedDeposits[0], workflow, slippage);
    quotes.push(quote);

    return {
      quotes,
      totalAmountOut: quote.amountOut,
      decoder: SiloConvert.decodeDefaultConvertResults,
    };
  }

  /**
   * Quotes a convert between two LP tokens.
   */
  private async quoteLP2LP(
    source: Token,
    target: Token,
    farmerDeposits: DepositData[],
    amountIn: TV,
    slippage: number,
    workflow: AdvancedFarmWorkflow,
  ) {
    await this.cache.update();

    const { strategies, amounts } = await this.#splitStrategies(source, target, amountIn);

    this.strategies = strategies;
    this.amounts = amounts;

    const pickedDeposits = pickCratesMultiple(farmerDeposits, "bdv", "asc", amounts);

    const quotes: ConvertStrategyQuote<SourceSummaryLP2LP, TargetSummaryLP2LP>[] = [];

    let totalAmountOut = TV.fromHuman("0", target.decimals);

    for (const [i, _strategy] of this.strategies.entries()) {
      const strategy = _strategy as LP2LPStrategy;
      const quoteResult = await strategy.quote(pickedDeposits[i], workflow, slippage);
      const encoded = strategy.encodeConvertResults(quoteResult);
      workflow.add(encoded);
      quotes.push(quoteResult);
      totalAmountOut = totalAmountOut.add(quoteResult.amountOut);
    }

    return {
      quotes,
      totalAmountOut,
      decoder: SiloConvert.decodeStaticResults,
    };
  }

  /**
   * Determines the strategies and amounts for a LP<>LP convert.
   */
  async #splitStrategies(source: Token, target: Token, amountIn: TV) {
    const strategies: LP2LPStrategy[] = [];
    const amounts: TV[] = [];

    const convertTokens = { source, target };

    const sourceWell = this.cache.getWell(source.address);
    const targetWell = this.cache.getWell(target.address);

    if (this.maxConvertQuoter.isAggDisabledToken(source) || this.maxConvertQuoter.isAggDisabledToken(target)) {
      strategies.push(new SiloConvertLP2LPSingleSidedMainTokenStrategy(sourceWell, targetWell, this.context));
      amounts.push(amountIn);

      return { strategies, amounts };
    }

    const eq2eqStrategy = new SiloConvertLP2LPEq2EqStrategy(sourceWell, targetWell, this.context);

    if (sourceWell.deltaB.lt(SiloConvert.MIN_DELTA_B) && targetWell.deltaB.gt(SiloConvert.MIN_DELTA_B)) {
      const maxConvert = await this.maxConvertQuoter.getSingleSidedMainTokenMaxConvert(convertTokens);
      const strategy = new SiloConvertLP2LPSingleSidedMainTokenStrategy(sourceWell, targetWell, this.context);

      if (amountIn.lt(maxConvert)) {
        strategies.push(strategy);
        amounts.push(amountIn);
      } else {
        const diff = amountIn.sub(maxConvert);

        strategies.push(strategy, eq2eqStrategy);
        amounts.push(maxConvert, diff);
      }
    } else if (sourceWell.deltaB.gt(SiloConvert.MIN_DELTA_B) && targetWell.deltaB.lt(SiloConvert.MIN_DELTA_B)) {
      const maxConvert = await this.maxConvertQuoter.getSingleSidedPairTokenMaxConvert(convertTokens);
      const strategy = new SiloConvertLP2LPSingleSidedPairTokenStrategy(sourceWell, targetWell, this.context);

      if (amountIn.lt(maxConvert)) {
        strategies.push(strategy);
        amounts.push(amountIn);
      } else {
        const diff = amountIn.sub(maxConvert);

        strategies.push(strategy, eq2eqStrategy);
        amounts.push(maxConvert, diff);
      }
    } else {
      strategies.push(eq2eqStrategy);
      amounts.push(amountIn);
    }

    return { strategies, amounts };
  }

  getStalkChecks(expectedToStalk: TV) {
    const pipe = new AdvancedPipeWorkflow(this.context.chainId, this.context.wagmiConfig);

    // index0
    pipe.add({
      ...encoders.farmerSilo.balanceOfStalk(this.context.account),
      target: this.context.diamond,
    });

    // Allow a maximum of 0.5% of the balance of grown stalk to be lost in convert.
    const safeMinStalk = expectedToStalk.mul(0.995);

    // index1
    pipe.add(junctionGte(0n, safeMinStalk.toBigInt(), Clipboard.encodeSlot(0, 0, 0)));

    return pipe;
  }

  // -------------------- Static Methods --------------------

  /**
   * Decodes the results of a default convert.
   */
  static decodeDefaultConvertResults(results: readonly HashString[]): ConvertResultStruct<bigint>[] {
    try {
      const data = results.map((result) => {
        const decoded = decodeFunctionResult<typeof abiSnippets.silo.convert>({
          abi: abiSnippets.silo.convert,
          data: result as HashString,
          functionName: "convert",
        });

        return {
          toStem: decoded[0],
          fromAmount: decoded[1],
          toAmount: decoded[2],
          fromBdv: decoded[3],
          toBdv: decoded[4],
        };
      });

      return data;
    } catch (e) {
      console.error("[SiloConvert/decodeStaticResult] FAILED: ", e);
      throw e;
    }
  }

  /**
   * Decodes the static results returned from either a successful pipeline convert txn or simulation.
   */
  static decodeStaticResults(results: readonly HashString[]): ConvertResultStruct<bigint>[] {
    try {
      const data = results.map((result) => {
        const decoded = decodeFunctionResult<typeof abiSnippets.pipelineConvert>({
          abi: abiSnippets.pipelineConvert,
          data: result as HashString,
          functionName: "pipelineConvert",
        });
        return {
          toStem: decoded[0],
          fromAmount: decoded[1],
          toAmount: decoded[2],
          fromBdv: decoded[3],
          toBdv: decoded[4],
        };
      });

      return data;
    } catch (e) {
      console.error("[SiloConvert/decodeStaticResult] FAILED: ", e);
      throw e;
    }
  }

  /**
   * Returns an empty pipeline convert quote.
   */
  static getEmptyResult() {
    return {
      workflow: new AdvancedFarmWorkflow(8543, defaultWagmiConfig),
      quotes: [] as ConvertStrategyQuote<SourceSummaryLP2LP, TargetSummaryLP2LP>[],
      totalAmountOut: TV.ZERO,
      results: [] as ConvertResultStruct<TV>[],
      postPriceData: undefined,
    };
  }
}
