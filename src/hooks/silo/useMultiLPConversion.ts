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
      try {
        // Add defensive checks to prevent initialization errors
        if (!account?.address || !enabled || !lpTokens?.length || !siloConvert || !pintoToken) {
          console.log('Early return due to missing dependencies:', {
            account: !!account?.address,
            enabled,
            lpTokens: lpTokens?.length || 0,
            siloConvert: !!siloConvert,
            pintoToken: !!pintoToken
          });
          return {
            enabled: false,
            conversions: [],
            totalFromAmount: TokenValue.ZERO,
            totalToAmount: TokenValue.ZERO,
            totalGasEstimate: TokenValue.ZERO,
          };
        }
      } catch (initError) {
        console.error('Initialization error in multi-LP conversion:', initError);
        return {
          enabled: false,
          conversions: [],
          totalFromAmount: TokenValue.ZERO,
          totalToAmount: TokenValue.ZERO,
          totalGasEstimate: TokenValue.ZERO,
        };
      }

      // Wrap the main logic in try-catch to handle temporal dead zone errors
      try {
        const conversions: MultiLPConversionQuote["conversions"] = [];
        let totalFromAmount = TokenValue.ZERO;
        let totalToAmount = TokenValue.ZERO;
        let totalGasEstimate = TokenValue.ZERO;

      // Process each LP token conversion
      for (const token of lpTokens) {
        const conversionAmount = conversionAmounts.get(token);
        
        if (!conversionAmount?.gt(0)) {
          console.log(`Skipping ${token.symbol}: no conversion amount`);
          continue;
        }

        try {
          // Get farmer deposits for this token
          const deposits = farmerSilo.deposits.get(token);
          if (!deposits?.deposits.length) {
            console.log(`Skipping ${token.symbol}: no deposits`);
            continue;
          }

          // Use the deposits directly for conversion quote
          const depositData = deposits.deposits.filter(d => d.amount.gt(0));
          
          if (depositData.length === 0) {
            console.log(`Skipping ${token.symbol}: no valid deposit data`);
            continue;
          }

          // Ensure conversion amount doesn't exceed convertible amount
          const maxConvertible = deposits.convertibleAmount;
          const actualConversionAmount = TokenValue.min(conversionAmount, maxConvertible);
          
          // Set a minimum conversion threshold (e.g., 0.001 tokens)
          const minConversionAmount = TokenValue.fromHuman("0.001", token.decimals);
          
          if (!actualConversionAmount.gt(minConversionAmount)) {
            console.log(`Skipping ${token.symbol}: conversion amount ${actualConversionAmount.toHuman()} below minimum ${minConversionAmount.toHuman()}`);
            continue;
          }

          console.log(`Attempting conversion for ${token.symbol}: ${actualConversionAmount.toHuman()} (${percentage}% of ${maxConvertible.toHuman()})`);

          // Validate inputs before calling quote
          if (!token?.address || !pintoToken?.address) {
            console.error(`Invalid token addresses - ${token?.symbol}: ${token?.address}, ${pintoToken?.symbol}: ${pintoToken?.address}`);
            continue;
          }

          if (!siloConvert) {
            console.error(`SiloConvert instance is undefined`);
            continue;
          }

          let quotes;
          try {
            // Get quote from SiloConvert with enhanced error handling
            console.log(`Calling siloConvert.quote for ${token.symbol} -> ${pintoToken.symbol}...`);
            console.log(`Token details:`, {
              symbol: token.symbol,
              address: token.address,
              isLP: token.isLP,
              amount: actualConversionAmount.toHuman(),
              deposits: depositData.length
            });
            
            quotes = await siloConvert.quote(
              token,
              pintoToken,
              depositData,
              actualConversionAmount,
              slippage,
              new AbortController().signal
            );
            console.log(`Quote call completed for ${token.symbol}, received ${quotes.length} quotes`);
          } catch (quoteError) {
            console.error(`Quote failed for ${token.symbol}:`, quoteError);
            console.error(`Error details:`, {
              name: quoteError?.name,
              message: quoteError?.message,
              stack: quoteError?.stack?.split('\n').slice(0, 5)
            });
            // Skip this token and continue with others
            continue;
          }

          if (quotes && quotes.length > 0 && quotes[0].totalAmountOut.gt(0)) {
            const bestQuote = quotes[0]; // Use the first (best) quote
            console.log(`Successfully quoted ${token.symbol}: ${actualConversionAmount.toHuman()} → ${bestQuote.totalAmountOut.toHuman()} Pinto`);
            
            conversions.push({
              token,
              fromAmount: actualConversionAmount,
              toAmount: bestQuote.totalAmountOut,
              route: bestQuote.route,
              quote: bestQuote,
            });

            totalFromAmount = totalFromAmount.add(actualConversionAmount);
            totalToAmount = totalToAmount.add(bestQuote.totalAmountOut);
            
            // Estimate gas (rough approximation)
            totalGasEstimate = totalGasEstimate.add(TokenValue.fromHuman("0.01", 18)); // ~$0.01 per conversion
          } else {
            console.log(`No valid quotes for ${token.symbol}: ${quotes.length} quotes received`);
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
            conversions.map((conv) => {
              const deposits = farmerSilo.deposits.get(conv.token);
              return {
                fromToken: conv.token,
                toToken: pintoToken,
                amount: conv.fromAmount,
                deposits: deposits?.deposits.filter(d => d.amount.gt(0)) || [],
                route: conv.route,
              };
            })
          );
        } catch (error) {
          console.warn("Failed to build batch workflow:", error);
        }
      }

      const result = {
        enabled: conversions.length >= 2, // Require at least 2 successful conversions
        conversions,
        totalFromAmount,
        totalToAmount,
        totalGasEstimate,
        workflow,
      };

      console.log("Final conversion summary:", {
        percentage,
        enabled: result.enabled,
        conversions: result.conversions.length,
        totalFromAmount: result.totalFromAmount.toHuman(),
        totalToAmount: result.totalToAmount.toHuman(),
        lpTokens: lpTokens.map(t => t.symbol),
        conversionDetails: result.conversions.map(c => ({
          token: c.token.symbol,
          fromAmount: c.fromAmount.toHuman(),
          toAmount: c.toAmount.toHuman()
        }))
      });

      return result;
      
      } catch (mainError) {
        console.error('Main logic error in multi-LP conversion:', mainError);
        return {
          enabled: false,
          conversions: [],
          totalFromAmount: TokenValue.ZERO,
          totalToAmount: TokenValue.ZERO,
          totalGasEstimate: TokenValue.ZERO,
        };
      }
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
      // Get the workflow steps for transaction execution
      const workflowSteps = quote.workflow.getSteps();
      
      if (workflowSteps.length === 0) {
        throw new Error("No workflow steps found");
      }

      console.log("Executing multi-LP conversion with steps:", workflowSteps.length);
      
      // Return the workflow steps for the calling component to execute
      // The actual transaction execution should be handled by the calling component
      // using writeWithEstimateGas pattern
      return {
        workflowSteps,
        workflow: quote.workflow
      };
    } catch (error) {
      console.error("Multi-LP conversion execution failed:", error);
      throw error;
    }
  };
}