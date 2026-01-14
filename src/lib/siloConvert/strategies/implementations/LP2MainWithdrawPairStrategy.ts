import { Clipboard } from "@/classes/Clipboard";
import { TV } from "@/classes/TokenValue";
import { PIPELINE_ADDRESS } from "@/constants/address";
import { AdvancedFarmWorkflow, AdvancedPipeWorkflow } from "@/lib/farm/workflow";
import { ExtendedPoolData } from "@/lib/siloConvert/SiloConvert.cache";
import {
  ConvertQuoteSummary,
  ConvertStrategyQuote,
  ConvertSummariesLookup,
  PipelineConvertStrategy,
  SiloConvertType,
} from "@/lib/siloConvert/strategies/core";
import { PipelineConvertStrategyAndArgs, SiloConvertContext } from "@/lib/siloConvert/types";
import { ExtendedPickedCratesDetails } from "@/utils/convert";
import { AdvancedFarmCall, FarmFromMode, FarmToMode, Token } from "@/utils/types";
import { exists, throwIfAborted } from "@/utils/utils";
import { quoteSiloConvertGetWellRemoveLiquidity } from "../../utils";

/**
 * Strategy for converting from LP -> Main Token while withdrawing pair token
 *
 * Uses PipelineConvert to convert from LP -> Main Token
 *
 * Strategy:
 *  -> remove in equal proportions from LP
 *  -> send pair token to user's specified balance (External/Internal)
 *  -> leave main token in pipeline for automatic conversion to target
 */

class LP2MainWithdrawPairStrategy extends PipelineConvertStrategy<"LP2MainWithdrawPair"> {
  readonly name = "LP2MainWithdrawPair_Pipeline";

  readonly sourceWell: ExtendedPoolData;
  farmToMode: FarmToMode;

  constructor(source: ExtendedPoolData, target: Token, context: SiloConvertContext, farmToMode: FarmToMode) {
    super(source.pool, target, context);

    if (!exists(farmToMode)) {
      throw new Error("[LP2MainWithdrawPairStrategy] Farm to mode is required");
    }

    this.initErrorHandlerCtx();

    this.errorHandler.validateConversionTokens("LP2Main", source.pool, target);
    this.sourceWell = source;
    this.farmToMode = farmToMode;
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
  ): Promise<ConvertStrategyQuote<"LP2MainWithdrawPair">> {
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

    const mainTokenAmountOut = removeLPResult[this.sourceIndexes.main];
    const pairTokenAmountOut = removeLPResult[this.sourceIndexes.pair];

    const summary: ConvertQuoteSummary<"LP2MainWithdrawPair"> = {
      source: {
        token: this.sourceWell.pool,
        removeTokens: this.sourceWell.tokens,
        well: this.sourceWell,
        amountIn: deposits.totalAmount,
        amountOut: removeLPResult,
        minAmountOut: removeLPResult.map((amount) => amount.subSlippage(slippage)),
      },
      target: {
        token: this.targetToken,
        amountOut: mainTokenAmountOut,
        withdrawalToken: this.pairToken,
        withdrawalAmount: pairTokenAmountOut,
      },
    };

    // build advanced pipe calls
    const advPipeCalls = this.errorHandler.wrap(
      () => this.buildAdvancedPipeCalls(summary),
      "build advanced pipe calls",
      {
        sourceWell: this.sourceWell.pool.symbol,
        targetToken: this.targetToken.symbol,
        pairToken: this.pairToken.symbol,
      },
    );

    return {
      pickedCrates: deposits,
      summary,
      advPipeCalls,
      amountOut: mainTokenAmountOut,
      convertData: undefined,
      needsRebuild: this.farmToMode === FarmToMode.INTERNAL,
    };
  }

  /**
   * Rebuilds a ConvertStrategyQuote<"LP2MainWithdrawPair"> with the proper FarmToMode
   *
   * Quote is expected to be a ConvertStrategyQuote<"LP2MainWithdrawPair">
   *
   * @param context - The SiloConvertContext
   * @param quote - The ConvertStrategyQuote<"LP2MainWithdrawPair"> to rebuild
   * @param mode - The FarmToMode to rebuild to
   * @returns The rebuilt strategy, args, and encode function, or undefined if the quote is not valid
   */
  static rebuildCallStructFromQuoteAndMode(
    context: SiloConvertContext,
    quote: ConvertStrategyQuote<SiloConvertType>,
    mode: FarmToMode,
  ): PipelineConvertStrategyAndArgs<"LP2MainWithdrawPair"> | undefined {
    if (!isValidConvertStrategyQuote(quote)) {
      return undefined;
    }

    const reStrategy = new LP2MainWithdrawPairStrategy(
      quote.summary.source.well,
      quote.summary.target.token,
      context,
      mode,
    );

    const advPipeCalls = reStrategy.buildAdvancedPipeCalls(quote.summary);

    const thisArgs = {
      stems: quote.pickedCrates.crates.map((crate) => crate.stem.toBigInt()),
      amounts: quote.pickedCrates.crates.map((crate) => crate.amount.toBigInt()),
      advPipeCalls,
    };

    const newQuote = {
      ...quote,
      advPipeCalls,
    };

    const farmCalls: AdvancedFarmCall[] = [];
    farmCalls.push(...reStrategy.encodeFromQuote(newQuote).calls);

    // Only add additional transfer calls for INTERNAL mode
    if (mode === FarmToMode.INTERNAL) {
      const additionalCalls = reStrategy.getTransferToInternalPipeCalls(newQuote.summary);
      if (!!additionalCalls.length) {
        farmCalls.push(additionalCalls.encode());
      }
    }

    return {
      strategy: reStrategy,
      args: thisArgs,
      farmStructs: farmCalls,
    };
  }

