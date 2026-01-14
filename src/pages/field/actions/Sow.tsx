import { TV } from "@/classes/TokenValue";
import { ComboInputField } from "@/components/ComboInputField";
import OutputDisplay from "@/components/OutputDisplay";
import SmartSubmitButton from "@/components/SmartSubmitButton";
import Warning from "@/components/ui/Warning";
import { PODS, SEEDS, STALK } from "@/constants/internalTokens";
import sowWithMin from "@/encoders/sowWithMin";
import sowWithReferral from "@/encoders/sowWithReferral";
import { beanstalkAbi } from "@/generated/contractHooks";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { useReferralCode } from "@/hooks/tractor/useReferralCode";
import { useScaledTemperature } from "@/hooks/useContinuousMorningTime";
import useTransaction from "@/hooks/useTransaction";
import { inputExceedsSoilAtom } from "@/state/protocol/field/field.atoms";
import { useFarmerBalances } from "@/state/useFarmerBalances";
import { useFarmerField } from "@/state/useFarmerField";
import { useInvalidateField, usePodLine, useTotalSoil } from "@/state/useFieldData";
import useTokenData from "@/state/useTokenData";
import { formatter } from "@/utils/format";
import { decodeReferralAddress } from "@/utils/referral";
import { stringToNumber, stringToStringNum } from "@/utils/string";
import { AdvancedFarmCall, FarmFromMode, FarmToMode, Token } from "@/utils/types";
import { useSetAtom } from "jotai";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import type { Address } from "viem";
import { useAccount } from "wagmi";

import settingsIcon from "@/assets/misc/Settings.svg";
import FrameAnimator from "@/components/LoadingSpinner";
import MobileActionBar from "@/components/MobileActionBar";
import TooltipSimple from "@/components/TooltipSimple";

import { Col, Row } from "@/components/Container";
import RoutingAndSlippageInfo, { useRoutingAndSlippageWarning } from "@/components/RoutingAndSlippageInfo";
import TextSkeleton from "@/components/TextSkeleton";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover";
import { Switch } from "@/components/ui/Switch";
import { ANALYTICS_EVENTS } from "@/constants/analytics-events";
import siloWithdraw from "@/encoders/silo/withdraw";
import useDelayedLoading from "@/hooks/display/useDelayedLoading";
import { useIsWSOL, useTokenMap } from "@/hooks/pinto/useTokenMap";
import { useBuildSwapQuoteAsync } from "@/hooks/swap/useBuildSwapQuote";
import useMaxBuy from "@/hooks/swap/useMaxBuy";
import useSwap from "@/hooks/swap/useSwap";
import useSwapSummary from "@/hooks/swap/useSwapSummary";
import { usePreferredInputSiloDepositToken, usePreferredInputToken } from "@/hooks/usePreferredInputToken";
import useSafeTokenValue from "@/hooks/useSafeTokenValue";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { trackSimpleEvent } from "@/utils/analytics";
import { sortAndPickCrates } from "@/utils/convert";
import { toSafeTVFromHuman } from "@/utils/number";
import { HashString } from "@/utils/types.generic";
import { useDebouncedEffect } from "@/utils/useDebounce";
import { getBalanceFromMode } from "@/utils/utils";
import { AnimatePresence, motion } from "framer-motion";

type SowProps = {
  isMorning: boolean;
  onShowOrder: () => void;
};

