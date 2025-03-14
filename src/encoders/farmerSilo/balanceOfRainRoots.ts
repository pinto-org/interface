import { Clipboard } from "@/classes/Clipboard";
import { diamondABI } from "@/constants/abi/diamondABI";
import { HashString } from "@/utils/types.generic";
import { Address, decodeFunctionResult, encodeFunctionData } from "viem";

export default function balanceOfRainRoots(address: Address) {
  const callData = encodeFunctionData({
    functionName: "balanceOfRainRoots",
    abi: diamondABI,
    args: [address],
  });

  return {
    callData,
    clipboard: Clipboard.encode([]),
  };
}

export function decodeBalanceOfRainRootsResult(data: HashString) {
  return decodeFunctionResult({
    abi: diamondABI,
    functionName: "balanceOfRainRoots",
    data,
  });
}
