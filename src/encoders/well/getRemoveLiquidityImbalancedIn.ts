import { Clipboard } from "@/classes/Clipboard";
import { basinWellABI } from "@/constants/abi/basinWellABI";
import { AdvancedPipeCall } from "@/utils/types";
import { HashString } from "@/utils/types.generic";
import { Address, decodeFunctionResult, encodeFunctionData } from "viem";

export default function getRemoveLiquidityImbalancedIn(
  well: Address,
  tokenAmountsIn: bigint[],
  clipboard: HashString = Clipboard.encode([]),
): AdvancedPipeCall {
  const encoded = encodeFunctionData({
    abi: basinWellABI,
    functionName: "getRemoveLiquidityImbalancedIn",
    args: [tokenAmountsIn],
  });

  return {
    target: well,
    callData: encoded,
    clipboard,
  };
}

export function decodeGetRemoveLiquidityImbalanceIn(data: HashString) {
  return decodeFunctionResult({
    abi: basinWellABI,
    functionName: "getRemoveLiquidityImbalancedIn",
    data,
  });
}
