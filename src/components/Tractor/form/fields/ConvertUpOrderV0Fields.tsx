import { FormControl, FormField, FormItem, FormLabel } from "@/components/Form";
import TooltipSimple from "@/components/TooltipSimple";
import { Button } from "@/components/ui/Button";
import IconImage from "@/components/ui/IconImage";
import { Input } from "@/components/ui/Input";
import { MultiSlider, Slider } from "@/components/ui/Slider";
import { MAIN_TOKEN } from "@/constants/tokens";
import { useChainConstant } from "@/utils/chain";
import { postSanitizedSanitizedValue, sanitizeNumericInputValue } from "@/utils/string";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ConvertUpV0FormSchema } from "../schema/convertUp.schema";

import { Col, Row } from "@/components/Container";
import { TooltipLabel } from "@/components/ui/Label";
import { STALK } from "@/constants/internalTokens";
import { useSharedNumericFormFieldHandlers as useFieldHandlers } from "@/hooks/form/useSharedNumericFormFieldHandlers";
import { useMainToken } from "@/state/useTokenData";
import { cn } from "@/utils/utils";
import { UseFormReturn, useFormContext, useWatch } from "react-hook-form";

const sharedInputProps = {
  type: "text",
  inputMode: "decimal",
  pattern: "[0-9]*.?[0-9]*",
} as const;

const TOOLTIP_COPY = {
  tokenStrategy: "The source token(s) use for the Convert Up Order.",
  totalConvertBdv: "The total PDV of the Convert Up Order.",
  minConvertBdvPerExecution: "The minimum PDV per execution of the Convert Up Order.",
  maxConvertBdvPerExecution: "The maximum PDV per execution of the Convert Up Order.",
  minTimeBetweenConverts: "The minimum time between converts of the Convert Up Order.",
  minConvertBonusCapacity: "The minimum convert bonus capacity of the Convert Up Order.",
  maxGrownStalkPerBdv: "The maximum grown stalk per PDV of the Convert Up Order.",
  minGrownStalkPerBdvBonus: "The minimum Grown Stalk Bonus in which this order can be executed.",
  maxPriceToConvertUp: "The maximum price to convert up to.",
  minPriceToConvertUp: "The minimum price to convert up to.",
  maxGrownStalkPerBdvPenalty: "The maximum grown stalk per PDV penalty of the Convert Up Order.",
  slippageRatio: "The slippage ratio of the Convert Up Order.",
  lowStalkDeposits: "The low stalk deposits of the Convert Up Order.",
  operatorTip: "The operator tip of the Convert Up Order.",
  priceRange:
    "The price range to execute the Convert Up Order. The order will be executed when the price is between the minimum and maximum price.",
} as const;

export default function ConvertUpOrderV0Fields({ children }: { children: React.ReactNode }) {
  return children;
}

const MainTokenAdornment = () => {
  const mainToken = useChainConstant(MAIN_TOKEN);

  return (
    <div className="flex items-center gap-2 px-4 bg-white">
      <IconImage src={mainToken.logoURI} alt="PINTO" size={6} className="rounded-full" />
      <span className="hidden sm:block text-black pinto-sm-light">{mainToken.symbol}</span>
    </div>
  );
};

const TextAdornment = ({ text, isEnd = true, className }: { text: string; isEnd?: boolean; className?: string }) => {
  return <div className={cn("text-black pinto-sm-light", isEnd ? "mr-2" : "ml-2", className)}>{text}</div>;
};

ConvertUpOrderV0Fields.TotalConvertBdv = function TotalConvertBdv() {
  const ctx = useFormContext<ConvertUpV0FormSchema>();
  const { decimals } = useMainToken();
  const handlers = useFieldHandlers(ctx, "totalConvertBdv", decimals);

  const isError = !!ctx.formState.errors?.totalConvertBdv;

  // Don't utilize FormField to disable memoization when cross-dependent fields change such as
  // minConvertBdvPerExecution and maxConvertBdvPerExecution.
  // Reduces complexity of the component with having to re-trigger validations for certain components.

  return (
    <Col className="flex-1 gap-2">
      <TooltipLabel tooltipText={TOOLTIP_COPY.totalConvertBdv}>I want to convert up to</TooltipLabel>
      <Input
        {...ctx.register("totalConvertBdv", {
          ...handlers,
        })}
        {...sharedInputProps}
        placeholder="0.00"
        outlined
        isError={isError}
        endIcon={<MainTokenAdornment />}
      />
    </Col>
  );
};

