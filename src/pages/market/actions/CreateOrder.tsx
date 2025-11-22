import podIcon from "@/assets/protocol/Pod.png";
import { TV, TokenValue } from "@/classes/TokenValue";
import { ComboInputField } from "@/components/ComboInputField";
import FrameAnimator from "@/components/LoadingSpinner";
import type { OverlayParams } from "@/components/MarketChartOverlay";
import PodLineGraph from "@/components/PodLineGraph";
import RoutingAndSlippageInfo, { useRoutingAndSlippageWarning } from "@/components/RoutingAndSlippageInfo";
import SlippageButton from "@/components/SlippageButton";
import SmartApprovalButton from "@/components/SmartApprovalButton";
import SmartSubmitButton from "@/components/SmartSubmitButton";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Separator } from "@/components/ui/Separator";
import { Slider } from "@/components/ui/Slider";
import { ANALYTICS_EVENTS } from "@/constants/analytics-events";
import { PODS } from "@/constants/internalTokens";
import createPodOrder from "@/encoders/createPodOrder";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { useIsWSOL, useTokenMap } from "@/hooks/pinto/useTokenMap";
import useBuildSwapQuote from "@/hooks/swap/useBuildSwapQuote";
import useSwap from "@/hooks/swap/useSwap";
import useSwapSummary from "@/hooks/swap/useSwapSummary";
import { usePreferredInputToken } from "@/hooks/usePreferredInputToken";
import useSafeTokenValue from "@/hooks/useSafeTokenValue";
import useTransaction from "@/hooks/useTransaction";
import usePriceImpactSummary from "@/hooks/wells/usePriceImpactSummary";
import { useFarmerBalances } from "@/state/useFarmerBalances";
import { useHarvestableIndex, usePodIndex } from "@/state/useFieldData";
import { useQueryKeys } from "@/state/useQueryKeys";
import useTokenData from "@/state/useTokenData";
import { trackSimpleEvent } from "@/utils/analytics";
import { formatter } from "@/utils/format";
import { tokensEqual } from "@/utils/token";
import { FarmFromMode, FarmToMode, Token } from "@/utils/types";
import { cn } from "@/utils/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAccount } from "wagmi";

// Constants
const PRICE_PER_POD_CONFIG = {
  MAX: 1,
  MIN: 0.001,
  DECIMALS: 6,
  DECIMAL_MULTIPLIER: 1_000_000, // 10^6 for 6 decimals
} as const;

const MILLION = 1_000_000;
const MIN_FILL_AMOUNT = "1";

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

interface CreateOrderProps {
  onOverlayParamsChange?: (params: OverlayParams) => void;
}

