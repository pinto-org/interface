import { TokenValue } from "@/classes/TokenValue";
import { diamondABI } from "@/constants/abi/diamondABI";
import { ZERO_ADDRESS } from "@/constants/address";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import useTransaction from "@/hooks/useTransaction";
import { useFarmerBalances } from "@/state/useFarmerBalances";
import { FarmFromMode, Token } from "@/utils/types";
import { exists } from "@/utils/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { toast } from "sonner";
import { Address, erc20Abi } from "viem";
import { useAccount, useReadContract } from "wagmi";
import { Button, ButtonProps } from "./ui/Button";

interface SmartSubmitButton extends Omit<ButtonProps, "onClick" | "disabled" | "className"> {
  token?: Token;
  amount?: string;
  submitFunction: () => void;
  submitButtonText?: string;
  className?: string;
  disabled?: boolean;
  balanceFrom?: FarmFromMode;
  spender?: Address;
  requiresDiamondAllowance?: boolean;
}

export default function SmartSubmitButton({
  token,
  amount,
  submitFunction,
  submitButtonText,
  className,
  disabled,
  balanceFrom,
  spender,
  requiresDiamondAllowance,
  ...props
}: SmartSubmitButton) {
  const account = useAccount();
  const queryClient = useQueryClient();
  const farmerBalances = useFarmerBalances().balances;
  const diamond = useProtocolAddress();
  const baseAllowanceQueryEnabled = !!account.address && !!token && !token.isNative;

  const {
    data: tokenAllowance,
    isFetching: tokenAllowanceFetching,
    queryKey: tokenAllowanceQueryKey,
  } = useReadContract({
    abi: erc20Abi,
    address: token?.address,
    functionName: "allowance",
    scopeKey: "allowance",
    args: [account.address ?? ZERO_ADDRESS, spender ?? diamond],
    query: {
      enabled: baseAllowanceQueryEnabled && !requiresDiamondAllowance,
    },
  });

  const {
    data: diamondAllowance,
    isFetching: diamondAllowanceFetching,
    queryKey: diamondAllowanceQueryKey,
  } = useReadContract({
    abi: diamondABI,
    address: diamond,
    functionName: "tokenAllowance",
    args: [account.address ?? ZERO_ADDRESS, spender ?? ZERO_ADDRESS, token?.address ?? ZERO_ADDRESS],
    query: {
      enabled: baseAllowanceQueryEnabled && requiresDiamondAllowance && !!spender,
    },
  });

  const allowance = requiresDiamondAllowance ? diamondAllowance : tokenAllowance;
  const allowanceFetching = requiresDiamondAllowance ? diamondAllowanceFetching : tokenAllowanceFetching;
  const allowanceQueryKey = requiresDiamondAllowance ? diamondAllowanceQueryKey : tokenAllowanceQueryKey;

  const onSuccess = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: allowanceQueryKey });
  }, [queryClient, allowanceQueryKey]);

  const {
    submitting: submittingApproval,
    isConfirming: isConfirmingApproval,
    setSubmitting: setSubmittingApproval,
    writeWithEstimateGas,
  } = useTransaction({
    successCallback: onSuccess,
    successMessage: "Approval success",
    errorMessage: "Approval failed",
  });

  const needsApproval = useMemo(() => {
    if (!token || !exists(balanceFrom) || token.isNative) {
      return false;
    }

    // Convert amount to TokenValue for comparison
    const inputAmount = TokenValue.fromHuman(amount || 0, token.decimals);

    // Get internal balance
    const tokenBalances = farmerBalances.get(token);
    const internalBalance = tokenBalances?.internal ?? TokenValue.ZERO;

    // Get allowance
    const allowanceAmount = TokenValue.fromBlockchain(allowance || 0, token.decimals);

    // If allowance covers the full amount, no approval needed
    if (allowanceAmount.gte(inputAmount)) {
      return false;
    } else if (requiresDiamondAllowance) {
      return allowanceAmount.lt(inputAmount);
    } else {
      // Balance doesn't cover full amount
      switch (balanceFrom) {
        case FarmFromMode.EXTERNAL:
          return true;
        case FarmFromMode.INTERNAL:
          return false;
        case FarmFromMode.INTERNAL_EXTERNAL:
          // Need approval if amount exceeds internal balance
          return inputAmount.gt(internalBalance);
        default:
          return false;
      }
    }
  }, [allowance, farmerBalances, amount, token, balanceFrom]);

  async function approveOrRun() {
    if (needsApproval) {
      try {
        if (!token || !exists(amount)) return;
        setSubmittingApproval(true);
        toast.loading("Approving...");

        const inputAmount = TokenValue.fromHuman(amount, token?.decimals);

        if (requiresDiamondAllowance) {
          if (!spender) throw new Error("Spender required");

          return writeWithEstimateGas({
            abi: diamondABI,
            address: diamond,
            functionName: "approveToken",
            args: [spender, token.address, inputAmount.toBigInt()],
          });
        }

        return writeWithEstimateGas({
          abi: erc20Abi,
          address: token?.address ?? ZERO_ADDRESS,
          functionName: "approve",
          args: [spender ?? diamond, inputAmount.toBigInt()],
        });
      } catch (e) {
        console.error(e);
        toast.dismiss();
        toast.error("Approval failed");
        throw e;
      } finally {
        setSubmittingApproval(false);
      }
    } else {
      await submitFunction();
    }
  }

  const btnDisabled = disabled || allowanceFetching || submittingApproval || isConfirmingApproval;
  const btnApproval = needsApproval && !allowanceFetching;

  return (
    <Button
      type={"button"}
      {...props}
      disabled={btnDisabled}
      rounded="full"
      size="xxl"
      width="full"
      className={`${className}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        approveOrRun();
      }}
    >
      {isConfirmingApproval
        ? "Sending Transaction"
        : account.address && btnApproval
          ? "Approve Spending"
          : submitButtonText || "Submit"}
    </Button>
  );
}
