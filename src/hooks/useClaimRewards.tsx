import { ANALYTICS_EVENTS } from "@/constants/analytics-events";
import { beanstalkAbi, beanstalkAddress } from "@/generated/contractHooks";
import { generateCombineAndL2LCallData } from "@/lib/claim/depositUtils";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { useSiloData } from "@/state/useSiloData";
import { useInvalidateSun, useSunData } from "@/state/useSunData";
import useTokenData from "@/state/useTokenData";
import { trackClick } from "@/utils/analytics";
import { useQueryClient } from "@tanstack/react-query";
import { estimateGas } from "@wagmi/core";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { encodeFunctionData } from "viem";
import { useAccount, useChainId, useConfig } from "wagmi";
import useTransaction from "./useTransaction";

export function useClaimRewards() {
  const config = useConfig();
  const chainId = useChainId();
  const queryClient = useQueryClient();
  const account = useAccount().address;
  const data = useFarmerSilo();
  const siloData = useSiloData();
  const isRaining = useSunData().raining;
  const { whitelistedTokens, mayBeWhitelistedTokens } = useTokenData();
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

      trackClick(ANALYTICS_EVENTS.SILO.CLAIM_REWARDS_SUBMIT)();

      const plant = encodeFunctionData({
        abi: beanstalkAbi,
        functionName: "plant",
      });

      const tokensToMow = mayBeWhitelistedTokens.map((token) => token.address);
      const mow = encodeFunctionData({
        abi: beanstalkAbi,
        functionName: "mowMultiple",
        args: [account, tokensToMow],
      });

      // Generate convert calls with smart limits using our utility function
      const updateData = generateCombineAndL2LCallData(farmerDeposits);

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
