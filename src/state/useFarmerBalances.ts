import { TokenValue } from "@/classes/TokenValue";
import { ZERO_ADDRESS } from "@/constants/address";
import { beanstalkAbi, beanstalkAddress } from "@/generated/contractHooks";
import { useUnifiedAuth } from "@/hooks/useUnifiedAuth";
import { useChainAddress } from "@/utils/chain";
import { Token } from "@/utils/types";
import { useMemo } from "react";
import { useBalance, useReadContract } from "wagmi";
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
  const unifiedAuth = useUnifiedAuth();
  const { preferredTokens: tokens, lpTokens, nativeToken: ETH, siloWrappedToken: sMainToken } = useTokenData();

  const nativeBalance = useBalance({
    address: unifiedAuth.displayAddress,
  });

  const balanceTokens = useMemo(() => [...tokens, ...lpTokens, sMainToken], [tokens, lpTokens, sMainToken]);
  const addresses = useMemo(() => balanceTokens.map((token) => token.address), [balanceTokens]);

  const diamondAddress = useChainAddress(beanstalkAddress);

  const {
    data: beanstalkBalances,
    refetch,
    queryKey,
    isLoading,
    isFetched,
  } = useReadContract({
    address: diamondAddress,
    abi: beanstalkAbi,
    functionName: "getAllBalances",
    args: [unifiedAuth.displayAddress ?? ZERO_ADDRESS, addresses],
    query: {
      ...settings,
      enabled: !!unifiedAuth.displayAddress && !!balanceTokens.length,
    },
  });

  const balanceData = useMemo(() => {
    const balances: Map<Token, FarmerBalance> = new Map();

    balances.set(ETH, {
      internal: TokenValue.fromBlockchain(0n, ETH.decimals),
      external: TokenValue.fromBlockchain(nativeBalance.data?.value || 0n, ETH.decimals),
      total: TokenValue.fromBlockchain(nativeBalance.data?.value || 0n, ETH.decimals),
    });

    for (const [index, token] of balanceTokens.entries()) {
      if (beanstalkBalances?.[index]) {
        const tokenBalance = beanstalkBalances[index];
        balances.set(token, {
          internal: TokenValue.fromBlockchain(tokenBalance.internalBalance, token.decimals),
          external: TokenValue.fromBlockchain(tokenBalance.externalBalance, token.decimals),
          total: TokenValue.fromBlockchain(tokenBalance.totalBalance, token.decimals),
        });
      } else {
        balances.set(token, {
          internal: TokenValue.ZERO,
          external: TokenValue.ZERO,
          total: TokenValue.ZERO,
        });
      }
    }

    return balances;
  }, [nativeBalance.data?.value, beanstalkBalances, balanceTokens, ETH]);

  const queriesLoading = nativeBalance.isLoading || isLoading;
  const queriesFetched = nativeBalance.isFetched && isFetched;

  return useMemo(
    () => ({
      isLoading: queriesLoading,
      isFetched: queriesFetched,
      balances: balanceData,
      queryKeys: [queryKey, nativeBalance.queryKey],
      refetch: refetch,
    }),
    [queriesLoading, balanceData, queriesFetched, queryKey, nativeBalance.queryKey, refetch],
  );
}
