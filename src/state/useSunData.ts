import { InvalidateOptions, InvalidateQueryFilters, useQueryClient } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { useCallback } from "react";
import { SunQueryKeys } from "./protocol/sun";
import {
  morningAtom,
  morningRemainingAtom,
  seasonAtom,
  seasonTimeAtom,
  sunQueryKeysAtom,
  sunriseRemainingAtom,
} from "./protocol/sun/sun.atoms";

export function useSunData() {
  return useAtomValue(seasonAtom);
}

export function useSeasonTime() {
  return useAtomValue(seasonTimeAtom);
}

export function useSeason() {
  return useAtomValue(seasonAtom).current;
}

export const useRemainingUntilSunrise = () => {
  return useAtomValue(sunriseRemainingAtom);
};

export function useMorning() {
  return useAtomValue(morningAtom);
}

export function useMorningRemaining() {
  return useAtomValue(morningRemainingAtom);
}

export function useSeasonQueryKeys() {
  return useAtomValue(sunQueryKeysAtom);
}

type SunQueryKey = keyof SunQueryKeys;

export function useInvalidateSun() {
  const queryKeys = useSeasonQueryKeys();
  const qc = useQueryClient();

  // biome-ignore lint/correctness/useExhaustiveDependencies:
  return useCallback(
    (key: SunQueryKey | SunQueryKey[] | "all", filters?: InvalidateQueryFilters, options?: InvalidateOptions) => {
      const keys = key === "all" ? Object.values(queryKeys) : Array.isArray(key) ? key : [key];

      keys.forEach((key) => qc.invalidateQueries({ queryKey: queryKeys[key], ...filters, ...options }));
    },
    [queryKeys],
  );
}
