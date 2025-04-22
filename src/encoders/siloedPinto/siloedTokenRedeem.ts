import { Clipboard } from "@/classes/Clipboard";
import { TV } from "@/classes/TokenValue";
import { siloedPintoABI } from "@/constants/abi/siloedPintoABI";
import { AdvancedPipeCall } from "@/utils/types";
import { HashString } from "@/utils/types.generic";
import { Address, encodeFunctionData } from "viem";

export default function siloedTokenRedeem(
  shares: TV,
  recipient: Address,
  owner: Address,
  target: Address,
  clipboard: HashString = Clipboard.encode([]),
): AdvancedPipeCall {
  const callData = encodeFunctionData({
    abi: siloedPintoABI,
    functionName: "redeem",
    args: [shares.toBigInt(), recipient, owner],
  });

  return {
    target,
    callData,
    clipboard,
  };
}
