import { Clipboard } from "@/classes/Clipboard";
import { diamondABI } from "@/constants/abi/diamondABI";
import { abiSnippets } from "@/constants/abiSnippets";
import { HashString } from "@/utils/types.generic";
import { decodeFunctionResult, encodeFunctionData } from "viem";

export default function convert(
  convertData: HashString,
  stems: bigint[],
  amounts: bigint[],
  clipboard: HashString = Clipboard.encode([]),
) {
  const callData = encodeFunctionData({
    abi: diamondABI,
    functionName: "convert",
    args: [convertData, stems, amounts],
  });

  return {
    callData,
    clipboard,
  };
}

export function getMaxAmountIn(source: HashString, target: HashString, clipboard: HashString = Clipboard.encode([])) {
  const callData = encodeFunctionData({
    abi: diamondABI,
    functionName: "getMaxAmountIn",
    args: [source, target],
  });

  return {
    callData,
    clipboard,
  };
}

export function decodeGetMaxAmountIn(result: HashString) {
  return decodeFunctionResult({
    abi: abiSnippets.silo.getMaxAmountIn,
    functionName: "getMaxAmountIn",
    data: result,
  });
}

export function getAmountOut(
  source: HashString,
  target: HashString,
  amount: bigint,
  clipboard: HashString = Clipboard.encode([]),
) {
  const callData = encodeFunctionData({
    abi: diamondABI,
    functionName: "getAmountOut",
    args: [source, target, amount],
  });

  return {
    callData,
    clipboard,
  };
}

export function decodeGetAmountOut(result: HashString) {
  return decodeFunctionResult({
    abi: diamondABI,
    functionName: "getAmountOut",
    data: result,
  });
}
