import pintoIcon from "@/assets/tokens/PINTO.png";
import { TV, TokenValue } from "@/classes/TokenValue";
import ComboPlotInputField from "@/components/ComboPlotInputField";
import DestinationBalanceSelect from "@/components/DestinationBalanceSelect";
import SimpleInputField from "@/components/SimpleInputField";
import SmartSubmitButton from "@/components/SmartSubmitButton";
import { Separator } from "@/components/ui/Separator";
import { ANALYTICS_EVENTS } from "@/constants/analytics-events";
import { PODS } from "@/constants/internalTokens";
import { beanstalkAbi } from "@/generated/contractHooks";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import useTransaction from "@/hooks/useTransaction";
import { useFarmerField } from "@/state/useFarmerField";
import { useHarvestableIndex, usePodIndex } from "@/state/useFieldData";
import { useQueryKeys } from "@/state/useQueryKeys";
import useTokenData from "@/state/useTokenData";
import { trackSimpleEvent } from "@/utils/analytics";
import { formatter } from "@/utils/format";
import { FarmToMode, Plot } from "@/utils/types";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAccount } from "wagmi";

interface LocationState {
  prefillPrice?: number;
  prefillPlaceInLine?: number;
  prefillExpiresIn?: number;
}

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
  const location = useLocation();

  const queryClient = useQueryClient();
  const { allPodListings, allMarket, farmerMarket } = useQueryKeys({ account, harvestableIndex });
  const allQK = useMemo(() => [allPodListings, allMarket, farmerMarket], [allPodListings, allMarket, farmerMarket]);

  const farmerField = useFarmerField();
  const userPlots = useMemo(() => farmerField?.plots || [], [farmerField?.plots]);

  const [plot, setPlot] = useState<Plot[]>([]);
  const [amount, setAmount] = useState(0);
  const [expiresIn, setExpiresIn] = useState<number | undefined>(undefined);
  const [pricePerPod, setPricePerPod] = useState<number | undefined>(undefined);
  const [balanceTo, setBalanceTo] = useState(FarmToMode.INTERNAL); // Default to Internal (Farm balance)

  // Parse location state for prefill values from context menu
  const locationState = location.state as LocationState | undefined;
  const prefillPrice = locationState?.prefillPrice;
  const prefillExpiresIn = locationState?.prefillExpiresIn;

  const podIndex = usePodIndex();
  const maxExpiration = Number.parseInt(podIndex.toHuman()) - Number.parseInt(harvestableIndex.toHuman()) || 0;
  const minFill = TokenValue.fromHuman(1, PODS.decimals);

  const plotPosition = plot.length > 0 ? plot[0].index.sub(harvestableIndex) : TV.ZERO;

  // Helper: Find nearest plot within 10% tolerance
  const findNearestPlot = useCallback(
    (placeInLine: number): Plot | null => {
      if (userPlots.length === 0) return null;

      const targetPosition = placeInLine * 1_000_000; // Convert millions to actual
      let nearestPlot: Plot | null = null;
      let minDistance = Infinity;

      for (const p of userPlots) {
        const plotPos = Number(p.index.sub(harvestableIndex).toBigInt());
        const distance = Math.abs(plotPos - targetPosition);
        const tolerance = targetPosition * 0.1; // 10% tolerance

        if (distance <= tolerance && distance < minDistance) {
          minDistance = distance;
          nearestPlot = p;
        }
      }

      return nearestPlot;
    },
    [userPlots, harvestableIndex],
  );

  // Prefill from context menu click - always update when new values arrive
  useEffect(() => {
    // Exit early if no prefill values exist
    if (!prefillPrice && !prefillExpiresIn) return;

    let newPricePerPod: number | undefined;
    let newExpiresIn: number | undefined;
    let newPlot: Plot | null = null;

    // Calculate price per pod
    if (
      prefillPrice &&
      prefillPrice >= pricePerPodValidation.minValue &&
      prefillPrice <= pricePerPodValidation.maxValue
    ) {
      // Format to 6 decimals for display
      newPricePerPod = Number(prefillPrice.toFixed(6));
    }

    // Find nearest plot within 10% tolerance (only if prefillExpiresIn exists)
    if (prefillExpiresIn && prefillExpiresIn > 0) {
      newPlot = findNearestPlot(prefillExpiresIn);

      // If plot found, set expires in to pod line length (no expiration)
      if (newPlot) {
        const podLineLength = Number(newPlot.index.sub(harvestableIndex).toBigInt());
        // Expires in should be maxExpiration to never expire
        newExpiresIn = maxExpiration;
      }
    }

    // Set all states together (override existing values)
    if (newPricePerPod !== undefined) {
      setPricePerPod(newPricePerPod);
    }
    if (newPlot) {
      setPlot([newPlot]);
    }
    if (newExpiresIn !== undefined) {
      setExpiresIn(newExpiresIn);
    }
    // Always set to External (Wallet Balance) when coming from context menu
    setBalanceTo(FarmToMode.EXTERNAL);

    // Clean up location state immediately
    if (newPricePerPod !== undefined || newPlot !== null || newExpiresIn !== undefined) {
      navigate(location.pathname, { replace: true, state: undefined });
    }
  }, [prefillPrice, prefillExpiresIn, maxExpiration, findNearestPlot, harvestableIndex, navigate, location.pathname]);

  const maxExpirationValidation = useMemo(
    () => ({
      minValue: 1,
      maxValue: maxExpiration,
      maxDecimals: 0,
    }),
    [maxExpiration],
  );

  // Plot selection handler with tracking
  const handlePlotSelection = useCallback(
    (plots: Plot[]) => {
      trackSimpleEvent(ANALYTICS_EVENTS.MARKET.LISTING_PLOT_SELECTED, {
        plot_count: plots.length,
        previous_count: plot.length,
      });
      setPlot(plots);
    },
    [plot.length],
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

    // Track pod listing creation
    trackSimpleEvent(ANALYTICS_EVENTS.MARKET.POD_LIST_CREATE, {
      has_price_per_pod: !!pricePerPod,
      plot_position_millions: plot.length > 0 ? Math.round(plotPosition.div(1_000_000).toNumber()) : 0,
    });

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
          setPlots={handlePlotSelection}
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
