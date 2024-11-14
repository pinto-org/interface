import { UseSeasonalResult } from "@/utils/types";
import useSeasonalBeanBeanSG from "./queries/useSeasonalBeanBeanSG";
import useSeasonalBeanstalkSiloSG from "./queries/useSeasonalBeanstalkSiloSG";
import { PODS, STALK } from "@/constants/internalTokens";
import { TV } from "@/classes/TokenValue";
import { PINTO } from "@/constants/tokens";
import useSeasonalBeanSeasonSG from "./queries/useSeasonalBeanSeasonSG";
import useSeasonalBeanstalkFieldSG from "./queries/useSeasonalBeanstalkFieldSG";

/** Bean BeanHourlySnapshot **/

export function useSeasonalPrice(fromSeason: number, toSeason: number): UseSeasonalResult {
  return useSeasonalBeanBeanSG(fromSeason, toSeason, (beanHourly, timestamp) => ({
    season: Number(beanHourly.season.season),
    value: Number(beanHourly.price),
    timestamp,
  }));
}

export function useSeasonalSupply(fromSeason: number, toSeason: number): UseSeasonalResult {
  return useSeasonalBeanBeanSG(fromSeason, toSeason, (beanHourly, timestamp) => ({
    season: Number(beanHourly.season.season),
    value: TV.fromBlockchain(beanHourly.supply, PINTO.decimals).toNumber(),
    timestamp,
  }));
}

export function useSeasonalMcap(fromSeason: number, toSeason: number): UseSeasonalResult {
  return useSeasonalBeanBeanSG(fromSeason, toSeason, (beanHourly, timestamp) => ({
    season: Number(beanHourly.season.season),
    value: Number(beanHourly.marketCap),
    timestamp,
  }));
}

export function useSeasonalL2SR(fromSeason: number, toSeason: number): UseSeasonalResult {
  return useSeasonalBeanBeanSG(fromSeason, toSeason, (beanHourly, timestamp) => ({
    season: Number(beanHourly.season.season),
    value: Number(beanHourly.supplyInPegLP),
    timestamp,
  }));
}

/** Bean Season **/

export function useSeasonalTotalLiquidity(fromSeason: number, toSeason: number): UseSeasonalResult {
  return useSeasonalBeanSeasonSG(fromSeason, toSeason, (beanSeason, timestamp) => ({
    season: Number(beanSeason.season),
    value: beanSeason.poolHourlySnapshots.reduce((acc, next) => {
      return acc + Number(next.liquidityUSD);
    }, 0),
    timestamp,
  }));
}

/** Beanstalk SiloHourlySnapshot **/

export function useSeasonalStalk(fromSeason: number, toSeason: number): UseSeasonalResult {
  return useSeasonalBeanstalkSiloSG(fromSeason, toSeason, (siloHourly, timestamp) => ({
    season: Number(siloHourly.season),
    value: TV.fromBlockchain(siloHourly.stalk, STALK.decimals).toNumber(),
    timestamp,
  }));
}

/** Beanstalk FieldHourlySnapshot **/

export function useSeasonalPodRate(fromSeason: number, toSeason: number): UseSeasonalResult {
  return useSeasonalBeanstalkFieldSG(fromSeason, toSeason, (fieldHourly, timestamp) => ({
    season: Number(fieldHourly.season),
    value: Number(fieldHourly.podRate),
    timestamp,
  }));
}

export function useSeasonalTemperature(fromSeason: number, toSeason: number): UseSeasonalResult {
  return useSeasonalBeanstalkFieldSG(fromSeason, toSeason, (fieldHourly, timestamp) => ({
    season: Number(fieldHourly.season),
    value: Number(fieldHourly.temperature) / 100,
    timestamp,
  }));
}

export function useSeasonalPodIndex(fromSeason: number, toSeason: number): UseSeasonalResult {
  return useSeasonalBeanstalkFieldSG(fromSeason, toSeason, (fieldHourly, timestamp) => ({
    season: Number(fieldHourly.season),
    value: TV.fromBlockchain(fieldHourly.podIndex, PODS.decimals).toNumber(),
    timestamp,
  }));
}

export function useSeasonalSownPinto(fromSeason: number, toSeason: number): UseSeasonalResult {
  return useSeasonalBeanstalkFieldSG(fromSeason, toSeason, (fieldHourly, timestamp) => ({
    season: Number(fieldHourly.season),
    value: TV.fromBlockchain(fieldHourly.sownBeans, PINTO.decimals).toNumber(),
    timestamp,
  }));
}

export function useSeasonalPodsHarvested(fromSeason: number, toSeason: number): UseSeasonalResult {
  return useSeasonalBeanstalkFieldSG(fromSeason, toSeason, (fieldHourly, timestamp) => ({
    season: Number(fieldHourly.season),
    value: TV.fromBlockchain(fieldHourly.harvestedPods, PODS.decimals).toNumber(),
    timestamp,
  }));
}
