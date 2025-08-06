import { TV } from "@/classes/TokenValue";
import { TimeTab } from "@/components/charts/TimeTabs";
import { PODS, STALK } from "@/constants/internalTokens";
import { MAIN_TOKEN, PINTO, S_MAIN_TOKEN } from "@/constants/tokens";
import { SiloHourlySnapshot } from "@/generated/gql/pintostalk/graphql";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { useSeason } from "@/state/useSunData";
import { useChainConstant } from "@/utils/chain";
import { Token, UseSeasonalResult } from "@/utils/types";
import { HashString } from "@/utils/types.generic";
import { useCallback, useMemo } from "react";
import { base } from "viem/chains";
import { useAccount } from "wagmi";
import useSeasonalBasinSummarySG from "./queries/useSeasonalBasinSummarySG";
import useSeasonalBeanBeanSG from "./queries/useSeasonalBeanBeanSG";
import useSeasonalBeanstalkFieldSG from "./queries/useSeasonalBeanstalkFieldSG";
import useSeasonalBeanstalkSiloSG, {
  useSeasonalBeanstalkSiloActiveFarmersSG,
} from "./queries/useSeasonalBeanstalkSiloSG";
import useSeasonalBeanstalkWrappedDepositsSG from "./queries/useSeasonalBeanstalkWrappedDepositsSG";
import useSeasonalFarmerSG from "./queries/useSeasonalFarmerSG";
import useSeasonalFarmerSiloAssetTokenSG from "./queries/useSeasonalFarmerSiloAssetTokenSG";
import useSeasonalTractorSnapshots from "./queries/useSeasonalTractorSnapshots";
import { mergeUseSeasonalQueriesResults } from "./utils";

/** ==================== Bean BeanHourlySnapshot ==================== **/

