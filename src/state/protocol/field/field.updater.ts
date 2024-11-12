import { TV } from "@/classes/TokenValue";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { QueryKey } from "@tanstack/react-query";
import { useAtom, useSetAtom } from "jotai";
import { useCallback, useEffect } from "react";
import { useReadContract, useReadContracts } from "wagmi";
import { FieldQueryKeys } from ".";
import { fieldQueryKeysAtom, soilAtom, temperatureAtom } from "./field.atoms";

const settings = {
  query: {
    staleTime: 1000 * 60 * 20, // 20 minutes, in milliseconds
    refetchInterval: 1000 * 60 * 20, // 20 minutes, in milliseconds
    refetchOnWindowFocus: true,
    refetchIntervalInBackground: false,
  },
};

const TEMPERATURE_DECIMALS = 6;

const SOIL_DECIMALS = 6;

const useSetFieldQueryKey = () => {
  const setFieldQueryKeys = useSetAtom(fieldQueryKeysAtom);

  return useCallback(
    (key: keyof FieldQueryKeys, queryKey: QueryKey) => {
      setFieldQueryKeys((prev) => ({
        ...prev,
        [key]: queryKey,
      }));
    },
    [setFieldQueryKeys],
  );
};

const useUpdateTemperature = () => {
  const diamond = useProtocolAddress();
  const [temperatures, setTemperatures] = useAtom(temperatureAtom);
  const setFieldQueryKeys = useSetFieldQueryKey();

  const temperatureQuery = useReadContracts({
    contracts: [
      { address: diamond, abi: temperatureABI, functionName: "maxTemperature" },
      { address: diamond, abi: temperatureABI, functionName: "temperature" },
    ],
    query: {
      ...settings.query,
      select: (data) => {
        const max = data[0].result;
        const scaled = data[1].result;

        return { max, scaled };
      },
    },
  });

  useEffect(() => {
    const max = temperatureQuery.data?.max;
    const scaled = temperatureQuery.data?.scaled;

    if (max && scaled) {
      setTemperatures({
        max: TV.fromBlockchain(max, TEMPERATURE_DECIMALS),
        scaled: TV.fromBlockchain(scaled, TEMPERATURE_DECIMALS),
      });
    }
  }, [temperatureQuery.data, setTemperatures]);

  useEffect(() => {
    setFieldQueryKeys("temperature", temperatureQuery.queryKey);
  }, [temperatureQuery.queryKey, setFieldQueryKeys]);

  const refetch = useCallback(async () => {
    const response = await temperatureQuery.refetch();
    const max = response.data?.max;
    const scaled = response.data?.scaled;
    return { max, scaled };
  }, [temperatureQuery]);

  return {
    data: temperatures,
    refetch,
  };
};

const useUpdateSoil = () => {
  const diamond = useProtocolAddress();
  const [soil, setSoil] = useAtom(soilAtom);
  const setFieldQueryKeys = useSetFieldQueryKey();

  const soilQuery = useReadContract({
    address: diamond,
    abi: soilABI,
    functionName: "totalSoil",
    query: settings.query,
  });

  useEffect(() => {
    setFieldQueryKeys("soil", soilQuery.queryKey);
  }, [soilQuery.queryKey, setFieldQueryKeys]);

  useEffect(() => {
    const totalSoil = soilQuery.data;

    if (totalSoil) {
      setSoil(TV.fromBlockchain(totalSoil, SOIL_DECIMALS));
    }
  }, [soilQuery.data, setSoil]);

  return { soil, refetch: soilQuery.refetch };
};

export const useUpdateField = () => {
  useUpdateSoil();
  useUpdateTemperature();
};

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
