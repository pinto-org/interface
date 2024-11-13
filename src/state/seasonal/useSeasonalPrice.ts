import { BeanHourlySnapshot } from "@/generated/gql/graphql";
import { UseSeasonalResult } from "@/utils/types";
import useSeasonalBeanBeanGql from "./queries/useSeasonalBeanBeanGql";

export default function useSeasonalPrice(fromSeason: number, toSeason: number): UseSeasonalResult {
  return useSeasonalBeanBeanGql(fromSeason, toSeason, (v: BeanHourlySnapshot, timestamp: Date) => ({
    season: Number(v.season.season),
    value: Number(v.price),
    timestamp,
  }));
}
