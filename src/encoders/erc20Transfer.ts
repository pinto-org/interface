import { Clipboard } from "@/classes/Clipboard";
import { TokenValue } from "@/classes/TokenValue";
import { Address, encodeFunctionData, erc20Abi } from "viem";

export default function erc20Transfer(
  destination?: Address,
  amount?: TokenValue,
  target?: Address,
  clipboard?: `0x${string}`,
) {
  if (!destination || !amount) {
    return {
      callData: "0x" as `0x${string}`,
      clipboard: Clipboard.encode([]),
    };
  }

  const data = encodeFunctionData({
    abi: erc20Abi,
    functionName: "transfer",
    args: [destination, amount.toBigInt()],
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
