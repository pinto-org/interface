import { Clipboard } from "@/classes/Clipboard";
import { TV } from "@/classes/TokenValue";
import { diamondABI } from "@/constants/abi/diamondABI";
import { AdvancedPipeCall, Token } from "@/utils/types";
import { HashString } from "@/utils/types.generic";
import { encodeFunctionData } from "viem";

export type IPipelineConvert = {
  stem: TV;
  amount: TV;
  advPipeCalls: AdvancedPipeCall[];
  clipboard?: HashString;
};

export function pipelineConvert(sourceLP: Token, targetLP: Token, data: IPipelineConvert[]) {
  const encoded = data.map((args) => {
    const callData = encodeFunctionData({
      abi: diamondABI,
      functionName: "pipelineConvert",
      args: [
        sourceLP.address,
        [BigInt(args.stem.blockchainString)],
        [BigInt(args.amount.blockchainString)],
        targetLP.address,
        args.advPipeCalls,
      ],
    });

    return {
      callData: callData,
      clipboard: args.clipboard || Clipboard.encode([]),
    };
  });

  return encoded;
}
