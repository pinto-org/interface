import { diamondABI } from "@/constants/abi/diamondABI";
import { QUERY_SETTINGS } from "@/constants/query";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { morningFieldDevModeAtom } from "@/state/protocol/field/field.atoms";
import { useTemperatureQuery } from "@/state/protocol/field/field.updater";
import useUpdateQueryKeys from "@/state/query/useUpdateQueryKeys";
import { useMorning, useSunData, useTimeOffset } from "@/state/useSunData";
import { arbitrumNetwork, localhostNetwork, tenderlyTestnetNetwork } from "@/utils/wagmi/chains";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { DateTime } from "luxon";
import { useCallback, useEffect, useState } from "react";
import { useChainId, useConfig, useReadContract } from "wagmi";
import { Sun, getIsMorning, getNextExpectedSunrise } from ".";
import {
  morningAtom,
  seasonAtom,
  seasonSunriseAtom,
  sunQueryKeysAtom,
  sunriseRemainingAtom,
  timeOffsetAtom,
} from "./sun.atoms";

const useFetchSun = () => {
  // Hooks
  const chainId = useChainId();
  const diamond = useProtocolAddress();

  // Atoms & Setters
  const [seasonData, setSeasonData] = useAtom(seasonAtom);
  const setTimeOffset = useSetAtom(timeOffsetAtom);
  const setMorning = useSetAtom(morningAtom);

  // Queries
  const seasonQuery = useReadContract({
    address: diamond,
    abi: chainId === arbitrumNetwork.id ? arbTimeAbi : diamondABI,
    functionName: "time",
    query: QUERY_SETTINGS.default,
  });

  // Update Query Keys
  useUpdateQueryKeys(sunQueryKeysAtom, seasonQuery.queryKey, "season");

  // Refetch Callback
  const refetch = useCallback(async () => {
    const data = await seasonQuery.refetch();
    return {
      season: data.data,
      seasonTime: undefined,
    };
  }, [seasonQuery]);

  // Update Season
  useEffect(() => {
    if (!seasonQuery.data) return;
    const time = seasonQuery.data;

    const season: Sun["season"] = {
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

    // Calculate time offset between local time and blockchain time
    // We use the season.timestamp (when season started) as a reference point
    // Since we know seasons start on the hour (e.g., 14:00:00), we can use that
    // to estimate the current blockchain time based on elapsed local time
    const localNow = DateTime.now();

    // Calculate how long ago the season started based on local time
    const localTimeSinceSeasonStart = localNow.diff(season.timestamp, "seconds").seconds;

    // If the season started more than an hour ago, something's wrong with data
    // In that case, assume minimal offset
    if (localTimeSinceSeasonStart < 0 || localTimeSinceSeasonStart > 3700) {
      // Data seems stale or clock is very wrong, use 0 offset
      // useUpdateMorning will correct it over time
      const timeOffsetMs = 0;
      const isMorning = getIsMorning(season.timestamp, timeOffsetMs);

      setTimeOffset(timeOffsetMs);
      setMorning({ isMorning });
      setSeasonData(season);

      console.debug("[protocol/sun/useFetchSun]: Using 0 offset (data validation failed)");
      console.debug("[protocol/sun/useFetchSun]: localTimeSinceSeasonStart", localTimeSinceSeasonStart);
      return;
    }

    // Estimate current blockchain time = season start + time elapsed on local clock
    // This assumes user's clock drift is small enough that elapsed time is roughly accurate
    const estimatedBlockchainNow = season.timestamp.plus({ seconds: localTimeSinceSeasonStart });
    const timeOffsetMs = localNow.toMillis() - estimatedBlockchainNow.toMillis();

    // Calculate if it's currently morning using the calculated offset
    const isMorning = getIsMorning(season.timestamp, timeOffsetMs);

    // Update atoms
    setTimeOffset(timeOffsetMs);
    setMorning({ isMorning });
    setSeasonData(season);

    console.debug("[protocol/sun/useFetchSun]: season", {
      season,
      localNow: localNow.toISO(),
      localTimeSinceSeasonStart,
      estimatedBlockchainNow: estimatedBlockchainNow.toISO(),
      timeOffsetMs,
      isMorning,
    });
  }, [seasonQuery.data, setSeasonData, setMorning, setTimeOffset]);

  return { seasonData, seasonTime: 0, refetch };
};

export const useSetRemainingUntilSunrise = () => {
  return useSetAtom(sunriseRemainingAtom);
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
      }, 1000);
      return () => clearInterval(i);
    }
  }, [awaiting, next, setRemaining, setAwaitingSunrise]);

  return setRemaining;
};