export function useSeasonalPrice(fromSeason: number, toSeason: number, enabled = true): UseSeasonalResult {
  return useSeasonalBeanBeanSG(
    fromSeason,
    toSeason,
    (beanHourly, _timestamp) => ({
      season: Number(beanHourly.season.season),
      value: Number(beanHourly.instPrice),
      timestamp: new Date(Number(beanHourly.createdTimestamp) * 1000),
    }),
    { enabled },
  );
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
    // This is the only acceptable usage of liquidityUSD in the bean subgraph (use basin instead).
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
  return useSeasonalBasinSummarySG(fromSeason, toSeason, (basinHourly, timestamp) => ({
    season: Number(basinHourly.season.season),
    value: Number(basinHourly.totalLiquidityUSD),
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

export function useFarmerSeasonalGrownStalkPerDepositedBDV(fromSeason: number, toSeason: number, account?: HashString) {
  const token = useChainConstant(MAIN_TOKEN);

  return useSeasonalFarmerSG(
    fromSeason,
    toSeason,
    (siloHourly, timestamp) => ({
      season: Number(siloHourly.season),
      value: calcGrownStalkPerBDV(siloHourly, token.decimals).toNumber(),
      timestamp,
    }),
    account,
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
export function useFarmerSeasonalSiloAssetDepositedAmount(
  fromSeason: number,
  toSeason: number,
  token: Token,
  account?: string,
) {
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
  );
}

export function useFarmerSeasonalSiloAssetPercentageOfTotalDeposited(
  fromSeason: number,
  toSeason: number,
  token: Token,
  account?: string,
): UseSeasonalResult {
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
        (accountHourly, overallHourly) => accountHourly / overallHourly,
      );
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

export function useSeasonalBDV(fromSeason: number, toSeason: number): UseSeasonalResult {
  return useSeasonalBeanstalkSiloSG(fromSeason, toSeason, (siloHourly, timestamp) => ({
    season: Number(siloHourly.season),
    value: TV.fromBlockchain(siloHourly.depositedBDV, PINTO.decimals).toNumber(),
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

export function useSeasonalSiloActiveFarmers(fromSeason: number, toSeason: number): UseSeasonalResult {
  return useSeasonalBeanstalkSiloActiveFarmersSG(fromSeason, toSeason, (siloHourly, timestamp) => ({
    season: Number(siloHourly.season),
    value: siloHourly.activeFarmers,
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

export function useSeasonalCultivationFactor(fromSeason: number, toSeason: number): UseSeasonalResult {
  return useSeasonalBeanstalkFieldSG(fromSeason, toSeason, (fieldHourly, timestamp) => ({
    season: Number(fieldHourly.season),
    value: TV.fromHuman(fieldHourly.cultivationFactor || 0, 2).toNumber() / 100,
    timestamp,
  }));
}

export function useSeasonalCultivationTemperature(fromSeason: number, toSeason: number): UseSeasonalResult {
  return useSeasonalBeanstalkFieldSG(fromSeason, toSeason, (fieldHourly, timestamp) => ({
    season: Number(fieldHourly.season),
    value: TV.fromHuman(fieldHourly.cultivationTemperature || 0, 2).toNumber() / 100,
    timestamp,
  }));
}

export function useSeasonalSoilSupply(fromSeason: number, toSeason: number): UseSeasonalResult {
  return useSeasonalBeanstalkFieldSG(fromSeason, toSeason, (fieldHourly, timestamp) => ({
    season: Number(fieldHourly.season),
    value: TV.fromBlockchain(fieldHourly.issuedSoil, PINTO.decimals).toNumber(),
    timestamp,
  }));
}

export function useSeasonalSoilDemand(fromSeason: number, toSeason: number): UseSeasonalResult {
  return useSeasonalBeanstalkFieldSG(fromSeason, toSeason, (fieldHourly, timestamp) => ({
    season: Number(fieldHourly.season),
    value: TV.fromBlockchain(fieldHourly.deltaSownBeans, PINTO.decimals).toNumber(),
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

/** ==================== Tractor API Hourly Snapshots ==================== **/

export function useSeasonalTractorSownPinto(fromSeason: number, toSeason: number): UseSeasonalResult {
  return useSeasonalTractorSnapshots("SOW_V0", fromSeason, toSeason, (data) => ({
    season: data.season,
    value: TV.fromBlockchain(data.totalPintoSown, PODS.decimals).toNumber(),
    timestamp: new Date(data.snapshotTimestamp),
  }));
}

export function useSeasonalTractorPodsIssued(fromSeason: number, toSeason: number): UseSeasonalResult {
  return useSeasonalTractorSnapshots("SOW_V0", fromSeason, toSeason, (data) => ({
    season: data.season,
    value: TV.fromBlockchain(data.totalPodsMinted, PODS.decimals).toNumber(),
    timestamp: new Date(data.snapshotTimestamp),
  }));
}

export function useSeasonalTractorFundedAmount(fromSeason: number, toSeason: number): UseSeasonalResult {
  return useSeasonalTractorSnapshots("SOW_V0", fromSeason, toSeason, (data) => ({
    season: data.season,
    value: TV.fromBlockchain(data.totalCascadeFundedBelowTemp, PINTO.decimals).toNumber(),
    timestamp: new Date(data.snapshotTimestamp),
  }));
}

export function useSeasonalTractorCumulativeTips(fromSeason: number, toSeason: number): UseSeasonalResult {
  return useSeasonalTractorSnapshots("SOW_V0", fromSeason, toSeason, (data) => ({
    season: data.season,
    value: TV.fromBlockchain(data.totalTipsPaid, PINTO.decimals).toNumber(),
    timestamp: new Date(data.snapshotTimestamp),
  }));
}

export function useSeasonalTractorMaxSow(fromSeason: number, toSeason: number): UseSeasonalResult {
  return useSeasonalTractorSnapshots("SOW_V0", fromSeason, toSeason, (data) => ({
    season: data.season,
    value: TV.fromBlockchain(data.maxSowThisSeason, PINTO.decimals).toNumber(),
    timestamp: new Date(data.snapshotTimestamp),
  }));
}

export function useSeasonalTractorMaxActiveTip(fromSeason: number, toSeason: number): UseSeasonalResult {
  return useSeasonalTractorSnapshots("SOW_V0", fromSeason, toSeason, (data) => ({
    season: data.season,
    value: TV.fromBlockchain(data.currentMaxTip, PINTO.decimals).toNumber(),
    timestamp: new Date(data.snapshotTimestamp),
  }));
}

export function useSeasonalTractorExecutionsCount(fromSeason: number, toSeason: number): UseSeasonalResult {
  return useSeasonalTractorSnapshots("SOW_V0", fromSeason, toSeason, (data) => ({
    season: data.season,
    value: data.totalExecutions,
    timestamp: new Date(data.snapshotTimestamp),
  }));
}

export function useSeasonalTractorUniquePublishers(fromSeason: number, toSeason: number): UseSeasonalResult {
  return useSeasonalTractorSnapshots("SOW_V0", fromSeason, toSeason, (data) => ({
    season: data.season,
    value: data.uniquePublishers,
    timestamp: new Date(data.snapshotTimestamp),
  }));
}

/** ==================== Multi-Token Historical BDV ==================== **/

/**
 * Hook to fetch historical BDV data for multiple tokens for a specific farmer
 * Returns a map of token addresses to their seasonal BDV data
 * Uses individual single-token queries (proven working approach)
 */
export function useFarmerHistoricalTokensBDV(
  fromSeason: number,
  toSeason: number,
  tokens: Token[],
): { [tokenAddress: string]: UseSeasonalResult } {
  const { address } = useAccount();

  // Call hooks for each token at the top level (can't be conditional)
  // We need to call hooks for a fixed number of tokens to avoid Rules of Hooks violations
  const token0 = tokens?.[0];
  const token1 = tokens?.[1];
  const token2 = tokens?.[2];
  const token3 = tokens?.[3];
  const token4 = tokens?.[4];

  // Create a placeholder token with all required properties
  const placeholderToken: Token = {
    address: "0x0",
    decimals: 18,
    symbol: "",
    name: "",
    chainId: base.id,
    logoURI: "",
  };

  const query0 = useFarmerSeasonalSiloAssetDepositedAmount(
    fromSeason,
    toSeason,
    token0 || placeholderToken,
    address || "",
  );
  const query1 = useFarmerSeasonalSiloAssetDepositedAmount(
    fromSeason,
    toSeason,
    token1 || placeholderToken,
    address || "",
  );
  const query2 = useFarmerSeasonalSiloAssetDepositedAmount(
    fromSeason,
    toSeason,
    token2 || placeholderToken,
    address || "",
  );
  const query3 = useFarmerSeasonalSiloAssetDepositedAmount(
    fromSeason,
    toSeason,
    token3 || placeholderToken,
    address || "",
  );
  const query4 = useFarmerSeasonalSiloAssetDepositedAmount(
    fromSeason,
    toSeason,
    token4 || placeholderToken,
    address || "",
  );

  return useMemo(() => {
    if (!address || !tokens || !tokens.length) {
      return {};
    }

    const queries: { [tokenAddress: string]: UseSeasonalResult } = {};

    if (token0) queries[token0.address] = query0;
    if (token1) queries[token1.address] = query1;
    if (token2) queries[token2.address] = query2;
    if (token3) queries[token3.address] = query3;
    if (token4) queries[token4.address] = query4;

    return queries;
  }, [address, tokens, token0, token1, token2, token3, token4, query0, query1, query2, query3, query4]);
}

/**
 * Hook to calculate season range based on selected time tab
 * Returns from/to season numbers for the selected time period
 */
export function useTimeRangeSeasons(timeTab: TimeTab): { from: number; to: number } {
  const currentSeason = useSeason();

  return useMemo(() => {
    const now = currentSeason;
    switch (timeTab) {
      case TimeTab.Week:
        return { from: Math.max(1, now - 168), to: now }; // 7 days * 24 hours
      case TimeTab.Month:
        return { from: Math.max(1, now - 720), to: now }; // 30 days * 24 hours
      case TimeTab.AllTime:
        return { from: 1, to: now }; // From protocol start
      default:
        return { from: Math.max(1, now - 720), to: now };
    }
  }, [timeTab, currentSeason]);
}
