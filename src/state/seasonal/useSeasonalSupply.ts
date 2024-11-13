import { subgraphs } from "@/constants/subgraph";
import { useChainId } from "wagmi";
import { paginateSubgraph, PaginationSettings } from "@/utils/paginateSubgraph";
import { UseSeasonalResult } from "@/utils/types";
import { BeanstalkSeasonalSeasonDocument, BeanstalkSeasonalSeasonQuery, Season } from "@/generated/gql/graphql";
import useSeasonalQueries, { SeasonalQueryVars } from "./queries/useSeasonalInternalQueries";
import { TV } from "@/classes/TokenValue";
import { PINTO } from "@/constants/tokens";

export default function useSeasonalSupply(fromSeason: number, toSeason: number): UseSeasonalResult {
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

  return useSeasonalQueries("BeanstalkSeasonalSeasonQuery", {
    fromSeason,
    toSeason,
    queryVars: {},
    historicalQueryFnFactory: queryFnFactory,
    currentQueryFnFactory: queryFnFactory,
    resultTimestamp: (entry) => {
      return new Date(Number(entry.createdAt) * 1000);
    },
    convertResult: (v: Season, timestamp: Date) => ({
      season: Number(v.season),
      value: TV.fromBlockchain(v.beans, PINTO.decimals).toNumber(),
      timestamp,
    }),
  });
}
