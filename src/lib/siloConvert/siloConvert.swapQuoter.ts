import { TV } from "@/classes/TokenValue";
import { pipelineAddress } from "@/generated/contractHooks";
import { ZeroX } from "@/lib/matcha/ZeroX";
import { ZeroXQuoteV2Parameters, ZeroXQuoteV2Response } from "@/lib/matcha/types";
import { SiloConvertContext } from "@/lib/siloConvert/types";
import { getChainConstant } from "@/utils/chain";
import { stringEq } from "@/utils/string";
import { tokensEqual } from "@/utils/token";
import { Token } from "@/utils/types";

export interface SiloConvertSwapQuote {
  sellToken: Token;
  buyToken: Token;
  quote: ZeroXQuoteV2Response;
  buyAmount: TV;
  sellAmount: TV;
  sellAmountUSD: TV;
  buyAmountUSD: TV;
  fee?: {
    amount: TV;
    usd: TV;
    token: Token;
    feePct: number;
  };
}

export interface IConvertQuoteMaySwap {
  swap?: SiloConvertSwapQuote;
}

export class SiloConvertSwapQuoter {
  constructor(readonly context: SiloConvertContext) {
    this.context = context;
  }

  /**
   * generates the params for a swap quote
   * @param buyToken - The token to buy.
   * @param sellToken - The token to sell.
   * @param sellAmount - The amount to sell.
   * @param slippage - The slippage percentage.
   * @returns The swap quote params.
   */
  generateSwapQuoteParams(
    buyToken: Token,
    sellToken: Token,
    sellAmount: TV,
    slippage: number,
    disablePintoExchange: boolean = true,
  ): ZeroXQuoteV2Parameters {
    const pipeline = getChainConstant(this.context.chainId, pipelineAddress);

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

  makeSwapSummary(
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

    let feeDetails: SiloConvertSwapQuote["fee"] | undefined = undefined;

    const fee = quote.fees?.zeroExFee;

    if (fee && !usdIn.isZero && !usdOut.isZero) {
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
}
