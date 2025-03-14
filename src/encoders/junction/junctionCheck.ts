import { Clipboard } from "@/classes/Clipboard";
import { junctionABI } from "@/constants/abi/junctionABI";
import { junctionAddress } from "@/generated/contractHooks";
import { AdvancedPipeCall } from "@/utils/types";
import { encodeFunctionData } from "viem";

export default function junctionCheck(
  /**
   * index of the condition to check
   */
  index: number,
  /**
   * paste slot
   */
  copySlot: number,
): AdvancedPipeCall {
  const encoded = encodeFunctionData({
    abi: junctionABI,
    functionName: "check",
    args: [false],
  });

  return {
    target: junctionAddress,
    callData: encoded,
    clipboard: Clipboard.encodeSlot(index, copySlot, 0),
  };
}
