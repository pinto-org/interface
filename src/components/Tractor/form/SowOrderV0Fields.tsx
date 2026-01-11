import arrowDown from "@/assets/misc/ChevronDown.svg";
import podIcon from "@/assets/protocol/Pod.png";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/Form";
import { Button } from "@/components/ui/Button";
import IconImage from "@/components/ui/IconImage";
import { Input } from "@/components/ui/Input";
import { MultiSlider } from "@/components/ui/Slider";
import { Switch } from "@/components/ui/Switch";
import { MAIN_TOKEN } from "@/constants/tokens";
import { useReadBeanstalk_MaxTemperature } from "@/generated/contractHooks";
import { useTokenMap } from "@/hooks/pinto/useTokenMap";
import { useTemperature } from "@/state/useFieldData";
import { useChainConstant } from "@/utils/chain";
import { NUMBER_ABBR_THRESHOLDS, formatter } from "@/utils/format";
import { MAX_INPUT_VALUE, postSanitizedSanitizedValue, sanitizeNumericInputValue, stringEq } from "@/utils/string";
import { getTokenIndex } from "@/utils/token";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SowOrderV0FormSchema } from "./SowOrderV0Schema";

import { TV } from "@/classes/TokenValue";
import { Col, Row } from "@/components/Container";
import { Label, TooltipLabel } from "@/components/ui/Label";
import { tractorTokenStrategyUtil as StrategyUtil } from "@/lib/Tractor";
import { TractorTokenStrategy } from "@/lib/Tractor/types";
import { useFarmerBalances } from "@/state/useFarmerBalances";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { usePriceData } from "@/state/usePriceData";
import useTokenData from "@/state/useTokenData";
import { decodeReferralAddress } from "@/utils/referral";
import { cn } from "@/utils/utils";
import { useFormContext, useWatch } from "react-hook-form";
import { useAccount } from "wagmi";

import { useReferralCode } from "@/hooks/tractor/useReferralCode";

const sharedInputProps = {
  type: "text",
  inputMode: "decimal",
  pattern: "[0-9]*.?[0-9]*",
} as const;

export const TOOLTIP_COPY = {
  tokenStrategy: "The source token(s) to use for the Sow Order.",
  totalAmount: "The total amount of PINTO to Sow in this order.",
  temperature: "The minimum Temperature at which this order can be executed.",
  morningAuction:
    "The Morning is the first 10 minutes of the Season, where the Temperature slowly increases to its maximum.\nFarmers can opt for their orders to execute during the Morning, such that their orders fill first.",
} as const;

interface BaseIFormContextHandlers {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => ReturnType<typeof sanitizeNumericInputValue>;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const useSharedInputHandlers = (
  ctx: ReturnType<typeof useFormContext<SowOrderV0FormSchema>>,
  name: Exclude<keyof SowOrderV0FormSchema, "selectedTokenStrategy" | "morningAuction">,
) => {
  const mainToken = useChainConstant(MAIN_TOKEN);

  const handleNumericInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const cleaned = sanitizeNumericInputValue(e.target.value, mainToken.decimals, false, MAX_INPUT_VALUE);

      ctx.setValue(name, cleaned.str, { shouldValidate: true });
      return cleaned;
    },
    [ctx.setValue, mainToken.decimals, name],
  );

  const handleNumericInputBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      const cleanValue = e.target.value.replace(/,/g, "");
      const parts = cleanValue.split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      const joined = parts.join(".");

      // only validate if the value is not empty
      ctx.setValue(name, joined, { shouldValidate: cleanValue !== "" });
    },
    [ctx.setValue, name],
  );

  const handleNumericInputFocus = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      const cleanValue = e.target.value.replace(/,/g, "");
      ctx.setValue(name, cleanValue, { shouldValidate: false });
    },
    [ctx.setValue, name],
  );

  return {
    onChange: handleNumericInputChange,
    onBlur: handleNumericInputBlur,
    onFocus: handleNumericInputFocus,
  };
};

function SowOrderV0Fields({ children }: { children: React.ReactNode }) {
  return children;
}

const MainTokenAdornment = () => {
  const mainToken = useChainConstant(MAIN_TOKEN);

  return (
    <div className="flex items-center gap-2 px-4 bg-white">
      <IconImage src={mainToken.logoURI} alt="PINTO" size={6} className="rounded-full" />
      <span className="text-black pinto-sm-light">{mainToken.symbol}</span>
    </div>
  );
};

