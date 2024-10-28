import { PODS } from "@/constants/internalTokens";
import { beanstalkAbi, beanstalkAddress } from "@/generated/contractHooks";
import { TokenValue } from "@/classes/TokenValue";
import { useChainId, useReadContracts } from "wagmi";
import { QueryKey } from "@tanstack/react-query";
import { useMemo } from "react";

export interface FieldData {
  harvestableIndex: TokenValue;
  podIndex: TokenValue;
  podLine: TokenValue;
  soil: TokenValue;
  weather: {
    lastDeltaSoil: TokenValue;
    lastSowTime: number;
    thisSowTime: number;
    temp: number;
  };
  temperature: {
    max: TokenValue;
    scaled: TokenValue;
  };
  queryKeys: QueryKey;
}

const settings = {
  query: {
    staleTime: 1000 * 60 * 2,
    refetchInterval: 1000 * 60 * 3, // 3 minutes, in milliseconds
  },
};

const defaultData: FieldData = {
  harvestableIndex: TokenValue.ZERO,
  podIndex: TokenValue.ZERO,
  podLine: TokenValue.ZERO,
  soil: TokenValue.ZERO,
  weather: {
    lastDeltaSoil: TokenValue.ZERO,
    lastSowTime: 0,
    thisSowTime: 0,
    temp: 0,
  },
  temperature: {
    max: TokenValue.ZERO,
    scaled: TokenValue.ZERO,
  },
  queryKeys: [],
};

export function useFieldData() {
  const chainId = useChainId();
  const protocolAddress = beanstalkAddress[chainId as keyof typeof beanstalkAddress];
  const contract = {
    address: protocolAddress,
    abi: beanstalkAbi,
  };

  const calls = useReadContracts({
    contracts: [
      {
        ...contract,
        functionName: "harvestableIndex",
        args: [0n],
      },
      {
        ...contract,
        functionName: "podIndex",
        args: [0n],
      },
      {
        ...contract,
        functionName: "totalSoil",
      },
      {
        ...contract,
        functionName: "weather",
      },
      {
        ...contract,
        functionName: "temperature",
      },
      {
        ...contract,
        functionName: "maxTemperature",
      },
    ],
    query: {
      ...settings.query,
      select: (data) => {
        const harvestableIndex = data[0].result ? data[0].result : 0n;
        const podIndex = data[1].result ? data[1].result : 0n;
        const totalSoil = data[2].result ? data[2].result : 0n;
        const weather = data[3].result ? data[3].result : undefined;
        const maxTemperature = data[4].result ? data[4].result : 0n;
        const temperature = data[5].result ? data[5].result : 0n;

        return {
          harvestableIndex: TokenValue.fromBlockchain(harvestableIndex, PODS.decimals),
          podIndex: TokenValue.fromBlockchain(podIndex, PODS.decimals),
          podLine: TokenValue.fromBlockchain(podIndex - harvestableIndex, PODS.decimals),
          soil: TokenValue.fromBlockchain(totalSoil, PODS.decimals),
          weather: {
            lastDeltaSoil: TokenValue.fromBlockchain(weather?.lastDeltaSoil || 0n, 0),
            lastSowTime: weather?.lastSowTime || 0,
            thisSowTime: weather?.thisSowTime || 0,
            temp: weather?.temp || 0,
          },
          temperature: {
            max: TokenValue.fromBlockchain(maxTemperature, PODS.decimals),
            scaled: TokenValue.fromBlockchain(temperature, PODS.decimals),
          },
          queryKeys: calls.queryKey,
        };
      },
    },
  });

  return useMemo(() => calls.data ?? defaultData, [calls.data]);
}
