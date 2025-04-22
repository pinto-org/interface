import { subgraphs } from "@/constants/subgraph";
import { FarmerSeasonalSiloDocument, FarmerSeasonalSiloQuery, SiloHourlySnapshot } from "@/generated/gql/graphql";
import { PaginationSettings, paginateSubgraph } from "@/utils/paginateSubgraph";
import { UseSeasonalResult } from "@/utils/types";
import { useChainId } from "wagmi";
import useSeasonalQueries, { ConvertEntryFn, SeasonalQueryVars } from "./useSeasonalInternalQueries";

import { isValidAddress } from "@/utils/string";
import { useCallback } from "react";
import { useAccount } from "wagmi";

const paginateSettings: PaginationSettings<
  SiloHourlySnapshot,
  FarmerSeasonalSiloQuery,
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

const normaliseTimestamp = (entry: SiloHourlySnapshot) => new Date(Number(entry.createdAt) * 1000);

// Overload signatures
export default function useSeasonalFarmerSG(
  fromSeason: number,
  toSeason: number,
  convertResult: ConvertEntryFn<SiloHourlySnapshot>,
  siloAccount?: string,
): UseSeasonalResult {
  const chainId = useChainId();
  const { address } = useAccount();

  const queryFnFactory = useCallback(
    (vars: SeasonalQueryVars) => {
      return () => paginateSubgraph(paginateSettings, subgraphs[chainId].beanstalk, FarmerSeasonalSiloDocument, vars);
    },
    [chainId],
  );

  const account = (siloAccount || address)?.toLowerCase();

  const queryDisabled = !isValidAddress(account);

  return useSeasonalQueries(
    "FarmerSeasonalSiloQuery",
    {
      fromSeason,
      toSeason,
      queryVars: { account },
      historicalQueryFnFactory: queryFnFactory,
      currentQueryFnFactory: queryFnFactory,
      resultTimestamp: normaliseTimestamp,
      convertResult: convertResult,
    },
    true, // sparseData
    queryDisabled,
  );
}
