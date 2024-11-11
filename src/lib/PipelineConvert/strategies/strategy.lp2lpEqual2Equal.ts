import { Clipboard } from "@/classes/Clipboard";
import { TV } from "@/classes/TokenValue";
import { PIPELINE_ADDRESS } from "@/constants/address";
import { ZeroX } from "@/lib/matcha/ZeroX";
import { ZeroExQuoteResponse } from "@/lib/matcha/types";
import { PickedCratesDetails, pickCrates, sortCratesByBDVRatio } from "@/utils/convert";
import { AdvancedPipeCall, DepositCrateData, DepositData, Token } from "@/utils/types";
import { multicall } from "@wagmi/core";
import Utils from "../utils";
import {
  BuildPipelineConvertPipeCallsParams,
  GetAddLiquidityOutResult,
  GetRemoveLiquidityOutResult,
  PipelineConvertStrategy,
} from "./PipelineConvertStrategy";

class Eq2EQStrategy extends PipelineConvertStrategy {
  // Getters
  get sellToken(): Token {
    return this.sourceWell.tokens[this.sourceIndexes.pair];
  }

  get buyToken(): Token {
    return this.targetWell.tokens[this.targetIndexes.pair];
  }

  async quote(deposits: DepositData[], amountIn: TV, addLiquiditySlippage: number, swapSlippage: number) {
    this.validateHasDeposits(deposits);
    this.validateAmountIn(amountIn);
    this.validateSlippage(swapSlippage);
    this.validateSlippage(addLiquiditySlippage);

    // use crates with the lowest bdv/amount ratio first.
    const sortedCrates = sortCratesByBDVRatio(deposits, "asc");
    const pickedCrates = pickCrates(sortedCrates, amountIn);

    const removeLPResult = await this.getRemoveLiquidityOut(pickedCrates.crates);

    const params = removeLPResult.amountsOut.map((amounts) => {
      const nonBeanAmount = amounts[this.sourceIndexes.pair];

      return this.generateSwapQuoteParams(this.buyToken, this.sellToken, nonBeanAmount, swapSlippage);
    });

    const swapQuotes = await ZeroX.quote(params);

    // Add Liquidity
    const depositAmountsIn = this.getAddLiquidityParams(removeLPResult, swapQuotes);

    const addLiquidityResults = await this.getAddLiquidityOut(depositAmountsIn);

    const convertResults = this.generateConvertResults(
      pickedCrates,
      removeLPResult,
      addLiquidityResults,
      addLiquiditySlippage,
      swapQuotes,
      this.buyToken,
      this.sellToken,
    );

    return {
      pickedCrates,
      results: convertResults,
      details: {
        removeLiquidity: removeLPResult,
        addLiquidity: addLiquidityResults,
      },
      totalAmountOut: addLiquidityResults.summedAmounts,
    };
  }

  async getRemoveLiquidityOut(pickedDeposits: DepositCrateData[]): Promise<GetRemoveLiquidityOutResult> {
    const [token0, token1] = this.sourceWell.tokens;
    const multicallContracts = Utils.constructMulticall.removeLiquidityEqual(this.sourceWell, pickedDeposits);
    const response = await Promise.all(
      multicallContracts.map((contracts) => multicall(this.config, { contracts, allowFailure: false })),
    );

    const rawResults = response.flat();
    const amountsOut = rawResults.map(([amountIndex0, amountIndex1]) => [
      TV.fromBlockchain(amountIndex0, token0.decimals),
      TV.fromBlockchain(amountIndex1, token1.decimals),
    ]);
    const summedAmounts = amountsOut.reduce(
      ([total0, total1], [amount0, amount1]) => [total0.add(amount0), total1.add(amount1)],
      [TV.fromHuman("0", token0.decimals), TV.fromHuman("0", token1.decimals)],
    );

    console.debug("[PipelineConvertStrategy/Equal2Equal] getRemoveLiquidityOut: ", {
      well: this.sourceWell.pool.name,
      wellAddress: this.sourceWell.pool.address,
      deposits: pickedDeposits,
      amountsOut,
      summedAmounts,
    });

    return {
      amountsOut,
      summedAmounts,
    };
  }

  private getAddLiquidityParams(removeLPResult: GetRemoveLiquidityOutResult, swapQuotes: ZeroExQuoteResponse[]) {
    const depositAmountsIn = removeLPResult.amountsOut.map((tokenAmountsOut, i) => {
      const mainAmountIn = tokenAmountsOut[this.sourceIndexes.main];
      const buyAmount = TV.fromBlockchain(swapQuotes[i].buyAmount, this.buyToken.decimals);

      const addLiquidityAmountsIn = [mainAmountIn, buyAmount];

      if (this.targetIndexes.main === 1) {
        addLiquidityAmountsIn.reverse();
      }

      return addLiquidityAmountsIn;
    });

    return depositAmountsIn;
  }

