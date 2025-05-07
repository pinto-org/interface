import { subgraphs } from "@/constants/subgraph";
import { BeanSeasonalSeasonPoolsDocument, BeanSeasonalSeasonPoolsQuery, Season } from "@/generated/gql/pinto/graphql";
import { PaginationSettings, paginateSubgraph } from "@/utils/paginateSubgraph";
import { UseSeasonalResult } from "@/utils/types";
import { useChainId } from "wagmi";
import useSeasonalQueries, { ConvertEntryFn, SeasonalQueryVars } from "./useSeasonalInternalQueries";

const paginateSettings: PaginationSettings<Season, BeanSeasonalSeasonPoolsQuery, "seasons", SeasonalQueryVars> = {
  primaryPropertyName: "seasons",
  idField: "id",
  nextVars: (value1000: Season, prevVars: SeasonalQueryVars) => {
    if (value1000) {
      return {
        ...prevVars,
        from: Number(value1000.season),
      };
    }
  },
};

export default function useSeasonalBeanSeasonSG(
  fromSeason: number,
  toSeason: number,
  convertResult: ConvertEntryFn<Season>,
): UseSeasonalResult {
  const chainId = useChainId();
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
      return new Date(Number(entry.poolHourlySnapshots[0].createdTimestamp) * 1000);
    },
    convertResult,
  });
}
