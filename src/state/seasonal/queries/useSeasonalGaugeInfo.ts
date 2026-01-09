import { subgraphs } from "@/constants/subgraph";
import { beanstalkAddress } from "@/generated/contractHooks";
import {
  GaugesInfoHourlySnapshot,
  SeasonalGaugesInfoDocument,
  SeasonalGaugesInfoQuery,
} from "@/generated/gql/pintostalk/graphql";
import { PaginationSettings, paginateSubgraph } from "@/utils/paginateSubgraph";
import { useChainId } from "wagmi";
import useSeasonalQueries, { ConvertEntryFn, SeasonalQueryVars } from "./useSeasonalInternalQueries";

const paginateSettings: PaginationSettings<
  GaugesInfoHourlySnapshot,
  SeasonalGaugesInfoQuery,
  "gaugesInfoHourlySnapshots",
  SeasonalQueryVars
> = {
  primaryPropertyName: "gaugesInfoHourlySnapshots",
  idField: "id",
  nextVars: (value1000: GaugesInfoHourlySnapshot, prevVars: SeasonalQueryVars) => {
    if (value1000) {
      return {
        ...prevVars,
        from: Number(value1000.season),
      };
    }
  },
};

const NO_VARS = {} as const;

export default function useSeasonalGaugeInfo(
  fromSeason: number,
  toSeason: number,
  convertResult: ConvertEntryFn<GaugesInfoHourlySnapshot>,
) {
  const chainId = useChainId();
  const queryFnFactory = (vars: SeasonalQueryVars) => async () => {
    return await paginateSubgraph(paginateSettings, subgraphs[chainId].beanstalk, SeasonalGaugesInfoDocument, vars);
  };

  return useSeasonalQueries("BeanstalkSeasonalGaugesInfoQuery", {
    fromSeason,
    toSeason,
    queryVars: NO_VARS,
    historicalQueryFnFactory: queryFnFactory,
    currentQueryFnFactory: queryFnFactory,
    resultTimestamp: (entry) => {
      return new Date(Number(entry.createdAt) * 1000);
    },
    convertResult,
  });
}
