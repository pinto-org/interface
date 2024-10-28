import { useMemo } from "react";
import { useAccount } from "wagmi";
import {
  useReadFarmer_BalanceOfSop,
  useReadFarmer_BalanceOfStalk,
  useReadFarmer_BalanceOfGrownStalk,
  useReadFarmer_BalanceOfEarnedBeans,
} from "@/generated/contractHooks";
import { TokenValue } from "@/classes/TokenValue";
import useFarmerDepositedBalances from "./useFarmerDepositedBalances";
import { usePriceData } from "./usePriceData";
import useTokenData from "./useTokenData";
import { STALK } from "@/constants/internalTokens";
import { Token } from "@/utils/types";
import { ZERO_ADDRESS } from "@/constants/address";
import { QueryKey } from "@tanstack/react-query";

function useGrownStalkPerTokenQuery(token: Token | undefined) {
  const account = useAccount();

  return useReadFarmer_BalanceOfGrownStalk({
    args: [account.address ?? ZERO_ADDRESS, token?.address ?? ZERO_ADDRESS],
    query: {
      enabled: !!account.address && !!token?.address,
    },
  });
}

function useGrownStalkPerTokenQueries() {
  const tokenData = useTokenData();
  const SILO_WHITELIST = tokenData.whitelistedTokens;

  const tokens = useMemo(() => SILO_WHITELIST.map((token) => token), [SILO_WHITELIST]);

  const wl0Data = useGrownStalkPerTokenQuery(tokens?.[0]);
  const wl1Data = useGrownStalkPerTokenQuery(tokens?.[1]);
  const wl2Data = useGrownStalkPerTokenQuery(tokens?.[2]);
  const wl3Data = useGrownStalkPerTokenQuery(tokens?.[3]);
  const wl4Data = useGrownStalkPerTokenQuery(tokens?.[4]);

  return useMemo(() => {
    const datas = [wl0Data, wl1Data, wl2Data, wl3Data, wl4Data];
    const map = new Map<Token, ReturnType<typeof useGrownStalkPerTokenQuery>>();

    for (const [i, token] of tokens.entries()) {
      map.set(token, datas[i]);
    }

    return map;
  }, [wl0Data, wl1Data, wl2Data, wl3Data, wl4Data, tokens]);
}

export function useFarmerSilo() {
  const account = useAccount();
  const BEAN = useTokenData().mainToken;
  const tokenData = useTokenData();
  const SILO_WHITELIST = tokenData.whitelistedTokens;

  const farmerWLTokenData = useGrownStalkPerTokenQueries();

  const farmerDeposits = useFarmerDepositedBalances().data;
  const currPrice = usePriceData().price;

  // stalk + earnedStalk, NO grown stalk
  const activeStalkBalance = useReadFarmer_BalanceOfStalk({
    args: [account.address ?? ZERO_ADDRESS],
    query: {
      enabled: !!account.address,
    },
  });

  const floodData = useReadFarmer_BalanceOfSop({
    args: [account.address || ZERO_ADDRESS],
    query: {
      enabled: !!account.address,
    },
  });

  const earnedBeansBalance = useReadFarmer_BalanceOfEarnedBeans({
    args: [account.address ?? ZERO_ADDRESS],
    query: {
      enabled: !!account.address,
    },
  });

  const depositsData = useMemo(() => {
    let _depositsBDV = TokenValue.ZERO;
    let _depositsUSD = TokenValue.ZERO;
    let _activeSeeds = TokenValue.ZERO;

    const map = new Map<Token, TokenValue>();
    const keys: QueryKey[] = [];
    const sops: {
      well: Token;
      backingAsset: Token;
      wellsPlenty: { plenty: TokenValue; plentyPerRoot: bigint };
    }[] = [];

    SILO_WHITELIST.forEach((token) => {
      const grownStalk = farmerWLTokenData.get(token);
      if (!grownStalk) return;

      map.set(token, TokenValue.fromBlockchain(grownStalk.data || 0n, STALK.decimals));
      keys.push(grownStalk.queryKey);

      const depositData = farmerDeposits.get(token);
      _depositsBDV = _depositsBDV.add(depositData ? depositData.currentBDV : TokenValue.ZERO);
      _depositsUSD = _depositsUSD.add(depositData ? depositData.currentBDV.mul(currPrice) : TokenValue.ZERO);
      _activeSeeds = _activeSeeds.add(
        depositData
          ? depositData.deposits.reduce((acc, curr) => acc.add(curr.seeds), TokenValue.ZERO)
          : TokenValue.ZERO,
      );

      if (floodData.data && tokenData && token.tokens) {
        const sopToken = floodData.data.farmerSops.find(
          (farmerSop) => farmerSop.well.toLowerCase() === token.address.toLowerCase(),
        );
        const backingAssetAddress = token.tokens.find((tokenAddress) => tokenAddress !== BEAN.address);
        if (backingAssetAddress) {
          const backingAsset = tokenData.preferredTokens.find(
            (preferredToken) => backingAssetAddress.toLowerCase() === preferredToken.address.toLowerCase(),
          );
          if (sopToken && backingAsset) {
            const sopData = {
              well: token,
              backingAsset: backingAsset,
              wellsPlenty: {
                plenty: TokenValue.fromBlockchain(sopToken.wellsPlenty.plenty, backingAsset.decimals),
                plentyPerRoot: sopToken.wellsPlenty.plentyPerRoot,
              },
            };
            sops.push(sopData);
          }
        }
      }
    });

    const grownStalkReward = Array.from(map).reduce((acc, curr) => acc.add(curr[1]), TokenValue.ZERO);

    return {
      grownStalkReward,
      grownStalkPerToken: map,
      queryKeys: keys,
      farmerSops: sops,
      depositsBDV: _depositsBDV,
      depositsUSD: _depositsUSD,
      activeSeeds: _activeSeeds,
    };
  }, [tokenData, floodData.data, farmerWLTokenData, farmerDeposits, currPrice, BEAN.address, SILO_WHITELIST]);

  const queryKeys = useMemo(() => {
    const keys: QueryKey[] = [
      activeStalkBalance.queryKey,
      ...depositsData.queryKeys,
      floodData.queryKey,
      earnedBeansBalance.queryKey,
    ];
    return keys;
  }, [earnedBeansBalance.queryKey, depositsData.queryKeys, activeStalkBalance.queryKey, floodData.queryKey]);

  return {
    activeStalkBalance: TokenValue.fromBlockchain(activeStalkBalance.data || 0n, STALK.decimals),
    activeSeedsBalance: depositsData.activeSeeds,
    depositsBDV: depositsData.depositsBDV,
    depositsUSD: depositsData.depositsUSD,
    earnedBeansBalance: TokenValue.fromBlockchain(earnedBeansBalance.data || 0n, BEAN.decimals),
    grownStalkReward: depositsData.grownStalkReward,
    grownStalkPerToken: depositsData.grownStalkPerToken,
    flood: {
      lastRain: floodData?.data?.lastRain ?? 0,
      lastSop: floodData?.data?.lastSop ?? 0,
      roots: floodData?.data?.roots ?? 0n,
      farmerSops: depositsData.farmerSops,
    },
    queryKeys: queryKeys,
  };
}
