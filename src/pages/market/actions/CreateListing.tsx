import { TokenValue, TV } from "@/classes/TokenValue";
import ComboPlotInputField from "@/components/ComboPlotInputField";
import DestinationBalanceSelect from "@/components/DestinationBalanceSelect";
import SimpleInputField from "@/components/SimpleInputField";
import { PODS } from "@/constants/internalTokens";
import { beanstalkAbi } from "@/generated/contractHooks";
import { useHarvestableIndex, usePodIndex } from "@/state/useFieldData";
import useTokenData from "@/state/useTokenData";
import { FarmToMode, Plot } from "@/utils/types";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useAccount } from "wagmi";
import Text from "@/components/ui/Text";
import { formatter } from "@/utils/format";
import SmartSubmitButton from "@/components/SmartSubmitButton";
import useTransaction from "@/hooks/useTransaction";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { Separator } from "@/components/ui/Separator";
import pintoIcon from "@/assets/tokens/PINTO.png";
import { useQueryKeys } from "@/state/useQueryKeys";
import { useNavigate } from "react-router-dom";

const pricePerPodValidation = {
  maxValue: 1,
  minValue: 0.000001,
  maxDecimals: 6,
};

export default function CreateListing() {
  const { address: account } = useAccount();
  const diamondAddress = useProtocolAddress();
  const mainToken = useTokenData().mainToken;
  const harvestableIndex = useHarvestableIndex();
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const { allPodListings, allMarket, farmerMarket } = useQueryKeys({ account, harvestableIndex });
  const allQK = useMemo(() => [allPodListings, allMarket, farmerMarket], [allPodListings, allMarket, farmerMarket]);

  const [plot, setPlot] = useState<Plot[]>([]);
  const [amount, setAmount] = useState(0);
  const [expiresIn, setExpiresIn] = useState<number | undefined>(undefined);
  const [pricePerPod, setPricePerPod] = useState<number | undefined>(undefined);
  const [balanceTo, setBalanceTo] = useState(FarmToMode.INTERNAL);
  const podIndex = usePodIndex();
  const maxExpiration = Number.parseInt(podIndex.toHuman()) - Number.parseInt(harvestableIndex.toHuman()) || 0;
  const minFill = TokenValue.fromHuman(1, PODS.decimals);

  const plotPosition = plot.length > 0 ? plot[0].index.sub(harvestableIndex) : TV.ZERO;

  const maxExpirationValidation = useMemo(
    () => ({
      minValue: 1,
      maxValue: maxExpiration,
      maxDecimals: 0,
    }),
    [maxExpiration],
  );

  // reset form and invalidate pod listing query
  const onSuccess = useCallback(() => {
    navigate(`/market/pods/buy/${plot[0].index.toBigInt()}`);
    setPlot([]);
    setAmount(0);
    setExpiresIn(undefined);
    setPricePerPod(undefined);
    allQK.forEach((key) => queryClient.invalidateQueries({ queryKey: key }));
  }, [navigate, plot, queryClient, allQK]);

  // state for toast txns
  const { isConfirming, writeWithEstimateGas, submitting, setSubmitting } = useTransaction({
    successMessage: "Plot Listing successful",
    errorMessage: "Plot Listing failed",
    successCallback: onSuccess,
  });

  const onSubmit = useCallback(async () => {
    if (!pricePerPod || pricePerPod <= 0 || !expiresIn || !amount || amount <= 0 || !account || plot.length !== 1) {
      return;
    }

    const _pricePerPod = TokenValue.fromHuman(pricePerPod, mainToken.decimals);
    const _expiresIn = TokenValue.fromHuman(expiresIn, PODS.decimals);
    const index = plot[0].index;
    const start = TokenValue.fromHuman(0, PODS.decimals);
    const _amount = TokenValue.fromHuman(amount, PODS.decimals);
    const maxHarvestableIndex = _expiresIn.add(harvestableIndex);
    try {
      setSubmitting(true);
      toast.loading("Creating Listing...");
      writeWithEstimateGas({
        address: diamondAddress,
        abi: beanstalkAbi,
        functionName: "createPodListing",
        args: [
          {
            lister: account,
            fieldId: 0n,
            index: index.toBigInt(),
            start: start.toBigInt(),
            podAmount: _amount.toBigInt(),
            pricePerPod: Number(_pricePerPod),
            maxHarvestableIndex: maxHarvestableIndex.toBigInt(),
            minFillAmount: minFill.toBigInt(),
            mode: Number(balanceTo),
          },
        ],
      });
    } catch (e: unknown) {
      console.error(e);
      toast.dismiss();
      toast.error("Create Listing Failed");
      throw e;
    } finally {
      setSubmitting(false);
    }
  }, [
    account,
    amount,
    pricePerPod,
    expiresIn,
    balanceTo,
    harvestableIndex,
    minFill,
    plot,
    setSubmitting,
    mainToken.decimals,
    diamondAddress,
    writeWithEstimateGas,
  ]);

  // ui state
  const disabled = !pricePerPod || !expiresIn || !amount || !account || plot.length !== 1;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <p className="pinto-body text-pinto-light">Select Plot</p>
        <ComboPlotInputField
          amount={amount}
          minAmount={minFill}
          selectedPlots={plot}
          setAmount={setAmount}
          setPlots={setPlot}
          type="single"
        />
      </div>
      <div className="flex flex-col gap-2">
        <p className="pinto-body text-pinto-light">Amount I want for each Pod</p>
        <SimpleInputField
          amount={pricePerPod}
          token={mainToken}
          setAmount={setPricePerPod}
          placeholder="0.75"
          validation={pricePerPodValidation}
        />
      </div>
      <div className="flex flex-col gap-2">
        <p className="pinto-body text-pinto-light">Expires In</p>
        <SimpleInputField
          amount={expiresIn}
          setAmount={setExpiresIn}
          placeholder={formatter.noDec(maxExpiration)}
          validation={maxExpirationValidation}
        />
        {!!expiresIn && (
          <p className="pinto-sm text-pinto-light">
            This listing will automatically expire after {formatter.noDec(expiresIn)} more Pods become Harvestable.
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <p className="pinto-body text-pinto-light">Send proceeds to</p>
        <DestinationBalanceSelect setBalanceTo={setBalanceTo} balanceTo={balanceTo} />
      </div>
      <div className="flex flex-col gap-4">
        <Separator />
        {!disabled && <ActionSummary podAmount={amount} plotPosition={plotPosition} pricePerPod={pricePerPod} />}
        <SmartSubmitButton
          variant="gradient"
          size="xxl"
          submitButtonText="List Pods"
          disabled={disabled || isConfirming || submitting}
          submitFunction={onSubmit}
        />
      </div>
    </div>
  );
}

const ActionSummary = ({
  podAmount,
  plotPosition,
  pricePerPod,
}: { podAmount: number; plotPosition: TV; pricePerPod: number }) => {
  const beansOut = podAmount * pricePerPod;

  return (
    <div className="flex flex-col gap-4">
      <p className="pinto-body text-pinto-light">If my listing is filled, I will receive</p>
      <div className="flex flex-col gap-2">
        <p className="pinto-h3 flex flex-row items-center gap-2 -mt-1">
          <img src={pintoIcon} className="w-8 h-8" alt={"order summary pinto"} />
          {formatter.number(beansOut, { minDecimals: 0, maxDecimals: 2 })} Pinto
        </p>
        <p className="pinto-body text-pinto-light">
          in exchange for {formatter.noDec(podAmount)} Pods @ {plotPosition.toHuman("short")} in Line.
        </p>
      </div>
    </div>
  );
};
