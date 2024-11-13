import { UseSeasonalResult } from "@/utils/types";
import useSeasonalBeanSeasonSG from "./queries/useSeasonalBeanSeasonSG";

export default function useSeasonalTotalLiquidity(fromSeason: number, toSeason: number): UseSeasonalResult {
  return useSeasonalBeanSeasonSG(fromSeason, toSeason, (beanSeason, timestamp) => ({
    season: Number(beanSeason.season),
    value: beanSeason.poolHourlySnapshots.reduce((acc, next) => {
      return acc + Number(next.liquidityUSD);
    }, 0),
    timestamp,
  }));
}
