import { HashString } from "@/utils/types.generic";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { UseWaitForTransactionReceiptReturnType, useWaitForTransactionReceipt, useWriteContract } from "wagmi";

type TxnReceipt = UseWaitForTransactionReceiptReturnType["data"];

export interface UseTransactionParams {
  /**
   * message to be shown on error.
   */
  errorMessage?: string;
  /**
   * message to be shown on successful transaction.
   */
  successMessage?: string;
  /**
   * callback to be called on successful transaction.
   */
  successCallback?: (receipt: TxnReceipt) => void;
  /**
   * callback to override the default error behavior.
   * @returns true if the error toast was sent & this hook doesn't have to handle it.
   */
  onError?: (e: any) => boolean | undefined;
}

const sendErrorToast = (error: any, errMessage?: string) => {
  let errorMessage: string;
  if ("shortMessage" in error) {
    errorMessage = error.shortMessage;
  } else if (errMessage) {
    errorMessage = errMessage;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else {
    errorMessage = "Transaction failed";
  }
  toast.dismiss();
  toast.error(errorMessage);
};

export default function useTransaction({
  errorMessage,
  successMessage,
  successCallback,
  onError,
}: UseTransactionParams) {
  // Set of hashes that are waiting for confirmation
  const hashes = useRef<Set<HashString> | null>(null);

  // Initialize hook on mount
  useEffect(() => {
    hashes.current = new Set<HashString>();
    return () => {
      hashes.current = null;
    };
  }, []);

  const {
    writeContractAsync,
    data: hash,
    ...mutation
  } = useWriteContract({
    mutation: {
      onError: (error) => {
        if (onError) return onError(error);
        // if txn is has been prepared but not submitted, there will be no hash, so send it here.
        sendErrorToast(error, errorMessage);
      },
    },
  });

  const receipt = useWaitForTransactionReceipt({
    hash,
    pollingInterval: 2_000,
  });

  // Add hash to cached hashes when a new hash is set.
  useEffect(() => {
    if (!hash || !hashes?.current || hashes.current.has(hash)) return;
    console.log("adding hash...: ", hash);
    hashes.current.add(hash);
  }, [hash]);

  // on Successful confirmation of transaction
  // We don't include successCallback to avoid needing to wrap it in a useCallback before passing it in as a prop.
  // biome-ignore lint/correctness/useExhaustiveDependencies: Run only when hash changes or txn was successful.
  useEffect(() => {
    if (receipt.isSuccess && hash && hashes.current && hashes.current.has(hash)) {
      console.log("SUCCESS: deleting hash...: ", hash);
      hashes.current.delete(hash);
      console.log("SUCCESS: hashes: ", hashes.current);
      successCallback?.(receipt.data);
      toast.dismiss();
      toast.success(successMessage ?? "Transaction successful");
    }
  }, [receipt.isSuccess, hash]);

  useEffect(() => {
    if (!receipt.error) return;
    if (hash && hashes.current && hashes.current.has(hash)) {
      // console.log("ERROR: receipt.error: ", receipt.error);
      console.log("ERROR: deleting hash...: ", hash);
      hashes.current.delete(hash);
      toast.dismiss();

      const errorHandled = onError?.(receipt.error);
      if (!errorHandled) {
        sendErrorToast(receipt.error, errorMessage);
      }
    }
  }, [receipt.error, hash, errorMessage, onError]);

  const isConfirming = receipt.isLoading || mutation.isPending;
  const error = mutation.error || receipt.error;
  const confirmed = receipt.isSuccess;

  return { writeContractAsync, isConfirming, confirmed, error };
}
