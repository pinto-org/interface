import { QueryKey } from "@tanstack/react-query";
import { atom } from "jotai";
import { atomWithImmer } from "jotai-immer";
import { DateTime, Duration } from "luxon";
import { Sun, SunQueryKeys, getNextExpectedSunrise, getNextMorningIntervalUpdate } from ".";
import { getDiffNow } from "./index";

export const seasonTimeAtom = atomWithImmer<Sun["seasonTime"]>(0);

export const seasonSunriseAtom = atomWithImmer<Sun["sunrise"]>({
  awaiting: false,
  next: getNextExpectedSunrise(),
});

export const seasonAtom = atomWithImmer<Sun["season"]>({
  current: 0,
  lastSopStart: 0,
  lastSopEnd: 0,
  rainStart: 0,
  raining: false,
  sunriseBlock: 0,
  abovePeg: false,
  start: 0,
  period: 0,
  timestamp: getNextExpectedSunrise(),
});

export const morningAtom = atomWithImmer<Sun["morning"]>({
  isMorning: false,
  blockNumber: 0,
  index: -1,
  next: getNextMorningIntervalUpdate(),
});

export const sunriseRemainingAtom = atom<Duration>(getNextExpectedSunrise().diffNow());

export const morningRemainingAtom = atom<Duration>(getNextMorningIntervalUpdate().diffNow());

export const morningDurationAtom = atom<Duration>(getNextExpectedSunrise().diffNow());

export const sunQueryKeysAtom = atomWithImmer<SunQueryKeys>({
  seasonTime: [],
  season: [],
});

export const sunQueryKeysAtomAtom = atom<QueryKey[]>((get) => {
  return Object.values(get(sunQueryKeysAtom));
});
