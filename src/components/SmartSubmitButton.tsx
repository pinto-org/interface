import { TokenValue } from "@/classes/TokenValue";
import { ZERO_ADDRESS } from "@/constants/address";
import { beanstalkAddress } from "@/generated/contractHooks";
import useTransaction from "@/hooks/useTransaction";
import useTokenData from "@/state/useTokenData";
import { Token } from "@/utils/types";
import { exists, isDev } from "@/utils/utils";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { erc20Abi, maxUint256 } from "viem";
import { useAccount, useChainId, useReadContract } from "wagmi";
import { Button, ButtonProps } from "./ui/Button";

interface SmartSubmitButton extends Omit<ButtonProps, "onClick" | "disabled" | "className"> {
  token?: Token;
  amount?: string;
  submitFunction: () => void;
  submitButtonText?: string;
  className?: string;
  disabled?: boolean;
  noApproval?: boolean;
}

export default function SmartSubmitButton({
  token,
  amount,
  submitFunction,
  submitButtonText,
  className,
  disabled,
  noApproval = false,
  ...props
}: SmartSubmitButton) {
  const account = useAccount();
  const chainId = useChainId();
  const queryClient = useQueryClient();
  const ETH = useTokenData().nativeToken;

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
  const { submitting, isConfirming, setSubmitting, writeWithEstimateGas } = useTransaction({
    successCallback: () => {
      queryClient.invalidateQueries({ queryKey });
    },
    successMessage: "Approval success",
    errorMessage: "Approval failed",
  });

  const needsApproval =
    !token || token.isNative || noApproval
      ? false
      : allowance === 0n
        ? true
        : Number(amount) > Number(TokenValue.fromBlockchain(allowance || 0, token.decimals).toHuman());

  async function approveOrRun() {
    if (needsApproval) {
      try {
        if (!token || !exists(amount)) return;
        setSubmitting(true);
        toast.loading("Approving...");
        return writeWithEstimateGas({
          abi: erc20Abi,
          address: token?.address ?? ZERO_ADDRESS,
          functionName: "approve",
          args: [
            beanstalkAddress[chainId as keyof typeof beanstalkAddress],
            isDev() ? maxUint256 : TokenValue.fromHuman(amount, token?.decimals).toBigInt(),
          ],
        });
      } catch (e) {
        setSubmitting(false);
        console.error(e);
        toast.dismiss();
        toast.error("Approval failed");
        throw e;
      }
    } else {
      await submitFunction();
    }
  }

  return (
    <Button
      type={"button"}
      {...props}
      disabled={disabled || submitting || isConfirming}
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
          : submitButtonText || "Swap"}
    </Button>
  );
}
