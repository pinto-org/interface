import { InvalidateOptions, InvalidateQueryFilters, useQueryClient } from "@tanstack/react-query";
import { atom, useAtomValue } from "jotai";
import { useCallback } from "react";
import { FieldQueryKeys } from "./protocol/field";
import {
  fieldAtom,
  fieldInitialSoilAtom,
  fieldPodlineAtom,
  fieldQueryKeysAtom,
  fieldTemperatureAtom,
  fieldTotalSoilAtom,
  fieldWeatherAtom,
} from "./protocol/field/field.atoms";

// Atoms
const harvestableIndexAtom = atom((get) => get(fieldPodlineAtom).harvestableIndex);
const harvestableIndexLoadingAtom = atom((get) => get(fieldPodlineAtom).isLoading);
const podIndexAtom = atom((get) => get(fieldPodlineAtom).podIndex);
const podLineAtom = atom((get) => get(fieldPodlineAtom).podLine);
const podLoadingAtom = atom((get) => get(fieldPodlineAtom).isLoading);

// Hooks
// Field. Not optimal, but useful for convenience. Opt to use the individual hooks instead.
export function useField() {
  return useAtomValue(fieldAtom);
}

export function useTotalSoil() {
  return useAtomValue(fieldTotalSoilAtom);
}

export function useInitialSoil() {
  return useAtomValue(fieldInitialSoilAtom);
}

export function useFieldWeather() {
  return useAtomValue(fieldWeatherAtom);
}

export function useTemperature() {
  return useAtomValue(fieldTemperatureAtom);
}

export function useHarvestableIndex() {
  return useAtomValue(harvestableIndexAtom);
}

export function useHarvestableIndexLoading() {
  return useAtomValue(harvestableIndexLoadingAtom);
}

export function useFieldPodLine() {
  return useAtomValue(fieldPodlineAtom);
}

export function usePodIndex() {
  return useAtomValue(podIndexAtom);
}

export function usePodLine() {
  return useAtomValue(podLineAtom);
}

export function usePodLoading() {
  return useAtomValue(podLoadingAtom);
}

export function useFieldQueryKeys() {
  return useAtomValue(fieldQueryKeysAtom);
}

// Query keys Invalidation
type FieldQueryKey = keyof FieldQueryKeys;

export function useInvalidateField() {
  const qc = useQueryClient();
  const queryKeys = useFieldQueryKeys();

  // biome-ignore lint/correctness/useExhaustiveDependencies:
  return useCallback(
    (key: FieldQueryKey | FieldQueryKey[] | "all", filters?: InvalidateQueryFilters, options?: InvalidateOptions) => {
      const keys = key === "all" ? Object.values(queryKeys) : Array.isArray(key) ? key : [key];

      keys.forEach((key) =>
        qc.invalidateQueries({
          queryKey: queryKeys[key],
          ...filters,
          ...options,
        }),
      );
    },
    [queryKeys],
  );
}