  async getAddLiquidityOut(amountsIn: TV[][]) {
    const multicallContracts = Utils.constructMulticall.addLiquidity(this.targetWell, amountsIn);

    const results = await Promise.all(
      multicallContracts.map((contracts) => multicall(this.config, { contracts, allowFailure: false })),
    );

    const rawResults = results.flat() as bigint[];
    const amountsOut = rawResults.map((r) => TV.fromBlockchain(r, this.targetWell.pool.decimals));

    const summedAmounts = amountsOut.reduce<TV>(
      (prev, curr) => prev.add(curr),
      TV.fromHuman(0, this.targetWell.pool.decimals),
    );

    console.debug("[PipelineConvertStrategy/Equal2Equal] getAddLiquidityOut: ", {
      well: this.targetWell,
      wellAddress: this.targetWell.pool.address,
      amountsIn,
      amountsOut,
      summedAmounts,
    });

    return {
      amountsOut,
      summedAmounts,
    };
  }

  /**
   * Aggregates the results of a pipeline convert.
   */
  protected generateConvertResults(
    pickedCratesDetails: PickedCratesDetails,
    removeLPResult: GetRemoveLiquidityOutResult,
    addLiquidityResults: GetAddLiquidityOutResult,
    addLiquiditySlippage: number,
    swapQuotes: ZeroExQuoteResponse[],
    buyToken: Token,
    sellToken: Token,
  ) {
    const convertResults = pickedCratesDetails.crates.map((crate, i) => {
      const amountOut = addLiquidityResults.amountsOut[i];
      const removeMinAmountsOut = removeLPResult.amountsOut[i].map((amount) =>
        amount.subSlippage(addLiquiditySlippage),
      );

      const params: BuildPipelineConvertPipeCallsParams = {
        source: {
          well: this.sourceWell,
          amountIn: crate.amount,
          minAmountsOut: removeMinAmountsOut,
        },
        swap: {
          buyToken,
          sellToken,
          quote: swapQuotes[i],
        },
        target: {
          well: this.targetWell,
          amountOut: amountOut.subSlippage(addLiquiditySlippage),
        },
      };

      const advPipeCalls = this.buildAdvancedPipeCalls(params);

      return {
        crate,
        advPipeCalls,
        amountOut,
      };
    });

    return convertResults;
  }

  buildAdvancedPipeCalls({ source, swap, target }: BuildPipelineConvertPipeCallsParams) {
    if (!swap) {
      throw new Error("Swap is required for equal2equal strategy");
    }

    const sellTokenIndex = source.well.tokens.findIndex(
      (t) => t.address.toLowerCase() === swap.sellToken.address.toLowerCase(),
    );

    const pipe: AdvancedPipeCall[] = [];

    // 0: approve from.well.lpToken to use from.well.lpToken
    pipe.push(Eq2EQStrategy.snippets.erc20Approve(source.well.pool, source.well.pool.address));

    // 1: remove liquidity from from.well
    pipe.push(
      Eq2EQStrategy.snippets.removeLiquidity(source.well, source.amountIn, source.minAmountsOut, PIPELINE_ADDRESS),
    );

    // 2: Approve swap contract to spend sellToken
    pipe.push(Eq2EQStrategy.snippets.erc20Approve(swap.sellToken, swap.quote.allowanceTarget));

    // 3: Swap non-bean token of well 1 for non-bean token of well 2
    pipe.push({
      target: swap.quote.to as `0x${string}`,
      callData: swap.quote.data as `0x${string}`,
      clipboard: Clipboard.encode([]),
    });

    // 4: transfer swap result to target well
    pipe.push(
      Eq2EQStrategy.snippets.erc20Transfer(
        swap.buyToken,
        target.well.pool.address,
        TV.ZERO, // overriden w/ clipboard
        Clipboard.encodeSlot(3, 0, 1),
      ),
    );

    // 5: transfer from from.well.tokens[non-bean index] to target well
    pipe.push(
      Eq2EQStrategy.snippets.erc20Transfer(
        source.well.tokens[sellTokenIndex === 1 ? 0 : 1],
        target.well.pool.address,
        TV.MAX_UINT256, // overriden w/ clipboard
        Clipboard.encodeSlot(1, 2, 1),
      ),
    );

    // 6. Call Sync on target well
    pipe.push(
      Eq2EQStrategy.snippets.wellSync(
        target.well,
        PIPELINE_ADDRESS, // set recipient to pipeline
        target.amountOut, // min LP Out
      ),
    );

    return pipe;
  }
}

export { Eq2EQStrategy as Lp2LPEqual2EqualPipelineConvertStrategy };
