import podIcon from "@/assets/protocol/Pod.png";
import pintoIcon from "@/assets/tokens/PINTO.png";
import { TokenValue } from "@/classes/TokenValue";
import FrameAnimator from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import IconImage from "@/components/ui/IconImage";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { PODS } from "@/constants/internalTokens";
import { useAllMarket } from "@/state/market/useAllMarket";
import { useHarvestableIndex } from "@/state/useFieldData";
import { formatter } from "@/utils/format";
import { Fill, Listing, Order } from "@/utils/types";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export interface MarketActivityTableProps {
  marketData: ReturnType<typeof useAllMarket>;
  titleText: string;
  farmer?: `0x${string}`;
}

export function MarketActivityTable({ marketData, titleText, farmer }: MarketActivityTableProps) {
  const { id: selection } = useParams();
  const harvestableIndex = useHarvestableIndex();
  const { data, isLoaded, isFetching } = marketData;

  const rowsPerPage = 5000;
  const totalRows = data?.length || 0;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const [currentPage, setCurrentPage] = useState(1);
  const newestEventOnPage = rowsPerPage * currentPage - rowsPerPage;
  const oldestEventOnPage = rowsPerPage * currentPage - 1;

  const navigate = useNavigate();
  const navigateTo = useCallback(
    (event: Order | Listing) => {
      if (event.status === "ACTIVE") {
        if (event.type === "LISTING") {
          const listingEvent = event as Listing;
          navigate(`/market/pods/buy/${listingEvent.index}`);
        } else {
          navigate(`/market/pods/sell/${event.id}`);
        }
      }
    },
    [navigate],
  );

  useEffect(() => {
    // Navigate to the page containing the selection
    if (data) {
      const dataIndex = data.findIndex((evt) => {
        if (evt.type === "LISTING") {
          return selection === evt.id.substring(43);
        } else if (evt.type === "ORDER") {
          return selection === evt.id;
        }
      });
      const pageNum = 1 + Math.floor((dataIndex + 1) / rowsPerPage);
      setCurrentPage(pageNum);
    }
  }, [selection, data]);

  return (
    <Card className="h-fit w-full bg-transparent border-none">
      <CardHeader>
        <div className="flex space-x-2">
          <p className="pinto-body-light text-pinto-light ml-2.5">{titleText}</p>
          {isFetching && <FrameAnimator className="-mt-5 -mb-12" size={80} />}
        </div>
      </CardHeader>
      {isLoaded && (
        <CardContent>
          <Table noOverflow>
            <>
              <TableHeader>
                <TableRow noHoverMute className="bg-gradient-light z-[1] [&>*]:text-pinto-gray-4 sticky -top-[1px]">
                  <TableHead className="w-[140px]">Created At</TableHead>
                  <TableHead className="w-[90px]">Type</TableHead>
                  <TableHead className="w-[110px]">Amount</TableHead>
                  <TableHead className="w-[110px]">Place In Line</TableHead>
                  <TableHead className="w-[100px]">Price</TableHead>
                  <TableHead className="w-[110px]">Total</TableHead>
                  <TableHead className="w-[100px]">Fill %</TableHead>
                  <TableHead className="w-[100px]">Expires In</TableHead>
                  <TableHead className="text-right w-[80px]">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!data?.length && (
                  <TableRow key="Empty">
                    <TableCell colSpan={9}>No activity to show</TableCell>
                  </TableRow>
                )}
                {data?.map((event, i) => {
                  const dateOptions: Intl.DateTimeFormatOptions = {
                    year: "2-digit",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    // second: "2-digit",
                    hourCycle: "h24",
                  };
                  const date = new Date(Number(event.createdAt) * 1000);
                  let uriId: string | undefined;
                  let interactable = false;
                  let type: string;
                  let amount: TokenValue;
                  let placeInLine: TokenValue;
                  let price: TokenValue;
                  let total: TokenValue;
                  let fillPct: TokenValue;
                  let expiresIn: TokenValue | undefined;
                  let status: string;
                  if (event.type === "LISTING") {
                    const evt = event as Listing;
                    uriId = evt.id.substring(43);
                    type = event.type;
                    amount = evt.originalAmount;
                    price = evt.pricePerPod;
                    total = amount.mul(price);
                    fillPct = evt.filled.div(evt.originalAmount).mul(100);
                    expiresIn =
                      fillPct.lt(99) && evt.status === "ACTIVE"
                        ? evt.maxHarvestableIndex.sub(harvestableIndex)
                        : undefined;
                    status = fillPct.gt(99) ? "FILLED" : evt.status === "CANCELLED_PARTIAL" ? "CANCELLED" : evt.status;
                    placeInLine =
                      status === "ACTIVE"
                        ? evt.index.sub(harvestableIndex)
                        : !!evt.fillPlaceInLine
                          ? evt.fillPlaceInLine
                          : evt.originalPlaceInLine;
                    interactable = status === "ACTIVE";
                  } else if (event.type === "ORDER") {
                    const evt = event as Order;
                    const beanAmount = evt.beanAmount;
                    const beanAmountFilled = evt.beanAmountFilled;
                    const pricePerPod = evt.pricePerPod;
                    const podAmount = beanAmount.div(pricePerPod);
                    uriId = evt.id;
                    type = event.type;
                    amount = podAmount;
                    price = evt.pricePerPod;
                    total = beanAmount;
                    fillPct = beanAmountFilled.div(beanAmount).mul(100);
                    expiresIn = undefined;
                    status = fillPct.gt(99) ? "FILLED" : evt.status === "CANCELLED_PARTIAL" ? "CANCELLED" : evt.status;
                    placeInLine = evt.maxPlaceInLine;
                    interactable = status === "ACTIVE";
                  } else {
                    const evt = event as Fill;
                    uriId = "none"; // Not selectable, but this should be set to something so the uri cant match
                    type = "TRADE";
                    amount = evt.podAmount;
                    placeInLine = evt.plotPlaceInLine;
                    price = evt.beanAmountFilled.div(evt.podAmount);
                    total = evt.beanAmountFilled;
                    fillPct = (
                      evt.listing
                        ? evt.podAmount.div(evt.listing.originalPodAmount)
                        : evt.beanAmountFilled
                            // biome-ignore lint/style/noNonNullAssertion: Only one of listing/orer can be undefined
                            .div(evt.order!.originalOrderBeans)
                    ).mul(100);
                    if (farmer) {
                      status = `${evt.fromFarmer === farmer.toLowerCase() ? "SOLD" : "BOUGHT"} - ${evt.listing ? "LISTING" : "ORDER"}`;
                    } else {
                      status = evt.listing ? "BOUGHT - LISTING" : "SOLD - ORDER";
                    }
                  }
                  // Fixes subprecision rounding errors on fills
                  const priceFloat = parseFloat(price.toHuman());
                  const priceRounded = Math.round(priceFloat * 10 ** PODS.decimals) / 10 ** PODS.decimals;

                  if (i >= newestEventOnPage && i <= oldestEventOnPage)
                    return (
                      <TableRow
                        key={event.id + date}
                        className={`${interactable ? "hover:cursor-pointer" : ""} ${selection === uriId && status === "ACTIVE" ? "bg-pinto-green-1 hover:bg-pinto-green-1" : ""}`}
                        noHoverMute
                        onClick={interactable ? () => navigateTo(event as Listing | Order) : undefined}
                      >
                        <TableCell className="font-medium">{date?.toLocaleString(undefined, dateOptions)}</TableCell>
                        <TableCell>{type}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <IconImage src={podIcon} size={4} className="scale-110 mr-[0.375rem]" alt={"pod icon"} />
                            <p className="truncate flex-grow overflow-hidden whitespace-nowrap">
                              {formatter.number(amount?.toNumber(), { maxDecimals: 0 })}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{`${event?.type === "ORDER" ? "0 - " : ""}${placeInLine?.toHuman("short")}`}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <IconImage
                              src={pintoIcon}
                              size={4}
                              className="scale-110 mr-[0.375rem]"
                              alt={"pinto icon"}
                            />
                            <p className="truncate flex-grow overflow-hidden whitespace-nowrap">{priceRounded}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <IconImage
                              src={pintoIcon}
                              size={4}
                              className="scale-110 mr-[0.375rem]"
                              alt={"pinto icon"}
                            />
                            <p className="truncate flex-grow overflow-hidden whitespace-nowrap">
                              {formatter.number(total?.toNumber(), { maxDecimals: 0 })}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {fillPct ? `${formatter.number(fillPct.toNumber(), { maxDecimals: 2 })}%` : "N/A"}
                        </TableCell>
                        {type !== "TRADE" ? (
                          <>
                            <TableCell>{expiresIn ? expiresIn.toHuman("short") : "N/A"}</TableCell>
                            <TableCell className="text-right">{status}</TableCell>
                          </>
                        ) : (
                          <TableCell colSpan={2} className="text-right">
                            {status}
                          </TableCell>
                        )}
                      </TableRow>
                    );
                })}
              </TableBody>
            </>
          </Table>
          {totalPages > 1 && (
            <div className="flex items-center justify-end space-x-2 py-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="text-xs">{`${currentPage} of ${totalPages}`}</div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
