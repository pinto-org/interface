import { Clipboard } from "@/classes/Clipboard";
import { TokenValue } from "@/classes/TokenValue";
import { beanstalkAbi } from "@/generated/contractHooks";
import { AdvancedFarmCall, FarmToMode } from "@/utils/types";
import { encodeFunctionData } from "viem";

export default function wrapEth(amount?: TokenValue, balanceTo?: FarmToMode, clipboard?: `0x${string}`) {
  if (!amount || !balanceTo) {
    return {
      callData: "0x" as `0x${string}`,
      clipboard: Clipboard.encode([]),
    };
  }

  const data = encodeFunctionData({
    abi: beanstalkAbi,
    functionName: "wrapEth",
    args: [amount.toBigInt(), Number(balanceTo)],
  });

  return {
    callData: data,
    clipboard: clipboard || Clipboard.encode([], amount.toBigInt()),
  };
}
