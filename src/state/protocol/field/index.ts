import { TV } from "@/classes/TokenValue";
import { Prettify } from "@/utils/types.generic";
import { QueryKey } from "@tanstack/react-query";

export interface TotalSoil {
  totalSoil: TV;
  isLoading: boolean;
}

export interface InitialSoil {
  initialSoil: TV;
  isLoading: boolean;
}

export interface FieldTemperature {
  max: TV;
  scaled: TV;
  isLoading: boolean;
}

export interface FieldWeather {
  lastDeltaSoil: TV;
  lastSowTime: number;
  thisSowTime: number;
  temp: number;
  isLoading: boolean;
}

export interface FieldPodLine {
  podIndex: TV;
  harvestableIndex: TV;
  podLine: TV;
  isLoading: boolean;
}

export type Field = Prettify<
  FieldPodLine & {
    weather: FieldWeather;
  } & {
    temperature: FieldTemperature;
  } & {
    totalSoil: TV;
  }
>;

/**
 * Query keys for the field.
 * - temperature: FieldTemperature query key
 * - soil: FieldSoil query key
 * - initialSoil: FieldInitialSoil query key
 * - podLine: FieldPodLine query key
 * - weather: FieldWeather query key
 */
export interface FieldQueryKeys {
  temperature: QueryKey;
  soil: QueryKey;
  initialSoil: QueryKey;
  podLine: QueryKey;
  weather: QueryKey;
}

export type Temperature = {
  current: TV;
  next: TV;
  max: TV;
};

export const TEMPERATURE_DECIMALS = 6;

export const TEMPERATURE_LOG_BASE = 3.5;

export const TEMPERATURE_PRECISION = 1e6;

/**
 * indexes in terms of L1 blocks
 */
const DELTA_TEMPERATURE_PCTS: Record<number, number> = {
  0: TEMPERATURE_PRECISION, // placeholder. It should be 1% of max temperature
  1: 76079978576,
  2: 145535557307,
  3: 209428496104,
  4: 268584117732,
  5: 323656683909,
  6: 375173629062,
  7: 423566360442,
  8: 469192241217,
  9: 512350622036,
  10: 553294755665,
  11: 592240801642,
  12: 629374734241,
  13: 664857713614,
  14: 698830312972,
  15: 731415882267,
  16: 762723251769,
  17: 792848925126,
  18: 821878873397,
  19: 849890014127,
  20: 876951439574,
  21: 903125443474,
  22: 928468384727,
  23: 953031418151,
  24: 976861116107,
};

const scaleTemperature = (pct: TV, maxTemp: TV) => {
  if (maxTemp.eq(0)) {
    return TV.ZERO;
  }
  const pctScaled = pct.div(TEMPERATURE_PRECISION);
  const temperature = pctScaled.mul(maxTemp).div(TEMPERATURE_PRECISION);
  return temperature.reDecimal(TEMPERATURE_DECIMALS);
};

export function getMorningTemperature(
  index: number, // in terms of L1 blocks
  maxTemperature: TV,
) {
  if (index in DELTA_TEMPERATURE_PCTS) {
    if (index === 0) {
      return maxTemperature.div(100); // 1% of max temperature
    }

    return scaleTemperature(TV.fromHuman(DELTA_TEMPERATURE_PCTS[index], TEMPERATURE_DECIMALS), maxTemperature);
  }
  return maxTemperature;
}
