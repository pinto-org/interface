import { subgraphs } from "@/constants/subgraph";
import { useChainId } from "wagmi";
import {
  BeanHourlySnapshot,
  BeanSeasonalBeanDocument,
  BeanSeasonalBeanQuery,
  BeanSeasonalSeasonPoolsDocument,
  BeanSeasonalSeasonPoolsQuery,
  Season,
} from "@/generated/gql/graphql";
import { paginateSubgraph, PaginationSettings } from "@/utils/paginateSubgraph";
import { UseSeasonalResult } from "@/utils/types";
import useSeasonalQueries, { SeasonalQueryVars } from "./useSeasonalQueries";

export default function useSeasonalTotalLiquidity(fromSeason: number, toSeason: number): UseSeasonalResult {
  const chainId = useChainId();

  const paginateSettings: PaginationSettings<Season, BeanSeasonalSeasonPoolsQuery, "seasons", SeasonalQueryVars> = {
    primaryPropertyName: "seasons",
    idField: "id",
    nextVars: (value1000: Season, prevVars: SeasonalQueryVars) => {
      if (value1000) {
        return {
          from: Number(value1000.season),
          to: prevVars.to,
        };
      }
    },
  };

  const queryFnFactory = (vars: SeasonalQueryVars) => async () => {
    return await paginateSubgraph(paginateSettings, subgraphs[chainId].bean, BeanSeasonalSeasonPoolsDocument, vars);
  };

  return useSeasonalQueries("BeanSeasonalSeasonPoolsQuery", {
    fromSeason,
    toSeason,
    queryVars: {},
    historicalQueryFnFactory: queryFnFactory,
    currentQueryFnFactory: queryFnFactory,
    resultTimestamp: (entry) => {
      return new Date(Number(entry.poolHourlySnapshots[0].createdAt) * 1000);
    },
    convertResult: (v: Season, timestamp: Date) => ({
      season: Number(v.season),
      value: v.poolHourlySnapshots.reduce((acc, next) => {
        return acc + Number(next.liquidityUSD);
      }, 0),
      timestamp,
    }),
  });
}
