import pintoIcon from "@/assets/tokens/PINTO.png";
import { TokenValue } from "@/classes/TokenValue";
import PodLineGraph from "@/components/PodLineGraph";
import SmartSubmitButton from "@/components/SmartSubmitButton";
import { Separator } from "@/components/ui/Separator";
import { MultiSlider } from "@/components/ui/Slider";
import { ANALYTICS_EVENTS } from "@/constants/analytics-events";
import { PODS } from "@/constants/internalTokens";
import { beanstalkAbi } from "@/generated/contractHooks";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import useTransaction from "@/hooks/useTransaction";
import usePodOrders from "@/state/market/usePodOrders";
import { useFarmerBalances } from "@/state/useFarmerBalances";
import { useFarmerPlotsQuery } from "@/state/useFarmerField";
import { useHarvestableIndex, usePodIndex } from "@/state/useFieldData";
import { useQueryKeys } from "@/state/useQueryKeys";
import useTokenData from "@/state/useTokenData";
import { trackSimpleEvent } from "@/utils/analytics";
import { formatter } from "@/utils/format";
import { FarmToMode, Plot } from "@/utils/types";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Address } from "viem";
import { useAccount } from "wagmi";
import CancelOrder from "./CancelOrder";

//! TODO: ADD INPUT FIELD FOR POD AMOUNTS
//! TODO: SOLVE CHART REDIRECT ISSUE
//! TODO: ADD SETTINGS SECTION

