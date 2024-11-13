import { subgraphs } from "@/constants/subgraph";
import { useChainId } from "wagmi";
import { paginateSubgraph, PaginationSettings } from "@/utils/paginateSubgraph";
import { UseSeasonalResult } from "@/utils/types";
import { BeanstalkSeasonalSeasonDocument, BeanstalkSeasonalSeasonQuery, Season } from "@/generated/gql/graphql";
import useSeasonalQueries, { SeasonalQueryVars } from "./useSeasonalQueries";

export default function useSeasonalMcap(fromSeason: number, toSeason: number): UseSeasonalResult {
  const chainId = useChainId();

  const paginateSettings: PaginationSettings<Season, BeanstalkSeasonalSeasonQuery, "seasons", SeasonalQueryVars> = {
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
    return await paginateSubgraph(
      paginateSettings,
      subgraphs[chainId].beanstalk,
      BeanstalkSeasonalSeasonDocument,
      vars,
    );
  };

  const convertResult = (v: Season, timestamp: Date) => ({
    season: Number(v.season),
    value: Number(v.marketCap),
    timestamp,
  });

  return useSeasonalQueries("BeanstalkSeasonalSeasonQuery", {
    fromSeason,
    toSeason,
    queryVars: {},
    timestampColName: "createdAt",
    historicalQueryFnFactory: queryFnFactory,
    currentQueryFnFactory: queryFnFactory,
    convertResult,
  });
}
