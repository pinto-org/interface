import { useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query";
import { subgraphs } from "@/constants/subgraph";
import { useSunData } from "../useSunData";
import { useChainId } from "wagmi";
import { BeanHourlySnapshot, BeanSeasonalPriceDocument, BeanSeasonalPriceQuery } from "@/generated/gql/graphql";
import { paginateSubgraph, PaginationSettings } from "@/utils/paginateSubgraph";
import { UseSeasonalResult } from "@/utils/types";

export default function useSeasonalPrice(fromSeason: number, toSeason: number): UseSeasonalResult {
  const queryClient = useQueryClient();
  // const currentSeason = useSunData().current; // TODO(ss): put this back eventually
  const currentSeason = 25942;
  const chainId = useChainId();

  const paginateSettings: PaginationSettings<
    BeanHourlySnapshot,
    BeanSeasonalPriceQuery,
    "beanHourlySnapshots",
    typeof historicalVars
  > = {
    primaryPropertyName: "beanHourlySnapshots",
    idField: "id",
    nextVars: (
      value1000: Partial<Pick<BeanHourlySnapshot, keyof BeanHourlySnapshot>>,
      prevVars: typeof historicalVars,
    ) => {
      if (value1000) {
        return {
          from: Number(value1000.season),
          to: prevVars.to,
        };
      }
    },
  };

  const historicalVars = {
    from: fromSeason,
    to: toSeason - 1,
  };

  const currentVars = {
    from: toSeason,
    to: toSeason,
  };

  const historical = useQuery({
    queryKey: ["historicalSeasonalPrices", { chainId: chainId, season: currentSeason, variables: historicalVars }],
    queryFn: async () => {
      return await paginateSubgraph(
        subgraphs[chainId].bean,
        BeanSeasonalPriceDocument,
        historicalVars,
        paginateSettings,
      );
    },
    select: (data) => {
      return data.map((r) => {
        // For previous seasons, the presented data is upon the season's completion,
        // add 1 hour to created timestamp.
        const snapshotCreatedDate = new Date(Number(r.timestamp) * 1000);
        const snapshotEndDate = new Date(snapshotCreatedDate.getTime() + 60 * 60 * 1000);
        return {
          season: Number(r.season),
          value: Number(r.price),
          timestamp: snapshotEndDate,
        };
      });
    },
    enabled: !!historicalVars.to,
    staleTime: Infinity,
    retry: 1,
    retryDelay: 2000,
  });

  // Current season's result is reported with the current timestamp.
  // It can change and thus requires a separate query
  const currentQueryKey = ["currentSeasonalPrices", { chainId, season: currentSeason, variables: currentVars }];
  const current = useQuery({
    queryKey: currentQueryKey,
    queryFn: async () => {
      return await paginateSubgraph(subgraphs[chainId].bean, BeanSeasonalPriceDocument, currentVars, paginateSettings);
    },
    select: (data) => {
      return data.map((r) => {
        const queryInfo = queryClient.getQueryCache().find({ queryKey: currentQueryKey });
        const lastFetchedTimestamp = queryInfo?.state?.dataUpdatedAt;
        return {
          season: Number(r.season),
          value: Number(r.price),
          timestamp: lastFetchedTimestamp ? new Date(lastFetchedTimestamp) : new Date(),
        };
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
