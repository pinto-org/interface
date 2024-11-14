import { InvalidateOptions, InvalidateQueryFilters, useQueryClient } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { useCallback } from "react";
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

export function useInvalidateSun() {
  const queryKeys = useSeasonQueryKeys();
  const qc = useQueryClient();

  return useCallback(
    (key: keyof typeof useSeasonQueryKeys | "all", filters?: InvalidateQueryFilters, options?: InvalidateOptions) => {
      if (key === "all") {
        Object.values(queryKeys).forEach((queryKey) => qc.invalidateQueries({ queryKey, ...filters, ...options }));
      } else {
        qc.invalidateQueries({ queryKey: queryKeys[key], ...filters, ...options });
      }
    },
    [qc, queryKeys],
  );
}
