import { Address, encodeFunctionData, erc20Abi } from "viem";
import { TokenValue } from "@/classes/TokenValue";
import { Clipboard } from "@/classes/Clipboard";

export default function erc20Approve(
  spender?: Address,
  amount?: TokenValue,
  target?: Address,
  clipboard?: `0x${string}`,
) {
  if (!spender || !amount) {
    return {
      callData: "0x" as `0x${string}`,
      clipboard: Clipboard.encode([]),
    };
  }

  const data = encodeFunctionData({
    abi: erc20Abi,
    functionName: "approve",
    args: [spender, amount.toBigInt()],
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
