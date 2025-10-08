import arrowDown from "@/assets/misc/ChevronDown.svg";
import { TV } from "@/classes/TokenValue";
import { ComboInputField } from "@/components/ComboInputField";
import { RightArrowIcon } from "@/components/Icons";
import FrameAnimator from "@/components/LoadingSpinner";
import MobileActionBar from "@/components/MobileActionBar";
import QuotedRoutesSelector from "@/components/QuotedRoutesSelector";
import RoutingAndSlippageInfo from "@/components/RoutingAndSlippageInfo";
import SiloOutputDisplay from "@/components/SiloOutputDisplay";
import SlippageButton from "@/components/SlippageButton";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/Dialog";
import IconImage from "@/components/ui/IconImage";
import { Label } from "@/components/ui/Label";
import { Separator } from "@/components/ui/Separator";
import VerticalAccordion from "@/components/ui/VerticalAccordion";
import Warning from "@/components/ui/Warning";
import { diamondABI } from "@/constants/abi/diamondABI";
import { ANALYTICS_EVENTS } from "@/constants/analytics-events";
import { SEEDS } from "@/constants/internalTokens";
import { CONVERT_DOWN_PENALTY_RATE_WITH_BUFFER, NO_MAX_CONVERT_AMOUNT } from "@/constants/silo";
import { MAIN_TOKEN, PINTO_USDC_TOKEN, PINTO_WSOL_TOKEN } from "@/constants/tokens";
import useDelayedLoading from "@/hooks/display/useDelayedLoading";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { useTokenMap } from "@/hooks/pinto/useTokenMap";
import useSiloConvert, {
  useClearSiloConvertQueries,
  useSiloConvertQuote,
  useSiloMaxConvertQuery,
} from "@/hooks/silo/useSiloConvert";
import { useExtractSiloConvertResultPriceResults, useSiloConvertResult } from "@/hooks/silo/useSiloConvertResult";
import {
  SiloConvertGrownStalkPenaltyBreakdown,
  useSiloConvertDownPenaltyQuery,
} from "@/hooks/silo/useSiloGrownStalkPenalty";
import useTransaction from "@/hooks/useTransaction";
import { useDeterminePriceImpactWithResults } from "@/hooks/wells/usePriceImpactSummary";
import { useWellUnderlying } from "@/hooks/wells/wells";
import { SiloConvert, SiloConvertSummary } from "@/lib/siloConvert/SiloConvert";
import { MaxConvertResult } from "@/lib/siloConvert/SiloConvert.maxConvertQuoter";
import { SiloConvertType } from "@/lib/siloConvert/strategies/core";
import ConvertProvider, { SiloTokenConvertPath, useConvertState } from "@/state/context/convert.provider";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { PoolData, usePriceData } from "@/state/usePriceData";
import { useSiloData } from "@/state/useSiloData";
import { useInvalidateSun } from "@/state/useSunData";
import { trackSimpleEvent } from "@/utils/analytics";
import { getChainConstant, useChainConstant } from "@/utils/chain";
import { formatter } from "@/utils/format";
import { stringEq, stringToNumber } from "@/utils/string";
import { getTokenIndex, tokensEqual } from "@/utils/token";
import { AddressMap, Token } from "@/utils/types";
import { useDebounceValue } from "@/utils/useDebounce";
import { cn, exists, noop } from "@/utils/utils";
import { UseQueryResult, useQueryClient } from "@tanstack/react-query";
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useAccount } from "wagmi";

interface BaseConvertProps {
  siloToken: Token;
}

interface ConvertProps extends BaseConvertProps {
  siloConvert: SiloConvert;
  queryClient: ReturnType<typeof useQueryClient>;
  farmerDeposits: ReturnType<typeof useFarmerSilo>["deposits"];
  farmerActiveStalk: TV;
  averageGrownStalkPerBdvPerSeason: TV;
  deltaP: TV;
  convertExceptions: ReturnType<typeof useConvertExceptions>;
  onSuccess: () => void;
}

