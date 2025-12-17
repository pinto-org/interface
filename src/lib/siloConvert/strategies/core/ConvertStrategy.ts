import { AdvancedFarmCall, Token } from "@/utils/types";

import { TV } from "@/classes/TokenValue";
import { AdvancedFarmWorkflow } from "@/lib/farm/workflow";
import { SiloConvertContext } from "@/lib/siloConvert/types";
import { ExtendedPickedCratesDetails } from "@/utils/convert";
import { AnyRecord } from "@/utils/types.generic";
import { ErrorHandlerFactory } from "../validation/ErrorHandlerFactory";
import { ConvertStrategyQuote, SiloConvertType } from "./types";

export abstract class SiloConvertStrategy<T extends SiloConvertType> {
  readonly context: SiloConvertContext;
  readonly sourceToken: Token;
  readonly targetToken: Token;

  abstract readonly name: string;

  // Error handler instance available to all strategies
  readonly errorHandler: ReturnType<typeof ErrorHandlerFactory.createStrategyHandler>;

  constructor(source: Token, target: Token, context: SiloConvertContext) {
    this.sourceToken = source;
    this.targetToken = target;
    this.context = context;
    this.errorHandler = ErrorHandlerFactory.createStrategyHandler(source.symbol, target.symbol);
  }

  abstract quote(
    deposits: ExtendedPickedCratesDetails,
    advancedFarm: AdvancedFarmWorkflow,
    slippage: number,
    signal?: AbortSignal,
  ): Promise<ConvertStrategyQuote<T>>;

  // ------------------------------ Validation Methods ------------------------------ //

  abstract encodeFromQuote(quote: ConvertStrategyQuote<T>): {
    // the calls to add to the advanced farm workflow
    calls: AdvancedFarmCall | AdvancedFarmCall[];
    /**
     * The index of the pipeline convert call in the Array of Advanced Farm Calls.
     * There are cases where the pipeline convert call is not the first call in the array,
     * so we need to know the index to decode the result correctly.
     */
    decodeIndex: number;
  };

  abstract getApprovalTokens(): Token | Token[] | undefined;

  protected validateSlippage(slippage: number) {
    this.errorHandler.validateAmount(slippage, "slippage");
  }

  protected validateAmountIn(amountIn: TV) {
    this.errorHandler.validateAmount(amountIn, "amount in");
  }

  protected validatePickedCrates(data: ExtendedPickedCratesDetails) {
    this.errorHandler.assert(data.crates.length > 0, "No crates provided for conversion", {
      cratesCount: data.crates.length,
    });

    this.errorHandler.validateAmount(data.totalAmount, "total crates amount", { cratesCount: data.crates.length });
  }

  protected validateQuoteArgs(deposits: ExtendedPickedCratesDetails, slippage: number) {
    this.validatePickedCrates(deposits);
    this.validateAmountIn(deposits.totalAmount);
    this.validateSlippage(slippage);
  }

  protected initErrorHandlerCtx(moreCtx?: AnyRecord) {
    this.errorHandler.addCtx({
      objectName: this.name,
      ...(moreCtx ?? {}),
    });
  }
}
