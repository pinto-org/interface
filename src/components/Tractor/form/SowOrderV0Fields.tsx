import arrowDown from "@/assets/misc/ChevronDown.svg";
import podIcon from "@/assets/protocol/Pod.png";
import { TokenValue } from "@/classes/TokenValue";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/Form";
import { Button } from "@/components/ui/Button";
import IconImage from "@/components/ui/IconImage";
import { Input } from "@/components/ui/Input";
import { Slider } from "@/components/ui/Slider";
import { MAIN_TOKEN } from "@/constants/tokens";
import { useTokenMap } from "@/hooks/pinto/useTokenMap";
import { useScaledTemperature } from "@/hooks/useContinuousMorningTime";
import { useChainConstant } from "@/utils/chain";
import { formatter } from "@/utils/format";
import { sanitizeNumericInputValue } from "@/utils/string";
import { getTokenIndex } from "@/utils/token";
import { useCallback, useMemo, useState } from "react";
import { SowOrderV0FormSchema } from "./SowOrderV0Schema";

import { Col, Row } from "@/components/Container";
import TooltipSimple from "@/components/TooltipSimple";
import { Label, TooltipLabel } from "@/components/ui/Label";
import { Switch } from "@/components/ui/Switch";
import { tractorTokenStrategyUtil as StrategyUtil } from "@/lib/Tractor";
import { TractorTokenStrategy } from "@/lib/Tractor/types";
import { cn } from "@/utils/utils";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { useFormContext, useWatch } from "react-hook-form";
import { EstimatedTotalTipField, TIP_LEVELS, TipLevel, TipPerExecutionField } from "./fields/sharedFields";

const sharedInputProps = {
  type: "text",
  inputMode: "decimal",
  pattern: "[0-9]*.?[0-9]*",
} as const;

// Shared slider conversion utilities
const formToSliderValue = (value: string): number => parseFloat(value) || 0;
const sliderToFormValue = (value: number, decimals: number = 2): string => value.toFixed(decimals);

const useSharedInputHandlers = (
  ctx: ReturnType<typeof useFormContext<SowOrderV0FormSchema>>,
  name: Exclude<keyof SowOrderV0FormSchema, "selectedTokenStrategy" | "morningAuction">,
) => {
  const mainToken = useChainConstant(MAIN_TOKEN);

  const handleNumericInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const cleaned = sanitizeNumericInputValue(e.target.value, mainToken.decimals);

      if (cleaned.nonAmount) {
        ctx.setValue(name, cleaned.str, { shouldValidate: true });
      } else {
        ctx.setValue(name, cleaned.str, { shouldValidate: true });
      }
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

SowOrderV0Fields.TotalAmount = function TotalAmount() {
  const ctx = useFormContext<SowOrderV0FormSchema>();
  const handlers = useSharedInputHandlers(ctx, "totalAmount");

  // Get max amount from wallet balance (PINTO token)
  // TODO: Get actual wallet balance - for now using a reasonable default
  const maxAmount = 10000;
  const minAmount = 0.001;

  return (
    <FormField
      control={ctx.control}
      name="totalAmount"
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel tooltipText="The maximum amount of Pintos you want to sow across all executions">
            Total Pintos to Sow
          </FormLabel>
          <div className="flex items-center gap-4">
            <FormControl className="flex-1">
              <Slider
                value={[formToSliderValue(field.value)]}
                onValueChange={(values) => {
                  field.onChange(sliderToFormValue(values[0]));
                }}
                min={minAmount}
                max={maxAmount}
                step={0.01}
              />
            </FormControl>
            <Input
              {...field}
              {...sharedInputProps}
              value={field.value}
              placeholder="0.001"
              onChange={handlers.onChange}
              onBlur={handlers.onBlur}
              onFocus={handlers.onFocus}
              outlined
              className="w-[12.5rem]"
              isError={!!fieldState.error}
              endIcon={<MainTokenAdornment />}
            />
          </div>
        </FormItem>
      )}
    />
  );
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
    strategy?.type === "SPECIFIC_TOKEN" && addresses?.length ? tokenMap[getTokenIndex(addresses[0] ?? "")] : undefined;

  const getSelectedTokenDisplay = () => {
    if (strategy?.type === "LOWEST_SEEDS") {
      return "Token with Least Seeds";
    } else if (strategy?.type === "LOWEST_PRICE") {
      return "Token with Best Price";
    } else if (strategy?.type === "SPECIFIC_TOKEN") {
      return selectedToken?.symbol || "Select Token";
    }
    return "Select Deposited Silo Token";
  };

  const tooltipText =
    "Select which deposited Silo token to use for funding your Sow order. You can choose a specific token or let the system automatically select based on criteria like lowest seeds or best price.";

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <TooltipLabel tooltipText={tooltipText}>Sow using</TooltipLabel>
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

