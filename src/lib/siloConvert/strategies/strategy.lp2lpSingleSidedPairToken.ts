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
import { tokensEqual } from "@/utils/token";
import { Token } from "@/utils/types";
import { HashString } from "@/utils/types.generic";
import { decodeFunctionResult, encodeFunctionData } from "viem";
import { ConvertStrategyQuote } from "./ConvertStrategy";
import { SiloConvertLP2LPConvertStrategy, SourceSummaryLP2LP, TargetSummaryLP2LP } from "./LP2LPConvertStrategy";

class OneSidedPairToken extends SiloConvertLP2LPConvertStrategy {
  // The index of the token in the well to remove liquidity from.
  readonly removeIndex: number;

  // The index of the token in the well to add liquidity to.
  readonly addIndex: number;

  // The token to remove liquidity from.
  readonly removeToken: Token;

  // The token to add liquidity to.
  readonly addToken: Token;

  constructor(...args: ConstructorParameters<typeof SiloConvertLP2LPConvertStrategy>) {
    super(...args);
    this.removeIndex = this.sourceIndexes.pair;
    this.addIndex = this.targetIndexes.pair;

    const removeToken = this.sourceWell.tokens[this.removeIndex];
    const addToken = this.targetWell.tokens[this.addIndex];

    if (removeToken.isMain) {
      throw new Error(`Remove index ${this.removeIndex} must not be the main token`);
    }

    if (addToken.isMain) {
      throw new Error(`Add index ${this.addIndex} must be the main token`);
    }

    if (tokensEqual(removeToken, addToken)) {
      throw new Error("Remove and add indexes must be different tokens");
    }

    this.removeToken = removeToken;
    this.addToken = addToken;
  }

  // ------------------------------ Quote ------------------------------ //

  async quote(deposits: ExtendedPickedCratesDetails, advancedFarm: AdvancedFarmWorkflow, slippage: number) {
    this.validatePickedCrates(deposits);
    this.validateAmountIn(deposits.totalAmount);
    this.validateSlippage(slippage);

    const amountsOut = await this.#getRemoveLiquidityOut(deposits, advancedFarm);
    const pairAmountOut = amountsOut[this.removeIndex];

    const swapParams = this.generateSwapQuoteParams(this.addToken, this.removeToken, pairAmountOut, slippage);

    // Swap
    const swapQuotes = await ZeroX.quote(swapParams);
    if (swapQuotes.length !== 1) {
      throw new Error("Expected 1 swap quote");
    }

    console.debug("[SiloConvert/OneSidedPairToken] swapQuotes: ", {
      amountsOut,
      swapQuotes,
    });

    const addAmountOut = await this.#getAddLiquidityOut(swapQuotes[0], advancedFarm);
    console.debug("[SiloConvert/OneSidedPairToken] addAmountOut: ", {
      addAmountOut: addAmountOut.toHuman(),
    });

    const swapSummary = this.makeSwapSummary(
      swapQuotes[0],
      this.removeToken,
      this.addToken,
      this.sourceWell.pair.price,
      this.targetWell.pair.price,
    );

    const summary = {
      source: {
        token: this.sourceWell.pool,
        removeTokens: [this.removeToken],
        well: this.sourceWell,
        amountIn: deposits.totalAmount,
        amountOut: amountsOut,
        minAmountOut: amountsOut.map((amount) => amount.subSlippage(slippage)),
      },
      swap: swapSummary,
      target: {
        token: this.targetWell.pool,
        addTokens: [this.addToken],
        well: this.targetWell,
        amountOut: addAmountOut,
        minAmountOut: addAmountOut.subSlippage(slippage),
      },
    };

    return {
      pickedCrates: deposits,
      advPipeCalls: this.buildAdvancedPipeCalls(summary),
      amountOut: addAmountOut,
      summary,
    };
  }

  // ------------------------------ Build Advanced Pipe Calls ------------------------------ //

