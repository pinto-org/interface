import { SeasonalChartData } from "@/components/charts/SeasonalChart";
import { useSunData } from "@/state/useSunData";
import { UseMultiSeasonalResult, UseSeasonalResult } from "@/utils/types";
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
  orderBy?: "asc" | "desc";
};

export type QueryFnFactory<T> = (vars: SeasonalQueryVars) => () => Promise<T[]>;
export type ResultTimestampFn<T> = (d: T) => Date;
export type ConvertEntryFn<T> = (d: T, timestamp: Date) => SeasonalChartData;

export default function useSeasonalQueries<T>(
  keyName: string,
  queryConfig: SeasonalQueryConfig<T>,
  sparseData: boolean = false,
  disabled: boolean = false,
): UseSeasonalResult {
  const queryClient = useQueryClient();
  const currentSeason = useSunData().current;
  const chainId = useChainId();
  const orderBy = queryConfig?.orderBy || "asc";

  // Current season should be discarded from historical in the select step
  const historicalVars = {
    from: queryConfig.fromSeason,
    to: queryConfig.toSeason,
    ...queryConfig.queryVars,
  };

  const currentVars =
    orderBy === "asc"
      ? {
          from: queryConfig.toSeason,
          to: queryConfig.toSeason,
          ...queryConfig.queryVars,
        }
      : {
          from: Math.max(1, queryConfig.fromSeason),
          to: Math.max(1, queryConfig.fromSeason),
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
          // With sparse data, the final result may need to be included.
          if (sparseData && idx === data.length - 1) {
            seasonEnd = queryConfig.resultTimestamp(data[idx]);
            seasonEnd.setHours(seasonEnd.getHours() + 1);
            return queryConfig.convertResult(v, seasonEnd);
          }
        })
        .filter((v) => v !== undefined);
    },
    enabled: !!historicalVars.to && !disabled,
    staleTime: Infinity,
    gcTime: 20 * 60 * 1000,
    retry: 1,
    retryDelay: 2000,
    meta: {
      persist: true,
    },
  });

  let historicalData: SeasonalChartData[] | undefined = historical.data;
  // Iterate through the historical data and fill in missing seasons with the data of preceding populated season.
  if (sparseData) {
    // Populate missing data in between and following the sparse data.
    let lastValue: SeasonalChartData;
    historicalData = historical.data?.flatMap((v, i) => {
      let returnData: SeasonalChartData[] = [];
      const gapSize = i === 0 ? 0 : v.season - lastValue.season;
      // If there is a preceding gap in the data, fill it with the data of the preceding populated season.
      if (gapSize > 1) {
        returnData = Array.from({ length: gapSize - 1 }, (_, i) => ({
          ...lastValue,
          season: lastValue.season + i + 1,
          timestamp: new Date(v.timestamp.getTime() + 3600 * 1000 * i),
        }));
      }
      returnData = [...returnData, v];
      // If this is the last item, and the season is not the final season, fill in the missing seasons with the data of the last populated season.
      if (i === historical.data?.length - 1 && v.season < queryConfig.toSeason) {
        const missingSize = queryConfig.toSeason - v.season;
        const missingData: SeasonalChartData[] = Array.from({ length: missingSize }, (_, i) => ({
          ...v,
          season: v.season + i + 1,
          timestamp: new Date(v.timestamp.getTime() + 3600 * 1000 * i),
        }));
        returnData = [...returnData, ...missingData];
      }
      lastValue = v;
      return returnData;
    });
  }

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
    enabled: !!currentVars.to && !disabled,
    // Requery result up to once per minute
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

