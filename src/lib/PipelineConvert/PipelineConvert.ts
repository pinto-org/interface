import { Clipboard } from "@/classes/Clipboard";
import { TokenValue } from "@/classes/TokenValue";
import { abiSnippets } from "@/constants/abiSnippets";
import { PIPELINE_ADDRESS } from "@/constants/address";
import encoders from "@/encoders";
import erc20Approve from "@/encoders/erc20Approve";
import erc20Transfer from "@/encoders/erc20Transfer";
import sync from "@/encoders/sync";
import wellRemoveLiquidity from "@/encoders/wellRemoveLiquidity";
import { PoolData } from "@/state/usePriceData";
import { ConvertDetails, calculateConvert } from "@/utils/convert";
import { AdvancedPipeCall, DepositCrateData, DepositData, SiloTokenDataMap, Token } from "@/utils/types";
import { HashString, Prettify } from "@/utils/types.generic";
import { getPintoIndex } from "@/utils/well";
import { Config, multicall } from "@wagmi/core";
import { Address, decodeFunctionResult } from "viem";
import { ZeroX } from "../matcha/ZeroX";
import { MinimumViableSwapQuote } from "../matcha/types";
import Utils from "./utils";

const { pipelineConvert: pipelineConvertABI } = abiSnippets;

export type PipelineConvertQuote = Prettify<{
  encoded: ReturnType<typeof encoders.silo.pipelineConvert>;
  convertDetails: ConvertDetails;
  results: {
    deposit: DepositCrateData;
    advPipeCalls: AdvancedPipeCall[];
    amountOut: TokenValue;
  }[];
  amountOut: TokenValue;
  details: {
    removeLiquidity: Awaited<ReturnType<PipelineConvert["fetchEq2EqRemoveLiquidityOut"]>>;
    addLiquidity: Awaited<ReturnType<PipelineConvert["fetchEq2EqAddLiquidityOut"]>>;
  };
}>;

export type PipelineConvertDepositResult<T = TokenValue> = {
  toStem: T;
  fromAmount: T;
  toAmount: T;
  fromBdv: T;
  toBdv: T;
};

/**
 * Utility class for constructing pipeline converts
 */
export class PipelineConvert {
  /// Remove Equal 2 Add Equal
  // 1. Remove in equal parts from Well 1
  // 2. Swap non-bean token of well 1 for non-bean token of well 2
  // 3. Add in equal parts to well 2

  private readonly diamondAddress: string;
  readonly sourceWell: PoolData;
  readonly targetWell: PoolData;
  readonly config: Config;

  constructor(_diamondAddress: string, _sourceWell: PoolData, _targetWell: PoolData, _config: Config) {
    this.diamondAddress = _diamondAddress;
    this.sourceWell = _sourceWell;
    this.targetWell = _targetWell;
    this.config = _config;
  }

  /**
   * Estimates the result of a Remove Equal 2 Add Equal pipeline convert
   * @param sourceWell Well to remove liquidity from
   * @param targetWell Well to add liquidity to
   * @param siloTokenBalance Silo token balance of the user
   * @param amountIn Amount of sourceWell.lpToken to remove
   * @param slippage Slippage tolerance for swap
   */
  async fetchEq2Eq(
    deposits: DepositData[],
    amountIn: TokenValue,
    swapSlippage: number,
    addLiquiditySlippage: number,
    siloTokenData: SiloTokenDataMap,
  ): Promise<PipelineConvertQuote> {
    validateHasDeposits(deposits);
    validateAmountIn(amountIn);
    validateSlippage(swapSlippage);

    console.debug("[PipelineConvert] estimateRemoveEqual2AddEqual", {
      sourceWell: this.sourceWell,
      targetWell: this.targetWell,
      amountIn: amountIn.toHuman(),
      swapSlippage,
    });

    const sourceLP = this.sourceWell.pool;
    const targetLP = this.targetWell.pool;

    // calculate convert details
    const convertDetails = calculateConvert(sourceLP, targetLP, amountIn, deposits, siloTokenData);

    // Remove Liquidity
    const removeLPResult = await this.fetchEq2EqRemoveLiquidityOut(convertDetails.crates);

    const sourceIndexes = getPintoIndex(this.sourceWell);
    const targetIndexes = getPintoIndex(this.sourceWell);

    if (!sourceIndexes || !targetIndexes) {
      throw new Error("Cannot determine token indexes");
    }

    // Swap
    const sellToken = this.sourceWell.tokens[sourceIndexes.nonPinto];
    const buyToken = this.targetWell.tokens[targetIndexes.nonPinto];

    const params = removeLPResult.amountsOut.map((amounts) => {
      const nonBeanAmount = amounts[sourceIndexes.nonPinto];

      return this.generateSwapQuoteParams(buyToken, sellToken, nonBeanAmount, swapSlippage);
    });

    const swapQuotes = await ZeroX.quote(params);

    // Add Liquidity
    const denominator = removeLPResult.summedAmounts[sourceIndexes.nonPinto];

    const depositAmountsIn = removeLPResult.amountsOut.map((tokenAmountsOut, i) => {
      const pintoOut = removeLPResult.amountsOut[i][sourceIndexes.pinto];
      const nonPintoOut = tokenAmountsOut[sourceIndexes.nonPinto];

      const ratio = nonPintoOut.div(denominator);

      const buyAmount = TokenValue.fromBlockchain(swapQuotes[i].buyAmount, buyToken.decimals);

      const addLiquidityAmountsIn = [pintoOut, buyAmount.mul(ratio)];

      if (targetIndexes.pinto === 1) {
        addLiquidityAmountsIn.reverse();
      }

      return addLiquidityAmountsIn;
    });

    const addLiquidityResults = await this.fetchEq2EqAddLiquidityOut(depositAmountsIn);

    const convertResults = convertDetails.crates.map((deposit, i) => {
      const amountOut = addLiquidityResults.amountsOut[i];
      const advPipeCalls = PipelineConvert.buildEq2EqAdvancedPipe({
        source: {
          well: this.sourceWell,
          amountIn: deposit.amount,
          minAmountsOut: removeLPResult.amountsOut[i],
        },
        swap: {
          buyToken: buyToken,
          sellToken: sellToken,
          quote: swapQuotes[i],
        },
        target: {
          well: this.targetWell,
          amountOut: amountOut.subSlippage(addLiquiditySlippage),
        },
      });

      return {
        deposit,
        advPipeCalls,
        amountOut,
      };
    });

    const encodePrepared = convertResults.map((result) => {
      return {
        stem: result.deposit.stem,
        amount: result.deposit.amount,
        advPipeCalls: result.advPipeCalls,
      };
    });

    const encoded = encoders.silo.pipelineConvert(this.sourceWell.pool, this.targetWell.pool, encodePrepared);

    return {
      convertDetails,
      results: convertResults,
      encoded,
      amountOut: addLiquidityResults.summedAmounts,
      details: {
        removeLiquidity: removeLPResult,
        addLiquidity: addLiquidityResults,
      },
    };
  }

