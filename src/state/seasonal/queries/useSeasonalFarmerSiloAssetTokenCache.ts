import {
  FarmerSeasonalSiloAssetTokenDocument,
  FarmerSeasonalSiloAssetTokenQuery,
} from "@/generated/gql/pintostalk-cache/graphql";
import { isValidAddress } from "@/utils/string";
import { parseSGResultTimestamp } from "@/utils/time";
import { UseSeasonalResult } from "@/utils/types";
import { useChainId } from "wagmi";
import { ConvertEntryFn, buildSeasonRangeWhere, useCacheQuery } from "./useCacheQuery";

type SiloAssetSnapshot = FarmerSeasonalSiloAssetTokenQuery["siloAssetHourlySnapshots"][number];

export default function useSeasonalFarmerSiloAssetTokenCache(
  fromSeason: number,
  toSeason: number,
  token: string,
  account: string,
  convertResult: ConvertEntryFn<SiloAssetSnapshot>,
): UseSeasonalResult {
  const chainId = useChainId();

  const siloAsset = `${account}-${token}`.toLowerCase();
  const queryDisabled = !isValidAddress(account) || !isValidAddress(token);

  return useCacheQuery<FarmerSeasonalSiloAssetTokenQuery, SiloAssetSnapshot>(
    "FarmerSeasonalSiloAssetTokenCache",
    {
      fromSeason,
      toSeason,
      document: FarmerSeasonalSiloAssetTokenDocument,
      buildWhere: (from, to) => buildSeasonRangeWhere(from, to, { siloAsset }),
      resultKey: "siloAssetHourlySnapshots",
      resultTimestamp: parseSGResultTimestamp,
      convertResult,
      orderBy: "season",
      orderDirection: "asc",
      sparseData: true,
    },
    queryDisabled,
  );
}
