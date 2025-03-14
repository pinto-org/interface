import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { useMemo } from "react";
import { useReadContract } from "wagmi";

export interface EvaluationParameters {
  maxBeanMaxLpGpPerBdvRatio: bigint;
  minBeanMaxLpGpPerBdvRatio: bigint;
  targetSeasonsToCatchUp: bigint;
  podRateLowerBound: bigint;
  podRateOptimal: bigint;
  podRateUpperBound: bigint;
  deltaPodDemandLowerBound: bigint;
  deltaPodDemandUpperBound: bigint;
  lpToSupplyRatioUpperBound: bigint;
  lpToSupplyRatioOptimal: bigint;
  lpToSupplyRatioLowerBound: bigint;
  excessivePriceThreshold: bigint;
  soilCoefficientHigh: bigint;
  soilCoefficientLow: bigint;
  baseReward: bigint;
  minAvgGsPerBdv: bigint;
  rainingMinBeanMaxLpGpPerBdvRatio: bigint;
};

export const useDiamondEvalulationParameters = () => {
  const diamond = useProtocolAddress();

  const { data: queryData, ...query } = useReadContract({
    address: diamond,
    abi: abi,
    functionName: "getEvaluationParameters",
    args: [],
    query: {
      staleTime: Infinity,
      refetchIntervalInBackground: false,
    }
  });

  const data = queryData as EvaluationParameters | undefined;

  const getEvaluationParametersWithSeason = useMemo(() => {
    if (!data) return undefined;

    return (season: number): EvaluationParameters => {
      if (season < SEASON_2710) {
        return {
          ...data,
          ...seasonalDeploymentChanges[SEASON_2710]
        }
      }

      return data;
    }
  }, [data]);

  return {
    ...query,
    getEvaluationParametersWithSeason
  }
}

// ---------- Constants ----------

// PI-6 deployed at season 2710
const SEASON_2710 = 2710;

const seasonalDeploymentChanges: Record<number, Partial<EvaluationParameters>> = {
  [SEASON_2710]: {
    maxBeanMaxLpGpPerBdvRatio: BigInt(100e18)
  }
} as const;

// ---------- ABI ----------

const abi = [
  {
    inputs: [],
    name: "getEvaluationParameters",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "maxBeanMaxLpGpPerBdvRatio", type: "uint256" },
          { internalType: "uint256", name: "minBeanMaxLpGpPerBdvRatio", type: "uint256" },
          { internalType: "uint256", name: "targetSeasonsToCatchUp", type: "uint256" },
          { internalType: "uint256", name: "podRateLowerBound", type: "uint256" },
          { internalType: "uint256", name: "podRateOptimal", type: "uint256" },
          { internalType: "uint256", name: "podRateUpperBound", type: "uint256" },
          { internalType: "uint256", name: "deltaPodDemandLowerBound", type: "uint256" },
          { internalType: "uint256", name: "deltaPodDemandUpperBound", type: "uint256" },
          { internalType: "uint256", name: "lpToSupplyRatioUpperBound", type: "uint256" },
          { internalType: "uint256", name: "lpToSupplyRatioOptimal", type: "uint256" },
          { internalType: "uint256", name: "lpToSupplyRatioLowerBound", type: "uint256" },
          { internalType: "uint256", name: "excessivePriceThreshold", type: "uint256" },
          { internalType: "uint256", name: "soilCoefficientHigh", type: "uint256" },
          { internalType: "uint256", name: "soilCoefficientLow", type: "uint256" },
          { internalType: "uint256", name: "baseReward", type: "uint256" },
          { internalType: "uint128", name: "minAvgGsPerBdv", type: "uint128" },
          { internalType: "uint128", name: "rainingMinBeanMaxLpGpPerBdvRatio", type: "uint128" },
        ],
        internalType: "struct EvaluationParameters",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;