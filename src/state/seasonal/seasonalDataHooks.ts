import { Token, UseSeasonalResult } from "@/utils/types";
import useSeasonalBeanBeanSG from "./queries/useSeasonalBeanBeanSG";
import useSeasonalBeanstalkSiloSG from "./queries/useSeasonalBeanstalkSiloSG";
import useSeasonalFarmerSG from "./queries/useSeasonalFarmerSG";
import { PODS, STALK } from "@/constants/internalTokens";
import { TV } from "@/classes/TokenValue";
import { MAIN_TOKEN, PINTO, S_MAIN_TOKEN } from "@/constants/tokens";
import useSeasonalBeanSeasonSG from "./queries/useSeasonalBeanSeasonSG";
import useSeasonalBeanstalkFieldSG from "./queries/useSeasonalBeanstalkFieldSG";
import useSeasonalBeanstalkWrappedDepositsSG from "./queries/useSeasonalBeanstalkWrappedDepositsSG";
import { useChainConstant } from "@/utils/chain";
import { SiloHourlySnapshot } from "@/generated/gql/graphql";
import { HashString } from "@/utils/types.generic";
import useSeasonalFarmerSiloAssetTokenSG from "./queries/useSeasonalFarmerSiloAssetTokenSG";
import { useAccount } from "wagmi";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { useMemo } from "react";
import { mergeUseSeasonalQueriesResults } from "./utils";

/** ==================== Bean BeanHourlySnapshot ==================== **/

export function useSeasonalPrice(fromSeason: number, toSeason: number): UseSeasonalResult {
  return useSeasonalBeanBeanSG(fromSeason, toSeason, (beanHourly, _timestamp) => ({
    season: Number(beanHourly.season.season),
    value: Number(beanHourly.instPrice),
    timestamp: new Date(Number(beanHourly.createdTimestamp) * 1000),
  }));
}

export function useSeasonalSupply(fromSeason: number, toSeason: number): UseSeasonalResult {
  return useSeasonalBeanBeanSG(fromSeason, toSeason, (beanHourly, timestamp) => ({
    season: Number(beanHourly.season.season),
    value: TV.fromBlockchain(beanHourly.supply, PINTO.decimals).toNumber(),
    timestamp,
  }));
}

export function useSeasonalMcap(fromSeason: number, toSeason: number): UseSeasonalResult {
  return useSeasonalBeanBeanSG(fromSeason, toSeason, (beanHourly, _timestamp) => ({
    season: Number(beanHourly.season.season),
    value: Number(beanHourly.marketCap),
    timestamp: new Date(Number(beanHourly.createdTimestamp) * 1000),
  }));
}

export function useSeasonalL2SR(fromSeason: number, toSeason: number): UseSeasonalResult {
  return useSeasonalBeanBeanSG(fromSeason, toSeason, (beanHourly, _timestamp) => {
    const season = Number(beanHourly.season.season);
    let value = Number(beanHourly.l2sr);
    // For seasons 1-3, the twa liquidity isnt computable onchain, thus the protocl l2sr is not computable.
    // Use a manual calculation from the instantaneous liquidity instead.
    if (season <= 3) {
      value = Number(beanHourly.liquidityUSD) / TV.fromBlockchain(beanHourly.supply, PINTO.decimals).toNumber();
    }

    return {
      season,
      value,
      timestamp: new Date(Number(beanHourly.createdTimestamp) * 1000),
    };
  });
}


/** ==================== Bean Season ==================== **/

export function useSeasonalTotalLiquidity(fromSeason: number, toSeason: number): UseSeasonalResult {
  return useSeasonalBeanSeasonSG(fromSeason, toSeason, (beanSeason, timestamp) => ({
    season: Number(beanSeason.season),
    value: beanSeason.poolHourlySnapshots.reduce((acc, next) => {
      return acc + Number(next.liquidityUSD);
    }, 0),
    timestamp,
  }));
}

/** ==================== Farmer SiloHourlySnapshot ==================== **/

// ----- Helper functions ----- 
function calcSeasonalGrownStalk(siloHourly: SiloHourlySnapshot) {
  return TV.fromBlockchain(
    BigInt(siloHourly.stalk) +
    BigInt(siloHourly.germinatingStalk) -
    BigInt(siloHourly.depositedBDV) * BigInt(10) ** BigInt(10),
    STALK.decimals,
  );
}
function calcGrownStalkPerBDV(siloHourly: SiloHourlySnapshot, bdvDecimals: number) {
  const grownStalk = calcSeasonalGrownStalk(siloHourly);
  const depositedBDV = TV.fromBlockchain(siloHourly.depositedBDV, bdvDecimals);
  return grownStalk.div(depositedBDV);
}

