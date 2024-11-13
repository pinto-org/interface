import { useAtomValue } from "jotai";
import {
  morningAtom,
  morningRemainingAtom,
  seasonAtom,
  seasonTimeAtom,
  sunQueryKeysAtomAtom,
  sunriseRemainingAtom,
} from "./protocol/sun/sun.atoms";

export function useSunData() {
  const data = useAtomValue(seasonAtom);
  const queryKeys = useAtomValue(sunQueryKeysAtomAtom);

  return { ...data, queryKeys };
}

export function useSeasonTime() {
  return useAtomValue(seasonTimeAtom);
}

export function useSeason() {
  return useAtomValue(seasonAtom).current;
}

export function useSunriseRemaining() {
  return useAtomValue(sunriseRemainingAtom);
}

export function useMorning() {
  return useAtomValue(morningAtom);
}

export function useMorningRemaining() {
  return useAtomValue(morningRemainingAtom);
}
