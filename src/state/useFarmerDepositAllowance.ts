import { TV } from "@/classes/TokenValue";
import { diamondABI } from "@/constants/abi/diamondABI";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import useTransaction from "@/hooks/useTransaction";
import { tryExtractErrorMessage } from "@/utils/error";
import { tokensEqual } from "@/utils/token";
import { Token } from "@/utils/types";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { toast } from "sonner";
import { Address } from "viem";
import { useAccount, useReadContract } from "wagmi";
import { useWhitelistedTokens } from "./useTokenData";

export default function useFarmerDepositAllowance(spender: Address, token: Token, enabled: boolean = true) {
  const { address: account } = useAccount();
  const diamond = useProtocolAddress();

  const whitelist = useWhitelistedTokens();

  const isWhitelistedToken = Boolean(whitelist.find((t) => tokensEqual(t, token)));

  const qc = useQueryClient();

  const query = useReadContract({
    address: diamond,
    abi: diamondABI,
    functionName: "depositAllowance",
    args: [account ?? "0x", spender, token.address],
    query: {
      enabled: Boolean(account) && enabled && isWhitelistedToken,
      select: (data) => TV.fromBigInt(data, token.decimals),
    },
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

  const setAllowance = useCallback(
    async (totalAmount: TV) => {
      try {
        if (!account) {
          throw new Error("Signer Required");
        }
        if (!isWhitelistedToken) {
          throw new Error("Token is not whitelisted");
        }
        if (!query.isFetched) {
          throw new Error("Allowance not fetched");
        }

        const increaseAmount = totalAmount.sub(currentAllowance ?? 0n);

        return writeWithEstimateGas({
          address: diamond,
          abi: diamondABI,
          functionName: "increaseDepositAllowance",
          args: [spender, token.address, increaseAmount],
        });
      } catch (e) {
        console.error(e);
        const eMessage = tryExtractErrorMessage(e, "Failed to set Silo Deposit allowance");
        toast.error(eMessage);
        throw e;
      } finally {
        setSubmitting(false);
      }
    },
    [account, currentAllowance, token.address, onSuccess, query.queryKey, writeWithEstimateGas, isWhitelistedToken],
  );

  return {
    allowance: currentAllowance,
    setAllowance,
    queryKey: query.queryKey,
    loading: query.isLoading,
    confirming: isConfirming || submitting,
    refetch: query.refetch,
  };
}
