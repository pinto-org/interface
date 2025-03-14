import { Clipboard } from "@/classes/Clipboard";
import { junctionABI } from "@/constants/abi/junctionABI";
import { junctionAddress } from "@/generated/contractHooks";
import { AdvancedPipeCall } from "@/utils/types";
import { HashString } from "@/utils/types.generic";
import { encodeFunctionData } from "viem";

export default function junctionMulDiv(
  a: bigint,
  b: bigint,
  c: bigint,
  clipboard: HashString = Clipboard.encode([]),
): AdvancedPipeCall {
  const callData = encodeFunctionData({
    abi: junctionABI,
    functionName: "mulDiv",
    args: [a, b, c],
  });

  return {
    target: junctionAddress,
    callData,
    clipboard,
  };
}
