import { subgraphs } from "@/constants/subgraph";
import { beanstalkAddress } from "@/generated/contractHooks";
import {
  BeanstalkSeasonalFieldDocument,
  BeanstalkSeasonalFieldQuery,
  FieldHourlySnapshot,
} from "@/generated/gql/pintostalk/graphql";
import { PaginationSettings, paginateSubgraph } from "@/utils/paginateSubgraph";
import { UseSeasonalResult } from "@/utils/types";
import { useChainId } from "wagmi";
import useSeasonalQueries, { ConvertEntryFn, SeasonalQueryVars } from "./useSeasonalInternalQueries";

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
        ...prevVars,
        from: Number(value1000.season),
      };
    }
  },
};

export default function useSeasonalBeanstalkFieldSG(
  fromSeason: number,
  toSeason: number,
  convertResult: ConvertEntryFn<FieldHourlySnapshot>,
): UseSeasonalResult {
  const chainId = useChainId();
  const queryFnFactory = (vars: SeasonalQueryVars) => async () => {
    return await paginateSubgraph(paginateSettings, subgraphs[chainId].beanstalk, BeanstalkSeasonalFieldDocument, vars);
  };

  return useSeasonalQueries("BeanstalkSeasonalFieldQuery", {
    fromSeason,
    toSeason,
    queryVars: { field: beanstalkAddress[chainId] },
    historicalQueryFnFactory: queryFnFactory,
    currentQueryFnFactory: queryFnFactory,
    resultTimestamp: (entry) => {
      return new Date(Number(entry.createdAt) * 1000);
    },
    convertResult,
  });
}
