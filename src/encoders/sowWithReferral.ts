import { Clipboard } from "@/classes/Clipboard";
import { TokenValue } from "@/classes/TokenValue";
import { beanstalkAbi } from "@/generated/contractHooks";
import { FarmFromMode } from "@/utils/types";
import type { Address } from "viem";
import { encodeFunctionData } from "viem";

export default function sowWithReferral(
  amount?: TokenValue,
  minTemp?: TokenValue,
  minSoil?: TokenValue,
  balanceFrom?: FarmFromMode,
  referral?: Address,
  clipboard?: `0x${string}`,
) {
  if (!amount || !minTemp || !minSoil || !balanceFrom || !referral) {
    return {
      callData: "0x" as `0x${string}`,
      clipboard: Clipboard.encode([]),
    };
  }

  const data = encodeFunctionData({
    abi: beanstalkAbi,
    functionName: "sowWithReferral",
    args: [amount.toBigInt(), minTemp.toBigInt(), minSoil.toBigInt(), Number(balanceFrom), referral],
  });

  return {
    callData: data,
    clipboard: clipboard || Clipboard.encode([]),
  };
}
