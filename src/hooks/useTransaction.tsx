import { Button } from "@/components/ui/Button";
import { getExplorerLink, getOverrideAllowanceStateOverride } from "@/utils/chain";
import { Token } from "@/utils/types";
import { HashString, Prettify } from "@/utils/types.generic";
import { exists } from "@/utils/utils";
import { getIsProdNetwork } from "@/utils/wagmi/chains";
import { CopyIcon } from "@radix-ui/react-icons";
import { estimateGas } from "@wagmi/core";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { encodeFunctionData } from "viem";
import {
  Config,
  UseWaitForTransactionReceiptReturnType,
  useAccount,
  useChainId,
  useConfig,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { WriteContractMutateAsync } from "wagmi/query";
import useClearTokenAllowances from "./useClearAllowances";

type TxnReceipt = UseWaitForTransactionReceiptReturnType["data"];

type ConstrictedWriteContractParams = Omit<Parameters<WriteContractMutateAsync<Config, unknown>>[0], "value">;

type WriteContractParams = Prettify<Omit<ConstrictedWriteContractParams, "account"> & { value?: bigint | undefined }>;

export interface UseTransactionParams {
  /** Keep confirmation tracking on the submission chain if the wallet switches. */
  confirmationChainId?: number;
  /** Optional operation-specific receipt check (e.g. a wallet cancellation is not a Tractor execution). */
  validateReceipt?: (receipt: NonNullable<TxnReceipt>) => void;
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
   * The token to clear allowances for after a successful transaction.
   */
  token?: Token;
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
  /**
   * callback to be called on gas estimation.
   */
  onEstimateGas?: (gas: bigint) => void;
}

const parseError = (error: any, errMessage?: string) => {
  if ("shortMessage" in error) {
    return error.shortMessage;
  } else if (error instanceof Error || "message" in error) {
    return error.message;
  } else if (errMessage) {
    return errMessage;
  } else {
    return "Transaction failed";
  }
};

const sendErrorToast = (error: any, errMessage?: string) => {
  const errorMessage = parseError(error, errMessage);
  console.error(error);
  toast.dismiss();
  toast.error(errorMessage);
};

export default function useTransaction({
  confirmationChainId,
  validateReceipt,
  errorMessage,
  successMessage,
  token,
  successCallback,
  onEstimateGas,
  onError,
}: UseTransactionParams) {
  // state to prevent double submission before the txn is
  const [submitting, setSubmitting] = useState(false);

  const chainId = useChainId();
  const config = useConfig();
  const account = useAccount();

  const clearAllowances = useClearTokenAllowances();

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
        console.error("failed: ", error);

        const errorHandled = onError?.(error) ?? false;
        if (!errorHandled) {
          // if txn is has been prepared but not submitted and it errors, there is no hash. Handle it here.
          sendErrorToast(error, errorMessage);
        }
      },
    },
  });

  const receipt = useWaitForTransactionReceipt({
    hash,
    chainId: confirmationChainId ?? chainId,
    // 2 confirmation on production networks
    confirmations: getIsProdNetwork(confirmationChainId ?? chainId) ? 2 : 1,
    pollingInterval: 1_000,
  });

  // Add hash to cached hashes when a new hash is set.
  useEffect(() => {
    if (!hash || !hashes?.current || hashes.current.has(hash)) return;
    hashes.current.add(hash);
  }, [hash]);

  // On Successful confirmation of transaction
  // biome-ignore lint/correctness/useExhaustiveDependencies: Run only when hash changes or txn was successful.
  useEffect(() => {
    if (receipt.isSuccess && exists(hash) && hashes.current?.has(hash)) {
      setSubmitting(false);
      hashes.current.delete(hash);
      toast.dismiss();
      try {
        if (receipt.data) validateReceipt?.(receipt.data);
      } catch (error) {
        if (!onError?.(error)) sendErrorToast(error, errorMessage);
        return;
      }
      successCallback?.(receipt.data);
      const explorerLink = getExplorerLink(hash, confirmationChainId ?? chainId);
      toast.success(
        <div className="flex flex-row items-center gap-4">
          <span className="text-pinto-sm">{successMessage ?? "Transaction successful"}</span>
          <div className="flex flex-row items-center gap-2">
            <div className="h-auto text-s text-pinto-green-4 hover:underline">
              <a href={explorerLink} target="_blank" rel="noopener noreferrer">
                View on Basescan
              </a>
            </div>
            <div
              className="h-auto text-s text-pinto-green-4 cursor-pointer"
              onClick={() => {
                navigator.clipboard.writeText(explorerLink);
                toast.success("Link copied to clipboard");
              }}
            >
              <CopyIcon className="w-4 h-4" />
            </div>
          </div>
        </div>,
      );
      if (token && !token.isNative) {
        clearAllowances(token);
      }
    }
  }, [
    chainId,
    confirmationChainId,
    receipt.isSuccess,
    hash,
    successCallback,
    validateReceipt,
    onError,
    errorMessage,
    token,
    clearAllowances,
  ]);

  // on Error
  useEffect(() => {
    if (!receipt.error) return;
    if (hash && hashes.current && hashes.current.has(hash)) {
      setSubmitting(false);
      hashes.current.delete(hash);
      toast.dismiss();

      const errorHandled = onError?.(receipt.error);
      if (!errorHandled) {
        sendErrorToast(receipt.error, errorMessage);
      }
    }
  }, [receipt.error, hash, errorMessage, onError]);

  const writeWithEstimateGas = useCallback(
    async (args: WriteContractParams) => {
      try {
        const gas = await estimateGas(config, {
          to: args.address,
          data: encodeFunctionData({
            abi: args.abi,
            functionName: args.functionName,
            args: args.args,
          }),
          account: account.address,
          value: args.value,
          blockTag: "latest",
          chainId,
          stateOverride: getOverrideAllowanceStateOverride(chainId, token, account.address),
        });
        if (gas <= 0n) throw new Error("Gas estimation returned no usable estimate; transaction not sent");

        onEstimateGas?.(gas);

        // A revert or RPC failure must never turn into a blind fallback send.
        const gasWithBuffer = (gas * 160n) / 100n;

        const value = args.value;
        const rest = { ...args } as any; // Not sure how to type this

        return writeContractAsync({
          ...rest,
          address: args.address,
          account: account.address,
          abi: args.abi,
          functionName: args.functionName,
          args: args.args,
          value: value as any, // TODO: For some reason value is typed as undefined, so casting it to any
          gas: gasWithBuffer,
        });
      } catch (e: any) {
        setSubmitting(false);
        toast.dismiss();
        toast.error(errorMessage ?? "Transaction failed");
        const parsedError = parseError(e, errorMessage);
        const enrichedError = new Error(`Failed to write contract with gas estimation: ${parsedError}`, { cause: e });
        console.error(enrichedError);
        throw enrichedError;
      }
    },
    [token, account.address, config, chainId, errorMessage, writeContractAsync, onEstimateGas],
  );

  const error = mutation.error || receipt.error;
  const isConfirming = (receipt.isLoading || mutation.isPending) && !error;
  const confirmed = receipt.isSuccess;

  return { writeContractAsync, writeWithEstimateGas, setSubmitting, isConfirming, confirmed, error, submitting };
}
