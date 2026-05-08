import { TV } from "@/classes/TokenValue";
import { diamondABI } from "@/constants/abi/diamondABI";
import { PODS } from "@/constants/internalTokens";
import { SG_FETCH_DISABLED, subgraphs } from "@/constants/subgraph";
import { FieldIssuedSoilDocument } from "@/generated/gql/pintostalk/graphql";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import useUpdateQueryKeys from "@/state/query/useUpdateQueryKeys";
import { useInvalidateField } from "@/state/useFieldData";
import { usePriceQuery } from "@/state/usePriceData";
import { useSeason } from "@/state/useSunData";
import { exists } from "@/utils/utils";
import { getChainWebSocketRpcUrl, getChainWithChainId } from "@/utils/wagmi/chains";
import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { createPublicClient, webSocket } from "viem";
import { useChainId, useReadContract, useReadContracts } from "wagmi";
import { morningAtom } from "../sun/sun.atoms";
import {
  fieldInitialSoilAtom,
  fieldPodlineAtom,
  fieldQueryKeysAtom,
  fieldTemperatureAtom,
  fieldTotalSoilAtom,
  fieldWeatherAtom,
  morningFieldDevModeAtom,
} from "./field.atoms";

const INTERVAL = 1000 * 60 * 20; // 20 minutes, in milliseconds
const MORNING_SOIL_REFRESH_INTERVAL = 1000 * 10; // 10 seconds, in milliseconds
const VALUE_TARGET = 1;

const settings = {
  query: {
    staleTime: INTERVAL, // 20 minutes, in milliseconds
    refetchInterval: INTERVAL, // 20 minutes, in milliseconds
    refetchOnWindowFocus: true,
    refetchIntervalInBackground: false,
  },
};

const TEMPERATURE_DECIMALS = 6;

const SOIL_DECIMALS = 6;

// ---------------------------------------- Podline ----------------------------------------
const useUpdatePodline = () => {
  const diamond = useProtocolAddress();
  const setPodLine = useSetAtom(fieldPodlineAtom);

  const query = useReadContracts({
    contracts: [
      { address: diamond, abi: diamondABI, functionName: "harvestableIndex", args: [0n] },
      { address: diamond, abi: diamondABI, functionName: "podIndex", args: [0n] },
    ],
    scopeKey: "field",
    query: settings.query,
  });

  useUpdateQueryKeys(fieldQueryKeysAtom, query.queryKey, "podLine");

  // biome-ignore lint/correctness/useExhaustiveDependencies:
  useEffect(() => {
    const data = query.data;
    if (!exists(data)) return;
    const harvestableIndex = data[0].result;
    const podIndex = data[1].result;
    const podLine = exists(podIndex) && exists(harvestableIndex) ? podIndex - harvestableIndex : undefined;

    console.debug("[protocol/field/useUpdatePodline]: data", {
      harvestableIndex,
      podIndex,
      podLine,
    });

    setPodLine({
      harvestableIndex: TV.fromBlockchain(harvestableIndex ?? 0n, PODS.decimals),
      podIndex: TV.fromBlockchain(podIndex ?? 0n, PODS.decimals),
      podLine: TV.fromBlockchain(podLine ?? 0n, PODS.decimals),
      isLoading: false,
    });
  }, [query.data]);

  return query;
};

// ---------------------------------------- Total Soil ----------------------------------------
const useUpdateTotalSoil = () => {
  const diamond = useProtocolAddress();
  const setTotalSoil = useSetAtom(fieldTotalSoilAtom);

  const query = useReadContract({
    address: diamond,
    abi: diamondABI,
    functionName: "totalSoil" as const,
    scopeKey: "field",
    query: settings.query,
  });

  useUpdateQueryKeys(fieldQueryKeysAtom, query.queryKey, "soil");

  // biome-ignore lint/correctness/useExhaustiveDependencies:
  useEffect(() => {
    if (!exists(query?.data)) return;

    console.debug("[protocol/field/useUpdateTotalSoil]: data", query.data);

    setTotalSoil((prev) => {
      const newSoil = TV.fromBlockchain(query.data as bigint, SOIL_DECIMALS);
      // return old value if it hasn't changed. Prevents new object reference of TokenValue.
      if (prev.totalSoil.eq(newSoil)) return prev;
      // otherwise, return the new value
      return {
        totalSoil: newSoil,
        isLoading: false,
      };
    });
  }, [query.data]);
};

const useUpdateInitialSoil = () => {
  const diamond = useProtocolAddress();
  const chainId = useChainId();
  const season = useSeason();
  const setInitialSoil = useSetAtom(fieldInitialSoilAtom);

  const _queryKey = ["initialSoil", season, chainId];

  const query = useQuery({
    queryKey: _queryKey,
    queryFn: async () => {
      const result = await request(subgraphs[chainId].beanstalk, FieldIssuedSoilDocument, {
        season: season,
        field_contains_nocase: diamond,
      });
      return result;
    },
    enabled: !!season && season > 0 && !SG_FETCH_DISABLED,
    ...settings.query,
  });

  useUpdateQueryKeys(fieldQueryKeysAtom, _queryKey, "initialSoil");

  // biome-ignore lint/correctness/useExhaustiveDependencies:
  useEffect(() => {
    if (!exists(query?.data)) {
      return;
    }

    setInitialSoil((prev) => {
      const rawIssuedSoil = query.data.fieldHourlySnapshots[0]?.issuedSoil || 0;
      const newSoil = TV.fromBlockchain(rawIssuedSoil, SOIL_DECIMALS);

      // return old value if it hasn't changed. Prevents new object reference of TokenValue.
      if (prev.initialSoil.eq(newSoil)) return prev;
      // otherwise, return the new value
      return {
        initialSoil: newSoil,
        isLoading: false,
      };
    });
  }, [query.data]);
};

