import { FarmerSeasonalSiloDocument, FarmerSeasonalSiloQuery } from "@/generated/gql/pintostalk-cache/graphql";
import { isValidAddress } from "@/utils/string";
import { parseSGResultTimestamp } from "@/utils/time";
import { UseSeasonalResult } from "@/utils/types";
import { useAccount, useChainId } from "wagmi";
import { ConvertEntryFn, buildSeasonRangeWhere, useCacheQuery } from "./useCacheQuery";

type FarmerSiloSnapshot = FarmerSeasonalSiloQuery["siloHourlySnapshots"][number];

export default function useSeasonalFarmerCache(
  fromSeason: number,
  toSeason: number,
  convertResult: ConvertEntryFn<FarmerSiloSnapshot>,
  siloAccount?: string,
): UseSeasonalResult {
  const chainId = useChainId();
  const { address } = useAccount();

  const account = (siloAccount || address)?.toLowerCase();
  const queryDisabled = !isValidAddress(account);

  return useCacheQuery<FarmerSeasonalSiloQuery, FarmerSiloSnapshot>(
    "FarmerSeasonalSiloCache",
    {
      fromSeason,
      toSeason,
      document: FarmerSeasonalSiloDocument,
      buildWhere: (from, to) => buildSeasonRangeWhere(from, to, { silo: account }),
      resultKey: "siloHourlySnapshots",
      resultTimestamp: parseSGResultTimestamp,
      convertResult,
      orderBy: "season",
      orderDirection: "asc",
      sparseData: true,
    },
    queryDisabled,
  );
}
