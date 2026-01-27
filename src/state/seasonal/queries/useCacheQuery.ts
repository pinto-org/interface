import { SeasonalChartData } from "@/components/charts/SeasonalChart";
import { SG_FETCH_DISABLED, subgraphs } from "@/constants/subgraph";
import { useSunData } from "@/state/useSunData";
import { UseSeasonalResult } from "@/utils/types";
import { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import request from "graphql-request";
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
  const historicalVars: CacheQueryVars = {
    where: historicalWhere,
    orderBy,
    orderDirection,
  };

  const currentWhere =
    orderDirection === "asc"
      ? config.buildWhere(config.toSeason, config.toSeason, config.extraVars)
      : config.buildWhere(config.fromSeason, config.fromSeason, config.extraVars);
  const currentVars: CacheQueryVars = {
    where: currentWhere,
    orderBy,
    orderDirection,
  };

  const historicalQueryKey = [
    `cache_historical_${keyName}`,
    { chainId, season: currentSeason, variables: historicalVars },
  ];

  const historical = useQuery({
    queryKey: historicalQueryKey,
    queryFn: async () => {
      const result = await request<T>(subgraphs[chainId].cache, config.document, historicalVars as any);
      return (result[config.resultKey] as R[]) || [];
    },
    select: (data: R[]) => {
      return data
        .map((v, idx) => {
          let seasonEnd: Date;
          if (idx < data.length - 1) {
            seasonEnd = config.resultTimestamp(data[idx]);
            seasonEnd.setHours(seasonEnd.getHours() + 1);
            return config.convertResult(v, seasonEnd);
          }
          if (sparseData && idx === data.length - 1) {
            seasonEnd = config.resultTimestamp(data[idx]);
            seasonEnd.setHours(seasonEnd.getHours() + 1);
            return config.convertResult(v, seasonEnd);
          }
        })
        .filter((v) => v !== undefined);
    },
    enabled: enabled && !!config.toSeason && !disabled && !SG_FETCH_DISABLED,
    staleTime: Infinity,
    gcTime: 24 * 24 * 60 * 60 * 1000,
    retry: 1,
    retryDelay: 2000,
  });

  let historicalData: SeasonalChartData[] | undefined = historical.data;

  // Fill sparse data gaps
  if (sparseData && historical.data) {
    let lastValue: SeasonalChartData;
    historicalData = historical.data.flatMap((v, i) => {
      let returnData: SeasonalChartData[] = [];
      const gapSize = i === 0 ? 0 : v.season - lastValue.season;
      if (gapSize > 1) {
        returnData = Array.from({ length: gapSize - 1 }, (_, i) => ({
          ...lastValue,
          season: lastValue.season + i + 1,
          timestamp: new Date(lastValue.timestamp.getTime() + 3600 * 1000 * (i + 1)),
        }));
      }
      returnData = [...returnData, v];
      if (i === historical.data?.length - 1 && v.season < config.toSeason) {
        const missingSize = config.toSeason - v.season;
        const missingData: SeasonalChartData[] = Array.from({ length: missingSize }, (_, i) => ({
          ...v,
          season: v.season + i + 1,
          timestamp: new Date(v.timestamp.getTime() + 3600 * 1000 * (i + 1)),
        }));
        returnData = [...returnData, ...missingData];
      }
      lastValue = v;
      return returnData;
    });
  }

  const currentQueryKey = [`cache_current_${keyName}`, { chainId, season: currentSeason, variables: currentVars }];

  const current = useQuery({
    queryKey: currentQueryKey,
    queryFn: async () => {
      const result = await request<T>(subgraphs[chainId].cache, config.document, currentVars as any);
      return (result[config.resultKey] as R[]) || [];
    },
    select: (data: R[]) => {
      return data.map((v) => {
        const queryInfo = queryClient.getQueryCache().find({ queryKey: currentQueryKey });
        const lastFetchedTimestamp = queryInfo?.state?.dataUpdatedAt;
        return config.convertResult(v, lastFetchedTimestamp ? new Date(lastFetchedTimestamp) : new Date());
      });
    },
    enabled: enabled && !!config.toSeason && !disabled && !SG_FETCH_DISABLED,
    gcTime: 60 * 1000,
    retry: 1,
    retryDelay: 2000,
  });

  return {
    data: historicalData && current.data ? [...historicalData, ...current.data] : undefined,
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
