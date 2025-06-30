import { TokenValue } from "@/classes/TokenValue";
import { PINTO } from "@/constants/tokens";
import { SowOrderTokenStrategy } from "@/lib/Tractor/types";
import {
  TractorOrderCalculations,
  TractorOrderFormState,
  CleanedFormValues,
  TokenInfo,
  FarmerDepositInfo,
} from "@/lib/Tractor/tractorOrderTypes";
import {
  sanitizeNumericInputValue,
  calculateEstimatedExecutions,
  calculateEstimatedTotalTip,
  calculatePodLineValue,
} from "@/lib/Tractor/tractorOrderUtils";
import { useSwapMany } from "@/hooks/swap/useSwap";
import { usePriceData } from "@/state/usePriceData";
import useTokenData from "@/state/useTokenData";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { formatter } from "@/utils/format";
import { useMemo } from "react";

interface UseTractorOrderCalculationsProps {
  formState: TractorOrderFormState;
  podLine: TokenValue;
}

export function useTractorOrderCalculations({ formState, podLine }: UseTractorOrderCalculationsProps) {
  const { whitelistedTokens, mainToken } = useTokenData();
  const priceData = usePriceData();
  const farmerSilo = useFarmerSilo();
  const farmerDeposits = farmerSilo.deposits;

  // Get LP tokens for swap calculations
  const lpTokens = useMemo(() => whitelistedTokens.filter((t) => t.isLP), [whitelistedTokens]);

  // Create swap arguments for LP tokens
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

  // Get swap quotes for LP tokens
  const swapQuotes = useSwapMany({
    args: swapArgs,
  });

  // Combine swap results into a map
  const swapResults = useMemo(() => {
    const results = new Map<string, TokenValue>();
    lpTokens.forEach((token, i) => {
      const buyAmount = swapQuotes[i]?.data?.buyAmount;
      if (buyAmount) {
        results.set(token.address, buyAmount);
      }
    });
    return results;
  }, [lpTokens, swapQuotes]);

  // Calculate cleaned form values for use in calculations
  const cleanedValues: CleanedFormValues = useMemo(() => {
    return {
      min: sanitizeNumericInputValue(formState.minSoil, PINTO.decimals).tv,
      max: sanitizeNumericInputValue(formState.maxPerSeason, PINTO.decimals).tv,
      total: sanitizeNumericInputValue(formState.totalAmount, PINTO.decimals).tv,
      podLine: sanitizeNumericInputValue(formState.podLineLength, PINTO.decimals).tv,
      temperature: sanitizeNumericInputValue(formState.temperature, PINTO.decimals).tv,
    };
  }, [formState]);

  // Calculate the token with the highest dollar value
  const tokenWithHighestValue = useMemo(() => {
    let highestValue = TokenValue.ZERO;
    let tokenWithHighestValue: string | null = null;
    let tokenType: "SPECIFIC_TOKEN" | "LOWEST_SEEDS" = "LOWEST_SEEDS";

    // Check PINTO token first
    const pintoToken = whitelistedTokens.find((t) => t.symbol === "PINTO");
    if (pintoToken) {
      const pintoDeposit = farmerDeposits.get(pintoToken);
      if (pintoDeposit?.amount) {
        const pintoDollarValue = pintoDeposit.amount.mul(priceData.price);
        if (pintoDollarValue.gt(highestValue)) {
          highestValue = pintoDollarValue;
          tokenWithHighestValue = pintoToken.address;
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
          tokenWithHighestValue = token.address;
          tokenType = "SPECIFIC_TOKEN";
        }
      }
    });

    // If no token has value, default to LOWEST_SEEDS
    if (!tokenWithHighestValue) {
      return { type: "LOWEST_SEEDS" } as SowOrderTokenStrategy;
    }

    // Return the token with highest value
    return {
      type: tokenType,
      address: tokenWithHighestValue as `0x${string}`,
    } as SowOrderTokenStrategy;
  }, [farmerDeposits, whitelistedTokens, priceData.price, swapResults]);

  // Create calculations object
  const calculations: TractorOrderCalculations = {
    calculateEstimatedExecutions: () => {
      return calculateEstimatedExecutions(
        formState.totalAmount,
        formState.minSoil,
        formState.maxPerSeason,
        PINTO.decimals,
      );
    },

    calculateEstimatedTotalTip: () => {
      return calculateEstimatedTotalTip(
        formState.operatorTip,
        formState.totalAmount,
        formState.minSoil,
        formState.maxPerSeason,
        PINTO.decimals,
      );
    },

    calculatePodLineValue: (increment: number) => {
      const newValue = calculatePodLineValue(podLine, increment);
      return formatter.number(newValue);
    },

    isButtonActive: (increment: number) => {
      const calculatedValue = calculations.calculatePodLineValue(increment);
      return formState.podLineLength === calculatedValue;
    },

    getSelectedTokenDisplay: () => {
      if (formState.selectedTokenStrategy.type === "LOWEST_SEEDS") {
        return "Token with Least Seeds";
      } else if (formState.selectedTokenStrategy.type === "LOWEST_PRICE") {
        return "Token with Best Price";
      } else if (formState.selectedTokenStrategy.type === "SPECIFIC_TOKEN") {
        const token = whitelistedTokens.find((t) => 
          t.address === (formState.selectedTokenStrategy as any).address
        );
        return token?.symbol || "Select Token";
      }
      return "Select Deposited Silo Token";
    },

    getSelectedTokenDollarValue: () => {
      if (formState.selectedTokenStrategy.type === "SPECIFIC_TOKEN") {
        const token = whitelistedTokens.find((t) => 
          t.address === (formState.selectedTokenStrategy as any).address
        );

        // If it's PINTO token, use its direct value multiplied by price
        if (token?.symbol === "PINTO") {
          const pintoDeposit = farmerDeposits.get(token);
          return pintoDeposit?.amount ? pintoDeposit.amount.mul(priceData.price) : TokenValue.ZERO;
        }

        return swapResults.get((formState.selectedTokenStrategy as any).address) || TokenValue.ZERO;
      } else if (
        formState.selectedTokenStrategy.type === "LOWEST_PRICE" ||
        formState.selectedTokenStrategy.type === "LOWEST_SEEDS"
      ) {
        // Sum all token dollar values
        let totalValue = TokenValue.ZERO;

        // Include PINTO tokens in the calculation
        const pintoToken = whitelistedTokens.find((t) => t.symbol === "PINTO");
        if (pintoToken) {
          const pintoDeposit = farmerDeposits.get(pintoToken);
          if (pintoDeposit?.amount) {
            totalValue = totalValue.add(pintoDeposit.amount.mul(priceData.price));
          }
        }

        // Add all LP token values
        swapResults.forEach((value) => {
          totalValue = totalValue.add(value);
        });

        return totalValue;
      }
      return TokenValue.ZERO;
    },
  };

  return {
    calculations,
    cleanedValues,
    tokenWithHighestValue,
    swapResults,
    farmerDeposits,
    whitelistedTokens,
    priceData,
  };
}