import { AdvancedPipeCall } from "@/utils/types";
import { TV } from "@/classes/TokenValue";
import { siloedPintoABI } from "@/constants/abi/siloedPintoABI";
import { Address, encodeFunctionData } from "viem";
import { Clipboard } from "@/classes/Clipboard";
import { HashString } from "@/utils/types.generic";

export default function siloedTokenDeposit(
  assetsAmount: TV,
  recipient: Address,
  target: Address,
  clipboard: HashString = Clipboard.encode([]),
): AdvancedPipeCall {
  const callData = encodeFunctionData({
    abi: siloedPintoABI,
    functionName: "deposit",
    args: [assetsAmount.toBigInt(), recipient],
  });

  return {
    target,
    callData,
    clipboard,
  };
}