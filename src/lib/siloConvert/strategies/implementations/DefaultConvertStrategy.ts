import { Clipboard } from "@/classes/Clipboard";
import { TV } from "@/classes/TokenValue";
import { diamondABI } from "@/constants/abi/diamondABI";
import encoders from "@/encoders";
import { AdvancedFarmWorkflow } from "@/lib/farm/workflow";
import { ConvertStrategyQuote, SiloConvertStrategy } from "@/lib/siloConvert/strategies/core";
import { SiloConvertContext } from "@/lib/siloConvert/types";
import { ExtendedPickedCratesDetails, calculateConvertData } from "@/utils/convert";
import { AdvancedFarmCall, Token } from "@/utils/types";
import { HashString } from "@/utils/types.generic";
import { throwIfAborted } from "@/utils/utils";
import { decodeFunctionResult, encodeFunctionData } from "viem";

export interface DefaultConvertStrategyOptions {
  grownStalkPenaltyExpected?: boolean;
}

export class DefaultConvertStrategy extends SiloConvertStrategy<"LPAndMain"> {
  readonly name = "LP_And_Main_Default";

  grownStalkPenaltyExpected: boolean;

  constructor(source: Token, target: Token, context: SiloConvertContext, options?: DefaultConvertStrategyOptions) {
    super(source, target, context);
    this.grownStalkPenaltyExpected = Boolean(options?.grownStalkPenaltyExpected);
    this.initErrorHandlerCtx();
  }

  async quote(
    deposits: ExtendedPickedCratesDetails,
    advancedFarm: AdvancedFarmWorkflow,
    slippage: number,
    signal?: AbortSignal,
  ): Promise<ConvertStrategyQuote<"LPAndMain">> {
    // Check if already aborted
    throwIfAborted(signal);
    // Validation
    this.validateQuoteArgs(deposits, slippage);

    const amountIn = deposits.totalAmount;

    // Run simulation
    const sim = await this.errorHandler.wrapAsync(
      () => {
        const farmStruct = this.encodeConvertAmountOut(amountIn);
        return advancedFarm.simulate({
          account: this.context.account,
          after: [farmStruct],
        });
      },
      "default convert simulation",
      { amountIn: amountIn.toHuman(), account: this.context.account },
    );

    // Check if aborted after async operation
    throwIfAborted(signal);

    // Validate simulation results
    this.errorHandler.validateSimulation(sim, "default convert simulation");

    // Decode amount out
    const amountOut = this.errorHandler.wrap(
      () => this.decodeConvertAmountOut(sim.result[0]),
      "decode convert amount out",
      { amountIn: amountIn.toHuman(), rawResult: sim.result[0] },
    );

    const summary = {
      source: {
        token: this.sourceToken,
        amountIn: amountIn,
      },
      target: {
        token: this.targetToken,
        amountOut,
      },
    };

    // Generate convert data
    const convertData = this.errorHandler.wrap(
      () => this.getConvertData(amountIn, amountOut, slippage),
      "generate convert data",
      { amountIn: amountIn.toHuman(), amountOut: amountOut.toHuman(), slippage },
    );

    console.debug("[DefaultConvertStrategy] quote: ", {
      source: this.sourceToken,
      target: this.targetToken,
      amountIn: amountIn,
      amountOut,
      convertData,
    });

    return {
      pickedCrates: deposits,
      summary,
      advPipeCalls: undefined,
      amountOut,
      convertData,
    };
  }

  encodeFromQuote(quote: ConvertStrategyQuote<"LPAndMain">): AdvancedFarmCall {
    // Validation
    const convertData = this.errorHandler.assertDefined(quote.convertData, "Missing convert data in quote");
    this.errorHandler.assert(!!quote.pickedCrates?.crates.length, "Missing picked crates in quote", {
      cratesCount: quote.pickedCrates?.crates.length || 0,
    });

    return this.errorHandler.wrap(
      () => {
        const stems = quote.pickedCrates.crates.map((crate) => crate.stem.toBigInt());
        const amounts = quote.pickedCrates.crates.map((crate) => crate.amount.toBigInt());
        return encoders.silo.convert(convertData, stems, amounts);
      },
      "encode from quote",
      { cratesCount: quote.pickedCrates.crates.length },
    );
  }

  private getConvertData(amountIn: TV, amountOut: TV, slippage: number): HashString {
    // Validation
    this.errorHandler.validateAmount(slippage, "getConvertData.slippage");
    this.errorHandler.validateAmount(amountIn, "getConvertData.amountIn");
    this.errorHandler.validateAmount(amountOut, "getConvertData.amountOut");

    return this.errorHandler.wrap(
      (): HashString => {
        const amountOutWithSlippage = amountOut.subSlippage(slippage);
        const convertData = calculateConvertData(this.sourceToken, this.targetToken, amountIn, amountOutWithSlippage);

        const validatedConvertData = this.errorHandler.assertDefined(
          convertData,
          "getConvertData.convertData is empty",
          {
            convertDataLength: convertData?.length || 0,
          },
        );

        return validatedConvertData;
      },
      "calculate convert data",
      {
        amountIn: amountIn.toHuman(),
        amountOut: amountOut.toHuman(),
        slippage,
        sourceToken: this.sourceToken.symbol,
        targetToken: this.targetToken.symbol,
      },
    );
  }

  private encodeConvertAmountOut(amount: TV): AdvancedFarmCall {
    // Validation
    this.errorHandler.validateAmount(amount, "encodeConvertAmountOut.amount");

    return this.errorHandler.wrap(
      () => {
        const callData = encodeFunctionData({
          abi: diamondABI,
          functionName: "getAmountOut",
          args: [this.sourceToken.address, this.targetToken.address, amount.toBigInt()],
        });

        return {
          callData,
          clipboard: Clipboard.encode([]),
        };
      },
      "encodeConvertAmountOut.encode getAmountOut call",
      { amount: amount.toHuman() },
    );
  }

  private decodeConvertAmountOut(data: HashString): TV {
    // Validation
    this.errorHandler.assert(!!data?.length, "decodeConvertAmountOut.data is empty", {
      dataLength: data?.length || 0,
    });

    return this.errorHandler.wrap(
      () => {
        const amountOut = decodeFunctionResult({
          abi: diamondABI,
          functionName: "getAmountOut",
          data,
        });

        return TV.fromBigInt(amountOut, this.targetToken.decimals);
      },
      "decode getAmountOut result",
      { dataLength: data.length },
    );
  }
}
