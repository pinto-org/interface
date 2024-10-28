import { useAccount, useChainId, useReadContracts } from "wagmi";
import { tokens } from "@/constants/tokens";
import { Abi, erc20Abi } from "viem";
import { TokenValue } from "@/classes/TokenValue";
import { Token } from "@/utils/types";
import { base } from "viem/chains";
import { useMemo } from "react";

export default function useTokenData() {
  const chainId = useChainId();
  const account = useAccount();

  const { mainToken, nativeToken, wrappedNativeToken, lpTokens, preferredTokens } = useMemo(() => {
    const _lpTokens: Token[] = [];
    const _preferredTokens: Token[] = [];

    const _chainId = chainId === 41337 ? base.id : chainId === 1337 ? base.id : chainId;

    const _mainToken = tokens[_chainId].find((token) => token.isMain) as Token;
    const _nativeToken = tokens[_chainId].find((token) => token.isNative) as Token;
    const _wrappedNativeToken = tokens[_chainId].find((token) => token.isWrappedNative) as Token;

    for (const token of tokens[_chainId]) {
      if (token.isLP) {
        _lpTokens.push(token);
      }
      if (!token.isNative && !token.isLP) {
        _preferredTokens.push(token);
      }
    }

    return {
      mainToken: _mainToken,
      nativeToken: _nativeToken,
      wrappedNativeToken: _wrappedNativeToken,
      lpTokens: _lpTokens,
      preferredTokens: _preferredTokens,
    };
  }, [chainId]);

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
      enabled: Boolean(account),
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

  return useMemo(
    () => ({
      mainToken: mainToken,
      nativeToken: nativeToken,
      wrappedNativeToken: wrappedNativeToken,
      lpTokens: lpTokens,
      preferredTokens: preferredTokens,
      whitelistedTokens: [mainToken, ...lpTokens],
      allowances: allowances,
      queryKey: queryKey,
      refetch: refetch,
    }),
    [mainToken, nativeToken, wrappedNativeToken, lpTokens, preferredTokens, allowances, queryKey, refetch],
  );
}
