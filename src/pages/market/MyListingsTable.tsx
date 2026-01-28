import podIcon from "@/assets/protocol/Pod.png";
import pintoIcon from "@/assets/tokens/PINTO.png";
import { TokenValue } from "@/classes/TokenValue";
import FrameAnimator from "@/components/LoadingSpinner";
import { MarketPaginationControls } from "@/components/MarketPaginationControls";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Checkbox } from "@/components/ui/Checkbox";
import IconImage from "@/components/ui/IconImage";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { ANALYTICS_EVENTS } from "@/constants/analytics-events";
import { PODS } from "@/constants/internalTokens";
import { beanstalkAbi } from "@/generated/contractHooks";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import useTransaction from "@/hooks/useTransaction";
import useMyPodListings from "@/state/market/useMyPodListings";
import { useHarvestableIndex } from "@/state/useFieldData";
import { useQueryKeys } from "@/state/useQueryKeys";
import useTokenData from "@/state/useTokenData";
import { trackSimpleEvent } from "@/utils/analytics";
import { formatter } from "@/utils/format";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import type { MarketplacePodListing } from "./actions/CancelListing";

export interface MyListingsTableProps {
  /** Connected wallet address */
  address: string | undefined;
  /** IDs of selected listings */
  selectedIds?: string[];
  /** Callback when selection changes */
  onSelectionChange?: (selectedIds: string[]) => void;
}

