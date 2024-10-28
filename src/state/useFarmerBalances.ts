import { useAccount, useBalance, useReadContract } from "wagmi";
import { beanstalkAddress, useReadBeanstalk_GetAllBalances, beanstalkAbi } from "@/generated/contractHooks";
import { TokenValue } from "@/classes/TokenValue";
import useTokenData from "./useTokenData";
import { Token } from "@/utils/types";
import { useChainAddress } from "@/utils/chain";
import { ZERO_ADDRESS } from "@/constants/address";

const settings = {
  staleTime: 1000 * 60 * 2,
  refetchInterval: 1000 * 60 * 3, // 3 minutes, in milliseconds
};

const emptyMap = new Map<Token, { internal: TokenValue; external: TokenValue; total: TokenValue }>();

export function useFarmerBalances() {
  const account = useAccount();
  const tokens = useTokenData().preferredTokens;
  const preferredTokens = tokens.map((token) => token.address);
  const ETH = useTokenData().nativeToken;
  const nativeBalance = useBalance({
    address: account.address,
  });

  const diamondAddress = useChainAddress(beanstalkAddress);

  const {
    data: tokenBalances = emptyMap,
    refetch,
    queryKey,
  } = useReadContract({
    address: diamondAddress,
    abi: beanstalkAbi,
    functionName: "getAllBalances",
    args: [account.address ?? ZERO_ADDRESS, preferredTokens],
    query: {
      ...settings,
      enabled: !!account.address,
      select: (data) => {
        const balances: Map<Token, { internal: TokenValue; external: TokenValue; total: TokenValue }> = new Map();

        balances.set(ETH, {
          internal: TokenValue.fromBlockchain(0n, ETH.decimals),
          external: TokenValue.fromBlockchain(nativeBalance.data?.value || 0n, ETH.decimals),
          total: TokenValue.fromBlockchain(nativeBalance.data?.value || 0n, ETH.decimals),
        });

        data.forEach((token, index) => {
          balances.set(tokens[index], {
            internal: TokenValue.fromBlockchain(token.internalBalance, tokens[index].decimals),
            external: TokenValue.fromBlockchain(token.externalBalance, tokens[index].decimals),
            total: TokenValue.fromBlockchain(token.totalBalance, tokens[index].decimals),
          });
        });

        return balances;
      },
    },
  });

  return {
    balances: tokenBalances,
    queryKey: queryKey,
    refetch: refetch,
  };
}
