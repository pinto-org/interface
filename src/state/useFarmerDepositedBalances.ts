import { TokenValue } from "@/classes/TokenValue";
import { SEEDS, STALK } from "@/constants/internalTokens";
import { PINTO } from "@/constants/tokens";
import { beanstalkAbi, beanstalkAddress } from "@/generated/contractHooks";
import { useTokenMap } from "@/hooks/pinto/useTokenMap";
import { useChainAddress } from "@/utils/chain";
import { DepositData, Token, TokenDepositData } from "@/utils/types";
import { unpackStem } from "@/utils/utils";
import { useMemo } from "react";
import { Address, toHex } from "viem";
import { useAccount, useReadContract } from "wagmi";
import { getTokenIndex } from "./../utils/token";
import { useSiloData } from "./useSiloData";
import useTokenData from "./useTokenData";

interface DepositQuery {
  id: bigint;
  season?: number | undefined;
  stem: bigint;
  depositedAmount: bigint;
  depositedBDV: bigint;
}

function calculateGerminationInfo(stem: TokenValue, stemTip: TokenValue, stalkEarnedPerSeason: TokenValue) {
  // Each season is 60 minutes (3600 seconds)
  const SEASON_LENGTH = 3600;

  // Calculate germinating stem
  const germinatingStem = stemTip.sub(stalkEarnedPerSeason);

  // If not germinating, return undefined timestamp
  if (stem.lt(germinatingStem)) {
    return undefined;
  }

  // Calculate seasons elapsed
  const seasonsElapsed = stemTip.sub(stem).div(stalkEarnedPerSeason || 1n);
  const remainingSeasons = Math.max(0, 2 - Number(seasonsElapsed.toHuman()));

  // Get current time and round to previous hour
  const now = new Date();
  const currentHour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours());

  // Add remaining seasons (in hours) to current hour
  const germinationDate = new Date(currentHour.getTime() + remainingSeasons * SEASON_LENGTH * 1000);
  return germinationDate;
}

const querySettings = {
  staleTime: 1000 * 60 * 20, // 20 minutes, in milliseconds
  refetchInterval: 1000 * 60 * 20, // 20 minutes, in milliseconds
};

export function useFarmerDepositsForAccountQuery(address?: Address) {
  const diamondAddress = useChainAddress(beanstalkAddress);
  const account = useAccount();

  const readAddress = address ?? account.address;

  return useReadContract({
    address: diamondAddress,
    abi: beanstalkAbi,
    functionName: "getDepositsForAccount",
    args: [readAddress as Address],
    query: {
      ...querySettings,
      refetchOnWindowFocus: true,
      enabled: Boolean(readAddress),
    },
  });
}

function useFarmerDepositedBalances(farmerAddress?: Address) {
  const silo = useSiloData();
  const BEAN = useTokenData().mainToken;

  const tokenMap = useTokenMap();

  const { data, refetch, queryKey, isLoading } = useFarmerDepositsForAccountQuery(farmerAddress);

  const depositsByToken = useMemo(() => {
    const deposits: Map<string, DepositQuery[]> = new Map();
    for (const deposit of data ?? []) {
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

      deposits.set(getTokenIndex(deposit.token), tokenDeposits);
    }
    return deposits;
  }, [data]);

  const depositsData = useMemo(() => {
    const output: Map<Token, TokenDepositData> = new Map();

    depositsByToken?.forEach((tokenDeposits, tokenIndex) => {
      const token = tokenMap[tokenIndex];
      const siloTokenData = silo.tokenData.get(token);

      if (!token || !siloTokenData) return;

      const depositData: DepositData[] = [];
      const convertibleDeposits: DepositData[] = [];

      let amount = TokenValue.fromBlockchain(0n, token.decimals);
      let convertibleAmount = TokenValue.fromBlockchain(0n, token.decimals);
      let depositBDV = TokenValue.fromBlockchain(0n, BEAN.decimals);
      let currentBDV = TokenValue.fromBlockchain(0n, PINTO.decimals);
      let totalBaseStalk: TokenValue = TokenValue.fromBlockchain(0n, STALK.decimals);
      let totalGrownStalk: TokenValue = TokenValue.fromBlockchain(0n, STALK.decimals);
      let totalGerminatingStalk: TokenValue = TokenValue.fromBlockchain(0n, STALK.decimals);
      let totalSeeds: TokenValue = TokenValue.fromBlockchain(0n, SEEDS.decimals);

      tokenDeposits.forEach((deposit) => {
        const isGerminating = deposit.stem >= siloTokenData.germinatingStem.toBigInt();
        const _depositBDV = TokenValue.fromBlockchain(deposit.depositedBDV, BEAN.decimals);
        const depositStem = TokenValue.fromBlockchain(deposit.stem, BEAN.decimals);
        const depositAmount = TokenValue.fromBlockchain(deposit.depositedAmount, token.decimals);
        const _currentBDV = depositAmount.mul(siloTokenData.tokenBDV);
        const seeds = _depositBDV.mul(siloTokenData.rewards.seeds);

        let baseStalk: TokenValue;
        let grownStalk: TokenValue;
        let germinatingStalk: TokenValue;

        if (isGerminating) {
          // For germinating deposits:
          // - germinatingStalk is calculated from seeds using stalk/seed ratio
          // - baseStalk and grownStalk are 0
          baseStalk = TokenValue.fromBlockchain(0n, STALK.decimals);
          grownStalk = TokenValue.fromBlockchain(0n, STALK.decimals);
          germinatingStalk = seeds.div(siloTokenData.rewards.seeds || 1n).mul(siloTokenData.rewards.stalk);
        } else {
          // For non-germinating deposits:
          // - baseStalk is BDV * stalkPerBDV
          // - grownStalk is based on stem difference
          // - germinatingStalk is 0
          baseStalk = _depositBDV.mul(siloTokenData.rewards.stalk);
          grownStalk = _depositBDV.mul(siloTokenData.stemTip.sub(depositStem)).div(10000);
          germinatingStalk = TokenValue.fromBlockchain(0n, STALK.decimals);
        }

        totalBaseStalk = totalBaseStalk.add(baseStalk);
        totalGrownStalk = totalGrownStalk.add(grownStalk);
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
          idHex: toHex(deposit.id).toString(),
          token: token,
          stemTipForToken: siloTokenData.stemTip,
          lastStem: TokenValue.ZERO, // gotta keep typescript happy for now
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
            grownSinceDeposit: grownStalk,
          },
          seeds: seeds,
          isGerminating: isGerminating,
          germinationDate: germinationDate,
        };

        depositData.push(thisDeposit);
        if (!isGerminating) {
          convertibleAmount = convertibleAmount.add(depositAmount);
          convertibleDeposits.push(thisDeposit);
        }
      });

      output.set(token, {
        amount: amount,
        convertibleAmount: convertibleAmount,
        currentBDV: currentBDV,
        depositBDV: depositBDV,
        stalk: {
          base: totalBaseStalk,
          grown: totalGrownStalk,
          germinating: totalGerminatingStalk,
          total: totalBaseStalk.add(totalGrownStalk).add(totalGerminatingStalk),
        },
        seeds: totalSeeds,
        deposits: depositData,
        convertibleDeposits: convertibleDeposits,
      });
    });

    return output;
  }, [depositsByToken, silo.tokenData, tokenMap, BEAN.decimals]);

  return useMemo(() => {
    return {
      data: depositsData,
      queryKey: queryKey,
      isLoading: isLoading,
      refetch,
    };
  }, [depositsData, queryKey, isLoading, refetch]);
}

export default useFarmerDepositedBalances;
