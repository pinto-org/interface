import { Clipboard } from "@/classes/Clipboard";
import { TV } from "@/classes/TokenValue";
import { basinWellFunctionABI } from "@/constants/abi/basinWellFunctionABI";
import { AdvancedPipeCall } from "@/utils/types";
import { HashString } from "@/utils/types.generic";
import { Address, decodeFunctionResult, encodeFunctionData } from "viem";

export default function calcReserveAtRatioLiquidity(
  wellFunction: Address,
  reserves: TV[],
  j: 0 | 1,
  ratios: TV[],
  wellFunctionData: `0x${string}`,
  clipboard: HashString = Clipboard.encode([]),
): AdvancedPipeCall {
  const callData = encodeFunctionData({
    abi: basinWellFunctionABI,
    functionName: "calcReserveAtRatioLiquidity",
    args: [reserves.map((r) => r.toBigInt()), BigInt(j), ratios.map((r) => r.toBigInt()), wellFunctionData],
  });

  return {
    target: wellFunction,
    callData,
    clipboard,
  };
}

export function decodeCalcReserveAtRatioLiquidity(data: HashString) {
  const decoded = decodeFunctionResult({
    abi: basinWellFunctionABI,
    functionName: "calcReserveAtRatioLiquidity",
    data,
  });

  return decoded;
}
