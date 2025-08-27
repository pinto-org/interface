import { TV } from "@/classes/TokenValue";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogPortal, DialogTitle } from "@/components/ui/Dialog";
import IconImage from "@/components/ui/IconImage";
import { Label } from "@/components/ui/Label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover";
import { Switch } from "@/components/ui/Switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { PINTO } from "@/constants/tokens";
import { ConvertUpOrderbookEntry } from "@/lib/Tractor";
import { useTractorConvertUpOrderbook } from "@/state/tractor/useTractorConvertUpOrders";
import { formatter } from "@/utils/format";
import { cn } from "@/utils/utils";
import { GearIcon } from "@radix-ui/react-icons";
import { useCallback, useState } from "react";
import React from "react";
import { Col, Row } from "../Container";
import LoadingSpinner from "../LoadingSpinner";

const BASESCAN_URL = "https://basescan.org/address/";

interface ConvertUpOrderbookContentProps {
  showZeroAvailable?: boolean;
  sortBy?: "bonus" | "tip";
  showAboveCurrentBonus?: boolean;
}

const empty = {};

export function ConvertUpOrderbookContent({
  showZeroAvailable = false,
  sortBy = "bonus",
  showAboveCurrentBonus = true,
}: ConvertUpOrderbookContentProps) {
  const [selectedOrder, setSelectedOrder] = useState<ConvertUpOrderbookEntry | null>(null);

  const { data: orders = [], isLoading } = useTractorConvertUpOrderbook({
    select: useCallback((data: ConvertUpOrderbookEntry[] | undefined) => {
      if (!data || data?.length === 0) return [] satisfies ConvertUpOrderbookEntry[];
      return data;
    }, []),
    ...empty,
  });

  const formatDate = (timestamp: number | undefined) => {
    if (!timestamp) return "Unknown";
    const date = new Date(timestamp);

    return (
      date.toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "2-digit",
      }) +
      " " +
      date
        .toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
        .replace(" ", "")
    );
  };

  const handleRowClick = (order: ConvertUpOrderbookEntry) => {
    setSelectedOrder(order);
    // TODO: Open ReviewTractorOrderDialog
  };

  // Apply filtering and sorting
  const getSortedOrders = () => {
    let filtered = [...orders];

    // Apply filtering
    filtered = filtered.filter((order) => {
      // Filter for zero available
      const hasAvailableBdv = showZeroAvailable || order.currentlyConvertible.gt(TV.ZERO);

      // Filter for above current bonus (placeholder logic - needs market data)
      let matchesBonusFilter = true;
      if (!showAboveCurrentBonus) {
        // TODO: Implement current bonus comparison
        matchesBonusFilter = true; // Placeholder
      }

      return hasAvailableBdv && matchesBonusFilter;
    });

    // Apply sorting
    if (sortBy === "bonus") {
      filtered.sort((a, b) => {
        if (!a.decodedData || !b.decodedData) return 0;
        const aBonus = a.decodedData.convertUpParams.minGrownStalkPerBdvBonus;
        const bBonus = b.decodedData.convertUpParams.minGrownStalkPerBdvBonus;
        return bBonus.sub(aBonus).toNumber(); // Descending
      });
    } else if (sortBy === "tip") {
      filtered.sort((a, b) => {
        if (!a.decodedData || !b.decodedData) return 0;
        const aTip = a.decodedData.opParams.operatorTipAmount;
        const bTip = b.decodedData.opParams.operatorTipAmount;
        return bTip.sub(aTip).toNumber(); // Descending
      });
    }

    return filtered;
  };

  const sortedOrders = getSortedOrders();

  // Helper function to render an order row
  const renderOrderRow = (order: ConvertUpOrderbookEntry, index: number) => {
    if (!order.decodedData) return null;

    const decodedData = order.decodedData;
    const bonus = formatter.number(decodedData.convertUpParams.minGrownStalkPerBdvBonus, {
      minDecimals: 4,
      maxDecimals: 4,
    });
    const minCapacity = formatter.number(decodedData.convertUpParams.minConvertBonusCapacity);
    const priceRange = `$${decodedData.convertUpParams.minPriceToConvertUp.toHuman()} - $${decodedData.convertUpParams.maxPriceToConvertUp.toHuman()}`;
    const totalBdv = formatter.number(decodedData.convertUpParams.totalConvertBdv);
    const availableBdv = formatter.number(order.currentlyConvertible);
    const executionRange = `${formatter.number(decodedData.convertUpParams.minConvertBdvPerExecution)} - ${formatter.number(decodedData.convertUpParams.maxConvertBdvPerExecution)}`;
    const operatorTip = formatter.number(decodedData.opParams.operatorTipAmount, {
      minDecimals: 2,
      maxDecimals: 2,
    });

    return (
      <TableRow
        key={`order-${index}`}
        className="border-b border-gray-100 hover:bg-pinto-green-1 cursor-pointer transition-colors"
        onClick={() => handleRowClick(order)}
      >
        <TableCell className="py-2 px-0 pl-6 whitespace-nowrap">≥ {bonus}</TableCell>
        <TableCell className="py-2 whitespace-nowrap">≥ {minCapacity} BDV</TableCell>
        <TableCell className="py-2 whitespace-nowrap">{priceRange}</TableCell>
        <TableCell className="py-2 text-right">
          <div className="flex items-center gap-1 justify-end">
            <IconImage src={PINTO.logoURI} alt="PINTO" size={4} />
            {totalBdv}
          </div>
        </TableCell>
        <TableCell className="py-2 text-right">
          <div className="flex items-center gap-1 justify-end">
            <IconImage src={PINTO.logoURI} alt="PINTO" size={4} />
            {availableBdv}
          </div>
        </TableCell>
        <TableCell className="py-2 text-right">
          <div className="flex items-center gap-1 justify-end">
            <IconImage src={PINTO.logoURI} alt="PINTO" size={4} />
            {executionRange}
          </div>
        </TableCell>
        <TableCell className="py-2 text-right">
          <div className="flex items-center gap-1 justify-end">
            <IconImage src={PINTO.logoURI} alt="PINTO" size={4} />
            {operatorTip}
          </div>
        </TableCell>
        <TableCell className="py-2 text-pinto-dark text-right font-mono">
          {`0x${order.requisition.blueprintHash.slice(2, 7)}...${order.requisition.blueprintHash.slice(-4)}`}
        </TableCell>
        <TableCell className="py-2 text-right">
          <a
            href={`${BASESCAN_URL}${order.requisition.blueprint.publisher}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-pinto-dark underline hover:opacity-80"
            onClick={(e) => e.stopPropagation()}
          >
            {`0x${order.requisition.blueprint.publisher.slice(2, 7)}...${order.requisition.blueprint.publisher.slice(-4)}`}
          </a>
        </TableCell>
        <TableCell className="py-2 pr-6 text-right">{formatDate(order.timestamp)}</TableCell>
      </TableRow>
    );
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="[&_tr]:border-b-0 [&_th]:text-pinto-light">
          <TableRow className="border-b-0">
            <TableHead className="py-2 px-0 pl-6">Grown Stalk Bonus Per BDV</TableHead>
            <TableHead className="py-2">Min Capacity</TableHead>
            <TableHead className="py-2">Price</TableHead>
            <TableHead className="py-2 text-right">Total Convert BDV</TableHead>
            <TableHead className="py-2 text-right">Available Pinto</TableHead>
            <TableHead className="py-2 text-right">PDV per Execution</TableHead>
            <TableHead className="py-2 text-right">Operator Tip</TableHead>
            <TableHead className="py-2 text-right">Blueprint Hash</TableHead>
            <TableHead className="py-2 text-right">Publisher</TableHead>
            <TableHead className="py-2 pr-6 text-right">Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedOrders.map((order, index) => renderOrderRow(order, index))}
          {sortedOrders.length === 0 && (
            <TableRow>
              <TableCell colSpan={10} className="p-2 text-center text-gray-500 h-72">
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <LoadingSpinner size={20} />
                    <span>Loading convert orders...</span>
                  </div>
                ) : (
                  "No active convert orders found"
                )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

interface ConvertUpOrderbookDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ConvertUpOrderbookDialog({ open, onOpenChange }: ConvertUpOrderbookDialogProps) {
  const [activeTab, setActiveTab] = useState<"view" | "execute">("view");
  const [showZeroAvailable, setShowZeroAvailable] = useState(false);
  const [sortBy, setSortBy] = useState<"bonus" | "tip">("bonus");
  const [showAboveCurrentBonus, setShowAboveCurrentBonus] = useState(true);

  const SmallLabel = (props: React.ComponentProps<typeof Label>) => (
    <Label {...props} style={{ fontSize: "1rem", lineHeight: "1rem" }} />
  );

  const sortOptions = [
    {
      id: "bonus",
      text: "Bonus",
    },
    {
      id: "tip",
      text: "Tip",
    },
  ] as const;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 backdrop-blur-[2px] bg-white/50" />
        <DialogContent
          id="content-dialog"
          className="max-w-[98rem] w-[95vw] bg-gray-50 border border-gray-200 p-0 sm:p-0 gap-2"
        >
          <DialogHeader className="px-6 pt-6 pb-0">
            <DialogTitle className="text-xl font-bold">Convert Up Orders</DialogTitle>
          </DialogHeader>
          <Col className="w-full">
            <Col className="border-b">
              <Row className="flex items-center justify-between">
                <Row className="gap-4 px-6">
                  <button
                    type="button"
                    className={cn(
                      "py-4 border-box border-b-2 border-transparent pinto-sm text-pinto-gray-4",
                      activeTab === "view" && "text-pinto-primary border-pinto-green-4 font-medium",
                    )}
                    onClick={() => setActiveTab("view")}
                  >
                    View Convert Up Orders
                  </button>
                  <button
                    type="button"
                    className={cn(
                      "py-4 border-box border-b-2 border-transparent pinto-sm text-pinto-gray-4",
                      activeTab === "execute" && "text-pinto-primary border-pinto-green-4 font-medium",
                    )}
                    onClick={() => setActiveTab("execute")}
                  >
                    Execute Convert Up Orders
                  </button>
                </Row>

                <Col className="mr-4 items-center justify-center">
                  {activeTab === "view" && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          rounded="full"
                          className="h-8 p-2"
                          aria-label="Table Settings"
                        >
                          <GearIcon className="h-5 w-5 text-pinto-gray-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 p-4" align="end">
                        <div className="pinto-sm font-medium mb-3 leading-same-sm">Table Settings</div>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <SmallLabel htmlFor="show-zero-available">Show Zero Available Pinto</SmallLabel>
                            <Switch
                              id="show-zero-available"
                              checked={showZeroAvailable}
                              onCheckedChange={setShowZeroAvailable}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <SmallLabel htmlFor="show-above-bonus">Show Orders Above Current Bonus</SmallLabel>
                            <Switch
                              id="show-above-bonus"
                              checked={showAboveCurrentBonus}
                              onCheckedChange={setShowAboveCurrentBonus}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <SmallLabel>Sort By</SmallLabel>
                            <div className="flex flex-row w-fit items-center">
                              {sortOptions.map((option, index) => (
                                <React.Fragment key={`dialog-${option.id}-${index}`}>
                                  <div
                                    className={cn(
                                      "flex flex-row items-center px-3 py-1.5 justify-center cursor-pointer",
                                      sortBy === option.id ? "bg-pinto-green-1" : "bg-pinto-gray-1",
                                      index === 0 ? "rounded-l-full" : "rounded-r-full",
                                      sortBy === option.id
                                        ? "border border-pinto-green-4"
                                        : "border border-pinto-gray-2",
                                      index === 0 ? "border-r-0" : "border-l-0",
                                    )}
                                    onClick={() => setSortBy(option.id)}
                                  >
                                    <div className="text-xs text-pinto-green-3">{option.text}</div>
                                  </div>
                                </React.Fragment>
                              ))}
                            </div>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                </Col>
              </Row>
            </Col>
            <Col className={cn("pt-4 pb-6 w-full min-h-72")}>
              {activeTab === "view" ? (
                <ConvertUpOrderbookContent
                  showZeroAvailable={showZeroAvailable}
                  sortBy={sortBy}
                  showAboveCurrentBonus={showAboveCurrentBonus}
                />
              ) : (
                <Col className="px-6">
                  <div className="text-center text-gray-500 py-8">
                    <div className="pinto-body font-medium mb-2">Execute Convert Up Orders</div>
                    <div className="pinto-sm">This functionality will be implemented in a future update.</div>
                  </div>
                </Col>
              )}
            </Col>
          </Col>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

export default ConvertUpOrderbookDialog;
