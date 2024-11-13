import { QueryClient, QueryKey } from "@tanstack/react-query";
import { subgraphs } from "@/constants/subgraph";
import { useChainId } from "wagmi";
import { paginateSubgraph, PaginationSettings } from "@/utils/paginateSubgraph";
import { UseSeasonalResult } from "@/utils/types";
import {
  BeanstalkSeasonalStalkDocument,
  BeanstalkSeasonalStalkQuery,
  SiloHourlySnapshot,
} from "@/generated/gql/graphql";
import useSeasonalQueries, { SeasonalQueryVars } from "./useSeasonalQueries";
import { STALK } from "@/constants/internalTokens";
import { TV } from "@/classes/TokenValue";
import { beanstalkAddress } from "@/generated/contractHooks";

export default function useSeasonalStalk(fromSeason: number, toSeason: number): UseSeasonalResult {
  const chainId = useChainId();

  const paginateSettings: PaginationSettings<
    SiloHourlySnapshot,
    BeanstalkSeasonalStalkQuery,
    "siloHourlySnapshots",
    SeasonalQueryVars
  > = {
    primaryPropertyName: "siloHourlySnapshots",
    idField: "id",
    nextVars: (value1000: Partial<Pick<SiloHourlySnapshot, keyof SiloHourlySnapshot>>, prevVars: SeasonalQueryVars) => {
      if (value1000) {
        return {
          from: Number(value1000.season),
          to: prevVars.to,
        };
      }
    },
  };

  const queryFnFactory = (vars: SeasonalQueryVars) => async () => {
    return await paginateSubgraph(paginateSettings, subgraphs[chainId].beanstalk, BeanstalkSeasonalStalkDocument, vars);
  };

  const entryData = (v: SiloHourlySnapshot, timestamp: Date) => ({
    season: Number(v.season),
    value: TV.fromBlockchain(v.stalk, STALK.decimals).toNumber(),
    timestamp,
  });

  const historicalSelect = (_queryClient: QueryClient, _queryKey: QueryKey) => (data: SiloHourlySnapshot[]) => {
    return data
      .map((v, idx) => {
        // Data is presented at the time of season completion.
        // The final season is part of this result, but extraneous and reselected as the current season.
        let seasonEnd: Date;
        if (idx < data.length - 1) {
          seasonEnd = new Date(Number(data[idx].createdAt) * 1000);
          return entryData(v, seasonEnd);
        }
      })
      .filter((v) => v !== undefined);
  };

  const currentSelect = (queryClient: QueryClient, queryKey: QueryKey) => (data: SiloHourlySnapshot[]) => {
    return data.map((v) => {
      const queryInfo = queryClient.getQueryCache().find({ queryKey });
      const lastFetchedTimestamp = queryInfo?.state?.dataUpdatedAt;
      return entryData(v, lastFetchedTimestamp ? new Date(lastFetchedTimestamp) : new Date());
    });
  };

  return useSeasonalQueries("seasonalPrice", {
    fromSeason,
    toSeason,
    queryVars: { silo: beanstalkAddress[chainId] },
    historicalQueryFnFactory: queryFnFactory,
    historicalSelect,
    currentQueryFnFactory: queryFnFactory,
    currentSelect,
  });
}
