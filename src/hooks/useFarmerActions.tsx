import { TokenValue } from "@/classes/TokenValue";
import { useFarmerBalances } from "@/state/useFarmerBalances";
import { useFarmerField } from "@/state/useFarmerField";
import { useFarmerSiloNew } from "@/state/useFarmerSiloNew";
import { PoolData, usePriceData } from "@/state/usePriceData";
import { useSiloData } from "@/state/useSiloData";
import { useSunData } from "@/state/useSunData";
import useTokenData from "@/state/useTokenData";
import { SiloTokenData, Token, TokenDepositData } from "@/utils/types";
import { useMemo } from "react";
import { useAccount } from "wagmi";

// Define output types for each action
interface ActionOutput {
  beanGain: TokenValue;
  bdvGain: TokenValue;
  stalkGain: TokenValue;
  seedGain: TokenValue;
  podGain: TokenValue;
}

interface ConvertibleDeposit {
  from: Token;
  amount: TokenValue;
  bdv: TokenValue;
  to: {
    token: Token;
    gains: {
      stalkGain: TokenValue;
      seedGain: TokenValue;
      percentageIncrease: {
        stalk: TokenValue;
        seeds: TokenValue;
      };
    };
  }[];
}

interface UpdateOutput extends ActionOutput {
  currentBDV: TokenValue;
  depositBDV: TokenValue;
  bdvIncrease: TokenValue;
  stalkFromBDVIncrease: TokenValue;
  seedsFromBDVIncrease: TokenValue;
}

interface TokenUpdateInfo {
  token: Token;
  enabled: boolean;
  outputs: UpdateOutput;
}

interface FloodableAsset {
  token: Token;
  amount: TokenValue;
  value: TokenValue;
}

interface FarmerAction {
  enabled: boolean;
  outputs: ActionOutput;
}

interface RewardSources {
  mow?: ActionOutput; // From mowing grown stalk
  plant?: ActionOutput; // From planting earned beans
  harvest?: ActionOutput;
  convert?: ActionOutput;
  update?: UpdateOutput;
  flood?: FloodableAsset;
}

interface TokenTotalGains {
  token: Token;
  total: {
    amount: TokenValue; // Raw token amount
    bdv: TokenValue; // BDV value
    stalk: TokenValue; // Total stalk gain
    seeds: TokenValue; // Total seeds gain
  };
  sources: RewardSources;
}

interface WalletBalanceValue {
  external: TokenValue;
  internal: TokenValue;
  total: TokenValue;
  byToken: Map<
    Token,
    {
      external: TokenValue;
      internal: TokenValue;
      total: TokenValue;
    }
  >;
}

interface FarmerActions {
  // Silo-related actions
  canDeposit: boolean;
  canWrapPinto: boolean;
  optimalDepositToken:
    | {
        token: Token;
        seedsPerBDV: TokenValue;
        stalkPerBDV: TokenValue;
      }
    | undefined;
  tokensWithValue: Map<Token, TokenValue>;

  // Claimable actions with calculated outputs
  claimRewards: FarmerAction;
  floodAssets: {
    enabled: boolean;
    assets: FloodableAsset[];
    totalValue: TokenValue;
  };
  harvestPods: FarmerAction;
  convertDeposits: {
    enabled: boolean;
    deposits: ConvertibleDeposit[];
    bestConversion: {
      from?: Token;
      to?: Token;
      outputs: ActionOutput;
    };
  };

  // Update deposits
  updateDeposits: {
    enabled: boolean;
    totalGains: ActionOutput;
    /**
     * Map of token address to potential update gains
     */
    tokenUpdates: Map<Token, TokenUpdateInfo>;
  };

  // Value info
  totalValue: {
    silo: TokenValue;
    field: TokenValue;
    wallet: WalletBalanceValue;
    rewards: {
      stalk: TokenValue;
      seeds: TokenValue;
      earnedBeans: TokenValue;
    };
  };

