import { Clipboard } from "@/classes/Clipboard";
import { TV, TokenValue } from "@/classes/TokenValue";
import { PIPELINE_ADDRESS } from "@/constants/address";

import encoders from "@/encoders";
import erc20Approve from "@/encoders/erc20Approve";
import erc20Transfer from "@/encoders/erc20Transfer";
import sync from "@/encoders/sync";
import wellRemoveLiquidity from "@/encoders/wellRemoveLiquidity";
import { MinimumViableSwapQuote, ZeroExQuoteResponse } from "@/lib/matcha/types";
import { PoolData } from "@/state/usePriceData";
import { PickedCratesDetails } from "@/utils/convert";
import { AdvancedPipeCall, DepositCrateData, DepositData, Token } from "@/utils/types";
import { HashString } from "@/utils/types.generic";
import { BinaryWellTokenIndexes, resolveBinaryWellTokenIndexes } from "@/utils/well";
import { Address } from "viem";
import { Config as WagmiConfig } from "wagmi";

export interface GetRemoveLiquidityOutResult {
  /**
   * The amounts out given the picked deposits.
   */
  amountsOut: TV[][];
  /**
   * The summed amounts out.
   */
  summedAmounts: TV[];
}

export interface GetAddLiquidityOutResult {
  /**
   * The amounts out for each deposit.
   */
  amountsOut: TV[];
  /**
   * The summed amounts out.
   */
  summedAmounts: TV;
}

export interface PipelineConvertStrategyQuoteResult {
  /**
   * The calculated details of the convert.
   */
  pickedCrates: PickedCratesDetails;
  /**
   * The results of the convert.
   */
  results: {
    crate: DepositCrateData;
    advPipeCalls: AdvancedPipeCall[];
    amountOut: TV;
  }[];
  details: {
    removeLiquidity: GetRemoveLiquidityOutResult;
    addLiquidity: GetAddLiquidityOutResult;
  };
  totalAmountOut: TV;
}

export interface BuildPipelineConvertPipeCallsParams {
  source: {
    well: PoolData;
    amountIn: TV;
    minAmountsOut: TV[];
  };
  target: {
    well: PoolData;
    amountOut: TV;
  };
  swap?: {
    buyToken: Token;
    sellToken: Token;
    quote: MinimumViableSwapQuote;
  };
}

export abstract class PipelineConvertStrategy {
  readonly sourceWell: PoolData;
  readonly targetWell: PoolData;
  readonly sourceIndexes: BinaryWellTokenIndexes;
  readonly targetIndexes: BinaryWellTokenIndexes;

  readonly config: WagmiConfig;

  constructor(sourceWell: PoolData, targetWell: PoolData, config: WagmiConfig) {
    this.sourceWell = sourceWell;
    this.targetWell = targetWell;
    this.config = config;

    this.sourceIndexes = resolveBinaryWellTokenIndexes(sourceWell);
    this.targetIndexes = resolveBinaryWellTokenIndexes(targetWell);
  }

  /// ------------------------------ Getters ------------------------------ ///

  get sourceLP(): Token {
    return this.sourceWell.pool;
  }

  get targetLP(): Token {
    return this.targetWell.pool;
  }

  /// ------------------------------ Public Methods ------------------------------ ///

  encodeConvertResults(convertResults: PipelineConvertStrategyQuoteResult["results"]) {
    const encodePrepared = convertResults.map((result) => {
      return {
        stem: result.crate.stem,
        amount: result.crate.amount,
        advPipeCalls: result.advPipeCalls,
      };
    });

    return [...encoders.silo.pipelineConvert(this.sourceWell.pool, this.targetWell.pool, encodePrepared)] as const;
  }

  /// ------------------------------ Abstract Methods ------------------------------ ///

  /**
   * Quote a Pipeline convert.
   * @param deposits - The deposits to convert.
   * @param amountIn - The amount in to convert.
   * @param siloTokenData - The silo token data.
   * @param swapSlippage - The swap slippage for 0x if applicable.
   * @param addLiquiditySlippage - The add liquidity slippage.
   */
  abstract quote(
    deposits: DepositData[],
    amountIn: TV,
    addLiquiditySlippage?: number,
    swapSlippage?: number,
  ): Promise<PipelineConvertStrategyQuoteResult>;

  /**
   * @param amountsIn - The amounts in for each deposit.
   * @returns The amounts out for each deposit and the summed amounts out.
   */
  abstract buildAdvancedPipeCalls(params: BuildPipelineConvertPipeCallsParams): AdvancedPipeCall[];

  /// ------------------------------ Protected Methods ------------------------------ ///

  /**
   * generates the params for a swap quote
   * @param buyToken - The token to buy.
   * @param sellToken - The token to sell.
   * @param sellAmount - The amount to sell.
   * @param slippage - The slippage percentage.
   * @returns The swap quote params.
   */
  protected generateSwapQuoteParams(buyToken: Token, sellToken: Token, sellAmount: TV, slippage: number) {
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

  /// ------------------------------ Validation Methods ------------------------------ ///

  protected validateHasDeposits(deposits: DepositData[]) {
    if (deposits.length === 0) {
      throw new Error("No deposits provided");
    }
  }

  protected validateAmountIn(amountIn: TV) {
    if (amountIn.lte(0)) {
      throw new Error("Cannot convert 0 or less tokens");
    }
  }

  protected validateSlippage(slippage: number) {
    if (slippage < 0) {
      throw new Error("Invalid slippage");
    }
  }

  /// ------------------------------ Static Methods ------------------------------ ///

  protected static snippets = {
    // ERC20 Token Methods
    erc20Approve: (
      token: Token,
      spender: HashString,
      amount: TV = TV.MAX_UINT256,
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
      return encoders.well.removeLiquidity(well, amountIn, minAmountsOut, recipient, clipboard);
    },
    removeLiquidityOneToken: (
      well: PoolData,
      amountIn: TokenValue,
      tokenOut: Token,
      minAmountOut: TokenValue,
      recipient: Address,
      clipboard: HashString = Clipboard.encode([]),
    ): AdvancedPipeCall => {
      return encoders.well.removeLiquidityOneToken(well, amountIn, tokenOut, minAmountOut, recipient, clipboard);
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
}
