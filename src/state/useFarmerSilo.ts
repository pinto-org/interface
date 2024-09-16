import { useAccount } from "wagmi";
import {
  useReadBeanstalk_BalanceOfEarnedBeans,
  useReadBeanstalk_BalanceOfGrownStalk,
  useReadBeanstalk_BalanceOfStalk,
} from "@/generated/contractHooks";
import { TokenValue } from "@/classes/TokenValue";
import useFarmerDepositedBalances from "./useFarmerDepositedBalances";
import { usePriceData } from "./usePriceData";
import useTokenData from "./useTokenData";
import { STALK } from "@/constants/internalTokens";

export function useFarmerSilo() {
  const account = useAccount();
  const BEAN = useTokenData().mainToken;
  const SILO_WHITELIST = useTokenData().whitelistedTokens;

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

  const grownStalkPerToken: any[] = [];
  SILO_WHITELIST.forEach((token) => {
    const grownStalk = useReadBeanstalk_BalanceOfGrownStalk({
      args: [account.address!, token.address],
      query: {
        enabled: !!account.address && !!token.address,
      },
    });
    grownStalkPerToken.push({
      token: token,
      grownStalk: TokenValue.fromBlockchain(grownStalk.data || 0n, STALK.decimals),
    });
    queryKeys.push(grownStalk.queryKey);

    const depositData = farmerDeposits.get(token);
    depositsBDV = depositsBDV.add(depositData.currentBDV);
    depositsUSD = depositsUSD.add(depositData.currentBDV.mul(currPrice));
    activeSeeds = activeSeeds.add(depositData.deposits.reduce((acc, curr) => acc.add(curr.seeds), TokenValue.ZERO));
  });
  const earnedBeansBalance = useReadBeanstalk_BalanceOfEarnedBeans({
    args: [account.address!],
    query: {
      enabled: !!account.address,
    },
  });
  queryKeys.push(earnedBeansBalance.queryKey);

  return {
    activeStalkBalance: TokenValue.fromBlockchain(activeStalkBalance.data || 0n, STALK.decimals),
    activeSeedsBalance: activeSeeds,
    depositsBDV: depositsBDV,
    depositsUSD: depositsUSD,
    earnedBeansBalance: TokenValue.fromBlockchain(earnedBeansBalance.data || 0n, BEAN.decimals),
    grownStalkPerToken: grownStalkPerToken,
    queryKeys: queryKeys
  };
}
