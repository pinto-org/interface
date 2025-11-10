import { Clipboard } from "@/classes/Clipboard";
import { TV } from "@/classes/TokenValue";
import { abiSnippets } from "@/constants/abiSnippets";
import { PIPELINE_ADDRESS } from "@/constants/address";
import { pipelineAddress } from "@/generated/contractHooks";
import { AdvancedFarmWorkflow, AdvancedPipeWorkflow } from "@/lib/farm/workflow";
import { ZeroX } from "@/lib/matcha/ZeroX";
import { ZeroXQuoteV2Response } from "@/lib/matcha/types";
import { SiloConvertSwapQuoter } from "@/lib/siloConvert/siloConvert.swapQuoter";
import { ConvertStrategyQuote, ConvertStrategyWithSwap, LP2LPStrategy } from "@/lib/siloConvert/strategies/core";
import { resolveChainId } from "@/utils/chain";
import { ExtendedPickedCratesDetails } from "@/utils/convert";
import { Token } from "@/utils/types";
import { HashString } from "@/utils/types.generic";
import { throwIfAborted } from "@/utils/utils";
import { decodeFunctionResult, encodeFunctionData } from "viem";
import { quoteSiloConvertGetWellRemoveLiquidity } from "../../utils";

class Eq2EQStrategy extends LP2LPStrategy implements ConvertStrategyWithSwap {
  readonly name = "LP2LP_EQ2EQ";

  swapQuoter: SiloConvertSwapQuoter;

  constructor(...params: ConstructorParameters<typeof LP2LPStrategy>) {
    super(...params);
    this.swapQuoter = new SiloConvertSwapQuoter(this.context);
    this.initErrorHandlerCtx();
  }

  // Getters
  get sellToken(): Token {
    return this.sourceWell.tokens[this.sourceWell.pair.index];
  }

  get buyToken(): Token {
    return this.targetWell.tokens[this.targetWell.pair.index];
  }

  // ------------------------------ Quote ------------------------------ //

  async quote(
    deposits: ExtendedPickedCratesDetails,
    advancedFarm: AdvancedFarmWorkflow,
    slippage: number,
    signal?: AbortSignal,
  ) {
    // Check if already aborted
    throwIfAborted(signal);
    // Validation
    this.validateQuoteArgs(deposits, slippage);

    // Remove Liquidity
    const removeLPResult = await this.errorHandler.wrapAsync(
      () => this.getRemoveLiquidityOut(deposits, advancedFarm),
      "remove liquidity simulation",
      { amountIn: deposits.totalAmount.toHuman() },
    );

    // Check if aborted after async operation
    throwIfAborted(signal);

    const pairAmount = removeLPResult[this.sourceWell.pair.index];
    const swapParams = this.errorHandler.wrap(
      () => this.swapQuoter.generateSwapQuoteParams(this.buyToken, this.sellToken, pairAmount, slippage),
      "generate swap quote params",
      { pairAmount: pairAmount.toHuman(), sellToken: this.sellToken.symbol, buyToken: this.buyToken.symbol },
    );

    // Swap
    const swapQuotes = await this.errorHandler.wrapAsync(
      () => ZeroX.quote(swapParams, { signal }),
      "0x swap quotation",
      {
        sellToken: this.sellToken.symbol,
        buyToken: this.buyToken.symbol,
        amount: pairAmount.toHuman(),
      },
    );

    this.errorHandler.assert(swapQuotes.length === 1, "Expected exactly 1 swap quote from 0x", {
      quotesCount: swapQuotes.length,
    });

    // Check if aborted after swap
    throwIfAborted(signal);

    const swapQuote = swapQuotes[0];

    // Add Liquidity
    const addLiquidityParams = this.errorHandler.wrap(
      () => this.getAddLiquidityParams(removeLPResult, swapQuote),
      "calculate add liquidity params",
      { swapQuoteAmount: swapQuote.minBuyAmount },
    );

    const addLiquidityAmountOut = await this.errorHandler.wrapAsync(
      () => this.getAddLiquidityOut(addLiquidityParams, advancedFarm),
      "add liquidity simulation",
      { addLiquidityParams: addLiquidityParams.map((v) => v.toHuman()) },
    );

    // Check if aborted after add liquidity simulation
    throwIfAborted(signal);

    const swapSummary = this.errorHandler.wrap(
      () =>
        this.swapQuoter.makeSwapSummary(
          swapQuote,
          this.sellToken,
          this.buyToken,
          this.sourceWell.pair.price,
          this.targetWell.pair.price,
        ),
      "create swap summary",
      { sellToken: this.sellToken.symbol, buyToken: this.buyToken.symbol },
    );

    const summary = {
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
        token: this.targetWell.pool,
        addTokens: this.targetWell.tokens,
        well: this.targetWell,
        amountOut: addLiquidityAmountOut,
        minAmountOut: addLiquidityAmountOut.subSlippage(slippage),
      },
    };

