import { Col } from "@/components/Container";
import EmptyTable from "@/components/EmptyTable";
import ReviewTractorOrderDialog from "@/components/ReviewTractorOrderDialog";
import ModifyTractorOrderDialog from "@/components/Tractor/ModifySowOrderDialog";
import FarmerTractorSowOrderCard from "@/components/Tractor/Sow/FarmerTractorSowOrderCard";
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
import { stringEq } from "@/utils/string";
import { AdvancedFarmCall, AdvancedPipeCall } from "@/utils/types";
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

  const handleOrderClick = useCallback((req: RequisitionEvent<SowBlueprintData>) => {
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
  }, []);

  const handleModifyClick = useCallback((req: RequisitionEvent<SowBlueprintData>) => {
    setSelectedOrder(req);
    setShowDialog("modify");
  }, []);

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
      {orders?.map((req, index) => (
        <FarmerTractorSowOrderCard
          key={`requisition-${index}`}
          req={req}
          executions={req.executions || []}
          onOrderClick={handleOrderClick}
          onModifyClick={handleModifyClick}
          onCancelClick={handleCancelBlueprint}
          isSubmitting={submitting}
          isConfirming={isConfirming}
        />
      ))}

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
