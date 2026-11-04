import type { QueryClient } from "@tanstack/react-query";
import { type TransactionReceipt, parseAbiItem, parseEventLogs } from "viem";
import type { Listing } from "./types";

export type CancellableListing = Pick<Listing, "id" | "farmer" | "index" | "remainingAmount" | "status">;

const cancellationEvent = parseAbiItem(
  "event PodListingCancelled(address indexed lister, uint256 fieldId, uint256 index)",
);

export function didCancelListing(
  receipt: Pick<TransactionReceipt, "status" | "logs">,
  diamond: string,
  owner: string,
  fieldId: bigint,
  index: bigint,
): boolean {
  // A wallet replacement can itself succeed without cancelling this listing.
  // Check the actual Diamond event, not just receipt status or replacement callbacks.
  return (
    receipt.status === "success" &&
    parseEventLogs({ abi: [cancellationEvent], logs: receipt.logs }).some(
      (event) =>
        event.address.toLowerCase() === diamond.toLowerCase() &&
        event.args.lister.toLowerCase() === owner.toLowerCase() &&
        event.args.fieldId === fieldId &&
        event.args.index === index,
    )
  );
}

export function canCancelListing(listing: CancellableListing, account: string | undefined, fieldId: bigint): boolean {
  if (!account || listing.farmer.toLowerCase() !== account.toLowerCase() || fieldId < 0n) return false;
  // The subgraph's canonical ID is owner-index[:fieldId]; archived versions
  // have an additional suffix. Farmer activity spans both Fields, so require
  // the exact live ID for this marketplace, not just an owner or index match.
  const liveId = `${account.toLowerCase()}-${listing.index.toBigInt()}${fieldId === 0n ? "" : `:${fieldId}`}`;
  return listing.id.toLowerCase() === liveId && listing.status === "ACTIVE" && listing.remainingAmount.gt(0);
}

export async function refreshAfterListingCancellation(client: QueryClient, chainId: number) {
  // Match all harvestable-index/account variants, including inactive pages.
  await Promise.all(
    ["allPodListings", "myPodListings", "allMarket", "farmerMarket", "farmerField"].map((name) =>
      client.invalidateQueries({ queryKey: [name, { chainId }] }),
    ),
  );
}
