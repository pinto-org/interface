import { TokenValue } from "@/classes/TokenValue";
import { ZERO_ADDRESS, ZERO_ADDRESS_HEX } from "@/constants/address";
import { SEEDS, STALK } from "@/constants/internalTokens";
import { PINTO } from "@/constants/tokens";
import {
  beanstalkAbi,
  useReadFarmer_BalanceOfGrownStalkMultiple,
  useReadFarmer_GetMowStatus,
} from "@/generated/contractHooks";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { stringEq } from "@/utils/string";
import { getTokenIndex } from "@/utils/token";
import { DepositData, Token, TokenDepositData } from "@/utils/types";
import { unpackStem } from "@/utils/utils";
import { useCallback, useMemo } from "react";
import { Address, decodeAbiParameters, encodeFunctionData, parseAbiItem, toHex } from "viem";
import { useAccount, useChainId, useConfig, usePublicClient, useReadContract, useSimulateContract } from "wagmi";
import { usePriceData } from "./usePriceData";
import { useSiloData } from "./useSiloData";
import useTokenData from "./useTokenData";

interface DepositQuery {
  id: bigint;
  season?: number;
  stem: bigint;
  depositedAmount: bigint;
  depositedBDV: bigint;
}

function calculateGerminationInfo(stem: TokenValue, stemTip: TokenValue, stalkEarnedPerSeason: TokenValue) {
  const SEASON_LENGTH = 3600;
  const germinatingStem = stemTip.sub(stalkEarnedPerSeason);
  if (stem.lt(germinatingStem)) {
    return undefined;
  }

  const seasonsElapsed = stemTip.sub(stem).div(stalkEarnedPerSeason || 1n);
  const remainingSeasons = Math.max(0, 2 - Number(seasonsElapsed.toHuman()));
  const now = new Date();
  const currentHour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours());
  return new Date(currentHour.getTime() + remainingSeasons * SEASON_LENGTH * 1000);
}

function getFloodCallArguments(whitelistedTokens: Token[], account: `0x${string}`) {
  const tokensToMow = whitelistedTokens.map((token: Token) => token.address);

  const mow = encodeFunctionData({
    abi: beanstalkAbi,
    functionName: "mowMultiple",
    args: [account, tokensToMow],
  });

  const balanceOfSop = encodeFunctionData({
    abi: beanstalkAbi,
    functionName: "balanceOfSop",
    args: [account],
  });

  return [mow, balanceOfSop];
}

const querySettings = {
  staleTime: 1000 * 60 * 20,
  refetchInterval: 1000 * 60 * 20,
};

const abiSnippet = [
  {
    name: "balanceOfSop",
    outputs: [
      {
        components: [
          {
            internalType: "uint32",
            name: "lastRain",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "lastSop",
            type: "uint32",
          },
          {
            internalType: "uint256",
            name: "roots",
            type: "uint256",
          },
          {
            components: [
              {
                internalType: "address",
                name: "well",
                type: "address",
              },
              {
                components: [
                  {
                    internalType: "uint256",
                    name: "plentyPerRoot",
                    type: "uint256",
                  },
                  {
                    internalType: "uint256",
                    name: "plenty",
                    type: "uint256",
                  },
                  {
                    internalType: "bytes32[4]",
                    name: "_buffer",
                    type: "bytes32[4]",
                  },
                ],
                internalType: "struct PerWellPlenty",
                name: "wellsPlenty",
                type: "tuple",
              },
            ],
            internalType: "struct SiloGettersFacet.FarmerSops[]",
            name: "farmerSops",
            type: "tuple[]",
          },
        ],
        internalType: "struct SiloGettersFacet.AccountSeasonOfPlenty",
        name: "sop",
        type: "tuple",
      },
    ],
  },
] as const;

