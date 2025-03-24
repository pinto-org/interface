import creamFinanceLogo from "@/assets/misc/cream-finance-logo.png";
import spectraLogo from "@/assets/misc/spectra-token-logo.svg";
import { resolveChainId } from "@/utils/chain";
import { Token } from "@/utils/types";
import { ChainLookup } from "@/utils/types.generic";
import { base } from "viem/chains";
import { useChainId } from "wagmi";
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
    ctaMessage: (token: Token) => `Borrow against ${token.symbol} on CREAM Finance`,
  },
  SPECTRA: {
    protocol: "SPECTRA",
    name: "Spectra",
    url: "https://app.spectra.finance/pools/base:0xd8e4662ffd6b202cf85e3783fb7252ff0a423a72",
    logoURI: spectraLogo,
    ctaMessage: (token: Token) => `Get Fixed rates or trade yield with ${token.symbol} on Spectra`,
  },
} as const;

const integrationURLs: ChainLookup<Record<string, ProtocolIntegrationSummary>> = {
  [base.id]: baseIntegrations,
};

export const useProtocolIntegrationLinks = () => {
  const chainId = useChainId();
  return integrationURLs[resolveChainId(chainId)];
};
