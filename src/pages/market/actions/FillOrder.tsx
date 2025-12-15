import pintoIcon from "@/assets/tokens/PINTO.png";
import { TV, TokenValue } from "@/classes/TokenValue";
import ComboPlotInputField from "@/components/ComboPlotInputField";
import FarmBalanceToggle from "@/components/FarmBalanceToggle";
import PodLineGraph from "@/components/PodLineGraph";
import SmartSubmitButton from "@/components/SmartSubmitButton";
import { Button } from "@/components/ui/Button";
import { Separator } from "@/components/ui/Separator";
import { MultiSlider } from "@/components/ui/Slider";
import { ANALYTICS_EVENTS } from "@/constants/analytics-events";
import { PODS } from "@/constants/internalTokens";
import { beanstalkAbi } from "@/generated/contractHooks";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { useFarmTogglePreference } from "@/hooks/useFarmTogglePreference";
import useTransaction from "@/hooks/useTransaction";
import usePodOrders from "@/state/market/usePodOrders";
import { useFarmerBalances } from "@/state/useFarmerBalances";
import { useFarmerField, useFarmerPlotsQuery } from "@/state/useFarmerField";
import { useHarvestableIndex, usePodIndex } from "@/state/useFieldData";
import { useQueryKeys } from "@/state/useQueryKeys";
import useTokenData from "@/state/useTokenData";
import { trackSimpleEvent } from "@/utils/analytics";
import { formatter } from "@/utils/format";
import { FarmToMode, Plot } from "@/utils/types";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Address, encodeFunctionData } from "viem";
import { useAccount } from "wagmi";
import CancelOrder from "./CancelOrder";

// Constants
const FIELD_ID = 0n;
const MIN_PODS_THRESHOLD = 1; // Minimum pods required for order eligibility

// Helper Functions
const calculateRemainingPods = (
  order: {
    beanAmount: string | bigint | number;
    beanAmountFilled: string | bigint | number;
    pricePerPod: string | bigint | number;
  },
  tokenDecimals: number,
): number => {
  const amount = TokenValue.fromBlockchain(order.beanAmount, tokenDecimals);
  const amountFilled = TokenValue.fromBlockchain(order.beanAmountFilled, tokenDecimals);
  const pricePerPod = TokenValue.fromBlockchain(order.pricePerPod, tokenDecimals);

  return pricePerPod.gt(0) ? amount.sub(amountFilled).div(pricePerPod).toNumber() : 0;
};

const isOrderEligible = (
  order: {
    beanAmount: string | bigint | number;
    beanAmountFilled: string | bigint | number;
    pricePerPod: string | bigint | number;
    maxPlaceInLine: string | bigint | number;
  },
  tokenDecimals: number,
  podLine: TokenValue,
): boolean => {
  const amount = TokenValue.fromBlockchain(order.beanAmount, tokenDecimals);
  const amountFilled = TokenValue.fromBlockchain(order.beanAmountFilled, tokenDecimals);
  const pricePerPod = TokenValue.fromBlockchain(order.pricePerPod, tokenDecimals);
  const remainingPods = pricePerPod.gt(0) ? amount.sub(amountFilled).div(pricePerPod) : TokenValue.ZERO;
  const orderMaxPlace = TokenValue.fromBlockchain(order.maxPlaceInLine, PODS.decimals);

  return remainingPods.gt(MIN_PODS_THRESHOLD) && orderMaxPlace.lte(podLine);
};

