import { Clipboard } from "@/classes/Clipboard";
import { TokenValue } from "@/classes/TokenValue";
import { basinWellABI } from "@/constants/abi/basinWellABI";
import { Abi, Address, encodeFunctionData } from "viem";

export default function shift(
  tokenOut?: Address,
  minAmountOut?: TokenValue,
  recipient?: Address,
  target?: Address,
  clipboard?: `0x${string}`,
) {
  if (!tokenOut || !minAmountOut || !recipient) {
    return {
      callData: "0x" as `0x${string}`,
      clipboard: Clipboard.encode([]),
    };
  }
  const data = encodeFunctionData({
    abi: basinWellABI as Abi,
    functionName: "shift",
    args: [tokenOut, minAmountOut?.toBigInt() || 0n, recipient],
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
