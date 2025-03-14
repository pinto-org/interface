import { Clipboard } from "@/classes/Clipboard";
import { TV } from "@/classes/TokenValue";
import { basinWellABI } from "@/constants/abi/basinWellABI";
import { AdvancedPipeCall, Token } from "@/utils/types";
import { HashString } from "@/utils/types.generic";
import { Address, encodeFunctionData } from "viem";

export default function swapFrom(
  well: Token,
  sellToken: Token,
  buyToken: Token,
  sellAmount: TV,
  minBuyAmount: TV,
  recipient: Address,
  timeout?: bigint,
  clipboard?: HashString,
) {
  const encoded = encodeFunctionData({
    abi: basinWellABI,
    functionName: "swapFrom",
    args: [
      sellToken.address,
      buyToken.address,
      sellAmount.toBigInt(),
      minBuyAmount.toBigInt(),
      recipient,
      timeout ?? TV.MAX_UINT256.toBigInt(),
    ],
  });

  return {
    target: well.address,
    callData: encoded,
    clipboard: clipboard || Clipboard.encode([]),
  } as AdvancedPipeCall;
}
