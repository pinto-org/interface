import { TokenValue } from "@/classes/TokenValue";
import { LP_TOKENS, MAIN_TOKEN, S_MAIN_TOKEN, tokens } from "@/constants/tokens";
import { useChainConstant, useResolvedChainId } from "@/utils/chain";
import { Token } from "@/utils/types";
import { useMemo } from "react";
import { Abi, erc20Abi } from "viem";
import { base } from "viem/chains";
import { useAccount, useChainId, useReadContracts } from "wagmi";

export function useWhitelistedTokens() {
  const chainId = useResolvedChainId();

  return useMemo(() => {
    const mainToken = MAIN_TOKEN[chainId];
    const t = LP_TOKENS[chainId];

    return [mainToken, ...t];
  }, [chainId]);
}

export default function useTokenData() {
  const chainId = useChainId();
  const account = useAccount();

  const sMainToken = useChainConstant(S_MAIN_TOKEN);

  const { mainToken, nativeToken, wrappedNativeToken, lpTokens, preferredTokens, thirdPartyWrappedNativeToken } =
    useMemo(() => {
      const _lpTokens: Token[] = [];
      const _preferredTokens: Token[] = [];

      const _chainId = chainId === 41337 ? base.id : chainId === 1337 ? base.id : chainId;

      const _mainToken = tokens[_chainId].find((token) => token.isMain) as Token;
      const _nativeToken = tokens[_chainId].find((token) => token.isNative) as Token;
      const _wrappedNativeToken = tokens[_chainId].find((token) => token.isWrappedNative) as Token;
      const _3pWrappedNativeToken = tokens[_chainId].find((token) => token.is3PSiloWrapped) as Token;

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
        thirdPartyWrappedNativeToken: _3pWrappedNativeToken,
        lpTokens: _lpTokens,
        preferredTokens: _preferredTokens,
      };
    }, [chainId]);

  const contracts = useMemo(() => {
    const tokensToGetAllowance = [mainToken, sMainToken, ...lpTokens, ...preferredTokens].filter(Boolean) as Token[];
    const contractQueries: { address: `0x${string}`; abi: Abi; functionName: string }[] = [];
    for (const token of tokensToGetAllowance) {
      contractQueries.push({
        address: token.address,
        abi: erc20Abi,
        functionName: "allowance",
      });
    }

    return {
      tokensToGetAllowance,
      contractQueries,
    };
  }, [mainToken, sMainToken, lpTokens, preferredTokens]);

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

  return useMemo(
    () => ({
      mainToken: mainToken,
      siloWrappedToken: sMainToken,
      nativeToken: nativeToken,
      wrappedNativeToken: wrappedNativeToken,
      thirdPartyWrappedNativeToken: thirdPartyWrappedNativeToken,
      lpTokens: lpTokens,
      preferredTokens: preferredTokens,
      whitelistedTokens: [mainToken, ...lpTokens],
      allowances: allowances,
      queryKey: queryKey,
      refetch: refetch,
    }),
    [sMainToken, mainToken, nativeToken, wrappedNativeToken, lpTokens, preferredTokens, allowances, queryKey, refetch],
  );
}
