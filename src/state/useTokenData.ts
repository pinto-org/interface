import { useAccount, useChainId, useReadContract } from "wagmi";
import { LP_TOKENS, MAIN_TOKENS, NATIVE_TOKENS, PREFERRED_TOKENS } from "@/constants/tokens";
import { erc20Abi } from "viem";
import { beanstalkAddress } from "@/generated/contractHooks";
import { TokenValue } from "@/classes/TokenValue";
import { Token } from "@/utils/types";

export default function useTokenData() {
    const chainId = useChainId();
    const account = useAccount();
    const output = new Map();

    const lpTokens: Token[] = [];
    const preferredTokens: Token[] = [];

    const mainToken = MAIN_TOKENS.find((token) => token.chainId === (chainId === 1337 ? 1 : chainId))!;
    const nativeToken = NATIVE_TOKENS.find((token) => token.chainId === (chainId === 1337 ? 1 : chainId))!;
    LP_TOKENS.forEach((lpToken) => {
      if (lpToken.chainId === (chainId === 1337 ? 1 : chainId)) {
        lpTokens.push(lpToken);
      };
    });
    PREFERRED_TOKENS.forEach((token) => {
      if (token.chainId === (chainId === 1337 ? 1 : chainId)) {
        preferredTokens.push(token);
      };
    });

    const wrappedNativeToken = PREFERRED_TOKENS.find((token) => token.isWrappedNative);

    const queryKeys = [];

    const tokensToGetAllowance = [mainToken, ...lpTokens, ...preferredTokens]
    tokensToGetAllowance.forEach((token) => {
      if (!token || !token?.address) return
      const { data: allowance, queryKey } = useReadContract({
        abi: erc20Abi,
        address: token.address,
        functionName: "allowance",
        args: [account!.address, beanstalkAddress[chainId]],
        query: {
          enabled: !!account.address && !!token.address,
        },
      });
      queryKeys.push(queryKey);
      if (!account.address || !allowance) {
        output.set(token, TokenValue.fromBlockchain(0n, token!.decimals));
      } else {
        output.set(token, TokenValue.fromBlockchain(allowance, token!.decimals));
      }
    });

    output.set(nativeToken, TokenValue.MAX_UINT256);
    
    return {
      mainToken: mainToken,
      nativeToken: nativeToken,
      wrappedNativeToken: wrappedNativeToken,
      lpTokens: lpTokens,
      preferredTokens: [mainToken, ...preferredTokens],
      whitelistedTokens: [mainToken, ...lpTokens],
      allowances: output,
      queryKey: queryKeys,
    };
}