import { Clipboard } from "@/classes/Clipboard";
import { TV } from "@/classes/TokenValue";
import { diamondABI } from "@/constants/abi/diamondABI";
import { AdvancedFarmCall, AdvancedPipeCall, Token } from "@/utils/types";
import { HashString } from "@/utils/types.generic";
import { Address, encodeFunctionData } from "viem";
import advancedPipe from "../advancedPipe";
import junctionGte from "../junction/junctionGte";
import balanceOfStalk from "./balanceOfStalk";

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

// export function pipelineConvertWrapped(
//   diamondAddress: Address,
//   account: Address,
//   sourceLP: Token,
//   targetLP: Token,
//   data: IPipelineConvert[],
//   stalkBalance: TV,
//   clipboard?: HashString,
// ) {
//   const encoded = data.map((args) => {
//     const callData = encodeFunctionData({
//       abi: diamondABI,
//       functionName: "pipelineConvert",
//       args: [
//         sourceLP.address,
//         [BigInt(args.stem.blockchainString)],
//         [BigInt(args.amount.blockchainString)],
//         targetLP.address,
//         args.advPipeCalls,
//       ],
//     });

//     return {
//       target: diamondAddress,
//       callData: callData,
//       clipboard: args.clipboard || Clipboard.encode([]),
//     };
//   });

//   const balanceOfStalk1 = balanceOfStalk(account, diamondAddress, Clipboard.encodeSlot(0, 0, 0));

//   // const datas = [, ...encoded, balanceOfStalk1];
// }
