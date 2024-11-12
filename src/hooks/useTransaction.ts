import { HashString } from "@/utils/types.generic";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { UseWaitForTransactionReceiptReturnType, useWaitForTransactionReceipt, useWriteContract } from "wagmi";

type TxnReceipt = UseWaitForTransactionReceiptReturnType["data"];

export interface UseTransactionParams {
  /**
   * message to be shown on error. Overrides the error message from the error returned txn submissions.
   * If this is not provided, the error message from the error returned txn submissions will be used.
   * If the error cannot be parsed, "Transaction failed" will be shown on the toast.
   */
  errorMessage?: string;
  /**
   * message to be shown on successful transaction.
   * If this is not provided, "Transaction successful" will be shown on the toast.
   */
  successMessage?: string;
  /**
   * callback to be called on successful transaction.
   */
  successCallback?: (receipt: TxnReceipt) => void;
  /**
   * callback to override the default error behavior.
   * Use this parameter to handle errors in a custom way.
   * @returns true if the error was handled & toast was sent. (This hook doesn't have to handle it.)
   */
  onError?: (e: any) => boolean | undefined;
}

const sendErrorToast = (error: any, errMessage?: string) => {
  let errorMessage: string;
  if ("shortMessage" in error) {
    errorMessage = error.shortMessage; // baseError type from wagmi
  } else if (errMessage) {
    errorMessage = errMessage;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else {
    errorMessage = "Transaction failed";
  }
  console.error(error);
  toast.dismiss();
  toast.error(errorMessage);
};

export default function useTransaction({
  errorMessage,
  successMessage,
  successCallback,
  onError,
}: UseTransactionParams) {
  // Set of hashes that are waiting for confirmation.
  // Keep a reference of hashes to prevent toasts being shown more than once.
  const hashes = useRef<Set<HashString> | null>(null);

  // Initialize hook on mount
  useEffect(() => {
    hashes.current = new Set<HashString>();
    return () => {
      // cleanup
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
        // if txn is has been prepared but not submitted and it errors, there is no hash. Handle it here.
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
    hashes.current.add(hash);
  }, [hash]);

  // On Successful confirmation of transaction
  // biome-ignore lint/correctness/useExhaustiveDependencies: Run only when hash changes or txn was successful.
  useEffect(() => {
    if (receipt.isSuccess && hash && hashes.current && hashes.current.has(hash)) {
      hashes.current.delete(hash);
      successCallback?.(receipt.data);
      toast.dismiss();
      toast.success(successMessage ?? "Transaction successful");
    }
  }, [receipt.isSuccess, hash]);

  // on Error
  useEffect(() => {
    if (!receipt.error) return;
    if (hash && hashes.current && hashes.current.has(hash)) {
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
