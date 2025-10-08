import podIcon from "@/assets/protocol/Pod.png";
import pintoIcon from "@/assets/tokens/PINTO.png";
import { TV, TokenValue } from "@/classes/TokenValue";
import ComboPlotInputField from "@/components/ComboPlotInputField";
import DestinationBalanceSelect from "@/components/DestinationBalanceSelect";
import SmartSubmitButton from "@/components/SmartSubmitButton";
import { Separator } from "@/components/ui/Separator";
import { ANALYTICS_EVENTS } from "@/constants/analytics-events";
import { PODS } from "@/constants/internalTokens";
import { beanstalkAbi } from "@/generated/contractHooks";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import useTransaction from "@/hooks/useTransaction";
import usePodOrders from "@/state/market/usePodOrders";
import { useFarmerBalances } from "@/state/useFarmerBalances";
import { useFarmerPlotsQuery } from "@/state/useFarmerField";
import { useHarvestableIndex } from "@/state/useFieldData";
import { useQueryKeys } from "@/state/useQueryKeys";
import useTokenData from "@/state/useTokenData";
import { trackSimpleEvent } from "@/utils/analytics";
import { formatter } from "@/utils/format";
import { FarmToMode, Plot } from "@/utils/types";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { Address } from "viem";
import { useAccount } from "wagmi";
import CancelOrder from "./CancelOrder";

