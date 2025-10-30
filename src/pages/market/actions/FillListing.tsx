import podIcon from "@/assets/protocol/Pod.png";
import { TV, TokenValue } from "@/classes/TokenValue";
import { ComboInputField } from "@/components/ComboInputField";
import FrameAnimator from "@/components/LoadingSpinner";
import PodLineGraph from "@/components/PodLineGraph";
import RoutingAndSlippageInfo, { useRoutingAndSlippageWarning } from "@/components/RoutingAndSlippageInfo";
import SlippageButton from "@/components/SlippageButton";
import SmartSubmitButton from "@/components/SmartSubmitButton";
import { Input } from "@/components/ui/Input";
import { Separator } from "@/components/ui/Separator";
import { MultiSlider, Slider } from "@/components/ui/Slider";
import { ANALYTICS_EVENTS } from "@/constants/analytics-events";
import { PODS } from "@/constants/internalTokens";
import fillPodListing from "@/encoders/fillPodListing";
import { beanstalkAbi } from "@/generated/contractHooks";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { useIsWSOL, useTokenMap } from "@/hooks/pinto/useTokenMap";
import useBuildSwapQuote from "@/hooks/swap/useBuildSwapQuote";
import useMaxBuy from "@/hooks/swap/useMaxBuy";
import useSwap from "@/hooks/swap/useSwap";
import useSwapSummary from "@/hooks/swap/useSwapSummary";
import { usePreferredInputToken } from "@/hooks/usePreferredInputToken";
import useSafeTokenValue from "@/hooks/useSafeTokenValue";
import useTransaction from "@/hooks/useTransaction";
import usePriceImpactSummary from "@/hooks/wells/usePriceImpactSummary";
import usePodListings from "@/state/market/usePodListings";
import { useFarmerBalances } from "@/state/useFarmerBalances";
import { useFarmerPlotsQuery } from "@/state/useFarmerField";
import { useHarvestableIndex, usePodIndex } from "@/state/useFieldData";
import { useQueryKeys } from "@/state/useQueryKeys";
import useTokenData from "@/state/useTokenData";
import { trackSimpleEvent } from "@/utils/analytics";
import { formatter } from "@/utils/format";
import { toSafeTVFromHuman } from "@/utils/number";
import { tokensEqual } from "@/utils/token";
import { FarmFromMode, FarmToMode, Plot, Token } from "@/utils/types";
import { cn, getBalanceFromMode } from "@/utils/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Address } from "viem";
import { useAccount } from "wagmi";

// Configuration constants
const PRICE_PER_POD_CONFIG = {
  MAX: 1,
  MIN: 0,
  DECIMALS: 6,
  DECIMAL_MULTIPLIER: 1_000_000, // 10^6 for 6 decimals
} as const;

const PRICE_SLIDER_STEP = 0.001;

const TextAdornment = ({ text, className }: { text: string; className?: string }) => {
  return <div className={cn("text-black pinto-sm-light mr-2", className)}>{text}</div>;
};

// Utility function to format and truncate price per pod values
const formatPricePerPod = (value: number): number => {
  return Math.floor(value * PRICE_PER_POD_CONFIG.DECIMAL_MULTIPLIER) / PRICE_PER_POD_CONFIG.DECIMAL_MULTIPLIER;
};

const useFilterTokens = () => {
  const tokens = useTokenMap();
  const isWSOL = useIsWSOL();

  return useMemo(() => {
    const set = new Set<Token>();

    [...Object.values(tokens)].forEach((token) => {
      if (token.isLP || token.isSiloWrapped || token.is3PSiloWrapped || isWSOL(token)) {
        set.add(token);
      }
    });
    return set;
  }, [tokens, isWSOL]);
};

