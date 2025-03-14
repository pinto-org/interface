import { Clipboard } from "@/classes/Clipboard";
import { TokenValue } from "@/classes/TokenValue";
import { beanstalkAbi } from "@/generated/contractHooks";
import { AdvancedFarmCall, FarmFromMode, FarmToMode } from "@/utils/types";
import { Address, encodeFunctionData } from "viem";

export default function transferToken(
  tokenToTransfer?: Address,
  destination?: Address,
  amount?: TokenValue,
  from?: FarmFromMode,
  to?: FarmToMode,
  target?: Address,
  clipboard?: `0x${string}`,
) {
  if (!tokenToTransfer || !destination || !amount || !from || !to) {
    return {
      callData: "0x" as `0x${string}`,
      clipboard: Clipboard.encode([]),
    };
  }
  const data = encodeFunctionData({
    abi: beanstalkAbi,
    functionName: "transferToken",
    args: [tokenToTransfer, destination, amount.toBigInt(), Number(from), Number(to)],
  });

  if (target) {
    return {
      target: target,
      callData: data,
      clipboard: clipboard || Clipboard.encode([]),
    };
  }

  return {
    callData: data,
    clipboard: clipboard || Clipboard.encode([]),
  } satisfies AdvancedFarmCall;
}
