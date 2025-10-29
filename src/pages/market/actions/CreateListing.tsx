import pintoIcon from "@/assets/tokens/PINTO.png";
import { TV, TokenValue } from "@/classes/TokenValue";
import ComboPlotInputField from "@/components/ComboPlotInputField";
import PodLineGraph from "@/components/PodLineGraph";
import SimpleInputField from "@/components/SimpleInputField";
import SmartSubmitButton from "@/components/SmartSubmitButton";
import { Input } from "@/components/ui/Input";
import { Separator } from "@/components/ui/Separator";
import { MultiSlider, Slider } from "@/components/ui/Slider";
import { Switch } from "@/components/ui/Switch";
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
import { cn } from "@/utils/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAccount } from "wagmi";

const PRICE_PER_POD_CONFIG = {
  MAX: 1,
  MIN: 0.000001,
  DECIMALS: 6,
  DECIMAL_MULTIPLIER: 1_000_000, // 10^6 for 6 decimals
} as const;

const TextAdornment = ({ text, className }: { text: string; className?: string }) => {
  return <div className={cn("text-black pinto-sm-light mr-2", className)}>{text}</div>;
};

// Utility function to format and truncate price per pod values
const formatPricePerPod = (value: number): number => {
  return Math.floor(value * PRICE_PER_POD_CONFIG.DECIMAL_MULTIPLIER) / PRICE_PER_POD_CONFIG.DECIMAL_MULTIPLIER;
};

// Utility function to clamp and format price per pod input
const clampAndFormatPrice = (value: number): number => {
  const clamped = Math.max(PRICE_PER_POD_CONFIG.MIN, Math.min(PRICE_PER_POD_CONFIG.MAX, value));
  return formatPricePerPod(clamped);
};

