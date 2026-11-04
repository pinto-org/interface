import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/Dialog";
import { useBeanstalkMarket } from "@/context/BeanstalkMarketContext";
import { beanstalkAbi } from "@/generated/contractHooks";
import type { AllPodListingsQuery } from "@/generated/gql/pintostalk/graphql";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { guardedWalletConnector } from "@/utils/guardedWallet";
import {
  type CancellableListing,
  canCancelListing,
  didCancelListing,
  refreshAfterListingCancellation,
} from "@/utils/marketListing";
import { getIsProdNetwork } from "@/utils/wagmi/chains";
import { useQueryClient } from "@tanstack/react-query";
import { getAccount, getPublicClient, waitForTransactionReceipt, writeContract } from "@wagmi/core";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { BaseError } from "viem";
import { useAccount, useChainId, useConfig } from "wagmi";

export type MarketplacePodListing = AllPodListingsQuery["podListings"][number];

export default function CancelListing({ listing }: { listing: CancellableListing }) {
  const diamondAddress = useProtocolAddress();
  const account = useAccount();
  const chainId = useChainId();
  const config = useConfig();
  const { fieldId } = useBeanstalkMarket();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const submitting = useRef(false);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  if (!canCancelListing(listing, account.address, fieldId)) return null;

  const cancel = async () => {
    if (submitting.current || !account.address || !account.connector) return;
    submitting.current = true;
    setPending(true);
    const toastId = toast.loading("Cancelling Listing...");
    const expected = { account: account.address, chainId };
    const assertCurrent = () => {
      const current = getAccount(config);
      if (
        !mounted.current ||
        current.address?.toLowerCase() !== expected.account.toLowerCase() ||
        current.chainId !== expected.chainId ||
        !canCancelListing(listing, current.address, fieldId)
      ) {
        throw new Error("Wallet or marketplace changed. Review the listing again.");
      }
    };
    try {
      assertCurrent();
      const client = getPublicClient(config, { chainId });
      if (!client) throw new Error("Network unavailable");
      const request = {
        address: diamondAddress,
        abi: beanstalkAbi,
        functionName: "cancelPodListing" as const,
        args: [fieldId, listing.index.toBigInt()] as const,
        account: expected.account,
      };
      // No submission on failed estimation, and no automatic network switch.
      const gas = await client.estimateContractGas(request);
      assertCurrent();
      const hash = await writeContract(config, {
        ...request,
        chainId,
        gas: (gas * 160n) / 100n,
        connector: guardedWalletConnector(account.connector, expected, assertCurrent),
      });
      const receipt = await waitForTransactionReceipt(config, {
        hash,
        chainId,
        confirmations: getIsProdNetwork(chainId) ? 2 : 1,
      });
      if (receipt.status !== "success") throw new Error("Listing cancellation reverted");
      if (!didCancelListing(receipt, diamondAddress, expected.account, fieldId, listing.index.toBigInt())) {
        throw new Error("The confirmed transaction did not cancel this listing. Refresh its status before retrying.");
      }
      toast.success("Listing cancelled successfully", { id: toastId });
      setOpen(false);
      await refreshAfterListingCancellation(queryClient, chainId);
    } catch (error) {
      const message =
        error instanceof BaseError
          ? error.shortMessage
          : error instanceof Error
            ? error.message
            : "Listing cancellation failed";
      toast.error(message, { id: toastId });
    } finally {
      submitting.current = false;
      setPending(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!pending) setOpen(value);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" onClick={(event) => event.stopPropagation()}>
          Cancel Listing
        </Button>
      </DialogTrigger>
      <DialogContent hideCloseButton={pending} onClick={(event) => event.stopPropagation()}>
        <DialogTitle>Cancel Pod Listing?</DialogTitle>
        <DialogDescription>
          Remove the remaining {listing.remainingAmount.toHuman()} Pods from sale. Your Pods stay in your wallet; this
          does not sell, transfer or harvest them. You will pay network gas only.
        </DialogDescription>
        <Button variant="gradient" disabled={pending} onClick={cancel}>
          {pending ? "Cancelling..." : "Confirm Cancellation"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
