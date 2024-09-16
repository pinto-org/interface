import { PODS } from "@/constants/internalTokens";
import {
  useReadBeanstalk_HarvestableIndex,
  useReadBeanstalk_MaxTemperature,
  useReadBeanstalk_PodIndex,
  useReadBeanstalk_Temperature,
  useReadBeanstalk_TotalSoil,
  useReadBeanstalk_Weather,
} from "@/generated/contractHooks";
import { TokenValue } from "@/classes/TokenValue";

const settings = {
  query: {
    staleTime: 1000 * 60 * 2,
    refetchInterval: 1000 * 60 * 3, // 3 minutes, in milliseconds
  },
};

export function useFieldData() {
  const harvestableIndex = useReadBeanstalk_HarvestableIndex(settings);
  const podIndex = useReadBeanstalk_PodIndex(settings);
  const totalSoil = useReadBeanstalk_TotalSoil(settings);
  const weather = useReadBeanstalk_Weather(settings);
  const temperature = useReadBeanstalk_Temperature(settings);
  const maxTemperature = useReadBeanstalk_MaxTemperature(settings);

  return {
    harvestableIndex: TokenValue.fromBlockchain(harvestableIndex.data || 0n, PODS.decimals),
    podIndex: TokenValue.fromBlockchain(podIndex.data || 0n, PODS.decimals),
    podLine: TokenValue.fromBlockchain((podIndex.data || 0n) - (harvestableIndex.data || 0n), PODS.decimals),
    soil: TokenValue.fromBlockchain(totalSoil.data || 0n, PODS.decimals),
    weather: {
      lastDSoil: TokenValue.fromBlockchain(weather.data?.lastDSoil || 0n, 0),
      lastSowTime: TokenValue.fromBlockchain(weather.data?.lastSowTime || 0n, 0),
      thisSowTime: TokenValue.fromBlockchain(weather.data?.thisSowTime || 0n, 0),
      t: TokenValue.fromBlockchain(weather.data?.t || 0n, 0),
    },
    temperature: {
      max: TokenValue.fromBlockchain(maxTemperature.data || 0n, PODS.decimals),
      scaled: TokenValue.fromBlockchain(temperature.data || 0n, PODS.decimals),
    },
    queryKeys: [
      harvestableIndex.queryKey, 
      podIndex.queryKey,
      totalSoil.queryKey,
      weather.queryKey,
      temperature.queryKey,
      maxTemperature.queryKey
    ]
  };
}