  buildAdvancedPipeCalls({
    source,
    swap,
    target,
  }: ConvertStrategyQuote<SourceSummaryLP2LP, TargetSummaryLP2LP>["summary"]) {
    if (!swap) {
      throw new Error("Swap is required for one sided pair token strategy");
    }

    const pipe = new AdvancedPipeWorkflow(this.context.chainId, this.context.wagmiConfig);

    // 0: approve from.well.lpToken to use from.well.lpToken
    pipe.add(OneSidedPairToken.snippets.erc20Approve(source.well.pool, source.well.pool.address));

    // 1. remove liquidity from from.well as removeToken
    pipe.add(
      OneSidedPairToken.snippets.removeLiquidityOneToken(
        source.well,
        source.amountIn,
        this.removeToken,
        source.minAmountOut[this.removeIndex],
        pipelineAddress[resolveChainId(this.context.chainId)],
      ),
    );

    // 2. approve swap contract to spend sellToken
    pipe.add(OneSidedPairToken.snippets.erc20Approve(swap.sellToken, swap.quote.transaction.to));

    // 3. swap removeToken for addToken via 0x
    pipe.add({
      target: swap.quote.transaction.to,
      callData: swap.quote.transaction.data,
      clipboard: Clipboard.encode([]),
    });

    // 4. get balance of buyToken
    pipe.add(
      OneSidedPairToken.snippets.erc20BalanceOf(swap.buyToken, pipelineAddress[resolveChainId(this.context.chainId)]),
    );

    // 5. transfer swap result to target well
    pipe.add(
      OneSidedPairToken.snippets.erc20Transfer(
        swap.buyToken,
        target.well.pool.address,
        TV.MAX_UINT256, // overriden w/ clipboard
        Clipboard.encodeSlot(4, 0, 1),
      ),
    );

    // 6. call Sync on target well
    pipe.add(OneSidedPairToken.snippets.wellSync(target.well, PIPELINE_ADDRESS, target.minAmountOut));

    return pipe;
  }

  // ------------------------------ Private Methods ------------------------------ //

  async #getAddLiquidityOut(swapQuote: ZeroXQuoteV2Response, advancedFarm: AdvancedFarmWorkflow) {
    const buyAmount = TV.fromBlockchain(swapQuote.minBuyAmount, this.addToken.decimals);

    const amountsIn = [TV.ZERO, buyAmount];
    if (this.addIndex === 0) {
      amountsIn.reverse();
    }

    const pipe = this.#constructAddAdvancedPipe(amountsIn);

    const simulate = await advancedFarm.simulate({
      after: pipe,
      account: this.context.account,
    });

    const addAmountOut = this.#decodeAddLiquidityResult(simulate.result);

    return TV.fromBigInt(addAmountOut, this.targetWell.pool.decimals);
  }

  async #getRemoveLiquidityOut(
    pickedCratesDetails: ExtendedPickedCratesDetails,
    advancedFarm: AdvancedFarmWorkflow,
  ): Promise<TV[]> {
    const pipe = this.#constructRemoveAdvancedPipe(pickedCratesDetails.totalAmount);

    const result = await advancedFarm.simulate({
      after: pipe,
      account: this.context.account,
    });

    const decodedResults = this.#decodeRemoveLiquidityResult(result.result);

    const amountsOut = [TV.ZERO, TV.fromBigInt(decodedResults, this.removeToken.decimals)];

    if (this.removeIndex === 0) {
      amountsOut.reverse();
    }

    return amountsOut;
  }

  // ------------------------------ Construct Advanced Pipe Methods ------------------------------ //

  #constructRemoveAdvancedPipe(amount: TV) {
    const pipe = new AdvancedPipeWorkflow(this.context.chainId, this.context.wagmiConfig);
    pipe.add({
      target: this.sourceWell.pool.address,
      callData: encodeFunctionData({
        abi: abiSnippets.wells.getRemoveLiquidityOneTokenOut,
        functionName: "getRemoveLiquidityOneTokenOut",
        args: [amount.toBigInt(), this.sourceWell.tokens[this.removeIndex].address],
      }),
      clipboard: Clipboard.encode([]),
    });

    return pipe;
  }

  #constructAddAdvancedPipe(amountsIn: TV[]) {
    const pipe = new AdvancedPipeWorkflow(this.context.chainId, this.context.wagmiConfig);

    pipe.add({
      target: this.targetWell.pool.address,
      callData: encodeFunctionData({
        abi: abiSnippets.wells.getAddLiquidityOut,
        functionName: "getAddLiquidityOut",
        args: [amountsIn.map((v) => v.toBigInt())],
      }),
      clipboard: Clipboard.encode([]),
    });

    return pipe;
  }

  // ------------------------------ Decode Methods ------------------------------ //

  #decodeRemoveLiquidityResult(data: readonly HashString[]): bigint {
    if (!data.length) {
      throw new Error("No data to decode");
    }

    const decoded = AdvancedPipeWorkflow.decodeResult(data[data.length - 1]);

    const removeAmountBigInt = decodeFunctionResult({
      abi: abiSnippets.wells.getRemoveLiquidityOneTokenOut,
      functionName: "getRemoveLiquidityOneTokenOut",
      data: decoded[decoded.length - 1], // Last index
    });

    return removeAmountBigInt;
  }

  #decodeAddLiquidityResult(data: readonly HashString[]): bigint {
    if (!data.length) {
      throw new Error("No data to decode");
    }

    const decoded = AdvancedPipeWorkflow.decodeResult(data[data.length - 1]);

    return decodeFunctionResult({
      abi: abiSnippets.wells.getAddLiquidityOut,
      functionName: "getAddLiquidityOut",
      data: decoded[decoded.length - 1],
    });
  }
}

export { OneSidedPairToken as SiloConvertLP2LPSingleSidedPairTokenStrategy };
