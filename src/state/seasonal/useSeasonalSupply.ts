import { subgraphs } from "@/constants/subgraph";
import { useChainId } from "wagmi";
import { paginateSubgraph, PaginationSettings } from "@/utils/paginateSubgraph";
import { UseSeasonalResult } from "@/utils/types";
import { BeanstalkSeasonalSupplyDocument, BeanstalkSeasonalSupplyQuery, Season } from "@/generated/gql/graphql";
import useSeasonalQueries, { SeasonalQueryVars } from "./useSeasonalQueries";
import { TV } from "@/classes/TokenValue";
import { beanstalkAddress } from "@/generated/contractHooks";
import { PINTO } from "@/constants/tokens";

export default function useSeasonalSupply(fromSeason: number, toSeason: number): UseSeasonalResult {
  const chainId = useChainId();

  const paginateSettings: PaginationSettings<Season, BeanstalkSeasonalSupplyQuery, "seasons", SeasonalQueryVars> = {
    primaryPropertyName: "seasons",
    idField: "id",
    nextVars: (value1000: Partial<Pick<Season, keyof Season>>, prevVars: SeasonalQueryVars) => {
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
      BeanstalkSeasonalSupplyDocument,
      vars,
    );
  };

  const convertResult = (v: Season, timestamp: Date) => ({
    season: Number(v.season),
    value: TV.fromBlockchain(v.beans, PINTO.decimals).toNumber(),
    timestamp,
  });

  return useSeasonalQueries("seasonalSupply", {
    fromSeason,
    toSeason,
    queryVars: {},
    timestampColName: "createdAt",
    historicalQueryFnFactory: queryFnFactory,
    currentQueryFnFactory: queryFnFactory,
    convertResult,
  });
}
