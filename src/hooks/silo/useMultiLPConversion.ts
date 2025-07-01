import { TokenValue } from "@/classes/TokenValue";
import { MAIN_TOKEN } from "@/constants/tokens";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { SiloConvert } from "@/lib/siloConvert/SiloConvert";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { usePriceData } from "@/state/usePriceData";
import { useSiloData } from "@/state/useSiloData";
import { useChainConstant } from "@/utils/chain";
import { pickCratesMultiple } from "@/utils/convert";
import { Token } from "@/utils/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { useAccount, useChainId, useConfig } from "wagmi";

export interface MultiLPConversionQuote {
  enabled: boolean;
  conversions: Array<{
    token: Token;
    fromAmount: TokenValue;
    toAmount: TokenValue;
    route: any; // SiloConvertRoute type
    quote: any; // ConvertStrategyQuote type
  }>;
  totalFromAmount: TokenValue;
  totalToAmount: TokenValue;
  totalGasEstimate: TokenValue;
  workflow?: any; // AdvancedFarmWorkflow type
}

export interface UseMultiLPConversionParams {
  lpTokens: Token[];
  percentage: number; // 0-100
  slippage: number; // 0.1 = 10%
  enabled?: boolean;
}

export function useMultiLPConversion({
  lpTokens,
  percentage,
  slippage,
  enabled = true,
}: UseMultiLPConversionParams) {
  const account = useAccount();
  const config = useConfig();
  const chainId = useChainId();
  const diamond = useProtocolAddress();
  const queryClient = useQueryClient();
  
  const farmerSilo = useFarmerSilo();
  const siloData = useSiloData();
  const priceData = usePriceData();
  const pintoToken = useChainConstant(MAIN_TOKEN);

  // Memoize conversion amounts based on percentage
  const conversionAmounts = useMemo(() => {
    const amounts = new Map<Token, TokenValue>();
    
    lpTokens.forEach((token) => {
      const deposits = farmerSilo.deposits.get(token);
      if (deposits?.convertibleAmount.gt(0)) {
        const convertAmount = deposits.convertibleAmount.mul(percentage / 100);
        amounts.set(token, convertAmount);
      }
    });
    
    return amounts;
  }, [lpTokens, percentage, farmerSilo.deposits]);

  // Create SiloConvert instance (we only need one for batch operations)
  const siloConvert = useMemo(() => {
    if (!account.address || !chainId) return null;
    return new SiloConvert(diamond, account.address, config, chainId);
  }, [diamond, account.address, config, chainId]);

  const queryKey = [
    "multiLPConversion",
    account.address,
    lpTokens.map(t => t.address).join(","),
    percentage,
    slippage,
    // Include relevant farmer data in cache key
    farmerSilo.deposits.size,
    Array.from(farmerSilo.deposits.entries()).map(([token, data]) => 
      `${token.address}:${data.convertibleAmount.toString()}`
    ).join("|"),
  ] as const;

  return useQuery({
    queryKey,
    queryFn: async (): Promise<MultiLPConversionQuote> => {
      if (!account.address || !enabled || lpTokens.length === 0 || !siloConvert) {
        return {
          enabled: false,
          conversions: [],
          totalFromAmount: TokenValue.ZERO,
          totalToAmount: TokenValue.ZERO,
          totalGasEstimate: TokenValue.ZERO,
        };
      }

      const conversions: MultiLPConversionQuote["conversions"] = [];
      let totalFromAmount = TokenValue.ZERO;
      let totalToAmount = TokenValue.ZERO;
      let totalGasEstimate = TokenValue.ZERO;

      // Process each LP token conversion
      for (const token of lpTokens) {
        const conversionAmount = conversionAmounts.get(token);
        
        if (!conversionAmount?.gt(0)) continue;

        try {
          // Get farmer deposits for this token
          const deposits = farmerSilo.deposits.get(token);
          if (!deposits?.deposits.length) continue;

          // Use the deposits directly for conversion quote
          const depositData = deposits.deposits.filter(d => d.amount.gt(0));
          
          if (depositData.length === 0) continue;

          // Get quote from SiloConvert
          const quotes = await siloConvert.quote(
            token,
            pintoToken,
            depositData,
            conversionAmount,
            slippage,
            new AbortController().signal
          );

          if (quotes.length > 0 && quotes[0].totalAmountOut.gt(0)) {
            const bestQuote = quotes[0]; // Use the first (best) quote
            conversions.push({
              token,
              fromAmount: conversionAmount,
              toAmount: bestQuote.totalAmountOut,
              route: bestQuote.route,
              quote: bestQuote,
            });

            totalFromAmount = totalFromAmount.add(conversionAmount);
            totalToAmount = totalToAmount.add(bestQuote.totalAmountOut);
            
            // Estimate gas (rough approximation)
            totalGasEstimate = totalGasEstimate.add(TokenValue.fromHuman("0.01", 18)); // ~$0.01 per conversion
          }
        } catch (error) {
          console.warn(`Failed to quote conversion for ${token.symbol}:`, error);
          // Continue with other tokens even if one fails
        }
      }

      // Build combined workflow if we have successful conversions
      let workflow;
      if (conversions.length > 0) {
        try {
          // Create a combined workflow using the SiloConvert instance
          workflow = await siloConvert.buildBatchWorkflow(
            conversions.map((conv) => ({
              fromToken: conv.token,
              toToken: pintoToken,
              amount: conv.fromAmount,
              route: conv.route,
            }))
          );
        } catch (error) {
          console.warn("Failed to build batch workflow:", error);
        }
      }

      return {
        enabled: conversions.length >= 2, // Require at least 2 successful conversions
        conversions,
        totalFromAmount,
        totalToAmount,
        totalGasEstimate,
        workflow,
      };
    },
    enabled: enabled && !!account.address && lpTokens.length >= 2 && !!siloConvert,
    staleTime: 30000, // 30 second cache
    refetchInterval: 60000, // Refetch every minute
    retry: 2,
  });
}

// Hook for executing the multi-LP conversion
export function useExecuteMultiLPConversion() {
  const config = useConfig();
  
  return async (quote: MultiLPConversionQuote) => {
    if (!quote.workflow || !quote.enabled) {
      throw new Error("Invalid conversion quote or workflow not available");
    }

    try {
      // Execute the batch workflow
      const result = await quote.workflow.execute();
      return result;
    } catch (error) {
      console.error("Multi-LP conversion execution failed:", error);
      throw error;
    }
  };
}