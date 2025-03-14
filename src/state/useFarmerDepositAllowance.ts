import { diamondABI } from "@/constants/abi/diamondABI";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { useAccount, useReadContract } from "wagmi";
import useTokenData from "./useTokenData";
import { useCallback } from "react";
import useTransaction from "@/hooks/useTransaction";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { tryExtractErrorMessage } from "@/utils/error";
import { TV } from "@/classes/TokenValue";
import { useChainConstant } from "@/utils/chain";
import { S_MAIN_TOKEN } from "@/constants/tokens";

export default function useFarmerDepositAllowance() {
  const { address: account } = useAccount();
  const diamond = useProtocolAddress();
  const { mainToken } = useTokenData();
  const sMainToken = useChainConstant(S_MAIN_TOKEN);

  const qc = useQueryClient();

  const query = useReadContract({
    address: diamond,
    abi: diamondABI,
    functionName: "depositAllowance",
    args: [account ?? "0x", sMainToken.address, mainToken.address],
    query: {
      enabled: Boolean(account),
      select: (data) => TV.fromBigInt(data, mainToken.decimals),
    }
  });

  const currentAllowance = query.data;

  const onSuccess = useCallback(() => {
    return qc.invalidateQueries({ queryKey: query.queryKey });
  }, [qc, query.queryKey]);

  const { isConfirming, writeWithEstimateGas, submitting, setSubmitting } = useTransaction({
    successMessage: "Silo Deposit allowance set",
    errorMessage: "Failed to set Silo Deposit allowance",
    successCallback: onSuccess,
  });

  const setAllowance = useCallback(async (totalAmount: TV) => {
    try {
      if (!account) {
        throw new Error("Signer Required");
      }
      if (!query.isFetched) {
        throw new Error("Allowance not fetched");
      }

      const increaseAmount = totalAmount.sub(currentAllowance ?? 0n);

      return writeWithEstimateGas({
        address: diamond,
        abi: diamondABI,
        functionName: "increaseDepositAllowance",
        args: [sMainToken.address, mainToken.address, increaseAmount]
      });
    } catch (e) {
      console.error(e);
      const eMessage = tryExtractErrorMessage(e, "Failed to set Silo Deposit allowance");
      toast.error(eMessage);
      throw e;
    } finally {
      setSubmitting(false);
    }
  }, [account, currentAllowance, mainToken.address, onSuccess, query.queryKey, writeWithEstimateGas]);

  return {
    allowance: currentAllowance,
    setAllowance,
    queryKey: query.queryKey,
    loading: query.isLoading,
    confirming: isConfirming || submitting,
  }
}
