import { Clipboard } from "@/classes/Clipboard";
import { TV } from "@/classes/TokenValue";
import { PIPELINE_ADDRESS } from "@/constants/address";
import { pickCrates, sortCratesByBDVRatio } from "@/utils/convert";
import { AdvancedPipeCall, DepositCrateData, DepositData, Token } from "@/utils/types";
import { BinaryWellTokenIndexes } from "@/utils/well";
import { multicall } from "@wagmi/core";
import { tokensEqual } from "../../../utils/token";
import Utils from "../utils";
import {
  BuildPipelineConvertPipeCallsParams,
  GetAddLiquidityOutResult,
  GetRemoveLiquidityOutResult,
  PipelineConvertStrategy,
} from "./PipelineConvertStrategy";

class OneSidedSameToken extends PipelineConvertStrategy {
  /**
   * The index of the token in the well to remove liquidity from.
   */
  readonly removeIndex: number;

  /**
   * The index of the token in the well to add liquidity to.
   */
  readonly addIndex: number;

  constructor(
    removeIndex: keyof BinaryWellTokenIndexes,
    addIndex: keyof BinaryWellTokenIndexes,
    ...args: ConstructorParameters<typeof PipelineConvertStrategy>
  ) {
    super(...args);
    this.removeIndex = this.sourceIndexes[removeIndex];
    this.addIndex = this.targetIndexes[addIndex];

    const removeToken = this.sourceWell.tokens[this.removeIndex];
    const addToken = this.targetWell.tokens[this.addIndex];

    if (!tokensEqual(removeToken, addToken)) {
      throw new Error("Remove and add indexes must point to the same token");
    }
  }

  // Token that is being removed and added from and to the two wells
  get token(): Token {
    return this.sourceWell.tokens[this.removeIndex];
  }

  //
  async quote(deposits: DepositData[], amountIn: TV, addLiquiditySlippage: number) {
    this.validateHasDeposits(deposits);
    this.validateAmountIn(amountIn);
    this.validateSlippage(addLiquiditySlippage);

    const sortedCrates = sortCratesByBDVRatio(deposits, "asc");
    const pickedCrates = pickCrates(sortedCrates, amountIn);

    const removeLPResult = await this.getRemoveLiquidityOut(pickedCrates.crates);

    const addLiquidityParams = removeLPResult.amountsOut.map((amounts) => amounts[this.removeIndex]);

    const addLiquidityResult = await this.getAddLiquidityOut(addLiquidityParams);

    const convertResults = pickedCrates.crates.map((crate, i) => {
      const amountOut = addLiquidityResult.amountsOut[i];
      const minAmountsOut = removeLPResult.amountsOut[i].map((amount) => amount.subSlippage(addLiquiditySlippage));

      const params = {
        source: {
          well: this.sourceWell,
          amountIn: crate.amount,
          minAmountsOut,
        },
        target: {
          well: this.targetWell,
          amountOut: amountOut.subSlippage(addLiquiditySlippage),
        },
      };

      const advPipeCalls = this.buildAdvancedPipeCalls(params);

      return { crate, advPipeCalls, amountOut };
    });

    return {
      pickedCrates,
      results: convertResults,
      details: {
        removeLiquidity: removeLPResult,
        addLiquidity: addLiquidityResult,
      },
      totalAmountOut: addLiquidityResult.summedAmounts,
    };
  }

  async getRemoveLiquidityOut(pickedDeposits: DepositCrateData[]): Promise<GetRemoveLiquidityOutResult> {
    // construct multicall contracts
    const multicallContracts = Utils.constructMulticall.removeLiquidityOneToken(
      this.sourceWell,
      this.removeIndex,
      pickedDeposits,
    );

    const response = await Promise.all(
      multicallContracts.map((contracts) => multicall(this.config, { contracts, allowFailure: false })),
    );

    const amountsOut: TV[][] = [];
    const summedAmounts: TV[] = [TV.ZERO, TV.ZERO];

    for (const amount of response.flat()) {
      const amountTV = TV.fromBlockchain(amount, this.token.decimals);
      const amounts = [amountTV, TV.ZERO];

      if (this.removeIndex === 0) {
        summedAmounts[0] = summedAmounts[0].add(amountTV);
      } else {
        amounts.reverse();
        summedAmounts[1] = summedAmounts[1].add(amountTV);
      }

      amountsOut.push(amounts);
    }

    return {
      amountsOut,
      summedAmounts,
    };
  }

  async getAddLiquidityOut(removeAmountsOut: TV[]): Promise<GetAddLiquidityOutResult> {
    const amountsIn = removeAmountsOut.map((amount) => {
      const amounts = [amount, TV.ZERO];
      return this.addIndex === 1 ? amounts.reverse() : amounts;
    });

    const multicallContracts = Utils.constructMulticall.addLiquidity(this.targetWell, amountsIn);

    const response = await Promise.all(
      multicallContracts.map((contracts) => multicall(this.config, { contracts, allowFailure: false })),
    );

    let summedLPAmount = TV.fromHuman(0, this.targetLP.decimals);
    const amountsOut: TV[] = [];

    for (const amount of response.flat()) {
      const amountTV = TV.fromBlockchain(amount, this.targetLP.decimals);
      amountsOut.push(amountTV);
      summedLPAmount = summedLPAmount.add(amountTV);
    }

    return {
      amountsOut,
      summedAmounts: summedLPAmount,
    };
  }

  buildAdvancedPipeCalls({ source, target }: BuildPipelineConvertPipeCallsParams) {
    const pipe: AdvancedPipeCall[] = [];

    // 0. approve sourceWell to use sourceWell.LPToken in Pipeline (max)
    pipe.push(OneSidedSameToken.snippets.erc20Approve(source.well.pool, source.well.pool.address));

    // 1. remove liquidity from sourceWell
    pipe.push(
      OneSidedSameToken.snippets.removeLiquidityOneToken(
        source.well,
        source.amountIn,
        this.token,
        source.minAmountsOut[this.removeIndex],
        PIPELINE_ADDRESS,
      ),
    );

    // 2. approve targetWell to use add token in Pipeline (max)
    pipe.push(OneSidedSameToken.snippets.erc20Approve(target.well.pool, target.well.pool.address));

    // 3. transfer from token we removed to targetWell
    pipe.push(
      OneSidedSameToken.snippets.erc20Transfer(
        source.well.tokens[this.removeIndex],
        target.well.pool.address,
        TV.MAX_UINT256, // this amount will be replaced via clipboard
        Clipboard.encodeSlot(1, 0, 1), // amountOut from removeLiquidityOneToken is in index 1
      ),
    );

    pipe.push(OneSidedSameToken.snippets.wellSync(target.well, PIPELINE_ADDRESS, target.amountOut));

    return pipe;
  }
}

export { OneSidedSameToken as LP2LPOneSidedSameTokenPipelineConvertStrategy };
