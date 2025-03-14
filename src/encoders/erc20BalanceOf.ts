import { Address, encodeFunctionData, erc20Abi } from "viem";
import { Clipboard } from "@/classes/Clipboard";

export default function erc20BalanceOf(account?: Address, target?: Address, clipboard?: `0x${string}`) {
  if (!account) {
    return {
      callData: "0x" as `0x${string}`,
      clipboard: Clipboard.encode([]),
    };
  }

  const data = encodeFunctionData({
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [account],
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
