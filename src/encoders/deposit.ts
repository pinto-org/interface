import { Clipboard } from "@/classes/Clipboard";
import { TokenValue } from "@/classes/TokenValue";
import { FarmFromMode, Token } from "@/utils/types";
import { encodeFunctionData } from "viem";

export default function deposit(
  siloToken?: Token,
  amount?: TokenValue,
  balanceFrom?: FarmFromMode,
  clipboard?: `0x${string}`,
) {
  if (!siloToken || !amount || !balanceFrom) {
    return {
      callData: "0x" as `0x${string}`,
      clipboard: Clipboard.encode([]),
    };
  }

  const data = encodeFunctionData({
    abi: depositABI,
    functionName: "deposit",
    args: [siloToken.address, amount.toBigInt(), Number(balanceFrom)],
  });

  return {
    callData: data,
    clipboard: clipboard || Clipboard.encode([]),
  };
}

const depositABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
      {
        internalType: "enum LibTransfer.From",
        name: "mode",
        type: "uint8",
      },
    ],
    name: "deposit",
    outputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_bdv",
        type: "uint256",
      },
      {
        internalType: "int96",
        name: "stem",
        type: "int96",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
] as const;
