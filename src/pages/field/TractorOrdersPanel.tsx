import pintoIcon from "@/assets/tokens/PINTO.png";
import { TokenValue } from "@/classes/TokenValue";
import { Col, Row } from "@/components/Container";
import EmptyTable from "@/components/EmptyTable";
import ReviewTractorOrderDialog from "@/components/ReviewTractorOrderDialog";
import ModifyTractorOrderDialog from "@/components/Tractor/ModifySowOrderDialog";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import IconImage from "@/components/ui/IconImage";
import { Skeleton } from "@/components/ui/Skeleton";
import { diamondABI } from "@/constants/abi/diamondABI";
import { beanstalkAbi } from "@/generated/contractHooks";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { useGetTractorTokenStrategyWithBlueprint } from "@/hooks/tractor/useGetTractorTokenStrategy";
import useTransaction from "@/hooks/useTransaction";
import {
  OrderbookEntry,
  PublisherTractorExecution,
  TractorRequisitionEvent as RequisitionEvent,
  SowBlueprintData,
  decodeSowTractorData,
  prepareSowOrderV0RequisitionEventForTxn,
} from "@/lib/Tractor";
import { Blueprint } from "@/lib/Tractor/types";
import usePublisherTractorExecutions from "@/state/tractor/useTractorExecutions";
import { useTractorSowOrderbook } from "@/state/tractor/useTractorSowOrders";
import { tryExtractErrorMessage } from "@/utils/error";
import { formatter } from "@/utils/format";
import { stringEq } from "@/utils/string";
import { getTokenNameByIndex } from "@/utils/token";
import { AdvancedFarmCall, AdvancedPipeCall } from "@/utils/types";
import { CalendarIcon, ClockIcon, CornerBottomLeftIcon, Cross1Icon, Pencil1Icon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { decodeFunctionData } from "viem";
import { useAccount } from "wagmi";

interface TractorOrdersPanelProps {
  refreshData?: number; // A value that changes to trigger a refresh
  onCreateOrder?: () => void; // Callback to create a new order
}

const TractorOrdersPanel = ({ refreshData, onCreateOrder }: TractorOrdersPanelProps) => {
  const { address } = useAccount();
  const protocolAddress = useProtocolAddress();

  const getStrategyProps = useGetTractorTokenStrategyWithBlueprint();

  // State for the dialog
  const [selectedOrder, setSelectedOrder] = useState<RequisitionEvent<SowBlueprintData> | null>(null);
  const [showDialog, setShowDialog] = useState<"review" | "modify" | undefined>(undefined);
  const [rawSowBlueprintCall, setRawSowBlueprintCall] = useState<`0x${string}` | null>(null);

  // Fetch executions for the farmer's orders
  const { data: executions, ...executionsQuery } = usePublisherTractorExecutions(address, !!address);

  // Select orders with executions
  const selectOrdersWithExecutions = useCallback(
    (orderbookEntries: OrderbookEntry[] | undefined) => {
      const executionsByHash = executions?.reduce<Record<`0x${string}`, PublisherTractorExecution[]>>((acc, curr) => {
        if (curr.blueprintHash in acc) acc[curr.blueprintHash].push(curr);
        else acc[curr.blueprintHash] = [curr];
        return acc;
      }, {});

      return orderbookEntries
        ?.filter((req) => stringEq(req.requisition.blueprint.publisher, address))
        ?.map((req) => ({
          ...req,
          executions: executionsByHash?.[req.requisition.blueprintHash] || undefined,
          decodedData: decodeSowTractorData(req.requisition.blueprint.data),
        }))
        .sort((a, b) => a.blockNumber - b.blockNumber);
    },
    [executions, address],
  );

  // Fetch orders for the farmer
  const { data: orders, ...ordersQuery } = useTractorSowOrderbook({
    address,
    filterOutCompleted: false,
    select: selectOrdersWithExecutions,
    enabled: !!address,
  });

  // derived
  const dataHasLoaded = address ? Boolean(executions && orders) : true;
  const loading = executionsQuery.isLoading || ordersQuery.isLoading || !dataHasLoaded;

  const error = executionsQuery.error || ordersQuery.error;

  const [lastRefetchedCounter, setLastRefetchedCounter] = useState<number>(0);

  // biome-ignore lint/correctness/useExhaustiveDependencies: only refresh when refresh data counter changes
  useEffect(() => {
    if (refreshData && dataHasLoaded && lastRefetchedCounter !== refreshData) {
      setLastRefetchedCounter(refreshData);
      ordersQuery.refetch();
      executionsQuery.refetch();
    }
  }, [refreshData, dataHasLoaded]);

  // Add transaction handling for cancel order
  const { writeWithEstimateGas, setSubmitting, submitting, isConfirming } = useTransaction({
    successMessage: "Order cancelled successfully",
    errorMessage: "Failed to cancel order",
    successCallback: useCallback(() => {
      executionsQuery.refetch();
      ordersQuery.refetch();
    }, [executionsQuery.refetch, ordersQuery.refetch]),
  });

  const handleCancelBlueprint = async (req: RequisitionEvent, e: React.MouseEvent) => {
    setSubmitting(true);
    e.stopPropagation(); // Prevent opening the order dialog

    if (!address) {
      throw new Error("Signer required.");
    }

    if (req.isCancelled) {
      throw new Error("Order already cancelled");
    }

    toast.loading("Cancelling order...");

    // Fix timestamp values for transaction
    const fixedRequisition = prepareSowOrderV0RequisitionEventForTxn(req);

    try {
      return writeWithEstimateGas({
        address: protocolAddress,
        abi: diamondABI,
        functionName: "cancelBlueprint",
        args: [fixedRequisition],
      });
    } catch (error) {
      console.error("Error cancelling blueprint:", error);
      toast.error(tryExtractErrorMessage(error, "Failed to cancel order"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleOrderClick = (req: RequisitionEvent<SowBlueprintData>) => {
    setSelectedOrder(req);

    // Extract the raw sowBlueprintv0 call data if available
    try {
      // Use the existing function to extract the sowBlueprintv0 call from the advancedFarm call
      const sowCall = extractSowBlueprintCall(req.requisition.blueprint.data);
      setRawSowBlueprintCall(sowCall);
    } catch (error) {
      console.error("Failed to extract sowBlueprintv0 call data:", error);
      setRawSowBlueprintCall(null);
    }

    setShowDialog("review");
  };

  if (!address) {
    return (
      <EmptyContainer>
        <div className="pinto-body-light text-pinto-light">Connect your wallet to view your Tractor Orders</div>
      </EmptyContainer>
    );
  }

  if (loading) {
    return (
      <EmptyContainer>
        <div className="pinto-body-light text-pinto-light">Loading Tractor Orders...</div>
        <Skeleton className="h-6 w-48" />
      </EmptyContainer>
    );
  }

  if (error) {
    return (
      <EmptyContainer>
        <div className="pinto-h4 text-pinto-red-2">Error Loading Tractor Orders</div>
      </EmptyContainer>
    );
  }

  if (!orders?.length && !executions?.length) {
    return <EmptyTable type="tractor" onTractorClick={onCreateOrder} />;
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {orders?.map((req, index) => {
        if (req.requisitionType !== "sowBlueprintv0" || !req.decodedData) return null;

        const data = req.decodedData;
        const totalAmount = TokenValue.fromBlockchain(data.sowAmounts.totalAmountToSow, 6);

        // Get executions for this blueprint
        const blueprintExecutions = req.executions || [];

        // Count how many times this blueprint has been executed
        const executionCount = blueprintExecutions?.length;

        // Calculate total PINTO sown so far for this blueprint
        const totalSown = blueprintExecutions.reduce((acc, exec) => {
          if (exec.sowEvent) {
            return acc.add(exec.sowEvent.beans);
          }
          return acc;
        }, TokenValue.ZERO);

        // Calculate percentage completion
        const percentComplete = totalAmount.gt(0) ? totalSown.div(totalAmount).mul(100) : TokenValue.ZERO;

        // Get percentage as number for display
        const percentCompleteNumber = Math.min(percentComplete.toHuman ? Number(percentComplete.toHuman()) : 0, 100);

        const isComplete = percentComplete.gte(100);

        // Find latest execution for this blueprint
        const latestExecution =
          blueprintExecutions.length > 0 ? blueprintExecutions.sort((a, b) => b.blockNumber - a.blockNumber)[0] : null;

        // Format the publish date
        const publishDate = req.timestamp ? format(new Date(req.timestamp), "dd MMM yyyy") : "Unknown";

        // Determine token strategy based on sourceTokenIndices
        let strategyText = "Unknown strategy";
        if (data.sourceTokenIndices.includes(255)) {
          strategyText = "Lowest Seeds";
        } else if (data.sourceTokenIndices.includes(254)) {
          strategyText = "Lowest Price";
        } else {
          strategyText = "Specific Token";
        }

        return (
          <Col key={`requisition-${index}`} className="gap-2">
            <Card
              className="box-border flex flex-col p-4 gap-2 bg-white border border-pinto-gray-2 rounded-xl cursor-pointer hover:border-pinto-green-4 transition-colors"
              onClick={() => handleOrderClick(req)}
            >
              <div className="flex flex-col gap-2 w-full">
                {/* Header row with all the pills and labels */}
                <div className="flex justify-between items-center w-full">
                  <div className="flex items-center gap-0">
                    {/* Withdraw pill */}
                    <div className="flex items-center px-2 py-1 bg-pinto-green-4 rounded-xl">
                      <span className="text-white text-sm font-normal whitespace-nowrap">Withdraw</span>
                    </div>
                    {/* Divider */}
                    <div className="border-t-2 border-pinto-gray-2 w-6 flex-shrink-0" />
                    {/* From label */}
                    <div className="bg-[#F8F8F8] px-2 py-1 rounded-xl">
                      <span className="text-pinto-gray-4 text-sm font-thin whitespace-nowrap">from Silo</span>
                    </div>
                    {/* Divider */}
                    <div className="border-t-2 border-pinto-gray-2 w-6 flex-shrink-0" />
                    {/* Sow pill */}
                    <div className="flex items-center px-2 py-1 bg-pinto-green-4 rounded-xl">
                      <span className="text-white text-sm font-normal whitespace-nowrap">Sow</span>
                    </div>
                    {/* Divider */}
                    <div className="border-t-2 border-pinto-gray-2 w-6 flex-shrink-0" />
                    {/* Up to */}
                    <div className="bg-[#F8F8F8] px-2 py-1 rounded-xl">
                      <div className="flex items-center gap-1">
                        <span className="text-pinto-gray-4 text-sm font-thin whitespace-nowrap">up to</span>
                        <IconImage src={pintoIcon} size={4} />
                        <span className="text-pinto-green-4 text-sm font-thin whitespace-nowrap overflow-hidden text-ellipsis">
                          {formatter.number(totalAmount)} PINTO
                          <span className="text-pinto-gray-4">
                            {" "}
                            (max{" "}
                            {formatter.number(TokenValue.fromBlockchain(data.sowAmounts.maxAmountToSowPerSeason, 6))}{" "}
                            per Season)
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-pinto-gray-4 text-sm whitespace-nowrap">Operator Tip:</span>
                    <div className="bg-[#F8F8F8] px-2 py-1 rounded-xl flex items-center gap-1">
                      <IconImage src={pintoIcon} size={4} />
                      <span className="text-pinto-green-4 text-sm font-thin whitespace-nowrap overflow-hidden text-ellipsis">
                        {formatter.number(TokenValue.fromBlockchain(data.operatorParams.operatorTipAmount, 6))} PINTO
                      </span>
                    </div>
                  </div>
                </div>

                {/* Strategy description - new row */}
                <div className="flex items-center pl-6 gap-2">
                  <CornerBottomLeftIcon className="h-4 w-4 text-pinto-gray-4" />
                  <span className="text-pinto-gray-4 text-sm font-thin whitespace-nowrap overflow-hidden text-ellipsis">
                    Withdraw Deposited Tokens from the Silo with the{" "}
                    {data.sourceTokenIndices.includes(255)
                      ? "Lowest Seeds"
                      : data.sourceTokenIndices.includes(254)
                        ? "Best Price"
                        : getTokenNameByIndex(data.sourceTokenIndices[0])}
                  </span>
                </div>

                {/* Execution conditions */}
                <div className="flex justify-between items-end w-full">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center pl-6 gap-2">
                      <CornerBottomLeftIcon className="h-4 w-4 text-pinto-gray-4" />
                      <span className="text-pinto-gray-4 text-sm font-thin whitespace-nowrap overflow-hidden text-ellipsis">
                        Execute when Temperature is at least {formatPercentage(data.minTemp)}
                      </span>
                    </div>
                    <div className="flex items-center pl-6 gap-2">
                      <CornerBottomLeftIcon className="h-4 w-4 text-pinto-gray-4" />
                      <span className="text-pinto-gray-4 text-sm font-thin whitespace-nowrap overflow-hidden text-ellipsis">
                        AND when Pod Line Length is at most{" "}
                        {formatter.number(TokenValue.fromHuman(data.maxPodlineLengthAsString, 6))}
                      </span>
                    </div>
                    <div className="flex items-center pl-6 gap-2">
                      <CornerBottomLeftIcon className="h-4 w-4 text-pinto-gray-4" />
                      <span className="text-pinto-gray-4 text-sm font-thin whitespace-nowrap overflow-hidden text-ellipsis">
                        AND when Available Soil is at least {data.sowAmounts.minAmountToSowPerSeasonAsString}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <IconImage src={pintoIcon} size={4} />
                    <span className="text-pinto-gray-4 text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                      PINTO Sown through this Order:
                      <span className="text-black">
                        {" "}
                        {formatter.number(totalSown)}/{formatter.number(totalAmount)}
                      </span>
                      <span className="text-pinto-gray-4"> ({Math.round(percentCompleteNumber)}%)</span>
                    </span>
                  </div>
                </div>

                {isComplete && (
                  <div className="mt-2 p-2 bg-pinto-green-1 rounded-lg border border-pinto-green-4 text-pinto-green-4 text-center font-medium">
                    Order Completed!
                  </div>
                )}
              </div>
            </Card>

            {/* External actions - positioned outside the cell */}
            <Row className="self-end gap-2 pinto-sm text-pinto-light">
              <div className="inline-flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                <span className="inline-block whitespace-nowrap">Published {publishDate}</span>
              </div>
              <Row className="inline-flex items-center gap-2">
                <ClockIcon className="h-4 w-4" />
                <span className="inline-block whitespace-nowrap">
                  Executed {executionCount} time{executionCount !== 1 ? "s" : ""}
                </span>
              </Row>
              <Row className="items-center gap-0">
                <Button
                  variant="ghost"
                  className="text-sm"
                  onClick={() => {
                    setSelectedOrder(req);
                    setShowDialog("modify");
                  }}
                  disabled={submitting || isConfirming}
                >
                  <Pencil1Icon className="h-4 w-4" />
                  <span className="inline ml-1">Modify</span>
                </Button>
                <Button
                  variant="ghost"
                  className="text-sm text-pinto-red-2 hover:bg-pinto-red-1"
                  onClick={(e) => handleCancelBlueprint(req, e)}
                  disabled={submitting || isConfirming}
                >
                  <Cross1Icon className="h-4 w-4" />
                  <span className="inline ml-1">Cancel</span>
                </Button>
              </Row>
            </Row>
          </Col>
        );
      })}

      {/* Dialog for order details */}
      {selectedOrder?.decodedData && (
        <ReviewTractorOrderDialog
          open={showDialog === "review"}
          onOpenChange={(val) => setShowDialog(val ? "review" : undefined)}
          orderData={{
            type: "sow",
            totalAmount: selectedOrder.decodedData.sowAmounts.totalAmountToSowAsString,
            temperature: selectedOrder.decodedData.minTempAsString,
            podLineLength: selectedOrder.decodedData.maxPodlineLengthAsString,
            minSoil: selectedOrder.decodedData.sowAmounts.minAmountToSowPerSeasonAsString,
            operatorTip: selectedOrder.decodedData.operatorParams.operatorTipAmountAsString,
            tokenStrategy: getStrategyProps.getTokenStrategy(selectedOrder.decodedData),
          }}
          encodedData={rawSowBlueprintCall || selectedOrder.requisition.blueprint.data}
          operatorPasteInstrs={[...selectedOrder.requisition.blueprint.operatorPasteInstrs]}
          blueprint={adaptBlueprintForDialog(selectedOrder.requisition.blueprint)}
          isViewOnly={true}
          executionHistory={(executions ?? []).filter((exec) =>
            stringEq(exec.blueprintHash, selectedOrder.requisition.blueprintHash),
          )}
        />
      )}

      {selectedOrder?.decodedData && showDialog === "modify" && (
        <ModifyTractorOrderDialog
          open={showDialog === "modify"}
          onOpenChange={(val) => setShowDialog(val ? "modify" : undefined)}
          existingOrder={selectedOrder}
          getStrategyProps={getStrategyProps}
        />
      )}
    </div>
  );
};

const EmptyContainer = ({ children }: { children: React.ReactNode }) => (
  <Col className="gap-6 justify-center items-center w-full h-[22.5rem] border rounded-lg bg-pinto-off-white border-pinto-gray-2">
    {children}
  </Col>
);

// ────────────────────────────────────────────────────────────────────────────────
// Helper functions
// ────────────────────────────────────────────────────────────────────────────────

// Helper function for formatting percentage since formatter.percentage doesn't exist
function formatPercentage(value: bigint): string {
  return `${(Number(value) / 1e6).toFixed(2)}%`;
}

// Convert the blueprint to match the expected Blueprint type (fixing readonly issue)
const adaptBlueprintForDialog = (blueprint: RequisitionEvent["requisition"]["blueprint"]): Blueprint => {
  return {
    ...blueprint,
    operatorPasteInstrs: [...blueprint.operatorPasteInstrs], // Create a mutable copy
  };
};

// Extract the sowBlueprintv0 call from the advancedFarm call
const extractSowBlueprintCall = (data: `0x${string}`): `0x${string}` | null => {
  try {
    // Step 1: Decode as advancedFarm
    const advancedFarmDecoded = decodeFunctionData({
      abi: beanstalkAbi,
      data: data,
    });

    if (advancedFarmDecoded.functionName === "advancedFarm" && advancedFarmDecoded.args[0]) {
      const farmCalls = advancedFarmDecoded.args[0] as AdvancedFarmCall[];
      if (farmCalls.length > 0) {
        // Step 2: Decode the inner call as advancedPipe
        const pipeCallData = farmCalls[0].callData;

        const advancedPipeDecoded = decodeFunctionData({
          abi: beanstalkAbi,
          data: pipeCallData,
        });

        if (advancedPipeDecoded.functionName === "advancedPipe" && advancedPipeDecoded.args[0]) {
          const pipeCalls = advancedPipeDecoded.args[0] as AdvancedPipeCall[];

          if (pipeCalls.length > 0) {
            // Step 3: Get the sowBlueprintv0 call data
            return pipeCalls[0].callData;
          }
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Failed to extract sowBlueprintv0 call:", error);
    return null;
  }
};

export default TractorOrdersPanel;