export function MyListingsTable({ address, selectedIds = [], onSelectionChange }: MyListingsTableProps) {
  const BEAN = useTokenData().mainToken;
  const harvestableIndex = useHarvestableIndex();

  // Fetch user's listings via GraphQL hook
  const { listings, isLoading } = useMyPodListings({ account: address });

  const rowsPerPage = 12;
  const totalRows = listings?.length || 0;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const [currentPage, setCurrentPage] = useState(1);
  const newestEventOnPage = rowsPerPage * currentPage - rowsPerPage;
  const oldestEventOnPage = rowsPerPage * currentPage - 1;

  // Selection is enabled when onSelectionChange callback is provided
  const selectable = !!onSelectionChange;

  // Immediate cancellation state
  const [cancellingIds, setCancellingIds] = useState<Set<string>>(new Set());

  const diamondAddress = useProtocolAddress();
  const queryClient = useQueryClient();
  const { allPodListings, allMarket, farmerMarket } = useQueryKeys({
    account: address,
    harvestableIndex,
  });

  const onCancelSuccess = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: allPodListings });
    queryClient.invalidateQueries({ queryKey: allMarket });
    queryClient.invalidateQueries({ queryKey: farmerMarket });
    if (onSelectionChange) {
      onSelectionChange([]);
    }
  }, [queryClient, allPodListings, allMarket, farmerMarket, onSelectionChange]);

  const { writeWithEstimateGas, submitting } = useTransaction({
    successMessage: "Listing(s) cancelled successfully",
    errorMessage: "Failed to cancel listing(s)",
    successCallback: onCancelSuccess,
  });

  // Handle immediate single cancel
  const handleCancelImmediate = useCallback(
    async (listing: MarketplacePodListing) => {
      if (!address) {
        toast.error("Wallet not connected");
        return;
      }

      setCancellingIds((prev) => new Set(prev).add(listing.id));

      try {
        trackSimpleEvent(ANALYTICS_EVENTS.MARKET.POD_LIST_CANCEL, {
          listing_count: 1,
          is_batch: false,
        });

        await writeWithEstimateGas({
          address: diamondAddress,
          abi: beanstalkAbi,
          functionName: "cancelPodListing",
          args: [0n, TokenValue.fromBlockchain(listing.index, PODS.decimals).toBigInt()],
        });
      } finally {
        setCancellingIds((prev) => {
          const next = new Set(prev);
          next.delete(listing.id);
          return next;
        });
      }
    },
    [address, diamondAddress, writeWithEstimateGas],
  );

  // Handle immediate bulk cancel
  const handleBulkCancelImmediate = useCallback(async () => {
    if (!address) {
      toast.error("Wallet not connected");
      return;
    }

    const listingsToCancel = listings?.filter((l) => selectedIds.includes(l.id)) || [];
    const ownedListings = listingsToCancel.filter((l) => l.farmer.id.toLowerCase() === address.toLowerCase());

    if (ownedListings.length === 0) {
      toast.error("No owned listings to cancel");
      return;
    }

    try {
      trackSimpleEvent(ANALYTICS_EVENTS.MARKET.POD_LIST_CANCEL, {
        listing_count: ownedListings.length,
        is_batch: true,
      });

      const batchArgs = ownedListings.map((listing) => ({
        fieldId: 0n,
        index: TokenValue.fromBlockchain(listing.index, PODS.decimals).toBigInt(),
      }));

      await writeWithEstimateGas({
        address: diamondAddress,
        abi: beanstalkAbi,
        functionName: "batchCancelPodListing",
        args: [batchArgs],
      });
    } catch (error) {
      console.error("Batch cancel failed:", error);
    }
  }, [address, listings, selectedIds, diamondAddress, writeWithEstimateGas]);

  // Compute visible listings on current page for select all logic
  const visibleListings = listings?.slice(newestEventOnPage, oldestEventOnPage + 1) || [];
  const visibleIds = visibleListings.map((l) => l.id);
  const allVisibleSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedIds.includes(id));
  const someVisibleSelected = visibleIds.some((id) => selectedIds.includes(id)) && !allVisibleSelected;

  // Handle "Select All" checkbox for visible listings on current page
  const handleSelectAllChange = useCallback(
    (checked: boolean) => {
      if (!onSelectionChange) return;
      if (checked) {
        // Add all visible IDs that aren't already selected
        const newSelection = [...selectedIds];
        for (const id of visibleIds) {
          if (!newSelection.includes(id)) {
            newSelection.push(id);
          }
        }
        onSelectionChange(newSelection);
      } else {
        // Remove only the visible IDs from selection
        onSelectionChange(selectedIds.filter((id) => !visibleIds.includes(id)));
      }
    },
    [selectedIds, visibleIds, onSelectionChange],
  );

  // Handle checkbox change for a single row
  const handleCheckboxChange = useCallback(
    (listingId: string, checked: boolean) => {
      if (!onSelectionChange) return;
      if (checked) {
        onSelectionChange([...selectedIds, listingId]);
      } else {
        onSelectionChange(selectedIds.filter((id) => id !== listingId));
      }
    },
    [selectedIds, onSelectionChange],
  );

  return (
    <Card className="h-fit w-full bg-transparent border-none">
      <CardHeader>
        <div className="flex space-x-2">
          <p className="pinto-body-light text-pinto-light">Your active Pod Listings</p>
          {isLoading && <FrameAnimator className="-mt-5 -mb-12" size={80} />}
        </div>
      </CardHeader>
      <CardContent>
        {selectable && selectedIds.length > 0 && (
          <div className="flex items-center mb-3">
            <button
              type="button"
              className="text-pinto-gray-5 hover:text-pinto-green-4 hover:underline underline-offset-4 font-normal transition-colors cursor-pointer pinto-body disabled:opacity-50"
              onClick={handleBulkCancelImmediate}
              disabled={submitting}
            >
              Cancel {selectedIds.length} Listing{selectedIds.length !== 1 ? "s" : ""}
            </button>
          </div>
        )}
        <Table noOverflow>
          <>
            <TableHeader>
              <TableRow noHoverMute className="bg-gradient-light z-[1] [&>*]:text-pinto-gray-4 sticky -top-[1px]">
                {selectable && (
                  <TableHead className="w-[40px]">
                    <Checkbox
                      checked={allVisibleSelected}
                      indeterminate={someVisibleSelected}
                      onCheckedChange={(checked) => handleSelectAllChange(checked === true)}
                      aria-label="Select all visible listings"
                    />
                  </TableHead>
                )}
                <TableHead className="w-[140px]">Created At</TableHead>
                <TableHead className="w-[110px]">Amount</TableHead>
                <TableHead className="w-[150px]">Place In Line</TableHead>
                <TableHead className="w-[100px]">Price</TableHead>
                <TableHead className="w-[100px]">Fill %</TableHead>
                <TableHead className="text-right w-[120px]">Expires In</TableHead>
                <TableHead className="w-[80px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {(!listings || listings.length === 0) && !isLoading && (
                <TableRow key="Empty">
                  <TableCell colSpan={selectable ? 8 : 7}>You have no active listings</TableCell>
                </TableRow>
              )}
              {listings?.map((listing, i) => {
                const dateOptions: Intl.DateTimeFormatOptions = {
                  year: "2-digit",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  hourCycle: "h24",
                };
                const createdAt = new Date(Number(listing.createdAt) * 1000);
                const originalAmount = parseFloat(listing.originalAmount);
                const remainingAmount = parseFloat(listing.remainingAmount);
                const fillPct = (originalAmount - remainingAmount) / originalAmount;
                if (i >= newestEventOnPage && i <= oldestEventOnPage)
                  return (
                    <TableRow key={listing.id} noHoverMute>
                      {selectable && (
                        <TableCell className="w-[40px]">
                          <Checkbox
                            checked={selectedIds.includes(listing.id)}
                            onCheckedChange={(checked) => handleCheckboxChange(listing.id, checked === true)}
                            onClick={(e) => e.stopPropagation()}
                            aria-label={`Select listing ${listing.id}`}
                          />
                        </TableCell>
                      )}
                      <TableCell className="font-medium">{createdAt.toLocaleString(undefined, dateOptions)}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <IconImage src={podIcon} size={4} className="scale-110 mr-[0.375rem]" alt={"pod icon"} />
                          {TokenValue.fromBlockchain(listing.amount, PODS.decimals).toHuman("short")}
                        </div>
                      </TableCell>
                      <TableCell>
                        {TokenValue.fromBlockchain(listing.index, PODS.decimals).sub(harvestableIndex).toHuman("short")}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <IconImage src={pintoIcon} size={4} className="scale-110 mr-[0.375rem]" alt={"pinto icon"} />
                          {TokenValue.fromBlockchain(listing.pricePerPod, BEAN.decimals).toHuman()}
                        </div>
                      </TableCell>
                      <TableCell>{formatter.pct(fillPct * 100)}</TableCell>
                      <TableCell className="text-right">
                        {TokenValue.fromBlockchain(listing.maxHarvestableIndex, PODS.decimals)
                          .sub(harvestableIndex)
                          .toHuman("short")}{" "}
                        PODS
                      </TableCell>
                      <TableCell>
                        <button
                          type="button"
                          className="text-pinto-gray-5 hover:text-pinto-green-4 hover:underline underline-offset-4 font-normal transition-colors cursor-pointer pinto-sm disabled:opacity-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCancelImmediate(listing as MarketplacePodListing);
                          }}
                          disabled={submitting || cancellingIds.has(listing.id)}
                        >
                          {cancellingIds.has(listing.id) ? "Cancelling..." : "Cancel"}
                        </button>
                      </TableCell>
                    </TableRow>
                  );
              })}
            </TableBody>
          </>
        </Table>
        {totalPages > 1 && (
          <MarketPaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={totalRows}
            itemsPerPage={rowsPerPage}
          />
        )}
      </CardContent>
    </Card>
  );
}
