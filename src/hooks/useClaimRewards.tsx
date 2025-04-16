import { TokenValue } from "@/classes/TokenValue";
import { beanstalkAbi, beanstalkAddress } from "@/generated/contractHooks";
import { generateCombineAndL2LCallData, simulateGetSortedDeposits } from "@/lib/claim/depositUtils";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { useSiloData } from "@/state/useSiloData";
import { useInvalidateSun, useSunData } from "@/state/useSunData";
import useTokenData from "@/state/useTokenData";
import { useQueryClient } from "@tanstack/react-query";
import { estimateGas } from "@wagmi/core";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { encodeFunctionData } from "viem";
import { useAccount, useChainId, useConfig, usePublicClient } from "wagmi";
import useTransaction from "./useTransaction";
import { TRACTOR_HELPERS_ADDRESS } from "@/constants/address";

// Helper function to ensure a value is a properly formatted hex string
function ensureHexString(value: any): `0x${string}` {
  if (typeof value === 'string') {
    // Make sure it starts with 0x
    return (value.startsWith('0x') ? value : `0x${value}`) as `0x${string}`;
  }
  // If it's not a string, return the empty hex string
  return "0x" as `0x${string}`;
}

// Type definition for farm calls
type FarmCall = {
  callData: `0x${string}`;
  clipboard: `0x${string}`;
};

// Feature flag to enable/disable simulation
const ENABLE_SIMULATION = true;

export function useClaimRewards() {
  const config = useConfig();
  const chainId = useChainId();
  const queryClient = useQueryClient();
  const account = useAccount().address;
  const data = useFarmerSilo();
  const siloData = useSiloData();
  const isRaining = useSunData().raining;
  const whitelistedTokens = useTokenData().whitelistedTokens;
  const farmerDeposits = data.deposits;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const invalidateSun = useInvalidateSun();
  const publicClient = usePublicClient();

  const onSuccess = useCallback(() => {
    const allQueryKeys = [...data.queryKeys, ...siloData.queryKeys];
    allQueryKeys.forEach((query) => queryClient.invalidateQueries({ queryKey: query }));
    invalidateSun("all", { refetchType: "active" });
  }, [queryClient, data.queryKeys, siloData.queryKeys, invalidateSun]);

  const { isConfirming, writeContractAsync } = useTransaction({
    successMessage: "Claim complete!",
    successCallback: onSuccess,
  });

  const submitClaimRewards = useCallback(async () => {
    try {
      if (!account) {
        throw new Error("No account connected");
      }

      setIsSubmitting(true);
      toast.loading("Claiming rewards...");

      const plant = encodeFunctionData({
        abi: beanstalkAbi,
        functionName: "plant",
      });

      const tokensToMow = whitelistedTokens.map((token) => token.address);
      const mow = encodeFunctionData({
        abi: beanstalkAbi,
        functionName: "mowMultiple",
        args: [account, tokensToMow],
      });

      // Generate convert calls with smart limits using our utility function
      const updateData = generateCombineAndL2LCallData(farmerDeposits, isRaining);

      // Skip simulation if disabled by feature flag
      if (ENABLE_SIMULATION && publicClient && account) {
        try {
          console.log("Running simulation for debugging purposes...");
          
          // Directly use the raw encodeFunctionData results as an array of hex strings
          // These are already properly formatted hex strings
          const rawCallDataArray: `0x${string}`[] = [
            plant, 
            mow,
            ...updateData 
          ];
          
          console.log(`Created ${rawCallDataArray.length} raw callData items`);
          
          // Log some information about the farmer deposits to help debug
          console.log("Farmer deposits info:", {
            type: typeof farmerDeposits,
            isMap: farmerDeposits instanceof Map,
            size: farmerDeposits instanceof Map ? farmerDeposits.size : 'not a Map',
            firstKey: farmerDeposits instanceof Map && farmerDeposits.size > 0 ? 
              (Array.from(farmerDeposits.keys())[0]?.symbol || 'unknown') : 'none'
          });
          
          // Create a formatted object with token data that includes deposits
          const formattedTokens: Record<string, any> = {};
          
          // If it's a Map, log the keys and deposit counts
          if (farmerDeposits instanceof Map) {
            for (const [token, depositData] of farmerDeposits.entries()) {
              console.log(`Token in farmerDeposits: ${token.symbol}, deposits: ${depositData.deposits.length}`);
              
              // Only include tokens with deposits
              if (depositData.deposits.length > 0) {
                // Create a proper token object with deposits properly nested
                formattedTokens[token.address] = {
                  ...token,
                  address: token.address,
                  symbol: token.symbol,
                  deposited: {
                    deposits: depositData.deposits.reduce((acc, deposit) => {
                      // Use the stem as the key and store the deposit
                      acc[deposit.stem.toString()] = deposit;
                      return acc;
                    }, {} as Record<string, any>)
                  }
                };
                
                console.log(`Added token to formatted tokens: ${token.symbol}, deposit count: ${Object.keys(formattedTokens[token.address].deposited.deposits).length}`);
              }
            }
          }
          
          // Log the structure for debugging
          console.log("Raw call data array first 2 items:", rawCallDataArray.slice(0, 2));
          console.log("Number of formatted tokens:", Object.keys(formattedTokens).length);
          
          const contractAddress = beanstalkAddress[chainId as keyof typeof beanstalkAddress];
          
          // Call the simulation function with our properly formatted token data
          const simulationResults = await simulateGetSortedDeposits(
            account as `0x${string}`,
            formattedTokens,
            rawCallDataArray,
            publicClient,
            contractAddress as `0x${string}`,
            TRACTOR_HELPERS_ADDRESS as `0x${string}`
          );
          
          console.log("Simulation completed for debugging:", {
            hasResults: !!simulationResults,
            gasEstimated: simulationResults?.simulationResult?.request?.gas || 'unknown',
            sortedDepositsCount: Object.keys(simulationResults?.sortedDeposits || {}).length,
            tokens: Object.keys(simulationResults?.sortedDeposits || {}).map(addr => 
              `Token ${addr}: ${simulationResults.sortedDeposits[addr].stems.length} stems`
            )
          });
        } catch (simError) {
          // If simulation fails, log but continue with the transaction
          console.error("Simulation failed:", simError);
          console.log("Continuing with transaction despite simulation failure");
          return; //return so we don't have to reset the test env each time
        }
      }

      const _gas = await estimateGas(config, {
        to: beanstalkAddress[chainId as keyof typeof beanstalkAddress],
        data: encodeFunctionData({
          abi: beanstalkAbi,
          functionName: "farm",
          args: [[plant, mow, ...updateData]],
        }),
      }).catch((e) => {
        console.error("failed to estimate gas... using default of 20m gas", e);
        return 0n;
      });

      // fallback to 20m gas if estimateGas returns fails and returns 0n
      const gasWithBuffer = _gas === 0n ? 20_000_000n : (_gas * 160n) / 100n;

      setIsSubmitting(false);
      return writeContractAsync({
        address: beanstalkAddress[chainId as keyof typeof beanstalkAddress],
        abi: beanstalkAbi,
        functionName: "farm",
        args: [[plant, mow, ...updateData]],
        gas: gasWithBuffer,
      });
    } catch (e: unknown) {
      console.error(e);
      setIsSubmitting(false);
      toast.dismiss();
      toast.error(e instanceof Error ? e.message : "Transaction failed.");
      throw e;
    }
  }, [account, chainId, config, farmerDeposits, whitelistedTokens, writeContractAsync, isRaining, publicClient]);

  return {
    submitClaimRewards,
    isSubmitting: isSubmitting || isConfirming,
  };
}
