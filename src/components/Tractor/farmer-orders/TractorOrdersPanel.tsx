import { Col } from "@/components/Container";
import EmptyTable from "@/components/EmptyTable";
import ReviewTractorOrderDialog from "@/components/ReviewTractorOrderDialog";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { diamondABI } from "@/constants/abi/diamondABI";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { useGetTractorTokenStrategyWithBlueprint } from "@/hooks/tractor/useGetTractorTokenStrategy";
import useTransaction from "@/hooks/useTransaction";
import { PublisherTractorExecution } from "@/lib/Tractor";
import type { Blueprint } from "@/lib/Tractor";
import { useTractorConvertUpOrderbook } from "@/state/tractor/useTractorConvertUpOrders";
import usePublisherTractorExecutions from "@/state/tractor/useTractorExecutions";
import useTractorOperatorAverageTipPaid from "@/state/tractor/useTractorOperatorAverageTipPaid";
import { useTractorSowOrderbook } from "@/state/tractor/useTractorSowOrders";
import { tryExtractErrorMessage } from "@/utils/error";
import { stringEq } from "@/utils/string";
import { MayArray } from "@/utils/types.generic";
import { arrayify } from "@/utils/utils";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useAccount } from "wagmi";
import ModifyConvertUpOrderDialog from "../ModifyConvertUpOrderDialog";
import ModifyTractorOrderDialog from "../ModifySowOrderDialog";
import FarmerTractorConvertUpOrderCard from "./FarmerTractorConvertUpOrderCard";
import FarmerTractorSowOrderCard from "./FarmerTractorSowOrderCard";
import {
  MixedOrderFilters,
  MixedOrderSortBy,
  UnifiedTractorOrder,
  isConvertUpOrder,
  isSowOrder,
} from "./TractorFarmerMixedOrders.types";
import {
  filterUnifiedOrders,
  getOrderTypeBadge,
  sortUnifiedOrders,
  transformConvertUpOrderToUnified,
  transformSowOrderToUnified,
} from "./TractorFarmerMixedOrders.utils";
import { ORDER_TYPE_REGISTRY, OrderType } from "./TractorFarmerOrderTypeRegistry";

interface TractorOrdersPanelProps {
  orderTypes?: MayArray<OrderType>;
  refreshData?: number;
  onCreateOrder?: () => void;
  sortBy?: MixedOrderSortBy;
  initialFilters?: Partial<MixedOrderFilters>;
}

const ORDER_TYPES: OrderType[] = ["sow", "convertUp"] as const;

