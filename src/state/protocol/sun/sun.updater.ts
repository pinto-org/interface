import { useReadSeasonFacetView_SeasonTime, useReadSeasonFacetView_Time } from "@/generated/contractHooks";
import useUpdateQueryKeys from "@/state/query/useUpdateQueryKeys";
import { exists } from "@/utils/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { DateTime } from "luxon";
import { useCallback, useEffect } from "react";
import { getMorningResult, getNextExpectedSunrise } from ".";
import {
  morningAtom,
  morningRemainingAtom,
  seasonAtom,
  seasonSunriseAtom,
  seasonTimeAtom,
  sunQueryKeysAtom,
  sunriseRemainingAtom,
} from "./sun.atoms";

const TWENTY_MINUTES = 1000 * 60 * 20;

const settings = {
  query: {
    staleTime: TWENTY_MINUTES,
    refetchInterval: TWENTY_MINUTES,
    refetchOnWindowFocus: true,
    refetchIntervalInBackground: false,
  },
};

const useFetchSun = () => {
  const [seasonData, setSeasonData] = useAtom(seasonAtom);
  const [seasonTime, setSeasonTime] = useAtom(seasonTimeAtom);
  const setMorningResult = useSetAtom(morningAtom);
  const setMorningRemaining = useSetAtom(morningRemainingAtom);

  const seasonQuery = useReadSeasonFacetView_Time({
    scopeKey: "season",
    query: settings.query,
  });

  const seasonTimeQuery = useReadSeasonFacetView_SeasonTime({
    scopeKey: "season",
    query: settings.query,
  });

  useUpdateQueryKeys(sunQueryKeysAtom, seasonQuery.queryKey, "season");
  useUpdateQueryKeys(sunQueryKeysAtom, seasonTimeQuery.queryKey, "seasonTime");

  useEffect(() => {
    if (!exists(seasonTimeQuery.data)) return;
    setSeasonTime(seasonTimeQuery.data);
  }, [seasonTimeQuery.data, setSeasonTime]);

  useEffect(() => {
    if (!seasonQuery.data) return;
    const time = seasonQuery.data;
    const season = {
      current: time.current,
      lastSopStart: time.lastSop,
      lastSopEnd: time.lastSopSeason,
      rainStart: time.rainStart,
      raining: time.raining,
      sunriseBlock: Number(time.sunriseBlock),
      abovePeg: time.abovePeg,
      start: Number(time.start),
      period: Number(time.period),
      timestamp: DateTime.fromSeconds(Number(time.timestamp)),
    };

    const morningResult = getMorningResult({
      blockNumber: season.sunriseBlock,
      timestamp: season.timestamp,
    });

    setMorningResult((draft) => {
      draft.blockNumber = morningResult.blockNumber;
      draft.index = morningResult.index;
      draft.next = morningResult.next;
      draft.isMorning = morningResult.isMorning;
    });

    setMorningRemaining(morningResult.remaining);

    setSeasonData(season);
  }, [seasonQuery.data, setSeasonData, setMorningResult, setMorningRemaining]);

  return { seasonData, seasonTime, refetch: seasonQuery.refetch };
};

export const useInvalidateSunData = () => {
  const queryKey = useAtomValue(sunQueryKeysAtom);
  const qc = useQueryClient();

  const invalidate = useCallback(() => {
    if (!queryKey.seasonTime.length || !queryKey.season.length) return;

    qc.invalidateQueries({ queryKey: queryKey.seasonTime });
    qc.invalidateQueries({ queryKey: queryKey.season });
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
  const setAwaitingSunrise = useSetAtom(seasonSunriseAtom);

  useEffect(() => {
    if (awaiting === false) {
      const i = setInterval(() => {
        const remaining = next.diffNow();
        if (remaining.as("seconds") <= 0) {
          setAwaitingSunrise((prev) => {
            prev.awaiting = true;
          });
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
