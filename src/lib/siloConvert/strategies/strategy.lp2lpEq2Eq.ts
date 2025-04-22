import { Clipboard } from "@/classes/Clipboard";
import { TV } from "@/classes/TokenValue";
import { abiSnippets } from "@/constants/abiSnippets";
import { PIPELINE_ADDRESS } from "@/constants/address";
import { pipelineAddress } from "@/generated/contractHooks";
import { AdvancedFarmWorkflow, AdvancedPipeWorkflow } from "@/lib/farm/workflow";
import { ZeroX } from "@/lib/matcha/ZeroX";
import { ZeroXQuoteV2Response } from "@/lib/matcha/types";
import { resolveChainId } from "@/utils/chain";
import { ExtendedPickedCratesDetails } from "@/utils/convert";
import { Token } from "@/utils/types";
import { HashString } from "@/utils/types.generic";
import { decodeFunctionResult, encodeFunctionData } from "viem";
import { ConvertStrategyQuote } from "./ConvertStrategy";
import { SiloConvertLP2LPConvertStrategy, SourceSummaryLP2LP, TargetSummaryLP2LP } from "./LP2LPConvertStrategy";

class Eq2EQStrategy extends SiloConvertLP2LPConvertStrategy {
  // Getters
  get sellToken(): Token {
    return this.sourceWell.tokens[this.sourceWell.pair.index];
  }

  get buyToken(): Token {
    return this.targetWell.tokens[this.targetWell.pair.index];
  }

  // ------------------------------ Quote ------------------------------ //

