import { TokenValue } from "@/classes/TokenValue";
import { ZERO_ADDRESS } from "@/constants/address";
import { tokens } from "@/constants/tokens";
import { beanstalkAbi } from "@/generated/contractHooks";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { Token } from "@/utils/types";
import { QueryKey } from "@tanstack/react-query";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { atomWithImmer } from "jotai-immer";
import { useEffect, useMemo } from "react";
import { useAccount, useBalance, useReadContract, useReadContracts } from "wagmi";
import useTokenData from "./useTokenData";

// Types
export interface FarmerBalance {
  internal: TokenValue;
  external: TokenValue;
  total: TokenValue;
}

interface FarmerBalanceState {
  balances: Map<Token, FarmerBalance>;
  isLoading: boolean;
  queryKeys: QueryKey[];
  refetch: () => void;
}

// Atom
export const farmerBalanceAtom = atomWithImmer<FarmerBalanceState>({
  balances: new Map(),
  isLoading: true,
  queryKeys: [],
  refetch: () => {},
});

// Main hook
export function useUpdateFarmerBalances() {
  const [state, setState] = useAtom(farmerBalanceAtom);
  const account = useAccount();
  const diamond = useProtocolAddress();
  const { preferredTokens, lpTokens, nativeToken } = useTokenData();

  // Get native token balance
  const nativeBalance = useBalance({
    address: account.address,
  });

  const balanceTokens = useMemo(() => [...tokens, ...lpTokens, sMainToken], [tokens, lpTokens, sMainToken]);
  const addresses = useMemo(() => balanceTokens.map((token) => token.address), [balanceTokens]);

  const addresses = balanceTokens.map((token) => token.address);

  const {
    data: beanstalkBalances,
    isLoading,
    isFetched,
  } = useReadContract({
    address: diamond,
    abi: beanstalkAbi,
    functionName: "getAllBalances",
    args: [account.address ?? ZERO_ADDRESS, addresses],
    query: {
      enabled: Boolean(account.address && balanceTokens.length),
      staleTime: 1000 * 60 * 2, // 2 minutes
      refetchInterval: 1000 * 60 * 3, // 3 minutes
    },
  });

  // Update state when data changes
  useEffect(() => {
    const newBalances = new Map<Token, FarmerBalance>();

    // Add native token balance
    newBalances.set(nativeToken, {
      internal: TokenValue.fromBlockchain(0n, nativeToken.decimals),
      external: TokenValue.fromBlockchain(nativeBalance.data?.value || 0n, nativeToken.decimals),
      total: TokenValue.fromBlockchain(nativeBalance.data?.value || 0n, nativeToken.decimals),
    });

    // Add other token balances
    balanceTokens.forEach((token, index) => {
      if (beanstalkBalances?.[index]) {
        const balance = beanstalkBalances[index];
        newBalances.set(token, {
          internal: TokenValue.fromBlockchain(balance.internalBalance, token.decimals),
          external: TokenValue.fromBlockchain(balance.externalBalance, token.decimals),
          total: TokenValue.fromBlockchain(balance.totalBalance, token.decimals),
        });
      } else {
        newBalances.set(token, {
          internal: TokenValue.ZERO,
          external: TokenValue.ZERO,
          total: TokenValue.ZERO,
        });
      }
    });

    let updateState = false;
    for (const [token, balance] of newBalances) {
      const oldBalance = state.balances.get(token);
      if ((oldBalance === undefined && !state.balances.has(token)) || oldBalance !== balance) {
        console.log("CONDITION 1: ", oldBalance === undefined && !state.balances.has(token), oldBalance !== balance);
        console.log("old: ", oldBalance, balance);
        updateState = true;
        break;
      }
    }

    if (!updateState) return;
    console.debug("[state/useFarmerBalance]: Updated Farmer Balances - ", newBalances);
    setState((draft) => {
      draft.balances = newBalances;
      draft.isLoading = false;
    });
  }, [state, beanstalkBalances, nativeBalance.data]);

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
