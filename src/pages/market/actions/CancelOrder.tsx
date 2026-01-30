import pintoIcon from "@/assets/tokens/PINTO.png";
import { TV, TokenValue } from "@/classes/TokenValue";
import FarmBalanceToggle from "@/components/FarmBalanceToggle";
import SmartSubmitButton from "@/components/SmartSubmitButton";
import { Separator } from "@/components/ui/Separator";
import { ANALYTICS_EVENTS } from "@/constants/analytics-events";
import { PODS } from "@/constants/internalTokens";
import { beanstalkAbi } from "@/generated/contractHooks";
import { MyPodOrdersQuery } from "@/generated/gql/pintostalk/graphql";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { useFarmTogglePreference } from "@/hooks/useFarmTogglePreference";
import useTransaction from "@/hooks/useTransaction";
import { useFarmerBalances } from "@/state/useFarmerBalances";
import { useQueryKeys } from "@/state/useQueryKeys";
import useTokenData from "@/state/useTokenData";
import { trackSimpleEvent } from "@/utils/analytics";
import { formatter } from "@/utils/format";
import { FarmToMode } from "@/utils/types";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAccount } from "wagmi";

export type MarketplacePodOrder = MyPodOrdersQuery["podOrders"][number];

export interface CancelOrderProps {
  /** Array of orders available for cancellation */
  orders: MarketplacePodOrder[];
}

export default function CancelOrder({ orders }: CancelOrderProps) {
  const mainToken = useTokenData().mainToken;
  const diamondAddress = useProtocolAddress();
  const { queryKeys: balanceQKs } = useFarmerBalances();
  const account = useAccount();
  const navigate = useNavigate();

  const [mode, toFarm, setMode] = useFarmTogglePreference();

  const queryClient = useQueryClient();
  const { allPodOrders, allMarket, farmerMarket } = useQueryKeys({
    account: account.address,
  });
  const allQK = useMemo(
    () => [allPodOrders, allMarket, farmerMarket, ...balanceQKs],
    [allPodOrders, allMarket, farmerMarket, balanceQKs],
  );

  const cancelCount = orders.length;
  const isBatch = cancelCount > 1;

  const onSuccess = useCallback(() => {
    navigate(`/market/pods/sell`);
    allQK.forEach((key) => queryClient.invalidateQueries({ queryKey: key }));
  }, [navigate, queryClient, allQK]);

  const { writeWithEstimateGas, submitting, isConfirming, setSubmitting } = useTransaction({
    successMessage: isBatch ? `Cancelled ${cancelCount} Orders` : "Cancel Order successful",
    errorMessage: isBatch ? "Batch Cancel Orders failed" : "Cancel Order failed",
    successCallback: onSuccess,
  });

  // Calculate aggregate remaining beans across all orders
  const remainingBeans = useMemo(() => {
    let total = TokenValue.fromBlockchain(0, mainToken.decimals);
    for (const order of orders) {
      const amountOrder = TokenValue.fromBlockchain(order?.beanAmount || 0, mainToken.decimals);
      const amountFilled = TokenValue.fromBlockchain(order?.beanAmountFilled || 0, mainToken.decimals);
      total = total.add(amountOrder.sub(amountFilled));
    }
    return total;
  }, [orders, mainToken.decimals]);

  const onSubmit = useCallback(() => {
    if (cancelCount === 0) return;

    try {
      setSubmitting(true);
      toast.loading(isBatch ? `Cancelling ${cancelCount} Orders...` : "Cancelling Order...");

      trackSimpleEvent(ANALYTICS_EVENTS.MARKET.POD_ORDER_CANCEL, {
        order_count: cancelCount,
        is_batch: isBatch,
        destination_mode: mode === FarmToMode.INTERNAL ? "farm" : "wallet",
      });

      // Single order: use original cancelPodOrder function
      if (!isBatch) {
        const order = orders[0];
        const maxPlaceInLine = TokenValue.fromBlockchain(order.maxPlaceInLine.toString(), PODS.decimals);
        const pricePerPod = TokenValue.fromBlockchain(order.pricePerPod.toString(), mainToken.decimals);
        const minFillAmount = TokenValue.fromBlockchain(order.minFillAmount.toString(), PODS.decimals);
        return writeWithEstimateGas({
          address: diamondAddress,
          abi: beanstalkAbi,
          functionName: "cancelPodOrder",
          args: [
            {
              orderer: account.address,
              fieldId: 0n,
              pricePerPod,
              maxPlaceInLine,
              minFillAmount,
            },
            Number(mode),
          ],
        });
      }

      // Multiple orders: use batchCancelPodOrder
      const batchArgs = orders.map((order) => ({
        orderer: account.address,
        fieldId: 0n,
        pricePerPod: TokenValue.fromBlockchain(order.pricePerPod.toString(), mainToken.decimals),
        maxPlaceInLine: TokenValue.fromBlockchain(order.maxPlaceInLine.toString(), PODS.decimals),
        minFillAmount: TokenValue.fromBlockchain(order.minFillAmount.toString(), PODS.decimals),
      }));

      return writeWithEstimateGas({
        address: diamondAddress,
        abi: beanstalkAbi,
        functionName: "batchCancelPodOrder",
        args: [batchArgs, Number(mode)],
      });
    } catch (e) {
      console.error(e);
      toast.dismiss();
      toast.error(isBatch ? "Batch Cancel Orders Failed" : "Cancel Order Failed");
      throw e;
    } finally {
      setSubmitting(false);
    }
  }, [cancelCount, isBatch, orders, diamondAddress, account, mode, mainToken, setSubmitting, writeWithEstimateGas]);

  const buttonText =
    cancelCount === 0 ? "No Orders to Cancel" : cancelCount > 1 ? `Cancel ${cancelCount} Orders` : "Cancel Order";

  return (
    <>
      <FarmBalanceToggle
        checked={toFarm}
        onCheckedChange={(checked) => setMode(checked ? FarmToMode.INTERNAL : FarmToMode.EXTERNAL)}
        label="Return Pinto to Farm Wallet"
      />
      <Separator />
      <ActionSummary beansOut={remainingBeans} toFarm={toFarm} />
      <SmartSubmitButton
        variant="gradient"
        size="xxl"
        submitButtonText={buttonText}
        submitFunction={onSubmit}
        disabled={submitting || isConfirming || cancelCount === 0}
      />
    </>
  );
}

const ActionSummary = ({ beansOut, toFarm }: { beansOut: TV; toFarm: boolean }) => {
  return (
    <div className="flex flex-col gap-4">
      <p className="pinto-body text-pinto-light">I will receive</p>
      <div className="flex flex-col gap-2">
        <p className="pinto-h3 flex flex-row items-center gap-2 -mt-1">
          <img src={pintoIcon} className="w-8 h-8" alt={"order summary pinto"} />
          {formatter.number(beansOut, { minDecimals: 0, maxDecimals: 2 })} Pinto
        </p>
        <p className="pinto-body text-pinto-light">to my {toFarm ? "Farm" : "Wallet"} balance</p>
      </div>
    </div>
  );
};
