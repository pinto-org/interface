import { TV } from "@/classes/TokenValue";
import { diamondABI } from "@/constants/abi/diamondABI";
import { PODS } from "@/constants/internalTokens";
import { defaultQuerySettings } from "@/constants/query";
import { subgraphs } from "@/constants/subgraph";
import { FieldIssuedSoilDocument } from "@/generated/gql/pintostalk/graphql";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import useUpdateQueryKeys from "@/state/query/useUpdateQueryKeys";
import { useInvalidateField } from "@/state/useFieldData";
import { useSeason } from "@/state/useSunData";
import { exists, isDev } from "@/utils/utils";
import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect, useRef } from "react";
import { useChainId, useReadContract, useReadContracts } from "wagmi";
import { getMorningTemperature } from ".";
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
    abi: soilABI,
    functionName: "totalSoil",
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
      return request(subgraphs[chainId].beanstalk, FieldIssuedSoilDocument, {
        season: season,
        field_contains_nocase: diamond,
      });
    },
    enabled: !!season && season > 0,
    staleTime: Infinity,
  });

  useUpdateQueryKeys(fieldQueryKeysAtom, _queryKey, "initialSoil");

  // biome-ignore lint/correctness/useExhaustiveDependencies:
  useEffect(() => {
    if (!exists(query?.data)) return;

    console.debug("[protocol/field/useUpdateInitialSoil]: data", query.data);

    setInitialSoil((prev) => {
      const newSoil = TV.fromBlockchain(query.data.fieldHourlySnapshots[0]?.issuedSoil || 0, SOIL_DECIMALS);
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
      { address: diamond, abi: temperatureABI, functionName: "maxTemperature" },
      { address: diamond, abi: temperatureABI, functionName: "temperature" },
    ],
    allowFailure: false,
    scopeKey: "field",
    query: defaultQuerySettings,
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
      temp,
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

// ---------------------------------------- ABI ----------------------------------------

const soilABI = [
  {
    inputs: [],
    name: "totalSoil",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "initialSoil",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
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

const FIELD_REFRESH_MS = 1000 * 6;

/**
 * Update the soil every 2 seconds during the morning. 6 seconds on dev.
 */
export const useUpdateMorningSoilOnInterval = () => {
  const morning = useAtomValue(morningAtom);
  const soil = useAtomValue(fieldTotalSoilAtom).totalSoil;
  const invalidateField = useInvalidateField();
  const devMode = useAtomValue(morningFieldDevModeAtom);
  const intervalRef = useRef<boolean | null>(null);

  const isMorning = morning.isMorning;
  const noSoil = soil.lte(0);

  useEffect(() => {
    if (intervalRef.current || !!devMode.freeze) return;
    // update the soil every 2 seconds
    if (!isMorning || noSoil) return;

    intervalRef.current = true;
    const soilUpdateInterval = setInterval(() => {
      invalidateField("soil");
    }, FIELD_REFRESH_MS);

    return () => {
      clearInterval(soilUpdateInterval);
      intervalRef.current = null;
    };
  }, [invalidateField, isMorning, noSoil, devMode.freeze]);
};

export const useUpdateMorningTemperatureOnInterval = () => {
  const morning = useAtomValue(morningAtom);
  const devMode = useAtomValue(morningFieldDevModeAtom);
  const [temperature, setTemperature] = useAtom(fieldTemperatureAtom);

  const isMorning = morning.isMorning;
  const morningIndex = morning.index;

  const maxTemperature = temperature.max;

  useEffect(() => {
    const noTemperature = maxTemperature.lte(0);
    if (!isMorning || noTemperature || !!devMode.freeze) return;

    const current = isMorning ? getMorningTemperature(morningIndex, maxTemperature) : maxTemperature;

    setTemperature((draft) => {
      draft.scaled = current;
    });
  }, [isMorning, morningIndex, maxTemperature, setTemperature, devMode.freeze]);
};
