import { useAccount, useBalance } from "wagmi";
import { useReadBeanstalk_GetAllBalances } from "@/generated/contractHooks";
import { TokenValue } from "@/classes/TokenValue";
import useTokenData from "./useTokenData";
import { Token } from "@/utils/types";

export function useFarmerBalances() {
  const account = useAccount();
  const tokens = useTokenData().preferredTokens;
  const preferredTokens = tokens.map((token) => token.address);
  const ETH = useTokenData().nativeToken;
  const nativeBalance = useBalance({
    address: account.address,
  });

  const tokenBalances = useReadBeanstalk_GetAllBalances({
    args: [account.address ?? "0x", preferredTokens],
    query: {
      staleTime: 1000 * 60 * 2,
      refetchInterval: 1000 * 60 * 3, // 3 minutes, in milliseconds
      enabled: !!account.address,
    },
  });

  const balances: Map<Token, { internal: TokenValue; external: TokenValue; total: TokenValue }> = new Map();

  balances.set(ETH, {
    internal: TokenValue.fromBlockchain(0n, ETH.decimals),
    external: TokenValue.fromBlockchain(nativeBalance.data?.value || 0n, ETH.decimals),
    total: TokenValue.fromBlockchain(nativeBalance.data?.value || 0n, ETH.decimals),
  });

  tokenBalances.data?.forEach((token, index) => {
    balances.set(tokens[index], {
      internal: TokenValue.fromBlockchain(token.internalBalance, tokens[index].decimals),
      external: TokenValue.fromBlockchain(token.externalBalance, tokens[index].decimals),
      total: TokenValue.fromBlockchain(token.totalBalance, tokens[index].decimals),
    });
  });

  return {
    balances: balances,
    queryKey: tokenBalances.queryKey,
    refetch: tokenBalances.refetch,
  };
}