  /**
   * Returns Well.getRemoveLiquidityOut() result.
   * The reason why AdvancedPipe is used here is because in the case where this strategy
   * is not the first, we will need to simulate it with all preceding strategies.
   */
  async getRemoveLiquidityOut(
    pickedCratesDetails: ExtendedPickedCratesDetails,
    advancedFarm: AdvancedFarmWorkflow,
  ): Promise<TV[]> {
    return quoteSiloConvertGetWellRemoveLiquidity(pickedCratesDetails, advancedFarm, this);
  }

  private getTransferToInternalPipeCalls({ source, target }: ConvertStrategyQuote<"LP2MainWithdrawPair">["summary"]) {
    // Validation
    this.errorHandler.assert(!!source.well, "Source well is required", { hasSourceWell: !!source.well });
    this.errorHandler.validateAmount(source.amountIn, "source amount in");
    this.errorHandler.validateAmount(target.withdrawalAmount, "pair token withdrawn amount");

    const pipe = new AdvancedPipeWorkflow(this.context.chainId, this.context.wagmiConfig);

    pipe.add(LP2MainWithdrawPairStrategy.snippets.erc20BalanceOf(this.pairToken, PIPELINE_ADDRESS));

    pipe.add(LP2MainWithdrawPairStrategy.snippets.erc20Approve(this.pairToken, this.context.diamond));

    pipe.add(
      LP2MainWithdrawPairStrategy.snippets.diamondTransferToken(
        this.pairToken,
        this.context.account,
        TV.MAX_UINT256, // overridden with clipboard
        FarmFromMode.EXTERNAL, // from pipeline (external)
        this.farmToMode, // to user's specified balance
        this.context.diamond,
        Clipboard.encodeSlot(0, 0, 2),
      ),
    );

    return pipe;
  }

  /**
   * Builds the advanced pipe calls for the convert.
   *
   * For the LP2MainWithdrawPair strategy, the advanced pipe calls are:
   * 1. Approve source well to use LP token
   * 2. Remove liquidity in equal proportions and send the pair token to Pipeline
   *
   * If destination balance is External:
   * 3. Transfer pair token to user's external wallet. No additional approval needed.
   *
   * If destination balance is Internal:
   * 3. Approve protocol diamond address to spend pair token
   * 4. Transfer pair token to user's internal balance via the diamond's transferToken function
   *
   * @param summary - The summary of the convert.
   */
  buildAdvancedPipeCalls({ source, target }: ConvertStrategyQuote<"LP2MainWithdrawPair">["summary"]) {
    // Validation
    this.errorHandler.assert(!!source.well, "Source well is required", { hasSourceWell: !!source.well });
    this.errorHandler.validateAmount(source.amountIn, "source amount in");
    this.errorHandler.validateAmount(target.withdrawalAmount, "pair token withdrawn amount");

    const pipe = new AdvancedPipeWorkflow(this.context.chainId, this.context.wagmiConfig);

    // 0. Approve source well to use LP token
    pipe.add(LP2MainWithdrawPairStrategy.snippets.erc20Approve(source.well.pool, source.well.pool.address));

    // 1. Remove liquidity in equal proportions
    pipe.add(
      LP2MainWithdrawPairStrategy.snippets.removeLiquidity(
        source.well,
        source.amountIn,
        source.minAmountOut,
        PIPELINE_ADDRESS,
      ),
    );

    // copySlot: removeLiquidity pipeline(index 1) returns an array:
    //    index 0 -> location of length of data
    //    index 1 -> length of data
    //    index 2 -> amount of tokens[0] removed
    //    index 3 -> amount of tokens[1] removed
    // If sourceIndexes.pair is 1, then the pair token is the second token in the array (index 3)
    const pairTokenOutCopySlot = this.sourceIndexes.pair === 1 ? 3 : 2;

    if (this.farmToMode === FarmToMode.EXTERNAL) {
      // 2(a). If sending to External balance, no approval needed
      // Transfer pair token to user's external wallet
      pipe.add(
        LP2MainWithdrawPairStrategy.snippets.erc20Transfer(
          this.pairToken,
          this.context.account,
          TV.MAX_UINT256, // overridden with clipboard
          /**
           * token.transfer(recipient, amount);
           * ---> pasteSlot: index 1
           *
           */
          Clipboard.encodeSlot(1, pairTokenOutCopySlot, 1),
        ),
      );
    }

    /**
     * If toMode is internal, the transfer to internal must be done in another transfer call after pipelineConvert
     * this is to prevent failures due to re-entrancy
     */

    return pipe;
  }
}

export { LP2MainWithdrawPairStrategy as SiloConvertLP2MainWithdrawPairStrategy };

function isValidConvertStrategyQuote(
  quote: ConvertStrategyQuote<SiloConvertType>,
): quote is ConvertStrategyQuote<"LP2MainWithdrawPair"> {
  if (isValidWithdrawConvertSourceSummary(quote.summary.source) && isValidWithdrawTargetSummary(quote.summary.target)) {
    return true;
  }

  return false;
}

function isValidWithdrawConvertSourceSummary(
  source: ConvertSummariesLookup[SiloConvertType]["source"],
): source is ConvertSummariesLookup["LP2LP"]["source"] {
  return "well" in source && "removeTokens" in source && "amountOut" in source && "minAmountOut" in source;
}

function isValidWithdrawTargetSummary(
  target: ConvertSummariesLookup[SiloConvertType]["target"],
): target is ConvertSummariesLookup["LP2MainWithdrawPair"]["target"] {
  return "withdrawalToken" in target && "withdrawalAmount" in target;
}
