import arrowDown from "@/assets/misc/ChevronDown.svg";
import podIcon from "@/assets/protocol/Pod.png";
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
import { Label, TooltipLabel } from "@/components/ui/Label";
import { Switch } from "@/components/ui/Switch";
import { tractorTokenStrategyUtil as StrategyUtil } from "@/lib/Tractor";
import { TractorTokenStrategy } from "@/lib/Tractor/types";
import { cn } from "@/utils/utils";
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import { useFormContext, useWatch } from "react-hook-form";

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
          <FormLabel>I want to Sow up to</FormLabel>
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
              className="w-[200px]"
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

  const tooltipContent = (
    <div className="p-1 max-w-[280px]">
      Select which deposited Silo token to use for funding your Sow order. You can choose a specific token or let the
      system automatically select based on criteria like lowest seeds or best price.
    </div>
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <TooltipLabel tooltipText={tooltipContent}>Sow using</TooltipLabel>
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
          <FormLabel>Execute when Temperature is at least</FormLabel>
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
              className="w-[140px]"
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
    const amount = parseFloat(formValues[0] || "0");
    const temp = parseFloat(formValues[1] || "0");

    if (amount === 0) return 0;

    return amount * (1 + temp / 100);
  }, [formValues]);

  // Format the pod amount with commas
  const formattedPods = formatter.number(calculatedPods, {
    minDecimals: 2,
    maxDecimals: 2,
  });

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

type TipLevel = "low" | "medium" | "high";

const TIP_LEVELS: Record<TipLevel, number> = {
  low: 0.15,
  medium: 0.2,
  high: 0.25,
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
  const operatorTip = useWatch({
    control: ctx.control,
    name: "operatorTip",
  }) as string;

  const estimatedTotalTip = "TBD";

  return (
    <Col className={cn("gap-2", className)}>
      <Row className="justify-between pinto-sm-light items-center">
        <div className="text-pinto-light">Tip per execution</div>
        <div className="flex items-center gap-2">
          <div className="flex items-center text-pinto-primary">
            {operatorTip || "0.00"}
            <IconImage src={mainToken.logoURI} alt="PINTO" size={5} className="rounded-full mx-1" />
            {mainToken.symbol}
          </div>
          <select
            value={selectedTipLevel}
            onChange={(e) => handleTipLevelChange(e.target.value as TipLevel)}
            className="pinto-sm text-pinto-primary bg-white border border-pinto-gray-2 rounded-lg px-2 py-1 cursor-pointer hover:border-pinto-gray-3"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
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
    const amount = parseFloat(totalAmount || "0");
    const temp = parseFloat(temperature || "0");

    if (amount === 0) return 0;

    return amount * (1 + temp / 100);
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
  const formattedTotalAmount = formatter.number(parseFloat(totalAmount || "0"), {
    minDecimals: 2,
    maxDecimals: 2,
  });

  const formattedPods = formatter.number(calculatedPods, {
    minDecimals: 2,
    maxDecimals: 2,
  });

  return (
    <Col className="gap-4">
      {/* Title */}
      <div className="pinto-body font-medium text-pinto-secondary">🚜 Order Summary</div>

      {/* Summary Items */}
      <Col className="gap-1">
        {/* Sow using */}
        <SummaryRow label="Sow using">
          <div className="flex items-center gap-2">
            {selectedToken && <IconImage src={selectedToken.logoURI} alt="token" size={6} className="rounded-full" />}
            <span className="pinto-body text-pinto-primary">{getTokenStrategyDisplay()}</span>
          </div>
        </SummaryRow>

        {/* Total Amount */}
        <SummaryRow label="Total Amount">
          <div className="flex items-center gap-2">
            <span className="pinto-body text-pinto-primary">{formattedTotalAmount}</span>
            <IconImage src={mainToken.logoURI} alt="PINTO" size={6} className="rounded-full" />
            <span className="pinto-body text-pinto-primary">{mainToken.symbol}</span>
          </div>
        </SummaryRow>

        {/* Temperature Threshold */}
        <SummaryRow label="Temperature Threshold">
          <span className="pinto-body text-pinto-primary">{temperature}%</span>
        </SummaryRow>

        {/* Expected Pods */}
        <SummaryRow label="Expected Pods">
          <div className="flex items-center gap-2">
            <span className="pinto-body text-pinto-primary">{formattedPods}</span>
            <IconImage src={podIcon} alt="Pod" size={6} className="rounded-full" />
          </div>
        </SummaryRow>
      </Col>

      {/* Advanced Settings Box */}
      <div className="flex flex-col gap-2 bg-white rounded-lg border border-pinto-gray-2 p-4">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center justify-between"
        >
          <span className="pinto-body-light text-pinto-secondary">Advanced</span>
          {showAdvanced ? (
            <ChevronUpIcon className="w-5 h-5 text-pinto-secondary" />
          ) : (
            <ChevronDownIcon className="w-5 h-5 text-pinto-secondary" />
          )}
        </button>

        {showAdvanced && (
          <div className="mt-2">
            <SowOrderV0Fields.MorningAuction />
          </div>
        )}
      </div>

      {/* Operator Tip Section */}
      <SowOrderV0Fields.ExecutionsAndTip />
    </Col>
  );
};

// Helper component for summary rows
const SummaryRow = ({ label, children }: { label: string; children: React.ReactNode }) => {
  return (
    <div className="flex items-center justify-between py-1">
      <div className="pinto-body-light text-pinto-secondary">{label}</div>
      <div className="flex items-center">{children}</div>
    </div>
  );
};

export default SowOrderV0Fields;
