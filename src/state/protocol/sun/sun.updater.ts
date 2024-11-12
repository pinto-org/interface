import { useReadSeasonFacetView_SeasonTime, useReadSeasonFacetView_Time } from "@/generated/contractHooks";
import { exists } from "@/utils/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { DateTime } from "luxon";
import { useCallback, useEffect } from "react";
import { getNextExpectedSunrise } from ".";
import {
  seasonAtom,
  seasonQueryKeyAtom,
  seasonSunriseAtom,
  seasonTimeAtom,
  setAwaitingSunriseAtom,
  sunriseRemainingAtom,
} from "./sun.atoms";

const settings = {
  query: {
    staleTime: 1000 * 60 * 20, // 20 minutes, in milliseconds
    refetchInterval: 1000 * 60 * 20, // 20 minutes, in milliseconds
    refetchOnWindowFocus: true,
    refetchIntervalInBackground: false,
  },
};

const useFetchSun = () => {
  const [seasonData, setSeasonData] = useAtom(seasonAtom);
  const [seasonTime, setSeasonTime] = useAtom(seasonTimeAtom);
  const setSeasonQueryKey = useSetAtom(seasonQueryKeyAtom);

  const sunData = useReadSeasonFacetView_Time({
    query: settings.query,
  });

  const seasonTimeQuery = useReadSeasonFacetView_SeasonTime({
    query: settings.query,
  });

  useEffect(() => {
    if (!exists(seasonTimeQuery.data)) return;
    setSeasonTime(seasonTimeQuery.data);
  }, [seasonTimeQuery.data, setSeasonTime]);

  useEffect(() => {
    if (!sunData.data) return;
    const time = sunData.data;
    const data = {
      current: time.current,
      lastSopStart: time.lastSop,
      lastSopEnd: time.lastSopSeason,
      rainStart: time.rainStart,
      raining: time.raining,
      sunriseBlock: Number(time.sunriseBlock),
      abovePeg: time.abovePeg,
      start: time.start,
      period: time.period,
      timestamp: DateTime.fromSeconds(Number(time.timestamp)),
    };
    setSeasonData(data);
  }, [sunData.data, setSeasonData]);

  useEffect(() => {
    setSeasonQueryKey(sunData.queryKey);
  }, [sunData.queryKey, setSeasonQueryKey]);

  return { seasonData, seasonTime, refetch: sunData.refetch };
};

export const useInvalidateSunData = () => {
  const queryKey = useAtomValue(seasonQueryKeyAtom);
  const qc = useQueryClient();

  const invalidate = useCallback(() => {
    if (!queryKey.length) return;

    qc.invalidateQueries({ queryKey });
  }, [queryKey, qc]);

  return [invalidate] as const;
};

export const useSetRemainingUntilSunrise = () => {
  return useSetAtom(sunriseRemainingAtom);
};

export const useRemainingUntilSunrise = () => {
  return useAtomValue(sunriseRemainingAtom);
};

const useUpdateRemainingUntilSunrise = (next: DateTime, awaiting: boolean) => {
  // use atom here instead of updating the redux tree for performance reasons
  const setRemaining = useSetRemainingUntilSunrise();
  const setAwaitingSunrise = useSetAtom(setAwaitingSunriseAtom);

  useEffect(() => {
    if (awaiting === false) {
      const i = setInterval(() => {
        const remaining = next.diffNow();
        if (remaining.as("seconds") <= 0) {
          setAwaitingSunrise(true);
        } else {
          setRemaining(remaining);
        }
      }, 5000);
      return () => clearInterval(i);
    }
  }, [awaiting, next, setRemaining, setAwaitingSunrise]);

  return setRemaining;
};

export const useUpdateSunData = () => {
  const seasons = useFetchSun();
  const [seasonSunrise, setSeasonSunrise] = useAtom(seasonSunriseAtom);

  const awaiting = seasonSunrise.awaiting;
  const next = seasonSunrise.next;
  const season = seasons.seasonData.current;

  const setRemainingUntilSunrise = useUpdateRemainingUntilSunrise(next, awaiting);

  useEffect(() => {
    if (!awaiting) return;
    /// When awaiting sunrise, check every 3 seconds to see
    /// if the Season has incremented.
    const i = setInterval(() => {
      (async () => {
        const result = await seasons.refetch();
        if (result.data) {
          const newSeason = result.data.current;
          if (newSeason > season) {
            const _next = getNextExpectedSunrise();
            setSeasonSunrise({ awaiting: false, next: _next });
            setRemainingUntilSunrise(_next.diffNow());
          }
        }
      })();
    }, 3000);
    return () => clearInterval(i);
  }, [awaiting, season, setSeasonSunrise, setRemainingUntilSunrise, seasons.refetch]);
};
