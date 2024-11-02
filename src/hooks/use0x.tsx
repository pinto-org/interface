import { ZeroX } from "@/lib/matcha/ZeroX";
import { ZeroExAPI } from "@/lib/matcha/types";
import { useQuery } from "@tanstack/react-query";
import { useAccount, useChainId } from "wagmi";

interface ZeroExQuote extends ZeroExAPI {
  mode: "exactInput" | "exactOutput";
  enabled: boolean;
}

export default function use0x(settings: ZeroExQuote) {
  const chainId = useChainId();
  const account = useAccount().address || "0x";

  const queryParamsKey = JSON.stringify(ZeroX.generateQuoteParams(settings));

  const query = useQuery({
    queryKey: ["0xSwapQuote", { chainId: chainId, params: queryParamsKey }],
    queryFn: async ({ signal }) => {
      const response = await ZeroX.quote(settings, { signal });
      return response;
    },
    enabled: !!account && ZeroX.isValidQuoteParams(settings) && !!settings.enabled,
  });

  return query;
}

// Keeping for reference
// const endpoints = {
//   [mainnet.id]: "https://api.0x.org/swap/v1/quote?",
//   [arbitrum.id]: "https://arbitrum.api.0x.org/swap/v1/quote?",
//   [avalanche.id]: "https://avalanche.api.0x.org/swap/v1/quote?",
//   [base.id]: "https://base.api.0x.org/swap/v1/quote?",
//   [bsc.id]: "https://bsc.api.0x.org/swap/v1/quote?",
//   [celo.id]: "https://celo.api.0x.org/swap/v1/quote?",
//   [fantom.id]: "https://fantom.api.0x.org/swap/v1/quote?",
//   [optimism.id]: "https://optimism.api.0x.org/swap/v1/quote?",
//   [polygon.id]: "https://polygon.api.0x.org/swap/v1/quote?",
//   41337: "https://base.api.0x.org/swap/v1/quote?",
//   [localhost.id]: "https://base.api.0x.org/swap/v1/quote?",
//   [foundry.id]: "https://base.api.0x.org/swap/v1/quote?",
// };
