import { TokenValue } from "@/classes/TokenValue";
import { ZERO_ADDRESS } from "@/constants/address";
import { beanstalkAbi, beanstalkAddress, useReadBeanstalk_GetAllBalances } from "@/generated/contractHooks";
import { useChainAddress } from "@/utils/chain";
import { Token } from "@/utils/types";
import { useEffect, useMemo } from "react";
import { useAccount, useBalance, useReadContract } from "wagmi";
import { useSunData } from "./useSunData";
import useTokenData from "./useTokenData";

const settings = {
  staleTime: 1000 * 60 * 2,
  refetchInterval: 1000 * 60 * 3, // 3 minutes, in milliseconds
};

export interface FarmerBalance {
  internal: TokenValue;
  external: TokenValue;
  total: TokenValue;
}

export function useFarmerBalances() {
  const account = useAccount();
  const season = useSunData().current;
  const tokens = useTokenData().preferredTokens;
  const lpTokens = useTokenData().lpTokens;
  const ETH = useTokenData().nativeToken;

  const nativeBalance = useBalance({
    address: account.address,
  });

  const balanceTokens = useMemo(() => [...tokens, ...lpTokens], [tokens, lpTokens]);
  const addresses = balanceTokens.map((token) => token.address);

  const diamondAddress = useChainAddress(beanstalkAddress);

  const { data, refetch, queryKey } = useReadContract({
    address: diamondAddress,
    abi: beanstalkAbi,
    functionName: "getAllBalances",
    args: [account.address ?? ZERO_ADDRESS, addresses],
    scopeKey: ["season", season].join(" "),
    query: {
      ...settings,
      enabled: !!account.address && !!balanceTokens.length,
    },
  });

  const balanceData = useMemo(() => {
    const balances: Map<Token, FarmerBalance> = new Map();

    balances.set(ETH, {
      internal: TokenValue.fromBlockchain(0n, ETH.decimals),
      external: TokenValue.fromBlockchain(nativeBalance.data?.value || 0n, ETH.decimals),
      total: TokenValue.fromBlockchain(nativeBalance.data?.value || 0n, ETH.decimals),
    });

    data?.forEach((tokenBal, index) => {
      const token = balanceTokens[index];
      balances.set(token, {
        internal: TokenValue.fromBlockchain(tokenBal.internalBalance, token.decimals),
        external: TokenValue.fromBlockchain(tokenBal.externalBalance, token.decimals),
        total: TokenValue.fromBlockchain(tokenBal.totalBalance, token.decimals),
      });
    });

    return balances;
  }, [nativeBalance.data, data, balanceTokens, ETH]);

  return {
    balances: balanceData,
    queryKey: queryKey,
    refetch: refetch,
  };
}
