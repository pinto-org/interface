import { TV } from "@/classes/TokenValue";
import { INTERVALS_PER_MORNING, MORNING_AUCTION_DURATION } from "@/constants/morning";
import { useCallback, useMemo } from "react";
import { getMorningTemperature, scaleTemperatureWithMaxTemperature } from "./protocol/field";
import { useTemperature } from "./useFieldData";

export type MorningBlockTemperature = {
  /** */
  temperature: TV;
  /** */
  maxTemperature: TV;
  /** */
  index: number;
  /** interval index (0-25) */
  interval: number;
};

export type MorningTemperatureLookup = {
  [blockNumber: string]: MorningBlockTemperature;
};

const intervalBlocks = Array.from({ length: INTERVALS_PER_MORNING + 1 }, (_, i) => i);

// Generate 600 data points for continuous temperature display (1 per second)
const secondsArray = Array.from({ length: MORNING_AUCTION_DURATION }, (_, i) => i);

export default function useCalculateTemperature(): {
  generate: () => MorningTemperatureLookup;
  generateContinuous: () => MorningTemperatureLookup;
  calculate: (morningIdx: number) => TV;
  calculateContinuous: (secondsElapsed: number) => TV;
} {
  const temperature = useTemperature();
  const maxTemperature = temperature.max;

  /**
   * Get the temperature of a block during the morning period given the index of the morning interval.
   * @param morningIdx - the index of the morning interval. See getMorningResult()
   * @deprecated Use calculateContinuous instead for time-based temperature calculation
   */
  const calculate = useCallback(
    (morningIdx: number) => {
      const t = getMorningTemperature(morningIdx, maxTemperature);
      return t;
    },
    [maxTemperature],
  );

  /**
   * Calculate the temperature based on seconds elapsed since sunrise.
   * Uses the logarithmic formula: T(t) = T_max × [log₂(t × c + 1) / log₂(D × c + 1)]
   * @param secondsElapsed - seconds since sunrise (0-599)
   */
  const calculateContinuous = useCallback(
    (secondsElapsed: number) => {
      return scaleTemperatureWithMaxTemperature(maxTemperature, secondsElapsed);
    },
    [maxTemperature],
  );

  /**
   * Generate a mapping of block numbers to their respective temperatures.
   * @deprecated Use generateContinuous for continuous temperature display
   */
  const generate = useCallback(() => {
    return intervalBlocks.reduce<MorningTemperatureLookup>((prev, _, i) => {
      const index = i.toString();

      prev[index] = {
        index: i,
        interval: i,
        temperature: calculate(i),
        maxTemperature: maxTemperature,
      };

      return prev;
    }, {});
  }, [maxTemperature, calculate]);

  /**
   * Generate 600 data points (one per second) for continuous temperature display.
   * Uses the new time-based logarithmic formula instead of interval-based lookup.
   */
  const generateContinuous = useCallback(() => {
    return secondsArray.reduce<MorningTemperatureLookup>((prev, secondsElapsed) => {
      const index = secondsElapsed.toString();

      prev[index] = {
        index: secondsElapsed,
        interval: secondsElapsed,
        temperature: calculateContinuous(secondsElapsed),
        maxTemperature: maxTemperature,
      };

      return prev;
    }, {});
  }, [maxTemperature, calculateContinuous]);

  return useMemo(
    () => ({
      generate,
      generateContinuous,
      calculate,
      calculateContinuous,
    }),
    [generate, generateContinuous, calculate, calculateContinuous],
  );
}
