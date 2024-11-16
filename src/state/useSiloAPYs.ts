import { TV } from "@/classes/TokenValue";
import { defaultQuerySettings } from "@/constants/query";
import { getTokenIndex } from "@/utils/token";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useTotalDepositedBdvPerTokenQuery } from "./useSiloData";
import useTokenData from "./useTokenData";

export type EmaWindow = 24 | 168 | 720;

export type SiloTokenEMAYield = {
  bean: number;
  ownership: number;
  stalk: number;
};

export interface SiloYieldsAPIResponse {
  ema: {
    [key in EmaWindow]: {
      beansPerSeason: string;
      effectiveWindow: number | EmaWindow;
    };
  };
  initType: "NEW" | "AVERAGE" | "CUSTOM";
  season: number;
  yields: {
    [key in EmaWindow]: {
      [tokenAddress: string]: SiloTokenEMAYield;
    };
  };
}

const normalizeYields = (yields: SiloYieldsAPIResponse["yields"][EmaWindow]) => {
  // we use lowercase addresses as a token index, so we need to normalize them in case they're not
  const entries = Object.entries(yields).map(([key, value]) => [key.toLowerCase(), value]);
  return Object.fromEntries(entries) as SiloYieldsAPIResponse["yields"][EmaWindow];
};

export function useSiloYieldsQuery() {
  return useQuery<SiloYieldsAPIResponse>({
    queryKey: ["api", "silo", "yields"],
    queryFn: async () => {
      const res = await fetch("https://api.bean.money/silo/yield", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    },
    select: (data) => {
      data.yields[24] = normalizeYields(data.yields[24]);
      data.yields[168] = normalizeYields(data.yields[168]);
      data.yields[720] = normalizeYields(data.yields[720]);

      return data;
    },
    ...defaultQuerySettings,
  });
}

export type AverageBDVWeightedSiloAPYs = {
  ema24: number;
  ema168: number;
  ema720: number;
};

/**
 * This is not a totally correct approach either, but it's close enough for now. We need to account for the
 * deposited bdv changing over time, which this does not do.
 */
export const useAverageBDVWeightedSiloAPYs = () => {
  const { data: apyResponse, isLoading: isAPYLoading, error: apyError } = useSiloYieldsQuery();
  const { data: bdvs, isLoading: isBDVLoading, error: bdvError } = useTotalDepositedBdvPerTokenQuery();
  const { whitelistedTokens } = useTokenData();

  const data: AverageBDVWeightedSiloAPYs | undefined = useMemo(() => {
    if (!apyResponse || !bdvs) return;

    const totalDepositedBDV = Object.values(bdvs).reduce<TV>((prev, curr) => prev.add(curr), TV.ZERO);
    if (!totalDepositedBDV.gt(0)) return;

    let totalWeightedYield24 = 0;
    let totalWeightedYield168 = 0;
    let totalWeightedYield720 = 0;

    for (const token of whitelistedTokens) {
      const tokenIndex = getTokenIndex(token);
      const depositedBDV = bdvs[tokenIndex];
      if (!depositedBDV) continue;

      const yield24 = apyResponse.yields[24]?.[tokenIndex]?.bean;
      const yield168 = apyResponse.yields[168]?.[tokenIndex]?.bean;
      const yield720 = apyResponse.yields[720]?.[tokenIndex]?.bean;

      const weightedYield24 = yield24 ? yield24 * depositedBDV.toNumber() : 0;
      const weightedYield168 = yield168 ? yield168 * depositedBDV.toNumber() : 0;
      const weightedYield720 = yield720 ? yield720 * depositedBDV.toNumber() : 0;

      totalWeightedYield24 += weightedYield24;
      totalWeightedYield168 += weightedYield168;
      totalWeightedYield720 += weightedYield720;
    }

    return {
      ema24: totalWeightedYield24 / totalDepositedBDV.toNumber(),
      ema168: totalWeightedYield168 / totalDepositedBDV.toNumber(),
      ema720: totalWeightedYield720 / totalDepositedBDV.toNumber(),
    };
  }, [apyResponse, bdvs, whitelistedTokens]);

  return {
    data,
    isLoading: isAPYLoading || isBDVLoading,
    error: apyError || bdvError,
  };
};
