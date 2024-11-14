import { useQueryClient } from "@tanstack/react-query";
import { atom, useAtomValue } from "jotai";
import { useCallback } from "react";
import {
  fieldAtom,
  fieldPodlineAtom,
  fieldQueryKeysAtom,
  fieldTemperatureAtom,
  fieldTotalSoilAtom,
  fieldWeatherAtom,
} from "./protocol/field/field.atoms";

// Atoms

const harvestableIndexAtom = atom((get) => get(fieldPodlineAtom).harvestableIndex);
const podIndexAtom = atom((get) => get(fieldPodlineAtom).podIndex);
const podLineAtom = atom((get) => get(fieldPodlineAtom).podLine);

// Hooks

// Field. Not optimal, but useful for convenience. Opt to use the individual hooks instead.
export function useField() {
  return useAtomValue(fieldAtom);
}

export function useTotalSoil() {
  return useAtomValue(fieldTotalSoilAtom);
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

export function usePodIndex() {
  return useAtomValue(podIndexAtom);
}

export function usePodLine() {
  return useAtomValue(podLineAtom);
}

export function useFieldQueryKeys() {
  return useAtomValue(fieldQueryKeysAtom);
}

export function useInvalidateField() {
  const qc = useQueryClient();
  const queryKeys = useFieldQueryKeys();

  return useCallback(
    (key: keyof typeof queryKeys | "all") => {
      if (key === "all") {
        Object.values(queryKeys).forEach((queryKey) => qc.invalidateQueries({ queryKey }));
      } else {
        qc.invalidateQueries({ queryKey: queryKeys[key] });
      }
    },
    [qc, queryKeys],
  );
}
