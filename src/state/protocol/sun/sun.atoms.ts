import { QueryKey } from "@tanstack/react-query";
import { WritableAtom, atom } from "jotai";
import { Duration } from "luxon";
import { Sun, getNextExpectedSunrise, getNextMorningIntervalUpdate } from ".";

export const seasonAtom = atom<Sun["season"]>({
  current: 0,
  lastSopStart: 0,
  lastSopEnd: 0,
  rainStart: 0,
  raining: false,
  sunriseBlock: 0,
  abovePeg: false,
  start: 0n,
  period: 0n,
  timestamp: getNextExpectedSunrise(),
});

export const morningAtom = atom({
  isMorning: false,
  blockNumber: 0,
  index: -1,
  next: getNextMorningIntervalUpdate(),
});

export const seasonSunriseAtom = atom<Sun["sunrise"]>({
  awaiting: false,
  next: getNextExpectedSunrise(),
});

export const setAwaitingSunriseAtom = atom(null, (_, set, value: boolean) => {
  set(seasonSunriseAtom, (prev) => ({ ...prev, awaiting: value }));
});

export const seasonTimeAtom = atom<Sun["seasonTime"]>(0);

export const sunAtom = atom<Sun>((get) => {
  return {
    season: get(seasonAtom),
    morning: get(morningAtom),
    sunrise: get(seasonSunriseAtom),
    seasonTime: get(seasonTimeAtom),
  };
});

export const seasonQueryKeyAtom = atom<QueryKey>([]);

export const sunriseRemainingAtom = atom<Duration>(getNextExpectedSunrise().diffNow());
