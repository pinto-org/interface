import { UseSeasonalResult } from "@/utils/types";
import useSeasonalBeanBeanSG from "./queries/useSeasonalBeanBeanSG";
import useSeasonalBeanstalkSiloSG from "./queries/useSeasonalBeanstalkSiloSG";
import { STALK } from "@/constants/internalTokens";
import { TV } from "@/classes/TokenValue";
import { PINTO } from "@/constants/tokens";
import useSeasonalBeanSeasonSG from "./queries/useSeasonalBeanSeasonSG";

export function useSeasonalL2SR(fromSeason: number, toSeason: number): UseSeasonalResult {
  return useSeasonalBeanBeanSG(fromSeason, toSeason, (beanHourly, timestamp) => ({
    season: Number(beanHourly.season.season),
    value: Number(beanHourly.supplyInPegLP),
    timestamp,
  }));
}

export function useSeasonalMcap(fromSeason: number, toSeason: number): UseSeasonalResult {
  return useSeasonalBeanBeanSG(fromSeason, toSeason, (beanHourly, timestamp) => ({
    season: Number(beanHourly.season),
    value: Number(beanHourly.marketCap),
    timestamp,
  }));
}

export function useSeasonalPrice(fromSeason: number, toSeason: number): UseSeasonalResult {
  return useSeasonalBeanBeanSG(fromSeason, toSeason, (beanHourly, timestamp) => ({
    season: Number(beanHourly.season.season),
    value: Number(beanHourly.price),
    timestamp,
  }));
}

export function useSeasonalStalk(fromSeason: number, toSeason: number): UseSeasonalResult {
  return useSeasonalBeanstalkSiloSG(fromSeason, toSeason, (siloHourly, timestamp) => ({
    season: Number(siloHourly.season),
    value: TV.fromBlockchain(siloHourly.stalk, STALK.decimals).toNumber(),
    timestamp,
  }));
}

export function useSeasonalSupply(fromSeason: number, toSeason: number): UseSeasonalResult {
  return useSeasonalBeanBeanSG(fromSeason, toSeason, (beanHourly, timestamp) => ({
    season: Number(beanHourly.season),
    value: TV.fromBlockchain(beanHourly.supply, PINTO.decimals).toNumber(),
    timestamp,
  }));
}

export function useSeasonalTotalLiquidity(fromSeason: number, toSeason: number): UseSeasonalResult {
  return useSeasonalBeanSeasonSG(fromSeason, toSeason, (beanSeason, timestamp) => ({
    season: Number(beanSeason.season),
    value: beanSeason.poolHourlySnapshots.reduce((acc, next) => {
      return acc + Number(next.liquidityUSD);
    }, 0),
    timestamp,
  }));
}
