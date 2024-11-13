import { UseSeasonalResult } from "@/utils/types";
import useSeasonalBeanBeanSG from "./queries/useSeasonalBeanBeanSG";

export default function useSeasonalL2SR(fromSeason: number, toSeason: number): UseSeasonalResult {
  return useSeasonalBeanBeanSG(fromSeason, toSeason, (beanHourly, timestamp) => ({
    season: Number(beanHourly.season.season),
    value: Number(beanHourly.supplyInPegLP),
    timestamp,
  }));
}
