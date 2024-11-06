import { TokenValue } from "@/classes/TokenValue";
import { useFarmerBalances } from "@/state/useFarmerBalances";
import { useFarmerField } from "@/state/useFarmerField";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { useFieldData } from "@/state/useFieldData";
import { usePriceData } from "@/state/usePriceData";
import { useSiloData } from "@/state/useSiloData";
import useTokenData from "@/state/useTokenData";
import { SiloTokenData, Token } from "@/utils/types";
import { useMemo } from "react";
import { useAccount } from "wagmi";

interface ConversionGains {
  stalkGain: TokenValue;
  seedGain: TokenValue;
  percentageIncrease: {
    stalk: TokenValue;
    seeds: TokenValue;
  };
}

interface ConvertibleDeposit {
  from: Token;
  amount: TokenValue;
  bdv: TokenValue;
  to: {
    token: Token;
    gains: ConversionGains;
  }[];
}

interface OptimalDepositToken {
  token: Token;
  seedsPerBDV: TokenValue;
  stalkPerBDV: TokenValue;
}

interface FarmerActions {
  // Silo-related actions
  canDeposit: boolean;
  optimalDepositToken: OptimalDepositToken | undefined;
  tokensWithValue: Map<Token, TokenValue>;
  canClaimRewards: boolean;
  canConvert: boolean;
  convertibleDeposits: ConvertibleDeposit[];

  // Field-related actions
  canSow: boolean;
  canHarvest: boolean;

  // Value info
  totalValue: {
    silo: TokenValue;
    field: TokenValue;
    wallet: TokenValue;
    rewards: {
      stalk: TokenValue;
      seeds: TokenValue;
      earnedBeans: TokenValue;
    };
  };
}

function calculateConversionGains(
  fromTokenData: SiloTokenData,
  toTokenData: SiloTokenData,
  depositBDV: TokenValue,
): ConversionGains | undefined {
  try {
    const currentSeeds = depositBDV.mul(fromTokenData.rewards.seeds);
    const currentStalkPerSeason = depositBDV.mul(fromTokenData.tokenSettings.stalkEarnedPerSeason);

    const newSeeds = depositBDV.mul(toTokenData.rewards.seeds);
    const newStalkPerSeason = depositBDV.mul(toTokenData.tokenSettings.stalkEarnedPerSeason);

    const seedGain = newSeeds.sub(currentSeeds);
    const stalkGain = newStalkPerSeason.sub(currentStalkPerSeason);

    const seedIncrease = currentSeeds.gt(0) ? seedGain.div(currentSeeds).mul(100) : TokenValue.ZERO;
    const stalkIncrease = currentStalkPerSeason.gt(0) ? stalkGain.div(currentStalkPerSeason).mul(100) : TokenValue.ZERO;

    return {
      stalkGain,
      seedGain,
      percentageIncrease: {
        stalk: stalkIncrease,
        seeds: seedIncrease,
      },
    };
  } catch (e) {
    return undefined;
  }
}

function findOptimalDepositToken(
  whitelistedTokens: Token[],
  siloData: Map<Token, SiloTokenData>,
): OptimalDepositToken | undefined {
  let bestToken: OptimalDepositToken | undefined;

  for (const token of whitelistedTokens) {
    const tokenData = siloData.get(token);
    if (!tokenData) continue;

    const tokenInfo = {
      token,
      seedsPerBDV: tokenData.rewards.seeds,
      stalkPerBDV: tokenData.tokenSettings.stalkIssuedPerBdv,
    };

    if (!bestToken || tokenInfo.seedsPerBDV.gt(bestToken.seedsPerBDV)) {
      bestToken = tokenInfo;
    }
  }

  return bestToken;
}

