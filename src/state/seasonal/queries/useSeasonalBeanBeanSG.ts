import { subgraphs } from "@/constants/subgraph";
import { useChainId } from "wagmi";
import { BeanHourlySnapshot, BeanSeasonalBeanDocument, BeanSeasonalBeanQuery } from "@/generated/gql/graphql";
import { paginateSubgraph, PaginationSettings } from "@/utils/paginateSubgraph";
import { UseSeasonalResult } from "@/utils/types";
import useSeasonalQueries, { ConvertEntryFn, SeasonalQueryVars } from "./useSeasonalInternalQueries";

const paginateSettings: PaginationSettings<
  BeanHourlySnapshot,
  BeanSeasonalBeanQuery,
  "beanHourlySnapshots",
  SeasonalQueryVars
> = {
  primaryPropertyName: "beanHourlySnapshots",
  idField: "id",
  nextVars: (value1000: BeanHourlySnapshot, prevVars: SeasonalQueryVars) => {
    if (value1000) {
      return {
        ...prevVars,
        from: Number(value1000.season.season),
      };
    }
  },
};

export default function useSeasonalBeanBeanSG(
  fromSeason: number,
  toSeason: number,
  convertResult: ConvertEntryFn<BeanHourlySnapshot>,
): UseSeasonalResult {
  const chainId = useChainId();
  const queryFnFactory = (vars: SeasonalQueryVars) => async () => {
    return await paginateSubgraph(paginateSettings, subgraphs[chainId].bean, BeanSeasonalBeanDocument, vars);
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
  });
}
