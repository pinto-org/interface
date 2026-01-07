import { subgraphs } from "@/constants/subgraph";
import {
  CacheSeasonalWrappedDepositDocument,
  CacheSeasonalWrappedDepositQuery,
  WrappedDepositErc20HourlySnapshot,
} from "@/generated/gql/cache/graphql";
import { buildCacheWhereClause, fetchCacheQuery } from "@/utils/paginateSubgraph";
import { UseSeasonalResult } from "@/utils/types";
import { useCallback } from "react";
import { useChainId } from "wagmi";
import useSeasonalQueries, { ConvertEntryFn, SeasonalQueryVars } from "./useSeasonalInternalQueries";

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
        fetchCacheQuery<CacheSeasonalWrappedDepositQuery, WrappedDepositErc20HourlySnapshot>(
          subgraphs[chainId].cache,
          CacheSeasonalWrappedDepositDocument,
          {
            where: buildCacheWhereClause(vars.from, vars.to),
            orderBy: "season",
            orderDirection: "asc",
          },
          "cache_wrappedDepositERC20HourlySnapshots",
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
