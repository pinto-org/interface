import { TokenValue } from "@/classes/TokenValue";
import { ZERO_ADDRESS } from "@/constants/address";
import { SEEDS, STALK } from "@/constants/internalTokens";
import {
  beanstalkAbi,
  useReadFarmer_BalanceOfGrownStalkMultiple,
  useReadFarmer_GetMowStatus,
} from "@/generated/contractHooks";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { stringEq } from "@/utils/string";
import { getTokenIndex } from "@/utils/token";
import { DepositData, Token, TokenDepositData } from "@/utils/types";
import { depositAvailability, readDepositsWithLocks } from "@/utils/depositLocks";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { Address, decodeAbiParameters, encodeFunctionData, toHex } from "viem";
import { useAccount, useChainId, useConfig, useReadContract, useSimulateContract } from "wagmi";
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

// Stable query settings at module level
const QUERY_SETTINGS = {
  staleTime: 1000 * 60 * 20, // 20 minutes
  refetchInterval: 1000 * 60 * 20, // 20 minutes
} as const;

const QUERY_SETTINGS_NO_SHARING = {
  ...QUERY_SETTINGS,
  structuralSharing: false,
} as const;

// Create stable selector functions outside the component
const createSelectGrownStalkPerToken = (whitelist: Token[]) => (data: readonly bigint[]) => {
  const map = new Map<Token, TokenValue>();
  for (const [index, grownStalk] of data.entries()) {
    map.set(whitelist[index], TokenValue.fromBigInt(grownStalk, STALK.decimals));
  }
  return map;
};

const createSelectMowStatusPerToken = (whitelist: Token[], mainToken: Token) => (data: FarmerMowStatuses) => {
  const map = new Map<Token, { lastStem: TokenValue; bdv: TokenValue }>();

  if (!mainToken) {
    return map;
  }

  for (const [index, mowStatus] of data.entries()) {
    map.set(whitelist[index], {
      lastStem: TokenValue.fromBigInt(mowStatus.lastStem, mainToken.decimals),
      bdv: TokenValue.fromBigInt(mowStatus.bdv, mainToken.decimals),
    });
  }
  return map;
};

/**
 * Selector for fetching all farmer deposits across all whitelisted tokens. Used in the useFarmerSiloDepositsQuery hook.
 *
 * @param tokens - The tokens to fetch deposits for
 * @returns A selector function that transforms the contract response into a map of token indices to their deposit arrays
 */
// Deposits and their locks are read at the same block, including historical tokens.
const mapDeposits = (snapshot: Awaited<ReturnType<typeof readDepositsWithLocks>>, tokens: Token[]) => {
  const depositMap = new Map<string, DepositQuery[]>();
  for (const result of snapshot.deposits) {
    const token = tokens.find((candidate) => stringEq(candidate.address, result.token));
    if (!token) continue;
    depositMap.set(
      getTokenIndex(token),
      result.depositIds.map((id, index) => ({
        id,
        stem: BigInt.asIntN(96, id),
        depositedAmount: result.tokenDeposits[index].amount,
        depositedBDV: result.tokenDeposits[index].bdv,
      })),
    );
  }
  return depositMap;
};

