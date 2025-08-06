import { tokensEqual } from "@/utils/token";
import { Token } from "@/utils/types";
import { useMemo } from "react";
import { useAccount } from "wagmi";

interface ValidationOptions {
  tokenIn?: Token | null;
  tokenOut?: Token | null;
  hasValidAmount: boolean;
  exceedsBalance: boolean;
  inputError: boolean;
  submitting: boolean;
  isConfirming: boolean;
  swapDataNotReady?: boolean;
}

export function useSiloActionValidation({
  tokenIn,
  tokenOut,
  hasValidAmount,
  exceedsBalance,
  inputError,
  submitting,
  isConfirming,
  swapDataNotReady = false,
}: ValidationOptions) {
  const account = useAccount();

  return useMemo(() => {
    // Check if tokens are the same
    const tokensSame = tokenIn && tokenOut ? tokensEqual(tokenIn, tokenOut) : false;

    // Calculate if action is disabled
    const disabled =
      !hasValidAmount ||
      !account.address ||
      submitting ||
      isConfirming ||
      swapDataNotReady ||
      exceedsBalance ||
      inputError ||
      !tokenIn ||
      !tokenOut;

    // Generate button text based on validation state
    let buttonText = "Submit";

    if (exceedsBalance) {
      buttonText = "Insufficient Funds";
    } else if (!tokenIn) {
      buttonText = "Select Input Token";
    } else if (!tokenOut) {
      buttonText = "Select Output Token";
    } else if (!hasValidAmount) {
      buttonText = "Enter Amount";
    } else if (!account.address) {
      buttonText = "Connect Wallet";
    } else if (submitting) {
      buttonText = "Submitting...";
    } else if (isConfirming) {
      buttonText = "Confirming...";
    }

    return {
      disabled,
      buttonText,
      tokensSame,
      canProceed: !disabled,
    };
  }, [
    tokenIn,
    tokenOut,
    hasValidAmount,
    exceedsBalance,
    inputError,
    submitting,
    isConfirming,
    swapDataNotReady,
    account.address,
  ]);
}