const TotalAmountSlider = ({
  disabled,
  ctx,
  maxAmount,
  handlers,
}: {
  disabled?: boolean;
  ctx: ReturnType<typeof useFormContext<SowOrderV0FormSchema>>;
  maxAmount?: TV;
  handlers: ReturnType<typeof useSharedInputHandlers>;
}) => {
  const decimals = useChainConstant(MAIN_TOKEN).decimals;
  const [totalAmount] = useWatch({ control: ctx.control, name: ["totalAmount"] });
  const sliderValue = useMemo(() => [Number(totalAmount.replace(/,/g, "") || "0")], [totalAmount]);

  const handleOnChange = useCallback(
    (value: number[]) => {
      // Truncate to max decimals (but limit to 6 for UI precision)
      // Use toFixed to avoid floating-point precision issues (e.g., 65.599999 instead of 65.6)
      const maxDecimals = Math.min(decimals, 6);
      const truncatedValue = Number(value[0].toFixed(maxDecimals));
      // use the blur handler to set the value with commas
      handlers.onBlur({ target: { value: truncatedValue.toString() } } as React.FocusEvent<HTMLInputElement>);
      // Trigger cross validation after setting value
      const cleaned = sanitizeNumericInputValue(truncatedValue.toString(), decimals);
      handleCrossValidate(ctx, cleaned, "minSoil", decimals, "gte");
      handleCrossValidate(ctx, cleaned, "maxPerSeason", decimals, "lte");
    },
    [handlers, ctx, decimals],
  );

  return (
    <MultiSlider
      min={0}
      max={maxAmount?.toNumber() ?? 1000}
      disabled={disabled}
      step={0.1}
      value={sliderValue}
      onValueChange={handleOnChange}
    />
  );
};

SowOrderV0Fields.TotalAmount = function TotalAmount({
  farmerDeposits,
}: {
  farmerDeposits?: ReturnType<typeof useFarmerSilo>["deposits"];
}) {
  const { address: accountAddress } = useAccount();
  const ctx = useFormContext<SowOrderV0FormSchema>();
  const handlers = useSharedInputHandlers(ctx, "totalAmount");
  const decimals = useChainConstant(MAIN_TOKEN).decimals;
  const [tokenStrategy, totalAmountValue] = useWatch({
    control: ctx.control,
    name: ["selectedTokenStrategy", "totalAmount"],
  });
  const farmerBalances = useFarmerBalances();
  const priceData = usePriceData();
  const tokenData = useTokenData();

  const maxAmount = useMemo(() => {
    if (!accountAddress || !farmerDeposits) {
      return undefined;
    }

    const summary = StrategyUtil.getSummary(tokenStrategy);
    let totalAmount = TV.ZERO;

    if (summary.type === "SPECIFIC_TOKEN" && summary.addresses) {
      // Sum amounts for specific tokens
      summary.addresses.forEach((address) => {
        const token = tokenData.whitelistedTokens.find((t) => t.address === address);
        if (token) {
          const deposit = farmerDeposits.get(token);
          if (deposit?.amount) {
            // For LP tokens, use price to convert to main token value
            if (token.isLP) {
              const price = priceData.tokenPrices.get(token)?.instant;
              if (price) {
                totalAmount = totalAmount.add(deposit.amount.mul(price));
              }
            } else {
              // For main token, use amount directly
              totalAmount = totalAmount.add(deposit.amount);
            }
          } else {
            // Check balances if no deposits
            const balance = farmerBalances.balances.get(token);
            if (balance?.total) {
              if (token.isLP) {
                const price = priceData.tokenPrices.get(token)?.instant;
                if (price) {
                  totalAmount = totalAmount.add(balance.total.mul(price));
                }
              } else {
                totalAmount = totalAmount.add(balance.total);
              }
            }
          }
        }
      });
    } else {
      // For LOWEST_SEEDS or LOWEST_PRICE, sum all available amounts
      farmerDeposits.forEach((deposit, token) => {
        if (deposit.amount) {
          if (token.isLP) {
            const price = priceData.tokenPrices.get(token)?.instant;
            if (price) {
              totalAmount = totalAmount.add(deposit.amount.mul(price));
            }
          } else {
            totalAmount = totalAmount.add(deposit.amount);
          }
        }
      });
    }

    return totalAmount.gt(0) ? totalAmount : undefined;
  }, [accountAddress, farmerDeposits, tokenStrategy, farmerBalances, priceData, tokenData]);

  // Check if total amount exceeds max deposits
  const exceedsDeposits = useMemo(() => {
    if (!maxAmount || !totalAmountValue) return false;
    const cleaned = sanitizeNumericInputValue(totalAmountValue, decimals);
    if (cleaned.nonAmount) return false;
    return cleaned.tv.toNumber() > maxAmount.toNumber();
  }, [maxAmount, totalAmountValue, decimals]);

  const getHandlers = (): BaseIFormContextHandlers => {
    return {
      ...handlers,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        const cleaned = handlers.onChange(e);
        handleCrossValidate(ctx, cleaned, "minSoil", decimals, "gte");
        handleCrossValidate(ctx, cleaned, "maxPerSeason", decimals, "lte");
        return cleaned;
      },
    };
  };

  // Disable slider if no token strategy selected or no balance available
  const isSliderDisabled = !tokenStrategy || !maxAmount || maxAmount.lte(0);

  return (
    <Col className="flex-1 gap-2">
      <TooltipLabel tooltipText={TOOLTIP_COPY.totalAmount}>I want to Sow up to</TooltipLabel>
      <Row className="flex-1 gap-4 w-full">
        <TotalAmountSlider maxAmount={maxAmount} disabled={isSliderDisabled} ctx={ctx} handlers={handlers} />
        <FormField
          control={ctx.control}
          name="totalAmount"
          render={({ field, fieldState }) => (
            <FormControl>
              <Input
                {...field}
                {...sharedInputProps}
                placeholder="0.00"
                outlined
                disabled={isSliderDisabled}
                {...getHandlers()}
                isError={!!fieldState.error || exceedsDeposits}
                containerClassName="w-full max-w-[25rem]"
                className="min-w-0 text-ellipsis"
                endIcon={<MainTokenAdornment />}
              />
            </FormControl>
          )}
        />
      </Row>
    </Col>
  );
};

