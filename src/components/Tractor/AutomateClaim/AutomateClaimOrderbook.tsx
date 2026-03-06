import { TokenValue } from "@/classes/TokenValue";
import { Col, Row } from "@/components/Container";
import LoadingSpinner from "@/components/LoadingSpinner";
import ReviewTractorOrderDialog from "@/components/ReviewTractorOrderDialog";
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogPortal, DialogTitle } from "@/components/ui/Dialog";
import IconImage from "@/components/ui/IconImage";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { PINTO } from "@/constants/tokens";
import { TractorRequisitionEvent } from "@/lib/Tractor";
import {
  getClaimOpConditionLabel,
  getEnabledClaimOpLabels,
  getEnabledClaimOps,
  transformAutomateClaimRequisitionEvent,
} from "@/lib/Tractor/claimOrder";
import { AutomateClaimBlueprintStruct } from "@/lib/Tractor/claimOrder/tractor-claim-types";
import { useTractorAutomateClaimOrderbook } from "@/state/tractor/useTractorAutomateClaimOrders";
import { formatter } from "@/utils/format";
import { useCallback, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/Tabs";
import { AutomateClaimExecute } from "./AutomateClaimExecute";

type AutomateClaimOrder = TractorRequisitionEvent<AutomateClaimBlueprintStruct>;

const BASESCAN_URL = "https://basescan.org/address/";
const formatDate = formatter.dateFromTS;

function AutomateClaimOrderbookContent() {
  const [selectedOrder, setSelectedOrder] = useState<AutomateClaimOrder | null>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);

  const { data: orders = [], isLoading } = useTractorAutomateClaimOrderbook();

  const handleRowClick = (order: AutomateClaimOrder) => {
    if (!order.decodedData) return;
    const transformed = transformAutomateClaimRequisitionEvent(order.decodedData);
    if (!transformed) return;

    setSelectedOrder(order);
    setReviewDialogOpen(true);
  };

  const getSortedOrders = useCallback(() => {
    return [...orders]
      .filter((order) => !order.isCancelled && order.decodedData)
      .sort((a, b) => {
        if (!a.decodedData || !b.decodedData) return 0;
        const aTip = a.decodedData.opParams.baseOpParams.operatorTipAmount;
        const bTip = b.decodedData.opParams.baseOpParams.operatorTipAmount;
        if (bTip > aTip) return 1;
        if (bTip < aTip) return -1;
        return 0;
      });
  }, [orders]);

  const sortedOrders = getSortedOrders();

  const renderOrderRow = (order: AutomateClaimOrder) => {
    if (!order.decodedData) return null;

    const transformed = transformAutomateClaimRequisitionEvent(order.decodedData);
    if (!transformed) return null;

    const ops = getEnabledClaimOps(transformed);
    const enabledLabels = getEnabledClaimOpLabels(ops);
    const operatorTip = formatter.number(TokenValue.fromBlockchain(transformed.operatorParams.operatorTipAmount, 6), {
      minDecimals: 2,
      maxDecimals: 2,
    });

    const conditions: string[] = [];
    if (ops.mowEnabled) {
      conditions.push(getClaimOpConditionLabel("mow", true, transformed.claimParams.minMowAmount));
    }
    if (ops.plantEnabled) {
      conditions.push(getClaimOpConditionLabel("plant", true, transformed.claimParams.minPlantAmount));
    }
    if (ops.harvestEnabled) {
      const harvestThreshold = transformed.claimParams.fieldHarvestConfigs[0]?.minHarvestAmount ?? 0n;
      conditions.push(getClaimOpConditionLabel("harvest", true, harvestThreshold));
    }

    return (
      <TableRow
        key={order.requisition.blueprintHash}
        className="border-b border-gray-100 hover:bg-pinto-green-1 cursor-pointer transition-colors"
        onClick={() => handleRowClick(order)}
      >
        <TableCell className="py-2 pl-6 whitespace-nowrap">{enabledLabels.join(", ") || "None"}</TableCell>
        <TableCell className="py-2 whitespace-nowrap text-xs text-pinto-light">
          {conditions.join(" | ") || "-"}
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
            {`0x${order.requisition.blueprint.publisher.slice(2, 6)}...${order.requisition.blueprint.publisher.slice(-3)}`}
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
            <TableHead className="py-2 px-0 pl-6">Enabled Ops</TableHead>
            <TableHead className="py-2">Conditions</TableHead>
            <TableHead className="py-2 text-right">Operator Tip</TableHead>
            <TableHead className="py-2 text-right">Blueprint Hash</TableHead>
            <TableHead className="py-2 text-right">Publisher</TableHead>
            <TableHead className="py-2 pr-6 text-right">Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedOrders.map((order) => renderOrderRow(order))}
          {sortedOrders.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="p-2 text-center text-gray-500 h-72">
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <LoadingSpinner size={20} />
                    <span>Loading automate claim orders...</span>
                  </div>
                ) : (
                  "No active automate claim orders found"
                )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {selectedOrder?.decodedData &&
        (() => {
          const transformed = transformAutomateClaimRequisitionEvent(selectedOrder.decodedData);
          if (!transformed) return null;
          const ops = getEnabledClaimOps(transformed);
          return (
            <ReviewTractorOrderDialog
              open={reviewDialogOpen}
              onOpenChange={setReviewDialogOpen}
              orderData={{
                type: "automateClaim" as const,
                mowEnabled: ops.mowEnabled,
                plantEnabled: ops.plantEnabled,
                harvestEnabled: ops.harvestEnabled,
                operatorTip: transformed.operatorParams.operatorTipAmountAsString,
              }}
              encodedData={selectedOrder.requisition.blueprint.data}
              operatorPasteInstrs={selectedOrder.requisition.blueprint.operatorPasteInstrs}
              blueprint={selectedOrder.requisition.blueprint}
              isViewOnly={true}
            />
          );
        })()}
    </div>
  );
}

interface AutomateClaimOrderbookDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AutomateClaimOrderbookDialog({ open, onOpenChange }: AutomateClaimOrderbookDialogProps) {
  const [activeTab, setActiveTab] = useState<"view" | "execute">("view");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 backdrop-blur-[2px] bg-white/50" />
        <DialogContent
          id="content-dialog"
          className="max-w-[98rem] w-[95vw] bg-gray-50 border border-gray-200 p-0 sm:p-0 gap-2 pointer-events-auto"
        >
          <DialogHeader className="px-6 pt-6 pb-0">
            <DialogTitle className="text-xl font-bold">Automate Claim Orders</DialogTitle>
          </DialogHeader>
          <Col className="w-full">
            <Col>
              <Tabs value={activeTab} onValueChange={setActiveTab as (value: string) => void}>
                <Row className="justify-between px-6 w-full">
                  <TabsList variant="textSecondary" borderBottom className="justify-between relative">
                    <Row className="gap-6">
                      <TabsTrigger value="view" className="py-4">
                        View Claim Orders
                      </TabsTrigger>
                      <TabsTrigger value="execute" className="py-4">
                        Execute Claim Orders
                      </TabsTrigger>
                    </Row>
                  </TabsList>
                </Row>
                <TabsContent value="view" className="pb-6 w-full">
                  <AutomateClaimOrderbookContent />
                </TabsContent>
                <TabsContent value="execute" className="pb-6 px-6 w-full">
                  <AutomateClaimExecute />
                </TabsContent>
              </Tabs>
            </Col>
          </Col>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

export default AutomateClaimOrderbookDialog;
