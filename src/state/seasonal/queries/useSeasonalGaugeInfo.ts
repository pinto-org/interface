import { subgraphs } from "@/constants/subgraph";
import {
  CacheSeasonalGaugesInfoDocument,
  CacheSeasonalGaugesInfoQuery,
  GaugesInfoHourlySnapshot,
} from "@/generated/gql/cache/graphql";
import { buildCacheWhereClause, fetchCacheQuery } from "@/utils/paginateSubgraph";
import { useChainId } from "wagmi";
import useSeasonalQueries, { ConvertEntryFn, SeasonalQueryVars } from "./useSeasonalInternalQueries";

const NO_VARS = {} as const;

export default function useSeasonalGaugeInfo(
  fromSeason: number,
  toSeason: number,
  convertResult: ConvertEntryFn<GaugesInfoHourlySnapshot>,
) {
  const chainId = useChainId();

  const queryFnFactory = (vars: SeasonalQueryVars) => async () => {
    return await fetchCacheQuery<CacheSeasonalGaugesInfoQuery, GaugesInfoHourlySnapshot>(
      subgraphs[chainId].cache,
      CacheSeasonalGaugesInfoDocument,
      {
        where: buildCacheWhereClause(vars.from, vars.to),
        orderBy: "season",
        orderDirection: "asc",
      },
      "cache_gaugesInfoHourlySnapshots",
    );
  };

  return useSeasonalQueries("BeanstalkSeasonalGaugesInfoQuery", {
    fromSeason,
    toSeason,
    queryVars: NO_VARS,
    historicalQueryFnFactory: queryFnFactory,
    currentQueryFnFactory: queryFnFactory,
    resultTimestamp: (entry) => {
      return new Date(Number(entry.createdAt) * 1000);
    },
    convertResult,
  });
}
