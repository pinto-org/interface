import { TV } from "@/classes/TokenValue";
import { diamondABI } from "@/constants/abi/diamondABI";
import { PODS } from "@/constants/internalTokens";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import useUpdateQueryKeys from "@/state/query/useUpdateQueryKeys";
import { useInvalidateField } from "@/state/useFieldData";
import { exists } from "@/utils/utils";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import { useReadContract, useReadContracts } from "wagmi";
import { getDiffNow, getNowRounded } from "../sun";
import { morningAtom } from "../sun/sun.atoms";
import {
  fieldPodlineAtom,
  fieldQueryKeysAtom,
  fieldTemperatureAtom,
  fieldTotalSoilAtom,
  fieldWeatherAtom,
} from "./field.atoms";

const FIVE_MINS = 1000 * 60 * 5; // 20 minutes, in milliseconds

const settings = {
  query: {
    staleTime: FIVE_MINS, // 20 minutes, in milliseconds
    refetchInterval: FIVE_MINS, // 20 minutes, in milliseconds
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

    console.log("[protocol/field/useUpdatePodline]: data", {
      harvestableIndex,
      podIndex,
      podLine,
    });

    setPodLine({
      harvestableIndex: TV.fromBlockchain(harvestableIndex ?? 0n, PODS.decimals),
      podIndex: TV.fromBlockchain(podIndex ?? 0n, PODS.decimals),
      podLine: TV.fromBlockchain(podLine ?? 0n, PODS.decimals),
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
    abi: soilABI,
    functionName: "totalSoil",
    scopeKey: "field",
    query: settings.query,
  });

  useUpdateQueryKeys(fieldQueryKeysAtom, query.queryKey, "soil");

  // biome-ignore lint/correctness/useExhaustiveDependencies:
  useEffect(() => {
    if (!exists(query?.data)) return;

    console.log("[protocol/field/useUpdateTotalSoil]: data", query.data);

    setTotalSoil(TV.fromBlockchain(query.data, SOIL_DECIMALS));
  }, [query.data]);
};

// ---------------------------------------- Temperature ----------------------------------------
const useUpdateTemperature = () => {
  const diamond = useProtocolAddress();
  const setTemperatures = useSetAtom(fieldTemperatureAtom);

  const query = useReadContracts({
    contracts: [
      { address: diamond, abi: temperatureABI, functionName: "maxTemperature" },
      { address: diamond, abi: temperatureABI, functionName: "temperature" },
    ],
    scopeKey: "field",
    query: {
      ...settings.query,
      select: (data) => {
        const max = data[0].result;
        const scaled = data[1].result;

        return { max, scaled };
      },
    },
  });

  useUpdateQueryKeys(fieldQueryKeysAtom, query.queryKey, "temperature");

  // biome-ignore lint/correctness/useExhaustiveDependencies:
  useEffect(() => {
    if (!exists(query?.data?.max) || !exists(query?.data?.scaled)) return;

    console.log("[protocol/field/useUpdateTemperature]: data", {
      max: query.data.max,
      scaled: query.data.scaled,
    });

    setTemperatures({
      max: TV.fromBlockchain(query.data.max, TEMPERATURE_DECIMALS),
      scaled: TV.fromBlockchain(query.data.scaled, TEMPERATURE_DECIMALS),
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

    console.log("[protocol/field/useUpdateWeather]: data", weatherQuery.data);

    const lastDeltaSoil = weatherQuery.data.lastDeltaSoil;
    const lastSowTime = weatherQuery.data.lastSowTime;
    const thisSowTime = weatherQuery.data.thisSowTime;
    const temp = weatherQuery.data.temp;

    setWeather({
      lastDeltaSoil: TV.fromBlockchain(lastDeltaSoil, SOIL_DECIMALS),
      lastSowTime,
      thisSowTime,
      temp,
    });
  }, [weatherQuery.data]);
};

// ---------------------------------------- Field ----------------------------------------
export const useUpdateField = () => {
  useUpdateTemperature();
  useUpdatePodline();
  useUpdateWeather();
  useUpdateTotalSoil();
};

// ---------------------------------------- ABI ----------------------------------------

const soilABI = [
  {
    inputs: [],
    name: "totalSoil",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

const temperatureABI = [
  {
    inputs: [],
    name: "maxTemperature",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "temperature",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

// ---------------------------------------- Non Top level updater hooks ----------------------------------------

const SOIL_UPDATE_INTERVAL = 4;

const FIELD_REFRESH_MS = 2000;

export const useUpdateMorningSoilOnInterval = () => {
  const morning = useAtomValue(morningAtom);
  const soil = useAtomValue(fieldTotalSoilAtom);
  const invalidateField = useInvalidateField();

  const isMorning = morning.isMorning;
  const noSoil = soil.lte(0);
  const nextMorningInterval = morning.next;

  useEffect(() => {
    // update the soil every 2 seconds
    if (!isMorning || noSoil) return;

    console.log("[protocol/field/useUpdateMorningField]: morning: refreshing soil on interval");

    const soilUpdateInterval = setInterval(() => {
      const now = getNowRounded();

      const remaining = getDiffNow(nextMorningInterval, now).as("seconds");
      if (remaining % SOIL_UPDATE_INTERVAL === 0) {
        invalidateField("soil");
      }
    }, FIELD_REFRESH_MS);

    return () => {
      clearInterval(soilUpdateInterval);
    };
  }, [invalidateField, isMorning, noSoil, nextMorningInterval]);
};

export const useUpdateMorningTemperatureOnInterval = () => {
  const morning = useAtomValue(morningAtom);
  const temperature = useAtomValue(fieldTemperatureAtom);
  const invalidateField = useInvalidateField();

  const isMorning = morning.isMorning;
  const noTemperature = temperature.max.lte(0);
};
