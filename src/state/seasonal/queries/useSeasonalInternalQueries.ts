import { SeasonalChartData } from "@/components/charts/SeasonalChart";
import { useSunData } from "@/state/useSunData";
import { UseSeasonalResult } from "@/utils/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useChainId } from "wagmi";

export type SeasonalExtraVars = {
  [key: string]: unknown;
};

export type SeasonalQueryVars = {
  from: number;
  to: number;
} & SeasonalExtraVars;

export type SeasonalQueryConfig<T> = {
  fromSeason: number;
  toSeason: number;
  queryVars: SeasonalExtraVars;
  historicalQueryFnFactory: QueryFnFactory<T>;
  currentQueryFnFactory: QueryFnFactory<T>;
  resultTimestamp: ResultTimestampFn<T>;
  convertResult: ConvertEntryFn<T>;
};

export type QueryFnFactory<T> = (vars: SeasonalQueryVars) => () => Promise<T[]>;
export type ResultTimestampFn<T> = (d: T) => Date;
export type ConvertEntryFn<T> = (d: T, timestamp: Date) => SeasonalChartData;

export default function useSeasonalQueries<T>(keyName: string, queryConfig: SeasonalQueryConfig<T>): UseSeasonalResult {
  const queryClient = useQueryClient();
  const currentSeason = useSunData().current;
  const chainId = useChainId();

  // Current season should be discarded from historical in the select step
  const historicalVars = {
    from: queryConfig.fromSeason,
    to: queryConfig.toSeason,
    ...queryConfig.queryVars,
  };

  const currentVars = {
    from: queryConfig.toSeason,
    to: queryConfig.toSeason,
    ...queryConfig.queryVars,
  };

  const historicalQueryKey = [
    `historical_${keyName}`,
    { chainId: chainId, season: currentSeason, variables: historicalVars },
  ];
  const historical = useQuery({
    queryKey: historicalQueryKey,
    queryFn: queryConfig.historicalQueryFnFactory(historicalVars),
    select: (data: T[]) => {
      return data
        .map((v, idx) => {
          // Data is presented at the time of season completion.
          // The final season is part of this result, but extraneous and reselected as the current season.
          let seasonEnd: Date;
          if (idx < data.length - 1) {
            seasonEnd = queryConfig.resultTimestamp(data[idx + 1]);
            return queryConfig.convertResult(v, seasonEnd);
          }
        })
        .filter((v) => v !== undefined);
    },
    enabled: !!historicalVars.to,
    staleTime: Infinity,
    retry: 1,
    retryDelay: 2000,
  });

  // Current season's result is reported with the current timestamp.
  // It can change and thus requires a separate query
  const currentQueryKey = [`current_${keyName}`, { chainId, season: currentSeason, variables: currentVars }];
  const current = useQuery({
    queryKey: currentQueryKey,
    queryFn: queryConfig.currentQueryFnFactory(currentVars),
    select: (data: T[]) => {
      return data.map((v) => {
        const queryInfo = queryClient.getQueryCache().find({ queryKey: currentQueryKey });
        const lastFetchedTimestamp = queryInfo?.state?.dataUpdatedAt;
        return queryConfig.convertResult(v, lastFetchedTimestamp ? new Date(lastFetchedTimestamp) : new Date());
      });
    },
    enabled: !!currentVars.to,
    // Requery result up to once per minute
    gcTime: 60 * 1000,
    retry: 1,
    retryDelay: 2000,
  });

  return {
    data: historical.data && current.data ? [...historical.data, ...current.data] : undefined,
    isLoading: historical.isLoading || current.isLoading,
    isError: historical.isError || current.isError,
  };
}
