import { TokenValue } from "@/classes/TokenValue";
import { ZERO_ADDRESS } from "@/constants/address";
import { beanstalkAddress } from "@/generated/contractHooks";
import useTokenData from "@/state/useTokenData";
import { Token } from "@/utils/types";
import { exists, isDev } from "@/utils/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";
import { BaseError, erc20Abi, maxUint256 } from "viem";
import { useAccount, useChainId, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { Button, ButtonProps } from "./ui/Button";

interface SmartSubmitButton extends Omit<ButtonProps, "onClick" | "disabled" | "className"> {
  token?: Token;
  amount?: string;
  submitFunction: () => void;
  submitButtonText?: string;
  className?: string;
  disabled?: boolean;
}

export default function SmartSubmitButton({
  token,
  amount,
  submitFunction,
  submitButtonText,
  className,
  disabled,
  ...props
}: SmartSubmitButton) {
  const account = useAccount();
  const chainId = useChainId();
  const queryClient = useQueryClient();
  const ETH = useTokenData().nativeToken;

  const { data: hash, writeContractAsync } = useWriteContract();
  const { data: allowance, queryKey } = useReadContract({
    abi: erc20Abi,
    address: token?.address,
    functionName: "allowance",
    args: [account.address ?? ZERO_ADDRESS, beanstalkAddress[chainId as keyof typeof beanstalkAddress]],
    query: {
      enabled: token && !!account.address && !!token && token !== ETH,
      select: (data) => {
        return data;
      },
    },
  });
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isConfirmed) {
      // invalidating query results to trigger a refetch
      queryClient.invalidateQueries({ queryKey });
    }
  }, [isConfirmed]);

  const needsApproval =
    !token || token.isNative
      ? false
      : allowance === 0n
        ? true
        : Number(amount) > Number(TokenValue.fromBlockchain(allowance || 0, token.decimals).toHuman());

  async function approveOrRun() {
    if (!token || !exists(amount)) return;
    if (needsApproval) {
      const tx = () =>
        writeContractAsync({
          abi: erc20Abi,
          address: token?.address ?? ZERO_ADDRESS,
          functionName: "approve",
          args: [
            beanstalkAddress[chainId as keyof typeof beanstalkAddress],
            isDev() ? maxUint256 : TokenValue.fromHuman(amount, token?.decimals).toBigInt(),
          ],
        });

      toast.promise(tx, {
        loading: "Submitting transaction...",
        success: (data) => {
          return `Transaction complete!`;
        },
        error: (error) => {
          return (error as BaseError).shortMessage || `Transaction failed.`;
        },
      });
    } else {
      await submitFunction();
    }
  }

  return (
    <Button
      type={"button"}
      {...props}
      disabled={disabled || isConfirming}
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
      {isConfirming
        ? "Sending Transaction"
        : account.address && needsApproval
          ? "Approve Spending"
          : submitButtonText || "Submit"}
    </Button>
  );
}
