import { TokenValue } from "@/classes/TokenValue";
import { useSwapMany } from "@/hooks/swap/useSwap";
import { useMemo } from "react";

import { SowOrderTokenStrategy } from "@/lib/Tractor/types";
import { needsCombining } from "@/lib/claim/depositUtils";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { usePriceData } from "@/state/usePriceData";
import useTokenData from "@/state/useTokenData";
import { DepositData } from "@/utils/types";

type UseSowOrderV0CalculationsOptions = {
  disableSwapCalc?: boolean;
};

export default function useSowOrderV0Calculations(options?: UseSowOrderV0CalculationsOptions) {
  const farmerSilo = useFarmerSilo();
  const farmerDeposits = farmerSilo.deposits;
  const { whitelistedTokens, mainToken } = useTokenData();
  const priceData = usePriceData();

  // LP tokens and swap data
  const lpTokens = useMemo(() => whitelistedTokens.filter((t) => t.isLP), [whitelistedTokens]);

  const swapArgs = useMemo(() => {
    return lpTokens.map((token) => {
      const amount = farmerDeposits.get(token)?.amount || TokenValue.ZERO;
      return {
        tokenIn: token,
        tokenOut: mainToken,
        amountIn: amount,
        slippage: 0.5,
        disabled: amount.eq(0),
      };
    });
  }, [mainToken, farmerDeposits, lpTokens]);

  const swapQuotes = useSwapMany({ args: swapArgs, disabled: options?.disableSwapCalc });

  const swapResults = useMemo(() => {
    const results = new Map<string, TokenValue>();
    lpTokens.forEach((token, i) => {
      const buyAmount = swapQuotes?.data?.[i]?.buyAmount;
      if (buyAmount) {
        results.set(token.address, buyAmount);
      }
    });
    return results;
  }, [lpTokens, swapQuotes]);

  // Token strategy logic
  const tokenWithHighestValue = useMemo(() => {
    let highestValue = TokenValue.ZERO;
    let tokenWithHighestValueAddr: string | null = null;
    let tokenType: "SPECIFIC_TOKEN" | "LOWEST_SEEDS" | "MULTI_TOKENS" = "LOWEST_SEEDS";

    // Check PINTO token first
    const pintoToken = whitelistedTokens.find((t) => t.symbol === "PINTO");
    if (pintoToken) {
      const pintoDeposit = farmerDeposits.get(pintoToken);
      if (pintoDeposit?.amount) {
        const pintoDollarValue = pintoDeposit.amount.mul(priceData.price);
        if (pintoDollarValue.gt(highestValue)) {
          highestValue = pintoDollarValue;
          tokenWithHighestValueAddr = pintoToken.address;
          tokenType = "SPECIFIC_TOKEN";
        }
      }
    }

    // Check all LP tokens
    whitelistedTokens.forEach((token) => {
      if (token.isLP) {
        const lpDollarValue = swapResults.get(token.address);
        if (lpDollarValue && lpDollarValue.gt(highestValue)) {
          highestValue = lpDollarValue;
          tokenWithHighestValueAddr = token.address;
          tokenType = "SPECIFIC_TOKEN";
        }
      }
    });

    if (!tokenWithHighestValueAddr) {
      return { type: "LOWEST_SEEDS" } as SowOrderTokenStrategy;
    }

    return {
      type: tokenType,
      address: tokenWithHighestValueAddr as `0x${string}`,
    } as SowOrderTokenStrategy;
  }, [farmerDeposits, whitelistedTokens, priceData.price, swapResults]);

  // Check if deposits need optimization
  const areDepositsSorted = (deposits: DepositData[]): boolean => {
    if (!deposits || deposits.length <= 1) return true;

    for (let i = 1; i < deposits.length; i++) {
      const currentStem = deposits[i].stem.toBigInt();
      const previousStem = deposits[i - 1].stem.toBigInt();
      if (currentStem <= previousStem) return false;
    }
    return true;
  };

  const allTokensSorted = useMemo(() => {
    if (!farmerDeposits || farmerDeposits.size === 0) return true;
    return Array.from(farmerDeposits.entries()).every(([token, depositData]) => {
      return areDepositsSorted(depositData.deposits || []);
    });
  }, [farmerDeposits]);

  const needsOptimization = useMemo(() => {
    if (!farmerDeposits || farmerDeposits.size === 0) return false;
    const needsCombiningResult = needsCombining(farmerDeposits);
    const needsSortingResult = !allTokensSorted;
    return needsCombiningResult || needsSortingResult;
  }, [farmerDeposits, allTokensSorted]);

  return useMemo(
    () => ({
      tokenWithHighestValue,
      swapResults,
      priceData, // return price data for convenience
      needsOptimization,
      allTokensSorted,
      isLoading: swapQuotes.isLoading && !options?.disableSwapCalc,
    }),
    [
      allTokensSorted,
      needsOptimization,
      tokenWithHighestValue,
      swapResults,
      priceData,
      swapQuotes.isLoading,
      options?.disableSwapCalc,
    ],
  );
}
