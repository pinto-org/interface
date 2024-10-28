import { encodeFunctionData } from "viem";
import { TokenValue } from "@/classes/TokenValue";
import { FarmFromMode } from "@/utils/types";
import { beanstalkAbi } from "@/generated/contractHooks";
import { Clipboard } from "@/classes/Clipboard";

export default function unwrapEth(amount?: TokenValue, balanceFrom?: FarmFromMode, clipboard?: `0x${string}`) {
  if (!amount || !balanceFrom) {
    return {
      callData: "0x" as `0x${string}`,
      clipboard: Clipboard.encode([]),
    };
  }

  const data = encodeFunctionData({
    abi: beanstalkAbi,
    functionName: "unwrapEth",
    args: [amount.toBigInt(), Number(balanceFrom)],
  });

  return {
    callData: data,
    clipboard: clipboard || Clipboard.encode([]),
  };
}
