import { TokenValue } from "@/classes/TokenValue";
import { ZERO_ADDRESS } from "@/constants/address";
import { beanstalkAbi, beanstalkAddress } from "@/generated/contractHooks";
import { useChainAddress } from "@/utils/chain";
import { Token } from "@/utils/types";
import { useMemo } from "react";
import { useAccount, useBalance, useReadContract } from "wagmi";
import { useSeason } from "./useSunData";
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
  const season = useSeason();
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

    for (const [index, token] of balanceTokens.entries()) {
      if (data?.[index]) {
        const tokenBalance = data[index];
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
  }, [nativeBalance.data, nativeBalance.data?.value, data, balanceTokens, ETH]);

  return {
    balances: balanceData,
    queryKeys: [queryKey, nativeBalance.queryKey],
    refetch: refetch,
  };
}