// ----- Seasonal Hooks ----- 
export function useFarmerSeasonalPlantedPinto(fromSeason: number, toSeason: number): UseSeasonalResult {
  return useSeasonalFarmerSG(fromSeason, toSeason, (siloHourly, timestamp) => ({
    season: Number(siloHourly.season),
    value: TV.fromBlockchain(siloHourly.plantedBeans, PINTO.decimals).toNumber(),
    timestamp,
  }));
}

export function useFarmerSeasonalClaimedGrownStalkBalance(fromSeason: number, toSeason: number): UseSeasonalResult {
  return useSeasonalFarmerSG(fromSeason, toSeason, (siloHourly, timestamp) => ({
    season: Number(siloHourly.season),
    value: calcSeasonalGrownStalk(siloHourly).toNumber(),
    timestamp,
  }));
}

export function useFarmerSeasonalGrownStalkPerDepositedBDV(
  fromSeason: number,
  toSeason: number,
  account?: HashString,
) {
  const token = useChainConstant(MAIN_TOKEN);

  return useSeasonalFarmerSG(
    fromSeason,
    toSeason,
    (siloHourly, timestamp) => ({
      season: Number(siloHourly.season),
      value: calcGrownStalkPerBDV(siloHourly, token.decimals).toNumber(),
      timestamp
    }),
    account
  );
}

// This is O(n * m) where m is the total number of seasons in range. Unclear if this will scale appropriately.
export function useFarmerSeasonalStalkOwnership(fromSeason: number, toSeason: number): UseSeasonalResult {
  const beanstalkStalk = useSeasonalStalk(fromSeason, toSeason);
  const farmerStalkOwnership = useSeasonalFarmerSG(fromSeason, toSeason, (siloHourly, timestamp) => ({
    season: Number(siloHourly.season),
    value:
      TV.fromBlockchain(siloHourly.stalk, STALK.decimals).toNumber() /
      (beanstalkStalk.data?.find((item) => item.season === Number(siloHourly.season))?.value ?? Infinity),
    timestamp,
  }));

  if (beanstalkStalk.isLoading || farmerStalkOwnership.isLoading) {
    return { isLoading: true, isError: false, data: undefined };
  }

  if (beanstalkStalk.isError || farmerStalkOwnership.isError) {
    return { isLoading: false, isError: true, data: undefined };
  }

  return farmerStalkOwnership;
}

/**
 * The Seasonal total deposited amount of a token by a farmer
 * If 'account' is not provided, the connected wallet address will be used.
 */
export function useFarmerSeasonalSiloAssetDepositedAmount(fromSeason: number, toSeason: number, token: Token, account?: string) {
  const { address } = useAccount();

  const siloAccount = account ?? address ?? "";

  return useSeasonalFarmerSiloAssetTokenSG(
    fromSeason,
    toSeason,
    token.address,
    siloAccount,
    (siloAssetHourly, timestamp) => ({
      season: Number(siloAssetHourly.season),
      value: TV.fromBlockchain(siloAssetHourly.depositedAmount, token.decimals).toNumber(),
      timestamp,
    }),
  )
}

export function useFarmerSeasonalSiloAssetPercentageOfTotalDeposited(fromSeason: number, toSeason: number, token: Token, account?: string): UseSeasonalResult {
  const diamond = useProtocolAddress();

  const siloAssetDepositedAmount = useFarmerSeasonalSiloAssetDepositedAmount(fromSeason, toSeason, token, account);
  const overallDepositedAmount = useFarmerSeasonalSiloAssetDepositedAmount(fromSeason, toSeason, token, diamond);

  const isLoading = siloAssetDepositedAmount.isLoading || overallDepositedAmount.isLoading;
  const isError = siloAssetDepositedAmount.isError || overallDepositedAmount.isError;

  const data = useMemo(() => {
    if (isLoading || isError) {
      return undefined;
    }

    try {
      return mergeUseSeasonalQueriesResults(
        siloAssetDepositedAmount.data,
        overallDepositedAmount.data,
        (accountHourly, overallHourly) => accountHourly / overallHourly
      )
    } catch (error) {
      console.error(error);
      return [];
    }
  }, [siloAssetDepositedAmount.data, overallDepositedAmount.data, isLoading, isError]);


  return { data, isLoading, isError };
}

