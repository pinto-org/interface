import { subgraphs } from "@/constants/subgraph";
import { beanstalkAddress } from "@/generated/contractHooks";
import {
  CacheSeasonalSiloActiveFarmersDocument,
  CacheSeasonalSiloDocument,
  CacheSeasonalSiloQuery,
  SiloHourlySnapshot,
} from "@/generated/gql/cache/graphql";
import { buildCacheWhereClause, fetchCacheQuery } from "@/utils/paginateSubgraph";
import { UseSeasonalResult } from "@/utils/types";
import { useChainId } from "wagmi";
import useSeasonalQueries, { ConvertEntryFn, SeasonalQueryVars } from "./useSeasonalInternalQueries";

export default function useSeasonalBeanstalkSiloSG(
  fromSeason: number,
  toSeason: number,
  convertResult: ConvertEntryFn<SiloHourlySnapshot>,
): UseSeasonalResult {
  const chainId = useChainId();
  const siloId = beanstalkAddress[chainId].toLowerCase();

  const queryFnFactory = (vars: SeasonalQueryVars) => async () => {
    const results = await fetchCacheQuery<CacheSeasonalSiloQuery, SiloHourlySnapshot>(
      subgraphs[chainId].cache,
      CacheSeasonalSiloDocument,
      {
        where: buildCacheWhereClause(vars.from, vars.to),
        orderBy: "season",
        orderDirection: "asc",
      },
      "cache_siloHourlySnapshots",
    );
    // Filter by silo address client-side (cache doesn't support id_contains)
    return results.filter((r) => r.id.toLowerCase().includes(siloId));
  };

  return useSeasonalQueries("BeanstalkSeasonalSiloQuery", {
    fromSeason,
    toSeason,
    queryVars: { silo: siloId },
    historicalQueryFnFactory: queryFnFactory,
    currentQueryFnFactory: queryFnFactory,
    resultTimestamp: (entry) => {
      return new Date(Number(entry.createdAt) * 1000);
    },
    convertResult,
  });
}

export function useSeasonalBeanstalkSiloActiveFarmersSG(
  fromSeason: number,
  toSeason: number,
  convertResult: ConvertEntryFn<SiloHourlySnapshot>,
): UseSeasonalResult {
  const chainId = useChainId();
  const siloId = beanstalkAddress[chainId].toLowerCase();

  const queryFnFactory = (vars: SeasonalQueryVars) => async () => {
    const results = await fetchCacheQuery<CacheSeasonalSiloQuery, SiloHourlySnapshot>(
      subgraphs[chainId].cache,
      CacheSeasonalSiloActiveFarmersDocument,
      {
        where: buildCacheWhereClause(vars.from, vars.to),
        orderBy: "season",
        orderDirection: "asc",
      },
      "cache_siloHourlySnapshots",
    );
    // Filter by silo address client-side (cache doesn't support id_contains)
    return results.filter((r) => r.id.toLowerCase().includes(siloId));
  };

  return useSeasonalQueries("BeanstalkSeasonalSiloActiveFarmersQuery", {
    fromSeason,
    toSeason,
    queryVars: { silo: siloId },
    historicalQueryFnFactory: queryFnFactory,
    currentQueryFnFactory: queryFnFactory,
    resultTimestamp: (entry) => {
      return new Date(Number(entry.createdAt) * 1000);
    },
    convertResult,
  });
}
