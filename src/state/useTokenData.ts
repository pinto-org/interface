import { useAccount, useChainId, useReadContracts } from "wagmi";
import { tokens } from "@/constants/tokens";
import { Abi, erc20Abi } from "viem";
import { TokenValue } from "@/classes/TokenValue";
import { Token } from "@/utils/types";
import { base } from "viem/chains";

export default function useTokenData() {
    const chainId = useChainId();
    const account = useAccount();

    const lpTokens: Token[] = [];
    const preferredTokens: Token[] = [];

    const _chainId = (chainId === 41337) ? base.id : (chainId === 1337) ? base.id : chainId;

    const mainToken = tokens[_chainId].find((token) => token.isMain) as Token;
    const nativeToken = tokens[_chainId].find((token) => token.isNative) as Token;
    const wrappedNativeToken = tokens[_chainId].find((token) => token.isWrappedNative) as Token;

    for (const token of tokens[_chainId]) {
      if (token.isLP) {
        lpTokens.push(token)
      };
      if (!token.isNative && !token.isLP) {
        preferredTokens.push(token)
      };
    };

    const allowances = new Map<Token, TokenValue>();
    const contractQueries: { address: `0x${string}`, abi: Abi, functionName: string }[] = [];
    const tokensToGetAllowance = [mainToken, ...lpTokens, ...preferredTokens].filter(Boolean) as Token[];
    for (const token of tokensToGetAllowance) {
      contractQueries.push({
        address: (token?.address || '0x'),
        abi: erc20Abi,
        functionName: 'allowance'
      })
    };

    const result = useReadContracts({
      contracts: contractQueries,
      query: {
        enabled: Boolean(account),
        refetchInterval: 60000
      }  
    });
    const allowanceData = result.data as Array<{ result: bigint, status: string }>
    if (allowanceData) {
      for (const [index, allowance] of allowanceData.entries()) {
        const _token = tokensToGetAllowance[index];
        allowances.set(_token, allowance.result ? TokenValue.fromBlockchain(allowance.result, _token.decimals) : TokenValue.fromBlockchain(0n, _token.decimals))
      };
      allowances.set(nativeToken, TokenValue.MAX_UINT256);
    };
    
    return {
      mainToken: mainToken,
      nativeToken: nativeToken,
      wrappedNativeToken: wrappedNativeToken,
      lpTokens: lpTokens,
      preferredTokens: preferredTokens,
      whitelistedTokens: [mainToken, ...lpTokens],
      allowances: allowances,
      queryKey: result.queryKey,
      refetch: result.refetch
    };
}