  async quote(deposits: ExtendedPickedCratesDetails, advancedFarm: AdvancedFarmWorkflow, slippage: number) {
    this.validatePickedCrates(deposits);
    this.validateAmountIn(deposits.totalAmount);
    this.validateSlippage(slippage);

    // Remove Liquidity
    const removeLPResult = await this.getRemoveLiquidityOut(deposits, advancedFarm);

    const pairAmount = removeLPResult[this.sourceWell.pair.index];
    const swapParams = this.generateSwapQuoteParams(this.buyToken, this.sellToken, pairAmount, slippage);

    // Swap
    const swapQuotes = await ZeroX.quote(swapParams);
    if (swapQuotes.length !== 1) {
      throw new Error("Expected 1 swap quote");
    }

    const swapQuote = swapQuotes[0];

    // Add Liquidity
    const addLiquidityAmountOut = await this.getAddLiquidityOut(
      this.#getAddLiquidityParams(removeLPResult, swapQuote),
      advancedFarm,
    );

    const swapSummary = this.makeSwapSummary(
      swapQuote,
      this.sellToken,
      this.buyToken,
      this.sourceWell.pair.price,
      this.targetWell.pair.price,
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

    const advPipeCalls = this.buildAdvancedPipeCalls(summary);

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
    const pipe = new AdvancedPipeWorkflow(this.context.chainId, this.context.wagmiConfig);
    const [token0, token1] = this.sourceWell.tokens;

    pipe.add({
      target: this.sourceWell.pool.address,
      callData: encodeFunctionData({
        abi: abiSnippets.wells.getRemoveLiquidityOut,
        functionName: "getRemoveLiquidityOut",
        args: [pickedCratesDetails.totalAmount.toBigInt()],
      }),
      clipboard: Clipboard.encode([]),
    });

    const simulate = await workflow.simulate({
      after: pipe,
      account: this.context.account,
    });

    const result = this.#decodeRemoveLiquidityResult(simulate.result);

    const amounts: TV[] = [TV.fromBigInt(result[0], token0.decimals), TV.fromBigInt(result[1], token1.decimals)];

    console.debug("[PipelineConvertStrategy/Equal2Equal] getRemoveLiquidityOut: ", {
      well: this.sourceWell.pool.name,
      amountIn: pickedCratesDetails.totalAmount,
      amountsOut: amounts,
    });

    return amounts;
  }

  async getAddLiquidityOut(amountsIn: TV[], advFarm: AdvancedFarmWorkflow): Promise<TV> {
    const pipe = new AdvancedPipeWorkflow(this.context.chainId, this.context.wagmiConfig);

    pipe.add({
      target: this.targetWell.pool.address,
      callData: encodeFunctionData({
        abi: abiSnippets.wells.getAddLiquidityOut,
        functionName: "getAddLiquidityOut",
        args: [amountsIn.map((v) => BigInt(v.blockchainString))],
      }),
      clipboard: Clipboard.encode([]),
    });

    const simulate = await advFarm.simulate({
      after: pipe,
      account: this.context.account,
    });

    const decodedAmountOut = this.#decodeAddLiquidityResult(simulate.result);
    const amountOut = TV.fromBlockchain(decodedAmountOut, this.targetWell.pool.decimals);

    console.debug("[PipelineConvertStrategy/Equal2Equal] getAddLiquidityOut: ", {
      well: this.targetWell,
      amountsIn,
      amountOut: amountOut,
    });

    return amountOut;
  }

  // ------------------------------ Build Advanced Pipe Calls ------------------------------ //

  buildAdvancedPipeCalls({
    source,
    swap,
    target,
  }: ConvertStrategyQuote<SourceSummaryLP2LP, TargetSummaryLP2LP>["summary"]) {
    if (!swap) {
      throw new Error("Swap is required for equal2equal strategy");
    }

    const sellTokenIndex = this.sourceWell.tokens.findIndex(
      (t) => t.address.toLowerCase() === swap.sellToken.address.toLowerCase(),
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
    pipe.add(Eq2EQStrategy.snippets.erc20Approve(swap.sellToken, swap.quote.transaction.to));

    // 3: Swap non-bean token of well 1 for non-bean token of well 2
    pipe.add({
      target: swap.quote.transaction.to,
      callData: swap.quote.transaction.data,
      clipboard: Clipboard.encode([]),
    });

    // 4: check balance of buyToken in pipeline.
    pipe.add(
      Eq2EQStrategy.snippets.erc20BalanceOf(swap.buyToken, pipelineAddress[resolveChainId(this.context.chainId)]),
    );

    // 4: transfer swap result to target well
    pipe.add(
      Eq2EQStrategy.snippets.erc20Transfer(
        swap.buyToken,
        target.well.pool.address,
        TV.ZERO, // overriden w/ clipboard
        Clipboard.encodeSlot(4, 0, 1),
      ),
    );

    // 5: transfer from from.well.tokens[non-bean index] to target well
    pipe.add(
      Eq2EQStrategy.snippets.erc20Transfer(
        source.well.tokens[sellTokenIndex === 1 ? 0 : 1],
        target.well.pool.address,
        TV.MAX_UINT256, // overriden w/ clipboard
        Clipboard.encodeSlot(1, 2, 1),
      ),
    );

    // 6. Call Sync on target well
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

  #getAddLiquidityParams(removeLPResult: TV[], swapQuote: ZeroXQuoteV2Response): TV[] {
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

  #decodeRemoveLiquidityResult(data: readonly HashString[]) {
    const decoded = decodeFunctionResult({
      abi: abiSnippets.advancedPipe,
      functionName: "advancedPipe",
      data: data[data.length - 1],
    });

    const removeLiquidityResult = decodeFunctionResult({
      abi: abiSnippets.wells.getRemoveLiquidityOut,
      functionName: "getRemoveLiquidityOut",
      data: decoded[decoded.length - 1],
    });

    return removeLiquidityResult;
  }

  #decodeAddLiquidityResult(data: readonly HashString[]) {
    const decoded = decodeFunctionResult({
      abi: abiSnippets.advancedPipe,
      functionName: "advancedPipe",
      data: data[data.length - 1],
    });

    const addLiquidityResult = decodeFunctionResult({
      abi: abiSnippets.wells.getAddLiquidityOut,
      functionName: "getAddLiquidityOut",
      data: decoded[decoded.length - 1],
    });

    return addLiquidityResult;
  }
}

export { Eq2EQStrategy as SiloConvertLP2LPEq2EqStrategy };
