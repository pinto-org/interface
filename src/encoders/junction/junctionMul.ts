import { Clipboard } from "@/classes/Clipboard";
import { junctionABI } from "@/constants/abi/junctionABI";
import { junctionAddress } from "@/generated/contractHooks";
import { AdvancedPipeCall } from "@/utils/types";
import { HashString } from "@/utils/types.generic";
import { encodeFunctionData } from "viem";

export default function junctionMul(
  a: bigint,
  b: bigint,
  clipboard: HashString = Clipboard.encode([]),
): AdvancedPipeCall {
  const callData = encodeFunctionData({
    abi: junctionABI,
    functionName: "mul",
    args: [a, b],
  });

  return {
    target: junctionAddress,
    callData,
    clipboard,
  };
}
