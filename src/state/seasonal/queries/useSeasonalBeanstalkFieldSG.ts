import { subgraphs } from "@/constants/subgraph";
import { beanstalkAddress } from "@/generated/contractHooks";
import {
  CacheSeasonalFieldDocument,
  CacheSeasonalFieldQuery,
  FieldHourlySnapshot,
} from "@/generated/gql/cache/graphql";
import { buildCacheWhereClause, fetchCacheQuery } from "@/utils/paginateSubgraph";
import { UseSeasonalResult } from "@/utils/types";
import { useChainId } from "wagmi";
import useSeasonalQueries, { ConvertEntryFn, SeasonalQueryVars } from "./useSeasonalInternalQueries";

export default function useSeasonalBeanstalkFieldSG(
  fromSeason: number,
  toSeason: number,
  convertResult: ConvertEntryFn<FieldHourlySnapshot>,
): UseSeasonalResult {
  const chainId = useChainId();
  const fieldAddress = beanstalkAddress[chainId].toLowerCase();

  const queryFnFactory = (vars: SeasonalQueryVars) => async () => {
    const results = await fetchCacheQuery<CacheSeasonalFieldQuery, FieldHourlySnapshot>(
      subgraphs[chainId].cache,
      CacheSeasonalFieldDocument,
      {
        where: buildCacheWhereClause(vars.from, vars.to),
        orderBy: "season",
        orderDirection: "asc",
      },
      "cache_fieldHourlySnapshots",
    );
    // Filter by field address client-side (cache doesn't support id_contains)
    return results.filter((r) => r.id.toLowerCase().includes(fieldAddress));
  };

  return useSeasonalQueries("BeanstalkSeasonalFieldQuery", {
    fromSeason,
    toSeason,
    queryVars: { field: fieldAddress },
    historicalQueryFnFactory: queryFnFactory,
    currentQueryFnFactory: queryFnFactory,
    resultTimestamp: (entry) => {
      return new Date(Number(entry.createdAt) * 1000);
    },
    convertResult,
  });
}