    const advPipeCalls = this.errorHandler.wrap(
      () => this.buildAdvancedPipeCalls(summary),
      "build advanced pipe calls",
      { sourceWell: this.sourceWell.pool.symbol, targetWell: this.targetWell.pool.symbol },
    );

    return {
      pickedCrates: deposits,
      advPipeCalls,
      amountOut: addLiquidityAmountOut,
      summary,
    };
  }

  async getRemoveLiquidityOut(
    pickedCratesDetails: ExtendedPickedCratesDetails,
    workflow: AdvancedFarmWorkflow,
  ): Promise<TV[]> {
    return quoteSiloConvertGetWellRemoveLiquidity(pickedCratesDetails, workflow, this);
  }

  async getAddLiquidityOut(amountsIn: TV[], advFarm: AdvancedFarmWorkflow): Promise<TV> {
    // Validation
    this.errorHandler.assert(amountsIn.length > 0, "Add liquidity amounts array is empty", {
      amountsInLength: amountsIn.length,
    });
    amountsIn.forEach((amount, index) => {
      this.errorHandler.validateAmount(amount, `add liquidity amount[${index}]`, { index });
    });

    const pipe = new AdvancedPipeWorkflow(this.context.chainId, this.context.wagmiConfig);

    const callData = this.errorHandler.wrap(
      () =>
        encodeFunctionData({
          abi: abiSnippets.wells.getAddLiquidityOut,
          functionName: "getAddLiquidityOut",
          args: [amountsIn.map((v) => BigInt(v.blockchainString))],
        }),
      "encode add liquidity call data",
      { amountsIn: amountsIn.map((v) => v.toHuman()) },
    );

    pipe.add({
      target: this.targetWell.pool.address,
      callData,
      clipboard: Clipboard.encode([]),
    });

    const simulate = await this.errorHandler.wrapAsync(
      () =>
        advFarm.simulate({
          after: pipe,
          account: this.context.account,
        }),
      "add liquidity simulation",
      { amountsIn: amountsIn.map((v) => v.toHuman()), account: this.context.account },
    );

    // Validate simulation results
    this.errorHandler.validateSimulation(simulate, "add liquidity simulation");

    const decodedAmountOut = this.errorHandler.wrap(
      () => this.decodeAddLiquidityResult(simulate.result),
      "decode add liquidity result",
      { resultLength: simulate.result.length },
    );

    const amountOut = this.errorHandler.wrap(
      () => TV.fromBlockchain(decodedAmountOut, this.targetWell.pool.decimals),
      "convert add liquidity amount out",
      { decodedAmountOut: decodedAmountOut.toString(), decimals: this.targetWell.pool.decimals },
    );

    console.debug("[PipelineConvertStrategy/Equal2Equal] getAddLiquidityOut: ", {
      well: this.targetWell,
      amountsIn,
      amountOut: amountOut,
    });

    return amountOut;
  }

  // ------------------------------ Build Advanced Pipe Calls ------------------------------ //

  buildAdvancedPipeCalls({ source, swap, target }: ConvertStrategyQuote<"LP2LP">["summary"]) {
    // Validation
    const validatedSwap = this.errorHandler.assertDefined(swap, "Swap is required for equal2equal strategy");
    this.errorHandler.assert(!!source.well, "Source well is required", { hasSourceWell: !!source.well });
    this.errorHandler.assert(!!target.well, "Target well is required", { hasTargetWell: !!target.well });

    const sellTokenIndex = this.errorHandler.wrap(
      () => {
        const index = this.sourceWell.tokens.findIndex(
          (t) => t.address.toLowerCase() === validatedSwap.sellToken.address.toLowerCase(),
        );
        this.errorHandler.assert(index >= 0, "Sell token not found in source well tokens", {
          sellToken: validatedSwap.sellToken.symbol,
          sourceTokens: this.sourceWell.tokens.map((t) => t.symbol),
        });
        return index;
      },
      "find sell token index",
      { sellToken: validatedSwap.sellToken.symbol },
    );

    const pipe = new AdvancedPipeWorkflow(
      this.context.chainId,
      this.context.wagmiConfig,
      `eq2eq-pipe-${this.sourceWell.pool.name}-${this.targetWell.pool.name}`,
    );

    // 0: approve from.well.lpToken to use from.well.lpToken
    pipe.add(Eq2EQStrategy.snippets.erc20Approve(source.well.pool, source.well.pool.address));

    // 1: remove liquidity from from.well
    pipe.add(
      Eq2EQStrategy.snippets.removeLiquidity(source.well, source.amountIn, source.minAmountOut, PIPELINE_ADDRESS),
    );

    // 2: Approve swap contract to spend sellToken
    pipe.add(Eq2EQStrategy.snippets.erc20Approve(validatedSwap.sellToken, validatedSwap.quote.transaction.to));

    // 3: Swap non-bean token of well 1 for non-bean token of well 2
    pipe.add({
      target: validatedSwap.quote.transaction.to,
      callData: validatedSwap.quote.transaction.data,
      clipboard: Clipboard.encode([]),
    });

    // 4: check balance of buyToken in pipeline.
    pipe.add(
      Eq2EQStrategy.snippets.erc20BalanceOf(
        validatedSwap.buyToken,
        pipelineAddress[resolveChainId(this.context.chainId)],
      ),
    );

    // 5: transfer swap result to target well
    pipe.add(
      Eq2EQStrategy.snippets.erc20Transfer(
        validatedSwap.buyToken,
        target.well.pool.address,
        TV.ZERO, // overriden w/ clipboard
        Clipboard.encodeSlot(4, 0, 1),
      ),
    );

    // 6: transfer from from.well.tokens[bean index] to target well

    pipe.add(
      Eq2EQStrategy.snippets.erc20Transfer(
        source.well.tokens[sellTokenIndex === 1 ? 0 : 1],
        target.well.pool.address,
        TV.MAX_UINT256, // overriden w/ clipboard
        /**
         * returnDataIndex: 1 -> removeLiquidity happens at index 1
         *
         * copySlot:
         * removeLiquidity pipeline(index 1) returns an array:
         *    index 0 -> location of length of data
         *    index 1 -> length of data
         *    index 2 -> amount of tokens[0] removed
         *    index 3 -> amount of tokens[1] removed
         * ---> If sourceIndexes.main is 0, then the main token is the 1st token in the array (index 2)
         *
         * token.transfer(recipient, amount);
         * ---> pasteSlot: index 1
         */
        Clipboard.encodeSlot(1, this.sourceIndexes.main === 0 ? 2 : 3, 1),
      ),
    );

    // 7. Call Sync on target well
    pipe.add(
      Eq2EQStrategy.snippets.wellSync(
        target.well,
        PIPELINE_ADDRESS, // set recipient to pipeline
        target.minAmountOut, // min LP Out
      ),
    );

    return pipe;
  }

  // ------------------------------ Private Methods ------------------------------ //

  private getAddLiquidityParams(removeLPResult: TV[], swapQuote: ZeroXQuoteV2Response): TV[] {
    const [_, token1] = this.targetWell.tokens;

    const mainAmountIn = removeLPResult[this.sourceIndexes.main];
    const buyAmount = TV.fromBlockchain(swapQuote.minBuyAmount, token1.decimals);

    const amountsIn = [mainAmountIn, buyAmount];

    if (this.targetIndexes.main === 1) {
      amountsIn.reverse();
    }

    return amountsIn;
  }

  // ------------------------------ Decoders ------------------------------ //

  private decodeAddLiquidityResult(data: readonly HashString[]) {
    this.errorHandler.assert(data.length > 0, "Add liquidity result data is empty", {
      dataLength: data.length,
    });

    const decoded = this.errorHandler.wrap(
      () =>
        decodeFunctionResult({
          abi: abiSnippets.advancedPipe,
          functionName: "advancedPipe",
          data: data[data.length - 1],
        }),
      "decode advanced pipe result for add liquidity",
      { dataLength: data.length },
    );

    this.errorHandler.assert(decoded.length > 0, "Decoded advanced pipe result is empty for add liquidity", {
      decodedLength: decoded.length,
    });

    const addLiquidityResult = this.errorHandler.wrap(
      () =>
        decodeFunctionResult({
          abi: abiSnippets.wells.getAddLiquidityOut,
          functionName: "getAddLiquidityOut",
          data: decoded[decoded.length - 1],
        }),
      "decode add liquidity result",
      { decodedLength: decoded.length },
    );

    return addLiquidityResult;
  }
}

export { Eq2EQStrategy as SiloConvertLP2LPEq2EqStrategy };
