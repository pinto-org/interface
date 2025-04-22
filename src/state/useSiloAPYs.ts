import { TV } from "@/classes/TokenValue";
import { API_SERVICES } from "@/constants/endpoints";
import { defaultQuerySettings } from "@/constants/query";
import { useTokenMap } from "@/hooks/pinto/useTokenMap";
import { getTokenIndex } from "@/utils/token";
import { ConstrainedUseQueryArgs, Token } from "@/utils/types";
import { AddressLookup } from "@/utils/types.generic";
import { QueryKey, useQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { useTotalDepositedBdvPerTokenQuery } from "./useSiloData";
import { useSeason } from "./useSunData";
import useTokenData, { useWhitelistedTokens } from "./useTokenData";

export type EmaWindow = 24 | 168 | 720 | 2160;

/**
 * Yields for a single token, for a single EMA window.
 */
export interface SiloTokenEMAYield {
  bean: number;
  ownership: number;
  stalk: number;
}

export type EMAWindows<T> = {
  ema24: T;
  ema168: T;
  ema720: T;
  ema2160: T;
};

/**
 * Yields for a single token, across different EMA windows.
 */
export interface SiloTokenYield extends EMAWindows<number> {}

/**
 * API response from /silo/yields
 */
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

export function useSiloYieldsQuery<TSelect = SiloYieldsAPIResponse>(
  arg?: ConstrainedUseQueryArgs<SiloYieldsAPIResponse, TSelect>,
) {
  return useQuery<SiloYieldsAPIResponse, Error, TSelect, QueryKey>({
    queryKey: ["api", "silo", "yields"],
    queryFn: async () => {
      const res = await fetch(`${API_SERVICES.pinto}/silo/yield`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emaWindows: [24, 168, 720, 2160],
        }),
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const result = await res.json();
      const season90d = result.ema["2160"].effectiveWindow;

      if (season90d < 2160) {
        const seasonData = result.yields[season90d];
        const currentBeansPerSeason = result.ema["2160"].beansPerSeason;

        // Update yields
        delete result.yields[season90d];
        result.yields["2160"] = seasonData;

        // Update EMA
        result.ema["2160"] = {
          effectiveWindow: 2160,
          beansPerSeason: currentBeansPerSeason,
        };
      }

      result.yields[24] = normalizeYields(result.yields[24]);
      result.yields[168] = normalizeYields(result.yields[168]);
      result.yields[720] = normalizeYields(result.yields[720]);
      result.yields[2160] = normalizeYields(result.yields[2160]);

      return result;
    },
    ...defaultQuerySettings,
    retry(failureCount, _error) {
      return failureCount < 2;
    },
    ...(arg || {}),
    enabled: !!API_SERVICES.pinto,
  });
}

export type SiloYieldsByToken = AddressLookup<Partial<SiloTokenYield>>;

export function useSiloYieldsByToken<T = SiloYieldsByToken>(args?: {
  select?: (data: SiloYieldsByToken) => T;
}) {
  const whitelist = useWhitelistedTokens();

  const selectYields = useCallback(
    (data: SiloYieldsAPIResponse) => {
      const apys: SiloYieldsByToken = {};

      whitelist.forEach((token) => {
        const tokenIndex = getTokenIndex(token);

        const ema24 = data.yields[24]?.[tokenIndex]?.bean ?? 0;
        const ema168 = data.yields[168]?.[tokenIndex]?.bean ?? 0;
        const ema720 = data.yields[720]?.[tokenIndex]?.bean ?? 0;
        const ema2160 = data.yields[2160]?.[tokenIndex]?.bean ?? 0;

        const obj = {
          ema24,
          ema168,
          ema720,
          ema2160,
        };

        apys[tokenIndex] = obj;
      });

      return args?.select?.(apys) || apys;
    },
    [whitelist, args?.select],
  );

  return useSiloYieldsQuery({ select: selectYields });
}

export const useSiloTokenAPYs = (token: Token | string | undefined) => {
  const tokenMap = useTokenMap();

  const siloToken = tokenMap[getTokenIndex(token ?? "")];

  const selectSiloYields = useCallback(
    (data: SiloYieldsAPIResponse) => {
      const apys: Partial<SiloTokenYield> = {
        ema24: undefined,
        ema168: undefined,
        ema720: undefined,
        ema2160: undefined,
      };

      if (token) {
        const tokenIndex = getTokenIndex(token);
        apys.ema24 = data.yields[24]?.[tokenIndex]?.bean;
        apys.ema168 = data.yields[168]?.[tokenIndex]?.bean;
        apys.ema720 = data.yields[720]?.[tokenIndex]?.bean;
        apys.ema2160 = data.yields[2160]?.[tokenIndex]?.bean;
      }

      return apys;
    },
    [token],
  );

  return useSiloYieldsQuery<Partial<SiloTokenYield>>({
    select: selectSiloYields,
    enabled: !!siloToken,
  });
};

/**
 * This is not a totally correct approach either, but it's close enough for now. We need to account for the
 * deposited bdv changing over time, which this does not do.
 */
export const useAverageBDVWeightedSiloAPYs = () => {
  const { data: apyResponse, isLoading: isAPYLoading, error: apyError } = useSiloYieldsQuery();
  const { data: bdvs, isLoading: isBDVLoading, error: bdvError } = useTotalDepositedBdvPerTokenQuery();
  const { whitelistedTokens } = useTokenData();

  const data: SiloTokenYield | undefined = useMemo(() => {
    if (!apyResponse || !bdvs) return;

    const totalDepositedBDV = Object.values(bdvs).reduce<TV>((prev, curr) => prev.add(curr), TV.ZERO);
    if (!totalDepositedBDV.gt(0)) return;

    let totalWeightedYield24 = 0;
    let totalWeightedYield168 = 0;
    let totalWeightedYield720 = 0;
    let totalWeightedYield2160 = 0;

    for (const token of whitelistedTokens) {
      const tokenIndex = getTokenIndex(token);
      const depositedBDV = bdvs[tokenIndex];
      if (!depositedBDV) continue;

      const yield24 = apyResponse.yields[24]?.[tokenIndex]?.bean;
      const yield168 = apyResponse.yields[168]?.[tokenIndex]?.bean;
      const yield720 = apyResponse.yields[720]?.[tokenIndex]?.bean;
      const yield2160 = apyResponse.yields[2160]?.[tokenIndex]?.bean;

      const weightedYield24 = yield24 ? yield24 * depositedBDV.toNumber() : 0;
      const weightedYield168 = yield168 ? yield168 * depositedBDV.toNumber() : 0;
      const weightedYield720 = yield720 ? yield720 * depositedBDV.toNumber() : 0;
      const weightedYield2160 = yield2160 ? yield2160 * depositedBDV.toNumber() : 0;

      totalWeightedYield24 += weightedYield24;
      totalWeightedYield168 += weightedYield168;
      totalWeightedYield720 += weightedYield720;
      totalWeightedYield2160 += weightedYield2160;
    }

    return {
      ema24: totalWeightedYield24 / totalDepositedBDV.toNumber(),
      ema168: totalWeightedYield168 / totalDepositedBDV.toNumber(),
      ema720: totalWeightedYield720 / totalDepositedBDV.toNumber(),
      ema2160: totalWeightedYield2160 / totalDepositedBDV.toNumber(),
    };
  }, [apyResponse, bdvs, whitelistedTokens]);

  return {
    data,
    isLoading: isAPYLoading || isBDVLoading,
    error: apyError || bdvError,
  };
};