/**
 * 
 * Handle cross validation between two fields.

 * @param ctx - The form context.
 * @param left - The left field value.
 * @param rightName - The right field name.
 * @param rightDecimals - The right field decimals.
 * @param operation - The operation to perform (lte, gte).
 * 
 * @note There is somewhat some duplicated logic in the schema; however, because individual fields
 * do not re-render when the other field changes, we need to handle cross validation manually.
 * 
 * This function will trigger the right field's validation if:
 * 1. the condition is not met
 * 2. OR if the right field has an error but the condition is valid.
 */
const handleCrossValidate = (
  ctx: ReturnType<typeof useFormContext<SowOrderV0FormSchema>>,
  left: ReturnType<typeof sanitizeNumericInputValue>,
  rightName: keyof SowOrderV0FormSchema,
  rightDecimals: number,
  operation: "lte" | "gte",
) => {
  const value = ctx.getValues(rightName);

  if (typeof value !== "string") {
    throw new Error("Unexpected value type");
  }

  const rightValue = postSanitizedSanitizedValue(value, rightDecimals);

  if (left.nonAmount || rightValue.nonAmount) {
    return;
  }

  const valid = left.tv[operation]?.(rightValue.tv);

  const rightError = ctx.formState.errors?.[rightName];

  if (!valid || (valid && rightError)) {
    ctx.trigger(rightName);
  }
};

SowOrderV0Fields.TokenStrategy = function TokenStrategy({
  openDialog,
}: {
  openDialog: () => void;
}) {
  const ctx = useFormContext<{ selectedTokenStrategy: TractorTokenStrategy }>();
  const tokenMap = useTokenMap();

  const strategy = useWatch({ control: ctx.control, name: "selectedTokenStrategy" });

  const addresses = StrategyUtil.extractAddresses(strategy);

  const selectedToken =
    strategy.type === "SPECIFIC_TOKEN" && addresses?.length ? tokenMap[getTokenIndex(addresses[0] ?? "")] : undefined;

  const getSelectedTokenDisplay = () => {
    if (strategy?.type === "LOWEST_SEEDS") {
      return "Token with Least Seeds";
    } else if (strategy?.type === "LOWEST_PRICE") {
      return "Token with Best Price";
    } else if (strategy?.type === "SPECIFIC_TOKEN") {
      return selectedToken ? `Dep. ${selectedToken.symbol}` : "Select Token";
    }
    return "Select Deposited Silo Token";
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <TooltipLabel tooltipText={TOOLTIP_COPY.tokenStrategy}>Sow Using</TooltipLabel>
        <Button variant="outline-gray-shadow" size="xl" rounded="full" onClick={openDialog}>
          <div className="flex items-center gap-2">
            {selectedToken && <IconImage src={selectedToken.logoURI} alt="token" size={6} className="rounded-full" />}
            <div className="pinto-body-light">{getSelectedTokenDisplay()}</div>
            <IconImage src={arrowDown} size={3} alt="open token select dialog" />
          </div>
        </Button>
      </div>
    </div>
  );
};

