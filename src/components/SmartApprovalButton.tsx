import { TokenValue } from "@/classes/TokenValue";
import { diamondABI } from "@/constants/abi/diamondABI";
import { ZERO_ADDRESS } from "@/constants/address";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import useTransaction from "@/hooks/useTransaction";
import { useFarmerBalances } from "@/state/useFarmerBalances";
import { toSafeTVFromHuman } from "@/utils/number";
import { FarmFromMode, Token } from "@/utils/types";
import { exists } from "@/utils/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Address, erc20Abi } from "viem";
import { useAccount, useReadContract } from "wagmi";
import { Button, ButtonProps } from "./ui/Button";

type ApprovalState = "idle" | "approving" | "approved";

interface SmartApprovalButton extends Omit<ButtonProps, "onClick" | "disabled" | "className"> {
  token?: Token;
  amount?: string;
  callback?: () => void;
  className?: string;
  disabled?: boolean;
  balanceFrom?: FarmFromMode;
  spender?: Address;
  requiresDiamondAllowance?: boolean;
  forceApproval?: boolean;
}

export default function SmartApprovalButton({
  token,
  amount,
  callback,
  className,
  disabled,
  balanceFrom,
  spender,
  requiresDiamondAllowance,
  forceApproval,
  ...props
}: SmartApprovalButton) {
  const account = useAccount();
  const queryClient = useQueryClient();
  const farmerBalances = useFarmerBalances().balances;
  const diamond = useProtocolAddress();
  const baseAllowanceQueryEnabled = !!account.address && !!token && !token.isNative;
  const [approvalState, setApprovalState] = useState<ApprovalState>("idle");

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
    setApprovalState("approved");
    callback?.();
  }, [queryClient, allowanceQueryKey, callback]);

  const onError = useCallback(() => {
    setApprovalState("idle");
    return false; // Let the hook handle the error toast
  }, []);

  const {
    submitting: submittingApproval,
    isConfirming: isConfirmingApproval,
    setSubmitting: setSubmittingApproval,
    writeWithEstimateGas,
    error: approvalError,
  } = useTransaction({
    successCallback: onSuccess,
    successMessage: "Approval success",
    errorMessage: "Approval failed",
    onError,
  });

  // Reset approval state on error
  useEffect(() => {
    if (approvalError && approvalState === "approving") {
      setApprovalState("idle");
    }
  }, [approvalError, approvalState]);

  const needsApproval = useMemo(() => {
    if (!token || !exists(balanceFrom) || token.isNative) {
      return false;
    }

    // Convert amount to TokenValue for comparison
    const inputAmount = toSafeTVFromHuman(amount ?? "", token);

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
  }, [allowance, farmerBalances, amount, token, balanceFrom, requiresDiamondAllowance]);

  // Update approval state when submitting/confirming
  useEffect(() => {
    if (submittingApproval || isConfirmingApproval) {
      setApprovalState("approving");
    }
  }, [submittingApproval, isConfirmingApproval]);

  // Check if already approved based on allowance
  const isApproved = useMemo(() => {
    if (!token || token.isNative || !allowance) return false;
    if (!amount) return false;

    const inputAmount = toSafeTVFromHuman(amount, token);
    const allowanceAmount = TokenValue.fromBlockchain(allowance, token.decimals);
    return allowanceAmount.gte(inputAmount);
  }, [token, allowance, amount]);

  // Update approval state when allowance changes
  useEffect(() => {
    if (!allowanceFetching) {
      if (isApproved) {
        setApprovalState("approved");
      } else if (approvalState === "approved" && !isApproved) {
        // If allowance was revoked or changed, reset to idle
        setApprovalState("idle");
      }
    }
  }, [isApproved, allowanceFetching, approvalState]);

  async function handleApprove() {
    if ((!forceApproval && !needsApproval) || !token || !exists(amount)) return;

    try {
      setSubmittingApproval(true);
      setApprovalState("approving");
      toast.loading("Approving...");

      const inputAmount = toSafeTVFromHuman(amount, token);

      if (requiresDiamondAllowance) {
        if (!spender) throw new Error("Spender required");

        await writeWithEstimateGas({
          abi: diamondABI,
          address: diamond,
          functionName: "approveToken",
          args: [spender, token.address, inputAmount.toBigInt()],
        });
      } else {
        await writeWithEstimateGas({
          abi: erc20Abi,
          address: token.address ?? ZERO_ADDRESS,
          functionName: "approve",
          args: [spender ?? diamond, inputAmount.toBigInt()],
        });
      }
    } catch (e) {
      console.error(e);
      setApprovalState("idle");
      toast.dismiss();
      toast.error("Approval failed");
      throw e;
    } finally {
      setSubmittingApproval(false);
    }
  }

  const isApproving = approvalState === "approving" || submittingApproval || isConfirmingApproval;
  const isDisabled =
    disabled ||
    allowanceFetching ||
    isApproving ||
    (!forceApproval && approvalState === "approved") ||
    (!forceApproval && !needsApproval);

  const getButtonText = () => {
    if (isApproving) {
      return "Approving";
    }
    if (approvalState === "approved") {
      return "Approved";
    }
    return "Approve";
  };

  return (
    <Button
      type={"button"}
      {...props}
      disabled={isDisabled}
      rounded="full"
      size="xxl"
      width="full"
      variant={props.variant || "gradient"}
      className={`${className}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleApprove();
      }}
    >
      {getButtonText()}
    </Button>
  );
}