export const useUpdateSunData = () => {
  const seasons = useFetchSun();
  const [seasonSunrise, setSeasonSunrise] = useAtom(seasonSunriseAtom);
  const [cachedSeason, setCachedSeason] = useState<number>(0);
  const chainId = useChainId();

  const isDevChainId = chainId === localhostNetwork.id || chainId === tenderlyTestnetNetwork.id;

  const awaiting = seasonSunrise.awaiting;
  const next = seasonSunrise.next;

  const temperatureQuery = useTemperatureQuery();

  const setRemainingUntilSunrise = useUpdateRemainingUntilSunrise(next, awaiting);

  useEffect(() => {
    if (!cachedSeason && seasons.seasonData.current) {
      setCachedSeason(seasons.seasonData.current);
    }
  }, [seasons.seasonData.current, cachedSeason]);

  useEffect(() => {
    if (!awaiting || isDevChainId) return;
    /// When awaiting sunrise, check every 3 seconds to see
    /// if the Season has incremented.
    const i = setInterval(() => {
      (async () => {
        const result = await seasons.refetch();
        if (!cachedSeason || (result?.season && result.season.current > cachedSeason)) {
          // Refetch the temperature query to get the latest max temperature
          await temperatureQuery.refetch();
          const _next = getNextExpectedSunrise();
          setSeasonSunrise({ awaiting: false, next: _next });
          setRemainingUntilSunrise(_next.diffNow());
        }
      })();
    }, 3000);
    return () => clearInterval(i);
  }, [
    awaiting,
    isDevChainId,
    setSeasonSunrise,
    setRemainingUntilSunrise,
    seasons.refetch,
    cachedSeason,
    temperatureQuery.refetch,
  ]);
};

export function useUpdateMorning() {
  const setMorning = useSetAtom(morningAtom);
  const devMode = useAtomValue(morningFieldDevModeAtom);
  const timeOffsetMs = useTimeOffset();
  const season = useSunData();
  const morning = useMorning();

  const isMorning = morning.isMorning;

  useEffect(() => {
    if (devMode.freeze) return;

    // Only run the interval during morning to optimize performance
    if (!isMorning) return;

    const intervalId = setInterval(() => {
      // Recalculate if it's morning using blockchain-synchronized time
      const nowIsMorning = getIsMorning(season.timestamp, timeOffsetMs);

      // Update morning state if it changed (morning ended)
      if (nowIsMorning !== isMorning) {
        setMorning({ isMorning: nowIsMorning });
        console.debug("[protocol/sun/useUpdateMorning]: morning ended", {
          isMorning: nowIsMorning,
        });
      }
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [isMorning, season.timestamp, timeOffsetMs, devMode.freeze, setMorning]);
}

const arbTimeAbi = [
  {
    inputs: [],
    name: "time",
    outputs: [
      {
        components: [
          { internalType: "uint32", name: "current", type: "uint32" },
          { internalType: "uint32", name: "lastSop", type: "uint32" },
          { internalType: "uint32", name: "lastSopSeason", type: "uint32" },
          { internalType: "uint32", name: "rainStart", type: "uint32" },
          { internalType: "bool", name: "raining", type: "bool" },
          { internalType: "bool", name: "fertilizing", type: "bool" },
          { internalType: "uint64", name: "sunriseBlock", type: "uint64" },
          { internalType: "bool", name: "abovePeg", type: "bool" },
          { internalType: "uint16", name: "stemStartSeason", type: "uint16" },
          { internalType: "uint16", name: "stemScaleSeason", type: "uint16" },
          { internalType: "uint256", name: "start", type: "uint256" },
          { internalType: "uint256", name: "period", type: "uint256" },
          { internalType: "uint256", name: "timestamp", type: "uint256" },
          { internalType: "bytes32[8]", name: "_buffer", type: "bytes32[8]" },
        ],
        internalType: "struct Season",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;
