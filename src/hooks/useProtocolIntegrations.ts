import { ChainLookup } from "@/utils/types.generic";
import { base } from "viem/chains"
import { useChainId } from "wagmi";
import creamFinanceLogo from "@/assets/misc/cream-finance-logo.png";
import { Token } from "@/utils/types";
import { resolveChainId } from "@/utils/chain";

interface ProtocolIntegrationSummary {
  protocol: string;
  name: string;
  url: string;
  logoURI: string;
  ctaMessage: string | ((...data: any[]) => string);
}

const baseIntegrations: Record<string, ProtocolIntegrationSummary> = {
  CREAM: {
    protocol: "CREAM",
    name: "CREAM Finance",
    url: "https://app.cream.finance/market-detail/base-meme-pool/0x98887ED12565cd9518f41A009d2EcE7c71ff271e",
    logoURI: creamFinanceLogo,
    ctaMessage: (token: Token) => `Borrow against ${token.symbol} on CREAM Finance`
  }
};

const integrationURLs: ChainLookup<Record<string, ProtocolIntegrationSummary>> = {
  [base.id]: baseIntegrations
}

export const useProtocolIntegrationLinks = () => {
  const chainId = useChainId();
  return integrationURLs[resolveChainId(chainId)];
}