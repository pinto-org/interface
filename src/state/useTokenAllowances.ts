import { TokenValue } from "@/classes/TokenValue";
import { Token } from "@/utils/types";
import { QueryKey } from "@tanstack/react-query";
import { useAtomValue, useSetAtom } from "jotai";
import { atomWithImmer } from "jotai-immer";
import { useEffect, useMemo } from "react";
import { Abi, erc20Abi } from "viem";
import { useAccount, useReadContracts } from "wagmi";
import useTokenData from "./useTokenData";

interface TokenAllowanceState {
  allowances: Map<Token, TokenValue>;
  queryKey: QueryKey;
  refetch: () => void;
}

export const tokenAllowancesAtom = atomWithImmer<TokenAllowanceState>({
  allowances: new Map(),
  queryKey: [],
  refetch: () => {},
});

export function useUpdateTokenAllowances() {
  const account = useAccount();

  const { mainToken, nativeToken, lpTokens, preferredTokens } = useTokenData();
  const setState = useSetAtom(tokenAllowancesAtom);

  const contracts = useMemo(() => {
    const tokensToGetAllowance = [mainToken, ...lpTokens, ...preferredTokens].filter(Boolean) as Token[];
    const contractQueries: { address: `0x${string}`; abi: Abi; functionName: string }[] = [];
    for (const token of tokensToGetAllowance) {
      contractQueries.push({
        address: token?.address || "0x",
        abi: erc20Abi,
        functionName: "allowance",
      });
    }

    return {
      tokensToGetAllowance,
      contractQueries,
    };
  }, [mainToken, lpTokens, preferredTokens]);

  const {
    data: allowances,
    queryKey,
    refetch,
  } = useReadContracts({
    contracts: contracts.contractQueries,
    query: {
      enabled: Boolean(account.address),
      refetchInterval: 60000,
      select: (data) => {
        const allowances = new Map<Token, TokenValue>();
        if (data) {
          for (const [index, allowance] of data.entries()) {
            const _token = contracts.tokensToGetAllowance[index];
            if (!allowance.result) continue;

            allowances.set(
              _token,
              allowance.result
                ? TokenValue.fromBlockchain(allowance.result as bigint, _token.decimals)
                : TokenValue.fromBlockchain(0n, _token.decimals),
            );
          }
          allowances.set(nativeToken, TokenValue.MAX_UINT256);
        }
        return allowances;
      },
    },
  });

  useEffect(() => {
    setState((draft) => {
      if (allowances) {
        draft.allowances = allowances;
      }
      draft.queryKey.concat(queryKey);
      draft.refetch = refetch;
    });
  }, [allowances, queryKey, refetch, setState]);
}

export default function useTokenAllowances() {
  return useAtomValue(tokenAllowancesAtom);
}
