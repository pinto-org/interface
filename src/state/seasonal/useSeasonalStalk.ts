import { subgraphs } from "@/constants/subgraph";
import { useChainId } from "wagmi";
import { paginateSubgraph, PaginationSettings } from "@/utils/paginateSubgraph";
import { UseSeasonalResult } from "@/utils/types";
import { BeanstalkSeasonalSiloDocument, BeanstalkSeasonalSiloQuery, SiloHourlySnapshot } from "@/generated/gql/graphql";
import useSeasonalQueries, { SeasonalQueryVars } from "./useSeasonalQueries";
import { STALK } from "@/constants/internalTokens";
import { TV } from "@/classes/TokenValue";
import { beanstalkAddress } from "@/generated/contractHooks";

export default function useSeasonalStalk(fromSeason: number, toSeason: number): UseSeasonalResult {
  const chainId = useChainId();

  const paginateSettings: PaginationSettings<
    SiloHourlySnapshot,
    BeanstalkSeasonalSiloQuery,
    "siloHourlySnapshots",
    SeasonalQueryVars
  > = {
    primaryPropertyName: "siloHourlySnapshots",
    idField: "id",
    nextVars: (value1000: Partial<Pick<SiloHourlySnapshot, keyof SiloHourlySnapshot>>, prevVars: SeasonalQueryVars) => {
      if (value1000) {
        return {
          from: Number(value1000.season),
          to: prevVars.to,
        };
      }
    },
  };

  const queryFnFactory = (vars: SeasonalQueryVars) => async () => {
    return await paginateSubgraph(paginateSettings, subgraphs[chainId].beanstalk, BeanstalkSeasonalSiloDocument, vars);
  };

  const convertResult = (v: SiloHourlySnapshot, timestamp: Date) => ({
    season: Number(v.season),
    value: TV.fromBlockchain(v.stalk, STALK.decimals).toNumber(),
    timestamp,
  });

  return useSeasonalQueries("BeanstalkSeasonalSiloQuery", {
    fromSeason,
    toSeason,
    queryVars: { silo: beanstalkAddress[chainId] },
    timestampColName: "createdAt",
    historicalQueryFnFactory: queryFnFactory,
    currentQueryFnFactory: queryFnFactory,
    convertResult,
  });
}