SowOrderV0Fields.Temperature = function Temperature() {
  const ctx = useFormContext<SowOrderV0FormSchema>();
  const handlers = useSharedInputHandlers(ctx, "temperature");

  const currTemp = useScaledTemperature();

  // Calculate dynamic range based on current temperature (±100%)
  const temperatureRange = useMemo(() => {
    const current = currTemp.scaled?.toNumber() || 0;
    return {
      min: Math.max(0, current - 100),
      max: current + 100,
      current,
    };
  }, [currTemp.scaled]);

  return (
    <FormField
      control={ctx.control}
      name="temperature"
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel tooltipText="The minimum temperature threshold required for the order to execute">
            Minimum Temperature
          </FormLabel>
          <div className="flex items-center gap-4">
            <FormControl className="flex-1">
              <Slider
                value={[formToSliderValue(field.value)]}
                onValueChange={(values) => {
                  field.onChange(sliderToFormValue(values[0], 0));
                }}
                min={temperatureRange.min}
                max={temperatureRange.max}
                step={1}
              />
            </FormControl>
            <Input
              {...field}
              {...sharedInputProps}
              value={field.value}
              placeholder={temperatureRange.current.toFixed(0)}
              onChange={handlers.onChange}
              onBlur={handlers.onBlur}
              onFocus={handlers.onFocus}
              outlined
              className="w-[8.75rem]"
              isError={!!fieldState.error}
              endIcon={<div className="mr-2 text-pinto-primary pinto-body-bold">%</div>}
            />
          </div>
        </FormItem>
      )}
    />
  );
};

SowOrderV0Fields.PodsDisplay = function PodsDisplay() {
  const ctx = useFormContext<SowOrderV0FormSchema>();

  // Watch the form values that affect pod calculation
  const formValues = useWatch({
    control: ctx.control,
    name: ["totalAmount", "temperature"],
  });

  // Calculate pods based on: totalAmount * (1 + temperature/100)
  const calculatedPods = useMemo(() => {
    const amountStr = formValues[0] || "0";
    const tempStr = formValues[1] || "0";

    // Use TokenValue to avoid floating-point precision errors
    const amount = TokenValue.fromHuman(amountStr, 18);
    if (amount.isZero) return 0;

    const temp = TokenValue.fromHuman(tempStr, 18);
    const tempMultiplier = temp.div(100).add(1); // (temperature/100) + 1
    const pods = amount.mul(tempMultiplier);

    return pods.toNumber();
  }, [formValues]);

  // Format the pod amount with commas
  const formattedPods = formatter.twoDec(calculatedPods);

  return (
    <div className="flex items-center justify-between py-3 bg-pinto-gray-1/30 rounded-lg">
      <Label variant="form">Pods</Label>
      <div className="flex items-center gap-2">
        <span className="pinto-body text-pinto-primary">{formattedPods}</span>
        <IconImage src={podIcon} alt="Pod" size={6} className="rounded-full" />
      </div>
    </div>
  );
};

SowOrderV0Fields.MorningAuction = function MorningAuction() {
  const ctx = useFormContext<SowOrderV0FormSchema>();

  return (
    <FormField
      control={ctx.control}
      name="morningAuction"
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center justify-between">
            <FormLabel>Execute during the Morning Auction</FormLabel>
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          </div>
        </FormItem>
      )}
    />
  );
};

