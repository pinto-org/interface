import { TV } from "@/classes/TokenValue";
import { INTERVALS_PER_MORNING } from "@/constants/morning";
import { useCallback, useMemo } from "react";
import { getMorningTemperature } from "./protocol/field";
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

export default function useCalculateTemperature(): {
  generate: () => MorningTemperatureLookup;
  calculate: (morningIdx: number) => TV;
} {
  const temperature = useTemperature();
  const maxTemperature = temperature.max;

  /**
   * Get the temperature of a block during the morning period given the index of the morning interval.
   * @param morningIdx - the index of the morning interval. See getMorningResult()
   */
  const calculate = useCallback(
    (morningIdx: number) => {
      const t = getMorningTemperature(morningIdx, maxTemperature);
      return t;
    },
    [maxTemperature],
  );

  /**
   * Generate a mapping of block numbers to their respective temperatures.
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

  return useMemo(
    () => ({
      generate,
      calculate,
    }),
    [generate, calculate],
  );
}
