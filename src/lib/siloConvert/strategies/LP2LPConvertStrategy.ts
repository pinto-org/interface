import { Clipboard } from "@/classes/Clipboard";
import { TV } from "@/classes/TokenValue";
import encoders from "@/encoders";
import erc20Approve from "@/encoders/erc20Approve";
import erc20Transfer from "@/encoders/erc20Transfer";
import sync from "@/encoders/sync";
import { pipelineAddress } from "@/generated/contractHooks";
import { AdvancedFarmWorkflow, AdvancedPipeWorkflow } from "@/lib/farm/workflow";
import { ZeroX } from "@/lib/matcha/ZeroX";
import { ZeroXQuoteV2Parameters, ZeroXQuoteV2Response } from "@/lib/matcha/types";
import { resolveChainId } from "@/utils/chain";
import { ExtendedPickedCratesDetails } from "@/utils/convert";
import { stringEq } from "@/utils/string";
import { tokensEqual } from "@/utils/token";
import { AdvancedPipeCall, DepositData, Token } from "@/utils/types";
import { HashString } from "@/utils/types.generic";
import { isAddress } from "viem";
import { SiloConvertContext } from "../SiloConvert";
import { ExtendedPoolData } from "../SiloConvert.cache";
import {
  ConvertStrategyQuote,
  SiloConvertSourceSummary,
  SiloConvertStrategy,
  SiloConvertSwapQuote,
  SiloConvertTargetSummary,
} from "./ConvertStrategy";

export interface SourceSummaryLP2LP extends SiloConvertSourceSummary {
  well: ExtendedPoolData;
  removeTokens: Token[];
  amountOut: TV[];
  minAmountOut: TV[];
}

export interface TargetSummaryLP2LP extends SiloConvertTargetSummary {
  well: ExtendedPoolData;
  addTokens: Token[];
  minAmountOut: TV;
}

export type LP2LPConvertStrategyResult = ConvertStrategyQuote<SourceSummaryLP2LP, TargetSummaryLP2LP>;

export abstract class LP2LPStrategy extends SiloConvertStrategy {
  encoding: { callData: `0x${string}`; clipboard: `0x${string}` } | undefined = undefined;

  readonly sourceWell: ExtendedPoolData;

  readonly targetWell: ExtendedPoolData;

  constructor(source: ExtendedPoolData, target: ExtendedPoolData, context: SiloConvertContext) {
    super(source.pool, target.pool, context);
    this.sourceWell = source;
    this.targetWell = target;
  }

  /// ------------------------------ Getters ------------------------------ ///

  get sourceIndexes() {
    const pairIndex = this.sourceWell.pair.index;
    return {
      pair: pairIndex,
      main: pairIndex === 1 ? 0 : 1,
    };
  }

  get targetIndexes() {
    const pairIndex = this.targetWell.pair.index;
    return {
      pair: pairIndex,
      main: pairIndex === 1 ? 0 : 1,
    };
  }

  /// ------------------------------ Abstract Methods ------------------------------ ///

  abstract quote(
    deposits: ExtendedPickedCratesDetails,
    advancedFarm: AdvancedFarmWorkflow,
    slippage: Number,
  ): Promise<ConvertStrategyQuote<SourceSummaryLP2LP, TargetSummaryLP2LP>>;

  /**
   * @param amountsIn - The amounts in for each deposit.
   * @returns The amounts out for each deposit and the summed amounts out.
   */
  abstract buildAdvancedPipeCalls(
    summary: ConvertStrategyQuote<SourceSummaryLP2LP, TargetSummaryLP2LP>["summary"],
  ): AdvancedPipeWorkflow;

  /// ------------------------------ Public Methods ------------------------------ ///

  encodeConvertResults(quote: ConvertStrategyQuote<SourceSummaryLP2LP, TargetSummaryLP2LP>) {
    const stems: bigint[] = [];
    const amounts: bigint[] = [];

    quote.pickedCrates.crates.forEach((crate) => {
      stems.push(crate.stem.toBigInt());
      amounts.push(crate.amount.toBigInt());
    });

    if (!quote.advPipeCalls) {
      throw new Error("No advanced pipe calls provided");
    }

    const args = {
      stems,
      amounts,
      advPipeCalls: quote.advPipeCalls?.getSteps() ?? [],
    };

    this.encoding = encoders.silo.pipelineConvert(this.sourceWell.pool, this.targetWell.pool, args);

    return this.encoding;
  }

  /// ------------------------------ Protected Methods ------------------------------ ///

