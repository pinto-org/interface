import { SeasonalChartData } from "@/components/charts/SeasonalChart";
import { SG_FETCH_DISABLED, subgraphs } from "@/constants/subgraph";
import { useSunData } from "@/state/useSunData";
import { UseSeasonalResult } from "@/utils/types";
import { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import request from "graphql-request";
import { useCallback, useMemo } from "react";
import { useChainId } from "wagmi";

export type CacheQueryVars = {
  where: string;
  orderBy: string;
  orderDirection: string;
};

export type CacheMultiQueryVars = {
  seasonsWhere?: string;
  seasonsOrderBy?: string;
  seasonsOrderDirection?: string;
  fieldWhere?: string;
  fieldOrderBy?: string;
  fieldOrderDirection?: string;
  siloWhere?: string;
  siloOrderBy?: string;
  siloOrderDirection?: string;
};

export type ConvertEntryFn<T> = (d: T, timestamp: Date) => SeasonalChartData;
export type ResultTimestampFn<T> = (d: T) => Date;

interface CacheQueryConfig<T, R> {
  fromSeason: number;
  toSeason: number;
  document: TypedDocumentNode<T, CacheQueryVars>;
  buildWhere: (from: number, to: number, extraVars?: Record<string, unknown>) => string;
  extraVars?: Record<string, unknown>;
  resultKey: keyof T;
  resultTimestamp: ResultTimestampFn<R>;
  convertResult: ConvertEntryFn<R>;
  orderBy?: string;
  orderDirection?: "asc" | "desc";
  enabled?: boolean;
  sparseData?: boolean;
}

/**
 * Hook for querying the cache endpoint.
 * Cache endpoint returns all results in one request (no pagination needed).
 * The `where` parameter is a GraphQL filter syntax string.
 *
 * Returns isError: true if cache fails - use useCacheWithSGFallback for automatic fallback.
 */
export function useCacheQuery<T, R>(
  keyName: string,
  config: CacheQueryConfig<T, R>,
  disabled: boolean = false,
): UseSeasonalResult {
  const queryClient = useQueryClient();
  const currentSeason = useSunData().current;
  const chainId = useChainId();
  const orderDirection = config.orderDirection || "asc";
  const orderBy = config.orderBy || "season";
  const enabled = config.enabled ?? true;
  const sparseData = config.sparseData ?? false;

  const historicalWhere = config.buildWhere(config.fromSeason, config.toSeason, config.extraVars);
  const historicalVars: CacheQueryVars = useMemo(
    () => ({
      where: historicalWhere,
      orderBy,
      orderDirection,
    }),
    [historicalWhere, orderBy, orderDirection],
  );

  const currentWhere =
    orderDirection === "asc"
      ? config.buildWhere(config.toSeason, config.toSeason, config.extraVars)
      : config.buildWhere(config.fromSeason, config.fromSeason, config.extraVars);
  const currentVars: CacheQueryVars = useMemo(
    () => ({
      where: currentWhere,
      orderBy,
      orderDirection,
    }),
    [currentWhere, orderBy, orderDirection],
  );

  const historicalQueryKey = useMemo(
    () => [`cache_historical_${keyName}`, { chainId, season: currentSeason, variables: historicalVars }],
    [keyName, chainId, currentSeason, historicalVars],
  );

  const selectHistorical = useCallback(
    (data: R[]) => {
      return data
        .map((v, idx) => {
          if (idx < data.length - 1 || (sparseData && idx === data.length - 1)) {
            const seasonEnd = new Date(config.resultTimestamp(data[idx]));
            seasonEnd.setHours(seasonEnd.getHours() + 1);
            return config.convertResult(v, seasonEnd);
          }
          return undefined;
        })
        .filter((v): v is SeasonalChartData => v !== undefined);
    },
    [config.resultTimestamp, config.convertResult, sparseData],
  );

  const historicalQueryFn = useCallback(async () => {
    const result = await request<T>(subgraphs[chainId].cache, config.document, historicalVars as any);
    return (result[config.resultKey] as R[]) || [];
  }, [chainId, config.document, config.resultKey, historicalVars]);

  const historical = useQuery({
    queryKey: historicalQueryKey,
    queryFn: historicalQueryFn,
    select: selectHistorical,
    enabled: enabled && !!config.toSeason && !disabled && !SG_FETCH_DISABLED,
    staleTime: Infinity,
    gcTime: 24 * 24 * 60 * 60 * 1000,
    retry: 1,
    retryDelay: 2000,
  });

  // Fill sparse data gaps
  const historicalData = useMemo(() => {
    if (!sparseData || !historical.data) {
      return historical.data;
    }

    return historical.data.reduce<SeasonalChartData[]>((acc, v, i, arr) => {
      const lastValue = acc[acc.length - 1];
      const gapSize = i === 0 ? 0 : v.season - lastValue.season;

      // Fill gaps between entries
      if (gapSize > 1) {
        const gapFill = Array.from({ length: gapSize - 1 }, (_, idx) => ({
          ...lastValue,
          season: lastValue.season + idx + 1,
          timestamp: new Date(lastValue.timestamp.getTime() + 3600 * 1000 * (idx + 1)),
        }));
        acc.push(...gapFill);
      }

      acc.push(v);

      // Fill missing entries at the end
      if (i === arr.length - 1 && v.season < config.toSeason) {
        const missingSize = config.toSeason - v.season;
        const missingData = Array.from({ length: missingSize }, (_, idx) => ({
          ...v,
          season: v.season + idx + 1,
          timestamp: new Date(v.timestamp.getTime() + 3600 * 1000 * (idx + 1)),
        }));
        acc.push(...missingData);
      }

      return acc;
    }, []);
  }, [sparseData, historical.data, config.toSeason]);

  const currentQueryKey = useMemo(
    () => [`cache_current_${keyName}`, { chainId, season: currentSeason, variables: currentVars }],
    [keyName, chainId, currentSeason, currentVars],
  );

  const selectCurrent = useCallback(
    (data: R[]) => {
      return data.map((v) => {
        const queryInfo = queryClient.getQueryCache().find({ queryKey: currentQueryKey });
        const lastFetchedTimestamp = queryInfo?.state?.dataUpdatedAt;
        return config.convertResult(v, lastFetchedTimestamp ? new Date(lastFetchedTimestamp) : new Date());
      });
    },
    [queryClient, currentQueryKey, config.convertResult],
  );

  const currentQueryFn = useCallback(async () => {
    const result = await request<T>(subgraphs[chainId].cache, config.document, currentVars as any);
    return (result[config.resultKey] as R[]) || [];
  }, [chainId, config.document, config.resultKey, currentVars]);

  const current = useQuery({
    queryKey: currentQueryKey,
    queryFn: currentQueryFn,
    select: selectCurrent,
    enabled: enabled && !!config.toSeason && !disabled && !SG_FETCH_DISABLED,
    gcTime: 60 * 1000,
    retry: 1,
    retryDelay: 2000,
  });

  const combinedData = useMemo(() => {
    if (!historicalData || !current.data) return undefined;
    return [...historicalData, ...current.data];
  }, [historicalData, current.data]);

  return {
    data: combinedData,
    isLoading: historical.isLoading || current.isLoading,
    isError: historical.isError || current.isError,
  };
}

/**
 * Hook that combines cache and SG results with proper fallback logic.
 * SG query is only enabled when cache fails.
 *
 * @param cacheResult - Result from cache query
 * @param sgResult - Result from SG query (should be called with enabled based on cache status)
 */
export function useCacheWithSGFallback(cacheResult: UseSeasonalResult, sgResult: UseSeasonalResult): UseSeasonalResult {
  // If cache is still loading, show loading state
  if (cacheResult.isLoading) {
    return { isLoading: true, isError: false, data: undefined };
  }

  // If cache failed, use SG result
  const cacheHasFailed = cacheResult.isError || !cacheResult.data;
  if (cacheHasFailed) {
    return sgResult;
  }

  // Cache succeeded, use cache data
  return cacheResult;
}

/**
 * Helper to determine if SG fallback should be enabled.
 * Use this to pass to SG hooks' enabled parameter.
 */
export function useShouldUseSGFallback(cacheResult: UseSeasonalResult): boolean {
  // Enable SG only if cache has finished loading and failed
  return !cacheResult.isLoading && (cacheResult.isError || !cacheResult.data);
}

/**
 * Build a where clause string for cache endpoint queries.
 * Cache endpoint expects the where clause as a string in GraphQL filter syntax.
 * Example: "season_gte: 100, season_lte: 200, silo: \"0x123...\""
 */
export function buildCacheWhere(filters: Record<string, unknown>): string {
  const parts: string[] = [];
  for (const [key, value] of Object.entries(filters)) {
    if (typeof value === "string") {
      parts.push(`${key}: "${value}"`);
    } else {
      parts.push(`${key}: ${value}`);
    }
  }
  return parts.join(", ");
}

/**
 * Build a season range where clause for cache endpoint.
 */
export function buildSeasonRangeWhere(from: number, to: number, additionalFilters?: Record<string, unknown>): string {
  return buildCacheWhere({
    season_gte: from,
    season_lte: to,
    ...additionalFilters,
  });
}
