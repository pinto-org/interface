import { TokenValue } from "@/classes/TokenValue";
import SmartSubmitButton from "@/components/SmartSubmitButton";
import { ANALYTICS_EVENTS } from "@/constants/analytics-events";
import { PODS } from "@/constants/internalTokens";
import { beanstalkAbi } from "@/generated/contractHooks";
import { AllPodListingsQuery } from "@/generated/gql/pintostalk/graphql";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import useTransaction from "@/hooks/useTransaction";
import { useHarvestableIndex } from "@/state/useFieldData";
import { useQueryKeys } from "@/state/useQueryKeys";
import { trackSimpleEvent } from "@/utils/analytics";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAccount } from "wagmi";

export type MarketplacePodListing = AllPodListingsQuery["podListings"][number];

export interface CancelListingProps {
  /** Array of listings available for cancellation */
  listings: MarketplacePodListing[];
  /** Optional array of listing IDs to cancel. If not provided, cancels all listings */
  selectedListingIds?: string[];
}

export default function CancelListing({ listings, selectedListingIds }: CancelListingProps) {
  const diamondAddress = useProtocolAddress();
  const account = useAccount();
  const harvestableIndex = useHarvestableIndex();
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const { allPodListings, allMarket, farmerMarket } = useQueryKeys({
    account: account.address,
    harvestableIndex,
  });
  const allQK = useMemo(() => [allPodListings, allMarket, farmerMarket], [allPodListings, allMarket, farmerMarket]);

  // Filter listings by selectedListingIds if provided, otherwise use all listings
  const listingsToCancel = useMemo(() => {
    if (selectedListingIds && selectedListingIds.length > 0) {
      return listings.filter((listing) => selectedListingIds.includes(listing.id));
    }
    return listings;
  }, [listings, selectedListingIds]);

  const cancelCount = listingsToCancel.length;
  const isBatch = cancelCount > 1;

  const onSuccess = useCallback(() => {
    navigate(`/market/pods/sell`);
    allQK.forEach((key) => queryClient.invalidateQueries({ queryKey: key }));
  }, [navigate, queryClient, allQK]);

  const { writeWithEstimateGas, submitting, isConfirming, setSubmitting } = useTransaction({
    successMessage: isBatch ? `Cancelled ${cancelCount} Listings` : "Cancel Listing successful",
    errorMessage: isBatch ? "Batch Cancel Listings failed" : "Cancel Listing failed",
    successCallback: onSuccess,
  });

  const onSubmit = useCallback(() => {
    if (cancelCount === 0) return;

    try {
      setSubmitting(true);
      toast.loading(isBatch ? `Cancelling ${cancelCount} Listings...` : "Cancelling Listing...");

      trackSimpleEvent(ANALYTICS_EVENTS.MARKET.POD_LIST_CANCEL, {
        listing_count: cancelCount,
        is_batch: isBatch,
      });

      // Single listing: use original cancelPodListing function
      if (!isBatch) {
        const listing = listingsToCancel[0];
        return writeWithEstimateGas({
          address: diamondAddress,
          abi: beanstalkAbi,
          functionName: "cancelPodListing",
          args: [
            0n, // fieldId
            TokenValue.fromBlockchain(listing.index, PODS.decimals).toBigInt(), // index
          ],
        });
      }

      // Multiple listings: use batchCancelPodListing
      const batchArgs = listingsToCancel.map((listing) => ({
        fieldId: 0n,
        index: TokenValue.fromBlockchain(listing.index, PODS.decimals).toBigInt(),
      }));

      return writeWithEstimateGas({
        address: diamondAddress,
        abi: beanstalkAbi,
        functionName: "batchCancelPodListing",
        args: [batchArgs],
      });
    } catch (e) {
      console.error(e);
      toast.dismiss();
      toast.error(isBatch ? "Batch Cancel Listings Failed" : "Cancel Listing Failed");
      throw e;
    } finally {
      setSubmitting(false);
    }
  }, [cancelCount, isBatch, listingsToCancel, diamondAddress, setSubmitting, writeWithEstimateGas]);

  const buttonText =
    cancelCount === 0 ? "No Listings to Cancel" : cancelCount > 1 ? `Cancel ${cancelCount} Listings` : "Cancel Listing";

  return (
    <SmartSubmitButton
      variant="gradient"
      size="xxl"
      submitButtonText={buttonText}
      submitFunction={onSubmit}
      disabled={submitting || isConfirming || cancelCount === 0}
    />
  );
}