function Sow({ isMorning, onShowOrder }: SowProps) {
  // Hooks
  const diamond = useProtocolAddress();
  const { mainToken } = useTokenData();
  const farmerBalances = useFarmerBalances();
  const farmerSilo = useFarmerSilo();
  const farmerField = useFarmerField();
  const account = useAccount();
  const [searchParams] = useSearchParams();
  const { referralCode, validReferralCodeFromStorage, setReferralCode } = useReferralCode();

  // Decode referral code to address for conditional rendering (from localStorage)
  const referralAddress = useMemo(() => {
    if (!validReferralCodeFromStorage) return null;
    return decodeReferralAddress(validReferralCodeFromStorage);
  }, [validReferralCodeFromStorage]);

  const temperature = useScaledTemperature();
  const podLine = usePodLine();
  const { totalSoil, isLoading: totalSoilLoading } = useTotalSoil();
  const invalidateField = useInvalidateField();

  const depositedByWhitelistedToken = useMapSiloDepositsToAmounts(farmerSilo.deposits);

  // Form State
  const [tokenSource, setTokenSource] = useState<TokenSource>("balances");
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Preferred Tokens
  const preferredSiloDepositToken = usePreferredInputSiloDepositToken(farmerSilo, mainToken);
  const preferredBalanceToken = usePreferredInputToken({
    filterLP: true,
  });

  const preferredLoading =
    tokenSource === "deposits" ? preferredSiloDepositToken.isLoading : preferredBalanceToken.loading;

  const [balanceFrom, setBalanceFrom] = useState(FarmFromMode.INTERNAL_EXTERNAL);
  const [tokenIn, setTokenIn] = useState<Token>(
    tokenSource === "deposits" ? preferredSiloDepositToken.preferredToken : preferredBalanceToken.preferredToken,
  );
  const [amountIn, setAmountIn] = useState("");
  const [slippage, setSlippage] = useState(0.1);
  const [minTemperature, setMinTemperature] = useState(Math.max(temperature.scaled.toNumber(), 1));

  const [didSetPreferred, setDidSetPreferred] = useState(!preferredLoading);
  const [inputError, setInputError] = useState(false);

  //
  const { loading, setLoading } = useDelayedLoading();
  const filterTokens = useFilterTokens(tokenSource);

  // Derived State
  const fromSilo = tokenSource === "deposits";
  const numIn = stringToNumber(amountIn);
  const currentTemperature = temperature.scaled;
  const isUsingMain = !!tokenIn.isMain;

  // Swap / Quotes
  const maxBuyQuery = useMaxBuy(tokenIn, slippage, totalSoil);
  const maxBuy = totalSoilLoading ? TV.ZERO : maxBuyQuery.data;

  const amountInTV = useSafeTokenValue(amountIn, tokenIn);

  const swap = useSwap({
    tokenIn: tokenIn,
    tokenOut: mainToken,
    amountIn: tokenIn.isMain ? TV.ZERO : amountInTV,
    slippage,
    disabled: tokenIn.isMain || amountInTV.lte(0) || maxBuy?.lte(0),
  });

  const swapSummary = useSwapSummary(swap.data);
  const resetSwap = swap.resetSwap;

  const buildSwapAsync = useBuildSwapQuoteAsync(
    swap.data,
    fromSilo ? FarmFromMode.INTERNAL : balanceFrom, // if we are using silo deposits, fromMode = INTERNAL
    FarmToMode.INTERNAL,
  );

  // Swap Quote Derived
  const { slippageWarning, canProceed } = useRoutingAndSlippageWarning({
    totalSlippage: swapSummary?.swap.totalSlippage,
    priceImpact: undefined,
    txnType: "Swap",
    noMarginTop: true,
  });

  const withdrawBreakdown = useWithdrawDepositBreakdown(farmerSilo.deposits, tokenIn, amountIn, fromSilo);

  // Transaction
  const onSuccess = useCallback(() => {
    setAmountIn("");
    resetSwap();
    invalidateField("all");
    farmerField.refetch();
    if (fromSilo) {
      farmerSilo.refetch();
    } else {
      farmerBalances.refetch();
    }
  }, [fromSilo, farmerField.refetch, farmerBalances.refetch, farmerSilo.refetch, invalidateField, resetSwap]);

  const { writeWithEstimateGas, isConfirming, submitting, setSubmitting } = useTransaction({
    successCallback: onSuccess,
    errorMessage: "Sow failed",
    successMessage: "Sow successful",
  });

  const soilSown = useMemo(
    () => (isUsingMain ? amountInTV : swap.data?.buyAmount),
    [isUsingMain, amountInTV, swap.data?.buyAmount],
  );

  const pods = useMemo(() => {
    if (amountInTV.lte(0)) return;

    const multiplier = currentTemperature.add(100).div(100);

    if (isUsingMain) {
      return multiplier.mul(amountInTV);
    } else if (swap?.data?.buyAmount) {
      const numPinto = swap.data.buyAmount;
      return multiplier.mul(numPinto);
    }

    return TV.ZERO;
  }, [amountInTV, currentTemperature, isUsingMain, swap.data?.buyAmount]);

  const bonusPods = useMemo(() => {
    if (!referralAddress || !pods || pods.lte(0)) return TV.ZERO;
    return pods.mul(0.1);
  }, [referralAddress, pods]);

  const hasReferralCode = Boolean(referralAddress);

  const onSubmit = useCallback(async () => {
    try {
      if (!account.address) {
        throw new Error("Signer required");
      }
      if (minTemperature < 0) {
        throw new Error("Min temperature must be greater than 0");
      }
      if (currentTemperature.lte(0)) {
        throw new Error("Current temperature must be greater than 0");
      }
      if (inputError) {
        throw new Error("Invalid input");
      }

      // Track sow submission
      trackSimpleEvent(ANALYTICS_EVENTS.FIELD.SOW_SUBMIT, {
        input_token: tokenIn.symbol,
        token_source: tokenSource,
        is_morning: isMorning,
      });

      setSubmitting(true);

      const mainTokenAmount = isUsingMain
        ? TV.fromHuman(amountIn || 0n, mainToken.decimals)
        : swap.data?.buyAmount ?? TV.ZERO;

      if (!mainTokenAmount.gt(0)) {
        throw new Error("Sow amount must be greater than 0");
      }

      toast.loading(`Sowing...`);

      // temperature at 6 decimals
      const _minTemp = TV.fromHuman(minTemperature, PODS.decimals);
      const minTemp = (_minTemp.gt(currentTemperature) ? _minTemp : currentTemperature).subSlippage(slippage);

      const minSoil = TV.ZERO;

      // If we are sowing w/ the Main Token, we can use the regular sowWithMin or sowWithReferral function
      if (isUsingMain && !fromSilo) {
        if (referralAddress) {
          return writeWithEstimateGas({
            address: diamond,
            abi: beanstalkAbi,
            functionName: "sowWithReferral",
            args: [
              mainTokenAmount.toBigInt(),
              minTemp.toBigInt(),
              minSoil.toBigInt(),
              Number(balanceFrom),
              referralAddress,
            ],
          });
        }
        return writeWithEstimateGas({
          address: diamond,
          abi: beanstalkAbi,
          functionName: "sowWithMin",
          args: [mainTokenAmount.toBigInt(), minTemp.toBigInt(), minSoil.toBigInt(), Number(balanceFrom)],
        });
      }

      const advFarm: AdvancedFarmCall[] = [];

      // If we are using silo deposits, withdraw first to INTERNAL
      if (fromSilo) {
        if (!withdrawBreakdown) {
          throw new Error("Unable to calculate Silo withdraw");
        }

        const withdrawStruct = siloWithdraw(
          tokenIn,
          withdrawBreakdown.crates.map((crate) => crate.stem),
          withdrawBreakdown.crates.map((crate) => crate.amount),
          FarmToMode.INTERNAL,
        );

        advFarm.push(withdrawStruct);
      }

      const value = tokenIn.isNative ? TV.fromHuman(amountIn, tokenIn.decimals) : undefined;

      let clipboard: HashString | undefined = undefined;

      // If we are sowing w/ a non-Main Token, we need to build a swap
      if (!isUsingMain) {
        const swapBuild = await buildSwapAsync?.();
        if (!swapBuild) {
          throw new Error("No swap quote");
        }

        const result = await swapBuild.deriveClipboardWithOutputToken(mainToken, 0, account.address, {
          before: advFarm,
          value,
        });

        clipboard = result.clipboard;
        swapBuild.advFarm.getSteps().forEach((step) => {
          advFarm.push(step);
        });
      }

      // Finally, add the sowWithMin or sowWithReferral call to the advFarm
      const sowCallStruct = referralAddress
        ? sowWithReferral(mainTokenAmount, minTemp, minSoil, FarmFromMode.INTERNAL, referralAddress, clipboard)
        : sowWithMin(mainTokenAmount, minTemp, minSoil, FarmFromMode.INTERNAL, clipboard);
      advFarm.push(sowCallStruct);

      return writeWithEstimateGas({
        address: diamond,
        abi: beanstalkAbi,
        functionName: "advancedFarm",
        args: [advFarm],
        value: value?.toBigInt(),
      });
    } catch (e) {
      console.error(e);
      toast.dismiss();
      toast.error("Sow failed");
      throw e;
    } finally {
      setSubmitting(false);
    }
  }, [
    writeWithEstimateGas,
    setSubmitting,
    buildSwapAsync,
    withdrawBreakdown,
    diamond,
    slippage,
    swap.data,
    account.address,
    fromSilo,
    amountIn,
    tokenIn,
    tokenSource,
    isMorning,
    mainToken,
    balanceFrom,
    isUsingMain,
    minTemperature,
    currentTemperature,
    inputError,
    referralAddress,
  ]);

  // Callbacks
  const handleOnCheckedChange = (checked: boolean) => {
    const newTokenSource = checked ? "deposits" : "balances";
    trackSimpleEvent(ANALYTICS_EVENTS.FIELD.SOW_DEPOSITS_TOGGLE, {
      previous_source: tokenSource,
      new_source: newTokenSource,
    });
    setAmountIn("");
    if (newTokenSource === "deposits") {
      setTokenIn(preferredSiloDepositToken.preferredToken);
    } else {
      setTokenIn(preferredBalanceToken.preferredToken);
    }
    setTokenSource(newTokenSource);
  };

  // Track token selection
  const handleTokenChange = useCallback(
    (newToken: Token) => {
      if (tokenIn.symbol !== newToken.symbol) {
        trackSimpleEvent(ANALYTICS_EVENTS.FIELD.SOW_TOKEN_SELECTED, {
          previous_token: tokenIn.symbol,
          new_token: newToken.symbol,
          token_source: tokenSource,
        });
      }
      setTokenIn(newToken);
    },
    [tokenIn.symbol, tokenSource],
  );

  // Effects
  // Initialize the token source
  useEffect(() => {
    // If we are still calculating the preferred token, set the token to the preferred token once it's been set.
    if (didSetPreferred || preferredLoading) return;
    const preferred = fromSilo ? preferredSiloDepositToken.preferredToken : preferredBalanceToken.preferredToken;

    setTokenIn(preferred);
    setDidSetPreferred(true);
  }, [
    preferredBalanceToken.preferredToken,
    preferredLoading,
    didSetPreferred,
    fromSilo,
    preferredSiloDepositToken.preferredToken,
  ]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: only reset when token in changes
  useEffect(() => {
    setAmountIn("");
  }, [tokenIn]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: only reset when swap data changes
  useEffect(() => {
    setLoading(swap.isLoading);
  }, [swap.isLoading]);

  // Read referral code from URL params on mount and set to hook
  useEffect(() => {
    const refParam = searchParams.get("ref");
    // Fix: searchParams.get() converts + to space, so we need to restore it
    const decodedRef = refParam ? refParam.replace(/ /g, "+") : null;
    if (decodedRef) {
      setReferralCode(decodedRef);
    }
  }, [searchParams, setReferralCode]);

  // Derived State
  const hasSoil = Boolean(!totalSoilLoading && totalSoil.gt(0));
  const inputExceedsSoil = hasSoil && soilSown && totalSoil && soilSown.gt(totalSoil);
  const setInputExceedsSoil = useSetAtom(inputExceedsSoilAtom);

  // Update shared state for the TractorButton animation in Field.tsx
  useEffect(() => {
    // Update the atom value instead of using localStorage
    setInputExceedsSoil(Boolean(inputExceedsSoil));

    // Reset the atom value when the component unmounts
    return () => {
      setInputExceedsSoil(false);
    };
  }, [inputExceedsSoil, setInputExceedsSoil]);

  const initializing = !didSetPreferred || (hasSoil ? maxBuyQuery.isLoading : false);

  const isLoading = (numIn > 0 && loading) || (pods?.lte(0) && numIn > 0);
  const ready = pods?.gt(0) && podLine.gte(0) && (hasSoil ? maxBuy?.gt(0) && amountInTV.gt(0) : true);

  const tokenBalance = fromSilo
    ? depositedByWhitelistedToken.get(tokenIn)
    : getBalanceFromMode(farmerBalances.balances.get(tokenIn), balanceFrom);

  const balanceExceedsSoil =
    (!totalSoilLoading && totalSoil.lte(0)) ||
    (!maxBuyQuery.isLoading && Boolean(tokenBalance && maxBuy?.lt(tokenBalance)));

  const ctaDisabled = isLoading || isConfirming || submitting || !ready || inputError || !canProceed;

  const buttonText = inputError ? "Amount too large" : "Sow";

  return (
    <Col className="gap-4 w-full">
      <Col className="w-full">
        <Row className="justify-between items-center">
          <div className="pinto-body-light text-pinto-light">Amount and token to Sow</div>
          <SettingsPoppover
            slippage={slippage}
            setSlippage={setSlippage}
            minTemperature={minTemperature}
            setMinTemperature={setMinTemperature}
            open={settingsOpen}
            onOpenChange={setSettingsOpen}
          />
        </Row>
        <ComboInputField
          isLoading={initializing}
          tokenSelectLoading={!didSetPreferred}
          amount={amountIn}
          disableInput={isConfirming}
          customMaxAmount={maxBuy?.gt(0) && tokenBalance?.gt(0) ? TV.min(tokenBalance, maxBuy) : TV.ZERO}
          setAmount={setAmountIn}
          setToken={handleTokenChange}
          setBalanceFrom={setBalanceFrom}
          setError={setInputError}
          selectedToken={tokenIn}
          error={inputError}
          transformTokenLabels={fromSilo ? transformTokenLabels : undefined}
          tokenAndBalanceMap={fromSilo ? depositedByWhitelistedToken : undefined}
          balanceFrom={fromSilo ? undefined : balanceFrom}
          disableButton={isConfirming}
          connectedAccount={!!account.address}
          altText={balanceExceedsSoil ? "Usable balance:" : undefined}
          filterTokens={filterTokens}
          disableClamping={true}
        />
      </Col>
      <Row className="justify-between my-2">
        <div className="pinto-sm sm:pinto-body-light sm:text-pinto-light text-pinto-light">Use Silo Deposits</div>
        <TextSkeleton loading={false} className="w-11 h-6">
          <Switch checked={tokenSource === "deposits"} onCheckedChange={handleOnCheckedChange} />
        </TextSkeleton>
      </Row>
      <AnimatePresence mode="wait">
        {(isLoading || ready) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="relative overflow-hidden"
          >
            {isLoading ? (
              <div className="flex items-center justify-center min-h-[8rem]">
                <FrameAnimator size={64} />
              </div>
            ) : (
              <Col>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-0 px-2">
                    <OutputDisplay
                      title={
                        <span>
                          Sow{" "}
                          <span className="text-pinto-primary">
                            {`${formatter.twoDec(soilSown)}/${formatter.twoDec(totalSoil)}`}{" "}
                          </span>
                          {`available Soil and receive`}
                        </span>
                      }
                    >
                      <OutputDisplay.Item label="Pods">
                        <OutputDisplay.Value value={formatter.token(pods, PODS)} token={PODS} suffix={PODS.symbol} />
                      </OutputDisplay.Item>
                      {hasReferralCode && bonusPods.gt(0) && (
                        <OutputDisplay.Item label="Bonus Pods">
                          <OutputDisplay.Value
                            value={formatter.token(bonusPods, PODS)}
                            token={PODS}
                            suffix={PODS.symbol}
                            className="text-pinto-green-4"
                          />
                        </OutputDisplay.Item>
                      )}
                      <div className="pinto-sm sm:pinto-body-light text-pinto-light sm:text-pinto-light flex flex-row justify-between items-center py-2">
                        <div className="flex flex-row gap-2 items-center">
                          <span>Place in Line</span>
                          <TooltipSimple
                            content="Pods become redeemable for Pinto 1:1 when they reach the front of the Pod Line."
                            variant="outlined"
                          />
                        </div>
                        <OutputDisplay.Value value={formatter.noDec(podLine)} />
                      </div>
                      {fromSilo ? (
                        <>
                          <OutputDisplay.Item label="Stalk">
                            <OutputDisplay.Value
                              value={formatter.token(withdrawBreakdown?.stalk, STALK)}
                              delta="down"
                              suffix="Stalk"
                              token={STALK}
                              showArrow
                            />
                          </OutputDisplay.Item>
                          <OutputDisplay.Item label="Seed">
                            <OutputDisplay.Value
                              value={formatter.token(withdrawBreakdown?.seeds, SEEDS)}
                              token={SEEDS}
                              delta="down"
                              suffix="Seeds"
                              showArrow
                            />
                          </OutputDisplay.Item>
                        </>
                      ) : null}
                    </OutputDisplay>
                  </div>
                  <div className="flex flex-col gap-0">
                    <Col className="gap-4">
                      {!hasSoil && <Warning>Your usable balance is 0.00 because there is no Soil available.</Warning>}
                      {hasReferralCode && bonusPods.gt(0) ? (
                        <div className="px-2 py-3">
                          <span className="pinto-sm sm:pinto-body-light text-pinto-light sm:text-pinto-light">
                            You gained <span className="text-pinto-green-4 font-medium">10% more Pods</span> due to
                            using a referral link!
                          </span>
                        </div>
                      ) : (
                        <div className="px-2 py-3">
                          <button
                            type="button"
                            onClick={() => setSettingsOpen(true)}
                            className="pinto-sm sm:pinto-body-light text-pinto-green-4 underline cursor-pointer hover:text-pinto-green-3"
                          >
                            Use a referral code and gain 10% more Pods!
                          </button>
                        </div>
                      )}
                    </Col>
                    {!tokenIn.isMain && swapSummary?.swap && (
                      <RoutingAndSlippageInfo
                        title="Total Swap Slippage"
                        swapSummary={swapSummary}
                        preferredSummary="swap"
                        txnType="Swap"
                        tokenIn={tokenIn}
                        tokenOut={mainToken}
                      />
                    )}
                  </div>
                </div>
              </Col>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      {slippageWarning}

      <div className="hidden sm:flex flex-row gap-2">
        <SmartSubmitButton
          variant={isMorning ? "morning" : "gradient"}
          disabled={ctaDisabled}
          token={!fromSilo ? tokenIn : undefined}
          amount={!fromSilo ? amountIn : undefined}
          balanceFrom={!fromSilo ? balanceFrom : undefined}
          submitFunction={onSubmit}
          submitButtonText={buttonText}
        />
      </div>
      <MobileActionBar>
        <SmartSubmitButton
          variant={isMorning ? "morning" : "gradient"}
          disabled={ctaDisabled}
          token={!fromSilo ? tokenIn : undefined}
          amount={!fromSilo ? amountIn : undefined}
          balanceFrom={!fromSilo ? balanceFrom : undefined}
          submitFunction={onSubmit}
          submitButtonText={buttonText}
          className="h-full"
        />
      </MobileActionBar>
    </Col>
  );
}

export default Sow;

// ------------------------------ SETTINGS POPOVER ------------------------------

const SettingsPoppover = ({
  slippage,
  setSlippage,
  minTemperature,
  setMinTemperature,
  open,
  onOpenChange,
}: {
  slippage: number;
  setSlippage: React.Dispatch<React.SetStateAction<number>>;
  minTemperature: number;
  setMinTemperature: React.Dispatch<React.SetStateAction<number>>;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) => {
  const [internalAmount, setInternalAmount] = useState(slippage);
  const [internalMinTemperature, setInternalMinTemperature] = useState(minTemperature);
  const { referralCode, isReferralCodeValid, setReferralCode } = useReferralCode();

  const handlePopoverOpen = (isOpen: boolean) => {
    if (isOpen) {
      trackSimpleEvent(ANALYTICS_EVENTS.FIELD.SOW_SETTINGS_OPEN, {
        current_slippage: slippage,
        current_min_temperature: minTemperature,
      });
    }
    onOpenChange?.(isOpen);
  };

  // Effects
  useDebouncedEffect(() => setSlippage(internalAmount), [internalAmount], 100);
  useDebouncedEffect(() => setMinTemperature(internalMinTemperature), [internalMinTemperature], 100);

  return (
    <Popover
      open={open}
      onOpenChange={(newOpen) => {
        handlePopoverOpen(newOpen);
        onOpenChange?.(newOpen);
      }}
    >
      <PopoverTrigger asChild>
        <Button variant={"ghost"} noPadding className="rounded-full w-10 h-10 ">
          <img src={settingsIcon} className="w-4 h-4 transition-all" alt="slippage" />
        </Button>
      </PopoverTrigger>
      <PopoverContent side="bottom" align="end" className="w-64 flex flex-col shadow-none">
        <div className="flex flex-col gap-4">
          <div className="pinto-md">Slippage Tolerance</div>
          <div className="flex flex-row gap-2">
            <Input
              type="number"
              inputMode="numeric"
              min={0}
              value={internalAmount}
              onChange={(e) => setInternalAmount(Number(e.target.value))}
            />
            <div className="text-xl self-center">%</div>
          </div>
          <div className="pinto-md">Minimum Temperature</div>
          <div className="flex flex-row gap-2">
            <Input
              type="number"
              inputMode="numeric"
              min={0}
              value={internalMinTemperature}
              onChange={(e) => setInternalMinTemperature(Number(e.target.value))}
            />
            <div className="text-xl self-center">%</div>
          </div>
          <div className="pinto-md">Referral Code</div>
          <div className="flex flex-col gap-2">
            <Input
              type="text"
              placeholder="Enter referral code"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
              className={isReferralCodeValid ? "border-green-500" : ""}
            />
            {isReferralCodeValid && (
              <div className="pinto-sm text-green-600 flex items-center gap-1">
                <span>✓</span>
                <span>Valid referral code</span>
              </div>
            )}
            {referralCode && !isReferralCodeValid && <div className="pinto-sm text-red-600">Invalid referral code</div>}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

// ------------------------------ Types ------------------------------

type TokenSource = "deposits" | "balances";

// ------------------------------ Hooks ------------------------------

const useFilterTokens = (mode: TokenSource) => {
  const tokenMap = useTokenMap();
  const isWSOL = useIsWSOL();

  return useMemo(() => {
    const set = new Set<Token>();

    Object.values(tokenMap).forEach((token) => {
      if (mode === "balances") {
        if (
          token.isLP || // disable LP tokens
          token.isSiloWrapped || // disable sPINTO
          token.is3PSiloWrapped || // disable 3rd party sPINTO tokens
          isWSOL(token) // disable WSOL
        ) {
          set.add(token);
        }
      } else if (mode === "deposits") {
        if (
          token.isSiloWrapped || //disable sPINTO
          token.is3PSiloWrapped || // disable 3rd party sPINTO tokens
          (!token.isLP && !token.isMain) || // disable non-LP tokens
          !token.isWhitelisted // disable non-whitelisted LP tokens
        ) {
          set.add(token);
        }
      }
    });
    return set;
  }, [tokenMap, mode, isWSOL]);
};

const useMapSiloDepositsToAmounts = (deposits: ReturnType<typeof useFarmerSilo>["deposits"]) => {
  const tokenMap = useTokenMap();

  return useMemo(
    () =>
      Object.values(tokenMap).reduce<Map<Token, TV>>(
        (acc, curr) => acc.set(curr, deposits.get(curr)?.amount ?? TV.ZERO),
        new Map(),
      ),
    [deposits, tokenMap],
  );
};

const useWithdrawDepositBreakdown = (
  deposits: ReturnType<typeof useFarmerSilo>["deposits"],
  token: Token,
  amountIn: string | undefined,
  enabled: boolean,
) => {
  const inputAmount = stringToStringNum(amountIn ?? "0");

  const breakdown = useMemo(() => {
    if (!enabled || inputAmount === "0") {
      return;
    }

    const tokenDeposits = deposits?.get(token);
    if (!tokenDeposits || !tokenDeposits?.deposits.length) return;

    // Take the minimum of the amount in and the amount in the deposits
    // If the amount is greater than amount deposited, sortAndPickCrates will throw
    const amount = TV.min(toSafeTVFromHuman(inputAmount, token.decimals), tokenDeposits.amount);

    return sortAndPickCrates("withdraw", amount, tokenDeposits.deposits);
  }, [deposits, inputAmount, enabled, token]);

  return breakdown;
};

// ------------------------------ Functions ------------------------------

const transformTokenLabels = (token: Token) => {
  return {
    label: `Dep. ${token.symbol}`,
    sublabel: `Silo Deposited ${token.name}`,
  };
};