export default function useFarmerActions(): FarmerActions {
  const account = useAccount();
  const farmerBalances = useFarmerBalances();
  const farmerSilo = useFarmerSilo();
  const farmerField = useFarmerField();
  const fieldData = useFieldData();
  const priceData = usePriceData();
  const tokenData = useTokenData();
  const siloData = useSiloData();
  const mainToken = tokenData.mainToken;

  return useMemo(() => {
    // Check if wallet is connected
    if (!account.address) {
      return {
        canDeposit: false,
        optimalDepositToken: undefined,
        tokensWithValue: new Map(),
        canClaimRewards: false,
        canConvert: false,
        convertibleDeposits: [],
        canSow: false,
        canHarvest: false,
        totalValue: {
          silo: TokenValue.ZERO,
          field: TokenValue.ZERO,
          wallet: TokenValue.ZERO,
          rewards: {
            stalk: TokenValue.ZERO,
            seeds: TokenValue.ZERO,
            earnedBeans: TokenValue.ZERO,
          },
        },
      };
    }

    // Find tokens that have value
    const tokensWithValue = new Map<Token, TokenValue>();
    for (const [token, balance] of farmerBalances.balances) {
      const price = priceData.tokenPrices.get(token)?.instant;
      if (price && balance.external.gt(0)) {
        tokensWithValue.set(token, balance.external.mul(price));
      }
    }

    // Calculate total wallet value
    const walletValue = Array.from(tokensWithValue.values()).reduce(
      (total, value) => total.add(value),
      TokenValue.ZERO,
    );

    // Calculate pod value
    const podValue = farmerField.plots
      .reduce((total, plot) => total.add(plot.pods), TokenValue.ZERO)
      .mul(priceData.price);

    // Find convertible deposits
    const whitelistedTokens = tokenData.whitelistedTokens;
    const convertibleDeposits: ConvertibleDeposit[] = [];

    // For each token with deposits
    for (const fromToken of whitelistedTokens) {
      const fromTokenData = siloData.tokenData.get(fromToken);
      const farmerDepositData = farmerSilo.grownStalkPerToken.get(fromToken);

      if (!fromTokenData || !farmerDepositData || farmerDepositData.eq(0)) continue;

      const depositAmount = farmerDepositData;
      const depositBDV = depositAmount.mul(fromTokenData.tokenBDV);

      // Find tokens with better seed rewards
      const betterTokens = whitelistedTokens
        .map((toToken) => {
          const toTokenData = siloData.tokenData.get(toToken);
          if (!toTokenData || toToken.address === fromToken.address) return null;

          // Compare seeds per BDV
          if (toTokenData.rewards.seeds.lte(fromTokenData.rewards.seeds)) return null;

          const gains = calculateConversionGains(fromTokenData, toTokenData, depositBDV);
          if (!gains) return null;

          return {
            token: toToken,
            gains,
          };
        })
        .filter(
          (conversion): conversion is NonNullable<typeof conversion> =>
            conversion !== null && (conversion.gains.stalkGain.gt(0) || conversion.gains.seedGain.gt(0)),
        )
        .sort((a, b) => {
          const stalkDiff = b.gains.stalkGain.sub(a.gains.stalkGain);
          if (!stalkDiff.eq(0)) return stalkDiff.toNumber();
          return b.gains.seedGain.sub(a.gains.seedGain).toNumber();
        });

      if (betterTokens.length > 0) {
        convertibleDeposits.push({
          from: fromToken,
          amount: depositAmount,
          bdv: depositBDV,
          to: betterTokens,
        });
      }
    }

    const optimalDepositToken = findOptimalDepositToken(whitelistedTokens, siloData.tokenData);

    return {
      // Can deposit if has any tokens with value
      canDeposit: tokensWithValue.size > 0,
      optimalDepositToken,
      tokensWithValue,

      // Can claim if has any unclaimed rewards
      canClaimRewards: farmerSilo.earnedBeansBalance.gt(0) || farmerSilo.grownStalkReward.gt(0),

      // Can convert if there are any convertible deposits
      canConvert: convertibleDeposits.length > 0,
      convertibleDeposits,

      // Can sow if has main token balance and soil is available
      canSow: mainToken ? farmerBalances.balances.get(mainToken)?.external.gt(0) && fieldData.soil.gt(0) : false,

      // Can harvest if has harvestable pods
      canHarvest: farmerField.plots.some((plot) => plot.harvestablePods.gt(0)),

      totalValue: {
        silo: farmerSilo.depositsUSD,
        field: podValue,
        wallet: walletValue,
        rewards: {
          stalk: farmerSilo.grownStalkReward,
          seeds: farmerSilo.activeSeedsBalance,
          earnedBeans: farmerSilo.earnedBeansBalance,
        },
      },
    };
  }, [
    account.address,
    farmerBalances.balances,
    farmerSilo,
    farmerField,
    fieldData.soil,
    priceData.price,
    priceData.tokenPrices,
    mainToken,
    siloData.tokenData,
    tokenData.whitelistedTokens,
  ]);
}