const TemperatureSlider = ({
  disabled,
  ctx,
  minTemp,
  maxTemp,
}: {
  disabled?: boolean;
  ctx: ReturnType<typeof useFormContext<SowOrderV0FormSchema>>;
  minTemp: number;
  maxTemp: number;
}) => {
  const [temperature] = useWatch({ control: ctx.control, name: ["temperature"] });
  const sliderValue = useMemo(() => {
    const value = Number(temperature.replace(/,/g, "") || "0");
    return [Math.max(minTemp, Math.min(maxTemp, value))];
  }, [temperature, minTemp, maxTemp]);

  const handleOnChange = useCallback(
    (value: number[]) => {
      const truncatedValue = Math.floor(value[0]);
      ctx.setValue("temperature", truncatedValue.toString(), { shouldValidate: true });
    },
    [ctx],
  );

  return (
    <MultiSlider
      min={minTemp}
      max={maxTemp}
      disabled={disabled}
      step={1}
      value={sliderValue}
      onValueChange={handleOnChange}
    />
  );
};

SowOrderV0Fields.Temperature = function Temperature() {
  const ctx = useFormContext<SowOrderV0FormSchema>();
  const handlers = useSharedInputHandlers(ctx, "temperature");
  const { data: maxTemperature } = useReadBeanstalk_MaxTemperature();
  const temperature = useTemperature();
  const hasInitialized = useRef(false);

  const currentTempValue = useMemo(() => {
    // Use max temperature from contract if available, otherwise use temperature state
    if (maxTemperature !== undefined) {
      return Math.floor(TV.fromBigInt(maxTemperature, 6).toNumber());
    }
    return Math.floor(temperature.max?.toNumber() || 0);
  }, [maxTemperature, temperature.max]);

  const minTemp = useMemo(() => Math.max(0, currentTempValue - 100), [currentTempValue]);
  const maxTemp = useMemo(() => currentTempValue + 100, [currentTempValue]);

  // Set default value to current temperature only on initial mount
  useEffect(() => {
    if (hasInitialized.current) return;
    const currentValue = ctx.getValues("temperature");
    if (!currentValue || currentValue === "") {
      ctx.setValue("temperature", currentTempValue.toString(), { shouldValidate: false });
    }
    hasInitialized.current = true;
  }, [currentTempValue, ctx]);

  return (
    <Col className="flex-1 gap-2">
      <TooltipLabel tooltipText={TOOLTIP_COPY.temperature}>Minimum Temperature to Sow</TooltipLabel>
      <Row className="flex-1 gap-4 w-full">
        <TemperatureSlider minTemp={minTemp} maxTemp={maxTemp} disabled={false} ctx={ctx} />
        <FormField
          control={ctx.control}
          name="temperature"
          render={({ field, fieldState }) => (
            <FormControl>
              <Input
                {...field}
                {...sharedInputProps}
                className="rounded-lg min-w-0 text-ellipsis"
                placeholder={currentTempValue.toString()}
                outlined
                {...handlers}
                isError={!!fieldState.error}
                containerClassName="w-full max-w-[30rem]"
                endIcon={<div className="mr-2 text-pinto-primary pinto-body-bold">%</div>}
              />
            </FormControl>
          )}
        />
      </Row>
    </Col>
  );
};

SowOrderV0Fields.MorningAuction = function MorningAuction() {
  const ctx = useFormContext<SowOrderV0FormSchema>();

  return (
    <FormField
      control={ctx.control}
      name="morningAuction"
      render={({ field }) => (
        <FormItem className="flex flex-row w-full items-center justify-between gap-2 space-y-0">
          <FormLabel tooltipText={TOOLTIP_COPY.morningAuction}>Execute during the Morning</FormLabel>
          <FormControl>
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
        </FormItem>
      )}
    />
  );
};