SowOrderV0Fields.ExecutionsAndTip = function ExecutionsAndTip({ className }: { className?: string }) {
  const ctx = useFormContext<SowOrderV0FormSchema>();
  const mainToken = useChainConstant(MAIN_TOKEN);

  const [selectedTipLevel, setSelectedTipLevel] = useState<TipLevel>("medium");

  // Handle tip level change
  const handleTipLevelChange = useCallback(
    (level: TipLevel) => {
      setSelectedTipLevel(level);
      ctx.setValue("operatorTip", TIP_LEVELS[level].toFixed(2));
    },
    [ctx],
  );

  // Use selective watching instead of watching all fields
  const [totalAmount, operatorTip] = useWatch({
    control: ctx.control,
    name: ["totalAmount", "operatorTip"],
  }) as [string, string];

  const calculationFields = { totalAmount, operatorTip };

  // Memoize cleaned values calculation
  const cleanedValues = useMemo(() => {
    const total = sanitizeNumericInputValue(calculationFields.totalAmount || "", mainToken.decimals).tv;

    // Calculate smart defaults based on totalAmount
    const totalAmountNum = parseFloat(calculationFields.totalAmount || "0");
    const minSoil = Math.min(totalAmountNum, 25);
    const maxPerSeason = totalAmountNum;

    return {
      total,
      min: sanitizeNumericInputValue(minSoil.toString(), mainToken.decimals).tv,
      max: sanitizeNumericInputValue(maxPerSeason.toString(), mainToken.decimals).tv,
    };
  }, [calculationFields.totalAmount, mainToken.decimals]);

  // Memoize estimated total tip calculation
  const estimatedTotalTip = useMemo(() => {
    if (!calculationFields.operatorTip || !calculationFields.totalAmount) {
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
        return `~${lowerTip.toFixed(2)}-∞`;
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
  }, [cleanedValues, calculationFields.operatorTip, calculationFields.totalAmount]);

  return (
    <Col className={cn("gap-2", className)}>
      <TipPerExecutionField
        operatorTip={operatorTip}
        selectedTipLevel={selectedTipLevel}
        onTipLevelChange={handleTipLevelChange}
      />
      <EstimatedTotalTipField estimatedTotalTip={estimatedTotalTip} />
    </Col>
  );
};

SowOrderV0Fields.OrderSummary = function OrderSummary() {
  const ctx = useFormContext<SowOrderV0FormSchema>();
  const tokenMap = useTokenMap();
  const mainToken = useChainConstant(MAIN_TOKEN);

  // State for advanced dropdown
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Watch all form values for the summary
  const [selectedTokenStrategy, totalAmount, temperature] = useWatch({
    control: ctx.control,
    name: ["selectedTokenStrategy", "totalAmount", "temperature"],
  });

  // Calculate pods
  const calculatedPods = useMemo(() => {
    const amountStr = totalAmount || "0";
    const tempStr = temperature || "0";

    // Use TokenValue to avoid floating-point precision errors
    const amount = TokenValue.fromHuman(amountStr, 18);
    if (amount.isZero) return 0;

    const temp = TokenValue.fromHuman(tempStr, 18);
    const tempMultiplier = temp.div(100).add(1); // (temperature/100) + 1
    const pods = amount.mul(tempMultiplier);

    return pods.toNumber();
  }, [totalAmount, temperature]);

  // Get token display info
  const addresses = StrategyUtil.extractAddresses(selectedTokenStrategy);
  const selectedToken =
    selectedTokenStrategy.type === "SPECIFIC_TOKEN" && addresses?.length
      ? tokenMap[getTokenIndex(addresses[0] ?? "")]
      : undefined;

  const getTokenStrategyDisplay = () => {
    if (selectedTokenStrategy?.type === "LOWEST_SEEDS") {
      return "Token with Least Seeds";
    } else if (selectedTokenStrategy?.type === "LOWEST_PRICE") {
      return "Token with Best Price";
    } else if (selectedTokenStrategy?.type === "SPECIFIC_TOKEN") {
      return selectedToken?.symbol || "Select Token";
    }
    return "Select Deposited Silo Token";
  };

  // Format numbers
  const formattedTotalAmount = formatter.twoDec(parseFloat(totalAmount || "0"));

  const formattedPods = formatter.twoDec(calculatedPods);

  return (
    <Col className="gap-4">
      {/* Title */}
      <div className="pinto-body font-medium text-pinto-secondary">🚜 Order Summary</div>

      {/* Summary Items */}
      <Col className="gap-1">
        {/* Sow using */}
        <SummaryRow
          label="Sow using"
          tooltipText="Select which deposited Silo token to use for funding your Sow order. You can choose a specific token or let the system automatically select based on criteria like lowest seeds or best price."
        >
          <div className="flex items-center gap-2">
            {selectedToken && <IconImage src={selectedToken.logoURI} alt="token" size={6} className="rounded-full" />}
            <span className="pinto-body text-pinto-primary">{getTokenStrategyDisplay()}</span>
          </div>
        </SummaryRow>

        {/* Total Amount */}
        <SummaryRow
          label="Total Pintos to Sow"
          tooltipText="The maximum amount of Pintos you want to sow across all executions"
        >
          <div className="flex items-center gap-2">
            <span className="pinto-body text-pinto-primary">{formattedTotalAmount}</span>
            <IconImage src={mainToken.logoURI} alt="PINTO" size={6} className="rounded-full" />
            <span className="pinto-body text-pinto-primary">{mainToken.symbol}</span>
          </div>
        </SummaryRow>

        {/* Temperature Threshold */}
        <SummaryRow
          label="Minimum Temperature"
          tooltipText="The minimum temperature threshold required for the order to execute"
        >
          <span className="pinto-body text-pinto-primary">{temperature}%</span>
        </SummaryRow>
      </Col>

      {/* Advanced Settings Box */}
      <Col className="gap-2 bg-white rounded-lg border border-pinto-gray-2 p-4">
        <Row className="justify-between items-center cursor-pointer" onClick={() => setShowAdvanced(!showAdvanced)}>
          <span className="pinto-body-light text-pinto-secondary">Advanced</span>
          <ChevronDownIcon
            className={cn(
              "w-5 h-5 text-pinto-secondary transition-transform duration-200",
              showAdvanced && "rotate-180",
            )}
          />
        </Row>

        {showAdvanced && (
          <Col className="mt-2">
            <SowOrderV0Fields.MorningAuction />
          </Col>
        )}
      </Col>

      {/* Operator Tip Section */}
      <SowOrderV0Fields.ExecutionsAndTip />
    </Col>
  );
};

// Helper component for summary rows
const SummaryRow = ({
  label,
  children,
  tooltipText,
}: {
  label: string;
  children: React.ReactNode;
  tooltipText?: string;
}) => {
  return (
    <Row className="gap-2 w-full justify-between">
      <Row className="gap-1 items-center">
        <div className="pinto-body-light text-pinto-secondary">{label}</div>
        {tooltipText && <TooltipSimple content={tooltipText} variant="outlined" />}
      </Row>
      <div className="flex items-center">{children}</div>
    </Row>
  );
};

export default SowOrderV0Fields;
