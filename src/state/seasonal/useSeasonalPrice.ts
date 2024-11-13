import { QueryClient, QueryKey, useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query";
import { subgraphs } from "@/constants/subgraph";
import { useSunData } from "../useSunData";
import { useChainId } from "wagmi";
import { BeanHourlySnapshot, BeanSeasonalPriceDocument, BeanSeasonalPriceQuery } from "@/generated/gql/graphql";
import { paginateSubgraph, PaginationSettings } from "@/utils/paginateSubgraph";
import { UseSeasonalResult } from "@/utils/types";
import useSeasonalQueries, { SeasonalQueryVars } from "./useSeasonalQueries";

export default function useSeasonalPrice(fromSeason: number, toSeason: number): UseSeasonalResult {
  const chainId = useChainId();

  const paginateSettings: PaginationSettings<
    BeanHourlySnapshot,
    BeanSeasonalPriceQuery,
    "beanHourlySnapshots",
    SeasonalQueryVars
  > = {
    primaryPropertyName: "beanHourlySnapshots",
    idField: "id",
    nextVars: (
      value1000: Partial<Pick<BeanHourlySnapshot, keyof BeanHourlySnapshot>>,
      prevVars: SeasonalQueryVars,
    ) => {
      if (value1000) {
        return {
          from: Number(value1000.season),
          to: prevVars.to,
        };
      }
    },
  };

  const queryFnFactory = (vars: SeasonalQueryVars) => async () => {
    return await paginateSubgraph(paginateSettings, subgraphs[chainId].bean, BeanSeasonalPriceDocument, vars);
  };

  const entryData = (v: BeanHourlySnapshot, timestamp: Date) => ({
    season: Number(v.season),
    value: Number(v.price),
    timestamp
  })

  const historicalSelect = (_queryClient: QueryClient, _queryKey: QueryKey) => (data: BeanHourlySnapshot[]) => {
    return data.map((v) => {
      // For previous seasons, the presented data is upon the season's completion,
      // add 1 hour to created timestamp.
      const snapshotCreatedDate = new Date(Number(v.timestamp) * 1000);
      const snapshotEndDate = new Date(snapshotCreatedDate.getTime() + 60 * 60 * 1000);
      return entryData(v, snapshotEndDate);
    });
  };

  const currentSelect = (queryClient: QueryClient, queryKey: QueryKey) => (data: BeanHourlySnapshot[]) => {
    return data.map((v) => {
      const queryInfo = queryClient.getQueryCache().find({ queryKey });
      const lastFetchedTimestamp = queryInfo?.state?.dataUpdatedAt;
      return entryData(v, lastFetchedTimestamp ? new Date(lastFetchedTimestamp) : new Date());
    });
  };

  return useSeasonalQueries(
    "seasonalPrice",
    {
      fromSeason,
      toSeason,
      queryVars: {},
      historicalQueryFnFactory: queryFnFactory,
      historicalSelect,
      currentQueryFnFactory: queryFnFactory,
      currentSelect
    }
  );
}
