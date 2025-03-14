import { Clipboard } from "@/classes/Clipboard";
import { junctionABI } from "@/constants/abi/junctionABI";
import { junctionAddress } from "@/generated/contractHooks";
import { AdvancedPipeCall } from "@/utils/types";
import { HashString } from "@/utils/types.generic";
import { encodeFunctionData } from "viem";

export default function junctionDiv(
  a: bigint,
  b: bigint,
  clipboard: HashString = Clipboard.encode([]),
): AdvancedPipeCall {
  const callData = encodeFunctionData({
    abi: junctionABI,
    functionName: "div",
    args: [a, b],
  });

  return {
    target: junctionAddress,
    callData,
    clipboard,
  };
}
