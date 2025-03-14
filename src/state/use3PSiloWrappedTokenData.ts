import { TokenValue } from "@/classes/TokenValue";
import { CREAM_S_MAIN_TOKEN } from "@/constants/tokens";
import { useChainConstant } from "@/utils/chain";
import { useReadContract } from "wagmi";

const creamABISnippet = [
  {
    constant: true,
    inputs: [],
    name: "exchangeRateStored",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
] as const;

export const useCreamSiloWrappedTokenExchangeRate = () => {
  const token = useChainConstant(CREAM_S_MAIN_TOKEN);
  return useReadContract({
    address: token.address,
    abi: creamABISnippet,
    functionName: "exchangeRateStored",
    query: {
      select: (data) => {
        return TokenValue.fromBigInt(data, 28);
      },
    },
  });
};
