import { QueryClient, QueryKey } from "@tanstack/react-query";
import { subgraphs } from "@/constants/subgraph";
import { useChainId } from "wagmi";
import { paginateSubgraph, PaginationSettings } from "@/utils/paginateSubgraph";
import { UseSeasonalResult } from "@/utils/types";
import { BeanstalkSeasonalStalkDocument, BeanstalkSeasonalStalkQuery, SiloHourlySnapshot } from "@/generated/gql/graphql";
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
    nextVars: (
      value1000: Partial<Pick<SiloHourlySnapshot, keyof SiloHourlySnapshot>>,
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
    return await paginateSubgraph(paginateSettings, subgraphs[chainId].beanstalk, BeanstalkSeasonalStalkDocument, vars);
  };

  const entryData = (v: SiloHourlySnapshot, timestamp: Date) => ({
    season: Number(v.season),
    value: TV.fromBlockchain(v.stalk, STALK.decimals),
    timestamp
  })

  const historicalSelect = (_queryClient: QueryClient, _queryKey: QueryKey) => (data: SiloHourlySnapshot[]) => {
    return data.map((v) => {
      // For previous seasons, the presented data is upon the season's completion,
      // add 1 hour to created timestamp.
      const snapshotCreatedHour = new Date(Number(v.createdAt) * 1000);
      const snapshotEndHour = new Date(snapshotCreatedHour.getTime() + 60 * 60 * 1000);
      return entryData(v, snapshotEndHour);
    });
  };

  const currentSelect = (queryClient: QueryClient, queryKey: QueryKey) => (data: SiloHourlySnapshot[]) => {
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
      // TODO(ss): put this back
      queryVars: { silo: "0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70" ?? beanstalkAddress[chainId] },
      historicalQueryFnFactory: queryFnFactory,
      historicalSelect,
      currentQueryFnFactory: queryFnFactory,
      currentSelect
    }
  );
}
