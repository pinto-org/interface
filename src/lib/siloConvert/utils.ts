import { TV } from "@/classes/TokenValue";
import { basinWellABI } from "@/constants/abi/basinWellABI";
import encoders from "@/encoders";
import { decodeConvert } from "@/encoders/silo/convert";
import { decodePipelineConvert } from "@/encoders/silo/pipelineConvert";
import { ExtendedPickedCratesDetails } from "@/utils/convert";
import { HashString } from "@/utils/types.generic";
import { decodeFunctionResult } from "viem";
import { AdvancedFarmWorkflow, AdvancedPipeWorkflow } from "../farm/workflow";
import { ConvertResultStruct } from "./SiloConvert";
import { ExtendedPoolData } from "./SiloConvert.cache";
import { SiloConvertType } from "./strategies/core";
import { ErrorHandlerFactory } from "./strategies/validation/ErrorHandlerFactory";
import { SiloConvertContext } from "./types";

type Decoder = (results: HashString) => ConvertResultStruct<bigint>;

const decoderMap: Record<SiloConvertType, Decoder> = {
  LP2LP: decodePipelineConvert,
  LP2MainPipeline: decodePipelineConvert,
  LPAndMain: decodeConvert,
  LP2MainWithdrawPair: decodePipelineConvert,
  Main2LPDeposit: decodePipelineConvert,
} as const;

export const decodeConvertResults = (
  results: readonly HashString[],
  convertType: SiloConvertType,
): ConvertResultStruct<bigint>[] => {
  const decoder = decoderMap[convertType];

  if (!decoder) {
    throw new Error(`Invalid convert type: ${convertType}`);
  }

  return results.map(decoder);
};

interface WillRemoveLiquidityStrategy {
  context: SiloConvertContext;
  sourceWell: ExtendedPoolData;
  errorHandler: ReturnType<typeof ErrorHandlerFactory.createStrategyHandler>;
}

/**
 * Decode the result of the remove liquidity operation for a well
 *
 * @param data - The data to decode
 * @param s - The strategy that will be used to handle the error
 * @returns The amounts of the tokens that will be removed from the well
 */
const decodeRemoveLiquidityResult = (data: readonly HashString[], s: WillRemoveLiquidityStrategy) => {
  s.errorHandler.assert(data.length > 0, "Remove liquidity result data is empty", {
    dataLength: data.length,
  });

  const decoded = s.errorHandler.wrap(
    () => AdvancedPipeWorkflow.decodeResult(data[data.length - 1]),
    "decode advanced pipe result",
    { dataLength: data.length },
  );

  s.errorHandler.assert(decoded.length > 0, "Decoded advanced pipe result is empty", {
    decodedLength: decoded.length,
  });

  const removeLiquidityResult = s.errorHandler.wrap(
    () =>
      decodeFunctionResult({
        abi: basinWellABI,
        functionName: "getRemoveLiquidityOut",
        data: decoded[decoded.length - 1],
      }),
    "decode remove liquidity result",
    { decodedLength: decoded.length, decodedData: decoded },
  );

  return removeLiquidityResult;
};

/**
 * Quote the remove liquidity operation for a well
 *
 * @param pickedCratesDetails - The details of the picked crates
 * @param advancedFarm - The advanced farm workflow
 * @param s - The strategy that will be used to handle the error
 * @returns The amounts of the tokens that will be removed from the well
 */
export const quoteSiloConvertGetWellRemoveLiquidity = async (
  pickedCratesDetails: ExtendedPickedCratesDetails,
  advancedFarm: AdvancedFarmWorkflow,
  s: WillRemoveLiquidityStrategy,
): Promise<TV[]> => {
  // Validation
  s.errorHandler.validateAmount(pickedCratesDetails.totalAmount, "remove liquidity amount");

  const pipe = new AdvancedPipeWorkflow(s.context.chainId, s.context.wagmiConfig);
  pipe.add(encoders.well.getRemoveLiquidityOut(s.sourceWell.pool, pickedCratesDetails.totalAmount));

  // Simulate the remove liquidity operation
  const simulate = await s.errorHandler.wrapAsync(
    () =>
      advancedFarm.simulate({
        after: pipe,
        account: s.context.account,
      }),
    "remove liquidity simulation",
    {
      amountIn: pickedCratesDetails.totalAmount.toHuman(),
      account: s.context.account,
      advFarm: advancedFarm,
      pipe: pipe,
    },
  );

  // Validate simulation results
  s.errorHandler.validateSimulation(simulate, "remove liquidity simulation");

  // Decode the result & map to expected type
  const result = decodeRemoveLiquidityResult(simulate.result, s);
  const amounts: TV[] = s.sourceWell.tokens.map((tk, i) => TV.fromBigInt(result[i], tk.decimals));

  console.debug("[PipelineConvertStrategy/Equal2Equal] getRemoveLiquidityOut: ", {
    well: s.sourceWell.pool.name,
    amountIn: pickedCratesDetails.totalAmount,
    amountsOut: amounts,
  });

  return amounts;
};
