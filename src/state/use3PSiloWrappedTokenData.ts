import { TokenValue } from "@/classes/TokenValue";
import { defaultQuerySettings } from "@/constants/query";
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

const select = (token: bigint) => {
  return TokenValue.fromBigInt(token, 28);
};

export const useCreamSiloWrappedTokenExchangeRate = () => {
  const token = useChainConstant(CREAM_S_MAIN_TOKEN);
  return useReadContract({
    address: token.address,
    abi: creamABISnippet,
    functionName: "exchangeRateStored",
    query: {
      ...defaultQuerySettings,
      select: select,
    },
  });
};