export default function CreateListing() {
  const { address: account } = useAccount();
  const diamondAddress = useProtocolAddress();
  const mainToken = useTokenData().mainToken;
  const harvestableIndex = useHarvestableIndex();
  const navigate = useNavigate();
  const farmerField = useFarmerField();

  const queryClient = useQueryClient();
  const { allPodListings, allMarket, farmerMarket } = useQueryKeys({ account, harvestableIndex });
  const allQK = useMemo(() => [allPodListings, allMarket, farmerMarket], [allPodListings, allMarket, farmerMarket]);

  const [plot, setPlot] = useState<Plot[]>([]);
  const [amount, setAmount] = useState(0);
  const [podRange, setPodRange] = useState<[number, number]>([0, 0]);
  const [pricePerPod, setPricePerPod] = useState<number | undefined>(undefined);
  const [pricePerPodInput, setPricePerPodInput] = useState<string>("");
  const [balanceTo, setBalanceTo] = useState(FarmToMode.EXTERNAL); // Default: Wallet Balance (toggle off)
  const podIndex = usePodIndex();
  const maxExpiration = Number.parseInt(podIndex.toHuman()) - Number.parseInt(harvestableIndex.toHuman()) || 0;
  const expiresIn = maxExpiration; // Auto-set to max expiration
  const minFill = TokenValue.fromHuman(1, PODS.decimals);

  const plotPosition = plot.length > 0 ? plot[0].index.sub(harvestableIndex) : TV.ZERO;

  // Calculate max pods based on selected plots OR all farmer plots
  const maxPodAmount = useMemo(() => {
    const plotsToUse = plot.length > 0 ? plot : farmerField.plots;
    if (plotsToUse.length === 0) return 0;
    return plotsToUse.reduce((sum, p) => sum + p.pods.toNumber(), 0);
  }, [plot, farmerField.plots]);

  // Calculate position range in line
  const positionInfo = useMemo(() => {
    const plotsToUse = plot.length > 0 ? plot : farmerField.plots;
    if (plotsToUse.length === 0) return null;

    const minIndex = plotsToUse.reduce((min, p) => (p.index.lt(min) ? p.index : min), plotsToUse[0].index);
    const maxIndex = plotsToUse.reduce((max, p) => {
      const endIndex = p.index.add(p.pods);
      return endIndex.gt(max) ? endIndex : max;
    }, plotsToUse[0].index);

    return {
      start: minIndex.sub(harvestableIndex),
      end: maxIndex.sub(harvestableIndex),
    };
  }, [plot, farmerField.plots, harvestableIndex]);

  // Plot selection handler with tracking
  const handlePlotSelection = useCallback(
    (plots: Plot[]) => {
      trackSimpleEvent(ANALYTICS_EVENTS.MARKET.LISTING_PLOT_SELECTED, {
        plot_count: plots.length,
        previous_count: plot.length,
      });
      setPlot(plots);

      // Reset range when plots change
      if (plots.length > 0) {
        const totalPods = plots.reduce((sum, p) => sum + p.pods.toNumber(), 0);
        setPodRange([0, totalPods]);
        setAmount(totalPods);
      } else {
        setPodRange([0, 0]);
        setAmount(0);
      }
    },
    [plot.length],
  );

  // Pod range slider handler (two thumbs)
  const handlePodRangeChange = useCallback((value: number[]) => {
    const [min, max] = value;
    setPodRange([min, max]);
    setAmount(max - min);
  }, []);

  // Price per pod slider handler
  const handlePriceSliderChange = useCallback((value: number[]) => {
    const formatted = formatPricePerPod(value[0]);
    setPricePerPod(formatted);
    setPricePerPodInput(formatted.toFixed(PRICE_PER_POD_CONFIG.DECIMALS));
  }, []);

  // Price per pod input handlers
  const handlePriceInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPricePerPodInput(value);
  }, []);

  const handlePriceInputBlur = useCallback(() => {
    const numValue = Number.parseFloat(pricePerPodInput);
    if (!Number.isNaN(numValue)) {
      const formatted = clampAndFormatPrice(numValue);
      setPricePerPod(formatted);
      setPricePerPodInput(formatted.toString());
    } else {
      setPricePerPodInput("");
      setPricePerPod(undefined);
    }
  }, [pricePerPodInput]);

  // reset form and invalidate pod listing query
  const onSuccess = useCallback(() => {
    navigate(`/market/pods/buy/${plot[0].index.toBigInt()}`);
    setPlot([]);
    setAmount(0);
    setPodRange([0, 0]);
    setPricePerPod(undefined);
    setPricePerPodInput("");
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
    plotPosition,
    setSubmitting,
    mainToken.decimals,
    diamondAddress,
    writeWithEstimateGas,
  ]);

  // ui state
  const disabled = !pricePerPod || !amount || !account || plot.length !== 1;

  return (
    <div className="flex flex-col gap-4">
      {/* Plot Selection Section */}
      <div className="flex flex-col gap-3">
        <p className="pinto-body text-pinto-light">Select the Plot(s) you want to List (i):</p>

        {/* Pod Line Graph Visualization */}
        <PodLineGraph
          selectedPlotIndices={plot.map((p) => p.index.toHuman())}
          onPlotGroupSelect={(plotIndices) => {
            // Check if all plots in the group are already selected
            const allSelected = plotIndices.every((index) => plot.some((p) => p.index.toHuman() === index));

            if (allSelected) {
              // Deselect if already selected
              setPlot([]);
            } else {
              // Find and select all plots in the group from farmer plots
              const plotsToSelect = farmerField.plots.filter((p) => plotIndices.includes(p.index.toHuman()));
              if (plotsToSelect.length > 0) {
                handlePlotSelection(plotsToSelect);
              }
            }
          }}
        />

        {/* Position in Line Display (below graph) */}
        {positionInfo && (
          <div className="flex justify-center">
            <p className="pinto-body text-pinto-light">
              {positionInfo.start.toHuman("short")} - {positionInfo.end.toHuman("short")}
            </p>
          </div>
        )}
      </div>

      {/* Total Pods to List Summary */}
      {maxPodAmount > 0 && (
        <div className="flex justify-between items-center p-4 bg-pinto-gray-1 rounded-lg">
          <p className="pinto-body text-pinto-light">Total Pods to List:</p>
          <p className="pinto-body font-semibold">{formatter.noDec(plot.length > 0 ? amount : maxPodAmount)} Pods</p>
        </div>
      )}

      {/* Show these sections only when plots are selected */}
      {plot.length > 0 && (
        <div className="flex flex-col gap-4 animate-fade-in">
          {/* Pod Range Selection */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-4 w-full">
              <p className="pinto-body text-pinto-light whitespace-nowrap">Select Pods</p>
              <div className="flex items-center gap-3 flex-1 p-4">
                <p className="pinto-body text-pinto-light w-[60px] text-right">{formatter.noDec(podRange[0])}</p>
                <div className="flex-1">
                  {maxPodAmount > 0 && (
                    <MultiSlider
                      value={podRange}
                      onValueChange={handlePodRangeChange}
                      step={1}
                      min={0}
                      max={maxPodAmount}
                      className="w-full"
                    />
                  )}
                </div>
                <p className="pinto-body text-pinto-light w-[60px] text-right">{formatter.noDec(podRange[1])}</p>
              </div>
            </div>
          </div>

          {/* Price Per Pod */}
          <div className="flex flex-col gap-2">
            <p className="pinto-body text-pinto-light">Amount I am willing to sell for each Pod for:</p>
            <div className="flex flex-row gap-4 w-full items-center">
              <div className="flex flex-row gap-4 items-center">
                <p className="pinto-body text-pinto-light">0</p>
                <Slider
                  min={PRICE_PER_POD_CONFIG.MIN}
                  max={PRICE_PER_POD_CONFIG.MAX}
                  step={0.001}
                  value={[pricePerPod || PRICE_PER_POD_CONFIG.MIN]}
                  onValueChange={handlePriceSliderChange}
                  className="w-[300px]"
                />
                <p className="pinto-body text-pinto-light">1</p>
              </div>
              <Input
                type="text"
                value={pricePerPodInput}
                onChange={handlePriceInputChange}
                onBlur={handlePriceInputBlur}
                placeholder="0.00"
                outlined
                containerClassName=""
                className=""
                endIcon={<TextAdornment text={mainToken.symbol} className="bg-white" />}
              />
            </div>
          </div>
          {/* Expires In - Auto-set to max expiration */}
          {/* <div className="flex flex-col gap-2">
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
          </div> */}
          {/* <div className="flex flex-row w-full items-center justify-between gap-2">
            <p className="pinto-body text-pinto-light">Send balances to Farm Balance</p>
            <Switch
              checked={balanceTo === FarmToMode.INTERNAL}
              onCheckedChange={(checked) => setBalanceTo(checked ? FarmToMode.INTERNAL : FarmToMode.EXTERNAL)}
            />
          </div> */}
        </div>
      )}
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
