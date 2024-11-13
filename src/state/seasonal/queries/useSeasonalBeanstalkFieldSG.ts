import { subgraphs } from "@/constants/subgraph";
import { useChainId } from "wagmi";
import {
  FieldHourlySnapshot,
  BeanstalkSeasonalFieldDocument,
  BeanstalkSeasonalFieldQuery,
} from "@/generated/gql/graphql";
import { paginateSubgraph, PaginationSettings } from "@/utils/paginateSubgraph";
import { UseSeasonalResult } from "@/utils/types";
import useSeasonalQueries, { ConvertEntryFn, SeasonalQueryVars } from "./useSeasonalInternalQueries";
import { beanstalkAddress } from "@/generated/contractHooks";

export default function useSeasonalBeanstalkFieldSG(
  fromSeason: number,
  toSeason: number,
  convertResult: ConvertEntryFn<FieldHourlySnapshot>,
): UseSeasonalResult {
  const chainId = useChainId();

  const paginateSettings: PaginationSettings<
    FieldHourlySnapshot,
    BeanstalkSeasonalFieldQuery,
    "fieldHourlySnapshots",
    SeasonalQueryVars
  > = {
    primaryPropertyName: "fieldHourlySnapshots",
    idField: "id",
    nextVars: (value1000: FieldHourlySnapshot, prevVars: SeasonalQueryVars) => {
      if (value1000) {
        return {
          from: Number(value1000.season),
          to: prevVars.to,
        };
      }
    },
  };

  const queryFnFactory = (vars: SeasonalQueryVars) => async () => {
    return await paginateSubgraph(paginateSettings, subgraphs[chainId].beanstalk, BeanstalkSeasonalFieldDocument, vars);
  };

  return useSeasonalQueries("BeanstalkSeasonalFieldQuery", {
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
