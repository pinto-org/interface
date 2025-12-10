import { beanstalkAbi } from "@/generated/contractHooks";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { useAccount, useReadContract } from "wagmi";

/**
 * Return type for the useReferralData hook
 */
export interface UseReferralDataReturn {
  /** Delegate address for pod rewards (where pods will be sent) */
  delegateAddress: `0x${string}` | undefined;
  /** True while initial data is loading */
  isLoading: boolean;
  /** Error object if the query failed */
  error: Error | null;
}

/**
 * Custom React hook to fetch referral-related data from the contract
 *
 * This hook fetches the delegate address which determines where referral
 * reward pods will be sent.
 *
 * @returns {UseReferralDataReturn} Referral data and query state
 *
 * @example
 * ```tsx
 * function ReferralComponent() {
 *   const { delegateAddress, isLoading } = useReferralData();
 *
 *   if (isLoading) return <LoadingSpinner />;
 *
 *   return <div>Pods will be sent to: {delegateAddress}</div>;
 * }
 * ```
 */
export function useReferralData(): UseReferralDataReturn {
  const { address } = useAccount();
  const protocolAddress = useProtocolAddress();

  const {
    data: delegateAddress,
    isLoading,
    error,
  } = useReadContract({
    address: protocolAddress,
    abi: beanstalkAbi,
    functionName: "getDelegate",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  return {
    delegateAddress: delegateAddress as `0x${string}` | undefined,
    isLoading,
    error: error as Error | null,
  };
}