const selectFloodData = (data: { result: readonly `0x${string}`[] }) => {
  const decoded = decodeAbiParameters(abiSnippet[0].outputs, data.result[1])[0];
  return decoded;
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

/**
 * Hook for fetching all farmer deposits across all whitelisted tokens
 *
 * This query fetches deposit data for every token that has ever been whitelisted
 * in the silo, not just currently active ones. This ensures we don't lose track
 * of historical deposits even if tokens are later removed from the whitelist.
 *
 * The query runs in parallel for all tokens and transforms the raw contract
 * responses into a structured format for easier processing.
 *
 * Data Flow:
 * Reads deposits for all supported current/former whitelist tokens and their
 * output locks at one block. The single-argument getter excludes former tokens.
 *
 * @returns Query result containing a map of token indices to their deposit arrays
 */
const useFarmerSiloDepositsQuery = (farmerAddress?: Address) => {
  const diamond = useProtocolAddress();
  const config = useConfig();
  const chainId = useChainId();
  const { mainToken, mayBeWhitelistedTokens } = useTokenData();
  const tokens = useMemo(() => mayBeWhitelistedTokens.map((token) => token.address), [mayBeWhitelistedTokens]);
  const queryKey = useMemo(
    () => ["depositsWithLocks", chainId, diamond, farmerAddress, mainToken.address, tokens],
    [chainId, diamond, farmerAddress, mainToken.address, tokens],
  );
  const query = useQuery({
    queryKey,
    queryFn: () =>
      readDepositsWithLocks(config.getClient({ chainId }), diamond, farmerAddress!, mainToken.address, tokens),
    enabled: !!farmerAddress,
    staleTime: 10_000,
    refetchInterval: 15_000,
    refetchOnWindowFocus: true,
  });
  return { ...query, queryKey };
};

export function useFarmerSilo(address?: `0x${string}`, shouldLog?: boolean) {
  const account = useAccount();
  const { mainToken: BEAN, preferredTokens, mayBeWhitelistedTokens: maybeWLTokens } = useTokenData();
  const siloData = useSiloData();
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
      ...QUERY_SETTINGS,
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
      ...QUERY_SETTINGS,
      enabled: Boolean(farmerAddress),
      select: (data) => TokenValue.fromBlockchain(data ?? 0n, BEAN.decimals),
    },
  });

  // Fetch deposit data
  const depositsQuery = useFarmerSiloDepositsQuery(farmerAddress);
  const depositsByToken = useMemo(
    () => (depositsQuery.data ? mapDeposits(depositsQuery.data, maybeWLTokens) : undefined),
    [depositsQuery.data, maybeWLTokens],
  );

  const { data: roots, ...rootsQuery } = useReadContract({
    address: protocolAddress,
    abi: beanstalkAbi,
    functionName: "balanceOfRoots",
    args: [farmerAddress as Address],
    query: {
      ...QUERY_SETTINGS,
      enabled: Boolean(farmerAddress),
    },
  });

  const maybeWLAddresses = useMemo(() => maybeWLTokens.map((token) => token.address), [maybeWLTokens]);

  // Fetch grown stalk data
  const selectMowStatusPerToken = useMemo(
    () => createSelectMowStatusPerToken(maybeWLTokens, BEAN),
    [maybeWLTokens, BEAN],
  );

  const selectGrownStalkPerToken = useMemo(() => createSelectGrownStalkPerToken(maybeWLTokens), [maybeWLTokens]);

  const grownStalkPerToken = useReadFarmer_BalanceOfGrownStalkMultiple({
    args: [farmerAddress ?? ZERO_ADDRESS, maybeWLAddresses],
    query: {
      enabled: Boolean(farmerAddress) && maybeWLAddresses.length > 0,
      select: selectGrownStalkPerToken,
      ...QUERY_SETTINGS_NO_SHARING,
    },
  });

  // Fetch mow status data
  const mowStatusPerToken = useReadFarmer_GetMowStatus({
    args: [farmerAddress ?? ZERO_ADDRESS, maybeWLAddresses],
    query: {
      enabled: Boolean(farmerAddress) && maybeWLAddresses.length > 0,
      select: selectMowStatusPerToken,
      ...QUERY_SETTINGS_NO_SHARING,
    },
  });

  // Fetch flood data with stable arguments
  const floodArgs: readonly [readonly `0x${string}`[]] | undefined = useMemo(() => {
    if (!farmerAddress || !maybeWLTokens.length) return undefined;
    return [getFloodCallArguments(maybeWLTokens, farmerAddress)] as const;
  }, [farmerAddress, maybeWLTokens]);

  const floodData = useSimulateContract({
    address: protocolAddress,
    abi: beanstalkAbi,
    functionName: "farm",
    args: floodArgs,
    query: {
      enabled: Boolean(farmerAddress) && Boolean(floodArgs),
      select: selectFloodData,
      ...QUERY_SETTINGS,
    },
  });

  // Process all farmer silo data
  const depositsData = useMemo(() => {
    const minValidBdv = TokenValue.fromHuman(0.000001, BEAN.decimals);

    const output = new Map<Token, TokenDepositData>();
    let _depositsBDV = TokenValue.ZERO;
    let _depositsUSD = TokenValue.ZERO;
    let _activeSeeds = TokenValue.ZERO;
    let _totalGerminatingStalk = TokenValue.ZERO;

    depositsByToken?.forEach((tokenDeposits, tokenIndex) => {
      const token = maybeWLTokens.find((t) => getTokenIndex(t) === tokenIndex);
      if (!token) return;
      const siloTokenData = siloData.tokenData.get(token);
      const pool = priceData.pools.find((poolData) => stringEq(poolData.pool.address, token.address));
      const poolPrice = pool?.price ?? TokenValue.ZERO;

      if (!siloTokenData) return;

      const depositData: DepositData[] = [];
      const convertibleDeposits: DepositData[] = [];

      let amount = TokenValue.fromBlockchain(0n, token.decimals);
      let unlockedAmount = TokenValue.fromBlockchain(0n, token.decimals);
      let totalLockedAmount = TokenValue.fromBlockchain(0n, token.decimals);
      let convertibleAmount = TokenValue.fromBlockchain(0n, token.decimals);
      let depositBDV = TokenValue.fromBlockchain(0n, BEAN.decimals);
      let currentBDV = TokenValue.fromBlockchain(0n, BEAN.decimals);
      let totalBaseStalk = TokenValue.fromBlockchain(0n, STALK.decimals);
      const totalGrownStalk = grownStalkPerToken.data?.get(token) || TokenValue.ZERO;
      let totalGerminatingStalk = TokenValue.fromBlockchain(0n, STALK.decimals);
      let totalSeeds = TokenValue.fromBlockchain(0n, SEEDS.decimals);

      tokenDeposits.forEach((deposit) => {
        const isGerminating = deposit.stem >= siloTokenData.germinatingStem.toBigInt();
        const _depositBDV = TokenValue.fromBlockchain(deposit.depositedBDV, BEAN.decimals);
        const depositAmount = TokenValue.fromBlockchain(deposit.depositedAmount, token.decimals);
        const lock = depositsQuery.data?.locks[deposit.id.toString()];
        const availability = depositAvailability(
          deposit.depositedAmount,
          lock,
          depositsQuery.data?.timestamp ?? 0,
          depositsQuery.isError,
        );
        const lockedAmount = TokenValue.fromBlockchain(availability.locked, token.decimals);
        // Preserve last known ownership on RPC failure, but do not spend stale crates.
        const availableAmount = TokenValue.fromBlockchain(availability.available, token.decimals);
        const _currentBDV = depositAmount.mul(siloTokenData.tokenBDV);

        // 0.000001 is the minimum BDV for a deposit to be considered valid so we don't run into divide by 0 errors
        if (
          (token.isWhitelisted && _currentBDV.lt(minValidBdv)) ||
          (!token.isWhitelisted && _depositBDV.lt(minValidBdv))
        ) {
          return;
        }

        const depositStem = TokenValue.fromBlockchain(deposit.stem, BEAN.decimals);
        const lastStem = mowStatusPerToken.data?.get(token)?.lastStem ?? TokenValue.ZERO;
        const seeds = _depositBDV.mul(siloTokenData.rewards.seeds);

        const stalkAtDeposit = _depositBDV.reDecimal(STALK.decimals);
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
        unlockedAmount = unlockedAmount.add(availableAmount);
        totalLockedAmount = totalLockedAmount.add(lockedAmount);
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
          lockedAmount,
          unlockedAmount: availableAmount,
          unlockAt: lock?.unlockAt,
          depositBdv: _depositBDV,
          currentBdv: _currentBDV,
          stalk: {
            initial: stalkAtDeposit,
            base: baseStalk.reDecimal(STALK.decimals),
            grown: grownStalk.reDecimal(STALK.decimals),
            germinating: germinatingStalk.reDecimal(STALK.decimals),
            total: baseStalk.add(grownStalk).add(germinatingStalk).reDecimal(STALK.decimals),
            grownSinceDeposit: totalStalkGrown.reDecimal(STALK.decimals),
          },
          seeds,
          isGerminating,
          germinationDate,
        };

        depositData.push(thisDeposit);

        if (!isGerminating) {
          convertibleAmount = convertibleAmount.add(availableAmount);
          convertibleDeposits.push(thisDeposit);
        }
      });

      output.set(token, {
        amount,
        unlockedAmount,
        // Failed reads disable spending, but do not create a protocol output lock.
        lockedAmount: totalLockedAmount,
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

      const bdvToUse = token.isWhitelisted ? currentBDV : depositBDV;

      _depositsBDV = _depositsBDV.add(depositBDV);
      _depositsUSD = _depositsUSD.add(token.isMain ? bdvToUse.mul(currPrice) : bdvToUse.mul(poolPrice));
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
    depositsQuery.data,
    depositsQuery.isError,
    maybeWLTokens,
    siloData.tokenData,
    priceData.price,
    grownStalkPerToken.data,
    mowStatusPerToken.data,
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

    if (floodData.data && maybeWLTokens) {
      maybeWLTokens.forEach((token) => {
        if (floodData.data && token.tokens) {
          const sopToken = floodData.data.farmerSops.find(
            (farmerSop) => farmerSop.well.toLowerCase() === token.address.toLowerCase(),
          );
          const backingAssetAddress = token.tokens.find((tokenAddress) => tokenAddress !== BEAN.address);
          if (backingAssetAddress) {
            const backingAsset = preferredTokens.find(
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
  }, [floodData.data, maybeWLTokens, BEAN.address, preferredTokens]);

  // Combine query keys
  const queryKeys = useMemo(
    () => [
      activeStalkBalance.queryKey,
      earnedBeansBalance.queryKey,
      grownStalkPerToken.queryKey,
      mowStatusPerToken.queryKey,
      depositsQuery.queryKey,
      floodData.queryKey,
      rootsQuery.queryKey,
    ],
    [
      activeStalkBalance.queryKey,
      earnedBeansBalance.queryKey,
      grownStalkPerToken.queryKey,
      mowStatusPerToken.queryKey,
      depositsQuery.queryKey,
      floodData.queryKey,
      rootsQuery.queryKey,
    ],
  );

  const grownStalkReward = useMemo(() => {
    if (!grownStalkPerToken.data) return TokenValue.ZERO;
    return Array.from(grownStalkPerToken.data).reduce((acc, curr) => acc.add(curr[1]), TokenValue.ZERO);
  }, [grownStalkPerToken.data]);

  const refetch = useCallback(async () => {
    return Promise.all([
      activeStalkBalance.refetch(),
      earnedBeansBalance.refetch(),
      depositsQuery.refetch(),
      // plantEvents.refetch(),
      // depositEvents.refetch(),
      floodData.refetch(),
      grownStalkPerToken.refetch(),
      mowStatusPerToken.refetch(),
    ]);
  }, [
    activeStalkBalance.refetch,
    earnedBeansBalance.refetch,
    depositsQuery.refetch,
    floodData.refetch,
    grownStalkPerToken.refetch,
    mowStatusPerToken.refetch,
  ]);

  const queriesLoading =
    activeStalkBalance.isLoading ||
    earnedBeansBalance.isLoading ||
    depositsQuery.isLoading ||
    floodData.isLoading ||
    grownStalkPerToken.isLoading ||
    mowStatusPerToken.isLoading;

  const queriesLessFloodInfoLoading =
    activeStalkBalance.isLoading ||
    earnedBeansBalance.isLoading ||
    depositsQuery.isLoading ||
    grownStalkPerToken.isLoading ||
    mowStatusPerToken.isLoading;

  return useMemo(
    () => ({
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
      isLoading: queriesLoading,
      // Is Loading without flood info. Flood Info fetches after some of the other queries, so it can cause flickering
      isLoadingLessFlood: queriesLessFloodInfoLoading,

      // Query management
      queryKeys,
      refetch: refetch,
      depositsError: depositsQuery.error,
      autoConvertSupported: depositsQuery.data?.supported ?? false,
      isRefreshingDeposits: depositsQuery.isFetching,
    }),
    [
      activeStalkBalance.data,
      earnedBeansBalance.data,
      depositsData.germinatingStalk,
      depositsData.activeSeeds,
      grownStalkReward,
      roots,
      depositsData.depositsBDV,
      depositsData.depositsUSD,
      depositsData.deposits,
      grownStalkPerToken.data,
      mowStatusPerToken.data,
      floodInfo,
      queriesLoading,
      queriesLessFloodInfoLoading,
      queryKeys,
      refetch,
      depositsQuery.error,
      depositsQuery.data?.supported,
      depositsQuery.isFetching,
    ],
  );
}

type FarmerMowStatuses = readonly {
  lastStem: bigint;
  bdv: bigint;
}[];
