import { subgraphs } from "@/constants/subgraph";
import {
  FarmerSeasonalSiloAssetTokenDocument as Document,
  FarmerSeasonalSiloAssetTokenQuery,
  SiloAssetHourlySnapshot,
} from "@/generated/gql/pintostalk/graphql";
import { PaginationSettings, paginateSubgraph } from "@/utils/paginateSubgraph";
import { isValidAddress } from "@/utils/string";
import { UseSeasonalResult } from "@/utils/types";
import { useCallback } from "react";
import { useChainId } from "wagmi";
import useSeasonalQueries, { ConvertEntryFn, SeasonalQueryVars } from "./useSeasonalInternalQueries";

const paginateSettings: PaginationSettings<
  SiloAssetHourlySnapshot,
  FarmerSeasonalSiloAssetTokenQuery,
  "siloAssetHourlySnapshots",
  SeasonalQueryVars
> = {
  primaryPropertyName: "siloAssetHourlySnapshots",
  idField: "id",
  nextVars: (value1000: SiloAssetHourlySnapshot, prevVars: SeasonalQueryVars) => {
    if (value1000) {
      return {
        ...prevVars,
        from: Number(value1000.season),
      };
    }
  },
};

function normaliseTimestamp(entry: SiloAssetHourlySnapshot) {
  return new Date(Number(entry.createdAt) * 1000);
}

export default function useSeasonalFarmerSiloAssetTokenSG(
  fromSeason: number,
  toSeason: number,
  token: string,
  account: string,
  convertResult: ConvertEntryFn<SiloAssetHourlySnapshot>,
): UseSeasonalResult {
  const chainId = useChainId();

  const queryFnFactory = useCallback(
    (vars: SeasonalQueryVars) => {
      return () => paginateSubgraph(paginateSettings, subgraphs[chainId].beanstalk, Document, vars);
    },
    [chainId],
  );

  const siloAsset = `${account}-${token}`.toLowerCase();

  const queryDisabled = !isValidAddress(account) || !isValidAddress(token);

  return useSeasonalQueries(
    "FarmerSeasonalSiloAssetTokenQuery",
    {
      fromSeason,
      toSeason,
      queryVars: { siloAsset },
      historicalQueryFnFactory: queryFnFactory,
      currentQueryFnFactory: queryFnFactory,
      resultTimestamp: normaliseTimestamp,
      convertResult,
    },
    true,
    queryDisabled,
  );
}