// Constants
const FIELD_ID = 0n;
const START_INDEX_WITHIN_PLOT = 0n;
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

  const [plot, setPlot] = useState<Plot[]>([]);
  const [podRange, setPodRange] = useState<[number, number]>([0, 0]);
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);

  const prevTotalCapacityRef = useRef<number>(0);
  const selectedOrderIdsRef = useRef<string[]>([]);

  // Keep ref in sync and reset capacity ref when selection changes
  useEffect(() => {
    selectedOrderIdsRef.current = selectedOrderIds;
    prevTotalCapacityRef.current = -1; // Reset to allow re-triggering range update
  }, [selectedOrderIds]);

  const podOrders = usePodOrders();
  const allOrders = podOrders.data;

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
  }, [allOrders?.podOrders, selectedOrderIds, mainToken.decimals]);

  const order = selectedOrders[0];
  const amount = podRange[1] - podRange[0];
  const amountToSell = TokenValue.fromHuman(amount || 0, PODS.decimals);

  const ordersToFill = useMemo(() => {
    const [rangeStart, rangeEnd] = podRange;

    return orderPositions
      .filter((pos) => {
        return pos.endPos > rangeStart && pos.startPos < rangeEnd;
      })
      .map((pos) => {
        const overlapStart = Math.max(pos.startPos, rangeStart);
        const overlapEnd = Math.min(pos.endPos, rangeEnd);
        const fillAmount = overlapEnd - overlapStart;

        return {
          order: pos.order,
          amount: fillAmount,
        };
      });
  }, [orderPositions, podRange]);

  // Calculate weighted average price per pod once for reuse
  const weightedAvgPricePerPod = useMemo(() => {
    if (ordersToFill.length === 0 || amount === 0) return 0;

    let totalValue = 0;
    let totalPods = 0;

    ordersToFill.forEach(({ order, amount: fillAmount }) => {
      const orderPricePerPod = TokenValue.fromBlockchain(order.pricePerPod, mainToken.decimals).toNumber();
      totalValue += orderPricePerPod * fillAmount;
      totalPods += fillAmount;
    });

    return totalPods > 0 ? totalValue / totalPods : 0;
  }, [ordersToFill, amount, mainToken.decimals]);

  const eligibleOrders = useMemo(() => {
    if (!allOrders?.podOrders) return [];

    return allOrders.podOrders.filter((order) => isOrderEligible(order, mainToken.decimals, podLine));
  }, [allOrders?.podOrders, mainToken.decimals, podLine]);

  useEffect(() => {
    if (totalCapacity !== prevTotalCapacityRef.current) {
      setPodRange([0, totalCapacity]);
      prevTotalCapacityRef.current = totalCapacity;
    }
  }, [totalCapacity]);

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
    setPlot([]);
    setPodRange([0, 0]);
    setSelectedOrderIds([]);
    allQK.forEach((key) => queryClient.invalidateQueries({ queryKey: key }));
  }, [queryClient, allQK]);

  const { isConfirming, writeWithEstimateGas, submitting, setSubmitting } = useTransaction({
    successMessage: "Order Fill successful",
    errorMessage: "Order Fill failed",
    successCallback: onSuccess,
  });

  const onSubmit = useCallback(() => {
    if (!order || !plot[0]) {
      return;
    }

    trackSimpleEvent(ANALYTICS_EVENTS.MARKET.POD_ORDER_FILL, {
      order_price_per_pod: Number(order.pricePerPod),
      order_max_place: Number(order.maxPlaceInLine),
    });

    try {
      setSubmitting(true);
      toast.loading("Filling Order...");
      writeWithEstimateGas({
        address: diamondAddress,
        abi: beanstalkAbi,
        functionName: "fillPodOrder",
        args: [
          {
            orderer: order.farmer.id as Address,
            fieldId: FIELD_ID,
            maxPlaceInLine: BigInt(order.maxPlaceInLine),
            pricePerPod: Number(order.pricePerPod),
            minFillAmount: BigInt(order.minFillAmount),
          },
          plot[0].index.toBigInt(),
          START_INDEX_WITHIN_PLOT,
          amountToSell.toBigInt(),
          Number(FarmToMode.INTERNAL),
        ],
      });
    } catch (e) {
      console.error(e);
      toast.dismiss();
      toast.error("Order Fill Failed");
      throw e;
    } finally {
      setSubmitting(false);
    }
  }, [order, plot, amountToSell, writeWithEstimateGas, setSubmitting, diamondAddress]);

  const isOwnOrder = order && order.farmer.id === account.address?.toLowerCase();

  if (eligibleOrders.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3">
          <p className="pinto-body text-pinto-light">Select the order you want to fill (i):</p>
          <PodLineGraph plots={[]} selectedPlotIndices={[]} className="" />
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
          selectedPlotIndices={ordersToFill.map((item) => item.order.id)}
          onPlotGroupSelect={(plotIndices) => {
            // Multi-select toggle: add or remove clicked order
            if (plotIndices.length > 0) {
              const clickedOrderId = plotIndices[0];

              setSelectedOrderIds((prev) => {
                // If already selected, remove it
                if (prev.includes(clickedOrderId)) {
                  return prev.filter((id) => id !== clickedOrderId);
                }
                // Otherwise, add it to selection
                return [...prev, clickedOrderId];
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
      {isOwnOrder && order && (
        <>
          <Separator />
          <CancelOrder order={order} />
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
                    <p className="pinto-body text-pinto-light">
                      {ordersToFill.length > 1 ? "Weighted Avg Price/Pod" : "Price/Pod"}
                    </p>
                    <div className="flex items-center">
                      <p className="pinto-body text-pinto-primary">
                        {formatter.number(weightedAvgPricePerPod, { minDecimals: 2, maxDecimals: 6 })} Pinto
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* OLD DESTINATION SECTION - COMMENTED OUT FOR POTENTIAL FUTURE USE */}
              {/* <div className="flex flex-col gap-2">
                <p className="pinto-body text-pinto-light">Destination</p>
                <DestinationBalanceSelect setBalanceTo={setBalanceTo} balanceTo={balanceTo} />
        </div> */}

              <div className="flex flex-col gap-4">
                <Separator />
                {ordersToFill.length > 0 && amount > 0 && (
                  <ActionSummary podAmount={amount} pricePerPod={weightedAvgPricePerPod} />
                )}
                <SmartSubmitButton
                  variant="gradient"
                  size="xxl"
                  submitButtonText={`Fill ${ordersToFill.length} Pod Order${ordersToFill.length !== 1 ? "s" : ""}`}
                  disabled={ordersToFill.length === 0 || !amount || isConfirming || submitting}
                  submitFunction={onSubmit}
                />
              </div>
            </>
          );
        })()}
    </div>
  );
}

const ActionSummary = ({ podAmount, pricePerPod }: { podAmount: number; pricePerPod: number }) => {
  const beansOut = podAmount * pricePerPod;

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
