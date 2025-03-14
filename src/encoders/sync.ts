import { Clipboard } from "@/classes/Clipboard";
import { TokenValue } from "@/classes/TokenValue";
import { basinWellABI } from "@/constants/abi/basinWellABI";
import { Abi, Address, encodeFunctionData } from "viem";

export default function sync(
  recipient?: Address,
  minLpAmountOut?: TokenValue,
  target?: Address,
  clipboard?: `0x${string}`,
) {
  if (!minLpAmountOut || !recipient) {
    return {
      callData: "0x" as `0x${string}`,
      clipboard: Clipboard.encode([]),
    };
  }
  const data = encodeFunctionData({
    abi: basinWellABI as Abi,
    functionName: "sync",
    args: [recipient, minLpAmountOut?.toBigInt() || 0n],
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
  };
}
