import { beanstalkAddress } from "@/generated/contractHooks";
import {
  BeanstalkSeasonalSiloActiveFarmersDocument,
  BeanstalkSeasonalSiloActiveFarmersQuery,
  BeanstalkSeasonalSiloDocument,
  BeanstalkSeasonalSiloQuery,
} from "@/generated/gql/pintostalk-cache/graphql";
import { parseSGResultTimestamp } from "@/utils/time";
import { UseSeasonalResult } from "@/utils/types";
import { useChainId } from "wagmi";
import { ConvertEntryFn, buildSeasonRangeWhere, useCacheQuery } from "./useCacheQuery";

type SiloSnapshot = BeanstalkSeasonalSiloQuery["siloHourlySnapshots"][number];
type SiloActiveFarmersSnapshot = BeanstalkSeasonalSiloActiveFarmersQuery["siloHourlySnapshots"][number];

export default function useSeasonalBeanstalkSiloCache(
  fromSeason: number,
  toSeason: number,
  convertResult: ConvertEntryFn<SiloSnapshot>,
): UseSeasonalResult {
  const chainId = useChainId();
  const silo = beanstalkAddress[chainId];

  return useCacheQuery<BeanstalkSeasonalSiloQuery, SiloSnapshot>("BeanstalkSeasonalSiloCache", {
    fromSeason,
    toSeason,
    document: BeanstalkSeasonalSiloDocument,
    buildWhere: (from, to) => buildSeasonRangeWhere(from, to, { silo }),
    resultKey: "siloHourlySnapshots",
    resultTimestamp: parseSGResultTimestamp,
    convertResult,
    orderBy: "season",
    orderDirection: "asc",
  });
}

export function useSeasonalBeanstalkSiloActiveFarmersCache(
  fromSeason: number,
  toSeason: number,
  convertResult: ConvertEntryFn<SiloActiveFarmersSnapshot>,
): UseSeasonalResult {
  const chainId = useChainId();
  const silo = beanstalkAddress[chainId];

  return useCacheQuery<BeanstalkSeasonalSiloActiveFarmersQuery, SiloActiveFarmersSnapshot>(
    "BeanstalkSeasonalSiloActiveFarmersCache",
    {
      fromSeason,
      toSeason,
      document: BeanstalkSeasonalSiloActiveFarmersDocument,
      buildWhere: (from, to) => buildSeasonRangeWhere(from, to, { silo, stalk_gt: 0 }),
      resultKey: "siloHourlySnapshots",
      resultTimestamp: (_entry) => new Date(), // activeFarmers query doesn't have createdAt
      convertResult,
      orderBy: "season",
      orderDirection: "desc",
    },
  );
}