export default function FillListing() {
  const mainToken = useTokenData().mainToken;
  const diamondAddress = useProtocolAddress();
  const account = useAccount();
  const farmerBalances = useFarmerBalances();
  const harvestableIndex = useHarvestableIndex();
  const navigate = useNavigate();

  const filterTokens = useFilterTokens();

  const queryClient = useQueryClient();
  const { allPodListings, allMarket, farmerMarket, farmerField } = useQueryKeys({
    account: account.address,
    harvestableIndex,
  });
  const { queryKey: farmerPlotsQK } = useFarmerPlotsQuery();
  const allQK = useMemo(
    () => [allPodListings, allMarket, farmerMarket, farmerField, farmerPlotsQK, ...farmerBalances.queryKeys],
    [allPodListings, allMarket, farmerMarket, farmerField, farmerPlotsQK, farmerBalances],
  );

  const { preferredToken, loading: preferredLoading } = usePreferredInputToken({
    filterLP: true,
  });

  const podListings = usePodListings();
  const { id } = useParams();
  const allListings = podListings.data;
  const listing = allListings?.podListings.find((listing) => listing.index === id);

  const [didSetPreferred, setDidSetPreferred] = useState(false);
  const [amountIn, setAmountIn] = useState("");
  const [tokenIn, setTokenIn] = useState(mainToken);
  const [balanceFrom, setBalanceFrom] = useState(FarmFromMode.INTERNAL_EXTERNAL);
  const [slippage, setSlippage] = useState(0.1);

  // Price per pod filter state
  const [maxPricePerPod, setMaxPricePerPod] = useState<number>(0);
  const [maxPricePerPodInput, setMaxPricePerPodInput] = useState<string>("0");

  // Place in line range state
  const podIndex = usePodIndex();
  const maxPlace = Number.parseInt(podIndex.toHuman()) - Number.parseInt(harvestableIndex.toHuman()) || 0;
  const [placeInLineRange, setPlaceInLineRange] = useState<[number, number]>([0, maxPlace]);

  // Update place in line range when maxPlace changes
  useEffect(() => {
    setPlaceInLineRange((prev) => [prev[0], maxPlace]);
  }, [maxPlace]);

  const isUsingMain = tokensEqual(tokenIn, mainToken);

  const amountInTV = useSafeTokenValue(amountIn, tokenIn);

  const { data: swapData, resetSwap } = useSwap({
    tokenIn,
    tokenOut: mainToken,
    slippage,
    amountIn: amountInTV,
    disabled: isUsingMain,
  });

  const value = tokenIn.isNative ? amountInTV : undefined;

  const swapBuild = useBuildSwapQuote(swapData, balanceFrom, FarmToMode.INTERNAL);
  const swapSummary = useSwapSummary(swapData);
  const priceImpactQuery = usePriceImpactSummary(swapBuild?.advFarm, tokenIn, value);
  const priceImpactSummary = priceImpactQuery?.get(mainToken);

  const { slippageWarning, canProceed: ackSlippage } = useRoutingAndSlippageWarning({
    totalSlippage: swapSummary?.swap.totalSlippage,
    priceImpact: priceImpactSummary?.priceImpact,
    txnType: "Swap",
  });

  useEffect(() => {
    // If we are still calculating the preferred token, set the token to the preferred token once it's been set.
    if (preferredLoading) return;
    if (preferredToken && !didSetPreferred) {
      setTokenIn(preferredToken);
      setDidSetPreferred(true);
    }
  }, [preferredToken, preferredLoading, didSetPreferred]);

  // Token selection handler with tracking
  const handleTokenSelection = useCallback(
    (newToken: Token) => {
      trackSimpleEvent(ANALYTICS_EVENTS.MARKET.ORDER_TOKEN_SELECTED, {
        previous_token: tokenIn.symbol,
        new_token: newToken.symbol,
        fill_action: "listing",
      });
      setTokenIn(newToken);
    },
    [tokenIn],
  );

  // Price per pod slider handler
  const handlePriceSliderChange = useCallback((value: number[]) => {
    const formatted = formatPricePerPod(value[0]);
    setMaxPricePerPod(formatted);
    setMaxPricePerPodInput(formatted.toFixed(PRICE_PER_POD_CONFIG.DECIMALS));
  }, []);

  // Price per pod input handlers
  const handlePriceInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMaxPricePerPodInput(value);
  }, []);

  const handlePriceInputBlur = useCallback(() => {
    const numValue = Number.parseFloat(maxPricePerPodInput);
    if (!Number.isNaN(numValue)) {
      const clamped = Math.max(0, Math.min(PRICE_PER_POD_CONFIG.MAX, numValue));
      const formatted = formatPricePerPod(clamped);
      setMaxPricePerPod(formatted);
      setMaxPricePerPodInput(formatted.toString());
    } else {
      setMaxPricePerPodInput("0");
      setMaxPricePerPod(0);
    }
  }, [maxPricePerPodInput]);

  // Place in line range handler
  const handlePlaceInLineRangeChange = useCallback((value: number[]) => {
    const [min, max] = value;
    setPlaceInLineRange([Math.floor(min), Math.floor(max)]);
  }, []);

  // Place in line input handlers
  const handleMinPlaceInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const cleanValue = e.target.value.replace(/,/g, "");
      const value = Number.parseInt(cleanValue);
      if (!Number.isNaN(value) && value >= 0 && value <= maxPlace) {
        setPlaceInLineRange([value, placeInLineRange[1]]);
      } else if (cleanValue === "") {
        setPlaceInLineRange([0, placeInLineRange[1]]);
      }
    },
    [maxPlace, placeInLineRange],
  );

  const handleMaxPlaceInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const cleanValue = e.target.value.replace(/,/g, "");
      const value = Number.parseInt(cleanValue);
      if (!Number.isNaN(value) && value >= 0 && value <= maxPlace) {
        setPlaceInLineRange([placeInLineRange[0], value]);
      } else if (cleanValue === "") {
        setPlaceInLineRange([placeInLineRange[0], maxPlace]);
      }
    },
    [maxPlace, placeInLineRange],
  );

  /**
   * Convert all listings to Plot objects and determine eligible ones
   * Eligible = matching both price criteria AND place in line range
   */
  const { listingPlots, eligibleListingIds, rangeOverlay } = useMemo(() => {
    if (!allListings?.podListings) {
      return { listingPlots: [], eligibleListingIds: [], rangeOverlay: undefined };
    }

    // Convert all listings to Plot objects for graph visualization
    const plots: Plot[] = allListings.podListings.map((listing) => ({
      index: TokenValue.fromBlockchain(listing.index, PODS.decimals),
      pods: TokenValue.fromBlockchain(listing.remainingAmount, PODS.decimals),
      harvestedPods: TokenValue.ZERO,
      harvestablePods: TokenValue.ZERO,
      id: listing.id,
      idHex: listing.id,
    }));

    // Calculate place in line boundaries for filtering
    const minPlaceIndex = harvestableIndex.add(TokenValue.fromHuman(placeInLineRange[0], PODS.decimals));
    const maxPlaceIndex = harvestableIndex.add(TokenValue.fromHuman(placeInLineRange[1], PODS.decimals));

    // Determine eligible listings (shown as green on graph)
    // When maxPricePerPod is 0, no listings are eligible (all show as orange)
    // When maxPricePerPod > 0, filter by both price and place in line
    const eligible: string[] =
      maxPricePerPod > 0
        ? allListings.podListings
            .filter((listing) => {
              const listingPrice = TokenValue.fromBlockchain(listing.pricePerPod, mainToken.decimals).toNumber();
              const listingIndex = TokenValue.fromBlockchain(listing.index, PODS.decimals);

              // Listing must match both criteria to be eligible
              return (
                listingPrice <= maxPricePerPod && listingIndex.gte(minPlaceIndex) && listingIndex.lte(maxPlaceIndex)
              );
            })
            .map((listing) => listing.id)
        : [];

    // Calculate range overlay for visual feedback on graph
    const overlay = {
      start: harvestableIndex.add(TokenValue.fromHuman(placeInLineRange[0], PODS.decimals)),
      end: harvestableIndex.add(TokenValue.fromHuman(placeInLineRange[1], PODS.decimals)),
    };

    return { listingPlots: plots, eligibleListingIds: eligible, rangeOverlay: overlay };
  }, [allListings, maxPricePerPod, placeInLineRange, mainToken.decimals, harvestableIndex]);

  // Calculate open available pods count (eligible listings only - already filtered by price AND place)
  const openAvailablePods = useMemo(() => {
    if (!allListings?.podListings.length) return 0;

    const eligibleSet = new Set(eligibleListingIds);

    return allListings.podListings.reduce((sum, listing) => {
      // eligibleListingIds already contains listings that match both price and place criteria
      if (!eligibleSet.has(listing.id)) return sum;

      const remainingAmount = TokenValue.fromBlockchain(listing.remainingAmount, PODS.decimals);
      return sum + remainingAmount.toNumber();
    }, 0);
  }, [allListings, eligibleListingIds]);

  // Plot selection handler - navigate to selected listing
  const handlePlotGroupSelect = useCallback(
    (plotIndices: string[]) => {
      if (plotIndices.length > 0) {
        const listingId = plotIndices[0];
        // Extract the index from the listing ID (format: "0-{index}")
        const indexPart = listingId.split("-")[1];
        if (indexPart) {
          navigate(`/market/pods/buy/${indexPart}`);
        }
      }
    },
    [navigate],
  );

  // reset form and invalidate pod listings/farmer plot queries
  const onSuccess = useCallback(() => {
    navigate(`/market/pods/buy/fill`);
    setAmountIn("");
    resetSwap();
    allQK.forEach((key) => queryClient.invalidateQueries({ queryKey: key }));
  }, [navigate, resetSwap, queryClient, allQK]);

  const { writeWithEstimateGas, submitting, isConfirming, setSubmitting } = useTransaction({
    successMessage: "Listing Fill successful",
    errorMessage: "Listing Fill failed",
    successCallback: onSuccess,
  });

  const mainTokensIn = isUsingMain ? toSafeTVFromHuman(amountIn, mainToken.decimals) : swapData?.buyAmount;

  // Calculate weighted average for eligible listings
  const eligibleSummary = useMemo(() => {
    if (!allListings?.podListings.length || eligibleListingIds.length === 0) {
      return null;
    }

    const eligibleSet = new Set(eligibleListingIds);
    const eligibleListings = allListings.podListings.filter((l) => eligibleSet.has(l.id));

    let totalValue = 0;
    let totalPods = 0;
    let totalPlaceInLine = 0;

    eligibleListings.forEach((listing) => {
      const listingPrice = TokenValue.fromBlockchain(listing.pricePerPod, mainToken.decimals).toNumber();
      const listingPods = TokenValue.fromBlockchain(listing.remainingAmount, PODS.decimals).toNumber();
      const listingPlace = TokenValue.fromBlockchain(listing.index, PODS.decimals).sub(harvestableIndex).toNumber();

      totalValue += listingPrice * listingPods;
      totalPods += listingPods;
      totalPlaceInLine += listingPlace * listingPods;
    });

    const avgPricePerPod = totalPods > 0 ? totalValue / totalPods : 0;
    const avgPlaceInLine = totalPods > 0 ? totalPlaceInLine / totalPods : 0;

    return {
      avgPricePerPod: TokenValue.fromHuman(avgPricePerPod, mainToken.decimals),
      avgPlaceInLine: TokenValue.fromHuman(avgPlaceInLine, PODS.decimals),
      totalPods,
    };
  }, [allListings, eligibleListingIds, mainToken.decimals, harvestableIndex]);

  // Calculate total tokens needed to fill eligible listings
  const totalMainTokensToFill = useMemo(() => {
    if (!eligibleSummary) return TokenValue.ZERO;
    return eligibleSummary.avgPricePerPod.mul(TokenValue.fromHuman(eligibleSummary.totalPods, PODS.decimals));
  }, [eligibleSummary]);

  const tokenInBalance = farmerBalances.balances.get(tokenIn);
  const { data: maxFillAmount } = useMaxBuy(tokenIn, slippage, totalMainTokensToFill);
  const balanceFromMode = getBalanceFromMode(tokenInBalance, balanceFrom);
  const balanceExceedsMax = balanceFromMode.gt(0) && maxFillAmount && balanceFromMode.gte(maxFillAmount);

  const onSubmit = useCallback(async () => {
    // Validate requirements
    if (!listing) {
      toast.error("No listing selected");
      throw new Error("Listing not found");
    }
    if (!account.address) {
      toast.error("Please connect your wallet");
      throw new Error("Signer required");
    }
    if (!eligibleListingIds.length) {
      toast.error("No eligible listings available");
      throw new Error("No eligible listings");
    }

    // Track pod listing fill
    trackSimpleEvent(ANALYTICS_EVENTS.MARKET.POD_LIST_FILL, {
      payment_token: tokenIn.symbol,
      balance_source: balanceFrom,
      eligible_listings_count: eligibleListingIds.length,
    });

    try {
      setSubmitting(true);
      toast.loading("Filling Listing...");
      if (isUsingMain) {
        return writeWithEstimateGas({
          address: diamondAddress,
          abi: beanstalkAbi,
          functionName: "fillPodListing",
          args: [
            {
              lister: listing.farmer.id as Address, // account
              fieldId: 0n, // fieldId
              index: TokenValue.fromBlockchain(listing.index, PODS.decimals).toBigInt(), // index
              start: TokenValue.fromBlockchain(listing.start, PODS.decimals).toBigInt(), // start
              podAmount: TokenValue.fromBlockchain(listing.amount, PODS.decimals).toBigInt(), // amount
              pricePerPod: Number(TokenValue.fromBlockchain(listing.pricePerPod, mainToken.decimals)), // pricePerPod
              maxHarvestableIndex: TokenValue.fromBlockchain(listing.maxHarvestableIndex, PODS.decimals).toBigInt(), // maxHarvestableIndex
              minFillAmount: TokenValue.fromBlockchain(listing.minFillAmount, mainToken.decimals).toBigInt(), // minFillAmount, measured in Beans
              mode: Number(listing.mode), // mode
            },
            toSafeTVFromHuman(amountIn, mainToken.decimals).toBigInt(), // amountIn
            Number(balanceFrom), // fromMode
          ],
        });
      } else if (swapBuild?.advancedFarm.length) {
        const { clipboard } = await swapBuild.deriveClipboardWithOutputToken(mainToken, 9, account.address, {
          value: value ?? TV.ZERO,
        });

        const advFarm = [...swapBuild.advancedFarm];
        advFarm.push(
          fillPodListing(
            listing.farmer.id as Address, // account
            TokenValue.fromBlockchain(listing.index, PODS.decimals), // index
            TokenValue.fromBlockchain(listing.start, PODS.decimals), // start
            TokenValue.fromBlockchain(listing.amount, PODS.decimals), // amount
            Number(TokenValue.fromBlockchain(listing.pricePerPod, mainToken.decimals)), // pricePerPod
            TokenValue.fromBlockchain(listing.maxHarvestableIndex, PODS.decimals), // maxHarvestableIndex
            TokenValue.fromBlockchain(listing.minFillAmount, mainToken.decimals), // minFillAmount, measured in Beans
            Number(listing.mode), // mode
            TV.ZERO, // amountIn (from clipboard)
            FarmFromMode.INTERNAL, // fromMode
            clipboard,
          ),
        );

        return writeWithEstimateGas({
          address: diamondAddress,
          abi: beanstalkAbi,
          functionName: "advancedFarm",
          args: [advFarm],
          value: (value ?? TV.ZERO).toBigInt(),
        });
      } else {
        throw new Error("No quote");
      }
    } catch (e) {
      console.error(e);
      toast.dismiss();
      toast.error("Listing Fill Failed");
      throw e;
    } finally {
      setSubmitting(false);
    }
  }, [
    listing,
    account.address,
    amountIn,
    balanceFrom,
    swapBuild,
    writeWithEstimateGas,
    setSubmitting,
    isUsingMain,
    value,
    diamondAddress,
    mainToken,
    eligibleListingIds.length,
    tokenIn.symbol,
  ]);

  // Disable submit if no tokens entered, no eligible listings, or no listing selected
  const disabled = !mainTokensIn || mainTokensIn.eq(0) || !eligibleListingIds.length || !listing;

  return (
    <div className="flex flex-col gap-4">
      {/* PodLineGraph Visualization */}
      <div className="flex flex-col gap-3">
        <PodLineGraph
          plots={listingPlots}
          selectedPlotIndices={listing ? [listing.id] : eligibleListingIds}
          rangeOverlay={rangeOverlay}
          onPlotGroupSelect={handlePlotGroupSelect}
        />
      </div>

      {/* Max Price Per Pod Filter Section */}
      <div className="flex flex-col gap-2 mt-2">
        <p className="pinto-body text-pinto-light">I am willing to buy Pods up to:</p>
        <div className="flex flex-row gap-4 w-full items-center">
          <div className="flex flex-row gap-4 items-center">
            <p className="pinto-body text-pinto-light">0</p>
            <Slider
              min={PRICE_PER_POD_CONFIG.MIN}
              max={PRICE_PER_POD_CONFIG.MAX}
              step={PRICE_SLIDER_STEP}
              value={[maxPricePerPod]}
              onValueChange={handlePriceSliderChange}
              className="w-[300px]"
            />
            <p className="pinto-body text-pinto-light">1</p>
          </div>
          <Input
            type="text"
            inputMode="decimal"
            value={maxPricePerPodInput}
            onChange={handlePriceInputChange}
            onBlur={handlePriceInputBlur}
            onFocus={(e) => e.target.select()}
            placeholder="0"
            outlined
            containerClassName=""
            className=""
            endIcon={<TextAdornment text={mainToken.symbol} className="bg-white" />}
          />
        </div>
      </div>

      {/* Place in Line Range Selector */}
      {maxPlace > 0 && (
        <div className="flex flex-col gap-3">
          <p className="pinto-body text-pinto-light">At a Place in Line between:</p>
          {/* Slider row */}
          <div className="flex flex-row gap-4 w-full items-center min-w-0">
            <p className="pinto-body text-pinto-light whitespace-nowrap flex-shrink-0">0</p>
            <MultiSlider
              value={placeInLineRange}
              onValueChange={handlePlaceInLineRangeChange}
              step={1}
              min={0}
              max={maxPlace}
              className="flex-1 min-w-0"
            />
            <p className="pinto-body text-pinto-light whitespace-nowrap flex-shrink-0 min-w-[80px] text-right">{formatter.noDec(maxPlace)}</p>
          </div>
          {/* Input row */}
          <div className="flex flex-row gap-2 w-full items-center">
            <Input
              type="text"
              inputMode="numeric"
              value={placeInLineRange[0] ? formatter.noDec(placeInLineRange[0]) : "0"}
              onChange={handleMinPlaceInputChange}
              onFocus={(e) => e.target.select()}
              placeholder="0"
              outlined
              containerClassName="flex-1"
              className=""
            />
            <span className="pinto-body text-pinto-light">—</span>
            <Input
              type="text"
              inputMode="numeric"
              value={placeInLineRange[1] ? formatter.noDec(placeInLineRange[1]) : formatter.noDec(maxPlace)}
              onChange={handleMaxPlaceInputChange}
              onFocus={(e) => e.target.select()}
              placeholder={formatter.noDec(maxPlace)}
              outlined
              containerClassName="flex-1"
              className=""
            />
          </div>
        </div>
      )}

      {/* Open Available Pods Display */}
      <div className="flex">
        <p className="pinto-body text-pinto-light">
          Open available pods: <span className="font-semibold">{formatter.noDec(openAvailablePods)}</span> Pods
        </p>
      </div>

      {/* Fill Using Section - Only show if there are eligible listings */}
      {eligibleListingIds.length > 0 && (
        <div className="flex flex-col gap-4 animate-fade-in">
        <div className="-mt-2">
          <div className="flex flex-row justify-between items-center">
            <p className="pinto-body text-pinto-light">Fill Using</p>
            <SlippageButton slippage={slippage} setSlippage={setSlippage} />
          </div>
          <ComboInputField
            amount={amountIn}
            disableInput={isConfirming || submitting}
            setAmount={setAmountIn}
            setToken={handleTokenSelection}
            setBalanceFrom={setBalanceFrom}
            selectedToken={tokenIn}
            balanceFrom={balanceFrom}
            customMaxAmount={
              maxFillAmount?.gt(0) ? TokenValue.min(balanceFromMode, maxFillAmount) : TokenValue.ZERO
            }
            filterTokens={filterTokens}
            altText={balanceExceedsMax ? "Usable balance:" : undefined}
            disableClamping={true}
          />
          {!isUsingMain && amountInTV.gt(0) && (
            <RoutingAndSlippageInfo
              title="Total Swap Slippage"
              swapSummary={swapSummary}
              priceImpactSummary={priceImpactSummary}
              preferredSummary="swap"
              txnType="Swap"
              tokenIn={tokenIn}
              tokenOut={mainToken}
            />
          )}
          {slippageWarning}
        </div>
        <div className="flex flex-col gap-4">
          <Separator />
          {disabled && Number(amountIn) > 0 && (
            <div className="flex justify-center">
              <FrameAnimator className="-mt-5 -mb-10" size={150} />
            </div>
          )}
          {!disabled && eligibleSummary && mainTokensIn && (
            <ActionSummary
              pricePerPod={eligibleSummary.avgPricePerPod}
              plotPosition={eligibleSummary.avgPlaceInLine}
              beanAmount={mainTokensIn}
            />
          )}
          <div className="flex flex-row gap-2 items-center w-full">
            <SmartSubmitButton
              variant="gradient"
              size="xxl"
              submitButtonText="Approve"
              disabled={disabled || !ackSlippage || isConfirming || submitting}
              submitFunction={() => {}}
              className="flex-1"
            />
            <SmartSubmitButton
              variant="gradient"
              size="xxl"
              submitButtonText="Buy Pods"
              token={tokenIn}
              amount={amountIn}
              balanceFrom={balanceFrom}
              submitFunction={onSubmit}
              disabled={disabled || !ackSlippage || submitting || isConfirming}
              className="flex-1"
            />
          </div>
        </div>
        </div>
      )}
    </div>
  );
}