  private generateSwapQuoteParams(buyToken: Token, sellToken: Token, sellAmount: TokenValue, slippage: number) {
    return {
      sellToken: sellToken.address as Address,
      buyToken: buyToken.address as Address,
      sellAmount: sellAmount.blockchainString,
      takerAddress: PIPELINE_ADDRESS as Address,
      shouldSellEntireBalance: "true",
      skipValidation: "true",
      slippagePercentage: slippage.toString(),
    };
  }

  private async fetchEq2EqRemoveLiquidityOut(pickedDeposits: DepositCrateData[]) {
    const [token0, token1] = this.sourceWell.tokens;
    const multicallContracts = Utils.constructMulticall.removeLiquidityEqual(this.sourceWell, pickedDeposits);
    const response = await Promise.all(
      multicallContracts.map((contracts) => multicall(this.config, { contracts: contracts, allowFailure: false })),
    );

    const rawResults = response.flat() as bigint[][];
    const amountsOut = rawResults.map(([amountIndex0, amountIndex1]) => [
      TokenValue.fromBlockchain(amountIndex0, token0.decimals),
      TokenValue.fromBlockchain(amountIndex1, token1.decimals),
    ]);
    const summedAmounts = amountsOut.reduce(
      ([total0, total1], [amount0, amount1]) => [total0.add(amount0), total1.add(amount1)],
      [TokenValue.fromHuman("0", token0.decimals), TokenValue.fromHuman("0", token1.decimals)],
    );

    console.log("[PipelineConvert] fetchEq2EqRemoveLiquidityOut: ", {
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

  private async fetchEq2EqAddLiquidityOut(amountsIn: TokenValue[][]) {
    const results = await Promise.all(
      Utils.constructMulticall
        .addLiquidity(this.targetWell, amountsIn)
        .map((contracts) => multicall(this.config, { contracts, allowFailure: false })),
    );
    const rawResults = results.flat() as bigint[];
    const amountsOut = rawResults.map((r) => TokenValue.fromBlockchain(r, this.targetWell.pool.decimals));

    const summedAmounts = amountsOut.reduce<TokenValue>(
      (prev, curr) => prev.add(curr),
      TokenValue.fromHuman(0, this.targetWell.pool.decimals),
    );

    console.debug("[PipelineConvert] fetchEq2EqAddLiquidityOut: ", {
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
   * Builds the advanced pipe calls for a Remove Equal 2 Add Equal pipeline convert
   */
  private static buildEq2EqAdvancedPipe(params: {
    source: {
      well: PoolData;
      amountIn: TokenValue;
      minAmountsOut: TokenValue[];
    };
    swap: {
      buyToken: Token;
      sellToken: Token;
      quote: MinimumViableSwapQuote;
    };
    target: {
      well: PoolData;
      amountOut: TokenValue;
    };
  }) {
    const { source, swap, target } = params;

    const sellTokenIndex = source.well.tokens.findIndex(
      (t) => t.address.toLowerCase() === swap.sellToken.address.toLowerCase(),
    );

    const pipe: AdvancedPipeCall[] = [];

    // 0: approve from.well.lpToken to use from.well.lpToken
    pipe.push(PipelineConvert.snippets.erc20Approve(source.well.pool, source.well.pool.address));

    // 1: remove liquidity from from.well
    pipe.push(
      PipelineConvert.snippets.removeLiquidity(source.well, source.amountIn, source.minAmountsOut, PIPELINE_ADDRESS),
    );

    // 2: Approve swap contract to spend sellToken
    pipe.push(PipelineConvert.snippets.erc20Approve(swap.sellToken, swap.quote.allowanceTarget));

    // 3: Swap non-bean token of well 1 for non-bean token of well 2
    pipe.push({
      target: swap.quote.to as `0x${string}`,
      callData: swap.quote.data as `0x${string}`,
      clipboard: Clipboard.encode([]),
    });

    // 4: transfer swap result to target well
    pipe.push(
      PipelineConvert.snippets.erc20Transfer(
        swap.buyToken,
        target.well.pool.address,
        TokenValue.ZERO, // overriden w/ clipboard
        Clipboard.encodeSlot(3, 0, 1),
      ),
    );

    // 5: transfer from from.well.tokens[non-bean index] to target well
    pipe.push(
      PipelineConvert.snippets.erc20Transfer(
        source.well.tokens[sellTokenIndex === 1 ? 0 : 1],
        target.well.pool.address,
        TokenValue.MAX_UINT256, // overriden w/ clipboard
        Clipboard.encodeSlot(1, 2, 1),
      ),
    );

    // 6. Call Sync on target well
    pipe.push(
      PipelineConvert.snippets.wellSync(
        target.well,
        PIPELINE_ADDRESS, // set recipient to pipeline
        target.amountOut, // min LP Out
      ),
    );

    return pipe;
  }

  // ---------- static methods ----------
  private static snippets = {
    // ERC20 Token Methods
    erc20Approve: (
      token: Token,
      spender: HashString,
      amount: TokenValue = TokenValue.MAX_UINT256,
      clipboard: HashString = Clipboard.encode([]),
    ): AdvancedPipeCall => {
      return {
        ...erc20Approve(spender, amount, token.address, clipboard),
        target: token.address,
      };
    },
    erc20Transfer: (
      token: Token,
      recipient: HashString,
      amount: TokenValue,
      clipboard: HashString = Clipboard.encode([]),
    ): AdvancedPipeCall => {
      return {
        ...erc20Transfer(recipient, amount, token.address, clipboard),
        target: token.address,
      };
    },
    // // Well Methods
    removeLiquidity: (
      well: PoolData,
      amountIn: TokenValue,
      minAmountsOut: TokenValue[],
      recipient: Address,
      clipboard: HashString = Clipboard.encode([]),
    ): AdvancedPipeCall => {
      return wellRemoveLiquidity(well, amountIn, minAmountsOut, recipient, clipboard);
    },
    wellSync: (
      well: PoolData,
      recipient: Address,
      amount: TokenValue,
      clipboard: HashString = Clipboard.encode([]),
    ): AdvancedPipeCall => {
      return {
        ...sync(recipient, amount, well.pool.address, clipboard),
        target: well.pool.address,
      };
    },
    // Junction methods
    gte: (value: TokenValue, compareTo: TokenValue, clipboard: HashString = Clipboard.encode([])): AdvancedPipeCall => {
      return encoders.junction.gte(value, compareTo, clipboard);
    },
    check: (
      // index of the math or logic operation in the pipe
      index: number,
      // copy slot
      copySlot: number,
    ): AdvancedPipeCall => {
      return encoders.junction.check(index, copySlot);
    },
  };

  static decodeStaticResults(results: string[]): PipelineConvertDepositResult<bigint>[] {
    try {
      const data = results.map((result) => {
        const decoded = decodeFunctionResult<typeof pipelineConvertABI>({
          abi: pipelineConvertABI,
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
      console.error("[PipelineConvert/decodeStaticResult] FAILED: ", e);
      throw e;
    }
  }

  static getEmptyResult(): PipelineConvertQuote {
    return {
      convertDetails: {
        amount: TokenValue.ZERO,
        bdv: TokenValue.ZERO,
        stalk: TokenValue.ZERO,
        seeds: TokenValue.ZERO,
        actions: [],
        crates: [],
      },
      encoded: [],
      results: [],
      amountOut: TokenValue.ZERO,
      details: {
        removeLiquidity: {
          amountsOut: [],
          summedAmounts: [TokenValue.ZERO, TokenValue.ZERO],
        },
        addLiquidity: {
          amountsOut: [],
          summedAmounts: TokenValue.ZERO,
        },
      },
    };
  }
}

// validation
function validateAmountIn(amountIn: TokenValue) {
  if (amountIn.lte(0)) {
    throw new Error("Cannot convert 0 or less tokens");
  }
}

function validateHasDeposits(deposits: DepositData[]) {
  if (!deposits.length) {
    throw new Error("No convertible deposits");
  }
}

function validateSlippage(slippage: number) {
  if (slippage < 0) {
    throw new Error("Invalid slippage");
  }
}