export function useFarmerSiloNew(address?: `0x${string}`) {
  const account = useAccount();
  const chainId = useChainId();
  const config = useConfig();
  const client = usePublicClient();
  const BEAN = useTokenData().mainToken;
  const tokenData = useTokenData();
  const siloData = useSiloData();
  const SILO_WHITELIST = tokenData.whitelistedTokens;
  const protocolAddress = useProtocolAddress();
  const priceData = usePriceData();
  const currPrice = priceData.price;

  const farmerAddress = address ?? account.address;

  // Base farmer stalk data
  const activeStalkBalance = useReadContract({
    address: protocolAddress,
    abi: beanstalkAbi,
    functionName: "balanceOfStalk",
    args: [farmerAddress ?? ZERO_ADDRESS],
    query: {
      enabled: Boolean(farmerAddress),
      select: (data) => TokenValue.fromBlockchain(data ?? 0n, STALK.decimals),
    },
  });

  const earnedBeansBalance = useReadContract({
    address: protocolAddress,
    abi: beanstalkAbi,
    functionName: "balanceOfEarnedBeans",
    args: [farmerAddress ?? ZERO_ADDRESS],
    query: {
      enabled: Boolean(farmerAddress),
      select: (data) => TokenValue.fromBlockchain(data ?? 0n, BEAN.decimals),
    },
  });

  // Fetch deposit data
  const { data: deposits } = useReadContract({
    address: protocolAddress,
    abi: beanstalkAbi,
    functionName: "getDepositsForAccount",
    args: [farmerAddress as Address],
    query: {
      ...querySettings,
      enabled: Boolean(farmerAddress),
    },
  });

  const { data: roots, ...rootsQuery } = useReadContract({
    address: protocolAddress,
    abi: beanstalkAbi,
    functionName: "balanceOfRoots",
    args: [farmerAddress as Address],
    query: {
      ...querySettings,
      enabled: Boolean(farmerAddress),
    },
  });

  // Fetch grown stalk data
  const whitelistAddresses = useMemo(() => SILO_WHITELIST.map((token) => token.address), [SILO_WHITELIST]);

  const grownStalkPerToken = useReadFarmer_BalanceOfGrownStalkMultiple({
    args: [farmerAddress ?? ZERO_ADDRESS, whitelistAddresses],
    query: {
      enabled: Boolean(farmerAddress),
      select: (data) => {
        const map = new Map<Token, TokenValue>();
        for (const [index, grownStalk] of data.entries()) {
          map.set(SILO_WHITELIST[index], TokenValue.fromBigInt(grownStalk, STALK.decimals));
        }
        return map;
      },
      ...querySettings,
      structuralSharing: false,
    },
  });

  // Fetch mow status data
  const mowStatusPerToken = useReadFarmer_GetMowStatus({
    args: [farmerAddress ?? ZERO_ADDRESS, whitelistAddresses],
    query: {
      enabled: Boolean(farmerAddress) && whitelistAddresses.length > 0 && SILO_WHITELIST.length > 0,
      select: (data) => {
        const map = new Map<Token, { lastStem: TokenValue; bdv: TokenValue }>();
        for (const [index, mowStatus] of data.entries()) {
          map.set(SILO_WHITELIST[index], {
            lastStem: TokenValue.fromBigInt(mowStatus.lastStem, BEAN.decimals),
            bdv: TokenValue.fromBigInt(mowStatus.bdv, BEAN.decimals),
          });
        }
        return map;
      },
      ...querySettings,
      structuralSharing: false,
    },
  });

  // Fetch flood data
  const floodData = useSimulateContract({
    address: protocolAddress,
    abi: beanstalkAbi,
    functionName: "farm",
    args: [getFloodCallArguments(SILO_WHITELIST, farmerAddress ?? ZERO_ADDRESS_HEX)],
    query: {
      enabled: Boolean(farmerAddress),
      select: (data) => decodeAbiParameters(abiSnippet[0].outputs, data.result[1])[0],
      ...querySettings,
    },
  });

  // Process deposits
  const depositsByToken = useMemo(() => {
    const depositMap = new Map<string, DepositQuery[]>();

    for (const deposit of deposits ?? []) {
      const tokenDeposits: DepositQuery[] = deposit.depositIds.map((depositId, index) => {
        const stem = unpackStem(depositId);
        const tokenDeposit = deposit.tokenDeposits[index];
        return {
          id: depositId,
          stem: stem,
          depositedAmount: tokenDeposit.amount,
          depositedBDV: tokenDeposit.bdv,
        };
      });

      depositMap.set(getTokenIndex(deposit.token), tokenDeposits);
    }

    return depositMap;
  }, [deposits]);

  // Process all farmer silo data
  const depositsData = useMemo(() => {
    const output = new Map<Token, TokenDepositData>();
    let _depositsBDV = TokenValue.ZERO;
    let _depositsUSD = TokenValue.ZERO;
    let _activeSeeds = TokenValue.ZERO;
    let _totalGerminatingStalk = TokenValue.ZERO;

    depositsByToken?.forEach((tokenDeposits, tokenIndex) => {
      const token = SILO_WHITELIST.find((t) => getTokenIndex(t) === tokenIndex);
      if (!token) return;
      const siloTokenData = siloData.tokenData.get(token);
      const pool = priceData.pools.find((poolData) => stringEq(poolData.pool.address, token.address));
      const poolPrice = pool?.price ?? TokenValue.ZERO;

      if (!token || !siloTokenData) return;

      const depositData: DepositData[] = [];
      const convertibleDeposits: DepositData[] = [];

      let amount = TokenValue.fromBlockchain(0n, token.decimals);
      let convertibleAmount = TokenValue.fromBlockchain(0n, token.decimals);
      let depositBDV = TokenValue.fromBlockchain(0n, BEAN.decimals);
      let currentBDV = TokenValue.fromBlockchain(0n, PINTO.decimals);
      let totalBaseStalk = TokenValue.fromBlockchain(0n, STALK.decimals);
      const totalGrownStalk = grownStalkPerToken.data?.get(token) || TokenValue.ZERO;
      let totalGerminatingStalk = TokenValue.fromBlockchain(0n, STALK.decimals);
      let totalSeeds = TokenValue.fromBlockchain(0n, SEEDS.decimals);

      tokenDeposits.forEach((deposit) => {
        const isGerminating = deposit.stem >= siloTokenData.germinatingStem.toBigInt();
        const _depositBDV = TokenValue.fromBlockchain(deposit.depositedBDV, BEAN.decimals);
        const depositStem = TokenValue.fromBlockchain(deposit.stem, BEAN.decimals);
        const lastStem = mowStatusPerToken.data?.get(token)?.lastStem ?? TokenValue.ZERO;
        const depositAmount = TokenValue.fromBlockchain(deposit.depositedAmount, token.decimals);
        const _currentBDV = depositAmount.mul(siloTokenData.tokenBDV);
        const seeds = _depositBDV.mul(siloTokenData.rewards.seeds);

        const totalStalkGrown = _depositBDV.mul(siloTokenData.stemTip.sub(depositStem)).div(10000);
        const mowableStalk = _depositBDV.mul(siloTokenData.stemTip.sub(lastStem)).div(10000);
        const grownStalk = mowableStalk;
        const _baseStalk = _depositBDV.mul(siloTokenData.rewards.stalk).add(totalStalkGrown.sub(mowableStalk));
        const baseStalk = isGerminating ? TokenValue.ZERO : _baseStalk;
        const germinatingStalk = isGerminating ? _baseStalk : TokenValue.ZERO;
        totalBaseStalk = totalBaseStalk.add(baseStalk);
        totalGerminatingStalk = totalGerminatingStalk.add(germinatingStalk);
        totalSeeds = totalSeeds.add(seeds);

        amount = amount.add(depositAmount);
        depositBDV = depositBDV.add(_depositBDV);
        currentBDV = currentBDV.add(_currentBDV).reDecimal(BEAN.decimals);

        const germinationDate = calculateGerminationInfo(
          depositStem,
          siloTokenData.stemTip,
          siloTokenData.tokenSettings.stalkEarnedPerSeason,
        );

        const thisDeposit: DepositData = {
          id: deposit.id,
          idHex: toHex(deposit.id),
          token: token,
          stemTipForToken: siloTokenData.stemTip,
          lastStem,
          stem: depositStem,
          season: deposit.season ?? 0,
          amount: depositAmount,
          depositBdv: _depositBDV,
          currentBdv: _currentBDV,
          stalk: {
            base: baseStalk,
            grown: grownStalk,
            germinating: germinatingStalk,
            total: baseStalk.add(grownStalk).add(germinatingStalk),
            grownSinceDeposit: totalStalkGrown,
          },
          seeds,
          isGerminating,
          germinationDate,
        };

        depositData.push(thisDeposit);
        if (!isGerminating) {
          convertibleAmount = convertibleAmount.add(depositAmount);
          convertibleDeposits.push(thisDeposit);
        }
      });

      output.set(token, {
        amount,
        convertibleAmount,
        currentBDV,
        depositBDV,
        stalk: {
          base: totalBaseStalk,
          grown: totalGrownStalk,
          germinating: totalGerminatingStalk,
          total: totalBaseStalk.add(totalGrownStalk).add(totalGerminatingStalk),
        },
        seeds: totalSeeds,
        deposits: depositData,
        convertibleDeposits,
      });

      _depositsBDV = _depositsBDV.add(depositBDV);
      _depositsUSD = _depositsUSD.add(token.isMain ? currentBDV.mul(currPrice) : currentBDV.mul(poolPrice));
      _activeSeeds = _activeSeeds.add(totalSeeds);
      _totalGerminatingStalk = _totalGerminatingStalk.add(totalGerminatingStalk);
    });

    return {
      deposits: output,
      depositsBDV: _depositsBDV,
      depositsUSD: _depositsUSD,
      activeSeeds: _activeSeeds,
      germinatingStalk: _totalGerminatingStalk,
    };
  }, [
    depositsByToken,
    SILO_WHITELIST,
    siloData.tokenData,
    // depositEvents.data,
    grownStalkPerToken.data,
    mowStatusPerToken.data,
    // plantEvents.data,
    currPrice,
    BEAN.decimals,
  ]);

  // Process flood data
  const floodInfo = useMemo(() => {
    const sops: {
      well: Token;
      backingAsset: Token;
      wellsPlenty: { plenty: TokenValue; plentyPerRoot: bigint };
    }[] = [];

    if (floodData.data && SILO_WHITELIST) {
      SILO_WHITELIST.forEach((token) => {
        if (floodData.data && token.tokens) {
          const sopToken = floodData.data.farmerSops.find(
            (farmerSop) => farmerSop.well.toLowerCase() === token.address.toLowerCase(),
          );
          const backingAssetAddress = token.tokens.find((tokenAddress) => tokenAddress !== BEAN.address);
          if (backingAssetAddress) {
            const backingAsset = tokenData.preferredTokens.find(
              (preferredToken) => backingAssetAddress.toLowerCase() === preferredToken.address.toLowerCase(),
            );
            if (sopToken && backingAsset) {
              sops.push({
                well: token,
                backingAsset,
                wellsPlenty: {
                  plenty: TokenValue.fromBlockchain(sopToken.wellsPlenty.plenty, backingAsset.decimals),
                  plentyPerRoot: sopToken.wellsPlenty.plentyPerRoot,
                },
              });
            }
          }
        }
      });
    }

    return {
      lastRain: floodData?.data?.lastRain ?? 0,
      lastSop: floodData?.data?.lastSop ?? 0,
      roots: floodData?.data?.roots ?? 0n,
      farmerSops: sops,
    };
  }, [floodData.data, SILO_WHITELIST, BEAN.address, tokenData.preferredTokens]);

  // Combine query keys
  const queryKeys = useMemo(
    () => [
      activeStalkBalance.queryKey,
      earnedBeansBalance.queryKey,
      grownStalkPerToken.queryKey,
      mowStatusPerToken.queryKey,
      floodData.queryKey,
      rootsQuery.queryKey,
    ],
    [
      activeStalkBalance.queryKey,
      earnedBeansBalance.queryKey,
      grownStalkPerToken.queryKey,
      mowStatusPerToken.queryKey,
      floodData.queryKey,
      rootsQuery.queryKey,
    ],
  );

  const grownStalkReward = useMemo(() => {
    if (!grownStalkPerToken.data) return TokenValue.ZERO;
    return Array.from(grownStalkPerToken.data).reduce((acc, curr) => acc.add(curr[1]), TokenValue.ZERO);
  }, [grownStalkPerToken.data]);

  return {
    // Balances
    activeStalkBalance: activeStalkBalance.data ?? TokenValue.ZERO,
    earnedBeansBalance: earnedBeansBalance.data ?? TokenValue.ZERO,
    germinatingStalkBalance: depositsData.germinatingStalk,
    activeSeedsBalance: depositsData.activeSeeds,
    grownStalkReward: grownStalkReward,

    // roots
    rootsBalance: roots ?? 0n,

    // Deposits
    depositsBDV: depositsData.depositsBDV,
    depositsUSD: depositsData.depositsUSD,
    deposits: depositsData.deposits,

    // Token-specific data
    grownStalkPerToken: grownStalkPerToken.data,
    mowStatusPerToken: mowStatusPerToken.data,

    // Flood
    flood: floodInfo,

    // Is Loading
    isLoading:
      activeStalkBalance.isLoading ||
      earnedBeansBalance.isLoading ||
      floodData.isLoading ||
      grownStalkPerToken.isLoading ||
      mowStatusPerToken.isLoading,

    // Query management
    queryKeys,
    refetch: useCallback(() => {
      return Promise.all([
        activeStalkBalance.refetch(),
        earnedBeansBalance.refetch(),
        // plantEvents.refetch(),
        // depositEvents.refetch(),
        floodData.refetch(),
        grownStalkPerToken.refetch(),
        mowStatusPerToken.refetch(),
      ]);
    }, [
      activeStalkBalance,
      earnedBeansBalance,
      // plantEvents,
      // depositEvents,
      floodData,
      grownStalkPerToken,
      mowStatusPerToken,
    ]),
  };
}
