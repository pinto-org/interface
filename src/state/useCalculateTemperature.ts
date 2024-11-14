import { TV } from "@/classes/TokenValue";
import { INTERVALS_PER_MORNING } from "@/constants/morning";
import { useAtomValue } from "jotai";
import { useCallback, useMemo } from "react";
import { Temperature, getMorningTemperature } from "./protocol/field";
import { readonlyTemperatureAtom } from "./protocol/field/field.atoms";

export type MorningBlockTemperature = {
  /** */
  temperature: TV;
  /** */
  maxTemperature: TV;
  /** */
  index: number;
  /** index + 1  */
  interval: number;
};

export type MorningTemperatureLookup = {
  [blockNumber: string]: MorningBlockTemperature;
};

const intervalBlocks = Array.from({ length: INTERVALS_PER_MORNING }, (_, i) => i);

export default function useCalculateTemperature(): readonly [
  temperature: Temperature,
  utils: {
    loading: boolean;
    generate: () => MorningTemperatureLookup;
    calculate: (morningIdx: number) => TV;
  },
] {
  const temperatures = useAtomValue(readonlyTemperatureAtom);
  const maxTemperature = temperatures.max;

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
        interval: i + 1,
        temperature: calculate(i),
        maxTemperature: maxTemperature,
      };

      return prev;
    }, {});
  }, [maxTemperature, calculate]);

  const loading = maxTemperature.lt(0);

  const utils = useMemo(
    () => ({
      loading,
      generate,
      calculate,
    }),
    [generate, calculate, loading],
  );

  return [temperatures, utils] as const;
}
