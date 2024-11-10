import { Clipboard } from "@/classes/Clipboard";
import { diamondABI } from "@/constants/abi/diamondABI";
import { HashString } from "@/utils/types.generic";
import { Address, encodeFunctionData } from "viem";

export default function balanceOfStalk(account: Address, target?: Address, clipboard?: HashString) {
  const encoded = encodeFunctionData({
    abi: diamondABI,
    functionName: "balanceOfStalk",
    args: [account],
  });

  if (target) {
    return {
      target: target,
      callData: encoded,
      clipboard: clipboard || Clipboard.encode([]),
    };
  }

  return {
    callData: encoded,
    clipboard: clipboard || Clipboard.encode([]),
  };
}
