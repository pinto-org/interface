import { TV } from "@/classes/TokenValue";
import { atom } from "jotai";
import { atomWithImmer } from "jotai-immer";
import { Field, FieldPodLine, FieldQueryKeys, FieldTemperature, FieldWeather, InitialSoil, TotalSoil } from ".";

export const fieldTotalSoilAtom = atom<TotalSoil>({
  totalSoil: TV.fromHuman(-1, 6),
  isLoading: true,
});

export const fieldInitialSoilAtom = atom<InitialSoil>({
  initialSoil: TV.fromHuman(-1, 6),
  isLoading: true,
});

export const fieldTemperatureAtom = atomWithImmer<FieldTemperature>({
  max: TV.NEGATIVE_ONE,
  scaled: TV.NEGATIVE_ONE,
  isLoading: true,
});

// Shared state between Sow and Field for tractor button animation
export const inputExceedsSoilAtom = atom<boolean>(false);

export const fieldPodlineAtom = atomWithImmer<FieldPodLine>({
  podIndex: TV.NEGATIVE_ONE,
  harvestableIndex: TV.NEGATIVE_ONE,
  podLine: TV.NEGATIVE_ONE,
  isLoading: true,
});

export const fieldWeatherAtom = atomWithImmer<FieldWeather>({
  lastDeltaSoil: TV.NEGATIVE_ONE,
  lastSowTime: 0,
  thisSowTime: 0,
  temp: 0,
  isLoading: true,
});

// Combine all field atoms into a single atom. Not preferred, but useful for convenience.
export const fieldAtom = atom<Field>((get) => {
  const _weather = get(fieldWeatherAtom);
  const _temp = get(fieldTemperatureAtom);
  const _totalSoil = get(fieldTotalSoilAtom);
  return {
    weather: _weather,
    temperature: _temp,
    totalSoil: _totalSoil.totalSoil,
    ...get(fieldPodlineAtom),
    isLoading: _weather.isLoading || _temp.isLoading || _totalSoil.isLoading,
  };
});

export const fieldQueryKeysAtom = atomWithImmer<FieldQueryKeys>({
  temperature: [],
  soil: [],
  initialSoil: [],
  weather: [],
  podLine: [],
});

export const morningFieldDevModeAtom = atomWithImmer<{
  freeze: boolean;
}>({
  freeze: false,
});

// ------------------------------ Derived Atoms ------------------------------ //
// keeping as reference
// const maxTemperatureAtom = atom((get) => get(fieldTemperatureAtom).max);

// /**
//  * Read-only temperature atom.
//  */
// export const readonlyTemperatureAtom = atom<Temperature>((get) => {
//   const morning = get(morningAtom);
//   const maxTemperature = get(maxTemperatureAtom);

//   const morningIndex = morning.index;
//   const isMorning = morning.isMorning;

//   const current = isMorning ? getMorningTemperature(morningIndex, maxTemperature) : maxTemperature;
//   const nextIndex = morningIndex + 1;

//   const next = nextIndex < INTERVALS_PER_MORNING ? getMorningTemperature(nextIndex, maxTemperature) : maxTemperature;

//   return {
//     current,
//     next,
//     max: maxTemperature,
//   };
// });
