import { UseSeasonalResult } from "@/utils/types";
import { TV } from "@/classes/TokenValue";
import { PINTO } from "@/constants/tokens";
import useSeasonalBeanBeanSG from "./queries/useSeasonalBeanBeanSG";

export default function useSeasonalSupply(fromSeason: number, toSeason: number): UseSeasonalResult {
  return useSeasonalBeanBeanSG(fromSeason, toSeason, (beanHourly, timestamp) => ({
    season: Number(beanHourly.season),
    value: TV.fromBlockchain(beanHourly.supply, PINTO.decimals).toNumber(),
    timestamp,
  }));
}