/** ==================== Beanstalk SiloHourlySnapshot ==================== **/

export function useSeasonalStalk(fromSeason: number, toSeason: number): UseSeasonalResult {
  return useSeasonalBeanstalkSiloSG(fromSeason, toSeason, (siloHourly, timestamp) => ({
    season: Number(siloHourly.season),
    value: TV.fromBlockchain(siloHourly.stalk, STALK.decimals).toNumber(),
    timestamp,
  }));
}

export function useSeasonalAvgSeeds(fromSeason: number, toSeason: number): UseSeasonalResult {
  return useSeasonalBeanstalkSiloSG(fromSeason, toSeason, (siloHourly, timestamp) => ({
    season: Number(siloHourly.season),
    value: TV.fromBlockchain(siloHourly.avgGrownStalkPerBdvPerSeason, STALK.decimals - 4).toNumber(),
    timestamp,
  }));
}

/** ==================== Beanstalk FieldHourlySnapshot ==================== **/

export function useSeasonalPodRate(fromSeason: number, toSeason: number): UseSeasonalResult {
  return useSeasonalBeanstalkFieldSG(fromSeason, toSeason, (fieldHourly, timestamp) => ({
    season: Number(fieldHourly.season),
    value: Number(fieldHourly.podRate),
    timestamp,
  }));
}

export function useSeasonalTemperature(fromSeason: number, toSeason: number): UseSeasonalResult {
  return useSeasonalBeanstalkFieldSG(fromSeason, toSeason, (fieldHourly, timestamp) => ({
    season: Number(fieldHourly.season),
    value: Number(fieldHourly.temperature) / 100,
    timestamp,
  }));
}

export function useSeasonalPodIndex(fromSeason: number, toSeason: number): UseSeasonalResult {
  return useSeasonalBeanstalkFieldSG(fromSeason, toSeason, (fieldHourly, timestamp) => ({
    season: Number(fieldHourly.season),
    value: TV.fromBlockchain(fieldHourly.podIndex, PODS.decimals).toNumber(),
    timestamp,
  }));
}

export function useSeasonalPodLine(fromSeason: number, toSeason: number): UseSeasonalResult {
  return useSeasonalBeanstalkFieldSG(fromSeason, toSeason, (fieldHourly, timestamp) => ({
    season: Number(fieldHourly.season),
    value: TV.fromBlockchain(fieldHourly.podIndex - fieldHourly.harvestableIndex, PODS.decimals).toNumber(),
    timestamp,
  }));
}

export function useSeasonalSownPinto(fromSeason: number, toSeason: number): UseSeasonalResult {
  return useSeasonalBeanstalkFieldSG(fromSeason, toSeason, (fieldHourly, timestamp) => ({
    season: Number(fieldHourly.season),
    value: TV.fromBlockchain(fieldHourly.sownBeans, PINTO.decimals).toNumber(),
    timestamp,
  }));
}

export function useSeasonalPodsHarvested(fromSeason: number, toSeason: number): UseSeasonalResult {
  return useSeasonalBeanstalkFieldSG(fromSeason, toSeason, (fieldHourly, timestamp) => ({
    season: Number(fieldHourly.season),
    value: TV.fromBlockchain(fieldHourly.harvestedPods, PODS.decimals).toNumber(),
    timestamp,
  }));
}

/** ==================== WrappedDepositERC20HourlySnapshot ==================== **/

export function useSeasonalWrappedDepositExchangeRate(fromSeason: number, toSeason: number): UseSeasonalResult {
  const token = useChainConstant(MAIN_TOKEN);

  return useSeasonalBeanstalkWrappedDepositsSG(fromSeason, toSeason, (wdHourly, timestamp) => ({
    season: Number(wdHourly.season),
    value: TV.fromBlockchain(wdHourly.redeemRate, token.decimals).toNumber(),
    timestamp,
  }));
}

export function useSeasonalWrappedDepositTotalSupply(fromSeason: number, toSeason: number): UseSeasonalResult {
  const token = useChainConstant(S_MAIN_TOKEN);

  return useSeasonalBeanstalkWrappedDepositsSG(fromSeason, toSeason, (data, timestamp) => ({
    season: Number(data.season),
    value: TV.fromBlockchain(data.supply, token.decimals).toNumber(),
    timestamp,
  }));
}