  tokenTotals: Map<Token, TokenTotalGains>;
}

// Helper function to find optimal deposit token
function findOptimalDepositToken(whitelistedTokens: Token[], siloData: Map<Token, SiloTokenData>) {
  let bestToken:
    | {
        token: Token;
        seedsPerBDV: TokenValue;
        stalkPerBDV: TokenValue;
      }
    | undefined;

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

// Helper function to calculate possible conversions for a token
function calculatePossibleConversions(
  fromToken: Token,
  fromDepositData: TokenDepositData,
  mainToken: Token,
  lpTokens: Token[],
  pools: PoolData[],
  globalDeltaB: TokenValue,
  siloData: Map<Token, SiloTokenData>,
) {
  const fromTokenData = siloData.get(fromToken);
  if (!fromTokenData || !fromDepositData.convertibleAmount.gt(0)) return [];

  const fromTokenSeeds = fromTokenData.rewards.seeds;
  const fromTokenStalk = fromTokenData.tokenSettings.stalkIssuedPerBdv;
  const possibleTargets: Token[] = [];

  // Determine possible target tokens based on token type and deltaB
  if (fromToken === mainToken) {
    // Pinto can convert to any LP token if their pool's deltaB > 0
    pools.forEach((pool) => {
      if (pool.deltaB.gt(0)) {
        possibleTargets.push(pool.pool);
      }
    });
  } else if (fromToken.isLP) {
    // LP tokens can convert to:
    // 1. Pinto if their pool's deltaB < 0
    // 2. Other LP tokens regardless of deltaB (up to global deltaB limit)
    const fromPool = pools.find((p) => p.pool.address === fromToken.address);
    if (fromPool?.deltaB.lt(0)) {
      possibleTargets.push(mainToken);
    }
    // Add all other LP tokens except self
    /* lpTokens.forEach((lpToken) => {
      if (lpToken.address !== fromToken.address) {
        possibleTargets.push(lpToken);
      }
    }); */
  }

  // Calculate gains for each possible target token
  return possibleTargets.reduce<
    {
      token: Token;
      gains: {
        beanGain: TokenValue;
        maxConvertAmount: TokenValue;
        stalkGain: TokenValue;
        seedGain: TokenValue;
        percentageIncrease: {
          stalk: TokenValue;
          seeds: TokenValue;
        };
      };
    }[]
  >((acc, toToken) => {
    const toTokenData = siloData.get(toToken);
    if (!toTokenData) return acc;

    // Calculate maximum convertible amount
    let maxConvertAmount = fromDepositData.depositBDV;

    if (fromToken === mainToken) {
      // For Pinto -> LP, use pool's deltaB
      const toPool = pools.find((p) => p.pool.address === toToken.address);
      if (toPool) {
        maxConvertAmount = TokenValue.min(maxConvertAmount, toPool.deltaB.mul(2));
      }
    } else if (toToken === mainToken) {
      // For LP -> Pinto, use absolute value of pool's deltaB
      const fromPool = pools.find((p) => p.pool.address === fromToken.address);
      if (fromPool) {
        maxConvertAmount = TokenValue.min(maxConvertAmount, fromPool.deltaB.abs().mul(2));
      }
    }

    // For all conversions, respect global deltaB limit
    if (globalDeltaB.gt(0)) {
      maxConvertAmount = TokenValue.min(maxConvertAmount, globalDeltaB.mul(2));
    } else if (globalDeltaB.lt(0)) {
      maxConvertAmount = TokenValue.min(maxConvertAmount, globalDeltaB.abs().mul(2));
    }

    // If no conversion amount available, skip
    if (maxConvertAmount.eq(0)) return acc;

    // Calculate rewards change based on convertible amount
    const newSeeds = maxConvertAmount.mul(toTokenData.rewards.seeds);
    const newStalk = maxConvertAmount.mul(toTokenData.tokenSettings.stalkIssuedPerBdv);
    const seedGain = newSeeds.sub(fromTokenSeeds.mul(maxConvertAmount));
    const stalkGain = TokenValue.max(
      TokenValue.ZERO, // Set minimum stalk gain to 0
      newStalk.sub(fromTokenStalk.mul(maxConvertAmount)),
    );

    // Calculate bean gain - only applies when converting TO Pinto
    const beanGain = toToken === mainToken ? maxConvertAmount : TokenValue.ZERO;

    // Calculate percentage increases
    const currentSeeds = fromTokenSeeds.mul(maxConvertAmount);
    const currentStalk = fromTokenStalk.mul(maxConvertAmount);

    const seedsPctIncrease = currentSeeds.gt(0) ? seedGain.div(currentSeeds).mul(100) : TokenValue.ZERO;

    const stalkPctIncrease = currentStalk.gt(0) ? stalkGain.div(currentStalk).mul(100) : TokenValue.ZERO;

    // Only add conversion if there are gains
    if (seedGain.gt(0) || stalkGain.gt(0) || beanGain.gt(0)) {
      acc.push({
        token: toToken,
        gains: {
          beanGain,
          maxConvertAmount,
          stalkGain,
          seedGain,
          percentageIncrease: {
            stalk: stalkPctIncrease,
            seeds: seedsPctIncrease,
          },
        },
      });
    }

    return acc;
  }, []);
}

// Helper function to calculate convertible deposits and best conversion
function calculateConvertibleDeposits(
  tokenData: ReturnType<typeof useTokenData>,
  siloData: ReturnType<typeof useSiloData>,
  priceData: ReturnType<typeof usePriceData>,
  depositedBalances: Map<Token, TokenDepositData>,
) {
  const { pools, deltaB: globalDeltaB } = priceData;
  const mainToken = tokenData.mainToken;
  const lpTokens = tokenData.lpTokens;

  let bestConversion = {
    from: undefined as Token | undefined,
    to: undefined as Token | undefined,
    outputs: {
      beanGain: TokenValue.ZERO,
      bdvGain: TokenValue.ZERO,
      stalkGain: TokenValue.ZERO,
      seedGain: TokenValue.ZERO,
      podGain: TokenValue.ZERO,
    },
  };

  const convertibleDeposits: ConvertibleDeposit[] = [];

  // Check each deposited token for conversion opportunities
  depositedBalances.forEach((depositData, fromToken) => {
    // Skip if no convertible amount
    if (!depositData.convertibleAmount.gt(0)) return;

    const possibleConversions = calculatePossibleConversions(
      fromToken,
      depositData,
      mainToken,
      lpTokens,
      pools,
      globalDeltaB,
      siloData.tokenData,
    );

    if (possibleConversions.length > 0) {
      // Add to convertible deposits list
      convertibleDeposits.push({
        from: fromToken,
        amount: depositData.convertibleAmount,
        bdv: depositData.depositBDV,
        to: possibleConversions,
      });

      // Update best conversion if this option is better
      const bestForToken = possibleConversions.reduce((best, current) => {
        return current.gains.seedGain.gt(best.gains.seedGain) ? current : best;
      }, possibleConversions[0]);

      if (bestForToken.gains.seedGain.gt(bestConversion.outputs.seedGain)) {
        bestConversion = {
          from: fromToken,
          to: bestForToken.token,
          outputs: {
            beanGain: bestForToken.gains.beanGain,
            bdvGain: bestForToken.gains.maxConvertAmount,
            stalkGain: bestForToken.gains.stalkGain,
            seedGain: bestForToken.gains.seedGain,
            podGain: TokenValue.ZERO, // Convert doesn't affect pods
          },
        };
      }
    }
  });

  return {
    bestConversion,
    convertibleDeposits,
  };
}

// Helper function to calculate update gains for a token's deposits
function calculateUpdateGains(depositData: TokenDepositData, siloTokenData: SiloTokenData): UpdateOutput {
  // Get deposit BDV
  const depositBDV = depositData.depositBDV;

  // Get new current BDV based on current token BDV
  const currentBDV = depositData.currentBDV;

  // Calculate BDV increase
  const bdvIncrease = currentBDV.sub(depositBDV);

  // Calculate stalk gains from BDV increase
  const stalkFromBDVIncrease = bdvIncrease.mul(siloTokenData.tokenSettings.stalkIssuedPerBdv);
  // Calculate seeds from BDV increase
  const seedsFromBDVIncrease = bdvIncrease.mul(siloTokenData.rewards.seeds);

  return {
    beanGain: TokenValue.ZERO, // No direct bean gain from updates
    bdvGain: bdvIncrease,
    stalkGain: stalkFromBDVIncrease,
    seedGain: seedsFromBDVIncrease,
    podGain: TokenValue.ZERO, // No pod changes from updates
    depositBDV,
    currentBDV,
    bdvIncrease,
    stalkFromBDVIncrease,
    seedsFromBDVIncrease,
  };
}

export default function useFarmerActions(): FarmerActions {
  const account = useAccount();
  const farmerBalances = useFarmerBalances();
  const farmerSilo = useFarmerSiloNew();
  const farmerDeposits = farmerSilo.deposits;
  const farmerField = useFarmerField();
  const priceData = usePriceData();
  const tokenData = useTokenData();
  const siloData = useSiloData();
  const isRaining = useSunData().raining;
  const mainToken = tokenData.mainToken;

  return useMemo(() => {
    // If wallet not connected, return empty state
    if (!account.address) {
      return {
        canDeposit: false,
        canWrapPinto: false,
        optimalDepositToken: undefined,
        tokensWithValue: new Map(),
        claimRewards: {
          enabled: false,
          outputs: {
            beanGain: TokenValue.ZERO,
            bdvGain: TokenValue.ZERO,
            stalkGain: TokenValue.ZERO,
            seedGain: TokenValue.ZERO,
            podGain: TokenValue.ZERO,
          },
        },
        floodAssets: {
          enabled: false,
          assets: [],
          totalValue: TokenValue.ZERO,
        },
        harvestPods: {
          enabled: false,
          outputs: {
            beanGain: TokenValue.ZERO,
            bdvGain: TokenValue.ZERO,
            stalkGain: TokenValue.ZERO,
            seedGain: TokenValue.ZERO,
            podGain: TokenValue.ZERO,
          },
        },
        convertDeposits: {
          enabled: false,
          deposits: [],
          bestConversion: {
            outputs: {
              beanGain: TokenValue.ZERO,
              bdvGain: TokenValue.ZERO,
              stalkGain: TokenValue.ZERO,
              seedGain: TokenValue.ZERO,
              podGain: TokenValue.ZERO,
            },
          },
        },
        // Add the updateDeposits empty state
        updateDeposits: {
          enabled: false,
          totalGains: {
            beanGain: TokenValue.ZERO,
            bdvGain: TokenValue.ZERO,
            stalkGain: TokenValue.ZERO,
            seedGain: TokenValue.ZERO,
            podGain: TokenValue.ZERO,
          },
          tokenUpdates: new Map(),
        },
        totalValue: {
          silo: TokenValue.ZERO,
          field: TokenValue.ZERO,
          wallet: {
            external: TokenValue.ZERO,
            internal: TokenValue.ZERO,
            total: TokenValue.ZERO,
            byToken: new Map(),
          },
          rewards: {
            stalk: TokenValue.ZERO,
            seeds: TokenValue.ZERO,
            earnedBeans: TokenValue.ZERO,
          },
        },
        tokenTotals: new Map(),
      };
    }

    // Calculate tokens with value in wallet
    const tokensWithValue = new Map<Token, TokenValue>();
    for (const [token, balance] of farmerBalances.balances) {
      const price = priceData.tokenPrices.get(token)?.instant;
      if (price && balance.external.gt(0)) {
        tokensWithValue.set(token, balance.external.mul(price));
      }
    }

    // Check if user has deposited Pinto
    const pintoDeposit = farmerDeposits.get(mainToken);
    const hasPintoDeposited = pintoDeposit ? pintoDeposit.amount.gt(0) : false;

    // Calculate reward claims
    const claimRewardsOutput: ActionOutput = {
      beanGain: farmerSilo.earnedBeansBalance, // Track beans even though they'll be deposited
      bdvGain: farmerSilo.earnedBeansBalance, // BDV of beans is 1:1
      stalkGain: farmerSilo.grownStalkReward.add(
        // Add stalk from auto-depositing earned beans
        farmerSilo.earnedBeansBalance.mul(
          siloData.tokenData.get(mainToken)?.tokenSettings.stalkIssuedPerBdv ?? TokenValue.ZERO,
        ),
      ),
      seedGain: farmerSilo.earnedBeansBalance.mul(siloData.tokenData.get(mainToken)?.rewards.seeds ?? TokenValue.ZERO),
      podGain: TokenValue.ZERO,
    };

    // Track flood assets
    const floodAssets = farmerSilo.flood.farmerSops.map((sop) => ({
      token: sop.backingAsset,
      amount: sop.wellsPlenty.plenty,
      value: sop.wellsPlenty.plenty.mul(priceData.tokenPrices.get(sop.backingAsset)?.instant || TokenValue.ZERO),
    }));

    const totalFloodValue = floodAssets.reduce((sum, asset) => sum.add(asset.value), TokenValue.ZERO);

    // Calculate harvestable pods
    const harvestablePods = farmerField.plots.reduce((total, plot) => total.add(plot.harvestablePods), TokenValue.ZERO);

    const harvestPodsOutput: ActionOutput = {
      beanGain: harvestablePods, // Track beans even though they'll be deposited
      bdvGain: harvestablePods, // BDV of beans is 1:1
      stalkGain: harvestablePods.mul(
        siloData.tokenData.get(mainToken)?.tokenSettings.stalkIssuedPerBdv ?? TokenValue.ZERO,
      ),
      seedGain: harvestablePods.mul(siloData.tokenData.get(mainToken)?.rewards.seeds ?? TokenValue.ZERO),
      podGain: TokenValue.ZERO.sub(harvestablePods), // Reduce pods by harvested amount
    };

    // Calculate optimal deposit token
    const optimalDepositToken = findOptimalDepositToken(tokenData.whitelistedTokens, siloData.tokenData);

    // Calculate convertible deposits and best conversion
    const { bestConversion, convertibleDeposits } = calculateConvertibleDeposits(
      tokenData,
      siloData,
      priceData,
      farmerDeposits,
    );

    // Calculate wallet values by token
    const walletValuesByToken = new Map<
      Token,
      {
        external: TokenValue;
        internal: TokenValue;
        total: TokenValue;
      }
    >();

    let totalExternalValue = TokenValue.ZERO;
    let totalInternalValue = TokenValue.ZERO;

    for (const [token, balance] of farmerBalances.balances) {
      const price = priceData.tokenPrices.get(token)?.instant;
      if (price) {
        const externalValue = balance.external.mul(price);
        const internalValue = balance.internal.mul(price);
        const totalValue = externalValue.add(internalValue);

        if (externalValue.gt(0) || internalValue.gt(0)) {
          walletValuesByToken.set(token, {
            external: externalValue,
            internal: internalValue,
            total: totalValue,
          });

          totalExternalValue = totalExternalValue.add(externalValue);
          totalInternalValue = totalInternalValue.add(internalValue);
        }
      }
    }

    const walletValue: WalletBalanceValue = {
      external: totalExternalValue,
      internal: totalInternalValue,
      total: totalExternalValue.add(totalInternalValue),
      byToken: walletValuesByToken,
    };

    // Calculate pod value
    const podValue = farmerField.plots
      .reduce((total, plot) => total.add(plot.pods), TokenValue.ZERO)
      .mul(priceData.price);

    // Calculate potential gains from updating deposits
    const tokenUpdates = new Map<Token, TokenUpdateInfo>();
    let totalUpdateGains: ActionOutput = {
      beanGain: TokenValue.ZERO,
      bdvGain: TokenValue.ZERO,
      stalkGain: TokenValue.ZERO,
      seedGain: TokenValue.ZERO,
      podGain: TokenValue.ZERO,
    };

    let hasUpdatableDeposits = false;

    // Go through each deposited token
    // If it's raining, disable deposit update
    if (!isRaining) {
      farmerDeposits.forEach((depositData, token) => {
        const siloTokenData = siloData.tokenData.get(token);
        if (!siloTokenData) return;

        // Skip tokens with no deposits
        if (!depositData.amount.gt(0)) return;

        // Get update gains for this token
        const updateGains = calculateUpdateGains(depositData, siloTokenData);

        // Skip if bdvGain is less than minimum threshold (0.000001)
        if (!updateGains.bdvGain.gt(0.000001)) return;

        hasUpdatableDeposits = true;

        // Add to token updates map
        tokenUpdates.set(token, {
          token,
          enabled: true,
          outputs: updateGains,
        });

        // Add to total gains
        totalUpdateGains = {
          beanGain: totalUpdateGains.beanGain.add(updateGains.beanGain),
          bdvGain: totalUpdateGains.bdvGain.add(updateGains.bdvGain),
          stalkGain: totalUpdateGains.stalkGain.add(updateGains.stalkGain),
          seedGain: totalUpdateGains.seedGain.add(updateGains.seedGain),
          podGain: totalUpdateGains.podGain.add(updateGains.podGain),
        };
      });
    }

    // Calculate mowing rewards
    const mowRewards: ActionOutput = {
      beanGain: TokenValue.ZERO,
      bdvGain: TokenValue.ZERO,
      stalkGain: farmerSilo.grownStalkReward,
      seedGain: TokenValue.ZERO,
      podGain: TokenValue.ZERO,
    };

    // Calculate planting rewards from earned beans
    const plantRewards: ActionOutput = {
      beanGain: farmerSilo.earnedBeansBalance,
      bdvGain: farmerSilo.earnedBeansBalance,
      stalkGain: farmerSilo.earnedBeansBalance.mul(
        siloData.tokenData.get(mainToken)?.tokenSettings.stalkIssuedPerBdv ?? TokenValue.ZERO,
      ),
      seedGain: farmerSilo.earnedBeansBalance.mul(siloData.tokenData.get(mainToken)?.rewards.seeds ?? TokenValue.ZERO),
      podGain: TokenValue.ZERO,
    };

    // Combined rewards for UI that needs total
    const totalRewards: ActionOutput = {
      beanGain: plantRewards.beanGain,
      bdvGain: plantRewards.bdvGain,
      stalkGain: mowRewards.stalkGain.add(plantRewards.stalkGain),
      seedGain: plantRewards.seedGain,
      podGain: TokenValue.ZERO,
    };

    // Initialize token totals map
    const tokenTotals = new Map<Token, TokenTotalGains>();

    // Helper to add gains to token totals with separate reward sources
    function addGainsToToken(token: Token, gains: Partial<ActionOutput>, source: keyof RewardSources) {
      const existing = tokenTotals.get(token) ?? {
        token,
        total: {
          amount: TokenValue.ZERO,
          bdv: TokenValue.ZERO,
          stalk: TokenValue.ZERO,
          seeds: TokenValue.ZERO,
        },
        sources: {},
      };

      // Add to totals
      existing.total.amount = existing.total.amount.add(gains.beanGain ?? TokenValue.ZERO);
      existing.total.bdv = existing.total.bdv.add(gains.bdvGain ?? TokenValue.ZERO);
      existing.total.stalk = existing.total.stalk.add(gains.stalkGain ?? TokenValue.ZERO);
      existing.total.seeds = existing.total.seeds.add(gains.seedGain ?? TokenValue.ZERO);

      // Set individual source
      existing.sources[source] = gains as any;

      tokenTotals.set(token, existing);
    }

    // Add mow rewards
    if (mowRewards.stalkGain.gt(0)) {
      addGainsToToken(mainToken, mowRewards, "mow");
    }

    // Add plant rewards
    if (plantRewards.beanGain.gt(0)) {
      addGainsToToken(mainToken, plantRewards, "plant");
    }
    // Add harvest gains to main token totals
    if (harvestPodsOutput.beanGain.gt(0)) {
      addGainsToToken(mainToken, harvestPodsOutput, "harvest");
    }

    // Add conversion gains
    if (bestConversion.from && bestConversion.to) {
      // Add negative gains to source token
      addGainsToToken(
        bestConversion.from,
        {
          beanGain: TokenValue.ZERO.sub(bestConversion.outputs.bdvGain),
          bdvGain: TokenValue.ZERO.sub(bestConversion.outputs.bdvGain),
          stalkGain: TokenValue.ZERO.sub(bestConversion.outputs.stalkGain),
          seedGain: TokenValue.ZERO.sub(bestConversion.outputs.seedGain),
        },
        "convert",
      );

      // Add positive gains to destination token
      addGainsToToken(bestConversion.to, bestConversion.outputs, "convert");
    }

    // Add update gains
    tokenUpdates.forEach((updateInfo, token) => {
      if (updateInfo.outputs.bdvGain.gt(0)) {
        addGainsToToken(token, updateInfo.outputs, "update");
      }
    });

    // Add flood gains
    floodAssets.forEach((asset) => {
      addGainsToToken(
        asset.token,
        {
          beanGain: asset.amount,
          bdvGain: asset.value,
          stalkGain: TokenValue.ZERO,
          seedGain: TokenValue.ZERO,
        },
        "flood",
      );
    });

    return {
      canDeposit: tokensWithValue.size > 0,
      canWrapPinto: hasPintoDeposited,
      optimalDepositToken,
      tokensWithValue,

      claimRewards: {
        enabled: totalRewards.beanGain.gt(0) || totalRewards.stalkGain.gt(0),
        outputs: totalRewards,
        mowOutputs: mowRewards,
        plantOutputs: plantRewards,
      },
      floodAssets: {
        enabled: totalFloodValue.gt(0),
        assets: floodAssets,
        totalValue: totalFloodValue,
      },

      harvestPods: {
        enabled: harvestPodsOutput.beanGain.gt(0),
        outputs: harvestPodsOutput,
      },

      convertDeposits: {
        enabled: bestConversion.from !== undefined && bestConversion.outputs.seedGain.gt(20),
        deposits: convertibleDeposits,
        bestConversion: {
          ...bestConversion,
          outputs: {
            ...bestConversion.outputs,
            beanGain: bestConversion.to === mainToken ? bestConversion.outputs.bdvGain : TokenValue.ZERO, // Show beans when converting to main token
          },
        },
      },

      updateDeposits: {
        enabled: hasUpdatableDeposits,
        totalGains: totalUpdateGains,
        tokenUpdates,
      },

      totalValue: {
        silo: farmerSilo.depositsUSD,
        field: podValue,
        wallet: walletValue,
        rewards: {
          stalk: farmerSilo.grownStalkReward,
          seeds: farmerSilo.earnedBeansBalance.mul(siloData.tokenData.get(mainToken)?.rewards.seeds ?? TokenValue.ZERO),
          earnedBeans: farmerSilo.earnedBeansBalance,
        },
      },
      tokenTotals,
    };
  }, [
    account.address,
    farmerBalances,
    farmerSilo,
    farmerField,
    farmerDeposits,
    mainToken,
    priceData,
    tokenData,
    siloData,
  ]);
}
