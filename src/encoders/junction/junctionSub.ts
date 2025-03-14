import { Clipboard } from "@/classes/Clipboard";
import { junctionABI } from "@/constants/abi/junctionABI";
import { junctionAddress } from "@/generated/contractHooks";
import { AdvancedPipeCall } from "@/utils/types";
import { HashString } from "@/utils/types.generic";
import { decodeFunctionResult, encodeFunctionData } from "viem";

export default function junctionSub(
  a: bigint,
  b: bigint,
  clipboard: HashString = Clipboard.encode([]),
): AdvancedPipeCall {
  const callData = encodeFunctionData({
    abi: junctionABI,
    functionName: "sub",
    args: [a, b],
  });

  return {
    target: junctionAddress,
    callData,
    clipboard,
  };
}

export function decodeJunctionSub(data: HashString) {
  const decoded = decodeFunctionResult({
    abi: junctionABI,
    functionName: "sub",
    data,
  });

  return decoded;
}
