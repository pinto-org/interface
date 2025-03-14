import { Clipboard } from "@/classes/Clipboard";
import { TV } from "@/classes/TokenValue";
import { siloedPintoABI } from "@/constants/abi/siloedPintoABI";
import { AdvancedFarmCall, AdvancedPipeCall, FarmToMode } from "@/utils/types";
import { HashString } from "@/utils/types.generic";
import { Address, encodeFunctionData } from "viem";

export default function depositFromSilo(
  stems: TV[],
  amounts: TV[],
  recipient: Address,
  toMode: FarmToMode,
  clipboard: HashString = Clipboard.encode([]),
  target?: Address
): AdvancedFarmCall | AdvancedPipeCall {
  const callData = encodeFunctionData({
    abi: siloedPintoABI,
    functionName: "depositFromSilo",
    args: [
      stems.map((stem) => stem.toBigInt()),
      amounts.map((amount) => amount.toBigInt()),
      recipient,
      Number(toMode)
    ]
  });

  if (target) {
    return {
      target,
      callData,
      clipboard
    } as AdvancedPipeCall;
  }

  return {
    callData,
    clipboard
  } as AdvancedFarmCall;
}