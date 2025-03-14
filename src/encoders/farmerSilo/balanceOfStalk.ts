import { Clipboard } from "@/classes/Clipboard";
import { abiSnippets } from "@/constants/abiSnippets";
import { Address, encodeFunctionData } from "viem";

export default function balanceOfStalk(account: Address) {
  const callData = encodeFunctionData({
    abi: abiSnippets.farmer.balanceOfStalk,
    functionName: "balanceOfStalk",
    args: [account],
  });

  return {
    callData,
    clipboard: Clipboard.encode([]),
  };
}
