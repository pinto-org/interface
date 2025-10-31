import podIcon from "@/assets/protocol/Pod.png";
import { TV, TokenValue } from "@/classes/TokenValue";
import { ComboInputField } from "@/components/ComboInputField";
import FrameAnimator from "@/components/LoadingSpinner";
import PodLineGraph from "@/components/PodLineGraph";
import RoutingAndSlippageInfo, { useRoutingAndSlippageWarning } from "@/components/RoutingAndSlippageInfo";
import SlippageButton from "@/components/SlippageButton";
import SmartApprovalButton from "@/components/SmartApprovalButton";
import SmartSubmitButton from "@/components/SmartSubmitButton";
import { Button } from "@/components/ui/Button";
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
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Address, encodeFunctionData } from "viem";
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
  const [searchParams] = useSearchParams();
  const listingId = searchParams.get("listingId");

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
  const allListings = podListings.data;

  const [didSetPreferred, setDidSetPreferred] = useState(false);
  const [amountIn, setAmountIn] = useState("");
  const [tokenIn, setTokenIn] = useState(mainToken);
  const [balanceFrom, setBalanceFrom] = useState(FarmFromMode.INTERNAL_EXTERNAL);
  const [slippage, setSlippage] = useState(0.1);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [successPods, setSuccessPods] = useState<number | null>(null);
  const [successAvgPrice, setSuccessAvgPrice] = useState<number | null>(null);
  const [successTotal, setSuccessTotal] = useState<number | null>(null);
  const successDataRef = useRef<{ pods: number; avgPrice: number; total: number } | null>(null);

  // Price per pod filter state
  const [maxPricePerPod, setMaxPricePerPod] = useState<number>(0);
  const [maxPricePerPodInput, setMaxPricePerPodInput] = useState<string>("0.000000");

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

  // Pre-fill form when listingId parameter is present (clicked from chart)
  useEffect(() => {
    if (!listingId || !allListings?.podListings || maxPlace === 0) return;

    // Find the listing with matching ID
    const listing = allListings.podListings.find((l) => l.id === listingId);
    if (!listing) return;

    // Pre-fill price per pod
    const listingPrice = TokenValue.fromBlockchain(listing.pricePerPod, mainToken.decimals).toNumber();
    const formattedPrice = formatPricePerPod(listingPrice);
    setMaxPricePerPod(formattedPrice);
    setMaxPricePerPodInput(formattedPrice.toFixed(6));

    // Calculate listing's place in line
    const listingIndex = TokenValue.fromBlockchain(listing.index, PODS.decimals);
    const placeInLine = listingIndex.sub(harvestableIndex).toNumber();

    // Set place in line range to include this listing with a small margin
    // Clamp to valid range [0, maxPlace]
    const margin = Math.max(1, Math.floor(maxPlace * 0.01)); // 1% margin or at least 1
    const minPlace = Math.max(0, Math.floor(placeInLine - margin));
    const maxPlaceValue = Math.min(maxPlace, Math.ceil(placeInLine + margin));
    setPlaceInLineRange([minPlace, maxPlaceValue]);
  }, [listingId, allListings, maxPlace, mainToken.decimals, harvestableIndex]);

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
    setMaxPricePerPodInput(formatted.toFixed(6));
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
      setMaxPricePerPodInput(formatted.toFixed(PRICE_PER_POD_CONFIG.DECIMALS));
    } else {
      setMaxPricePerPodInput("0.000000");
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

  // reset form and invalidate pod listings/farmer plot queries
  const onSuccess = useCallback(() => {
    // Set success state from ref (to avoid stale closure)
    if (successDataRef.current) {
      const { pods, avgPrice, total } = successDataRef.current;
      setSuccessPods(pods);
      setSuccessAvgPrice(avgPrice);
      setSuccessTotal(total);
      setIsSuccessful(true);
      successDataRef.current = null; // Clear ref after use
    }

    setAmountIn("");
    resetSwap();
    allQK.forEach((key) => queryClient.invalidateQueries({ queryKey: key }));
  }, [resetSwap, queryClient, allQK]);

  const { writeWithEstimateGas, submitting, isConfirming, setSubmitting } = useTransaction({
    successMessage: "Listing Fill successful",
    errorMessage: "Listing Fill failed",
    successCallback: onSuccess,
  });

  const mainTokensIn = isUsingMain ? toSafeTVFromHuman(amountIn, mainToken.decimals) : swapData?.buyAmount;

  // Get eligible listings sorted by price (cheapest first)
  const eligibleListings = useMemo(() => {
    if (!allListings?.podListings.length || eligibleListingIds.length === 0) {
      return [];
    }

    const eligibleSet = new Set(eligibleListingIds);
    return allListings.podListings
      .filter((l) => eligibleSet.has(l.id))
      .sort((a, b) => {
        const priceA = TokenValue.fromBlockchain(a.pricePerPod, mainToken.decimals).toNumber();
        const priceB = TokenValue.fromBlockchain(b.pricePerPod, mainToken.decimals).toNumber();
        return priceA - priceB; // Sort by price ascending (cheapest first)
      });
  }, [allListings, eligibleListingIds, mainToken.decimals]);

  // Calculate which listings to fill and how much from each (based on mainTokensIn)
  const listingsToFill = useMemo(() => {
    if (!mainTokensIn || mainTokensIn.eq(0) || eligibleListings.length === 0) {
      return [];
    }

    const result: Array<{ listing: (typeof eligibleListings)[0]; beanAmount: TokenValue }> = [];
    let remainingBeans = mainTokensIn;

    for (const listing of eligibleListings) {
      if (remainingBeans.lte(0)) break;

      const listingPrice = TokenValue.fromBlockchain(listing.pricePerPod, mainToken.decimals);
      const listingRemainingPods = TokenValue.fromBlockchain(listing.remainingAmount, PODS.decimals);
      const maxBeansForListing = listingRemainingPods.mul(listingPrice);

      // Take the minimum of: remaining beans and max beans we can spend on this listing
      const beansToSpend = TokenValue.min(remainingBeans, maxBeansForListing);
      if (beansToSpend.gt(0)) {
        result.push({ listing, beanAmount: beansToSpend });
        remainingBeans = remainingBeans.sub(beansToSpend);
      }
    }

    return result;
  }, [mainTokensIn, eligibleListings, mainToken.decimals]);

  // Calculate weighted average for eligible listings
  const eligibleSummary = useMemo(() => {
    if (listingsToFill.length === 0) {
      return null;
    }

    let totalValue = 0;
    let totalPods = 0;
    let totalPlaceInLine = 0;

    listingsToFill.forEach(({ listing, beanAmount }) => {
      const listingPrice = TokenValue.fromBlockchain(listing.pricePerPod, mainToken.decimals);
      const podsFromListing = beanAmount.div(listingPrice);
      const listingPlace = TokenValue.fromBlockchain(listing.index, PODS.decimals).sub(harvestableIndex);

      totalValue += listingPrice.toNumber() * podsFromListing.toNumber();
      totalPods += podsFromListing.toNumber();
      totalPlaceInLine += listingPlace.toNumber() * podsFromListing.toNumber();
    });

    const avgPricePerPod = totalPods > 0 ? totalValue / totalPods : 0;
    const avgPlaceInLine = totalPods > 0 ? totalPlaceInLine / totalPods : 0;

    return {
      avgPricePerPod: TokenValue.fromHuman(avgPricePerPod, mainToken.decimals),
      avgPlaceInLine: TokenValue.fromHuman(avgPlaceInLine, PODS.decimals),
      totalPods,
    };
  }, [listingsToFill, mainToken.decimals, harvestableIndex]);

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
    if (!account.address) {
      toast.error("Please connect your wallet");
      throw new Error("Signer required");
    }
    if (listingsToFill.length === 0) {
      toast.error("No eligible listings to fill");
      throw new Error("No listings to fill");
    }
    if (!mainTokensIn || mainTokensIn.eq(0)) {
      toast.error("No amount specified");
      throw new Error("Amount required");
    }

    // Reset success state when starting new transaction
    setIsSuccessful(false);
    setSuccessPods(null);
    setSuccessAvgPrice(null);
    setSuccessTotal(null);

    // Calculate and save success data to ref (to avoid stale closure in onSuccess callback)
    if (eligibleSummary && mainTokensIn) {
      const estimatedPods = mainTokensIn.div(eligibleSummary.avgPricePerPod).toNumber();
      const avgPrice = eligibleSummary.avgPricePerPod.toNumber();
      const total = mainTokensIn.toNumber();

      successDataRef.current = {
        pods: estimatedPods,
        avgPrice,
        total,
      };
    }

    // Track pod listing fill
    trackSimpleEvent(ANALYTICS_EVENTS.MARKET.POD_LIST_FILL, {
      payment_token: tokenIn.symbol,
      balance_source: balanceFrom,
      eligible_listings_count: listingsToFill.length,
    });

    try {
      setSubmitting(true);
      toast.loading(`Filling ${listingsToFill.length} Listing${listingsToFill.length !== 1 ? "s" : ""}...`);

      if (isUsingMain) {
        // Direct fill - create farm calls for each listing
        const farmData: `0x${string}`[] = [];

        for (const { listing, beanAmount } of listingsToFill) {
          // Encode pricePerPod with 6 decimals (like CreateOrder.tsx)
          const pricePerPodNumber = TokenValue.fromBlockchain(listing.pricePerPod, mainToken.decimals).toNumber();
          const encodedPricePerPod = Math.floor(pricePerPodNumber * PRICE_PER_POD_CONFIG.DECIMAL_MULTIPLIER);

          const fillCall = encodeFunctionData({
            abi: beanstalkAbi,
            functionName: "fillPodListing",
            args: [
              {
                lister: listing.farmer.id as Address,
                fieldId: 0n,
                index: TokenValue.fromBlockchain(listing.index, PODS.decimals).toBigInt(),
                start: TokenValue.fromBlockchain(listing.start, PODS.decimals).toBigInt(),
                podAmount: TokenValue.fromBlockchain(listing.amount, PODS.decimals).toBigInt(),
                pricePerPod: encodedPricePerPod,
                maxHarvestableIndex: TokenValue.fromBlockchain(listing.maxHarvestableIndex, PODS.decimals).toBigInt(),
                minFillAmount: TokenValue.fromBlockchain(listing.minFillAmount, mainToken.decimals).toBigInt(),
                mode: Number(listing.mode),
              },
              beanAmount.toBigInt(),
              Number(balanceFrom),
            ],
          });

          farmData.push(fillCall);
        }

        if (farmData.length === 0) {
          throw new Error("No valid fill operations to execute");
        }

        // Use farm to batch all listing fills in one transaction
        return writeWithEstimateGas({
          address: diamondAddress,
          abi: beanstalkAbi,
          functionName: "farm",
          args: [farmData],
        });
      } else if (swapBuild?.advancedFarm.length) {
        // Swap + fill - use advancedFarm
        const { clipboard } = await swapBuild.deriveClipboardWithOutputToken(mainToken, 9, account.address, {
          value: value ?? TV.ZERO,
        });

        const advFarm = [...swapBuild.advancedFarm];

        // Add fillPodListing calls for each listing
        for (const { listing, beanAmount } of listingsToFill) {
          // Encode pricePerPod with 6 decimals (like CreateOrder.tsx)
          const pricePerPodNumber = TokenValue.fromBlockchain(listing.pricePerPod, mainToken.decimals).toNumber();
          const encodedPricePerPod = Math.floor(pricePerPodNumber * PRICE_PER_POD_CONFIG.DECIMAL_MULTIPLIER);

          const fillCall = fillPodListing(
            listing.farmer.id as Address,
            TokenValue.fromBlockchain(listing.index, PODS.decimals),
            TokenValue.fromBlockchain(listing.start, PODS.decimals),
            TokenValue.fromBlockchain(listing.amount, PODS.decimals),
            encodedPricePerPod,
            TokenValue.fromBlockchain(listing.maxHarvestableIndex, PODS.decimals),
            TokenValue.fromBlockchain(listing.minFillAmount, mainToken.decimals),
            Number(listing.mode),
            beanAmount,
            FarmFromMode.INTERNAL,
            clipboard,
          );

          advFarm.push(fillCall);
        }

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
      const errorMessage = e instanceof Error ? e.message : "Listing Fill Failed";
      toast.error(errorMessage);
      throw e;
    } finally {
      setSubmitting(false);
    }
  }, [
    account.address,
    listingsToFill,
    mainTokensIn,
    balanceFrom,
    swapBuild,
    writeWithEstimateGas,
    setSubmitting,
    isUsingMain,
    value,
    diamondAddress,
    mainToken,
    tokenIn.symbol,
    eligibleSummary,
  ]);

  // Disable submit if no tokens entered, no eligible listings, or no listings to fill
  const disabled = !mainTokensIn || mainTokensIn.eq(0) || listingsToFill.length === 0;

  return (
    <div className="flex flex-col gap-4">
      {/* PodLineGraph Visualization */}
      <div className="flex flex-col gap-3">
        <PodLineGraph
          plots={listingPlots}
          selectedPlotIndices={eligibleListingIds}
          rangeOverlay={rangeOverlay}
          disableInteractions={true}
          label="Available Listings"
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
            placeholder="0.000000"
            outlined
            containerClassName=""
            className=""
            endIcon={<TextAdornment text={mainToken.symbol} className="bg-white" />}
          />
        </div>
        {/* Effective Temperature Display */}
        {maxPricePerPod > 0 && (
          <div className="flex justify-end mr-1">
            <p className="pinto-sm text-pinto-light">
              Effective Temperature (i):{" "}
              <span className="text-green-600 font-semibold">
                {formatter.number((1 / maxPricePerPod) * 100, { minDecimals: 2, maxDecimals: 2 })}%
              </span>
            </p>
          </div>
        )}
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
            <p className="pinto-body text-pinto-light whitespace-nowrap flex-shrink-0 min-w-[80px] text-right">
              {formatter.noDec(maxPlace)}
            </p>
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
              customMaxAmount={maxFillAmount?.gt(0) ? TokenValue.min(balanceFromMode, maxFillAmount) : TokenValue.ZERO}
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
              <SmartApprovalButton
                variant="gradient"
                size="xxl"
                token={tokenIn}
                amount={amountIn}
                balanceFrom={balanceFrom}
                disabled={disabled || !ackSlippage || isConfirming || submitting || isSuccessful}
                className="flex-1"
              />
              <SmartSubmitButton
                variant="gradient"
                size="xxl"
                submitButtonText={isSuccessful ? "Purchase Complete!" : "Buy Pods"}
                token={tokenIn}
                amount={amountIn}
                balanceFrom={balanceFrom}
                submitFunction={onSubmit}
                disabled={disabled || !ackSlippage || submitting || isConfirming || isSuccessful}
                className="flex-1"
              />
            </div>
          </div>
        </div>
      )}

      {/* Success Screen */}
      {isSuccessful && successPods !== null && successAvgPrice !== null && successTotal !== null && (
        <div className="flex flex-col gap-6 w-full animate-fade-in">
          <Separator />

          <div className="flex flex-col gap-3 items-center text-center px-4">
            <p className="pinto-body text-pinto-light">
              You've successfully purchased {formatter.noDec(successPods)} Pods for{" "}
              {formatter.number(successTotal, { minDecimals: 0, maxDecimals: 2 })} Pinto, for an average price of{" "}
              {formatter.number(successAvgPrice, { minDecimals: 2, maxDecimals: 6 })} Pintos per Pod!
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
