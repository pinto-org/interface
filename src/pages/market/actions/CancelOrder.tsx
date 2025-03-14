import { TokenValue, TV } from "@/classes/TokenValue";
import DestinationBalanceSelect from "@/components/DestinationBalanceSelect";
import SmartSubmitButton from "@/components/SmartSubmitButton";
import Text from "@/components/ui/Text";
import { PODS } from "@/constants/internalTokens";
import { beanstalkAbi } from "@/generated/contractHooks";
import { AllPodOrdersQuery } from "@/generated/gql/graphql";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import useTransaction from "@/hooks/useTransaction";
import { useFarmerBalances } from "@/state/useFarmerBalances";
import { useQueryKeys } from "@/state/useQueryKeys";
import useTokenData from "@/state/useTokenData";
import { FarmToMode } from "@/utils/types";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAccount } from "wagmi";
import pintoIcon from "@/assets/tokens/PINTO.png";
import { formatter } from "@/utils/format";
import { Separator } from "@/components/ui/Separator";

export interface CancelOrderProps {
  order: AllPodOrdersQuery["podOrders"][number];
}

export default function CancelOrder({ order }: CancelOrderProps) {
  const mainToken = useTokenData().mainToken;
  const diamondAddress = useProtocolAddress();
  const { queryKeys: balanceQKs } = useFarmerBalances();
  const account = useAccount();
  const navigate = useNavigate();

  const [balanceTo, setBalanceTo] = useState(FarmToMode.INTERNAL);

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
          Number(balanceTo), // mode
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
  }, [order, diamondAddress, account, balanceTo, mainToken, setSubmitting, writeWithEstimateGas]);

  return (
    <>
      <p className="pinto-body text-pinto-light">Destination</p>
      <DestinationBalanceSelect setBalanceTo={setBalanceTo} balanceTo={balanceTo} />
      <Separator />
      <ActionSummary beansOut={remainingBeans} balanceTo={balanceTo} />
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

const ActionSummary = ({ beansOut, balanceTo }: { beansOut: TV; balanceTo: FarmToMode }) => {
  return (
    <div className="flex flex-col gap-4">
      <p className="pinto-body text-pinto-light">I will receive</p>
      <div className="flex flex-col gap-2">
        <p className="pinto-h3 flex flex-row items-center gap-2 -mt-1">
          <img src={pintoIcon} className="w-8 h-8" alt={"order summary pinto"} />
          {formatter.number(beansOut, { minDecimals: 0, maxDecimals: 2 })} Pinto
        </p>
        <p className="pinto-body text-pinto-light">
          to my {balanceTo === FarmToMode.EXTERNAL ? "Wallet" : "Farm"} balance
        </p>
      </div>
    </div>
  );
};