// TODO: ADD REFERRAL CODE VALIDATOR!

const BONUS_MULTIPLIER = 0.1;

SowOrderV0Fields.PodDisplay = function PodDisplay({
  onOpenReferralPopover,
}: {
  onOpenReferralPopover?: () => void;
}) {
  const ctx = useFormContext<SowOrderV0FormSchema>();
  const mainToken = useChainConstant(MAIN_TOKEN);
  const [totalAmount, temperature] = useWatch({ control: ctx.control, name: ["totalAmount", "temperature"] });
  const { data: maxTemperature } = useReadBeanstalk_MaxTemperature();
  const temperatureState = useTemperature();
  const { validReferralCodeFromStorage } = useReferralCode();

  const estimatedPods = useMemo(() => {
    if (!totalAmount || totalAmount === "") {
      return TV.ZERO;
    }

    const totalAmountTV = sanitizeNumericInputValue(totalAmount, mainToken.decimals).tv;
    if (totalAmountTV.eq(0)) {
      return TV.ZERO;
    }

    // Use temperature from form if available, otherwise use max temperature from contract
    const tempValue =
      temperature && temperature !== ""
        ? Number(temperature.replace(/,/g, ""))
        : maxTemperature !== undefined
          ? TV.fromBigInt(maxTemperature, 6).toNumber()
          : temperatureState.max?.toNumber() || 0;

    // Calculate pods: amount * (temperature + 100) / 100
    const multiplier = TV.fromHuman(tempValue + 100, 6).div(100);
    return multiplier.mul(totalAmountTV);
  }, [totalAmount, temperature, mainToken.decimals, maxTemperature, temperatureState.max]);

  const bonusPods = useMemo(() => {
    return estimatedPods.mul(BONUS_MULTIPLIER);
  }, [estimatedPods]);

  // Use validReferralCodeFromStorage for conditional rendering (from localStorage)
  const hasReferralCode = Boolean(validReferralCodeFromStorage);

  return (
    <Col className="w-full gap-2">
      <Row className="w-full items-start justify-between gap-4">
        <div className="pinto-sm-light text-pinto-light shrink-0">Pods</div>
        <div className="flex items-start gap-2 min-w-0">
          <IconImage src={podIcon} alt="Pods" size={5} className="shrink-0 mt-0.5" />
          <div className="pinto-body-bold text-black break-all text-right">
            {formatter.number(estimatedPods, {
              minValue: 0.01,
              compact: estimatedPods.toNumber() >= NUMBER_ABBR_THRESHOLDS.TRILLION,
            })}{" "}
            Pods
          </div>
        </div>
      </Row>
      {hasReferralCode ? (
        <Row className="w-full items-start justify-between gap-4">
          <div className="pinto-sm-light text-pinto-light shrink-0">Bonus Pods</div>
          <div className="flex items-start gap-2 min-w-0">
            <IconImage src={podIcon} alt="Bonus Pods" size={5} className="shrink-0 mt-0.5" />
            <div className="pinto-body-bold text-pinto-green-4 break-all text-right">
              {formatter.number(bonusPods, {
                minValue: 0.01,
                compact: bonusPods.toNumber() >= NUMBER_ABBR_THRESHOLDS.TRILLION,
              })}{" "}
              Pods
            </div>
          </div>
        </Row>
      ) : (
        <Row className="w-full justify-start">
          <button
            type="button"
            onClick={onOpenReferralPopover}
            className="pinto-sm-light text-pinto-green-4 underline cursor-pointer hover:text-pinto-green-3"
          >
            Use a referral code and gain 10% more pods!
          </button>
        </Row>
      )}
    </Col>
  );
};

export type ActiveTipButton = "down5" | "down1" | "average" | "up1" | "up5";

const TIP_PRESETS = ["down5", "down1", "average", "up1", "up5"] as const;

const TIP_PRESET_LABELS: Record<ActiveTipButton, string> = {
  down5: "5% ↓",
  down1: "1% ↓",
  average: "Average",
  up1: "1% ↑",
  up5: "5% ↑",
};

