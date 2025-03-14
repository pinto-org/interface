import { Clipboard } from "@/classes/Clipboard";
import { TokenValue } from "@/classes/TokenValue";
import { beanstalkAbi } from "@/generated/contractHooks";
import { AdvancedPipeCall } from "@/utils/types";
import { HashString } from "@/utils/types.generic";
import { decodeFunctionResult, encodeFunctionData } from "viem";

export default function advancedPipe(
  pipeCallData?: AdvancedPipeCall[],
  ethAmount?: TokenValue,
  clipboard?: `0x${string}`,
) {
  if (!pipeCallData || !ethAmount) {
    return {
      callData: "0x" as `0x${string}`,
      clipboard: Clipboard.encode([]),
    };
  }

  const data = encodeFunctionData({
    abi: beanstalkAbi,
    functionName: "advancedPipe",
    args: [pipeCallData, ethAmount.toBigInt()],
  });

  return {
    callData: data,
    clipboard: clipboard || Clipboard.encode([]),
  };
}

export function decodeAdvancedPipeResult(result: HashString) {
  return decodeFunctionResult({
    abi: beanstalkAbi,
    functionName: "advancedPipe",
    data: result,
  });
}
