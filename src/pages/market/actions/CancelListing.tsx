import { TokenValue } from "@/classes/TokenValue";
import SmartSubmitButton from "@/components/SmartSubmitButton";
import { PODS } from "@/constants/internalTokens";
import { beanstalkAbi } from "@/generated/contractHooks";
import { AllPodListingsQuery } from "@/generated/gql/pintostalk/graphql";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import useTransaction from "@/hooks/useTransaction";
import { useHarvestableIndex } from "@/state/useFieldData";
import { useQueryKeys } from "@/state/useQueryKeys";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAccount } from "wagmi";

export interface CancelListingProps {
  listing: AllPodListingsQuery["podListings"][number];
}

export default function CancelListing({ listing }: CancelListingProps) {
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

  const onSuccess = useCallback(() => {
    navigate(`/market/pods/sell`);
    allQK.forEach((key) => queryClient.invalidateQueries({ queryKey: key }));
  }, [navigate, queryClient, allQK]);

  const { writeWithEstimateGas, submitting, isConfirming, setSubmitting } = useTransaction({
    successMessage: "Cancel Listing successful",
    errorMessage: "Cancel Listing failed",
    successCallback: onSuccess,
  });

  const onSubmit = useCallback(() => {
    try {
      setSubmitting(true);
      toast.loading("Cancelling Listing...");
      return writeWithEstimateGas({
        address: diamondAddress,
        abi: beanstalkAbi,
        functionName: "cancelPodListing",
        args: [
          0n, // fieldId
          TokenValue.fromBlockchain(listing.index, PODS.decimals).toBigInt(), // index
        ],
      });
    } catch (e) {
      console.error(e);
      toast.dismiss();
      toast.error("Cancel Listing Failed");
      throw e;
    } finally {
      setSubmitting(false);
    }
  }, [listing, diamondAddress, setSubmitting, writeWithEstimateGas]);

  return (
    <>
      <SmartSubmitButton
        variant="gradient"
        size="xxl"
        submitButtonText="Cancel Listing"
        submitFunction={onSubmit}
        disabled={submitting || isConfirming}
      />
    </>
  );
}