SowOrderV0Fields.OperatorTip = function OperatorTip({
  averageTipPaid,
  noInitToAverageTipPaid = false,
}: {
  averageTipPaid: number;
  noInitToAverageTipPaid?: boolean;
}) {
  const ctx = useFormContext<SowOrderV0FormSchema>();
  const handlers = useSharedInputHandlers(ctx, "operatorTip");

  const [activeTipButton, setActiveTipButton] = useState<ActiveTipButton | undefined>(
    noInitToAverageTipPaid ? undefined : "average",
  );

  const handleTipButtonClick = useCallback(
    (type: ActiveTipButton) => {
      // Helper functions for UI
      const getTipValue = (type: ActiveTipButton) => {
        if (!type) return "0";
        const baseValue = averageTipPaid;
        switch (type) {
          case "down5":
            return (baseValue * 0.95).toFixed(2);
          case "down1":
            return (baseValue * 0.99).toFixed(2);
          case "average":
            return baseValue.toFixed(2);
          case "up1":
            return (baseValue * 1.01).toFixed(2);
          case "up5":
            return (baseValue * 1.05).toFixed(2);
          default:
            return "0";
        }
      };

      setActiveTipButton(type);
      const newValue = getTipValue(type);
      ctx.setValue("operatorTip", newValue);
    },
    [ctx.setValue, averageTipPaid],
  );

  // Update operator tip when average changes and button is active
  useEffect(() => {
    if (activeTipButton === "average") {
      ctx.setValue("operatorTip", averageTipPaid.toFixed(2));
    }
  }, [averageTipPaid, activeTipButton, ctx.setValue]);

  return (
    <Col className="gap-2">
      <Label variant="form">I'm willing to pay someone</Label>
      <FormField
        control={ctx.control}
        name="operatorTip"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormControl>
              <Input
                {...field}
                {...sharedInputProps}
                outlined
                placeholder="0.00"
                {...handlers}
                isError={!!fieldState.error}
                endIcon={<MainTokenAdornment />}
              />
            </FormControl>
            <div className="flex justify-between gap-2 mb-2">
              {TIP_PRESETS.map((type) => (
                <Button
                  key={type}
                  variant="outline"
                  size="sm"
                  className={`${activeTipButtonStyles.base} ${
                    activeTipButton === type ? activeTipButtonStyles.active : activeTipButtonStyles.inactive
                  }`}
                  onClick={() => handleTipButtonClick(type)}
                  type="button"
                >
                  {TIP_PRESET_LABELS[type]}
                </Button>
              ))}
            </div>
          </FormItem>
        )}
      />
      <div className="pinto-sm-light text-pinto-gray-4">each time they Sow part of my Tractor Order.</div>
    </Col>
  );
};

const activeTipButtonStyles = {
  base: "rounded-full px-4 py-2 flex items-center justify-center transition-colors h-[2rem] sm:h-[2.25rem] pinto-sm whitespace-nowrap flex-1",
  active:
    "bg-pinto-green-1 border border-pinto-green-4 text-pinto-green-4 hover:bg-pinto-green-1 hover:text-pinto-green-4 hover:border-pinto-green-4",
  inactive: "bg-white border-pinto-gray-2 text-pinto-gray-4 hover:bg-pinto-green-1/50 hover:border-pinto-green-2/50",
} as const;

