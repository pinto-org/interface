import { subgraphs } from "@/constants/subgraph";
import { useChainId } from "wagmi";
import { SiloHourlySnapshot, BeanstalkSeasonalSiloDocument, BeanstalkSeasonalSiloQuery } from "@/generated/gql/graphql";
import { paginateSubgraph, PaginationSettings } from "@/utils/paginateSubgraph";
import { UseSeasonalResult } from "@/utils/types";
import useSeasonalQueries, { ConvertEntryFn, SeasonalQueryVars } from "./useSeasonalInternalQueries";
import { beanstalkAddress } from "@/generated/contractHooks";

const paginateSettings: PaginationSettings<
  SiloHourlySnapshot,
  BeanstalkSeasonalSiloQuery,
  "siloHourlySnapshots",
  SeasonalQueryVars
> = {
  primaryPropertyName: "siloHourlySnapshots",
  idField: "id",
  nextVars: (value1000: SiloHourlySnapshot, prevVars: SeasonalQueryVars) => {
    if (value1000) {
      return {
        from: Number(value1000.season),
        to: prevVars.to,
      };
    }
  },
};

export default function useSeasonalBeanstalkSiloSG(
  fromSeason: number,
  toSeason: number,
  convertResult: ConvertEntryFn<SiloHourlySnapshot>,
): UseSeasonalResult {
  const chainId = useChainId();
  const queryFnFactory = (vars: SeasonalQueryVars) => async () => {
    return await paginateSubgraph(paginateSettings, subgraphs[chainId].beanstalk, BeanstalkSeasonalSiloDocument, vars);
  };

  return useSeasonalQueries("BeanstalkSeasonalSiloQuery", {
    fromSeason,
    toSeason,
    queryVars: { silo: beanstalkAddress[chainId] },
    historicalQueryFnFactory: queryFnFactory,
    currentQueryFnFactory: queryFnFactory,
    resultTimestamp: (entry) => {
      return new Date(Number(entry.createdAt) * 1000);
    },
    convertResult,
  });
}