export const useTemperatureQuery = () => {
  const diamond = useProtocolAddress();

  return useReadContracts({
    contracts: [
      { address: diamond, abi: diamondABI, functionName: "maxTemperature" as const },
      { address: diamond, abi: diamondABI, functionName: "temperature" as const },
    ],
    allowFailure: false,
    scopeKey: "field",
    ...settings.query,
  });
};

// ---------------------------------------- Temperature ----------------------------------------
const useUpdateTemperature = () => {
  const setTemperatures = useSetAtom(fieldTemperatureAtom);

  const query = useTemperatureQuery();

  useUpdateQueryKeys(fieldQueryKeysAtom, query.queryKey, "temperature");

  // biome-ignore lint/correctness/useExhaustiveDependencies:
  useEffect(() => {
    const max = query?.data?.[0];
    const scaled = query?.data?.[1];

    if (!exists(max) || !exists(scaled)) return;

    console.debug("[protocol/field/useUpdateTemperature]: data", {
      max,
      scaled,
    });

    setTemperatures({
      max: TV.fromBigInt(max, TEMPERATURE_DECIMALS),
      scaled: TV.fromBigInt(scaled, TEMPERATURE_DECIMALS),
      isLoading: false,
    });
  }, [query.data]);
};

// ---------------------------------------- Weather ----------------------------------------
const useUpdateWeather = () => {
  const diamond = useProtocolAddress();
  const setWeather = useSetAtom(fieldWeatherAtom);

  const weatherQuery = useReadContract({
    address: diamond,
    abi: diamondABI,
    functionName: "weather",
    scopeKey: "field",
    query: settings.query,
  });

  useUpdateQueryKeys(fieldQueryKeysAtom, weatherQuery.queryKey, "weather");

  // biome-ignore lint/correctness/useExhaustiveDependencies:
  useEffect(() => {
    if (!exists(weatherQuery?.data)) return;

    console.debug("[protocol/field/useUpdateWeather]: data", weatherQuery.data);

    const lastDeltaSoil = weatherQuery.data.lastDeltaSoil;
    const lastSowTime = weatherQuery.data.lastSowTime;
    const thisSowTime = weatherQuery.data.thisSowTime;
    const temp = weatherQuery.data.temp;

    setWeather({
      lastDeltaSoil: TV.fromBlockchain(lastDeltaSoil, SOIL_DECIMALS),
      lastSowTime,
      thisSowTime,
      temp: TV.fromBigInt(temp, TEMPERATURE_DECIMALS).toNumber(),
      isLoading: false,
    });
  }, [weatherQuery.data]);
};

// ---------------------------------------- Field ----------------------------------------
export const useUpdateField = () => {
  useUpdateTemperature();
  useUpdatePodline();
  useUpdateWeather();
  useUpdateTotalSoil();
  useUpdateInitialSoil();
};

// ---------------------------------------- Non Top level updater hooks ----------------------------------------

/**
 * Keep morning soil fresh while below peg.
 */
export const useUpdateMorningSoilOnInterval = () => {
  const diamond = useProtocolAddress();
  const chainId = useChainId();
  const morning = useAtomValue(morningAtom);
  const soil = useAtomValue(fieldTotalSoilAtom).totalSoil;

  const invalidateField = useInvalidateField();
  const devMode = useAtomValue(morningFieldDevModeAtom);
  const priceQuery = usePriceQuery();
  const [usePollingFallback, setUsePollingFallback] = useState(false);

  const isMorning = morning.isMorning;
  const hasSoil = soil.gt(0);
  const isBelowPeg =
    exists(priceQuery.data) && TV.fromBlockchain(priceQuery.data.price, SOIL_DECIMALS).lt(VALUE_TARGET);
  const shouldRefreshMorningSoil = isMorning && isBelowPeg && hasSoil && !devMode.freeze;
  const webSocketRpcUrl = getChainWebSocketRpcUrl(chainId);

  useEffect(() => {
    setUsePollingFallback(false);

    if (!shouldRefreshMorningSoil || !webSocketRpcUrl) return;

    const chain = getChainWithChainId(chainId);
    if (!chain) return;

    const client = createPublicClient({
      chain,
      transport: webSocket(webSocketRpcUrl),
    });

    const unwatch = client.watchContractEvent({
      address: diamond,
      abi: diamondABI,
      eventName: "Sow",
      onLogs: () => invalidateField("soil"),
      onError: (error) => {
        console.warn("[protocol/field/useUpdateMorningSoilOnInterval]: Sow event websocket failed", error);
        setUsePollingFallback(true);
      },
    });

    return () => unwatch();
  }, [chainId, diamond, invalidateField, shouldRefreshMorningSoil, webSocketRpcUrl]);

  useEffect(() => {
    if (!shouldRefreshMorningSoil || (webSocketRpcUrl && !usePollingFallback)) return;

    const refreshSoil = () => {
      if (typeof document !== "undefined" && document.visibilityState === "hidden") return;
      invalidateField("soil");
    };

    const intervalId = window.setInterval(refreshSoil, MORNING_SOIL_REFRESH_INTERVAL);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refreshSoil();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [invalidateField, shouldRefreshMorningSoil, usePollingFallback, webSocketRpcUrl]);
};
