import { SeasonalChartData } from "@/components/charts/SeasonalChart";
import { UseSeasonalResult } from "@/utils/types";
import { QueryClient, QueryKey, useQuery, useQueryClient } from "@tanstack/react-query";
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
  historicalSelect: SelectFn<T>;
  currentQueryFnFactory: QueryFnFactory<T>;
  currentSelect: SelectFn<T>;
};

type QueryFnFactory<T> = (vars: SeasonalQueryVars) => () => Promise<T[]>;
type SelectFn<T> = (queryClient: QueryClient, queryKey: QueryKey) => (data: T[]) => SeasonalChartData[];

type ConvertResultFn<R> = (d: R, timestamp: Date) => SeasonalChartData;

export const historicalSelectFactory =
  <R>(timestampName: string, convertEntry: ConvertResultFn<R>) =>
  (_queryClient: QueryClient, _queryKey: QueryKey) =>
  (data: R[]) => {
    return data
      .map((v, idx) => {
        // Data is presented at the time of season completion.
        // The final season is part of this result, but extraneous and reselected as the current season.
        let seasonEnd: Date;
        if (idx < data.length - 1) {
          seasonEnd = new Date(Number(data[idx][timestampName]) * 1000);
          return convertEntry(v, seasonEnd);
        }
      })
      .filter((v) => v !== undefined);
  };

export const currentSelectFactory =
  <R>(convertEntry: ConvertResultFn<R>) =>
  (queryClient: QueryClient, queryKey: QueryKey) =>
  (data: R[]) => {
    return data.map((v) => {
      const queryInfo = queryClient.getQueryCache().find({ queryKey });
      const lastFetchedTimestamp = queryInfo?.state?.dataUpdatedAt;
      return convertEntry(v, lastFetchedTimestamp ? new Date(lastFetchedTimestamp) : new Date());
    });
  };

export default function useSeasonalQueries<T>(keyName: string, queryConfig: SeasonalQueryConfig<T>): UseSeasonalResult {
  const queryClient = useQueryClient();
  // const currentSeason = useSunData().current; // TODO(ss): put this back eventually
  const currentSeason = 25942;
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
    select: queryConfig.historicalSelect(queryClient, historicalQueryKey),
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
    select: queryConfig.currentSelect(queryClient, currentQueryKey),
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