ConvertUpOrderV0Fields.MinConvertBdvPerExecution = function MinConvertBdvPerExecution() {
  const ctx = useFormContext<ConvertUpV0FormSchema>();
  const { decimals } = useMainToken();

  const handlers = useFieldHandlers(ctx, "minConvertBdvPerExecution", decimals);

  const isError = !!ctx.formState.errors?.minConvertBdvPerExecution;

  // Don't utilize FormField to disable memoization when cross-dependent fields change such as
  // maxConvertBdvPerExecution and totalConvertBdv.
  // Reduces complexity of the component with having to re-trigger validations for certain components.
  // This is a trade-off for the sake of performance.

  return (
    <Col className="flex-1 gap-2">
      <TooltipLabel tooltipText={TOOLTIP_COPY.minConvertBdvPerExecution}>Min PDV per Execution</TooltipLabel>
      <Input
        {...ctx.register("minConvertBdvPerExecution", {
          required: true,
          ...handlers,
        })}
        {...sharedInputProps}
        placeholder="0.00"
        outlined
        isError={isError}
        endIcon={<TextAdornment text="PDV" />}
      />
    </Col>
  );
};

ConvertUpOrderV0Fields.MaxConvertBdvPerExecution = function MaxConvertBdvPerExecution() {
  const ctx = useFormContext<ConvertUpV0FormSchema>();
  const { decimals } = useMainToken();

  const handlers = useFieldHandlers(ctx, "maxConvertBdvPerExecution", decimals);

  const isError = !!ctx.formState.errors?.maxConvertBdvPerExecution;

  // Don't utilize FormField to disable memoization when cross-dependent fields change such as
  // minConvertBdvPerExecution and totalConvertBdv.
  // Reduces complexity of the component with having to re-trigger validations for certain components.
  // This is a trade-off for the sake of performance.

  return (
    <Col className="flex-1 gap-2">
      <TooltipLabel tooltipText={TOOLTIP_COPY.maxConvertBdvPerExecution}>Max PDV per Execution</TooltipLabel>
      <Input
        {...ctx.register("maxConvertBdvPerExecution", {
          required: true,
          ...handlers,
        })}
        {...sharedInputProps}
        placeholder="0.00"
        outlined
        isError={isError}
        endIcon={<TextAdornment text="PDV" />}
      />
    </Col>
  );
};

ConvertUpOrderV0Fields.MinTimeBetweenConverts = function MinTimeBetweenConverts() {
  const ctx = useFormContext<ConvertUpV0FormSchema>();
  const handlers = useFieldHandlers(ctx, "minTimeBetweenConverts", 0);

  return (
    <FormField
      control={ctx.control}
      name="minTimeBetweenConverts"
      render={({ field, fieldState }) => (
        <FormItem className="flex-1">
          <FormLabel tooltipText={TOOLTIP_COPY.minTimeBetweenConverts}>Min time between converts</FormLabel>
          <div className="flex flex-col">
            <FormControl>
              <Input
                {...field}
                {...sharedInputProps}
                // className="rounded-lg"
                placeholder="3600"
                outlined
                {...handlers}
                isError={!!fieldState.error}
              />
            </FormControl>
          </div>
        </FormItem>
      )}
    />
  );
};

