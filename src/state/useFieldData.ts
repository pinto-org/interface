import { PODS } from "@/constants/internalTokens";
import {
  beanstalkAbi,
  beanstalkAddress,
} from "@/generated/contractHooks";
import { TokenValue } from "@/classes/TokenValue";
import { useChainId, useReadContracts } from "wagmi";

const settings = {
  query: {
    staleTime: 1000 * 60 * 2,
    refetchInterval: 1000 * 60 * 3, // 3 minutes, in milliseconds
  },
};

export function useFieldData() {

  const chainId = useChainId();
  const protocolAddress = beanstalkAddress[chainId as keyof typeof beanstalkAddress];
  const contract = {
    address: protocolAddress,
    abi: beanstalkAbi
  };

  const calls = useReadContracts({
    contracts: [
      {
        ...contract,
        functionName: 'harvestableIndex',
        args: [0n]
      },
      {
        ...contract,
        functionName: 'podIndex',
        args: [0n]
      },
      {
        ...contract,
        functionName: 'totalSoil'
      },
      {
        ...contract,
        functionName: 'weather'
      },
      {
        ...contract,
        functionName: 'temperature'
      },
      {
        ...contract,
        functionName: 'maxTemperature'
      }
    ],
    ...settings
  });

  const harvestableIndex = calls.data ? calls.data[0].result : 0n;
  const podIndex = calls.data ? calls.data[1].result : 0n;
  const totalSoil = calls.data ? calls.data[2].result : 0n;
  const weather = calls.data ? calls.data[3].result : undefined;
  const maxTemperature = calls.data ? calls.data[4].result : 0n;
  const temperature = calls.data ? calls.data[5].result : 0n;


  return {
    harvestableIndex: TokenValue.fromBlockchain(harvestableIndex || 0n, PODS.decimals),
    podIndex: TokenValue.fromBlockchain(podIndex || 0n, PODS.decimals),
    podLine: TokenValue.fromBlockchain((podIndex || 0n) - (harvestableIndex || 0n), PODS.decimals),
    soil: TokenValue.fromBlockchain(totalSoil || 0n, PODS.decimals),
    weather: {
      lastDeltaSoil: TokenValue.fromBlockchain(weather ? weather.lastDeltaSoil : 0n, 0),
      lastSowTime: weather ? weather.lastSowTime : 0,
      thisSowTime: weather ? weather.thisSowTime : 0,
      temp: weather ? weather.temp : 0,
    },
    temperature: {
      max: TokenValue.fromBlockchain(maxTemperature || 0n, PODS.decimals),
      scaled: TokenValue.fromBlockchain(temperature || 0n, PODS.decimals),
    },
    queryKeys: calls.queryKey
  };
}