function TractorOrdersPanelGeneric({
  orderTypes: _orderTypes = ORDER_TYPES,
  refreshData,
  onCreateOrder,
  sortBy = "newest",
  initialFilters,
}: TractorOrdersPanelProps) {
  const { address } = useAccount();
  const protocolAddress = useProtocolAddress();
  const getStrategyProps = useGetTractorTokenStrategyWithBlueprint();

  // State for dialogs and filters
  const [selectedOrder, setSelectedOrder] = useState<UnifiedTractorOrder | null>(null);
  const [showDialog, setShowDialog] = useState<"review" | "modify" | undefined>(undefined);
  const [rawBlueprintCall, setRawBlueprintCall] = useState<`0x${string}` | null>(null);

  const orderTypes = useMemo(() => arrayify(_orderTypes), [_orderTypes]);

  // Filtering and sorting state
  const [filters, setFilters] = useState<MixedOrderFilters>({
    orderTypes: orderTypes,
    showCompleted: true,
    showCancelled: false,
    ...initialFilters,
  });
  const [currentSortBy, setCurrentSortBy] = useState<MixedOrderSortBy>(sortBy);

  // Fetch executions for the farmer's orders
  const { data: executions, ...executionsQuery } = usePublisherTractorExecutions(address, !!address);

  // Direct hook composition - call both hooks always
  const { data: sowOrders, ...sowOrdersQuery } = useTractorSowOrderbook({
    address,
    filterOutCompleted: false,
    enabled: !!address && filters.orderTypes.includes("sow"),
  });

  const { data: convertUpOrders, ...convertUpOrdersQuery } = useTractorConvertUpOrderbook({
    address,
    filterOutCompleted: false,
    enabled: !!address && filters.orderTypes.includes("convertUp"),
  });

  const executionsByHash = useMemo(() => {
    const byHash = executions?.reduce<Record<`0x${string}`, PublisherTractorExecution[]>>((acc, curr) => {
      if (curr.blueprintHash in acc) acc[curr.blueprintHash].push(curr);
      else acc[curr.blueprintHash] = [curr];
      return acc;
    }, {});
    return byHash;
  }, [executions]);

  // Process and combine orders into unified format
  const unifiedOrders = useMemo(() => {
    const unified: UnifiedTractorOrder[] = [];

    // Process Sow orders
    if (filters.orderTypes.includes("sow") && sowOrders) {
      sowOrders
        .filter((req) => stringEq(req.requisition.blueprint.publisher, address))
        .forEach((req) => {
          const decodedResult = ORDER_TYPE_REGISTRY.sow.decodeData(req.requisition.blueprint.data);
          if (!decodedResult) {
            return;
          }

          // Handle both unwrapped and wrapped referral formats
          let decodedData: any;
          if ("blueprintData" in decodedResult && typeof decodedResult.blueprintData === "object") {
            // Wrapped referral format: { blueprintData, referralAddress }
            decodedData = decodedResult.blueprintData;
          } else {
            // Regular SowBlueprintData format
            decodedData = decodedResult;
          }

          const reqWithDecodedData = { ...req, decodedData };
          const orderExecutions = executionsByHash?.[req.requisition.blueprintHash] || [];

          unified.push(transformSowOrderToUnified(reqWithDecodedData, orderExecutions));
        });
    }
    // Process ConvertUp orders
    if (filters.orderTypes.includes("convertUp") && convertUpOrders) {
      convertUpOrders
        .filter((req) => stringEq(req.requisition.blueprint.publisher, address))
        .forEach((req) => {
          const decodedData =
            req.decodedData ?? ORDER_TYPE_REGISTRY.convertUp.decodeData(req.requisition.blueprint.data);
          if (!decodedData) {
            return;
          }
          const reqWithDecodedData = { ...req, decodedData };
          const orderExecutions = executionsByHash?.[req.requisition.blueprintHash] || [];

          unified.push(transformConvertUpOrderToUnified(reqWithDecodedData, orderExecutions));
        });
    }

    // Apply filters and sorting
    const filtered = filterUnifiedOrders(unified, filters);
    return sortUnifiedOrders(filtered, currentSortBy);
  }, [sowOrders, convertUpOrders, executions, address, filters, currentSortBy, executionsByHash]);

  // Loading and error states
  const dataHasLoaded = address ? Boolean(executions !== undefined) : true;
  const loading =
    executionsQuery.isLoading ||
    (filters.orderTypes.includes("sow") && sowOrdersQuery.isLoading) ||
    (filters.orderTypes.includes("convertUp") && convertUpOrdersQuery.isLoading) ||
    !dataHasLoaded;

  const error = executionsQuery.error || sowOrdersQuery.error || convertUpOrdersQuery.error;

  const [lastRefetchedCounter, setLastRefetchedCounter] = useState<number>(0);

  // biome-ignore lint/correctness/useExhaustiveDependencies: only refresh when refresh data counter changes
  useEffect(() => {
    if (refreshData && dataHasLoaded && lastRefetchedCounter !== refreshData) {
      setLastRefetchedCounter(refreshData);
      executionsQuery.refetch();
      if (filters.orderTypes.includes("sow")) {
        sowOrdersQuery.refetch();
      }
      if (filters.orderTypes.includes("convertUp")) {
        convertUpOrdersQuery.refetch();
      }
    }
  }, [refreshData, dataHasLoaded, filters.orderTypes]);

  // Transaction handling for cancel order
  const { writeWithEstimateGas, setSubmitting, submitting, isConfirming } = useTransaction({
    successMessage: "Order cancelled successfully",
    errorMessage: "Failed to cancel order",
    successCallback: useCallback(() => {
      executionsQuery.refetch();
      if (filters.orderTypes.includes("sow")) {
        sowOrdersQuery.refetch();
      }
      if (filters.orderTypes.includes("convertUp")) {
        convertUpOrdersQuery.refetch();
      }
    }, [executionsQuery.refetch, sowOrdersQuery.refetch, convertUpOrdersQuery.refetch, filters.orderTypes]),
  });

  const handleCancelOrder = async (order: UnifiedTractorOrder, e: React.MouseEvent) => {
    setSubmitting(true);
    e.stopPropagation();

    if (!address) {
      throw new Error("Signer required.");
    }

    if (order.isCancelled) {
      throw new Error("Order already cancelled");
    }

    toast.loading("Cancelling order...");

    // Use the appropriate config's preparation function
    const config = ORDER_TYPE_REGISTRY[order.type];
    if (!config.prepareForCancellation) {
      throw new Error(`No cancellation handler for order type: ${order.type}`);
    }
    const preparedRequisition = config.prepareForCancellation(order.requisition as any);

    try {
      return writeWithEstimateGas({
        address: protocolAddress,
        abi: diamondABI,
        functionName: "cancelBlueprint",
        args: [preparedRequisition],
      });
    } catch (error) {
      console.error("Error cancelling blueprint:", error);
      toast.error(tryExtractErrorMessage(error, "Failed to cancel order"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleOrderClick = useCallback((order: UnifiedTractorOrder) => {
    setSelectedOrder(order);
    setRawBlueprintCall(order.requisition.requisition.blueprint.data);

    // Extract the raw blueprint call data if available

    setShowDialog("review");
  }, []);

  const handleModifyClick = useCallback((order: UnifiedTractorOrder) => {
    setSelectedOrder(order);
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

  if (!unifiedOrders.length) {
    return <EmptyTable type="tractorConvertUp" onTractorClick={onCreateOrder} />;
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Filter and Sort Controls (if enabled) */}
      {/* Orders List */}
      {unifiedOrders.map((order, index) => {
        const badge = getOrderTypeBadge(order.type);

        return (
          <div key={`order-${order.id}-${index}`} className="relative">
            {/* Order type badge */}
            {orderTypes.length > 1 && (
              <div className="absolute -top-2 left-4 z-10">
                <div className={`px-2 py-1 rounded-md text-xs font-medium border ${badge.className}`}>
                  <span className="mr-1">{badge.icon}</span>
                  {badge.label}
                </div>
              </div>
            )}

            <div className={orderTypes.length > 1 ? "pt-3" : ""}>
              {isSowOrder(order) && (
                <FarmerTractorSowOrderCard
                  req={order.requisition}
                  executions={order.executions}
                  getStrategyProps={getStrategyProps}
                  onOrderClick={() => handleOrderClick(order)}
                  onModifyClick={() => handleModifyClick(order)}
                  onCancelClick={(_, e) => handleCancelOrder(order, e)}
                  isSubmitting={submitting}
                  isConfirming={isConfirming}
                />
              )}

              {isConvertUpOrder(order) && (
                <FarmerTractorConvertUpOrderCard
                  req={order.requisition}
                  getStrategyProps={getStrategyProps}
                  onOrderClick={() => handleOrderClick(order)}
                  onModifyClick={() => handleModifyClick(order)}
                  onCancelClick={(_, e) => handleCancelOrder(order, e)}
                  isSubmitting={submitting}
                  isConfirming={isConfirming}
                />
              )}
            </div>
          </div>
        );
      })}

      {/* Review Dialog */}
      {selectedOrder && (selectedOrder.requisition as any).decodedData && (
        <ReviewTractorOrderDialog
          open={showDialog === "review"}
          onOpenChange={(val) => setShowDialog(val ? "review" : undefined)}
          orderData={(ORDER_TYPE_REGISTRY[selectedOrder.type] as any).transformOrderData(
            selectedOrder.requisition,
            getStrategyProps,
          )}
          encodedData={rawBlueprintCall || (selectedOrder.requisition as any).requisition.blueprint.data}
          operatorPasteInstrs={[...(selectedOrder.requisition as any).requisition.blueprint.operatorPasteInstrs]}
          blueprint={adaptBlueprintForDialog((selectedOrder.requisition as any).requisition.blueprint)}
          isViewOnly={true}
          executionHistory={(executions ?? []).filter((exec) =>
            stringEq(exec.blueprintHash, (selectedOrder.requisition as any).requisition.blueprintHash),
          )}
        />
      )}

      {/* Modify Dialogs */}
      {selectedOrder && showDialog === "modify" && (
        <>
          {isSowOrder(selectedOrder) && (
            <ModifyTractorOrderDialog
              open={showDialog === "modify"}
              onOpenChange={(val) => setShowDialog(val ? "modify" : undefined)}
              existingOrder={selectedOrder.requisition}
              getStrategyProps={getStrategyProps}
            />
          )}
          {isConvertUpOrder(selectedOrder) && (
            <ModifyConvertUpOrderDialog
              open={showDialog === "modify"}
              onOpenChange={(val) => setShowDialog(val ? "modify" : undefined)}
              existingOrder={selectedOrder.requisition}
              onOrderModified={() => {
                // Refresh data after successful modification
                executionsQuery.refetch();
                if (filters.orderTypes.includes("convertUp")) {
                  convertUpOrdersQuery.refetch();
                }
                setShowDialog(undefined);
                setSelectedOrder(null);
              }}
            />
          )}
        </>
      )}
    </div>
  );
}

const EmptyContainer = ({ children }: { children: React.ReactNode }) => (
  <Col className="gap-6 justify-center items-center w-full h-[22.5rem] border rounded-lg bg-pinto-off-white border-pinto-gray-2">
    {children}
  </Col>
);

// Convert the blueprint to match the expected Blueprint type (fixing readonly issue)
const adaptBlueprintForDialog = (blueprint: {
  publisher: `0x${string}`;
  data: `0x${string}`;
  operatorPasteInstrs: readonly `0x${string}`[];
  maxNonce: bigint;
  startTime: bigint;
  endTime: bigint;
}): Blueprint => {
  return {
    ...blueprint,
    operatorPasteInstrs: [...blueprint.operatorPasteInstrs], // Create a mutable copy
  };
};

const orderTypesRef = {
  sow: ["sow" as const],
  convertUp: ["convertUp" as const],
};

// Export type-safe wrappers for each order type
export const TractorSowOrdersPanel: React.FC<Omit<TractorOrdersPanelProps, "orderTypes">> = (props) => (
  <TractorOrdersPanelGeneric orderTypes={orderTypesRef.sow} {...props} />
);

export const TractorConvertUpOrdersPanel: React.FC<Omit<TractorOrdersPanelProps, "orderTypes">> = (props) => (
  <TractorOrdersPanelGeneric orderTypes={orderTypesRef.convertUp} {...props} />
);

export const TractorMixedOrdersPanel: React.FC<TractorOrdersPanelProps> = (props) => (
  <TractorOrdersPanelGeneric {...props} />
);

export default TractorOrdersPanelGeneric;

/* {showFilters && (
    <div className="flex justify-between items-center">
      <div className="flex gap-2">
        <select
          value={currentSortBy}
          onChange={(e) => setCurrentSortBy(e.target.value as MixedOrderSortBy)}
          className="px-3 py-1 border border-pinto-gray-2 rounded-md text-sm"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="type">By Type</option>
          <option value="operatorTip">By Operator Tip</option>
          <option value="percentComplete">By Progress</option>
          <option value="publisher">By Publisher</option>
        </select>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={filters.showCompleted}
            onChange={(e) => setFilters((prev) => ({ ...prev, showCompleted: e.target.checked }))}
          />
          Show Completed
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={filters.showCancelled}
            onChange={(e) => setFilters((prev) => ({ ...prev, showCancelled: e.target.checked }))}
          />
          Show Cancelled
        </label>
      </div>

      <div className="text-sm text-pinto-gray-4">
        {unifiedOrders.length} order{unifiedOrders.length !== 1 ? "s" : ""}
      </div>
    </div>
  )} */
