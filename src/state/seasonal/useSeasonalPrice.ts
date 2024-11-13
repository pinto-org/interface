import { subgraphs } from "@/constants/subgraph";
import { useChainId } from "wagmi";
import { BeanHourlySnapshot, BeanSeasonalPriceDocument, BeanSeasonalPriceQuery } from "@/generated/gql/graphql";
import { paginateSubgraph, PaginationSettings } from "@/utils/paginateSubgraph";
import { UseSeasonalResult } from "@/utils/types";
import useSeasonalQueries, {
  currentSelectFactory,
  historicalSelectFactory,
  SeasonalQueryVars,
} from "./useSeasonalQueries";

export default function useSeasonalPrice(fromSeason: number, toSeason: number): UseSeasonalResult {
  const chainId = useChainId();

  const paginateSettings: PaginationSettings<
    BeanHourlySnapshot,
    BeanSeasonalPriceQuery,
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
    return await paginateSubgraph(paginateSettings, subgraphs[chainId].bean, BeanSeasonalPriceDocument, vars);
  };

  const convertEntry = (v: BeanHourlySnapshot, timestamp: Date) => ({
    season: Number(v.season),
    value: Number(v.price),
    timestamp,
  });

  return useSeasonalQueries("seasonalPrice", {
    fromSeason,
    toSeason,
    queryVars: {},
    historicalQueryFnFactory: queryFnFactory,
    historicalSelect: historicalSelectFactory("timestamp", convertEntry),
    currentQueryFnFactory: queryFnFactory,
    currentSelect: currentSelectFactory(convertEntry),
  });
}
