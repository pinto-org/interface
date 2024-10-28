import { encodeFunctionData } from "viem";
import { TokenValue } from "@/classes/TokenValue";
import { AdvancedPipeCall } from "@/utils/types";
import { beanstalkAbi } from "@/generated/contractHooks";
import { Clipboard } from "@/classes/Clipboard";

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