ConvertUpOrderV0Fields.MinConvertBonusCapacity = function MinConvertBonusCapacity() {
  const ctx = useFormContext<ConvertUpV0FormSchema>();

  // Convert Capacity is in terms of PDV
  const { decimals } = useMainToken();
  const handlers = useFieldHandlers(ctx, "minConvertBonusCapacity", decimals);

  return (
    <FormField
      control={ctx.control}
      name="minConvertBonusCapacity"
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel tooltipText={TOOLTIP_COPY.minConvertBonusCapacity}>Min Convert Bonus Capacity</FormLabel>
          <FormControl>
            <Input
              {...field}
              {...sharedInputProps}
              placeholder="0.00"
              outlined
              {...handlers}
              isError={!!fieldState.error}
              endIcon={<TextAdornment text="Grown Stalk / PDV" />}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};

ConvertUpOrderV0Fields.MaxGrownStalkPerBdv = function MaxGrownStalkPerBdv() {
  const ctx = useFormContext<ConvertUpV0FormSchema>();

  const handlers = useFieldHandlers(ctx, "maxGrownStalkPerBdv", STALK.decimals);

  return (
    <FormField
      control={ctx.control}
      name="maxGrownStalkPerBdv"
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel tooltipText={TOOLTIP_COPY.maxGrownStalkPerBdv}>Only Convert Deposits with Less than</FormLabel>
          <FormControl>
            <Input
              {...field}
              {...sharedInputProps}
              placeholder="0.00"
              outlined
              {...handlers}
              isError={!!fieldState.error}
              endIcon={<TextAdornment text="Grown Stalk / PDV" />}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};

ConvertUpOrderV0Fields.MinGrownStalkPerBdvBonus = function MinGrownStalkPerBdvBonus() {
  const ctx = useFormContext<ConvertUpV0FormSchema>();
  const handlers = useFieldHandlers(ctx, "minGrownStalkPerBdvBonus", STALK.decimals);

  return (
    <FormField
      control={ctx.control}
      name="minGrownStalkPerBdvBonus"
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel tooltipText={TOOLTIP_COPY.minGrownStalkPerBdvBonus}>Min Grown Stalk Bonus Per PDV</FormLabel>
          <FormControl>
            <Input
              {...field}
              {...sharedInputProps}
              placeholder="0.00"
              outlined
              {...handlers}
              isError={!!fieldState.error}
              endIcon={<TextAdornment text="Grown Stalk" />}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};

// Slider configuration
const sliderMin = 0.001; // $0.001 minimum
const sliderMax = 0.999; // $0.999 maximum
const sliderStep = 0.001; // $0.001 increments

const tickDecimals = 3;

ConvertUpOrderV0Fields.PriceRange = function PriceRange() {
  const ctx = useFormContext<ConvertUpV0FormSchema>();

  const { decimals } = useMainToken();

  const minPriceHandlers = useFieldHandlers(ctx, "minPriceToConvertUp", decimals);
  const maxPriceHandlers = useFieldHandlers(ctx, "maxPriceToConvertUp", decimals);

  // Watch both price fields
  const [minPrice, maxPrice] = useWatch({
    control: ctx.control,
    name: ["minPriceToConvertUp", "maxPriceToConvertUp"],
  }) as [string, string];

  const minPriceParsed = parseFloat(minPrice || "0");
  const maxPriceParsed = parseFloat(maxPrice || "0");

  // Convert string values to numbers for slider
  const minPriceNumber = Number.isNaN(minPriceParsed) ? sliderMin : minPriceParsed;
  const maxPriceNumber = Number.isNaN(maxPriceParsed) ? sliderMax : maxPriceParsed;

  const handleSliderChange = useCallback(
    (newRange: number[]) => {
      const [newMin, newMax] = newRange;
      ctx.setValue("minPriceToConvertUp", newMin.toFixed(tickDecimals), { shouldValidate: true });
      ctx.setValue("maxPriceToConvertUp", newMax.toFixed(tickDecimals), { shouldValidate: true });
    },
    [ctx],
  );

  // Get current slider values, ensuring they're within bounds
  const sliderValues = useMemo(() => {
    const min = Math.max(sliderMin, Math.min(sliderMax, minPriceNumber));
    const max = Math.max(sliderMin, Math.min(sliderMax, maxPriceNumber));
    return [min, max];
  }, [minPriceNumber, maxPriceNumber, sliderMin, sliderMax]);

  const minError = ctx.formState.errors?.minPriceToConvertUp;
  const maxError = ctx.formState.errors?.maxPriceToConvertUp;
  const hasError = !!(minError || maxError);

  return (
    <div className="flex flex-col gap-6">
      <TooltipLabel tooltipText={TOOLTIP_COPY.priceRange}>Execute when Price is Between</TooltipLabel>
      <MultiSlider
        min={sliderMin}
        max={sliderMax}
        step={sliderStep}
        value={sliderValues}
        onValueChange={handleSliderChange}
        className={cn("w-full", hasError && "opacity-50")}
      />
      <Row className="items-start gap-4 w-full">
        <Col className="flex-1 gap-2">
          <TooltipLabel tooltipText={TOOLTIP_COPY.minPriceToConvertUp}>Min Price</TooltipLabel>
          <Input
            {...ctx.register("minPriceToConvertUp", {
              ...minPriceHandlers,
            })}
            {...sharedInputProps}
            placeholder={sliderMin.toString()}
            outlined
            isError={!!minError}
            className="pl-6"
            startIcon={<TextAdornment text="$" isEnd={false} className="pinto-body-light mt-[1px]" />}
          />
        </Col>
        <Col className="flex-1 gap-2">
          <TooltipLabel tooltipText={TOOLTIP_COPY.maxPriceToConvertUp}>Max Price</TooltipLabel>
          <Input
            {...ctx.register("maxPriceToConvertUp", {
              ...maxPriceHandlers,
            })}
            {...sharedInputProps}
            placeholder={sliderMax.toString()}
            outlined
            isError={!!maxError}
            className="pl-6"
            startIcon={<TextAdornment text="$" isEnd={false} className="pinto-body-light mt-[1px]" />}
          />
        </Col>
      </Row>
    </div>
  );
};

ConvertUpOrderV0Fields.MaxGrownStalkPerBdvPenalty = function MaxGrownStalkPerBdvPenalty() {
  const ctx = useFormContext<ConvertUpV0FormSchema>();
  const handlers = useFieldHandlers(ctx, "maxGrownStalkPerBdvPenalty", STALK.decimals);

  return (
    <FormField
      control={ctx.control}
      name="maxGrownStalkPerBdvPenalty"
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel tooltipText={TOOLTIP_COPY.maxGrownStalkPerBdvPenalty}>Max Grown Stalk per BDV Penalty</FormLabel>
          <FormControl>
            <Input
              {...field}
              {...sharedInputProps}
              placeholder="-0.10"
              outlined
              {...handlers}
              isError={!!fieldState.error}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};

ConvertUpOrderV0Fields.SlippageRatio = function SlippageRatio() {
  const ctx = useFormContext<ConvertUpV0FormSchema>();
  const handlers = useFieldHandlers(ctx, "slippageRatio", 0);

  return (
    <FormField
      control={ctx.control}
      name="slippageRatio"
      render={({ field, fieldState }) => (
        <FormItem className="flex flex-row w-full items-center justify-between gap-2 space-y-0">
          <FormLabel tooltipText={TOOLTIP_COPY.slippageRatio}>Slippage Tolerance</FormLabel>
          <div className="flex flex-col">
            <FormControl>
              <Input
                {...field}
                {...sharedInputProps}
                className="rounded-lg w-[140px]"
                placeholder="0.1"
                outlined
                {...handlers}
                isError={!!fieldState.error}
                endIcon={<div className="mr-2 text-pinto-primary pinto-body-bold">%</div>}
              />
            </FormControl>
          </div>
        </FormItem>
      )}
    />
  );
};

/**
 * Handle cross validation between two fields.
 *
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
  ctx: ReturnType<typeof useFormContext<ConvertUpV0FormSchema>>,
  left: ReturnType<typeof sanitizeNumericInputValue>,
  rightName: keyof ConvertUpV0FormSchema,
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

export type ActiveTipButton = "down5" | "down1" | "average" | "up1" | "up5";

const TIP_PRESETS = ["down5", "down1", "average", "up1", "up5"] as const;

const TIP_PRESET_LABELS: Record<ActiveTipButton, string> = {
  down5: "5% �",
  down1: "1% �",
  average: "Average",
  up1: "1% �",
  up5: "5% �",
};

ConvertUpOrderV0Fields.OperatorTip = function OperatorTip({
  averageTipPaid,
  noInitToAverageTipPaid = false,
}: {
  averageTipPaid: number;
  noInitToAverageTipPaid?: boolean;
}) {
  const ctx = useFormContext<ConvertUpV0FormSchema>();
  const { decimals } = useMainToken();
  const handlers = useFieldHandlers(ctx, "operatorTip", decimals);

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
      <FormLabel>I'm willing to pay someone</FormLabel>
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
      <div className="pinto-sm-light text-pinto-gray-4">each time they execute part of my Convert Up Order.</div>
    </Col>
  );
};

const activeTipButtonStyles = {
  base: "rounded-full px-4 py-2 flex items-center justify-center transition-colors h-[2rem] sm:h-[2.25rem] pinto-sm whitespace-nowrap flex-1",
  active:
    "bg-pinto-green-1 border border-pinto-green-4 text-pinto-green-4 hover:bg-pinto-green-1 hover:text-pinto-green-4 hover:border-pinto-green-4",
  inactive: "bg-white border-pinto-gray-2 text-pinto-gray-4 hover:bg-pinto-green-1/50 hover:border-pinto-green-2/50",
} as const;

ConvertUpOrderV0Fields.ExecutionsAndTip = function ExecutionsAndTip({ className }: { className?: string }) {
  const ctx = useFormContext<ConvertUpV0FormSchema>();

  const mainToken = useChainConstant(MAIN_TOKEN);

  // Use selective watching instead of watching all fields
  const [totalConvertBdv, minConvertBdvPerExecution, maxConvertBdvPerExecution, operatorTip] = useWatch({
    control: ctx.control,
    name: ["totalConvertBdv", "minConvertBdvPerExecution", "maxConvertBdvPerExecution", "operatorTip"],
  }) as [string, string, string, string];

  const calculationFields = { totalConvertBdv, minConvertBdvPerExecution, maxConvertBdvPerExecution, operatorTip };

  // Memoize cleaned values calculation
  const cleanedValues = useMemo(() => {
    return {
      min: sanitizeNumericInputValue(calculationFields.minConvertBdvPerExecution || "", mainToken.decimals).tv,
      max: sanitizeNumericInputValue(calculationFields.maxConvertBdvPerExecution || "", mainToken.decimals).tv,
      total: sanitizeNumericInputValue(calculationFields.totalConvertBdv || "", mainToken.decimals).tv,
    };
  }, [
    calculationFields.minConvertBdvPerExecution,
    calculationFields.maxConvertBdvPerExecution,
    calculationFields.totalConvertBdv,
    mainToken.decimals,
  ]);

  // Memoize estimated executions calculation
  const estimatedExecutions = useMemo(() => {
    const { total, min, max } = cleanedValues;

    if (!calculationFields.totalConvertBdv || !calculationFields.maxConvertBdvPerExecution) {
      return "~0";
    }

    try {
      if (total.eq(0) || max.eq(0)) {
        return "~0";
      }

      if (min.eq(0)) {
        let lowerBound = Math.floor(total.div(max).toNumber());
        lowerBound = Math.max(1, lowerBound);
        return `~${lowerBound}-`;
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
  }, [cleanedValues, calculationFields.totalConvertBdv, calculationFields.maxConvertBdvPerExecution]);

  // Memoize estimated total tip calculation
  const estimatedTotalTip = useMemo(() => {
    if (
      !calculationFields.operatorTip ||
      !calculationFields.totalConvertBdv ||
      !calculationFields.maxConvertBdvPerExecution
    ) {
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

      if (min.eq(0)) {
        return `~${lowerTip.toFixed(2)}-`;
      }

      let upperBound = Math.ceil(total.div(min).toNumber());
      upperBound = Math.max(lowerBound, upperBound);
      const upperTip = upperBound * tipValue;

      if (lowerTip === upperTip) {
        return `~${lowerTip.toFixed(2)}`;
      } else {
        return `~${lowerTip.toFixed(2)}-${upperTip.toFixed(2)}`;
      }
    } catch (e) {
      console.error("Error calculating total tip:", e);
      return "~0";
    }
  }, [
    cleanedValues,
    calculationFields.operatorTip,
    calculationFields.totalConvertBdv,
    calculationFields.maxConvertBdvPerExecution,
  ]);

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

export { TOOLTIP_COPY as CONVERT_UP_TOOLTIP_COPY };