// INNER COMPONENT
function ConvertForm({
  siloToken,
  deltaP,
  farmerActiveStalk,
  averageGrownStalkPerBdvPerSeason,
  convertExceptions,
  farmerDeposits,
  siloConvert,
  onSuccess,
}: ConvertProps) {
  const { mode, targetToken, setTargetToken } = useSiloConvertContext();

  const diamond = useProtocolAddress();
  const pintoToken = useChainConstant(MAIN_TOKEN);
  const account = useAccount();
  const [amountIn, setAmountIn] = useState("");
  const [slippage, setSlippage] = useState(0.25);
  const [maxConvert, setMaxConvert] = useState(TV.ZERO);
  const [didInitAmountMax, setDidInitAmountMax] = useState(false);
  const [showMinAmountWarning, setShowMinAmountWarning] = useState(false);
  const [allowStalkPenalty, setAllowStalkPenalty] = useState(false);

  const { loading, setLoadingTrue, setLoadingFalse } = useDelayedLoading();
  const clearSiloConvertQueries = useClearSiloConvertQueries();
  const invalidateSun = useInvalidateSun();
  const { tokenPrices, pools } = usePriceData();

  const minAmountIn = convertExceptions.minAmountIn;
  const isDefaultConvert = siloToken.isMain || targetToken?.isMain;
  const defaultConvertDeltaPEnabled = siloToken.isMain ? deltaP.gt(0) : siloToken.isLP ? deltaP.lt(0) : false;
  const deltaPEnabled = Boolean(isDefaultConvert && defaultConvertDeltaPEnabled);
  const targetDeposits = targetToken ? farmerDeposits.get(targetToken) : undefined;
  const isDownConvert = Boolean(siloToken.isMain && targetToken?.isLP);

  const deposits = farmerDeposits.get(siloToken);

  const convertibleDeposits = deposits?.convertibleDeposits;
  const farmerConvertibleAmount = deposits?.convertibleAmount || TV.ZERO;
  const hasConvertible = minAmountIn && farmerConvertibleAmount.gt(0) && farmerConvertibleAmount.gte(minAmountIn);

  const hasGerminating = deposits?.amount.gt(0) && !deposits?.amount.eq(deposits.convertibleAmount);

  const maxConvertQuery = useSiloMaxConvertQuery(
    siloConvert,
    deposits,
    siloToken,
    targetToken,
    !!(isDefaultConvert ? hasConvertible && deltaPEnabled : hasConvertible),
  );

  const maxConvertOverall = maxConvertQuery.data?.max ?? TV.ZERO;
  const maxConvertAtRate = maxConvertQuery.data?.maxAtRate;

  const poolPrice = useMemo(
    () =>
      pools.find((pool) => pool.pool.address.toLowerCase() === targetToken?.address.toLowerCase())?.price ?? TV.ZERO,
    [pools, targetToken],
  );

  const maxConvertQueryData =
    (poolPrice.gt(CONVERT_DOWN_PENALTY_RATE_WITH_BUFFER) ? maxConvertAtRate : maxConvertOverall) ?? TV.ZERO;

  const maxConvertLoading = maxConvertQuery.isLoading;

  const amountInNum = stringToNumber(amountIn);
  const isValidAmountIn = Boolean(minAmountIn?.gt(0) ? amountInNum >= minAmountIn.toNumber() : amountInNum > 0);

  const quoteConditionsEnabled = isDefaultConvert
    ? deltaPEnabled && maxConvert.gt(0) && isValidAmountIn
    : isValidAmountIn;

  const quoteEnabled = account.address && isValidAmountIn && quoteConditionsEnabled;

  // ------------------------------ QUOTE ------------------------------

  const {
    data: quote,
    isLoading: quoteLoading,
    ...quoteQuery
  } = useSiloConvertQuote(siloConvert, siloToken, targetToken, amountIn, convertibleDeposits, slippage, quoteEnabled);

  const [routeIndex, setRouteIndex] = useState<number | undefined>(undefined);

  const { results: convertResults, sortedIndexes, showRoutes } = useSiloConvertResult(siloToken, targetToken, quote);
  const grownStalkPenaltyQuery = useSiloConvertDownPenaltyQuery(siloToken, targetToken, convertResults, isDownConvert);

  const convertPriceResults = useExtractSiloConvertResultPriceResults(quote);
  const priceImpact = useDeterminePriceImpactWithResults(convertPriceResults);

  // initialize the route index to the first sorted index
  useEffect(() => {
    if (!sortedIndexes?.length || routeIndex !== undefined) {
      return;
    }

    setRouteIndex(sortedIndexes[0]);
  }, [sortedIndexes, routeIndex]);

  const selectedRoute = exists(routeIndex) && quote?.[routeIndex] ? quote[routeIndex] : undefined;

  const selectedPriceImpact =
    exists(routeIndex) && priceImpact.priceImpactByWell?.[routeIndex]
      ? priceImpact.priceImpactByWell[routeIndex]
      : undefined;

  const priceImpactSummaries1 = !siloToken.isMain ? priceImpact.get(siloToken) : undefined;
  const priceImpactSummaires2 = targetToken && !targetToken.isMain ? priceImpact.get(targetToken) : undefined;

  const convertResult = exists(routeIndex) ? convertResults?.[routeIndex] : undefined;
  const priceImpactSummary1 =
    exists(routeIndex) && exists(priceImpactSummaries1) ? priceImpactSummaries1[routeIndex] : undefined;
  const priceImpactSummary2 =
    exists(routeIndex) && exists(priceImpactSummaires2) ? priceImpactSummaires2[routeIndex] : undefined;

  const amountOut = quote?.[0]?.totalAmountOut ?? TV.ZERO;

  const depositsMowAmount = deposits?.stalk.grown;
  const targetDepositsMowAmount = targetDeposits?.stalk.grown;

  // The expected total amount of stalk from 'balanceOfStalk(account)' after the convert.
  const expectedTotalStalk = useMemo(() => {
    if (!convertResult) return;

    // PipelineConvert will mow the source & target deposits.
    const mowAmount = depositsMowAmount?.add(targetDepositsMowAmount ?? 0n) ?? TV.ZERO;
    // Add mow amounts & subtract any germinating stalk as a result of the convert.
    const currTotalStalk = farmerActiveStalk.add(mowAmount).sub(convertResult.germinatingStalk);

    // Add the expected delta stalk
    return currTotalStalk.add(convertResult.deltaStalk);
  }, [convertResult, farmerActiveStalk, depositsMowAmount, targetDepositsMowAmount]);

  // ------------------------------ TXN SUBMISSION ------------------------------

  const successCallback = useCallback(() => {
    setAmountIn("");
    setTargetToken(undefined);
    setRouteIndex(undefined);
    siloConvert.clear();
    onSuccess();
    invalidateSun("all", { refetchType: "active" });
    clearSiloConvertQueries();
    setShowMinAmountWarning(false);
  }, [setTargetToken, invalidateSun, onSuccess, clearSiloConvertQueries, siloConvert]);

  const { writeWithEstimateGas, isConfirming, submitting, setSubmitting } = useTransaction({
    successMessage: "Convert successful",
    errorMessage: "Convert failed",
    successCallback: successCallback,
  });

  const onSubmit = useCallback(async () => {
    setSubmitting(true);
    try {
      if (!targetToken) throw new Error("Target token not set");
      if (!account.address) throw new Error("Signer required");
      if (!exists(routeIndex)) throw new Error("No route index");
      const bestQuote = quote?.[routeIndex];
      if (!bestQuote || bestQuote.totalAmountOut.lte(0) || !expectedTotalStalk) throw new Error("No convert quote");

      // Track convert submission
      trackSimpleEvent(ANALYTICS_EVENTS.SILO.CONVERT_SUBMIT, {
        source_token: siloToken.symbol,
        target_token: targetToken.symbol,
        has_penalty: allowStalkPenalty,
      });

      toast.loading(`Converting...`);
      if (isDefaultConvert) {
        // If there is only 1 quote, we can unwrap the quote & use the convert funciton directly instead of using advancedFarm
        if (bestQuote.quotes.length === 1 && bestQuote.route.convertType === "LPAndMain") {
          const singleQuote = bestQuote.quotes[0];
          const convertData = singleQuote.convertData;
          const crates = singleQuote.pickedCrates.crates;
          const stems = crates.map((crate) => crate.stem.toBigInt());
          const amounts = crates.map((crate) => crate.amount.toBigInt());
          if (!convertData || !stems.length || !amounts.length || stems.length !== amounts.length) {
            throw new Error("Invalid convert data");
          }
          return writeWithEstimateGas({
            address: diamond,
            abi: diamondABI,
            functionName: "convert",
            args: [convertData, stems, amounts],
          });
        }
      }
      const encodedAdvFarm = [...bestQuote.workflow.getSteps()];
      if (!isDefaultConvert) {
        const grownStalkChecks = siloConvert.getStalkChecks(expectedTotalStalk);
        encodedAdvFarm.push(grownStalkChecks.encode());
      }
      return writeWithEstimateGas({
        address: diamond,
        abi: diamondABI,
        functionName: "advancedFarm",
        args: [encodedAdvFarm],
      });
    } catch (e) {
      console.error(e);
      toast.error("Convert failed");
      return e;
    } finally {
      setSubmitting(false);
    }
  }, [
    setSubmitting,
    writeWithEstimateGas,
    isDefaultConvert,
    diamond,
    routeIndex,
    account.address,
    targetToken,
    quote,
    expectedTotalStalk,
    siloConvert,
  ]);

  // ------------------------------ EFFECTS ------------------------------

  // if url mode === 'max', set amount in to max convert
  useEffect(() => {
    if (mode !== "max" || !targetToken || didInitAmountMax || maxConvert.lte(0)) return;
    setDidInitAmountMax(true);
    setAmountIn(maxConvert.toHuman());
  }, [mode, targetToken, didInitAmountMax, maxConvert]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Reset amount in when target token changes
  useEffect(() => {
    setAmountIn("");
    setMaxConvert(TV.ZERO);
    setRouteIndex(undefined);
    setShowMinAmountWarning(false);
  }, [targetToken]);

  useEffect(() => {
    if (quoteLoading) setLoadingTrue();
    else if (!quoteLoading) setLoadingFalse();
  }, [quoteLoading, setLoadingTrue, setLoadingFalse]);

  // set the maximum amount that can be converted
  useEffect(() => {
    if (!targetToken) {
      setMaxConvert(TV.ZERO);
      return;
    }

    const maxAmount = isDefaultConvert
      ? TV.min(deltaPEnabled ? maxConvertQueryData : TV.ZERO, farmerConvertibleAmount)
      : farmerConvertibleAmount;

    let finalMaxAmount = maxAmount;

    // Cap at $10k USD when converting PINTOWSOL to PINTO
    const pintowsol = getChainConstant(siloToken.chainId, PINTO_WSOL_TOKEN);
    if (tokensEqual(siloToken, pintowsol) && targetToken.isMain) {
      const tokenPriceBigInt = tokenPrices.get(siloToken)?.instant?.toBigInt();
      if (tokenPriceBigInt) {
        const usdThreshold = TV.fromHuman("10000", 6); // $10,000 USD
        const maxAmountInToken = usdThreshold.div(TV.fromBigInt(tokenPriceBigInt, 6));
        finalMaxAmount = TV.min(maxAmount, maxAmountInToken);
      }
    }

    setMaxConvert(minAmountIn?.gt(finalMaxAmount) ? TV.ZERO : finalMaxAmount);
  }, [
    targetToken,
    minAmountIn,
    isDefaultConvert,
    deltaPEnabled,
    maxConvertQueryData,
    farmerConvertibleAmount,
    siloToken,
    tokenPrices,
  ]);

  // Show warning if amount is less than min amount
  useEffect(() => {
    if (showMinAmountWarning || !minAmountIn || minAmountIn.eq(0)) {
      return;
    }

    if (!TV.ZERO.eq(amountInNum) && minAmountIn.gt(amountInNum)) {
      setShowMinAmountWarning(true);
    }
  }, [amountInNum, minAmountIn, showMinAmountWarning]);

  // Auto-default target token to PINTO when converting from LP tokens
  useEffect(() => {
    if (!siloToken.isLP || targetToken || !pintoToken) return;
    setTargetToken(pintoToken);
  }, [siloToken.isLP, targetToken, pintoToken, setTargetToken]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Reset stalk penalty toggle when amount in changes
  useEffect(() => {
    setAllowStalkPenalty(false);
  }, [amountIn]);
  // ------------------------------ DERIVED ------------------------------

  const canConvert = isDefaultConvert ? hasConvertible && deltaPEnabled : hasConvertible;
  const canExceedMax = farmerConvertibleAmount?.gt(maxConvert);

  const renderGerminatingStalkWarning = !(!convertResult || convertResult.germinatingStalk.lte(0));

  const renderDownPenaltyWarning = !(
    !siloToken.isLP ||
    !targetToken?.isLP ||
    maxConvertQueryData.lte(0) ||
    maxConvertQueryData.eq(NO_MAX_CONVERT_AMOUNT)
  );

  const renderMinAmountWarning = minAmountIn?.gt(0) && !isValidAmountIn;

  const renderGrownStalkPenaltyWarning =
    exists(grownStalkPenaltyQuery.data) &&
    exists(routeIndex) &&
    exists(grownStalkPenaltyQuery.data[routeIndex]) &&
    grownStalkPenaltyQuery.data[routeIndex].isPenalty;

  const warningRendered =
    renderGerminatingStalkWarning ||
    renderDownPenaltyWarning ||
    renderMinAmountWarning ||
    renderGrownStalkPenaltyWarning;

  const disabled =
    !targetToken ||
    !stringToNumber(amountIn) ||
    !isValidAmountIn ||
    !hasConvertible ||
    amountOut?.lte(0) ||
    (renderGrownStalkPenaltyWarning ? !allowStalkPenalty : false) ||
    !account.address ||
    isConfirming ||
    submitting ||
    loading;

  const getAltTextProps = () => {
    let alt: string = "Deposited";

    if (canExceedMax) alt = "Convertible";
    else if (hasGerminating) alt = "Available";

    return {
      altText: `${alt} Balance:`,
      altTextMobile: `${alt}:`,
    };
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <div className="flex flex-row justify-between items-center">
          <div className="pinto-sm sm:pinto-body-light sm:text-pinto-light text-pinto-light">From</div>
          <SlippageButton slippage={slippage} setSlippage={setSlippage} />
        </div>
        <ComboInputField
          disableInput={!canConvert || !account.address || !farmerConvertibleAmount?.gt(0)}
          disableInlineBalance={!targetToken}
          disableClampMinOn0={true}
          amount={amountIn}
          setToken={noop}
          customMinAmount={minAmountIn}
          customMaxAmount={maxConvert}
          setAmount={setAmountIn}
          selectedToken={siloToken}
          {...getAltTextProps()}
          mode="balance"
          disableButton
          isLoading={targetToken && maxConvertLoading}
        />
      </div>
      {warningRendered ? (
        <div className="flex flex-col gap-2">
          <MinAmountWarning enabled={!!renderMinAmountWarning} minAmountIn={minAmountIn} siloToken={siloToken} />
          <ConvertWarning
            canConvert={!!canConvert}
            canExceedMax={canExceedMax}
            deltaPEnabled={deltaPEnabled}
            farmerConvertibleAmount={farmerConvertibleAmount}
            targetToken={targetToken}
            siloToken={siloToken}
            maxConvertQuery={maxConvertQuery}
            isDefaultConvert={!!isDefaultConvert}
            maxConvert={maxConvert}
          />
          <LP2LPMinConvertWarning
            enabled={!!renderDownPenaltyWarning}
            maxConvertQueryData={maxConvertQueryData}
            siloToken={siloToken}
          />
          <GrownStalkPenaltyWarning
            enabled={!!renderGrownStalkPenaltyWarning}
            summary={exists(routeIndex) ? grownStalkPenaltyQuery.data?.[routeIndex] : undefined}
            averageGrownStalkPerBdvPerSeason={averageGrownStalkPerBdvPerSeason}
            allowStalkPenalty={allowStalkPenalty}
            setAllowStalkPenalty={setAllowStalkPenalty}
          />
        </div>
      ) : null}
      <ConvertTokenOutput route={selectedRoute} siloToken={siloToken} />
      <div className="flex flex-col">
        {loading && !quoteQuery.isError ? (
          <div className="flex flex-col w-full h-[181px] items-center justify-center">
            <FrameAnimator size={64} />
          </div>
        ) : convertResult ? (
          <>
            <GerminatingStalkWarning
              enabled={!!renderGerminatingStalkWarning}
              germinatingStalk={convertResult.germinatingStalk}
              germinatingSeasons={convertResult.germinatingSeasons}
            />
            <SiloOutputDisplay
              amount={convertResult.totalAmountOut}
              token={targetToken}
              stalk={convertResult.deltaStalk}
              seeds={convertResult.deltaSeed}
            />
          </>
        ) : null}
        {targetToken && isValidAmountIn && showRoutes && (
          <QuotedRoutesSelector
            quote={quote}
            convertResults={convertResults}
            sortedIndexes={sortedIndexes}
            routeIndex={routeIndex}
            targetToken={targetToken}
            onRouteSelect={setRouteIndex}
          />
        )}
        {targetToken && isValidAmountIn && selectedRoute && (
          <RoutingAndSlippageInfo
            title="Total Convert Slippage"
            priceImpactSummary={priceImpactSummary1 || priceImpactSummary2}
            secondaryPriceImpactSummary={priceImpactSummary1 && priceImpactSummary2}
            priceImpact={selectedPriceImpact}
            convertSummary={selectedRoute}
            preferredSummary="priceImpact"
            txnType="Convert"
            tokenIn={siloToken}
            tokenOut={targetToken}
          />
        )}
      </div>
      <>
        <Button {...actionButtonSharedProps} onClick={onSubmit} disabled={disabled} className="hidden sm:flex">
          Convert
        </Button>
        <MobileActionBar>
          <Button {...actionButtonSharedProps} onClick={onSubmit} disabled={disabled} className="h-full">
            Convert
          </Button>
        </MobileActionBar>
      </>
    </div>
  );
}

const actionButtonSharedProps = {
  variant: "gradient",
  type: "button",
  rounded: "full",
  width: "full",
  size: "xxl",
} as const;

// ------------------------------ CONTEXT ------------------------------

interface ConvertContext {
  targetToken: Token | undefined;
  mode?: string;
  setTargetToken: React.Dispatch<React.SetStateAction<Token | undefined>>;
}

const ConvertContext = createContext<ConvertContext | null>(null);

const useSiloConvertContext = () => {
  const context = useContext(ConvertContext);
  if (!context) {
    throw new Error("useConvertContext must be used within a ConvertProvider");
  }
  return context;
};

const SiloConvertProvider = ({ children }: { children: React.ReactNode }) => {
  const [params] = useSearchParams();
  const tokenMap = useTokenMap();

  const [mode, setMode] = useState<string | undefined>(undefined);
  const [targetToken, setTargetToken] = useState<Token | undefined>(undefined);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Only run on mount
  useEffect(() => {
    const tokenValue = params.get("target");
    const modeValue = params.get("mode");

    if (!tokenValue) return;
    const token = tokenMap[getTokenIndex(tokenValue)];

    if (token) {
      setTargetToken(token);
      if (modeValue) {
        setMode(modeValue);
      }
    }
  }, []);

  return (
    <ConvertContext.Provider
      value={{
        targetToken,
        mode,
        setTargetToken,
      }}
    >
      {children}
    </ConvertContext.Provider>
  );
};

/**
 * Due to rounding errors in stable swap, we set a minimum of 5 BDV for
 * converting in and out of PINTOUSDC.
 */
const STABLE_SWAP_MIN_BDV = TV.fromHuman(5, 6);

const useConvertExceptions = ({
  siloToken,
  pools,
}: {
  siloToken: Token;
  pools: PoolData[];
}) => {
  const { targetToken } = useSiloConvertContext();
  const pintoUSDC = useChainConstant(PINTO_USDC_TOKEN);

  /**
   * The minimum allowed amount to be converted from the source token to the target token.
   * If poolData is not yet fetched, returns undefined.
   * If we are converting from PINTO -> a Well using the stable2 wellFunction, the minimum is 5 BDV due to rounding errors.
   */
  const minSourceIn = useMemo(() => {
    // If no pools are fetched, return undefined.
    if (!pools.length) {
      return undefined;
    }

    const isTargetStable2 = tokensEqual(targetToken, pintoUSDC);

    // If going from PINTO -> PINTOUSDC, min amount is 5 PINTO.
    if (siloToken.isMain && isTargetStable2) {
      return STABLE_SWAP_MIN_BDV;
    }

    return TV.ZERO;
  }, [pools, siloToken, targetToken, pintoUSDC]);

  return {
    minAmountIn: minSourceIn,
    isFetched: Boolean(pools.length),
  };
};

const ConvertSwitch = ({ siloToken }: BaseConvertProps) => {
  const queryClient = useQueryClient();
  const siloConvert = useSiloConvert();

  const farmerSilo = useFarmerSilo();
  const { pools, queryKeys: priceQueryKeys, deltaB } = usePriceData();
  const { queryKeys: siloQueryKeys, averageGrownStalkPerBdvPerSeason } = useSiloData();

  const convertExceptions = useConvertExceptions({ siloToken, pools });

  const onSuccess = useCallback(() => {
    for (const queryKey of [...priceQueryKeys, ...farmerSilo.queryKeys, ...siloQueryKeys]) {
      queryClient.invalidateQueries({ queryKey });
    }
  }, [queryClient, priceQueryKeys, farmerSilo.queryKeys, siloQueryKeys]);

  return (
    <ConvertForm
      siloToken={siloToken}
      siloConvert={siloConvert}
      farmerDeposits={farmerSilo.deposits}
      queryClient={queryClient}
      onSuccess={onSuccess}
      deltaP={deltaB}
      convertExceptions={convertExceptions}
      farmerActiveStalk={farmerSilo.activeStalkBalance}
      averageGrownStalkPerBdvPerSeason={averageGrownStalkPerBdvPerSeason}
    />
  );
};

const Convert = ({ siloToken }: BaseConvertProps) => {
  return (
    <ConvertProvider>
      <SiloConvertProvider>
        <ConvertSwitch siloToken={siloToken} />
      </SiloConvertProvider>
    </ConvertProvider>
  );
};

export default Convert;

// ------------------------------ Convert Output ------------------------------

const ConvertTokenOutput = ({
  // amount,
  siloToken,
  route,
}: {
  // amount: TV;
  siloToken: Token;
  route: SiloConvertSummary<SiloConvertType> | undefined;
}) => {
  const { targetToken } = useSiloConvertContext();

  const amount = route?.totalAmountOut ?? TV.ZERO;
  const formattedAmount = targetToken ? formatter.token(amount, targetToken) : "0.00";
  const displayAmount = useDebounceValue(formattedAmount, 50);

  const postPriceData = route?.postPriceData;

  const getDisplayUSD = () => {
    if (!targetToken || !postPriceData) {
      return formatter.usd(0);
    }
    if (targetToken.isMain) {
      const priceTV = TV.fromBigInt(postPriceData.price, 6);
      return formatter.usd(amount.mul(priceTV));
    }

    const targetWellPriceData = postPriceData.pools[getTokenIndex(targetToken.address)];
    if (!targetWellPriceData) return formatter.usd(0);

    const totalUSD = amount.mul(TV.fromBigInt(targetWellPriceData.lpUsd, 6));
    return formatter.usd(totalUSD);
  };

  return (
    <div className="flex flex-col w-full gap-2">
      <div className="pinto-sm sm:pinto-body-light sm:text-pinto-light text-pinto-light">To</div>
      <div className="flex flex-col w-full gap-1">
        <div className="flex flex-row items-center justify-between w-full">
          <div className="flex flex-col gap-1">
            <div className="pinto-h3">{displayAmount}</div>
          </div>
          <SiloConvertTokenSelect siloToken={siloToken} />
        </div>
        <div className="pinto-sm-light text-pinto-light">{getDisplayUSD()}</div>
      </div>
    </div>
  );
};

// ------------------------------ Token Select ------------------------------

interface DivorcedConvertState {
  up: SiloTokenConvertPath[];
  down: SiloTokenConvertPath[];
}

const getDivorcedState = (paths: AddressMap<SiloTokenConvertPath>) => {
  const divorced = Object.values(paths).reduce<DivorcedConvertState>(
    (prev, path) => {
      if (path.enabled) {
        prev[path?.deltaSeedRewards.gte(0) ? "up" : "down"].push(path);
      }
      return prev;
    },
    { up: [], down: [] },
  );

  return divorced;
};

const SiloConvertTokenSelectComponent = ({ siloToken }: BaseConvertProps) => {
  // Context
  const { convertState } = useConvertState();
  const { targetToken } = useSiloConvertContext();

  const { divorcedState, tokenConvertState } = useMemo(() => {
    const tokenState = convertState[getTokenIndex(siloToken)];

    return {
      tokenConvertState: tokenState,
      divorcedState: getDivorcedState(tokenState?.paths ?? []),
    };
  }, [convertState, siloToken]);

  // Local State
  const [open, setOpen] = useState(false);
  const [showOtherTokens, setShowOtherTokens] = useState(false);

  // Handlers
  const handleOpenDialog = (toOpenState: boolean) => {
    setOpen(toOpenState);
    if (!toOpenState && showOtherTokens) {
      setShowOtherTokens(false);
    }
  };
  // Effects
  useEffect(() => {
    if (!open && showOtherTokens) {
      setShowOtherTokens(false);
    }
  }, [open, showOtherTokens]);

  return (
    <Dialog open={open} onOpenChange={handleOpenDialog}>
      <DialogTrigger asChild>
        <Button variant="outline-gray-shadow" size="xl" rounded="full">
          <div className="flex flex-row items-center gap-1">
            {targetToken ? (
              <>
                <IconImage src={targetToken.logoURI ?? ""} size={6} />
                <div className="pinto-body-light">{targetToken.symbol}</div>
              </>
            ) : (
              <div className="pinto-body-light">{"Select Token"}</div>
            )}
            <IconImage src={arrowDown} size={3} alt={"open token select dialog"} />
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-dialog-600 min-w-dialog-600 gap-3 p-0 sm:p-0">
        <div className="flex flex-col p-0">
          {/* Header */}
          <div className="flex flex-col p-6 gap-3">
            <DialogTitle>
              <DialogHeader>
                <div className="pinto-body">Select a token</div>
              </DialogHeader>
            </DialogTitle>

            {/* Subheader */}
            <div className="flex flex-row justify-between">
              <div className="pinto-body-light text-pinto-light inline-flex items-center gap-1">
                Currently Deposited:
                <IconImage nudge={1} src={siloToken.logoURI} size={6} className="ml-1" />
                <span className="pinto-body-light text-pinto-secondary">{siloToken.name}</span>
              </div>
              <div className="pinto-h4 font-light inline-flex items-center gap-2">
                <IconImage nudge={1} src={SEEDS.logoURI} size={6} />
                {formatter.twoDec(tokenConvertState?.rewards.seeds)}
              </div>
            </div>
          </div>
          <Separator />
          {/* Token list */}
          <div className="flex flex-col gap-2 p-2">
            {divorcedState.up.length ? (
              <RecommendedConverts paths={divorcedState.up} closeDialog={() => setOpen(false)} />
            ) : (
              <div className="flex flex-col h-[140px] sm:h-[240px] justify-center items-center">
                <div className="pinto-sm text-pinto-light">
                  Converting to any other token from Pinto will result in a loss.
                </div>
              </div>
            )}
            {divorcedState.down.length ? (
              <OtherConverts
                paths={divorcedState.down}
                open={showOtherTokens}
                onOpenChange={setShowOtherTokens}
                closeDialog={() => setOpen(false)}
              />
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const SiloConvertTokenSelect = React.memo(SiloConvertTokenSelectComponent);

const OtherConverts = ({
  paths,
  open,
  onOpenChange,
  closeDialog,
}: {
  paths: DivorcedConvertState["down"];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  closeDialog: () => void;
}) => {
  return (
    <VerticalAccordion title="Show other tokens" open={open} onOpenChange={onOpenChange} marginOnOpen={true}>
      <ConvertFrameSection title="Other" paths={paths} closeDialog={closeDialog} />
    </VerticalAccordion>
  );
};

const RecommendedConverts = ({
  paths,
  closeDialog,
}: {
  paths: DivorcedConvertState["up"];
  closeDialog: () => void;
}) => {
  if (!paths.length) {
    return (
      <div className="flex flex-col h-[140px] sm:h-[240px] justify-center items-center">
        <div className="pinto-sm text-pinto-light">Converting to any other token from Pinto will result in a loss.</div>
      </div>
    );
  }

  return <ConvertFrameSection title="Recommended" paths={paths} closeDialog={closeDialog} />;
};

const ConvertFrameSection = ({
  title,
  paths,
  closeDialog,
}: {
  title: string;
  paths: SiloTokenConvertPath[];
  lastChildMb?: number;
  closeDialog: () => void;
}) => {
  return (
    <div className="flex flex-col w-full gap-2">
      <div className="pinto-sm text-pinto-light px-4 py-2">{title}</div>
      {paths.map((path) => (
        <div key={`convert-select-row-${path.token.address.toLowerCase()}`}>
          <ConvertSelectRow path={path} closeDialog={closeDialog} />
        </div>
      ))}
    </div>
  );
};

const ConvertSelectRow = ({
  path,
  closeDialog,
}: {
  path: SiloTokenConvertPath;
  closeDialog: () => void;
}) => {
  const { targetToken, setTargetToken } = useSiloConvertContext();
  const underlying = useWellUnderlying(path.token);
  const tokenMap = useTokenMap();

  const getConvertSelectRowDescription = () => {
    if (!underlying || underlying.length !== 2) return path.token.name;
    const underlyingTokens = underlying.map((t) => tokenMap[getTokenIndex(t)]);
    if (!underlyingTokens[0] || !underlyingTokens[1]) return path.token.name;

    return `${underlyingTokens.map((t) => t?.symbol).join(":")} Liquidity`;
  };

  const handleClick = () => {
    setTargetToken(path.token);
    closeDialog();
  };

  const positiveDelta = path.deltaSeedRewards.gt(0);

  return (
    <div
      className={cn(
        "flex flex-row box-border items-center justify-between p-4 cursor-pointer bg-white hover:bg-pinto-gray-1 rounded-xl",
        stringEq(targetToken?.address, path.token.address) ? "bg-pinto-gray-1" : "",
      )}
      onClick={handleClick}
    >
      <div className="flex flex-row w-full items-center gap-4">
        <IconImage src={path.token.logoURI} size={12} />
        <div className="flex flex-col gap-1 items-start">
          <div className="pinto-body text-pinto-secondary">{path.token.symbol}</div>
          <div className="pinto-sm-light text-pinto-light">{getConvertSelectRowDescription()}</div>
        </div>
      </div>
      <div className="flex flex-col w-full self-end items-end">
        <div className="pinto-h4 font-light text-right inline-flex items-center gap-2">
          <IconImage src={SEEDS.logoURI} nudge={1} size={6} />
          {formatter.twoDec(path.seedReward)}
        </div>
        <div
          className={`pinto-sm-light ${positiveDelta ? "text-pinto-success" : "text-pinto-error"} text-right inline-flex items-center self-end gap-1`}
        >
          <div className={`${positiveDelta ? "-rotate-90" : "rotate-90"}`}>
            <RightArrowIcon width={"0.875rem"} height={"0.875rem"} color={positiveDelta ? "#00C767" : "#FF0000"} />
          </div>
          {formatter.twoDec(path.deltaSeedRewards.abs())}
        </div>
      </div>
    </div>
  );
};

// ------------------------------ Warnings ------------------------------

const MinAmountWarning = ({
  enabled,
  minAmountIn,
  siloToken,
}: { enabled: boolean; minAmountIn: TV | undefined; siloToken: Token }) => {
  if (!enabled || !minAmountIn) return null;

  return (
    <Warning variant="info">
      A minimum amount of {formatter.token(minAmountIn, siloToken)} {siloToken.symbol} is required to convert.
    </Warning>
  );
};

const LP2LPMinConvertWarning = ({
  enabled,
  maxConvertQueryData,
  siloToken,
}: { enabled: boolean; maxConvertQueryData: TV; siloToken: Token }) => {
  if (!enabled || !maxConvertQueryData) return null;

  return (
    <Warning variant="info">
      Converting more than {formatter.token(maxConvertQueryData, siloToken)} {siloToken.symbol} will result in a loss of
      Grown Stalk.
    </Warning>
  );
};

const ConvertWarning = ({
  canConvert,
  canExceedMax,
  deltaPEnabled,
  farmerConvertibleAmount,
  targetToken,
  siloToken,
  maxConvertQuery,
  isDefaultConvert,
  maxConvert,
}: {
  canConvert: boolean;
  canExceedMax: boolean;
  deltaPEnabled: boolean;
  farmerConvertibleAmount: TV;
  targetToken: Token | undefined;
  siloToken: Token;
  maxConvertQuery: Omit<UseQueryResult<MaxConvertResult>, "data"> | undefined;
  isDefaultConvert: boolean;
  maxConvert: TV;
}) => {
  const showWarning = (!canConvert || canExceedMax || !deltaPEnabled) && farmerConvertibleAmount?.gt(0);
  if (!targetToken || !maxConvertQuery?.isFetched || !isDefaultConvert || !showWarning) return null;

  let msg = "";

  if (!canConvert) {
    const lowerOrGreater = targetToken?.isLP ? "greater" : "less";
    const well = siloToken.isLP ? siloToken : targetToken;
    const wellSymbol = well?.symbol;

    msg = `${siloToken.symbol} can only be Converted to ${targetToken?.symbol} when ΔP ${deltaPEnabled ? `in the ${wellSymbol} Well` : ""} is ${lowerOrGreater} than 0.`;
  } else {
    const maxConvertFormatted = formatter.number(maxConvert, {
      minDecimals: 2,
      maxDecimals: siloToken.displayDecimals ?? 6,
      minValue: 0.000001,
    });
    msg = `Converting any more than ${maxConvertFormatted} ${siloToken.symbol} will result in a loss of Stalk and Seeds`;
  }

  return <Warning variant="info">{msg}</Warning>;
};

const GerminatingStalkWarning = ({
  enabled,
  germinatingStalk,
  germinatingSeasons,
}: { enabled: boolean; germinatingStalk: TV; germinatingSeasons: number }) => {
  if (!enabled) return null;

  return (
    <Warning variant="info" className="text-pinto-off-green bg-pinto-off-green-bg border border-pinto-off-green">
      {formatter.number(germinatingStalk)} Stalk will become germinating and will be available in {germinatingSeasons}{" "}
      season{germinatingSeasons === 1 ? "" : "s"}.
    </Warning>
  );
};

const GrownStalkPenaltyWarning = ({
  enabled,
  summary,
  averageGrownStalkPerBdvPerSeason,
  allowStalkPenalty,
  setAllowStalkPenalty,
}: {
  enabled: boolean;
  summary: SiloConvertGrownStalkPenaltyBreakdown | undefined;
  averageGrownStalkPerBdvPerSeason: TV;
  allowStalkPenalty: boolean;
  setAllowStalkPenalty: Dispatch<SetStateAction<boolean>>;
}) => {
  if (!enabled || !summary || averageGrownStalkPerBdvPerSeason.eq(0)) return null;
  const grownStalkPenaltyRatio = summary.penaltyRatio;

  if (!grownStalkPenaltyRatio) return null;

  const penaltyPct = (grownStalkPenaltyRatio ?? 0) * 100;

  const expectedGrownStalkPerSeason = averageGrownStalkPerBdvPerSeason.mul(summary.bdv);
  const seasonsOfGrownStalkConverted = Math.ceil(summary.lossGrownStalk.div(expectedGrownStalkPerSeason).toNumber());

  return (
    <Warning variant="warning">
      <div className="flex flex-col gap-2">
        <span>This conversion incurs a {formatter.pct(penaltyPct)} Grown Stalk penalty.</span>
        <span>
          This is ~{seasonsOfGrownStalkConverted.toFixed(0)} Season
          {seasonsOfGrownStalkConverted > 1 && <span>s</span>} worth of Grown Stalk.
        </span>
        <div className="flex flex-row gap-3 items-center mt-2">
          <Checkbox
            id="grown-stalk-penalty-notice"
            className="bg-white"
            checked={allowStalkPenalty}
            onCheckedChange={(checked) => {
              if (checked !== "indeterminate") {
                setAllowStalkPenalty(checked);
              } else {
                setAllowStalkPenalty(false);
              }
            }}
          />
          <Label
            htmlFor="grown-stalk-penalty-notice"
            className="cursor-pointer text-pinto-error text-sm sm:text-sm font-light"
          >
            I understand the Grown Stalk penalty
          </Label>
        </div>
      </div>
    </Warning>
  );
};
