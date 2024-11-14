import { TV } from "@/classes/TokenValue";
import { INTERVALS_PER_MORNING } from "@/constants/morning";
import { atom } from "jotai";
import { atomWithImmer } from "jotai-immer";
import {
  Field,
  FieldPodLine,
  FieldQueryKeys,
  FieldSoil,
  FieldTemperature,
  FieldWeather,
  Temperature,
  getMorningTemperature,
} from ".";
import { morningAtom } from "../sun/sun.atoms";

export const fieldTotalSoilAtom = atomWithImmer<TV>(TV.fromHuman(0, 6));

export const fieldTemperatureAtom = atomWithImmer<FieldTemperature>({
  max: TV.NEGATIVE_ONE,
  scaled: TV.NEGATIVE_ONE,
});

export const fieldPodlineAtom = atomWithImmer<FieldPodLine>({
  podIndex: TV.ZERO,
  harvestableIndex: TV.ZERO,
  podLine: TV.ZERO,
});

export const fieldWeatherAtom = atomWithImmer<FieldWeather>({
  lastDeltaSoil: TV.ZERO,
  lastSowTime: 0,
  thisSowTime: 0,
  temp: 0,
});

// Combine all field atoms into a single atom. Not preferred, but useful for convenience.
export const fieldAtom = atom<Field>((get) => {
  return {
    weather: get(fieldWeatherAtom),
    temperature: get(fieldTemperatureAtom),
    totalSoil: get(fieldTotalSoilAtom),
    ...get(fieldPodlineAtom),
  };
});

export const fieldQueryKeysAtom = atomWithImmer<FieldQueryKeys>({
  temperature: [],
  soil: [],
  weather: [],
  podLine: [],
});

// ------------------------------ Derived Atoms ------------------------------ //

const maxTemperatureAtom = atom((get) => get(fieldTemperatureAtom).max);

/**
 * Read-only temperature atom.
 */
export const readonlyTemperatureAtom = atom<Temperature>((get) => {
  const morning = get(morningAtom);
  const maxTemperature = get(maxTemperatureAtom);

  const morningIndex = morning.index;
  const isMorning = morning.isMorning;

  const current = isMorning ? getMorningTemperature(morningIndex, maxTemperature) : maxTemperature;
  const nextIndex = morningIndex + 1;

  const next = nextIndex < INTERVALS_PER_MORNING ? getMorningTemperature(nextIndex, maxTemperature) : maxTemperature;

  return {
    current,
    next,
    max: maxTemperature,
  };
});
