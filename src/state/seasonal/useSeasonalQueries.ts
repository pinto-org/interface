import { UseSeasonalResult } from "@/utils/types";
import { QueryClient, QueryKey, useQuery, useQueryClient } from "@tanstack/react-query";
import { useChainId } from "wagmi";

export type SeasonalExtraVars = {
  [key: string]: any;
}

export type SeasonalQueryVars = {
  from: number;
  to: number;
} & SeasonalExtraVars;

export type SeasonalQueryConfig = {
  fromSeason: number;
  toSeason: number;
  queryVars: SeasonalExtraVars;
  historicalQueryFnFactory: QueryFnFactory;
  historicalSelect: SelectFn;
  currentQueryFnFactory: QueryFnFactory;
  currentSelect: SelectFn;
}

type QueryFnFactory = (vars: SeasonalQueryVars) => () => Promise<any>;
type SelectFn = (queryClient: QueryClient, queryKey: QueryKey) => (data: any) => any;

export default function useSeasonalQueries(keyName: string, queryConfig: SeasonalQueryConfig): UseSeasonalResult {
  const queryClient = useQueryClient();
  // const currentSeason = useSunData().current; // TODO(ss): put this back eventually
  const currentSeason = 25942;
  const chainId = useChainId();

  const historicalVars = {
    from: queryConfig.fromSeason,
    to: queryConfig.toSeason - 1,
    ...queryConfig.queryVars
  };

  const currentVars = {
    from: queryConfig.toSeason,
    to: queryConfig.toSeason,
    ...queryConfig.queryVars
  };

  const historicalQueryKey = [`historical_${keyName}`, { chainId: chainId, season: currentSeason, variables: historicalVars }];
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
