import { Clipboard } from "@/classes/Clipboard";
import { TV } from "@/classes/TokenValue";
import { basinWellABI } from "@/constants/abi/basinWellABI";
import { AdvancedPipeCall, Token } from "@/utils/types";
import { HashString } from "@/utils/types.generic";
import { Address, decodeFunctionData, decodeFunctionResult, encodeFunctionData } from "viem";

export default function getWellSwapOut(
  well: Token | Address,
  sellToken: Token | Address,
  buyToken: Token | Address,
  amount: TV,
  clipboard?: HashString,
): AdvancedPipeCall {
  const tokenIn = typeof sellToken === "object" ? sellToken : { address: sellToken };
  const tokenOut = typeof buyToken === "object" ? buyToken : { address: buyToken };
  const target = typeof well === "object" ? well : { address: well };

  const encoded = encodeFunctionData({
    abi: basinWellABI,
    functionName: "getSwapOut",
    args: [tokenIn.address, tokenOut.address, amount.toBigInt()],
  });

  return {
    callData: encoded,
    target: target.address,
    clipboard: clipboard || Clipboard.encode([]),
  };
}

export function decodeGetSwapOut(data: HashString) {
  return decodeFunctionResult({
    abi: basinWellABI,
    functionName: "getSwapOut",
    data,
  });
}
