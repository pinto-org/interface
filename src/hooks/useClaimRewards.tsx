import { beanstalkAbi, beanstalkAddress } from "@/generated/contractHooks";
import useFarmerDepositedBalances from "@/state/useFarmerDepositedBalances";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { useSiloData } from "@/state/useSiloData";
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
  const whitelistedTokens = useTokenData().whitelistedTokens;
  const farmerDeposits = useFarmerDepositedBalances();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSuccess = useCallback(() => {
    const allQueryKeys = [...data.queryKeys, ...siloData.queryKeys, farmerDeposits.queryKey];
    allQueryKeys.forEach((query) => queryClient.invalidateQueries({ queryKey: query }));
  }, [queryClient, data.queryKeys, siloData.queryKeys, farmerDeposits.queryKey]);

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

      const updateData: `0x${string}`[] = [];
      for (const [token, depositData] of farmerDeposits.data.entries()) {
        for (const deposit of depositData.deposits) {
          if (deposit.currentBdv.gt(deposit.depositBdv) && !deposit.isGerminating) {
            const convertData = calculateConvertData(token, token, deposit.amount, deposit.amount);
            if (!convertData) {
              throw new Error("Invalid convert data");
            }
            const _updateData = encodeFunctionData({
              abi: beanstalkAbi,
              functionName: "convert",
              args: [convertData, [deposit.stem.toBigInt()], [deposit.amount.toBigInt()]],
            });
            updateData.push(_updateData);
          }
        }
      }

      const _gas = await estimateGas(config, {
        to: beanstalkAddress[chainId as keyof typeof beanstalkAddress],
        data: encodeFunctionData({
          abi: beanstalkAbi,
          functionName: "farm",
          args: [[plant, mow, ...updateData]],
        }),
      });

      setIsSubmitting(false);
      return writeContractAsync({
        address: beanstalkAddress[chainId as keyof typeof beanstalkAddress],
        abi: beanstalkAbi,
        functionName: "farm",
        args: [[plant, mow, ...updateData]],
        gas: _gas ? (_gas * 120n) / 100n : undefined,
      });
    } catch (e: unknown) {
      console.error(e);
      setIsSubmitting(false);
      toast.dismiss();
      toast.error(e instanceof Error ? e.message : "Transaction failed.");
      throw e;
    }
  }, [account, chainId, config, farmerDeposits.data, whitelistedTokens, writeContractAsync]);

  return {
    submitClaimRewards,
    isSubmitting: isSubmitting || isConfirming,
  };
}
