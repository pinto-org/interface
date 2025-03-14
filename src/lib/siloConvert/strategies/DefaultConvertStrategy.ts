import { Clipboard } from "@/classes/Clipboard";
import { TV } from "@/classes/TokenValue";
import { diamondABI } from "@/constants/abi/diamondABI";
import { AdvancedFarmWorkflow } from "@/lib/farm/workflow";
import { ExtendedPickedCratesDetails, calculateConvertData } from "@/utils/convert";
import { AdvancedFarmCall } from "@/utils/types";
import { HashString } from "@/utils/types.generic";
import { decodeFunctionResult, encodeFunctionData } from "viem";
import {
  ConvertStrategyQuote,
  SiloConvertSourceSummary,
  SiloConvertStrategy,
  SiloConvertTargetSummary,
} from "./ConvertStrategy";

export type DefaultConvertStrategyResult = ConvertStrategyQuote<SiloConvertSourceSummary, SiloConvertTargetSummary>;

export class DefaultConvertStrategy extends SiloConvertStrategy {
  async quote(
    deposits: ExtendedPickedCratesDetails,
    advancedFarm: AdvancedFarmWorkflow,
    slippage: number,
  ): Promise<DefaultConvertStrategyResult> {
    this.setAmountIn(deposits.totalAmount);
    const farm = this.#encodeConvertAmountOut(this.amountIn);

    const sim = await advancedFarm.simulate({
      account: this.context.account,
      after: farm,
    });

    const amountOut = this.decodeConvertAmountOut(sim.result[0]);

    const summary = {
      source: {
        token: this.sourceToken,
        amountIn: deposits.totalAmount,
      },
      target: {
        token: this.targetToken,
        amountOut,
      },
    };

    const { callStruct, convertData } = this.#buildConvertFarmStruct(this.amountIn, amountOut, deposits, slippage);

    advancedFarm.add(callStruct);

    console.debug("[DefaultConvertStrategy] quote: ", {
      source: this.sourceToken,
      target: this.targetToken,
      amountIn: this.amountIn,
      amountOut,
    });

    return {
      pickedCrates: deposits,
      summary,
      advPipeCalls: undefined,
      amountOut,
      convertData,
    };
  }

  #buildConvertFarmStruct(amountIn: TV, amountOut: TV, deposits: ExtendedPickedCratesDetails, slippage: number) {
    const convertData = calculateConvertData(
      this.sourceToken,
      this.targetToken,
      amountIn,
      amountOut.subSlippage(slippage),
    );

    if (!convertData) {
      throw new Error("Invalid convert data");
    }

    const stems: bigint[] = deposits.crates.map((crate) => crate.stem.toBigInt());
    const amounts: bigint[] = deposits.crates.map((crate) => crate.amount.toBigInt());

    const convertCall = encodeFunctionData({
      abi: diamondABI,
      functionName: "convert",
      args: [convertData, stems, amounts],
    });

    const callStruct: AdvancedFarmCall = {
      callData: convertCall,
      clipboard: Clipboard.encode([]),
    };

    return {
      callStruct,
      convertData,
    };
  }

  #encodeConvertAmountOut(amount: TV) {
    const farm = new AdvancedFarmWorkflow(this.context.chainId, this.context.wagmiConfig);
    const callData = encodeFunctionData({
      abi: diamondABI,
      functionName: "getAmountOut",
      args: [this.sourceToken.address, this.targetToken.address, amount.toBigInt()],
    });
    farm.add({
      callData,
      clipboard: Clipboard.encode([]),
    });

    return farm;
  }

  decodeConvertAmountOut(data: HashString) {
    const amountOut = decodeFunctionResult({
      abi: diamondABI,
      functionName: "getAmountOut",
      data: data,
    });

    return TV.fromBigInt(amountOut, this.targetToken.decimals);
  }
}
