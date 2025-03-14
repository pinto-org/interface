import { INTERVALS_PER_MORNING } from "@/constants/morning";
import { useReadSeasonFacetView_SeasonTime } from "@/generated/contractHooks";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import useUpdateQueryKeys from "@/state/query/useUpdateQueryKeys";
import useCalculateTemperature from "@/state/useCalculateTemperature";
import { useMorning, useSunData } from "@/state/useSunData";
import { exists, isDev } from "@/utils/utils";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { DateTime } from "luxon";
import { useCallback, useEffect, useState } from "react";
import { useChainId, useReadContract } from "wagmi";
import { getDiffNow, getMorningResult, getNextExpectedSunrise, getNowRounded } from ".";
import { fieldTemperatureAtom, morningFieldDevModeAtom } from "../field/field.atoms";
import { useTemperatureQuery } from "../field/field.updater";
import {
  morningAtom,
  morningDurationAtom,
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
  const chainId = useChainId();
  const diamond = useProtocolAddress();

  const seasonQuery = useReadContract({
    address: diamond,
    abi: chainId === 42161 ? arbTimeAbi : timeAbi,
    functionName: "time",
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

    console.debug("[protocol/sun/useFetchSun]: seasonTime", seasonTimeQuery.data);

    setSeasonTime(seasonTimeQuery.data);
  }, [seasonTimeQuery.data, setSeasonTime]);

  const refetch = useCallback(async () => {
    const datas = await Promise.all([seasonQuery.refetch(), seasonTimeQuery.refetch()]);

    return {
      season: datas[0].data,
      seasonTime: datas[1].data,
    };
  }, [seasonQuery.refetch, seasonTimeQuery.refetch]);

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

    console.debug("[protocol/sun/useFetchSun]: season", season);
    console.debug("[protocol/sun/useFetchSun]: morningResult", morningResult);

    setMorningRemaining(morningResult.remaining);

    setSeasonData(season);
  }, [seasonQuery.data, setSeasonData, setMorningResult, setMorningRemaining]);

  return { seasonData, seasonTime, refetch: refetch };
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
  console.log("UPDATE SUN");
  const seasons = useFetchSun();
  const [seasonSunrise, setSeasonSunrise] = useAtom(seasonSunriseAtom);
  const [cachedSeason, setCachedSeason] = useState<number>(0);

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
    if (!awaiting || isDev()) return;
    /// When awaiting sunrise, check every 3 seconds to see
    /// if the Season has incremented.
    const i = setInterval(() => {
      (async () => {
        const result = await seasons.refetch();
        await temperatureQuery.refetch();
        if (!cachedSeason || (result?.season && result.season.current > cachedSeason)) {
          const _next = getNextExpectedSunrise();
          setSeasonSunrise({ awaiting: false, next: _next });
          setRemainingUntilSunrise(_next.diffNow());
        }
      })();
    }, 3000);
    return () => clearInterval(i);
  }, [awaiting, setSeasonSunrise, setRemainingUntilSunrise, seasons.refetch, cachedSeason, temperatureQuery.refetch]);
};

export function useUpdateMorning() {
  console.log("UPDATE MORNING");
  const setRemaining = useSetAtom(morningRemainingAtom);
  const setDuration = useSetAtom(morningDurationAtom);
  const setScaledTemperature = useSetAtom(fieldTemperatureAtom);
  const setMorning = useSetAtom(morningAtom);
  const devMode = useAtomValue(morningFieldDevModeAtom);

  const morning = useMorning();
  const season = useSunData();
  const nextMorningInterval = morning.next;
  const morningIndex = morning.index;
  const isMorning = morning.isMorning;

  const { calculate: calculateTemperature } = useCalculateTemperature();

  useEffect(() => {
    if (!isMorning || devMode.freeze) return;
    const { sunriseBlock, timestamp: sTimestamp } = season;

    const intervalId = setInterval(async () => {
      const now = getNowRounded();
      const _remaining = getDiffNow(nextMorningInterval, now);

      if (now.toSeconds() === nextMorningInterval.toSeconds() || _remaining.as("seconds") <= 0) {
        const morningResult = getMorningResult({
          timestamp: sTimestamp,
          blockNumber: sunriseBlock,
        });

        const scaledTemp = calculateTemperature(morningIndex + 1);

        console.debug("[protocol/sun/useUpdateMorning]: morningResult", {
          temp: scaledTemp.toNumber(),
          blockNumber: morningResult.blockNumber,
          index: morningResult.index,
          isMorning: morningResult.isMorning,
        });

        /// If we are transitioning out of the morning state, refetch the max Temperature from the subgraph.
        /// This is to make sure that when transitioning out of the morning state, the max Temperature chart
        /// shows the maxTemperature for the current season, not the previous season.
        if (!morningResult.isMorning && morningResult.index === INTERVALS_PER_MORNING) {
          // triggerQuery(); // todo here...
        }

        setScaledTemperature((draft) => {
          draft.scaled = scaledTemp;
        });
        setMorning((draft) => {
          draft.blockNumber = morningResult.blockNumber;
          draft.index = morningResult.index;
          draft.next = morningResult.next;
          draft.isMorning = morningResult.isMorning;
        });
        // update the time remaining for the next interval
        setRemaining(morningResult.remaining);
        // update the duration of the morning. We update this as well to keep the timers in sync.
        setDuration(sTimestamp.diff(getNowRounded()));
      } else {
        setRemaining(_remaining);
        setDuration(sTimestamp.diff(getNowRounded()));
      }
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [
    isMorning,
    morningIndex,
    season,
    nextMorningInterval,
    devMode.freeze,
    calculateTemperature,
    setRemaining,
    setScaledTemperature,
    setMorning,
    setDuration,
  ]);
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

const timeAbi = [
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
          { internalType: "uint64", name: "sunriseBlock", type: "uint64" },
          { internalType: "bool", name: "abovePeg", type: "bool" },
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
