import { useAtomValue } from "jotai";
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
