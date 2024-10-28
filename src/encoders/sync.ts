import { Abi, Address, encodeFunctionData } from "viem";
import BASIN_WELL_ABI from "@/constants/abi/BasinWell.json";
import { TokenValue } from "@/classes/TokenValue";
import { Clipboard } from "@/classes/Clipboard";

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
    abi: BASIN_WELL_ABI as Abi,
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
