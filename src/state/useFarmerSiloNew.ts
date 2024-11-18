import { TokenValue } from "@/classes/TokenValue";
import { ZERO_ADDRESS } from "@/constants/address";
import { SEEDS, STALK } from "@/constants/internalTokens";
import { PINTO } from "@/constants/tokens";
import {
  beanstalkAbi,
  useReadFarmer_BalanceOfGrownStalkMultiple,
  useReadFarmer_GetMowStatus,
} from "@/generated/contractHooks";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { getTokenIndex } from "@/utils/token";
import { DepositData, Token, TokenDepositData } from "@/utils/types";
import { identifyPlantDeposits, isDev, unpackStem } from "@/utils/utils";
import { useQuery } from "@tanstack/react-query";
import { getBlockNumber } from "@wagmi/core";
import { useMemo } from "react";
import { Address, parseAbiItem, toHex } from "viem";
import { useAccount, useChainId, useConfig, usePublicClient, useReadContract } from "wagmi";
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
  console.log("stem", stem, stemTip, germinatingStem);
  if (stem.lt(germinatingStem)) {
    return undefined;
  }

  const seasonsElapsed = stemTip.sub(stem).div(stalkEarnedPerSeason);
  const remainingSeasons = Math.max(0, 2 - Number(seasonsElapsed.toHuman()));
  const now = new Date();
  const currentHour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours());
  return new Date(currentHour.getTime() + remainingSeasons * SEASON_LENGTH * 1000);
}

const querySettings = {
  staleTime: 1000 * 60 * 20,
  refetchInterval: 1000 * 60 * 20,
};

