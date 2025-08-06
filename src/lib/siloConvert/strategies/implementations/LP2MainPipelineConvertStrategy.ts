import { Clipboard } from "@/classes/Clipboard";
import { TV } from "@/classes/TokenValue";
import { PIPELINE_ADDRESS } from "@/constants/address";
import { AdvancedFarmWorkflow, AdvancedPipeWorkflow } from "@/lib/farm/workflow";
import { ZeroX } from "@/lib/matcha/ZeroX";
import { ExtendedPoolData } from "@/lib/siloConvert/SiloConvert.cache";
import { SiloConvertSwapQuoter } from "@/lib/siloConvert/siloConvert.swapQuoter";
import {
  ConvertQuoteSummary,
  ConvertStrategyQuote,
  ConvertStrategyWithSwap,
  PipelineConvertStrategy,
} from "@/lib/siloConvert/strategies/core";
import { SiloConvertContext } from "@/lib/siloConvert/types";
import { quoteSiloConvertGetWellRemoveLiquidity } from "@/lib/siloConvert/utils";
import { ExtendedPickedCratesDetails } from "@/utils/convert";
import { Token } from "@/utils/types";
import { throwIfAborted } from "@/utils/utils";

/**
 * Strategy for converting from LP -> Main Token
 *
 * Uses PipelineConvert to convert from LP -> Main Token
 *
 * Strategy:
 *  -> remove in equal proportions from LP
 *  -> swap pair token for main token via dex aggregator
 *  -> deposit main token into silo
 */

class LP2MainStrategy extends PipelineConvertStrategy<"LP2MainPipeline"> implements ConvertStrategyWithSwap {
  readonly name = "LP2Main_Pipeline";

  swapQuoter: SiloConvertSwapQuoter;

  readonly sourceWell: ExtendedPoolData;

  constructor(source: ExtendedPoolData, target: Token, context: SiloConvertContext) {
    super(source.pool, target, context);
    this.swapQuoter = new SiloConvertSwapQuoter(context);

    this.initErrorHandlerCtx();
    this.sourceWell = source;
  }

  get sourceIndexes() {
    const pairIndex = this.sourceWell.pair.index;
    return {
      pair: pairIndex,
      main: pairIndex === 1 ? 0 : 1,
    };
  }

  private get pairToken() {
    return this.sourceWell.tokens[this.sourceIndexes.pair];
  }

  async quote(
    deposits: ExtendedPickedCratesDetails,
    advancedFarm: AdvancedFarmWorkflow,
    slippage: number,
    signal?: AbortSignal,
  ): Promise<ConvertStrategyQuote<"LP2MainPipeline">> {
    // Check if already aborted
    throwIfAborted(signal);

    // Validation
    this.validateQuoteArgs(deposits, slippage);

    // Remove liquidity in equal proportions
    const removeLPResult = await this.errorHandler.wrapAsync(
      () => this.getRemoveLiquidityOut(deposits, advancedFarm),
      "remove liquidity simulation",
      { amountIn: deposits.totalAmount.toHuman() },
    );

    // Check if aborted after async operation
    throwIfAborted(signal);

    const mainTokenAmountRemoved = removeLPResult[this.sourceIndexes.main];
    this.errorHandler.validateAmount(mainTokenAmountRemoved, "main token amount from remove liquidity");

    const pairAmount = removeLPResult[this.sourceIndexes.pair];
    this.errorHandler.validateAmount(pairAmount, "pair token amount from remove liquidity");

    const swapParams = this.swapQuoter.generateSwapQuoteParams(
      this.targetToken,
      this.pairToken,
      pairAmount,
      slippage,
      false,
    );

    const swapQuotes = await this.errorHandler.wrapAsync(
      () => ZeroX.quote(swapParams, { signal }),
      "0x swap quotation",
      {
        sellToken: this.pairToken.symbol,
        buyToken: this.targetToken.symbol,
        amount: pairAmount.toHuman(),
      },
    );

    // Check if aborted after swap
    throwIfAborted(signal);

    // Should always be the 1 quote b/c we are going from pair token -> main token.
    this.errorHandler.assert(swapQuotes.length === 1, "Expected exactly 1 swap quote from 0x", {
      quotesCount: swapQuotes.length,
    });

    const swapQuote = swapQuotes[0];

    const swapSummary = this.swapQuoter.makeSwapSummary(
      swapQuote,
      this.pairToken,
      this.targetToken,
      this.sourceWell.pair.price,
      this.sourceWell.price, // TODO: get price of main token after the swap... fix me.
    );

    const totalAmountOut = swapSummary.buyAmount.add(mainTokenAmountRemoved);

    const summary: ConvertQuoteSummary<"LP2MainPipeline"> = {
      source: {
        token: this.sourceWell.pool,
        removeTokens: this.sourceWell.tokens,
        well: this.sourceWell,
        amountIn: deposits.totalAmount,
        amountOut: removeLPResult,
        minAmountOut: removeLPResult.map((amount) => amount.subSlippage(slippage)),
      },
      swap: swapSummary,
      target: {
        token: this.targetToken,
        amountOut: totalAmountOut,
      },
    };

    return {
      pickedCrates: deposits,
      summary,
      advPipeCalls: this.errorHandler.wrap(() => this.buildAdvancedPipeCalls(summary), "build advanced pipe calls", {
        sourceWell: this.sourceWell.pool.symbol,
        targetToken: this.targetToken.symbol,
      }),
      amountOut: totalAmountOut,
      convertData: undefined,
    };
  }

  buildAdvancedPipeCalls({ source, swap }: ConvertStrategyQuote<"LP2MainPipeline">["summary"]) {
    // Validation
    const validatedSwap = this.errorHandler.assertDefined(swap, "Swap required for LP2MainPipeline Strategy");
    this.errorHandler.assert(!!source.well, "Source well is required", { hasSourceWell: !!source.well });
    this.errorHandler.validateAmount(source.amountIn, "source amount in");

    const pipe = new AdvancedPipeWorkflow(this.context.chainId, this.context.wagmiConfig);

    // 0. Approve source well to use LP token
    pipe.add(LP2MainStrategy.snippets.erc20Approve(source.well.pool, source.well.pool.address));

    // 1. Remove liquidity in equal proportions
    pipe.add(
      LP2MainStrategy.snippets.removeLiquidity(source.well, source.amountIn, source.minAmountOut, PIPELINE_ADDRESS),
    );

    // 2. Approve swap contract to spend main token
    pipe.add(LP2MainStrategy.snippets.erc20Approve(validatedSwap.sellToken, validatedSwap.quote.transaction.to));

    // 3. Swap pair token for PINTO
    pipe.add({
      target: validatedSwap.quote.transaction.to,
      callData: validatedSwap.quote.transaction.data,
      clipboard: Clipboard.encode([]),
    });

    return pipe;
  }

  async getRemoveLiquidityOut(
    pickedCratesDetails: ExtendedPickedCratesDetails,
    advancedFarm: AdvancedFarmWorkflow,
  ): Promise<TV[]> {
    return quoteSiloConvertGetWellRemoveLiquidity(pickedCratesDetails, advancedFarm, this);
  }
}

export { LP2MainStrategy as SiloConvertLP2MainPipelineConvertStrategy };