SowOrderV0Fields.ExecutionsAndTip = function ExecutionsAndTip({ className }: { className?: string }) {
  const ctx = useFormContext<SowOrderV0FormSchema>();

  const mainToken = useChainConstant(MAIN_TOKEN);

  // Use selective watching instead of watching all fields
  const [totalAmount, minSoil, maxPerSeason, operatorTip] = useWatch({
    control: ctx.control,
    name: ["totalAmount", "minSoil", "maxPerSeason", "operatorTip"],
  }) as [string, string, string, string];

  const calculationFields = { totalAmount, minSoil, maxPerSeason, operatorTip };

  // Memoize cleaned values calculation
  const cleanedValues = useMemo(() => {
    return {
      min: sanitizeNumericInputValue(calculationFields.minSoil || "", mainToken.decimals).tv,
      max: sanitizeNumericInputValue(calculationFields.maxPerSeason || "", mainToken.decimals).tv,
      total: sanitizeNumericInputValue(calculationFields.totalAmount || "", mainToken.decimals).tv,
    };
  }, [calculationFields.minSoil, calculationFields.maxPerSeason, calculationFields.totalAmount, mainToken.decimals]);

  // Memoize estimated executions calculation
  const estimatedExecutions = useMemo(() => {
    const { total, min, max } = cleanedValues;

    if (!calculationFields.totalAmount || !calculationFields.maxPerSeason) {
      return "~0";
    }

    try {
      if (total.eq(0) || max.eq(0)) {
        return "~0";
      }

      if (min.eq(0)) {
        let lowerBound = Math.floor(total.div(max).toNumber());
        lowerBound = Math.max(1, lowerBound);
        return `~${lowerBound}-∞`;
      }

      let lowerBound = Math.floor(total.div(max).toNumber());
      let upperBound = Math.ceil(total.div(min).toNumber());

      lowerBound = Math.max(1, lowerBound);
      upperBound = Math.max(lowerBound, upperBound);

      if (lowerBound === upperBound) {
        return `~${lowerBound}`;
      } else {
        return `~${lowerBound}-${upperBound}`;
      }
    } catch (e) {
      console.error("Error calculating executions:", e);
      return "~0";
    }
  }, [cleanedValues, calculationFields.totalAmount, calculationFields.maxPerSeason]);

  // Memoize estimated total tip calculation
  const estimatedTotalTip = useMemo(() => {
    if (!calculationFields.operatorTip || !calculationFields.totalAmount || !calculationFields.maxPerSeason) {
      return "~0";
    }

    const { total, min, max } = cleanedValues;

    try {
      const tipValue = parseFloat(calculationFields.operatorTip);

      if (total.eq(0) || max.eq(0) || Number.isNaN(tipValue)) {
        return "~0";
      }

      let lowerBound = Math.floor(total.div(max).toNumber());
      lowerBound = Math.max(1, lowerBound);
      const lowerTip = lowerBound * tipValue;

      // Helper to format tip values with compact notation for large numbers
      const formatTip = (val: number) => {
        if (val >= NUMBER_ABBR_THRESHOLDS.BILLION) {
          return formatter.number(val, { maxDecimals: 2, compact: true });
        }
        return val.toFixed(2);
      };

      if (min.eq(0)) {
        return `~${formatTip(lowerTip)}-∞`;
      }

      let upperBound = Math.ceil(total.div(min).toNumber());
      upperBound = Math.max(lowerBound, upperBound);
      const upperTip = upperBound * tipValue;

      if (lowerTip === upperTip) {
        return `~${formatTip(lowerTip)}`;
      } else {
        return `~${formatTip(lowerTip)}-${formatTip(upperTip)}`;
      }
    } catch (e) {
      console.error("Error calculating total tip:", e);
      return "~0";
    }
  }, [cleanedValues, calculationFields.operatorTip, calculationFields.totalAmount, calculationFields.maxPerSeason]);

  return (
    <Col className={cn("gap-2", className)}>
      <Row className=" justify-between pinto-sm-light">
        <div className="text-pinto-light">Estimated total number of executions</div>
        <div className="text-pinto-primary">{estimatedExecutions}</div>
      </Row>
      <Row className="justify-between pinto-sm-light">
        <div className="text-pinto-light">Estimated total tip</div>
        <div className="flex items-center text-pinto-primary">
          {estimatedTotalTip}
          <IconImage src={mainToken.logoURI} alt="PINTO" size={5} className="rounded-full mx-1" />
          {mainToken.symbol}
        </div>
      </Row>
    </Col>
  );
};

// Referral Code field component
SowOrderV0Fields.ReferralCode = function ReferralCode() {
  const ctx = useFormContext<SowOrderV0FormSchema>();
  const referralCode = useWatch({ control: ctx.control, name: "referralCode" });

  // Validate referral code
  const referralAddress = useMemo(() => {
    if (!referralCode) return null;
    return decodeReferralAddress(referralCode);
  }, [referralCode]);

  const isValid = Boolean(referralCode && referralAddress);
  const isInvalid = Boolean(referralCode && !referralAddress);

  return (
    <FormField
      control={ctx.control}
      name="referralCode"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Referral Code (Optional)</FormLabel>
          <FormControl>
            <Input
              {...field}
              value={field.value || ""}
              placeholder="Enter referral code"
              outlined
              isError={isInvalid}
            />
          </FormControl>
          {isValid && <span className="text-xs text-pinto-green">✓ Valid referral code</span>}
          {isInvalid && <span className="text-xs text-red-500">Invalid referral code</span>}
        </FormItem>
      )}
    />
  );
};

export default SowOrderV0Fields;
