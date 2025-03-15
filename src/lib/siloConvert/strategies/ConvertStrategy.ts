import { TV } from "@/classes/TokenValue";

import { Token } from "@/utils/types";

import { AdvancedFarmWorkflow, AdvancedPipeWorkflow } from "@/lib/farm/workflow";
import { ZeroXQuoteV2Response } from "@/lib/matcha/types";
import { SiloConvertContext } from "@/lib/siloConvert/SiloConvert";
import { ExtendedPickedCratesDetails } from "@/utils/convert";
import { HashString } from "@/utils/types.generic";

export interface SiloConvertSourceSummary {
  token: Token;
  amountIn: TV;
}

export interface SiloConvertTargetSummary {
  token: Token;
  amountOut: TV;
}

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

export interface ConvertStrategyQuoteSummary<
  SourceSummary extends SiloConvertSourceSummary,
  TargetSummary extends SiloConvertTargetSummary,
> {
  source: SourceSummary;
  target: TargetSummary;
  swap?: SiloConvertSwapQuote;
}

/**
 * The results of the convert.
 */
export interface ConvertStrategyQuote<
  SourceSummary extends SiloConvertSourceSummary,
  TargetSummary extends SiloConvertTargetSummary,
> {
  pickedCrates: ExtendedPickedCratesDetails;
  advPipeCalls: AdvancedPipeWorkflow | undefined;
  amountOut: TV;
  summary: ConvertStrategyQuoteSummary<SourceSummary, TargetSummary>;
  convertData?: HashString;
}

export abstract class SiloConvertStrategy {
  readonly context: SiloConvertContext;

  readonly sourceToken: Token;

  readonly targetToken: Token;

  #amountIn: TV | undefined;

  constructor(source: Token, target: Token, context: SiloConvertContext) {
    this.sourceToken = source;
    this.targetToken = target;
    this.context = context;
  }

  get amountIn() {
    if (!this.#amountIn) {
      throw new Error("Amount in not set");
    }
    return this.#amountIn;
  }

  setAmountIn(amount: TV) {
    this.#amountIn = amount;
  }

  abstract quote(
    deposits: ExtendedPickedCratesDetails,
    advancedFarm: AdvancedFarmWorkflow,
    slippage: number,
  ): Promise<ConvertStrategyQuote<SiloConvertSourceSummary, SiloConvertTargetSummary>>;
}