/**
 * Displays summary of the fill transaction
 * Shows estimated pods to receive, average position, and pricing details
 */
const ActionSummary = ({
  pricePerPod,
  plotPosition,
  beanAmount,
}: {
  pricePerPod: TV;
  plotPosition: TV;
  beanAmount: TV;
}) => {
  // Calculate estimated pods to receive
  const estimatedPods = beanAmount.div(pricePerPod);

  return (
    <div className="flex flex-col gap-4">
      <p className="pinto-body text-pinto-light">You will receive approximately</p>
      <div className="flex flex-col gap-2">
        <p className="pinto-h3 flex flex-row items-center gap-2 -mt-1">
          <img src={podIcon} className="w-8 h-8" alt="Pod icon" />
          {formatter.number(estimatedPods, { minDecimals: 0, maxDecimals: 2 })} Pods
        </p>
        <p className="pinto-body text-pinto-light">@ average {plotPosition.toHuman("short")} in Line</p>
        <p className="pinto-sm text-pinto-light">
          for {formatter.number(beanAmount, { minDecimals: 0, maxDecimals: 2 })} Pinto at an average price of{" "}
          {formatter.number(pricePerPod, { minDecimals: 2, maxDecimals: 6 })} per Pod
        </p>
      </div>
    </div>
  );
};
