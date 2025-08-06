import { useTokenMap } from "@/hooks/pinto/useTokenMap";
import { useFarmerBalances } from "@/state/useFarmerBalances";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import useTokenData, { useWhitelistedTokens } from "@/state/useTokenData";
import { tokensEqual } from "@/utils/token";
import { Token } from "@/utils/types";
import { useMemo } from "react";

export function useSiloDepositTokenFilters(siloToken?: Token) {
  const { balances } = useFarmerBalances();
  const tokenMap = useTokenMap();

  return useMemo(() => {
    const filterSet = new Set<Token>();
    const filterPreferred: Token[] = [];

    [...balances.keys()].forEach((token) => {
      // Allow LP tokens (except the target silo token), wrapped tokens, and WSOL
      if (
        (token.isLP && (!siloToken || !tokensEqual(token, siloToken))) ||
        token.isSiloWrapped ||
        token.is3PSiloWrapped ||
        token.symbol.includes("WSOL")
      ) {
        filterSet.add(token);
        filterPreferred.push(token);
      }
    });

    return {
      filterSet,
      filterPreferred,
    };
  }, [balances, siloToken, tokenMap]);
}

export function useSiloDepositableTokenFilters() {
  const { balances } = useFarmerBalances();
  const tokenData = useTokenData();

  return useMemo(() => {
    const filterSet = new Set<Token>();
    const filterPreferred: Token[] = [];

    // Always include common tokens that users might want to deposit, regardless of balance
    const commonTokens = [
      tokenData.mainToken, // PINTO
      ...tokenData.lpTokens.filter((lp) => lp.isWhitelisted), // Whitelisted LP tokens
      tokenData.nativeToken, // ETH
      tokenData.wrappedNativeToken, // WETH
    ].filter(Boolean); // Remove any undefined tokens

    commonTokens.forEach((token) => {
      filterSet.add(token);
      filterPreferred.push(token);
    });

    // Include tokens that can be used as input for silo deposits:
    // 1. Any tokens the user has balances for (since they can be swapped to whitelisted tokens)
    // 2. Prioritize underlying tokens that can be directly swapped to LP tokens
    // 3. Include ETH/native tokens for direct swapping

    balances.forEach((balance, token) => {
      // Include all tokens that have balances, as they can potentially be swapped
      // to whitelisted silo tokens through the routing system
      if (balance.total.gt(0)) {
        filterSet.add(token);

        // Prioritize underlying tokens and native tokens for better UX
        if (
          token.isLPUnderlying ||
          token.isNative ||
          token.isWrappedNative ||
          token.symbol === "USDC" ||
          token.symbol === "WETH" ||
          token.symbol === "cbETH" ||
          token.symbol === "cbBTC" ||
          token.symbol === "WSOL" ||
          token.isMain
        ) {
          filterPreferred.push(token);
        }
      }
    });

    return {
      filterSet,
      filterPreferred,
    };
  }, [balances, tokenData.mainToken, tokenData.lpTokens, tokenData.nativeToken, tokenData.wrappedNativeToken]);
}

export function useSiloTargetTokenFilters() {
  const whitelistedTokens = useWhitelistedTokens();
  const tokenData = useTokenData();

  return useMemo(() => {
    const filterSet = new Set<Token>();

    // Include the main token (PINTO)
    filterSet.add(tokenData.mainToken);

    // Include whitelisted LP tokens as deposit targets
    // This is the key change - we want to show LP tokens as targets, not their underlying assets
    tokenData.lpTokens.forEach((lpToken) => {
      if (lpToken.isWhitelisted) {
        filterSet.add(lpToken);
      }
    });

    return {
      filterSet,
      filterArray: Array.from(filterSet),
    };
  }, [whitelistedTokens, tokenData.lpTokens, tokenData.mainToken]);
}

export function useSiloWithdrawTokenFilters(siloToken: Token) {
  const tokenMap = useTokenMap();
  const tokenData = useTokenData();

  return useMemo(() => {
    const filterSet = new Set<Token>();

    // Always allow withdrawal to the same token
    filterSet.add(siloToken);

    // For LP tokens, allow withdrawal to underlying tokens
    if (siloToken.isLP && siloToken.tokens?.length) {
      siloToken.tokens.forEach((tokenAddress) => {
        const underlyingToken = Object.values(tokenMap).find(
          (t) => t.address.toLowerCase() === tokenAddress.toLowerCase(),
        );
        if (underlyingToken) {
          filterSet.add(underlyingToken);
        }
      });
    }

    // Add common withdrawal targets that users might want to swap to
    const commonWithdrawTargets = [
      tokenData.mainToken, // PINTO
      tokenData.nativeToken, // ETH
      tokenData.wrappedNativeToken, // WETH
      ...Object.values(tokenMap).filter(
        (token) =>
          token.symbol === "USDC" ||
          token.symbol === "cbETH" ||
          token.symbol === "cbBTC" ||
          token.symbol === "WSOL" ||
          (token.isLP && token.isWhitelisted),
      ),
    ].filter(Boolean); // Remove any undefined tokens

    commonWithdrawTargets.forEach((token) => {
      if (token) filterSet.add(token);
    });

    return {
      filterSet,
      filterArray: Array.from(filterSet),
    };
  }, [siloToken, tokenMap, tokenData.mainToken, tokenData.nativeToken, tokenData.wrappedNativeToken]);
}

export function useSiloDepositedTokenFilters() {
  const farmerSilo = useFarmerSilo();

  return useMemo(() => {
    const filterSet = new Set<Token>();

    // Include all tokens that have active deposits in the silo
    for (const [token, depositData] of farmerSilo.deposits.entries()) {
      if (depositData.amount.gt(0)) {
        filterSet.add(token);
      }
    }

    return {
      filterSet,
      filterArray: Array.from(filterSet),
    };
  }, [farmerSilo.deposits]);
}