export default function FillOrder() {
  const mainToken = useTokenData().mainToken;
  const diamondAddress = useProtocolAddress();
  const { queryKeys: balanceQKs } = useFarmerBalances();
  const account = useAccount();
  const harvestableIndex = useHarvestableIndex();
  const podIndex = usePodIndex();
  const podLine = podIndex.sub(harvestableIndex);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");

  const queryClient = useQueryClient();
  const {
    allPodOrders,
    allMarket,
    farmerMarket,
    farmerField: farmerFieldQK,
  } = useQueryKeys({
    account: account.address,
  });
  const { queryKey: farmerPlotsQK } = useFarmerPlotsQuery();
  const allQK = useMemo(
    () => [allPodOrders, allMarket, farmerMarket, farmerFieldQK, farmerPlotsQK, ...balanceQKs],
    [allPodOrders, allMarket, farmerMarket, farmerFieldQK, farmerPlotsQK, balanceQKs],
  );
  const [podRange, setPodRange] = useState<[number, number]>([0, 0]);
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [successAmount, setSuccessAmount] = useState<number | null>(null);
  const [successAvgPrice, setSuccessAvgPrice] = useState<number | null>(null);
  const [successTotal, setSuccessTotal] = useState<number | null>(null);

  const prevTotalCapacityRef = useRef<number>(0);
  const selectedOrderIdsRef = useRef<string[]>([]);
  const successDataRef = useRef<{ amount: number; avgPrice: number; total: number } | null>(null);

  // Keep ref in sync and reset capacity ref when selection changes
  useEffect(() => {
    selectedOrderIdsRef.current = selectedOrderIds;
    prevTotalCapacityRef.current = -1; // Reset to allow re-triggering range update
  }, [selectedOrderIds]);

  const podOrders = usePodOrders();
  const allOrders = podOrders.data;
  const farmerField = useFarmerField();

  const { selectedOrders, orderPositions, totalCapacity } = useMemo(() => {
    if (!allOrders?.podOrders) return { selectedOrders: [], orderPositions: [], totalCapacity: 0 };

    const orders = allOrders.podOrders.filter((order) => selectedOrderIds.includes(order.id));

    let cumulative = 0;
    const positions = orders.map((order) => {
      const fillableAmount = calculateRemainingPods(order, mainToken.decimals);
      const startPos = cumulative;
      cumulative += fillableAmount;

      return {
        orderId: order.id,
        startPos,
        endPos: cumulative,
        capacity: fillableAmount,
        order,
      };
    });

    return {
      selectedOrders: orders,
      orderPositions: positions,
      totalCapacity: cumulative,
    };
  }, [allOrders, selectedOrderIds, mainToken.decimals]);

  const amount = podRange[1] - podRange[0];

  const ordersToFill = useMemo(() => {
    const [rangeStart, rangeEnd] = podRange;

    return orderPositions
      .filter((pos) => pos.endPos > rangeStart && pos.startPos < rangeEnd)
      .map((pos) => {
        const overlapStart = Math.max(pos.startPos, rangeStart);
        const overlapEnd = Math.min(pos.endPos, rangeEnd);
        const fillAmount = overlapEnd - overlapStart;

        return {
          order: pos.order,
          amount: fillAmount,
        };
      })
      .filter((item) => item.amount > 0);
  }, [orderPositions, podRange]);

  // Calculate weighted average price per pod once for reuse
  const weightedAvgPricePerPod = useMemo(() => {
    if (ordersToFill.length === 0 || amount === 0) return 0;

    // Single order - use its price directly
    if (ordersToFill.length === 1) {
      return TokenValue.fromBlockchain(ordersToFill[0].order.pricePerPod, mainToken.decimals).toNumber();
    }

    // Multiple orders - calculate weighted average
    let totalValue = 0;
    let totalPods = 0;

    for (const { order, amount: fillAmount } of ordersToFill) {
      const orderPricePerPod = TokenValue.fromBlockchain(order.pricePerPod, mainToken.decimals).toNumber();
      totalValue += orderPricePerPod * fillAmount;
      totalPods += fillAmount;
    }

    return totalPods > 0 ? totalValue / totalPods : 0;
  }, [ordersToFill, amount, mainToken.decimals]);

  const eligibleOrders = useMemo(() => {
    if (!allOrders?.podOrders) return [];

    // Get farmer's frontmost pod position (lowest index)
    const farmerPlots = farmerField.plots;
    const farmerFrontmostPodIndex =
      farmerPlots.length > 0
        ? farmerPlots.reduce((min, plot) => (plot.index.lt(min) ? plot.index : min), farmerPlots[0].index)
        : null;

    return allOrders.podOrders.filter((order) => {
      // Check basic eligibility
      if (!isOrderEligible(order, mainToken.decimals, podLine)) {
        return false;
      }

      // Check if farmer has pods that can fill this order
      // Order's maxPlaceInLine + harvestableIndex must be >= farmer's frontmost pod index
      if (!farmerFrontmostPodIndex) {
        return false; // No pods available
      }

      const orderMaxPlaceIndex = harvestableIndex.add(TokenValue.fromBlockchain(order.maxPlaceInLine, PODS.decimals));

      // Farmer's pod must be at or before the order's maxPlaceInLine position
      return farmerFrontmostPodIndex.lte(orderMaxPlaceIndex);
    });
  }, [allOrders?.podOrders, mainToken.decimals, podLine, farmerField.plots, harvestableIndex]);

  useEffect(() => {
    if (totalCapacity !== prevTotalCapacityRef.current) {
      setPodRange([0, totalCapacity]);
      prevTotalCapacityRef.current = totalCapacity;
    }
  }, [totalCapacity]);

  // Pre-select order when orderId parameter is present (clicked from chart)
  useEffect(() => {
    if (!orderId || !allOrders?.podOrders) return;

    // Find the order with matching ID
    const order = allOrders.podOrders.find((o) => o.id === orderId);
    if (!order) return;

    // Add order to selection if not already selected
    if (!selectedOrderIds.includes(orderId)) {
      setSelectedOrderIds((prev) => [...prev, orderId]);
    }
  }, [orderId, allOrders, selectedOrderIds]);

  const orderMarkers = useMemo(() => {
    if (eligibleOrders.length === 0) return [];

    return eligibleOrders.map((order) => {
      const orderMaxPlace = TokenValue.fromBlockchain(order.maxPlaceInLine, PODS.decimals);
      const markerIndex = harvestableIndex.add(orderMaxPlace);

      return {
        index: markerIndex,
        pods: TokenValue.fromHuman(1, PODS.decimals),
        harvestablePods: TokenValue.ZERO,
        id: order.id,
      } as Plot;
    });
  }, [eligibleOrders, harvestableIndex]);

  const plotsForGraph = useMemo(() => {
    return orderMarkers;
  }, [orderMarkers]);

  const handlePodRangeChange = useCallback((values: number[]) => {
    const newRange = values as [number, number];
    setPodRange(newRange);

    const rangeAmount = newRange[1] - newRange[0];
    if (rangeAmount === 0 && selectedOrderIdsRef.current.length > 0) {
      setSelectedOrderIds([]);
    }
  }, []);

  const onSuccess = useCallback(() => {
    // Set success state from ref (to avoid stale closure)
    if (successDataRef.current) {
      const { amount, avgPrice, total } = successDataRef.current;
      setSuccessAmount(amount);
      setSuccessAvgPrice(avgPrice);
      setSuccessTotal(total);
      setIsSuccessful(true);
      successDataRef.current = null; // Clear ref after use
    }

    setPodRange([0, 0]);
    setSelectedOrderIds([]);
    allQK.forEach((key) => queryClient.invalidateQueries({ queryKey: key }));
  }, [queryClient, allQK]);

  const { isConfirming, writeWithEstimateGas, submitting, setSubmitting } = useTransaction({
    successMessage: "Order Fill successful",
    errorMessage: "Order Fill failed",
    successCallback: onSuccess,
  });

  const onSubmit = useCallback(async () => {
    if (ordersToFill.length === 0 || !account || farmerField.plots.length === 0) {
      return;
    }

    // Reset success state when starting new transaction
    setIsSuccessful(false);
    setSuccessAmount(null);
    setSuccessAvgPrice(null);
    setSuccessTotal(null);

    // Save success data to ref (to avoid stale closure in onSuccess callback)
    successDataRef.current = {
      amount,
      avgPrice: weightedAvgPricePerPod,
      total: amount * weightedAvgPricePerPod,
    };

    // Track analytics for each order being filled
    for (const { order: orderToFill } of ordersToFill) {
      trackSimpleEvent(ANALYTICS_EVENTS.MARKET.POD_ORDER_FILL, {
        order_price_per_pod: Number(orderToFill.pricePerPod),
        order_max_place: Number(orderToFill.maxPlaceInLine),
      });
    }

    try {
      setSubmitting(true);
      toast.loading(`Filling ${ordersToFill.length} Order${ordersToFill.length !== 1 ? "s" : ""}...`);

      // Sort farmer plots by index to use them in order (only sort once)
      const sortedPlots = [...farmerField.plots].sort((a, b) => a.index.sub(b.index).toNumber());

      if (sortedPlots.length === 0) {
        throw new Error("No pods available to fill orders");
      }

      // Allocate pods from plots to orders
      let plotIndex = 0;
      let remainingPodsInCurrentPlot = sortedPlots[0].pods.toNumber();
      let currentPlot = sortedPlots[0];
      let currentPlotStartOffset = 0;

      const farmData: `0x${string}`[] = [];

      for (const { order: orderToFill, amount: fillAmount } of ordersToFill) {
        let remainingAmount = fillAmount;
        const orderMaxPlaceIndex = harvestableIndex.add(
          TokenValue.fromBlockchain(orderToFill.maxPlaceInLine, PODS.decimals),
        );

        // Continue using plots until we have enough pods to fill this order
        while (remainingAmount > 0 && plotIndex < sortedPlots.length) {
          // Move to next plot if current one is exhausted
          if (remainingPodsInCurrentPlot === 0) {
            plotIndex++;
            if (plotIndex >= sortedPlots.length) {
              throw new Error(
                `Insufficient pods in your plots to fill order. Need ${remainingAmount.toFixed(2)} more pods.`,
              );
            }
            currentPlot = sortedPlots[plotIndex];
            remainingPodsInCurrentPlot = currentPlot.pods.toNumber();
            currentPlotStartOffset = 0;
          }

          // Validate that plot position is valid for this order
          if (currentPlot.index.gt(orderMaxPlaceIndex)) {
            throw new Error(
              `Your pod at position ${currentPlot.index.toHuman()} is too far in line for order (max: ${orderMaxPlaceIndex.toHuman()})`,
            );
          }

          const podsToUse = Math.min(remainingAmount, remainingPodsInCurrentPlot);
          const podAmount = TokenValue.fromHuman(podsToUse, PODS.decimals);
          const startOffset = TokenValue.fromHuman(currentPlotStartOffset, PODS.decimals);

          // Create fillPodOrder call for this order with pod allocation from current plot
          const fillOrderArgs = {
            orderer: orderToFill.farmer.id as Address,
            fieldId: FIELD_ID,
            maxPlaceInLine: BigInt(orderToFill.maxPlaceInLine),
            pricePerPod: Number(orderToFill.pricePerPod),
            minFillAmount: BigInt(orderToFill.minFillAmount),
          };

          const fillCall = encodeFunctionData({
            abi: beanstalkAbi,
            functionName: "fillPodOrder",
            args: [
              fillOrderArgs,
              currentPlot.index.toBigInt(),
              startOffset.toBigInt(),
              podAmount.toBigInt(),
              Number(FarmToMode.INTERNAL),
            ],
          });

          farmData.push(fillCall);

          // Update tracking variables
          remainingAmount -= podsToUse;
          remainingPodsInCurrentPlot -= podsToUse;
          currentPlotStartOffset += podsToUse;
        }

        // Validate all pods were allocated
        if (remainingAmount > 0) {
          throw new Error(
            `Insufficient pods in your plots to fill order. Need ${remainingAmount.toFixed(2)} more pods.`,
          );
        }
      }

      if (farmData.length === 0) {
        throw new Error("No valid fill operations to execute");
      }

      // Use farm to batch all order fills in one transaction
      // Success state will be set in onSuccess callback via ref
      writeWithEstimateGas({
        address: diamondAddress,
        abi: beanstalkAbi,
        functionName: "farm",
        args: [farmData],
      });
    } catch (e) {
      console.error("Fill order error:", e);
      toast.dismiss();
      const errorMessage =
        e instanceof Error ? e.message : "Order Fill Failed. Please check your pod balance and try again.";
      toast.error(errorMessage);
      setSubmitting(false);
    }
  }, [
    ordersToFill,
    account,
    farmerField.plots,
    writeWithEstimateGas,
    setSubmitting,
    diamondAddress,
    amount,
    weightedAvgPricePerPod,
    harvestableIndex,
  ]);

  const isOwnOrder = useMemo(() => {
    return selectedOrders.some((order) => order.farmer.id === account.address?.toLowerCase());
  }, [selectedOrders, account.address]);

  if (eligibleOrders.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3">
          <p className="pinto-body text-pinto-light">Select the order you want to fill (i):</p>
          <PodLineGraph plots={[]} selectedPlotIndices={[]} className="" label="Open Orders" />
        </div>
        <div className="flex justify-center mt-4">
          <p className="pinto-body text-pinto-light">There are no open orders that can be filled with your Pods.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Order Markers Visualization - Click to select orders (multi-select) */}
      <div className="flex flex-col gap-3">
        <p className="pinto-body text-pinto-light">Select the orders you want to fill:</p>

        {/* Pod Line Graph - Shows order markers (orange thin lines at maxPlaceInLine) */}
        <PodLineGraph
          plots={plotsForGraph}
          selectedPlotIndices={selectedOrderIds}
          label="Open Orders"
          onPlotGroupSelect={(plotIndices) => {
            // Multi-select toggle: add or remove clicked order group
            if (plotIndices.length === 0) return;

            // Check if all orders in the group are already selected
            const allSelected = plotIndices.every((orderId) => selectedOrderIds.includes(orderId));

            if (allSelected) {
              // Deselect only this group - remove orders from this group
              setSelectedOrderIds((prev) => prev.filter((id) => !plotIndices.includes(id)));
            } else {
              // Add this group to existing selection - merge with current selection (avoid duplicates)
              setSelectedOrderIds((prev) => {
                const newOrderIds = [...prev];
                plotIndices.forEach((orderId) => {
                  if (!newOrderIds.includes(orderId)) {
                    newOrderIds.push(orderId);
                  }
                });
                return newOrderIds;
              });
            }
          }}
        />

        {/* Total Pods Available - Simple text below graph */}
        <div className="flex">
          <p className="pinto-body text-pinto-light mt-4">
            Total Pods that can be filled:{" "}
            {formatter.noDec(
              eligibleOrders.reduce((sum, order) => sum + calculateRemainingPods(order, mainToken.decimals), 0),
            )}{" "}
            Pods
          </p>
        </div>
      </div>

      {/* Show cancel option if user owns an order */}
      {isOwnOrder && selectedOrders.length > 0 && (
        <>
          <Separator />
          {selectedOrders
            .filter((order) => order.farmer.id === account.address?.toLowerCase())
            .map((order) => (
              <CancelOrder key={order.id} order={order} />
            ))}
        </>
      )}

      {/* Show form only if orders are selected and not own order (even if amount is 0) */}
      {!isOwnOrder &&
        selectedOrderIds.length > 0 &&
        (() => {
          const maxAmount = totalCapacity;

          return (
            <>
              {/* Amount Selection */}
              <div className="flex flex-col gap-4 animate-fade-in">
                {/* Pods selected from slider */}
                <div className="flex justify-between items-center p-4 bg-pinto-gray-1 rounded-lg">
                  <p className="pinto-body text-pinto-light">
                    Pods Selected in {ordersToFill.length} Order{ordersToFill.length !== 1 ? "s" : ""}:
                  </p>
                  <p className="pinto-body font-semibold">
                    {formatter.number(amount, { minDecimals: 0, maxDecimals: 2 })} Pods
                  </p>
                </div>

                {/* Pod Range Selection - Multi-slider for selecting from which orders */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-4 w-full">
                    <p className="pinto-body text-pinto-light whitespace-nowrap">Select Range</p>
                    <div className="flex items-center gap-1.5 flex-1 p-4">
                      <p className="pinto-body text-pinto-light text-right tabular-nums">
                        {formatter.number(podRange[0], { minDecimals: 0, maxDecimals: 2 })}
                      </p>
                      <div className="flex-1">
                        {maxAmount > 0 && (
                          <MultiSlider
                            min={0}
                            max={maxAmount}
                            step={1}
                            value={podRange}
                            onValueChange={handlePodRangeChange}
                          />
                        )}
                      </div>
                      <p className="pinto-body text-pinto-light text-right tabular-nums">
                        {formatter.number(podRange[1], { minDecimals: 0, maxDecimals: 2 })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Info Display - Based on selected range */}
                <div className="flex flex-col gap-2">
                  <div className="flex flex-row justify-between">
                    <p className="pinto-body text-pinto-light">Average Price Per Pod</p>
                    <div className="flex items-center">
                      <p className="pinto-body text-pinto-primary">
                        {formatter.number(weightedAvgPricePerPod, { minDecimals: 2, maxDecimals: 6 })} Pinto
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-row justify-between">
                    <p className="pinto-body text-pinto-light">Effective Temperature</p>
                    <div className="flex items-center">
                      <p className="pinto-body text-pinto-primary">
                        {weightedAvgPricePerPod > 0
                          ? formatter.number((1 / weightedAvgPricePerPod) * 100, { minDecimals: 2, maxDecimals: 2 })
                          : "0.00"}
                        %
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <Separator />
                {ordersToFill.length > 0 && amount > 0 && (
                  <ActionSummary podAmount={amount} pricePerPod={weightedAvgPricePerPod} />
                )}
                <SmartSubmitButton
                  variant="gradient"
                  size="xxl"
                  submitButtonText={
                    isSuccessful
                      ? "Order Filled!"
                      : `Fill ${ordersToFill.length} Pod Order${ordersToFill.length !== 1 ? "s" : ""}`
                  }
                  disabled={ordersToFill.length === 0 || !amount || isConfirming || submitting || isSuccessful}
                  submitFunction={onSubmit}
                />
              </div>
            </>
          );
        })()}

      {/* Success Screen */}
      {isSuccessful && successAmount !== null && successAvgPrice !== null && successTotal !== null && (
        <div className="flex flex-col gap-6 w-full animate-fade-in">
          <Separator />

          <div className="flex flex-col gap-3 items-center text-center px-4">
            <p className="pinto-body text-pinto-light">
              You have successfully filled {formatter.noDec(successAmount)} Pods at an average price of{" "}
              {formatter.number(successAvgPrice, { minDecimals: 2, maxDecimals: 6 })} Pintos per Pod, for a total of{" "}
              {formatter.number(successTotal, { minDecimals: 0, maxDecimals: 2 })} Pintos!
            </p>
          </div>

          <div className="flex justify-center">
            <Button
              variant="outline-primary-2"
              size="lg"
              onClick={() => navigate("/overview")}
              className="w-full sm:w-auto"
            >
              Go to Overview
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

interface ActionSummaryProps {
  podAmount: number;
  pricePerPod: number;
}

const ActionSummary = ({ podAmount, pricePerPod }: ActionSummaryProps) => {
  const beansOut = useMemo(() => podAmount * pricePerPod, [podAmount, pricePerPod]);

  return (
    <div className="flex flex-col gap-4">
      <p className="pinto-body text-pinto-light">You will Receive:</p>
      <div className="flex flex-col gap-2">
        <p className="pinto-h3 flex flex-row items-center gap-2 -mt-1">
          <img src={pintoIcon} className="w-8 h-8" alt={"order summary pinto"} />
          {formatter.number(beansOut, { minDecimals: 0, maxDecimals: 2 })} PINTO
        </p>
      </div>
    </div>
  );
};
