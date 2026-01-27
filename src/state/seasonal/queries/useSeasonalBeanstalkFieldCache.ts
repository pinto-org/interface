import { beanstalkAddress } from "@/generated/contractHooks";
import { BeanstalkSeasonalFieldDocument, BeanstalkSeasonalFieldQuery } from "@/generated/gql/pintostalk-cache/graphql";
import { UseSeasonalResult } from "@/utils/types";
import { useChainId } from "wagmi";
import { ConvertEntryFn, buildSeasonRangeWhere, useCacheQuery } from "./useCacheQuery";

type FieldSnapshot = BeanstalkSeasonalFieldQuery["fieldHourlySnapshots"][number];

export default function useSeasonalBeanstalkFieldCache(
  fromSeason: number,
  toSeason: number,
  convertResult: ConvertEntryFn<FieldSnapshot>,
): UseSeasonalResult {
  const chainId = useChainId();
  const field = beanstalkAddress[chainId].toLowerCase();

  return useCacheQuery<BeanstalkSeasonalFieldQuery, FieldSnapshot>("BeanstalkSeasonalFieldCache", {
    fromSeason,
    toSeason,
    document: BeanstalkSeasonalFieldDocument,
    buildWhere: (from, to) => buildSeasonRangeWhere(from, to, { field }),
    resultKey: "fieldHourlySnapshots",
    resultTimestamp: (entry) => new Date(Number(entry.createdAt) * 1000),
    convertResult,
    orderBy: "season",
    orderDirection: "asc",
  });
}
