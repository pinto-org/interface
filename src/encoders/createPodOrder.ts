import { Address, encodeFunctionData } from "viem";
import { TokenValue } from "@/classes/TokenValue";
import { AdvancedFarmCall, FarmFromMode } from "@/utils/types";
import { beanstalkAbi } from "@/generated/contractHooks";
import { Clipboard } from "@/classes/Clipboard";

export default function createPodOrder(
  account: Address,
  amount?: TokenValue,
  pricePerPod?: number,
  maxPlaceInLine?: TokenValue,
  minFill?: TokenValue,
  balanceFrom?: FarmFromMode,
  clipboard?: `0x${string}`,
) {
  if (!amount || !pricePerPod || !maxPlaceInLine || !minFill || !balanceFrom) {
    return {
      callData: "0x" as `0x${string}`,
      clipboard: Clipboard.encode([]),
    };
  }

  const data = encodeFunctionData({
    abi: beanstalkAbi,
    functionName: "createPodOrder",
    args: [
      {
        orderer: account,
        fieldId: 0n,
        pricePerPod,
        maxPlaceInLine: maxPlaceInLine.toBigInt(),
        minFillAmount: minFill.toBigInt(),
      },
      amount.toBigInt(),
      Number(balanceFrom),
    ],
  });

  return {
    callData: data,
    clipboard: clipboard || Clipboard.encode([]),
  } satisfies AdvancedFarmCall;
}
