import { subgraphs } from "@/constants/subgraph";
import {
  BeanstalkSeasonalWrappedDepositErc20Document,
  BeanstalkSeasonalWrappedDepositErc20Query,
  WrappedDepositErc20HourlySnapshot,
} from "@/generated/gql/pintostalk/graphql";
import { PaginationSettings, paginateSubgraph } from "@/utils/paginateSubgraph";
import { UseSeasonalResult } from "@/utils/types";
import { useCallback } from "react";
import { useChainId } from "wagmi";
import useSeasonalQueries, { ConvertEntryFn, SeasonalQueryVars } from "./useSeasonalInternalQueries";

const paginateSettings: PaginationSettings<
  WrappedDepositErc20HourlySnapshot,
  BeanstalkSeasonalWrappedDepositErc20Query,
  "wrappedDepositERC20HourlySnapshots",
  SeasonalQueryVars
> = {
  primaryPropertyName: "wrappedDepositERC20HourlySnapshots",
  idField: "id",
  nextVars: (value1000: WrappedDepositErc20HourlySnapshot, prevVars: SeasonalQueryVars) => {
    if (value1000) {
      return {
        ...prevVars,
        from: Number(value1000.season),
      };
    }
  },
};

export const WRAPPED_MAIN_TOKEN_DEPLOY_SEASON = 2538;

export function truncateBeanstalkWrappedDespositsSeasons(fromSeason: number, toSeason: number) {
  // if (isDev()) {
  //   return { fromSeason, toSeason };
  // }

  return {
    fromSeason: Math.max(fromSeason, WRAPPED_MAIN_TOKEN_DEPLOY_SEASON),
    toSeason: Math.max(toSeason, WRAPPED_MAIN_TOKEN_DEPLOY_SEASON),
  };
}

export default function useSeasonalBeanstalkWrappedDepositsSG(
  fromSeason: number,
  toSeason: number,
  convertResult: ConvertEntryFn<WrappedDepositErc20HourlySnapshot>,
): UseSeasonalResult {
  const chainId = useChainId();
  const queryFnFactory = useCallback(
    (vars: SeasonalQueryVars) => {
      return () =>
        paginateSubgraph(
          paginateSettings,
          subgraphs[chainId].beanstalk,
          BeanstalkSeasonalWrappedDepositErc20Document,
          vars,
        );
    },
    [chainId],
  );

  const truncatedSeasons = truncateBeanstalkWrappedDespositsSeasons(fromSeason, toSeason);

  return useSeasonalQueries(
    "BeanstalkSeasonalWrappedDepositsQuery",
    {
      fromSeason: truncatedSeasons.fromSeason,
      toSeason: truncatedSeasons.toSeason,
      queryVars: {},
      historicalQueryFnFactory: queryFnFactory,
      currentQueryFnFactory: queryFnFactory,
      resultTimestamp: (entry) => {
        return new Date(Number(entry.createdAt) * 1000);
      },
      convertResult,
    },
    true,
  );
}
