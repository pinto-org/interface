import { Clipboard } from "@/classes/Clipboard";
import { TV } from "@/classes/TokenValue";
import { diamondABI } from "@/constants/abi/diamondABI";
import { AdvancedPipeCall, Token } from "@/utils/types";
import { HashString } from "@/utils/types.generic";
import { encodeFunctionData } from "viem";

export type IPipelineConvert = {
  stems: bigint[];
  amounts: bigint[];
  advPipeCalls: AdvancedPipeCall[];
  clipboard?: HashString;
};

export function pipelineConvert(sourceLP: Token, targetLP: Token, args: IPipelineConvert) {
  const callData = encodeFunctionData({
    abi: diamondABI,
    functionName: "pipelineConvert",
    args: [sourceLP.address, args.stems, args.amounts, targetLP.address, args.advPipeCalls],
  });

  return {
    callData: callData,
    clipboard: args.clipboard || Clipboard.encode([]),
  };
}
