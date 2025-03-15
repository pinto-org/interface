import { TokenValue } from "@/classes/TokenValue";
import { beanstalkAbi, beanstalkAddress } from "@/generated/contractHooks";
import { useFarmerSilo } from "@/state/useFarmerSilo";
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

      // Collect all eligible deposits into a flat array with their token info
      const allDeposits = Array.from(farmerDeposits.entries())
        .filter(([token]) => !token.isMain) // Filter out main token deposits
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

      // Sort by BDV difference (highest to lowest) and take top 10
      const top10Deposits = allDeposits
        .filter((deposit) => deposit.bdvDifference.gte(TokenValue.ONE))
        .sort((a, b) => (b.bdvDifference.gt(a.bdvDifference) ? 1 : -1))
        .slice(0, 10);

      // Generate convert data for top 10
      const updateData: `0x${string}`[] = isRaining
        ? [] // Prevents L2L converts when it's raining
        : top10Deposits.map(({ token, deposit }) => {
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
