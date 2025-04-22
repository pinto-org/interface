import creamFinanceLogo from "@/assets/misc/cream-finance-logo.png";
import spectraLogo from "@/assets/misc/spectra-token-logo.svg";
import { ProtocolIntegration } from "@/state/integrations/types";
import { SpectraYieldSummaryResponse } from "@/state/integrations/useSpectraYieldSummary";
import { resolveChainId } from "@/utils/chain";
import { formatter } from "@/utils/format";
import { Token } from "@/utils/types";
import { ChainLookup } from "@/utils/types.generic";
import { base } from "viem/chains";
import { useChainId } from "wagmi";

export interface ProtocolIntegrationSummary {
  protocol: string;
  name: string;
  url: string;
  logoURI: string;
  ctaMessage: string | ((token: Token, ...data: any[]) => string | JSX.Element);
}

type IntegrationLookup = Partial<Record<ProtocolIntegration, ProtocolIntegrationSummary>>;

const baseIntegrations: IntegrationLookup = {
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
    ctaMessage: (token, data: SpectraYieldSummaryResponse | undefined) => {
      const apy = data?.apy ? `${formatter.pct(data.apy)}` : "-%";

      return (
        <span>
          Earn a APY of <span className={data?.apy ? "text-pinto-green-4" : ""}>{apy}</span> or trade yield with{" "}
          {token.symbol} on Spectra
        </span>
      );
    },
  },
} as const;

const integrationURLs: ChainLookup<IntegrationLookup> = {
  [base.id]: baseIntegrations,
};

export const useProtocolIntegrationLinks = () => {
  const chainId = useChainId();
  return integrationURLs[resolveChainId(chainId)];
};
