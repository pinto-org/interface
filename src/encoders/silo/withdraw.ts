import { Clipboard } from "@/classes/Clipboard";
import { TV } from "@/classes/TokenValue";
import { diamondABI } from "@/constants/abi/diamondABI";
import { AdvancedFarmCall, FarmToMode, Token } from "@/utils/types";
import { HashString } from "@/utils/types.generic";
import { encodeFunctionData } from "viem";

export default function siloWithdraw(
  siloToken: Token,
  stems: TV[],
  amounts: TV[],
  destination: FarmToMode,
  clipboard: HashString = Clipboard.encode([]),
): AdvancedFarmCall {
  let callData: HashString;

  if (stems.length === 1) {
    callData = encodeFunctionData({
      abi: diamondABI,
      functionName: "withdrawDeposit",
      args: [siloToken.address, stems[0].toBigInt(), amounts[0].toBigInt(), Number(destination)],
    });
  } else {
    callData = encodeFunctionData({
      abi: diamondABI,
      functionName: "withdrawDeposits",
      args: [
        siloToken.address,
        stems.map((stem) => stem.toBigInt()),
        amounts.map((amount) => amount.toBigInt()),
        Number(destination),
      ],
    });
  }

  return {
    callData,
    clipboard,
  };
}
