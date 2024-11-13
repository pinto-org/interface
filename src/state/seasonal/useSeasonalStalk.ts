import { UseSeasonalResult } from "@/utils/types";
import { STALK } from "@/constants/internalTokens";
import { TV } from "@/classes/TokenValue";
import useSeasonalBeanstalkSiloSG from "./queries/useSeasonalBeanstalkSiloSG";

export default function useSeasonalStalk(fromSeason: number, toSeason: number): UseSeasonalResult {
  return useSeasonalBeanstalkSiloSG(fromSeason, toSeason, (siloHourly, timestamp) => ({
    season: Number(siloHourly.season),
    value: TV.fromBlockchain(siloHourly.stalk, STALK.decimals).toNumber(),
    timestamp,
  }));
}
