import { subgraphs } from "@/constants/subgraph";
import { beanstalkAddress } from "@/generated/contractHooks";
import {
  BeanstalkSeasonalSiloActiveFarmersDocument,
  BeanstalkSeasonalSiloDocument,
  BeanstalkSeasonalSiloQuery,
  SiloHourlySnapshot,
} from "@/generated/gql/graphql";
import { PaginationSettings, paginateSubgraph } from "@/utils/paginateSubgraph";
import { UseSeasonalResult } from "@/utils/types";
import { useChainId } from "wagmi";
import useSeasonalQueries, { ConvertEntryFn, SeasonalQueryVars } from "./useSeasonalInternalQueries";

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
        ...prevVars,
        from: Number(value1000.season),
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

export function useSeasonalBeanstalkSiloActiveFarmersSG(
  fromSeason: number,
  toSeason: number,
  convertResult: ConvertEntryFn<SiloHourlySnapshot>,
): UseSeasonalResult {
  const chainId = useChainId();
  const queryFnFactory = (vars: SeasonalQueryVars) => async () => {
    return await paginateSubgraph(
      paginateSettings,
      subgraphs[chainId].beanstalk,
      BeanstalkSeasonalSiloActiveFarmersDocument,
      vars,
    );
  };

  return useSeasonalQueries("BeanstalkSeasonalSiloActiveFarmersQuery", {
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