export default function FillOrder() {
  const mainToken = useTokenData().mainToken;
  const diamondAddress = useProtocolAddress();
  const { queryKeys: balanceQKs } = useFarmerBalances();
  const account = useAccount();

  const queryClient = useQueryClient();
  const { allPodOrders, allMarket, farmerMarket, farmerField } = useQueryKeys({
    account: account.address,
  });
  const { queryKey: farmerPlotsQK } = useFarmerPlotsQuery();
  const allQK = useMemo(
    () => [allPodOrders, allMarket, farmerMarket, farmerField, farmerPlotsQK, ...balanceQKs],
    [allPodOrders, allMarket, farmerMarket, farmerField, farmerPlotsQK, balanceQKs],
  );

  const [plot, setPlot] = useState<Plot[]>([]);
  // TODO: need to handle an edge case with amount where the first half of the plot is sellable, and the second half is not.
  // Currently this is handled my making such a plot not fillable via ComboPlotInputField.
  const [amount, setAmount] = useState(0);
  const [balanceTo, setBalanceTo] = useState(FarmToMode.INTERNAL);

  const { id } = useParams();
  const podOrders = usePodOrders();
  const allOrders = podOrders.data;
  const order = allOrders?.podOrders.find((order) => order.id === id);

  const amountOrder = TokenValue.fromBlockchain(order?.beanAmount || 0, mainToken.decimals);
  const amountFilled = TokenValue.fromBlockchain(order?.beanAmountFilled || 0, mainToken.decimals);
  const pricePerPod = TokenValue.fromBlockchain(order?.pricePerPod || 0, mainToken.decimals);
  const minFillAmount = TokenValue.fromBlockchain(order?.minFillAmount || 0, PODS.decimals);
  const remainingBeans = amountOrder.sub(amountFilled);
  // biome-ignore lint/correctness/useExhaustiveDependencies: All are derived from `order`
  const { remainingPods, maxPlaceInLine } = useMemo(() => {
    return {
      remainingPods: pricePerPod.gt(0) ? remainingBeans.div(pricePerPod) : TokenValue.ZERO,
      maxPlaceInLine: TokenValue.fromBlockchain(order?.maxPlaceInLine || 0, PODS.decimals),
    };
  }, [order]);

  const harvestableIndex = useHarvestableIndex();
  const amountToSell = TokenValue.fromHuman(amount || 0, PODS.decimals);
  const plotPosition = plot.length > 0 ? plot[0].index.sub(harvestableIndex) : TV.ZERO;

  // Plot selection handler with tracking
  const handlePlotSelection = useCallback(
    (plots: Plot[]) => {
      trackSimpleEvent(ANALYTICS_EVENTS.MARKET.LISTING_PLOT_SELECTED, {
        plot_count: plots.length,
        previous_count: plot.length,
        fill_action: "order",
      });
      setPlot(plots);
    },
    [plot.length],
  );

  // reset form and invalidate pod orders/farmer plot queries
  const onSuccess = useCallback(() => {
    setPlot([]);
    setAmount(0);
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

    // Track pod order fill
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
            orderer: order.farmer.id as Address, // order - account
            fieldId: 0n, // plot - fieldId
            maxPlaceInLine: BigInt(order.maxPlaceInLine), // order - maxPlaceInLine
            pricePerPod: Number(order.pricePerPod), // order - pricePerPod
            minFillAmount: BigInt(order.minFillAmount), // order - minFillAmount
          },
          plot[0].index.toBigInt(), // index of plot to sell
          0n, // start index within plot
          amountToSell.toBigInt(), // amount of pods to sell
          Number(balanceTo), //destination balance
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
  }, [order, plot, amountToSell, balanceTo, writeWithEstimateGas, setSubmitting, diamondAddress]);

  const isOwnOrder = order && order?.farmer.id === account.address?.toLowerCase();
  const disabled = !order || !plot[0] || !amount;

  return (
    <div>
      {!order ? (
        <div className="flex justify-center mt-4 pinto-sm-light text-pinto-gray-5">
          Select an Order on the panel to the left
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="space-y-1">
            <div className="flex flex-row justify-between">
              <p className="pinto-body text-pinto-light">Buyer</p>
              <p className="pinto-body text-pinto-primary">{order.farmer.id.substring(0, 6)}</p>
            </div>
            <div className="flex flex-row justify-between">
              <p className="pinto-body text-pinto-light">Place in Line</p>
              <p className="pinto-body text-pinto-primary">0 - {maxPlaceInLine.toHuman("short")}</p>
            </div>
            <div className="flex flex-row justify-between">
              <p className="pinto-body text-pinto-light">Pods Requested</p>
              <div className="flex items-center">
                <img src={podIcon} className="w-4 h-4 scale-110 mr-[6px]" alt={"pod icon"} />
                <p className="pinto-body text-pinto-primary">{remainingPods.toHuman("short")}</p>
              </div>
            </div>
            <div className="flex flex-row justify-between">
              <p className="pinto-body text-pinto-light">Price per Pod</p>
              <div className="flex items-center">
                <img src={pintoIcon} className="w-4 h-4 scale-110 mr-[6px]" alt={"pinto icon"} />
                <p className="pinto-body text-pinto-primary">{pricePerPod.toHuman("short")}</p>
              </div>
            </div>
            <div className="flex flex-row justify-between">
              <p className="pinto-body text-pinto-light">Pinto Remaining</p>
              <div className="flex items-center">
                <img src={pintoIcon} className="w-4 h-4 scale-110 mr-[6px]" alt={"pinto icon"} />
                <p className="pinto-body text-pinto-primary">{remainingBeans.toHuman("short")}</p>
              </div>
            </div>
          </div>
          <Separator />
          {isOwnOrder ? (
            <CancelOrder order={order} />
          ) : (
            <>
              <div className="flex flex-col gap-2">
                <p className="pinto-body text-pinto-light">Select Plot</p>
                <ComboPlotInputField
                  amount={amount}
                  minAmount={minFillAmount}
                  maxAmount={remainingPods}
                  maxPlaceInLine={maxPlaceInLine}
                  selectedPlots={plot}
                  setAmount={setAmount}
                  setPlots={handlePlotSelection}
                  type="single"
                />
              </div>
              <div className="flex flex-col gap-2">
                <p className="pinto-body text-pinto-light">Destination</p>
                <DestinationBalanceSelect setBalanceTo={setBalanceTo} balanceTo={balanceTo} />
              </div>
              <div className="flex flex-col gap-4">
                <Separator />
                {!disabled && (
                  <ActionSummary podAmount={amountToSell} plotPosition={plotPosition} pricePerPod={pricePerPod} />
                )}
                <SmartSubmitButton
                  variant="gradient"
                  size="xxl"
                  submitButtonText="Sell Pods"
                  disabled={disabled || isConfirming || submitting}
                  submitFunction={onSubmit}
                />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

const ActionSummary = ({
  podAmount,
  plotPosition,
  pricePerPod,
}: { podAmount: TV; plotPosition: TV; pricePerPod: TV }) => {
  const beansOut = podAmount.mul(pricePerPod);

  return (
    <div className="flex flex-col gap-4">
      <p className="pinto-body text-pinto-light">
        In exchange for {formatter.noDec(podAmount)} Pods @ {plotPosition.toHuman("short")} in Line, I will receive
      </p>
      <div className="flex flex-col gap-2">
        <p className="pinto-h3 flex flex-row items-center gap-2 -mt-1">
          <img src={pintoIcon} className="w-8 h-8" alt={"order summary pinto"} />
          {formatter.number(beansOut, { minDecimals: 0, maxDecimals: 2 })} Pinto
        </p>
      </div>
    </div>
  );
};
