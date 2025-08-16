import pintoIcon from "@/assets/tokens/PINTO.png";
import { TV, TokenValue } from "@/classes/TokenValue";
import FarmBalanceToggle from "@/components/FarmBalanceToggle";
import SmartSubmitButton from "@/components/SmartSubmitButton";
import { Separator } from "@/components/ui/Separator";
import { PODS } from "@/constants/internalTokens";
import { beanstalkAbi } from "@/generated/contractHooks";
import { AllPodOrdersQuery } from "@/generated/gql/pintostalk/graphql";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { useFarmTogglePreference } from "@/hooks/useFarmTogglePreference";
import useTransaction from "@/hooks/useTransaction";
import { useFarmerBalances } from "@/state/useFarmerBalances";
import { useQueryKeys } from "@/state/useQueryKeys";
import useTokenData from "@/state/useTokenData";
import { formatter } from "@/utils/format";
import { FarmToMode } from "@/utils/types";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAccount } from "wagmi";

export interface CancelOrderProps {
  order: AllPodOrdersQuery["podOrders"][number];
}

export default function CancelOrder({ order }: CancelOrderProps) {
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

  const onSuccess = useCallback(() => {
    navigate(`/market/pods/sell`);
    allQK.forEach((key) => queryClient.invalidateQueries({ queryKey: key }));
  }, [navigate, queryClient, allQK]);

  const { writeWithEstimateGas, submitting, isConfirming, setSubmitting } = useTransaction({
    successMessage: "Cancel Order successful",
    errorMessage: "Cancel Order failed",
    successCallback: onSuccess,
  });

  const amountOrder = TokenValue.fromBlockchain(order?.beanAmount || 0, mainToken.decimals);
  const amountFilled = TokenValue.fromBlockchain(order?.beanAmountFilled || 0, mainToken.decimals);
  const remainingBeans = amountOrder.sub(amountFilled);

  const onSubmit = useCallback(() => {
    const maxPlaceInLine = TokenValue.fromBlockchain(order.maxPlaceInLine.toString(), PODS.decimals);
    const pricePerPod = TokenValue.fromBlockchain(order.pricePerPod.toString(), mainToken.decimals);
    const minFillAmount = TokenValue.fromBlockchain(order.minFillAmount.toString(), PODS.decimals);
    try {
      setSubmitting(true);
      toast.loading("Cancelling Order...");
      return writeWithEstimateGas({
        address: diamondAddress,
        abi: beanstalkAbi,
        functionName: "cancelPodOrder",
        args: [
          {
            orderer: account.address, // account
            fieldId: 0n, // fieldId
            pricePerPod, // pricePerPod
            maxPlaceInLine, // maxPlaceInLine
            minFillAmount, // minFillAmount
          },
          Number(mode), // mode
        ],
      });
    } catch (e) {
      console.error(e);
      toast.dismiss();
      toast.error("Cancel Order Failed");
      throw e;
    } finally {
      setSubmitting(false);
    }
  }, [order, diamondAddress, account, toFarm, mainToken, setSubmitting, writeWithEstimateGas]);

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
        submitButtonText="Cancel Order"
        submitFunction={onSubmit}
        disabled={submitting || isConfirming}
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
