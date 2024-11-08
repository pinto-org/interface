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
import { useSunData } from "./useSunData";
import useTokenData from "./useTokenData";

interface DepositQuery {
  id: bigint;
  season?: number | undefined;
  stem: bigint;
  depositedAmount: bigint;
  depositedBDV: bigint;
}

const querySettings = {
  staleTime: 1000 * 60 * 3,
  refetchInterval: 1000 * 60 * 3, // 3 minutes, in milliseconds
};

function useFarmerDepositedBalances() {
  const account = useAccount();
  const season = useSunData().current;
  const silo = useSiloData();
  const BEAN = useTokenData().mainToken;
  const diamondAddress = useChainAddress(beanstalkAddress);

  const tokenMap = useTokenMap();

  const { data, refetch, queryKey } = useReadContract({
    address: diamondAddress,
    abi: beanstalkAbi,
    functionName: "getDepositsForAccount",
    args: [account.address as Address],
    scopeKey: ["season", season].join(" "),
    query: {
      ...querySettings,
      enabled: !!account.address,
    },
  });

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
      let totalStalk: TokenValue = TokenValue.fromBlockchain(0n, STALK.decimals);
      let totalSeeds: TokenValue = TokenValue.fromBlockchain(0n, SEEDS.decimals);

      tokenDeposits.forEach((deposit) => {
        const isGerminating = deposit.stem >= siloTokenData.germinatingStem.toBigInt();
        const _depositBDV = TokenValue.fromBlockchain(deposit.depositedBDV, BEAN.decimals);
        const depositStem = TokenValue.fromBlockchain(deposit.stem, BEAN.decimals);
        const baseStalk = isGerminating
          ? TokenValue.fromBlockchain(0n, STALK.decimals)
          : _depositBDV.mul(siloTokenData.rewards.seeds);
        const grownStalk = _depositBDV.mul(siloTokenData.stemTip.sub(depositStem)).div(10000);
        const seeds = _depositBDV.mul(siloTokenData.rewards.seeds);
        const depositAmount = TokenValue.fromBlockchain(deposit.depositedAmount, token.decimals);
        const _currentBDV = depositAmount.mul(siloTokenData.tokenBDV);

        totalBaseStalk = totalBaseStalk.add(baseStalk);
        totalGrownStalk = totalGrownStalk.add(grownStalk);
        totalStalk = totalStalk.add(baseStalk.add(grownStalk));
        totalSeeds = totalSeeds.add(seeds);

        amount = amount.add(depositAmount);
        depositBDV = depositBDV.add(_depositBDV);
        currentBDV = currentBDV.add(_currentBDV).reDecimal(BEAN.decimals);

        const thisDeposit: DepositData = {
          id: deposit.id,
          idHex: toHex(deposit.id).toString(),
          token: token,
          stemTipForToken: siloTokenData.stemTip,
          stem: depositStem,
          season: deposit.season ?? 0,
          amount: depositAmount,
          depositBdv: _depositBDV,
          currentBdv: _currentBDV,
          stalk: {
            base: baseStalk,
            grown: grownStalk,
            total: baseStalk.add(grownStalk),
          },
          seeds: seeds,
          isGerminating: isGerminating,
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
          total: totalStalk,
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
      refetch,
    };
  }, [depositsData, queryKey, refetch]);
}

export default useFarmerDepositedBalances;
