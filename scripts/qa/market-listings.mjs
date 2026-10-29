// QA ONLY: bounded post-cutoff Field-0 listing replay, not a production indexer.
import assert from "node:assert/strict";
import { encodePacked, keccak256 } from "viem";

export function listingHash(listing) {
  return keccak256(encodePacked(
    ["address", "uint256", "uint256", "uint256", "uint256", "uint24", "uint256", "uint256", "uint8"],
    [listing.farmer.id, 0n, BigInt(listing.index), BigInt(listing.start), BigInt(listing.amount),
      listing.pricePerPod, BigInt(listing.maxHarvestableIndex), BigInt(listing.minFillAmount), listing.mode],
  ));
}

/** Partial fills delete the original listing and create a remainder at index+start+filled.
 * Match the real contract and Graph entity semantics, retaining separate history records.
 * Callers supply sorted, deduplicated logs and authenticated block metadata. */
export function replayListings(events) {
  const current = new Map(); // Keyed by contract storage key: Field-0 plot index.
  const historical = [];
  const fills = [];
  const replace = (index, listing) => {
    const old = current.get(index);
    if (old) {
      assert.notEqual(old.status, "ACTIVE", "listing replacement must cancel the old listing first");
      historical.push({ ...old, id: `${old.id}-${historical.filter(x => x.id.startsWith(`${old.id}-`)).length}` });
    }
    current.set(index, listing);
  };
  for (const event of events) {
    if (!event.eventName.startsWith("PodListing")) continue;
    const a = event.args;
    if (String(a.fieldId) !== "0") continue;
    const key = a.index.toString();
    const now = event.timestamp.toString();
    const owner = a.lister.toLowerCase();
    const identity = `${event.transactionHash}-${event.logIndex}`;
    if (event.eventName === "PodListingCreated") {
      assert.ok(event.harvestable !== undefined, "missing listing creation harvestable index");
      assert.ok(a.podAmount > 0n && a.pricePerPod > 0 && a.minFillAmount <= a.podAmount, "invalid listing terms");
      const id = `${owner}-${key}`;
      replace(key, {
        id, farmer: { id: owner }, historyID: `${id}-${now}-${event.logIndex}`,
        index: key, start: a.start.toString(), mode: a.mode, pricingType: 0,
        pricePerPod: a.pricePerPod, pricingFunction: null,
        maxHarvestableIndex: a.maxHarvestableIndex.toString(), minFillAmount: a.minFillAmount.toString(),
        originalIndex: key, originalPlaceInLine: (a.index + a.start - event.harvestable).toString(),
        originalAmount: a.podAmount.toString(), filled: "0", amount: a.podAmount.toString(),
        remainingAmount: a.podAmount.toString(), filledAmount: "0", fill: null,
        status: "ACTIVE", contractListed: true, createdAt: now, updatedAt: now, creationHash: event.transactionHash,
      });
      continue;
    }
    const listing = current.get(key);
    // Harvest and plot transfer may emit cancellation even without a listing.
    // Unknown inherited listings are deliberately outside this adapter's coverage.
    if (!listing) continue;
    if (event.eventName === "PodListingCancelled" && !listing.contractListed) continue;
    assert.equal(owner, listing.farmer.id, "listing owner mismatch");
    assert.ok(event.harvestable !== undefined, "missing listing mutation harvestable index");
    if (listing.status === "ACTIVE" && event.harvestable > BigInt(listing.maxHarvestableIndex)) {
      listing.status = "EXPIRED";
    }
    if (event.eventName === "PodListingCancelled") {
      listing.contractListed = false;
      // Graph preserves EXPIRED if the owner later cancels/deletes its still-stored hash.
      if (listing.status === "ACTIVE") {
        listing.updatedAt = now;
        listing.status = BigInt(listing.filled) === 0n ? "CANCELLED" : "CANCELLED_PARTIAL";
      }
      continue;
    }
    assert.equal(listing.status, "ACTIVE", "fill of inactive listing");
    listing.updatedAt = now;
    assert.equal(event.eventName, "PodListingFilled", "unsupported listing event");
    assert.equal(a.start.toString(), listing.start, "listing start mismatch");
    assert.ok(a.podAmount > 0n && a.podAmount <= BigInt(listing.remainingAmount), "listing overfill");
    assert.ok(event.harvestable !== undefined, "missing listing fill harvestable index");
    listing.remainingAmount = (BigInt(listing.remainingAmount) - a.podAmount).toString();
    listing.filled = (BigInt(listing.filled) + a.podAmount).toString();
    listing.filledAmount = a.podAmount.toString();
    const placeInLine = (a.index + a.start - event.harvestable).toString();
    listing.fill = { placeInLine };
    listing.contractListed = false;
    listing.status = BigInt(listing.remainingAmount) === 0n ? "FILLED" : "FILLED_PARTIAL";
    if (listing.status === "FILLED_PARTIAL") {
      const nextIndex = (a.index + a.start + a.podAmount).toString();
      const id = `${owner}-${nextIndex}`;
      replace(nextIndex, {
        ...listing, id, historyID: `${id}-${now}-${event.logIndex}`, index: nextIndex,
        start: "0", amount: listing.remainingAmount, filledAmount: "0", fill: null,
        status: "ACTIVE", contractListed: true, creationHash: event.transactionHash,
      });
    }
    fills.push({
      id: `${listing.id}-${identity}`, index: key, start: a.start.toString(),
      amount: a.podAmount.toString(), costInBeans: a.costInBeans.toString(), placeInLine,
      fromFarmer: { id: owner }, toFarmer: { id: a.filler.toLowerCase() },
      listing: { id: listing.id, originalAmount: listing.originalAmount }, order: null, createdAt: now,
    });
  }
  return { currentListings: [...current.values()], listings: [...historical, ...current.values()], listingFills: fills };
}
