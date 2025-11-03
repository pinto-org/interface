import settingsIcon from "@/assets/misc/Settings.svg";
import pintoIcon from "@/assets/tokens/PINTO.png";
import { TV, TokenValue } from "@/classes/TokenValue";
import ComboPlotInputField from "@/components/ComboPlotInputField";
import PodLineGraph from "@/components/PodLineGraph";
import SimpleInputField from "@/components/SimpleInputField";
import SmartSubmitButton from "@/components/SmartSubmitButton";
import { Button } from "@/components/ui/Button";
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
import { motion } from "framer-motion";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { encodeFunctionData } from "viem";
import { useAccount } from "wagmi";

interface PodListingData {
  plot: Plot;
  index: TokenValue;
  start: TokenValue; // plot içindeki relative start
  end: TokenValue; // plot içindeki relative end
  amount: TokenValue; // list edilecek pod miktarı
}

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

// Utility function to remove trailing zeros from formatted price
const removeTrailingZeros = (value: string): string => {
  return value.includes(".") ? value.replace(/\.?0+$/, "") : value;
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
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [successAmount, setSuccessAmount] = useState<number | null>(null);
  const [successPrice, setSuccessPrice] = useState<number | null>(null);
  const podIndex = usePodIndex();
  const maxExpiration = Number.parseInt(podIndex.toHuman()) - Number.parseInt(harvestableIndex.toHuman()) || 0;
  const [expiresIn, setExpiresIn] = useState(maxExpiration); // Auto-set to max expiration
  const minFill = TokenValue.fromHuman(1, PODS.decimals);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

  const plotPosition = plot.length > 0 ? plot[0].index.sub(harvestableIndex) : TV.ZERO;

  const maxExpirationValidation = useMemo(
    () => ({
      minValue: 1,
      maxValue: maxExpiration,
      maxDecimals: 0,
    }),
    [maxExpiration],
  );

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

  // Calculate selected pod range for PodLineGraph partial selection
  const selectedPodRange = useMemo(() => {
    if (plot.length === 0) return undefined;

    // Sort plots by index
    const sortedPlots = [...plot].sort((a, b) => a.index.sub(b.index).toNumber());

    // Helper function to convert pod offset to absolute index
    const offsetToAbsoluteIndex = (offset: number): TokenValue => {
      let remainingOffset = offset;

      for (const p of sortedPlots) {
        const plotPods = p.pods.toNumber();

        if (remainingOffset <= plotPods) {
          // The offset falls within this plot
          return p.index.add(TokenValue.fromHuman(remainingOffset, PODS.decimals));
        }

        // Move to next plot
        remainingOffset -= plotPods;
      }

      // If we've exhausted all plots, return the end of the last plot
      const lastPlot = sortedPlots[sortedPlots.length - 1];
      return lastPlot.index.add(lastPlot.pods);
    };

    return {
      start: offsetToAbsoluteIndex(podRange[0]),
      end: offsetToAbsoluteIndex(podRange[1]),
    };
  }, [plot, podRange]);

  // Convert pod range (offset based) to individual plot listing data
  const listingData = useMemo((): PodListingData[] => {
    if (plot.length === 0 || amount === 0) return [];

    const sortedPlots = [...plot].sort((a, b) => a.index.sub(b.index).toNumber());
    const result: PodListingData[] = [];

    // Calculate cumulative pod amounts to find which plots are affected
    let cumulativeStart = 0;
    const rangeStart = podRange[0];
    const rangeEnd = podRange[1];

    for (const p of sortedPlots) {
      const plotPods = p.pods.toNumber();
      const cumulativeEnd = cumulativeStart + plotPods;

      // Check if this plot is within the selected range
      if (rangeEnd > cumulativeStart && rangeStart < cumulativeEnd) {
        // Calculate the intersection
        const startInPlot = Math.max(0, rangeStart - cumulativeStart);
        const endInPlot = Math.min(plotPods, rangeEnd - cumulativeStart);
        const amountInPlot = endInPlot - startInPlot;

        if (amountInPlot > 0) {
          result.push({
            plot: p,
            index: p.index,
            start: TokenValue.fromHuman(startInPlot, PODS.decimals),
            end: TokenValue.fromHuman(endInPlot, PODS.decimals),
            amount: TokenValue.fromHuman(amountInPlot, PODS.decimals),
          });
        }
      }

      cumulativeStart = cumulativeEnd;
    }

    return result;
  }, [plot, podRange, amount]);

  // Plot selection handler with tracking
  const handlePlotSelection = useCallback(
    (plots: Plot[]) => {
      trackSimpleEvent(ANALYTICS_EVENTS.MARKET.LISTING_PLOT_SELECTED, {
        plot_count: plots.length,
        previous_count: plot.length,
      });

      // Sort plots by index to ensure consistent ordering
      const sortedPlots = [...plots].sort((a, b) => a.index.sub(b.index).toNumber());
      setPlot(sortedPlots);

      // Reset range when plots change - slider always starts from first plot and ends at last plot
      if (sortedPlots.length > 0) {
        const totalPods = sortedPlots.reduce((sum, p) => sum + p.pods.toNumber(), 0);
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
    const newAmount = max - min;

    setPodRange([min, max]);
    setAmount(newAmount);

    // If amount becomes 0, clear the plot selection
    if (newAmount === 0) {
      setPlot([]);
    }
  }, []);

  // Price per pod slider handler
  const handlePriceSliderChange = useCallback((value: number[]) => {
    const formatted = formatPricePerPod(value[0]);
    setPricePerPod(formatted);
    setPricePerPodInput(removeTrailingZeros(formatted.toFixed(PRICE_PER_POD_CONFIG.DECIMALS)));
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
      setPricePerPodInput(removeTrailingZeros(formatted.toFixed(PRICE_PER_POD_CONFIG.DECIMALS)));
    } else {
      setPricePerPodInput("");
      setPricePerPod(undefined);
    }
  }, [pricePerPodInput]);

  // reset form and invalidate pod listing query
  const onSuccess = useCallback(() => {
    setSuccessAmount(amount);
    setSuccessPrice(pricePerPod || 0);
    setIsSuccessful(true);
    setPlot([]);
    setAmount(0);
    setPodRange([0, 0]);
    setPricePerPod(undefined);
    setPricePerPodInput("");
    allQK.forEach((key) => queryClient.invalidateQueries({ queryKey: key }));
  }, [amount, pricePerPod, queryClient, allQK]);

  // state for toast txns
  const { isConfirming, writeWithEstimateGas, submitting, setSubmitting } = useTransaction({
    successMessage: "Plot Listing successful",
    errorMessage: "Plot Listing failed",
    successCallback: onSuccess,
  });

  const onSubmit = useCallback(async () => {
    if (
      !pricePerPod ||
      pricePerPod <= 0 ||
      !expiresIn ||
      !amount ||
      amount <= 0 ||
      !account ||
      listingData.length === 0
    ) {
      return;
    }

    // Track pod listing creation
    trackSimpleEvent(ANALYTICS_EVENTS.MARKET.POD_LIST_CREATE, {
      has_price_per_pod: !!pricePerPod,
      listing_count: listingData.length,
      plot_position_millions: plot.length > 0 ? Math.round(plotPosition.div(1_000_000).toNumber()) : 0,
    });

    // pricePerPod should be encoded as uint24 with 6 decimals (0.5 * 1_000_000 = 500000)
    const encodedPricePerPod = pricePerPod ? Math.floor(pricePerPod * PRICE_PER_POD_CONFIG.DECIMAL_MULTIPLIER) : 0;
    const _expiresIn = TokenValue.fromHuman(expiresIn, PODS.decimals);
    const maxHarvestableIndex = _expiresIn.add(harvestableIndex);
    try {
      setSubmitting(true);
      toast.loading(`Creating ${listingData.length} Listing${listingData.length > 1 ? "s" : ""}...`);

      const farmData: `0x${string}`[] = [];

      // Create a listing call for each plot
      for (const data of listingData) {
        const listingArgs = {
          lister: account,
          fieldId: 0n,
          index: data.index.toBigInt(),
          start: data.start.toBigInt(),
          podAmount: data.amount.toBigInt(),
          pricePerPod: encodedPricePerPod,
          maxHarvestableIndex: maxHarvestableIndex.toBigInt(),
          minFillAmount: minFill.toBigInt(),
          mode: Number(balanceTo),
        };

        const listingCall = encodeFunctionData({
          abi: beanstalkAbi,
          functionName: "createPodListing",
          args: [listingArgs],
        });
        farmData.push(listingCall);
      }

      // Use farm to batch all listings in one transaction
      writeWithEstimateGas({
        address: diamondAddress,
        abi: beanstalkAbi,
        functionName: "farm",
        args: [farmData],
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
    listingData,
    plotPosition,
    setSubmitting,
    mainToken.decimals,
    diamondAddress,
    writeWithEstimateGas,
  ]);

  // ui state
  const disabled = !pricePerPod || !amount || !account || plot.length === 0;

  return (
    <div className="flex flex-col gap-4">
      {/* Plot Selection Section */}
      <div className="flex flex-col gap-3">
        <p className="pinto-body text-pinto-light">Select the Plot(s) you want to List (i):</p>

        {/* Pod Line Graph Visualization */}
        <PodLineGraph
          selectedPlotIndices={plot.map((p) => p.index.toHuman())}
          selectedPodRange={selectedPodRange}
          label="My Pods In Line"
          onPlotGroupSelect={(plotIndices) => {
            // Find all plots in the clicked group from farmer plots
            const plotsInGroup = farmerField.plots.filter((p) => plotIndices.includes(p.index.toHuman()));

            if (plotsInGroup.length === 0) return;

            // Check if all plots in the group are already selected
            const allSelected = plotIndices.every((index) => plot.some((p) => p.index.toHuman() === index));

            if (allSelected) {
              // Deselect only this group - remove plots from this group
              const updatedPlots = plot.filter((p) => !plotIndices.includes(p.index.toHuman()));
              handlePlotSelection(updatedPlots);
            } else {
              // Add this group to existing selection - merge with current selection (avoid duplicates)
              const plotIndexSet = new Set(plot.map((p) => p.index.toHuman()));
              const newPlots = [...plot];

              plotsInGroup.forEach((plotToAdd) => {
                if (!plotIndexSet.has(plotToAdd.index.toHuman())) {
                  newPlots.push(plotToAdd);
                  plotIndexSet.add(plotToAdd.index.toHuman());
                }
              });

              if (newPlots.length > plot.length) {
                handlePlotSelection(newPlots);
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
                  step={0.000001}
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
            {/* Effective Temperature Display */}
            {pricePerPod && pricePerPod > 0 && (
              <div className="flex justify-end mr-1">
                <p className="pinto-sm text-pinto-light">
                  Effective Temperature (i):{" "}
                  <span className="text-green-600 font-semibold">
                    {formatter.number((1 / pricePerPod) * 100, { minDecimals: 2, maxDecimals: 2 })}%
                  </span>
                </p>
              </div>
            )}
          </div>
          {/* Advanced Settings Toggle */}
          <div className="flex justify-end -mb-6 items-center justify-between">
            <p className="pinto-body text-pinto-light">Settings</p>
            <button
              onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
              className="rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors"
              type="button"
            >
              <img
                src={settingsIcon}
                className={cn("w-4 h-4 transition-transform", showAdvancedSettings && "rotate-90")}
                alt="settings"
              />
            </button>
          </div>
          {/* Advanced Settings - Collapsible */}
          <motion.div
            initial={false}
            animate={{
              height: showAdvancedSettings ? "auto" : 0,
              opacity: showAdvancedSettings ? 1 : 0,
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-4">
              {/* Expires In - Auto-set to max expiration */}
              <div className="flex flex-col gap-2 pt-4">
                <p className="pinto-body text-pinto-light">Expires In</p>
                <SimpleInputField
                  amount={expiresIn}
                  setAmount={setExpiresIn}
                  placeholder={formatter.noDec(maxExpiration)}
                  validation={maxExpirationValidation}
                />
                {!!expiresIn && (
                  <p className="pinto-sm text-pinto-light">
                    This listing will automatically expire after {formatter.noDec(expiresIn)} more Pods become
                    Harvestable.
                  </p>
                )}
              </div>
              <div className="flex flex-row w-full items-center justify-between gap-2">
                <p className="pinto-body text-pinto-light">Send balances to Farm Balance</p>
                <Switch
                  checked={balanceTo === FarmToMode.INTERNAL}
                  onCheckedChange={(checked) => setBalanceTo(checked ? FarmToMode.INTERNAL : FarmToMode.EXTERNAL)}
                />
              </div>
            </div>
          </motion.div>
        </div>
      )}
      <div className="flex flex-col gap-4">
        <Separator />
        {!disabled && (
          <ActionSummary
            podAmount={amount}
            listingData={listingData}
            pricePerPod={pricePerPod}
            harvestableIndex={harvestableIndex}
          />
        )}
        <SmartSubmitButton
          variant="gradient"
          size="xxl"
          submitButtonText={isSuccessful ? "Listing Created!" : "List Pods"}
          disabled={disabled || isConfirming || submitting || isSuccessful}
          submitFunction={onSubmit}
        />
      </div>

      {/* Success Screen */}
      {isSuccessful && successAmount !== null && successPrice !== null && (
        <div className="flex flex-col gap-6 w-full animate-fade-in">
          <Separator />

          <div className="flex flex-col gap-3 items-center text-center px-4">
            <p className="pinto-body text-pinto-light">
              You have successfully created a Pod Listing with {formatter.noDec(successAmount)} Pods at a price of{" "}
              {formatter.number(successPrice, { minDecimals: 0, maxDecimals: 6 })} Pintos!
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

const ActionSummary = ({
  podAmount,
  listingData,
  pricePerPod,
  harvestableIndex,
}: { podAmount: number; listingData: PodListingData[]; pricePerPod: number; harvestableIndex: TokenValue }) => {
  const beansOut = podAmount * pricePerPod;

  // Format line positions
  const formatLinePositions = (): string => {
    if (listingData.length === 0) return "";
    if (listingData.length === 1) {
      const placeInLine = listingData[0].index.sub(harvestableIndex);
      return `@ ${placeInLine.toHuman("short")} in Line`;
    }

    // Multiple plots: show range
    const sortedData = [...listingData].sort((a, b) => a.index.sub(b.index).toNumber());
    const firstPlace = sortedData[0].index.sub(harvestableIndex);
    const lastPlace = sortedData[sortedData.length - 1].index.sub(harvestableIndex);

    if (firstPlace.eq(lastPlace)) {
      return `@ ${firstPlace.toHuman("short")} in Line`;
    }
    return `@ ${firstPlace.toHuman("short")} - ${lastPlace.toHuman("short")} in Lines`;
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="pinto-body text-pinto-light">If my listing is filled, I will receive</p>
      <div className="flex flex-col gap-2">
        <p className="pinto-h3 flex flex-row items-center gap-2 -mt-1">
          <img src={pintoIcon} className="w-8 h-8" alt={"order summary pinto"} />
          {formatter.number(beansOut, { minDecimals: 0, maxDecimals: 2 })} Pinto
        </p>
        <p className="pinto-body text-pinto-light">
          in exchange for {formatter.noDec(podAmount)} Pods {formatLinePositions()}.
        </p>
      </div>
    </div>
  );
};