export function useMultiSeasonalQueries<T>(
  keyName: string,
  queryConfig: SeasonalQueryConfig<T>,
  sparseData: boolean = false,
): UseMultiSeasonalResult {
  const queryClient = useQueryClient();
  const currentSeason = useSunData().current;
  const chainId = useChainId();
  const orderBy = queryConfig?.orderBy || "asc";

  // Current season should be discarded from historical in the select step
  const historicalVars = {
    from: queryConfig.fromSeason,
    to: queryConfig.toSeason,
    ...queryConfig.queryVars,
  };

  const currentVars =
    orderBy === "asc"
      ? {
          from: queryConfig.toSeason,
          to: queryConfig.toSeason,
          ...queryConfig.queryVars,
        }
      : {
          from: Math.max(1, queryConfig.fromSeason),
          to: Math.max(1, queryConfig.fromSeason),
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
      return Object.entries(data).reduce(
        (acc, [key, queryResult]: [string, any]) => {
          acc[key] = queryResult
            .map((v, idx) => {
              // Data is presented at the time of season completion.
              // The final season is part of this result, but extraneous and reselected as the current season.
              let seasonEnd: Date;
              if (idx < queryResult.length - 1) {
                seasonEnd = queryConfig.resultTimestamp(queryResult[idx + 1]);
                return queryConfig.convertResult(v, seasonEnd);
              }
              // With sparse data, the final result may need to be included.
              if (sparseData && idx === queryResult.length - 1) {
                seasonEnd = queryConfig.resultTimestamp(queryResult[idx]);
                seasonEnd.setHours(seasonEnd.getHours() + 1);
                return queryConfig.convertResult(v, seasonEnd);
              }
            })
            .filter((v) => v !== undefined);
          return acc;
        },
        {} as { [key: string]: SeasonalChartData[] },
      );
    },
    enabled: !!historicalVars.to,
    staleTime: Infinity,
    retry: 1,
    retryDelay: 2000,
    meta: {
      persist: true,
    },
  });

  const historicalData: { [key: string]: SeasonalChartData[] } | undefined = historical.data;
  // Iterate through the historical data and fill in missing seasons with the data of preceding populated season.
  // if (sparseData) {
  //   // Populate missing data in between and following the sparse data.
  //   let lastValue: SeasonalChartData;
  //   historicalData = historical.data?.flatMap((v, i) => {
  //     let returnData: SeasonalChartData[] = [];
  //     const gapSize = i === 0 ? 0 : v.season - lastValue.season;
  //     // If there is a preceding gap in the data, fill it with the data of the preceding populated season.
  //     if (gapSize > 1) {
  //       returnData = Array.from({ length: gapSize - 1 }, (_, i) => ({ ...lastValue, season: lastValue.season + i + 1, timestamp: new Date(v.timestamp.getTime() + 3600 * 1000 * i) }));
  //     }
  //     returnData = [...returnData, v];
  //     // If this is the last item, and the season is not the final season, fill in the missing seasons with the data of the last populated season.
  //     if (i === historical.data?.length - 1 && v.season < queryConfig.toSeason) {
  //       const missingSize = queryConfig.toSeason - v.season;
  //       const missingData: SeasonalChartData[] = Array.from({ length: missingSize }, (_, i) => ({ ...v, season: v.season + i + 1, timestamp: new Date(v.timestamp.getTime() + 3600 * 1000 * i) }));
  //       returnData = [...returnData, ...missingData];
  //     }
  //     lastValue = v;
  //     return returnData
  //   });
  // }

  // Current season's result is reported with the current timestamp.
  // It can change and thus requires a separate query
  const currentQueryKey = [`current_${keyName}`, { chainId, season: currentSeason, variables: currentVars }];
  const current = useQuery({
    queryKey: currentQueryKey,
    queryFn: queryConfig.currentQueryFnFactory(currentVars),
    select: (data: T[]) => {
      return Object.entries(data).reduce(
        (acc, [key, queryResult]: [string, any]) => {
          acc[key] = queryResult.map((v) => {
            const queryInfo = queryClient.getQueryCache().find({ queryKey: currentQueryKey });
            const lastFetchedTimestamp = queryInfo?.state?.dataUpdatedAt;
            return queryConfig.convertResult(v, lastFetchedTimestamp ? new Date(lastFetchedTimestamp) : new Date());
          });
          return acc;
        },
        {} as { [key: string]: SeasonalChartData[] },
      );
    },
    enabled: !!currentVars.to,
    // Requery result up to once per minute
    gcTime: 60 * 1000,
    retry: 1,
    retryDelay: 2000,
  });

  const combinedData =
    historicalData && current.data
      ? Object.entries(historicalData).reduce(
          (acc, [key, queryResult]: [string, any]) => {
            acc[key] = [...queryResult, ...current.data[key]];
            return acc;
          },
          {} as { [key: string]: SeasonalChartData[] },
        )
      : undefined;
  return {
    data: combinedData,
    isLoading: historical.isLoading || current.isLoading,
    isError: historical.isError || current.isError,
  };
}
