import { subgraphs } from "@/constants/subgraph";
import { useChainId } from "wagmi";
import { BeanHourlySnapshot, BeanSeasonalBeanDocument, BeanSeasonalBeanQuery } from "@/generated/gql/graphql";
import { paginateSubgraph, PaginationSettings } from "@/utils/paginateSubgraph";
import { UseSeasonalResult } from "@/utils/types";
import useSeasonalQueries, { SeasonalQueryVars } from "./useSeasonalQueries";

export default function useSeasonalPrice(fromSeason: number, toSeason: number): UseSeasonalResult {
  const chainId = useChainId();

  const paginateSettings: PaginationSettings<
    BeanHourlySnapshot,
    BeanSeasonalBeanQuery,
    "beanHourlySnapshots",
    SeasonalQueryVars
  > = {
    primaryPropertyName: "beanHourlySnapshots",
    idField: "id",
    nextVars: (value1000: Partial<Pick<BeanHourlySnapshot, keyof BeanHourlySnapshot>>, prevVars: SeasonalQueryVars) => {
      if (value1000) {
        return {
          from: Number(value1000.season),
          to: prevVars.to,
        };
      }
    },
  };

  const queryFnFactory = (vars: SeasonalQueryVars) => async () => {
    return await paginateSubgraph(paginateSettings, subgraphs[chainId].bean, BeanSeasonalBeanDocument, vars);
  };

  const convertResult = (v: BeanHourlySnapshot, timestamp: Date) => ({
    season: Number(v.season),
    value: Number(v.price),
    timestamp,
  });

  return useSeasonalQueries("BeanSeasonalBeanQuery", {
    fromSeason,
    toSeason,
    queryVars: {},
    timestampColName: "timestamp",
    historicalQueryFnFactory: queryFnFactory,
    currentQueryFnFactory: queryFnFactory,
    convertResult,
  });
}
