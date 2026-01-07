import { subgraphs } from "@/constants/subgraph";
import { BeanHourlySnapshot, CacheSeasonalBeanDocument, CacheSeasonalBeanQuery } from "@/generated/gql/cache/graphql";
import { buildCacheWhereClause, fetchCacheQuery } from "@/utils/paginateSubgraph";
import { UseSeasonalResult } from "@/utils/types";
import { useChainId } from "wagmi";
import useSeasonalQueries, { ConvertEntryFn, SeasonalQueryVars } from "./useSeasonalInternalQueries";

export default function useSeasonalBeanBeanSG(
  fromSeason: number,
  toSeason: number,
  convertResult: ConvertEntryFn<BeanHourlySnapshot>,
  { enabled = true } = {},
): UseSeasonalResult {
  const chainId = useChainId();

  const queryFnFactory = (vars: SeasonalQueryVars) => async () => {
    return await fetchCacheQuery<CacheSeasonalBeanQuery, BeanHourlySnapshot>(
      subgraphs[chainId].cache,
      CacheSeasonalBeanDocument,
      {
        // BeanHourlySnapshot uses seasonNumber instead of season
        where: buildCacheWhereClause(vars.from, vars.to, undefined, "seasonNumber"),
        orderBy: "seasonNumber",
        orderDirection: "asc",
      },
      "cache_beanHourlySnapshots",
    );
  };

  return useSeasonalQueries("BeanSeasonalBeanQuery", {
    fromSeason,
    toSeason,
    queryVars: {},
    historicalQueryFnFactory: queryFnFactory,
    currentQueryFnFactory: queryFnFactory,
    resultTimestamp: (entry) => {
      return new Date(Number(entry.createdTimestamp) * 1000);
    },
    convertResult,
    enabled,
  });
}