  /**
   * generates the params for a swap quote
   * @param buyToken - The token to buy.
   * @param sellToken - The token to sell.
   * @param sellAmount - The amount to sell.
   * @param slippage - The slippage percentage.
   * @returns The swap quote params.
   */
  protected generateSwapQuoteParams(
    buyToken: Token,
    sellToken: Token,
    sellAmount: TV,
    slippage: number,
    disablePintoExchange: boolean = true,
  ): ZeroXQuoteV2Parameters {
    const pipeline = pipelineAddress[resolveChainId(this.context.chainId)];

    return ZeroX.generateQuoteParams({
      chainId: this.context.chainId,
      buyToken: buyToken.address,
      sellToken: sellToken.address,
      sellAmount: sellAmount.blockchainString,
      taker: pipeline,
      txOrigin: this.context.account,
      sellEntireBalance: true,
      slippageBps: ZeroX.slippageToSlippageBps(slippage),
      excludedSources: disablePintoExchange ? "Pinto" : undefined,
    });
  }

  protected makeSwapSummary(
    quote: ZeroXQuoteV2Response,
    sellToken: Token,
    buyToken: Token,
    sellTokenUSD: TV,
    buyTokenUSD: TV,
  ): SiloConvertSwapQuote {
    const sellAmount = TV.fromBlockchain(quote.sellAmount, sellToken.decimals);
    const buyAmount = TV.fromBlockchain(quote.buyAmount, buyToken.decimals);

    // USD always in 6 decimal precision
    const usdIn = sellTokenUSD.mul(sellAmount).reDecimal(6);
    const usdOut = buyTokenUSD.mul(buyAmount).reDecimal(6);

    let feeDetails: SiloConvertSwapQuote["fee"] | undefined;

    const fee = quote.fees?.zeroExFee;

    if (fee) {
      const feeToken = stringEq(fee.token, sellToken.address) ? sellToken : buyToken;
      const feeAmount = TV.fromBlockchain(fee.amount, feeToken.decimals);
      const feeTokenUSD = tokensEqual(feeToken, sellToken) ? sellTokenUSD : buyTokenUSD;

      const feeTotalUSD = feeAmount.mul(feeTokenUSD).reDecimal(6);

      feeDetails = {
        amount: feeAmount,
        token: feeToken,
        usd: feeTotalUSD,
        feePct: feeTotalUSD.div(usdIn).mul(100).toNumber(),
      };
    }

    return {
      quote,
      sellToken,
      buyToken,
      buyAmount,
      sellAmount,
      sellAmountUSD: usdIn,
      buyAmountUSD: usdOut,
      fee: feeDetails,
    };
  }

  /// ------------------------------ Validation Methods ------------------------------ ///

  protected validatePickedCrates(data: ExtendedPickedCratesDetails) {
    const isValid = data.crates.length > 0 && data.totalAmount.gt(0);

    if (!isValid) {
      throw new Error("Invalid picked crates");
    }
  }

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
      amount: TV,
      clipboard: HashString = Clipboard.encode([]),
    ): AdvancedPipeCall => {
      return {
        ...erc20Transfer(recipient, amount, token.address, clipboard),
        target: token.address,
      };
    },
    erc20BalanceOf: (token: Token, account: HashString): AdvancedPipeCall => {
      if (!account || !isAddress(account)) {
        throw new Error("Cannot use invalid account address");
      }

      return {
        ...encoders.token.erc20BalanceOf(account),
        target: token.address,
      };
    },
    // // Well Methods
    removeLiquidity: (
      well: ExtendedPoolData,
      amountIn: TV,
      minAmountsOut: TV[],
      recipient: HashString,
      clipboard: HashString = Clipboard.encode([]),
    ): AdvancedPipeCall => {
      return encoders.well.removeLiquidity(well.pool, amountIn, minAmountsOut, recipient, clipboard);
    },
    removeLiquidityOneToken: (
      well: ExtendedPoolData,
      amountIn: TV,
      tokenOut: Token,
      minAmountOut: TV,
      recipient: HashString,
      clipboard: HashString = Clipboard.encode([]),
    ): AdvancedPipeCall => {
      return encoders.well.removeLiquidityOneToken(well.pool, amountIn, tokenOut, minAmountOut, recipient, clipboard);
    },
    wellSync: (
      well: ExtendedPoolData,
      recipient: HashString,
      amount: TV,
      clipboard: HashString = Clipboard.encode([]),
    ): AdvancedPipeCall => {
      return {
        ...sync(recipient, amount, well.pool.address, clipboard),
        target: well.pool.address,
      };
    },
    // Junction methods
    gte: (value: TV, compareTo: TV, clipboard: HashString = Clipboard.encode([])): AdvancedPipeCall => {
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

export { LP2LPStrategy as SiloConvertLP2LPConvertStrategy };
