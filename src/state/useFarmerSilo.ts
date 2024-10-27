import { useAccount } from "wagmi";
import {
  useReadBeanstalk_BalanceOfEarnedBeans,
  useReadBeanstalk_BalanceOfGrownStalk,
  useReadBeanstalk_BalanceOfSop,
  useReadBeanstalk_BalanceOfStalk,
} from "@/generated/contractHooks";
import { TokenValue } from "@/classes/TokenValue";
import useFarmerDepositedBalances from "./useFarmerDepositedBalances";
import { usePriceData } from "./usePriceData";
import useTokenData from "./useTokenData";
import { STALK } from "@/constants/internalTokens";
import { Token } from "@/utils/types";
import { QueryKey } from "@tanstack/react-query";

export function useFarmerSilo() {
  const account = useAccount();
  const BEAN = useTokenData().mainToken;
  const tokenData = useTokenData();
  const SILO_WHITELIST = tokenData.whitelistedTokens;

  const farmerDeposits = useFarmerDepositedBalances().data;
  const currPrice = usePriceData().price;

  let depositsBDV = TokenValue.ZERO;
  let depositsUSD = TokenValue.ZERO;
  let activeSeeds = TokenValue.ZERO;

  const queryKeys = [];
  // stalk + earnedStalk, NO grown stalk
  const activeStalkBalance = useReadBeanstalk_BalanceOfStalk({
    args: [account.address!],
    query: {
      enabled: !!account.address,
    },
  });
  queryKeys.push(activeStalkBalance.queryKey);

  const floodData = useReadBeanstalk_BalanceOfSop({
    args: [account.address!],
    query: {
      enabled: !!account.address
    },
  });

  const farmerSops: Array<{ well: Token, backingAsset: Token, wellsPlenty: { plenty: TokenValue, plentyPerRoot: bigint }}> = []; 

  const grownStalkPerToken = new Map();
  SILO_WHITELIST.forEach((token) => {
    const grownStalk = useReadBeanstalk_BalanceOfGrownStalk({
      args: [account.address!, token.address],
      query: {
        enabled: !!account.address && !!token.address,
      },
    });
    grownStalkPerToken.set(token, TokenValue.fromBlockchain(grownStalk.data || 0n, STALK.decimals));

    queryKeys.push(grownStalk.queryKey);

    const depositData = farmerDeposits.get(token);
    depositsBDV = depositsBDV.add(depositData ? depositData.currentBDV : TokenValue.ZERO);
    depositsUSD = depositsUSD.add(depositData ? depositData.currentBDV.mul(currPrice) : TokenValue.ZERO);
    activeSeeds = activeSeeds.add(depositData ? depositData.deposits.reduce((acc, curr) => acc.add(curr.seeds), TokenValue.ZERO) : TokenValue.ZERO);

    if (floodData.data && tokenData && token.tokens) {
      const sopToken = floodData.data.farmerSops.find((farmerSop) => farmerSop.well.toLowerCase() === token.address.toLowerCase());
      const backingAssetAddress = token.tokens.find((tokenAddress) => tokenAddress !== BEAN.address);
      if (backingAssetAddress) {
        const backingAsset = tokenData.preferredTokens.find((preferredToken) => backingAssetAddress.toLowerCase() === preferredToken.address.toLowerCase());
        if (sopToken && backingAsset) {
          const sopData = {
            well: token,
            backingAsset: backingAsset,
            wellsPlenty: {
              plenty: TokenValue.fromBlockchain(sopToken.wellsPlenty.plenty, backingAsset.decimals),
              plentyPerRoot: sopToken.wellsPlenty.plentyPerRoot,
            }
          };
          farmerSops.push(sopData);
        }
      }
    };
  });


  const earnedBeansBalance = useReadBeanstalk_BalanceOfEarnedBeans({
    args: [account.address!],
    query: {
      enabled: !!account.address,
    },
  });
  queryKeys.push(earnedBeansBalance.queryKey);

  const grownStalkReward = Array.from(grownStalkPerToken).reduce(
    (acc, curr) => acc.add(curr[1]),
    TokenValue.ZERO,
  );

 

  return {
    activeStalkBalance: TokenValue.fromBlockchain(activeStalkBalance.data || 0n, STALK.decimals),
    activeSeedsBalance: activeSeeds,
    depositsBDV: depositsBDV,
    depositsUSD: depositsUSD,
    earnedBeansBalance: TokenValue.fromBlockchain(earnedBeansBalance.data || 0n, BEAN.decimals),
    grownStalkReward: grownStalkReward,
    grownStalkPerToken: grownStalkPerToken,
    flood: {
      lastRain: floodData?.data?.lastRain ?? 0,
      lastSop: floodData?.data?.lastSop ?? 0,
      roots: floodData?.data?.roots ?? 0n,
      farmerSops: farmerSops
    },
    queryKeys: queryKeys
  };
}