export default function CreateOrder({ onOverlayParamsChange }: CreateOrderProps = {}) {
  const diamondAddress = useProtocolAddress();
  const mainToken = useTokenData().mainToken;
  const { queryKeys: balanceQKs } = useFarmerBalances();
  const { address: account } = useAccount();
  const [inputError, setInputError] = useState(false);

  const queryClient = useQueryClient();
  const { allPodOrders, allMarket, farmerMarket } = useQueryKeys({ account });
  const allQK = useMemo(
    () => [allPodOrders, allMarket, farmerMarket, ...balanceQKs],
    [allPodOrders, allMarket, farmerMarket, balanceQKs],
  );

  const filterTokens = useFilterTokens();
  const { preferredToken, loading: preferredLoading } = usePreferredInputToken({
    filterLP: true,
  });

  const [didSetPreferred, setDidSetPreferred] = useState(false);
  const [amountIn, setAmountIn] = useState("");
  const [tokenIn, setTokenIn] = useState(preferredToken);
  const [balanceFrom, setBalanceFrom] = useState(FarmFromMode.INTERNAL_EXTERNAL);
  const [slippage, setSlippage] = useState(0.1);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [successPods, setSuccessPods] = useState<number | null>(null);
  const [successPricePerPod, setSuccessPricePerPod] = useState<number | null>(null);
  const [successAmountIn, setSuccessAmountIn] = useState<string | null>(null);
  const navigate = useNavigate();

  const successDataRef = useRef<{ pods: number; pricePerPod: number; amountIn: string } | null>(null);

  const shouldSwap = !tokensEqual(tokenIn, mainToken);

  const amountInTV = useSafeTokenValue(amountIn, tokenIn);

  const {
    data: swapData,
    resetSwap,
    ...swapQuery
  } = useSwap({
    tokenIn,
    tokenOut: mainToken,
    slippage,
    amountIn: amountInTV,
    disabled: !shouldSwap || inputError,
  });

  const swapBuild = useBuildSwapQuote(swapData, balanceFrom, FarmToMode.INTERNAL);
  const swapSummary = useSwapSummary(swapData);
  const beansInOrder = !shouldSwap
    ? amountInTV
    : swapSummary?.swap.routes[swapSummary?.swap.routes.length - 1].amountOut ?? TV.ZERO;

  const value = tokenIn.isNative ? amountInTV : undefined;

  const priceImpactQuery = usePriceImpactSummary(swapBuild?.advFarm, tokenIn, value);
  const priceImpactSummary = priceImpactQuery?.get(mainToken);

  const { slippageWarning, canProceed: ackSlippage } = useRoutingAndSlippageWarning({
    totalSlippage: swapSummary?.swap.totalSlippage,
    priceImpact: priceImpactSummary?.priceImpact,
    txnType: "Swap",
  });

  // Pod constants
  const podIndex = usePodIndex();
  const harvestableIndex = useHarvestableIndex();
  const maxPlace = Number.parseInt(podIndex.toHuman()) - Number.parseInt(harvestableIndex.toHuman()) || 0;
  const initialPrice = removeTrailingZeros(PRICE_PER_POD_CONFIG.MIN.toFixed(PRICE_PER_POD_CONFIG.DECIMALS));
  const [maxPlaceInLine, setMaxPlaceInLine] = useState<number | undefined>(undefined);
  const [pricePerPod, setPricePerPod] = useState<number>(PRICE_PER_POD_CONFIG.MIN);
  const [pricePerPodInput, setPricePerPodInput] = useState<string>(initialPrice);

  // set preferred token
  useEffect(() => {
    // If we are still calculating the preferred token, set the token to the preferred token once it's been set.
    if (preferredLoading) return;
    if (preferredToken && !didSetPreferred) {
      setTokenIn(preferredToken);
      setDidSetPreferred(true);
    }
  }, [preferredToken, preferredLoading, didSetPreferred]);

  // Throttle overlay parameter updates for better performance
  const overlayUpdateTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear any pending update
    if (overlayUpdateTimerRef.current) {
      clearTimeout(overlayUpdateTimerRef.current);
    }

    // Throttle overlay updates to avoid performance issues during slider drag
    overlayUpdateTimerRef.current = setTimeout(() => {
      if (maxPlaceInLine && maxPlaceInLine > 0 && pricePerPod > 0) {
        onOverlayParamsChange?.({
          mode: "buy",
          pricePerPod,
          maxPlaceInLine,
        });
      } else {
        onOverlayParamsChange?.(null);
      }
    }, 16); // ~60fps (16ms)

    return () => {
      if (overlayUpdateTimerRef.current) {
        clearTimeout(overlayUpdateTimerRef.current);
      }
    };
  }, [pricePerPod, maxPlaceInLine, onOverlayParamsChange]);

  // Cleanup overlay on unmount
  useEffect(() => {
    return () => {
      onOverlayParamsChange?.(null);
    };
  }, [onOverlayParamsChange]);

  // Token selection handler with tracking
  const handleTokenSelection = useCallback(
    (newToken: Token) => {
      trackSimpleEvent(ANALYTICS_EVENTS.MARKET.ORDER_TOKEN_SELECTED, {
        previous_token: tokenIn.symbol,
        new_token: newToken.symbol,
      });
      setTokenIn(newToken);
    },
    [tokenIn],
  );

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

    if (value === "" || value === ".") {
      setPricePerPod(PRICE_PER_POD_CONFIG.MIN);
      return;
    }

    const numValue = Number.parseFloat(value);
    if (!Number.isNaN(numValue)) {
      const formatted = clampAndFormatPrice(numValue);
      setPricePerPod(formatted);
    }
  }, []);

  const handlePriceInputBlur = useCallback(() => {
    const numValue = Number.parseFloat(pricePerPodInput);
    if (!Number.isNaN(numValue)) {
      const formatted = clampAndFormatPrice(numValue);
      setPricePerPod(formatted);
      setPricePerPodInput(removeTrailingZeros(formatted.toFixed(PRICE_PER_POD_CONFIG.DECIMALS)));
    } else {
      const formatted = clampAndFormatPrice(PRICE_PER_POD_CONFIG.MIN);
      setPricePerPod(formatted);
      setPricePerPodInput(removeTrailingZeros(formatted.toFixed(PRICE_PER_POD_CONFIG.DECIMALS)));
    }
  }, [pricePerPodInput]);

  // Max place in line slider handler
  const handleMaxPlaceSliderChange = useCallback((value: number[]) => {
    const newValue = Math.floor(value[0]);
    setMaxPlaceInLine(newValue > 0 ? newValue : undefined);
  }, []);

  // Max place in line input handler
  const handleMaxPlaceInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const cleanValue = e.target.value.replace(/,/g, "");
      const value = Number.parseInt(cleanValue);
      if (!Number.isNaN(value) && value > 0 && value <= maxPlace) {
        setMaxPlaceInLine(value);
      } else if (cleanValue === "") {
        setMaxPlaceInLine(undefined);
      }
    },
    [maxPlace],
  );

  // Calculate pods out for success message
  const podsOut = useMemo(() => {
    if (!pricePerPod || pricePerPod <= 0 || beansInOrder.isZero) return 0;
    const pricePerPodTV = TokenValue.fromHuman(pricePerPod.toString(), beansInOrder.decimals);
    return beansInOrder.div(pricePerPodTV).reDecimal(PODS.decimals).toNumber();
  }, [beansInOrder, pricePerPod]);

  // invalidate pod orders query
  const onSuccess = useCallback(() => {
    // Set success state from ref (to avoid stale closure)
    if (successDataRef.current) {
      const { pods, pricePerPod, amountIn } = successDataRef.current;
      setSuccessPods(pods);
      setSuccessPricePerPod(pricePerPod);
      setSuccessAmountIn(amountIn);
      setIsSuccessful(true);
      successDataRef.current = null; // Clear ref after use
    }

    setAmountIn("");
    setMaxPlaceInLine(undefined);
    setPricePerPod(PRICE_PER_POD_CONFIG.MIN);
    setPricePerPodInput(initialPrice);
    allQK.forEach((key) => queryClient.invalidateQueries({ queryKey: key }));
  }, [queryClient, allQK, initialPrice]);

  // state for toast txns
  const { isConfirming, writeWithEstimateGas, submitting, setSubmitting } = useTransaction({
    successMessage: "Order creation successful",
    errorMessage: "Order creation failed",
    successCallback: onSuccess,
  });

  // submit txn
  const onSubmit = useCallback(async () => {
    // Reset success state when starting new transaction
    setIsSuccessful(false);
    setSuccessPods(null);
    setSuccessPricePerPod(null);
    setSuccessAmountIn(null);

    // Save success data to ref (to avoid stale closure in onSuccess callback)
    successDataRef.current = {
      pods: podsOut,
      pricePerPod: pricePerPod || 0,
      amountIn: amountIn,
    };

    // Track pod order creation
    trackSimpleEvent(ANALYTICS_EVENTS.MARKET.POD_ORDER_CREATE, {
      payment_token: tokenIn.symbol,
      balance_source: balanceFrom,
      has_price_per_pod: !!pricePerPod,
      has_max_place: !!maxPlaceInLine,
    });

    if (!account) {
      throw new Error("No account connected");
    }
    if (shouldSwap && (!swapData || !swapBuild?.advancedFarm?.length)) {
      throw new Error("No quote");
    }

    if (amountInTV.isZero) {
      throw new Error("Amount required");
    }

    const advFarm = shouldSwap && swapBuild ? [...swapBuild.advancedFarm] : [];

    const _amount = shouldSwap ? TV.ZERO : amountInTV;
    const fromMode = shouldSwap ? FarmFromMode.INTERNAL : balanceFrom;
    const orderClipboard =
      shouldSwap && swapBuild
        ? await swapBuild.deriveClipboardWithOutputToken(mainToken, 5, account, {
            value: value ?? TV.ZERO,
          })
        : undefined;

    const _maxPlaceInLine = TokenValue.fromHuman(maxPlaceInLine?.toString() || "0", PODS.decimals);
    // pricePerPod should be encoded as uint24 with 6 decimals (0.5 * 1_000_000 = 500000)
    const encodedPricePerPod = pricePerPod ? Math.floor(pricePerPod * PRICE_PER_POD_CONFIG.DECIMAL_MULTIPLIER) : 0;
    const minFill = TokenValue.fromHuman(MIN_FILL_AMOUNT, PODS.decimals);

    const orderCallStruct = createPodOrder(
      account,
      _amount,
      encodedPricePerPod,
      _maxPlaceInLine,
      minFill,
      fromMode,
      orderClipboard?.clipboard,
    );

    advFarm.push(orderCallStruct);

    try {
      setSubmitting(true);
      toast.loading("Creating Order...");
      return writeWithEstimateGas({
        address: diamondAddress,
        abi: advFarmABI,
        functionName: "advancedFarm",
        args: [advFarm],
        value: (value ?? TV.ZERO).toBigInt(),
      });
    } catch (e) {
      console.error(e);
      toast.dismiss();
      toast.error("Create Order failed");
      throw e;
    } finally {
      setSubmitting(false);
    }
  }, [
    account,
    shouldSwap,
    swapData,
    amountInTV,
    value,
    maxPlaceInLine,
    pricePerPod,
    balanceFrom,
    writeWithEstimateGas,
    setSubmitting,
    diamondAddress,
    mainToken,
    swapBuild,
    tokenIn.symbol,
    podsOut,
    amountIn,
  ]);

  const swapDataNotReady = (shouldSwap && (!swapData || !swapBuild)) || !!swapQuery.error;

  // ui state
  const formIsFilled = !!pricePerPod && !!maxPlaceInLine && !!account && amountInTV.gt(0);
  const disabled = !formIsFilled || swapDataNotReady;

  // Calculate orderRangeEnd for PodLineGraph overlay
  const orderRangeEnd = useMemo(() => {
    if (!maxPlaceInLine) return undefined;
    return harvestableIndex.add(TokenValue.fromHuman(maxPlaceInLine.toString(), PODS.decimals));
  }, [maxPlaceInLine, harvestableIndex]);

  return (
    <div className="flex flex-col gap-4">
      {/* PodLineGraph Visualization */}
      <PodLineGraph orderRangeEnd={orderRangeEnd} disableInteractions={true} label="Order Range" />

      {/* Place in Line Slider */}
      <div className="flex flex-col gap-3 mt-2">
        <p className="pinto-body text-pinto-light">I want to order Pods with a Place in Line up to:</p>
        {maxPlace === 0 ? (
          <p className="pinto-sm text-pinto-light italic">No Pods in Line currently available to order.</p>
        ) : (
          <div className="flex flex-row gap-4 w-full items-center">
            <div className="flex flex-row gap-4 items-center flex-1">
              <p className="pinto-body text-pinto-light">0</p>
              {maxPlace > 0 && (
                <Slider
                  value={[maxPlaceInLine || 0]}
                  onValueChange={handleMaxPlaceSliderChange}
                  step={1}
                  min={0}
                  max={maxPlace}
                  className="flex-1"
                />
              )}
              <p className="pinto-body text-pinto-light">{formatter.noDec(maxPlace)}</p>
            </div>
            <Input
              type="text"
              inputMode="numeric"
              value={maxPlaceInLine ? formatter.noDec(maxPlaceInLine) : ""}
              onChange={handleMaxPlaceInputChange}
              onFocus={(e) => e.target.select()}
              placeholder={formatter.noDec(maxPlace)}
              outlined
              containerClassName="w-[108px]"
              className=""
              disabled={maxPlace === 0}
            />
          </div>
        )}
      </div>

      {/* Show these sections only when maxPlaceInLine is greater than 0 */}
      {maxPlaceInLine !== undefined && maxPlaceInLine > 0 && (
        <div className="flex flex-col gap-4 animate-fade-in">
          {/* Price Per Pod */}
          <div className="flex flex-col gap-2">
            <p className="pinto-body text-pinto-light">I am willing to buy Pods up to:</p>
            <div className="flex flex-row gap-4 w-full items-center">
              <div className="flex flex-row gap-4 items-center">
                <p className="pinto-body text-pinto-light">0</p>
                <Slider
                  min={PRICE_PER_POD_CONFIG.MIN}
                  max={PRICE_PER_POD_CONFIG.MAX}
                  step={0.000001}
                  value={[pricePerPod || PRICE_PER_POD_CONFIG.MIN]}
                  onValueChange={handlePriceSliderChange}
                  className="w-[18rem]"
                />
                <p className="pinto-body text-pinto-light">1</p>
              </div>
              <Input
                type="text"
                inputMode="decimal"
                value={pricePerPodInput}
                onChange={handlePriceInputChange}
                onBlur={handlePriceInputBlur}
                onFocus={(e) => e.target.select()}
                placeholder="0.001"
                outlined
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

          {/* Order Using Section */}
          <div className="-mt-2">
            <div className="flex flex-row justify-between items-center">
              <p className="pinto-body text-pinto-light">Order Using</p>
              <SlippageButton slippage={slippage} setSlippage={setSlippage} />
            </div>
            <ComboInputField
              amount={amountIn}
              connectedAccount={!!account}
              disableInput={isConfirming || submitting}
              setAmount={setAmountIn}
              setToken={handleTokenSelection}
              setBalanceFrom={setBalanceFrom}
              setError={setInputError}
              error={inputError}
              selectedToken={tokenIn}
              balanceFrom={balanceFrom}
              filterTokens={filterTokens}
              tokenSelectLoading={preferredLoading || !didSetPreferred}
              disableClamping={true}
              enableSlider
              sliderMarkers={[25, 50, 75]}
            />
            {shouldSwap && amountInTV.gt(0) && (
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
            {disabled && formIsFilled && (
              <div className="flex justify-center">
                <FrameAnimator className="-mt-5 -mb-10" size={150} />
              </div>
            )}
            {!disabled && (
              <ActionSummary beansIn={beansInOrder} pricePerPod={pricePerPod} maxPlaceInLine={maxPlaceInLine} />
            )}
            <div className="flex flex-row gap-2 items-center w-full">
              <SmartApprovalButton
                token={tokenIn}
                amount={amountIn}
                balanceFrom={balanceFrom}
                variant="gradient"
                size="xxl"
                disabled={disabled || !ackSlippage || isConfirming || submitting}
                className="flex-1"
              />
              <SmartSubmitButton
                variant="gradient"
                size="xxl"
                submitButtonText={isSuccessful ? "Order Placed!" : "Place Pod Order"}
                token={tokenIn}
                disabled={disabled || !ackSlippage || isConfirming || submitting || isSuccessful}
                amount={amountIn}
                balanceFrom={balanceFrom}
                submitFunction={onSubmit}
                className="flex-1"
              />
            </div>
          </div>
        </div>
      )}

      {/* Success Screen */}
      {isSuccessful && successPods !== null && successPricePerPod !== null && successAmountIn !== null && (
        <div className="flex flex-col gap-6 w-full animate-fade-in">
          <Separator />

          <div className="flex flex-col gap-3 items-center text-center px-4">
            <p className="pinto-body text-pinto-light">
              You have successfully placed an order for {formatter.noDec(successPods)} Pods at{" "}
              {formatter.number(successPricePerPod, { minDecimals: 2, maxDecimals: 6 })} Pintos per Pod, with{" "}
              {formatter.number(Number.parseFloat(successAmountIn) || 0, { minDecimals: 0, maxDecimals: 2 })}{" "}
              {tokenIn.symbol}!
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

interface ActionSummaryProps {
  beansIn: TV;
  pricePerPod: number;
  maxPlaceInLine: number;
}

const ActionSummary = ({ beansIn, pricePerPod, maxPlaceInLine }: ActionSummaryProps) => {
  // Calculate pods out - memoized to avoid recalculation
  const podsOut = useMemo(() => {
    // pricePerPod is Pinto per Pod (0-1), convert to TokenValue with same decimals as beansIn (mainToken decimals)
    // Then divide to get pods and convert to Pods decimals
    const pricePerPodTV = TokenValue.fromHuman(pricePerPod.toString(), beansIn.decimals);
    return beansIn.div(pricePerPodTV).reDecimal(PODS.decimals);
  }, [beansIn, pricePerPod]);

  return (
    <div className="flex flex-col gap-4">
      <p className="pinto-body text-pinto-light">If my order is filled, I will receive</p>
      <div className="flex flex-col gap-2">
        <p className="pinto-h3 flex flex-row items-center gap-2 -mt-1">
          <img src={podIcon} className="w-8 h-8" alt={"order summary pods"} />
          {formatter.number(podsOut, { minDecimals: 0, maxDecimals: 2 })} Pods
        </p>
        <p className="pinto-body text-pinto-light">between 0 and {formatter.noDec(maxPlaceInLine)} in Line.</p>
        <p className="pinto-sm text-pinto-light">You can cancel the order at any time.</p>
      </div>
    </div>
  );
};

const advFarmABI = [
  {
    type: "function",
    inputs: [
      {
        name: "data",
        internalType: "struct AdvancedFarmCall[]",
        type: "tuple[]",
        components: [
          { name: "callData", internalType: "bytes", type: "bytes" },
          { name: "clipboard", internalType: "bytes", type: "bytes" },
        ],
      },
    ],
    name: "advancedFarm",
    outputs: [{ name: "results", internalType: "bytes[]", type: "bytes[]" }],
    stateMutability: "payable",
  },
] as const;
