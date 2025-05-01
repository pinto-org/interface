import { API_SERVICES } from "@/constants/endpoints";
import { SPECTRA_CURVE_POOLS } from "@/constants/integrations";
import { defaultQuerySettings } from "@/constants/query";
import { resolveChainId } from "@/utils/chain";
import { baseNetwork as base } from "@/utils/wagmi/chains";
import { useQuery } from "@tanstack/react-query";
import { useChainId } from "wagmi";
import { ProtocolIntegrationQueryReturnType, SpectraCurvePool } from "./types";

export type SpectraYieldSummaryResponse = { apy: number };

export const useSpectraYieldSummary = (): ProtocolIntegrationQueryReturnType<SpectraYieldSummaryResponse> => {
  const chainId = useChainId();
  const pool = SPECTRA_CURVE_POOLS[resolveChainId(chainId)];

  const endpoint = getSpectraPoolImpliedAPYEndpoint(resolveChainId(chainId), pool);

  const apyQuery = useQuery({
    queryKey: ["spectra-yield-summary", chainId],
    queryFn: async () => {
      if (!endpoint) return;
      return fetch(endpoint, { method: "GET" }).then((r) => r.json());
    },
    enabled: !!endpoint,
    select: selectAPYQuery,
    ...defaultQuerySettings,
  });

  return {
    ...apyQuery,
    integration: "SPECTRA",
  };
};

// ---------- FUNCTIONS ----------

const urlParams = new URLSearchParams({ source: "pinto" });

const getSpectraPoolImpliedAPYEndpoint = (chainId: number, pool: SpectraCurvePool) => {
  if (!API_SERVICES.spectra) return;

  const poolAddress = pool.pool.toLowerCase();

  if (chainId === base.id) {
    const chainName = base.name.toLowerCase();
    return `${API_SERVICES.spectra}/api/v1/${chainName}/implied-apy/${poolAddress}?${urlParams.toString()}`;
  }

  return;
};

const selectAPYQuery = (response: { time: number; value: number }[]) => {
  const sorted = [...response].sort((a, b) => a.time - b.time);
  const latest = sorted[sorted.length - 1];

  if (!latest) return;

  return { apy: latest.value };
};
