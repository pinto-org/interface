import { TV } from "@/classes/TokenValue";
import { diamondABI } from "@/constants/abi/diamondABI";
import { PODS } from "@/constants/internalTokens";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import useUpdateQueryKeys from "@/state/query/useUpdateQueryKeys";
import { QueryKey, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useCallback, useEffect } from "react";
import { useReadContract, useReadContracts } from "wagmi";
import { FieldQueryKeys } from ".";
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

const SOIL_UPDATE_INTERVAL = 4;

const FIELD_REFRESH_MS = 2000;

const useProtocolTemperatureQuery = () => {
  const diamond = useProtocolAddress();
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
  return query;
};

const useProtocolSoilQuery = () => {
  const diamond = useProtocolAddress();

  const query = useReadContract({
    address: diamond,
    abi: soilABI,
    functionName: "totalSoil",
    scopeKey: "field",
    query: settings.query,
  });

  useUpdateQueryKeys(fieldQueryKeysAtom, query.queryKey, "soil");

  return query;
};

const useProtocolFieldWeatherQuery = () => {
  const diamond = useProtocolAddress();

  const query = useReadContract({
    address: diamond,
    abi: diamondABI,
    functionName: "weather",
    scopeKey: "field",
  });

  useUpdateQueryKeys(fieldQueryKeysAtom, query.queryKey, "weather");

  return query;
};

/**
 * All field parameters except for temperature and soil.
 */
const useProtocolPodLineQuery = () => {
  const diamond = useProtocolAddress();
  const query = useReadContracts({
    contracts: [
      { address: diamond, abi: diamondABI, functionName: "harvestableIndex" },
      { address: diamond, abi: diamondABI, functionName: "podIndex" },
    ],
    scopeKey: "field",
    query: {
      ...settings.query,
      select: (data) => {
        const harvestableIndex = data[0].result;
        const podIndex = data[1].result;
        const podLine = podIndex && harvestableIndex ? podIndex - harvestableIndex : undefined;

        return { harvestableIndex, podIndex, podLine };
      },
    },
  });

  // duplicate the query key for podline and weather
  useUpdateQueryKeys(fieldQueryKeysAtom, query.queryKey, "podLine");

  return query;
};

const useUpdateMorningField = () => {
  const morning = useAtomValue(morningAtom);
  const soilQueryKey = useAtomValue(fieldQueryKeysAtom).soil;
  const qc = useQueryClient();

  // update the soil every 2 seconds
  useEffect(() => {
    if (!morning.isMorning) return;

    const soilUpdateInterval = setInterval(() => {
      const now = getNowRounded();

      const remaining = getDiffNow(morning.next, now).as("seconds");
      if (remaining % SOIL_UPDATE_INTERVAL === 0) {
        qc.invalidateQueries({ queryKey: soilQueryKey });
      }
    }, FIELD_REFRESH_MS);

    return () => {
      clearInterval(soilUpdateInterval);
    };
  }, [morning, morning.next, soilQueryKey, qc]);
};

export const useUpdateField = () => {
  const setTemperatures = useSetAtom(fieldTemperatureAtom);
  const setTotalSoil = useSetAtom(fieldTotalSoilAtom);
  const setPodLine = useSetAtom(fieldPodlineAtom);
  const setWeather = useSetAtom(fieldWeatherAtom);

  const temperatureQuery = useProtocolTemperatureQuery();
  const soilQuery = useProtocolSoilQuery();
  const podlineQuery = useProtocolPodLineQuery();
  const weatherQuery = useProtocolFieldWeatherQuery();

  useEffect(() => {
    if (!temperatureQuery?.data?.max || !temperatureQuery?.data?.scaled) return;

    setTemperatures({
      max: TV.fromBlockchain(temperatureQuery.data.max, TEMPERATURE_DECIMALS),
      scaled: TV.fromBlockchain(temperatureQuery.data.scaled, TEMPERATURE_DECIMALS),
    });
  }, [temperatureQuery.data, setTemperatures]);

  useEffect(() => {
    if (!soilQuery?.data) return;

    setTotalSoil({ totalSoil: TV.fromBlockchain(soilQuery.data, SOIL_DECIMALS) });
  }, [soilQuery.data, setTotalSoil]);

  useEffect(() => {
    if (!podlineQuery?.data?.harvestableIndex || !podlineQuery?.data?.podIndex || !podlineQuery?.data?.podLine) return;

    const harvestableIndex = podlineQuery.data.harvestableIndex;
    const podIndex = podlineQuery.data.podIndex;
    const podLine = podlineQuery.data.podLine;

    setPodLine({
      harvestableIndex: TV.fromBlockchain(harvestableIndex, PODS.decimals),
      podIndex: TV.fromBlockchain(podIndex, PODS.decimals),
      podLine: TV.fromBlockchain(podLine, PODS.decimals),
    });
  }, [podlineQuery.data, setPodLine]);

  useEffect(() => {
    if (!weatherQuery?.data) return;

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
  }, [weatherQuery.data, setWeather]);
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
