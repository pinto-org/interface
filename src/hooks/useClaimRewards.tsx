import { TokenValue } from "@/classes/TokenValue";
import { beanstalkAbi, beanstalkAddress } from "@/generated/contractHooks";
import { useFarmerSiloNew } from "@/state/useFarmerSiloNew";
import { useSiloData } from "@/state/useSiloData";
import { useInvalidateSun, useSunData } from "@/state/useSunData";
import useTokenData from "@/state/useTokenData";
import { calculateConvertData } from "@/utils/convert";
import { useQueryClient } from "@tanstack/react-query";
import { estimateGas } from "@wagmi/core";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { encodeFunctionData } from "viem";
import { useAccount, useChainId, useConfig } from "wagmi";
import useTransaction from "./useTransaction";
import { encodeClaimRewardCombineCalls } from "@/utils/utils";

export function useClaimRewards() {
  const config = useConfig();
  const chainId = useChainId();
  const queryClient = useQueryClient();
  const account = useAccount().address;
  const data = useFarmerSiloNew();
  const siloData = useSiloData();
  const isRaining = useSunData().raining;
  const whitelistedTokens = useTokenData().whitelistedTokens;
  const farmerDeposits = data.deposits;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const invalidateSun = useInvalidateSun();

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

      // Generate convert calls with smart limits based on deposit counts
      const updateData: `0x${string}`[] = isRaining
        ? [] // Prevents L2L converts when it's raining
        : (() => {
            const tokenEntries = Array.from(farmerDeposits.entries());
            
            // First check if any tokens need combining (25+ deposits)
            const needsCombining = tokenEntries.some(([_, depositData]) => 
              depositData.deposits.length >= 25
            );

            if (needsCombining) {
              console.log("Combining logic triggered (25+ deposits of a single token)");
              // Use the combining logic
              // Check if any token has more than 200 deposits
              const highVolumeToken = tokenEntries.find(([_, depositData]) => 
                depositData.deposits.length >= 200
              );
              
              if (highVolumeToken) {
                console.log("Processing single high-volume token:", {
                  name: highVolumeToken[0].name,
                  depositCount: highVolumeToken[1].deposits.length
                });
                return encodeClaimRewardCombineCalls(highVolumeToken[1].deposits, highVolumeToken[0]);
              }

              // Check if any token has more than 100 deposits
              const hasLargeToken = tokenEntries.some(([_, depositData]) => 
                depositData.deposits.length >= 100
              );

              const eligibleTokens = tokenEntries
                .filter(([_token, depositData]) => {
                  const hasEnoughDeposits = depositData.deposits.length >= 20;
                  if (!hasEnoughDeposits) {
                    console.log("Skipping token:", {
                      name: _token.name,
                      symbol: _token.symbol,
                      depositCount: depositData.deposits.length,
                    });
                  }
                  return hasEnoughDeposits;
                });

              if (hasLargeToken) {
                console.log("Limiting to 3 tokens due to large deposit count");
                return eligibleTokens
                  .slice(0, 3)
                  .flatMap(([token, depositData]) => 
                    encodeClaimRewardCombineCalls(depositData.deposits, token)
                  );
              }

              return eligibleTokens
                .flatMap(([token, depositData]) => 
                  encodeClaimRewardCombineCalls(depositData.deposits, token)
                );
            } else {
              // If no tokens need combining, use the top 10 deposits logic
              console.log("No tokens need combining, processing top 10 deposits by BDV difference (regular L2L update)");
              
              // Collect all eligible deposits into a flat array with their token info
              const allDeposits = tokenEntries
                .flatMap(([token, depositData]) =>
                  depositData.deposits
                    .filter((deposit) => {
                      const bdvDiff = deposit.currentBdv.sub(deposit.depositBdv);
                      const onePercent = deposit.depositBdv.mul(0.01);
                      const minThreshold = TokenValue.min(onePercent, TokenValue.ONE);
                      return bdvDiff.gt(minThreshold) && !deposit.isGerminating;
                    })
                    .map((deposit) => ({
                      token,
                      deposit,
                      bdvDifference: deposit.currentBdv.sub(deposit.depositBdv),
                    })),
                );

              // Sort by BDV difference and take top 10
              const top10Deposits = allDeposits
                .filter((deposit) => deposit.bdvDifference.gte(TokenValue.ONE))
                .sort((a, b) => (b.bdvDifference.gt(a.bdvDifference) ? 1 : -1))
                .slice(0, 10);

              return top10Deposits.map(({ token, deposit }) => {
                const convertData = calculateConvertData(token, token, deposit.amount, deposit.amount);
                if (!convertData) {
                  throw new Error("Invalid convert data");
                }
                return encodeFunctionData({
                  abi: beanstalkAbi,
                  functionName: "convert",
                  args: [convertData, [deposit.stem.toBigInt()], [deposit.amount.toBigInt()]],
                });
              });
            }
          })();

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
  }, [account, chainId, config, farmerDeposits, whitelistedTokens, writeContractAsync, isRaining]);

  return {
    submitClaimRewards,
    isSubmitting: isSubmitting || isConfirming,
  };
}