export function useFarmerSiloNew() {
  const account = useAccount();
  const chainId = useChainId();
  const config = useConfig();
  const client = usePublicClient();
  const BEAN = useTokenData().mainToken;
  const tokenData = useTokenData();
  const siloData = useSiloData();
  const SILO_WHITELIST = tokenData.whitelistedTokens;
  const protocolAddress = useProtocolAddress();
  const currPrice = usePriceData().price;

  // Base farmer stalk data
  const activeStalkBalance = useReadContract({
    address: protocolAddress,
    abi: beanstalkAbi,
    functionName: "balanceOfStalk",
    args: [account.address ?? ZERO_ADDRESS],
    query: {
      enabled: Boolean(account.address),
      select: (data) => TokenValue.fromBlockchain(data ?? 0n, STALK.decimals),
    },
  });

  const earnedBeansBalance = useReadContract({
    address: protocolAddress,
    abi: beanstalkAbi,
    functionName: "balanceOfEarnedBeans",
    args: [account.address ?? ZERO_ADDRESS],
    query: {
      enabled: Boolean(account.address),
      select: (data) => TokenValue.fromBlockchain(data ?? 0n, BEAN.decimals),
    },
  });

  // Fetch deposit data
  const { data: deposits } = useReadContract({
    address: protocolAddress,
    abi: beanstalkAbi,
    functionName: "getDepositsForAccount",
    args: [account.address as Address],
    query: {
      ...querySettings,
      enabled: Boolean(account.address),
    },
  });

  // Fetch Plant events
  const plantEvents = useQuery({
    queryKey: ["plantEvents", account.address, chainId],
    queryFn: async () => {
      if (!config || !client || !protocolAddress) return;
      // Get current block
      const currentBlock = await getBlockNumber(config);

      // Calculate blocks in the past N hours (2 second block time)
      // 3600 seconds in an hour / 2 seconds per block = 1800 blocks per hour
      const blocksPerHour = isDev() ? 4 : 1800;
      const hoursAgo = 2;
      const blockRange = BigInt(blocksPerHour * hoursAgo);

      // Get events from the specified time period
      const logs = await client.getLogs({
        address: protocolAddress,
        event: parseAbiItem("event Plant(address indexed account, uint256 beans)"),
        fromBlock: currentBlock - blockRange,
        toBlock: currentBlock,
        args: {
          account: account.address,
        },
      });

      return logs.map((log) => ({
        amount: log.args.beans || 0n,
        blockHash: log.blockHash,
        transactionHash: log.transactionHash,
      }));
    },
    enabled: Boolean(account.address && config && client),
    ...querySettings,
  });

  // Fetch Deposit events
  const depositEvents = useQuery({
    queryKey: ["depositEvents", account.address, chainId],
    queryFn: async () => {
      if (!config || !client || !protocolAddress) return;
      // Get current block
      const currentBlock = await getBlockNumber(config);

      // Calculate blocks in the past N hours (2 second block time)
      // 3600 seconds in an hour / 2 seconds per block = 1800 blocks per hour
      const blocksPerHour = 1800;
      const hoursAgo = 2;
      const blockRange = BigInt(blocksPerHour * hoursAgo);

      // Get events from the specified time period
      const logs = await client.getLogs({
        address: protocolAddress,
        event: parseAbiItem(
          "event AddDeposit(address indexed account, address indexed token, int96 stem, uint256 amount, uint256 bdv)",
        ),
        fromBlock: currentBlock - blockRange,
        toBlock: currentBlock,
        args: {
          account: account.address,
          token: BEAN.address,
        },
      });

      return logs.map((log) => ({
        amount: log.args.amount || 0n,
        stem: BigInt(log.args.stem || 0),
        blockHash: log.blockHash,
        transactionHash: log.transactionHash,
      }));
    },
    enabled: Boolean(account.address && config && client),
    ...querySettings,
  });

  // Fetch grown stalk data
  const whitelistAddresses = useMemo(() => SILO_WHITELIST.map((token) => token.address), [SILO_WHITELIST]);

  const grownStalkPerToken = useReadFarmer_BalanceOfGrownStalkMultiple({
    args: [account.address ?? ZERO_ADDRESS, whitelistAddresses],
    query: {
      enabled: Boolean(account.address),
      select: (data) => {
        const map = new Map<Token, TokenValue>();
        for (const [index, grownStalk] of data.entries()) {
          map.set(SILO_WHITELIST[index], TokenValue.fromBigInt(grownStalk, STALK.decimals));
        }
        return map;
      },
    },
  });

  // Fetch mow status data
  const mowStatusPerToken = useReadFarmer_GetMowStatus({
    args: [account.address ?? ZERO_ADDRESS, whitelistAddresses],
    query: {
      enabled: Boolean(account.address) && whitelistAddresses.length > 0 && SILO_WHITELIST.length > 0,
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
    },
  });

  // Fetch flood data
  const floodData = useReadContract({
    address: protocolAddress,
    abi: beanstalkAbi,
    functionName: "balanceOfSop",
    args: [account.address ?? ZERO_ADDRESS],
    query: {
      enabled: Boolean(account.address),
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

      if (!token || !siloTokenData) return;

      const plantDepositMap = token.isMain
        ? identifyPlantDeposits(tokenDeposits, plantEvents.data, depositEvents.data)
        : undefined;

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

      console.log("plantdepositmap: ", plantDepositMap);
      tokenDeposits.forEach((deposit) => {
        const plantInfo = !plantDepositMap
          ? undefined
          : plantDepositMap.get(deposit.id.toString()) || {
              isPlantDeposit: false,
              plantedAmount: 0n,
            };

        console.log("DEPOSIT: ", deposit);
        const isPlantDeposit = plantInfo?.isPlantDeposit;
        const isGerminating = plantInfo?.isPlantDeposit || deposit.stem >= siloTokenData.germinatingStem.toBigInt();
        const _depositBDV = TokenValue.fromBlockchain(deposit.depositedBDV, BEAN.decimals);
        const depositStem = TokenValue.fromBlockchain(deposit.stem, BEAN.decimals);
        const lastStem = mowStatusPerToken.data?.get(token)?.lastStem ?? TokenValue.ZERO;
        const depositAmount = TokenValue.fromBlockchain(deposit.depositedAmount, token.decimals);
        const _currentBDV = depositAmount.mul(siloTokenData.tokenBDV);
        const seeds = _depositBDV.mul(siloTokenData.rewards.seeds);

        let baseStalk: TokenValue;
        let grownStalk: TokenValue;
        let germinatingStalk: TokenValue;

        if (isGerminating) {
          baseStalk = isPlantDeposit ? TokenValue.fromBigInt(plantInfo.plantedAmount, token.decimals) : TokenValue.ZERO;
          grownStalk = TokenValue.ZERO;
          germinatingStalk = seeds
            .div(siloTokenData.rewards.seeds)
            .mul(siloTokenData.rewards.stalk)
            .sub(TokenValue.fromBigInt(plantInfo?.plantedAmount || 0n, token.decimals));
        } else {
          const totalStalkGrown = _depositBDV.mul(siloTokenData.stemTip.sub(depositStem)).div(10000);
          const mowableStalk = _depositBDV.mul(siloTokenData.stemTip.sub(lastStem)).div(10000);
          grownStalk = mowableStalk;
          baseStalk = _depositBDV.mul(siloTokenData.rewards.stalk).add(totalStalkGrown.sub(mowableStalk));
          germinatingStalk = TokenValue.ZERO;
        }

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
        console.log("germdate: ", germinationDate);

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
          },
          seeds,
          isPlantDeposit: Boolean(isPlantDeposit),
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
      _depositsUSD = _depositsUSD.add(depositBDV.mul(currPrice));
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
    grownStalkPerToken.data,
    mowStatusPerToken.data,
    plantEvents.data,
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
    ],
    [
      activeStalkBalance.queryKey,
      earnedBeansBalance.queryKey,
      grownStalkPerToken.queryKey,
      mowStatusPerToken.queryKey,
      floodData.queryKey,
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

    // Deposits
    depositsBDV: depositsData.depositsBDV,
    depositsUSD: depositsData.depositsUSD,
    deposits: depositsData.deposits,

    // Token-specific data
    grownStalkPerToken: grownStalkPerToken.data,
    mowStatusPerToken: mowStatusPerToken.data,

    // Flood
    flood: floodInfo,

    // Query management
    queryKeys,
    refetch: () => {
      return Promise.all([
        activeStalkBalance.refetch(),
        earnedBeansBalance.refetch(),
        grownStalkPerToken.refetch(),
        mowStatusPerToken.refetch(),
      ]);
    },
  };
}
