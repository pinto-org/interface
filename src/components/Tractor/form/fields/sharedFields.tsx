import arrowDown from "@/assets/misc/ChevronDown.svg";
import { TV } from "@/classes/TokenValue";
import { Col, Row } from "@/components/Container";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/Form";
import TooltipSimple from "@/components/TooltipSimple";
import { Button } from "@/components/ui/Button";
import IconImage from "@/components/ui/IconImage";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Separator } from "@/components/ui/Separator";
import { useSharedNumericFormFieldHandlers } from "@/hooks/form/useSharedNumericFormFieldHandlers";
import { useTokenMap } from "@/hooks/pinto/useTokenMap";
import { tractorTokenStrategyUtil as StrategyUtil, TractorTokenStrategy } from "@/lib/Tractor";
import { useMainToken } from "@/state/useTokenData";
import { formatter } from "@/utils/format";
import { sanitizeNumericInputValue } from "@/utils/string";
import { getTokenIndex } from "@/utils/token";
import { cn, exists } from "@/utils/utils";
import {
  CheckIcon,
  ChevronDownIcon,
  CircleIcon,
  Cross1Icon,
  DiscIcon,
  GearIcon,
  Pencil1Icon,
  TargetIcon,
} from "@radix-ui/react-icons";
import React, { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";

const empty = [];

export const TokenStrategyFormField = ({
  openDialog,
  label = "Fund order using",
  selectText = "Select Tokens",
  tooltipText,
}: {
  label: string | JSX.Element;
  selectText?: string;
  tooltipText?: string;
  openDialog: () => void;
}) => {
  const ctx = useFormContext<{ tokenStrategy: TractorTokenStrategy }>();
  const tokenMap = useTokenMap();

  const strategy = useWatch({ control: ctx.control, name: "tokenStrategy" });

  const addresses = StrategyUtil.extractAddresses(strategy);

  const tokens = addresses?.map((tkAddress) => tokenMap[getTokenIndex(tkAddress)]) || empty;

  const dynamicSource = strategy.type === "LOWEST_SEEDS" || strategy.type === "LOWEST_PRICE";

  const dynamicSourceText = dynamicSource
    ? strategy.type === "LOWEST_SEEDS"
      ? "Token with Least Seeds"
      : "Token with Best Price"
    : undefined;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <Row className="gap-1 items-center">
          {typeof label === "string" ? <Label variant="form">{label}</Label> : label}
          <TooltipSimple content={tooltipText} variant="outlined" disabled={!tooltipText} />
        </Row>
        <Button
          variant="outline-gray-shadow"
          size="xl"
          rounded="full"
          onClick={openDialog}
          className="flex flex-row gap-2"
        >
          {dynamicSourceText ? (
            dynamicSourceText
          ) : tokens.length === 1 ? (
            <div className="flex items-center gap-2">
              <IconImage src={tokens?.[0]?.logoURI} alt="token" size={6} className="rounded-full" />
              <div className="pinto-body-light">{tokens?.[0]?.symbol}</div>
            </div>
          ) : tokens.length > 1 ? (
            <Row className="items-center">
              {tokens?.map((token, i) => (
                <div key={`token-strategy-select-${token.symbol}`} className={i !== 0 ? "-ml-2" : ""}>
                  <IconImage src={token.logoURI} alt="token" size={6} className="rounded-full" />
                </div>
              ))}
            </Row>
          ) : (
            selectText
          )}
          <IconImage src={arrowDown} size={3} alt="open token select dialog" />
        </Button>
      </div>
    </div>
  );
};

export const SELECT_TIME_SCALES = ["SECONDS", "MINUTES", "HOURS", "DAYS"] as const;

export type TimeScaleSelect = (typeof SELECT_TIME_SCALES)[number];

export const TimeScaleSelectFormField = ({ className }: { className?: string | undefined }) => {
  const ctx = useFormContext<{ timeScale: TimeScaleSelect }>();

  return (
    <FormField
      control={ctx.control}
      name="timeScale"
      render={({ field }) => (
        <FormItem>
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger variant="form" className={className}>
              <div className="mr-4">
                <SelectValue placeholder="Select" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {SELECT_TIME_SCALES.map((value) => {
                const label = `${value.charAt(0).toUpperCase()}${value.slice(1).toLowerCase()}`;
                return (
                  <SelectItem key={`${value}-time-scale`} value={value} className="pinto-sm focus:bg-pinto-green-1">
                    {label}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
};

const numericInputProps = {
  type: "text",
  inputMode: "decimal",
  pattern: "[0-9]*.?[0-9]*",
} as const;

export const CustomOperatorTipFormField = ({
  averageTipPaid,
  title = "Tip per Execution",
}: { averageTipPaid: number; title?: string }) => {
  const ctx = useFormContext<{ customOperatorTip: number }>();
  const mainToken = useMainToken();

  const handlers = useSharedNumericFormFieldHandlers(ctx, "customOperatorTip", mainToken.decimals);

  return (
    <FormField
      control={ctx.control}
      name="customOperatorTip"
      render={({ field, formState }) => (
        <FormItem>
          <FormLabel tooltipText="The amount of Pinto you're willing to pay per execution">{title}</FormLabel>
          <FormControl>
            <Input
              {...field}
              {...numericInputProps}
              {...handlers}
              outlined
              placeholder={averageTipPaid.toFixed(3)}
              endIcon={
                <div className="flex items-center gap-2 px-4 bg-white">
                  <IconImage src={mainToken.logoURI} alt="PINTO" size={6} className="rounded-full" />
                  <span className="hidden sm:block text-black pinto-sm-light">Pinto</span>
                </div>
              }
              isError={!!formState.errors.customOperatorTip}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export type TractorOperatorTipStrategy = "Custom" | "Low" | "Normal" | "High";

export type TractorOperatorTipPreset = {
  type: TractorOperatorTipStrategy;
  icon: React.ReactNode;
  multiplier?: number;
  endIcon?: React.ReactNode;
};

export const OperatorTipPresets: Record<TractorOperatorTipStrategy, TractorOperatorTipPreset> = {
  Custom: {
    type: "Custom",
    endIcon: <Pencil1Icon className="w-6 h-6" />,
    icon: <GearIcon className="w-6 h-6" />,
  },
  Low: {
    type: "Low",
    icon: <CircleIcon className="w-6 h-6" />,
    multiplier: 0.75,
  },
  Normal: {
    type: "Normal",
    icon: <DiscIcon className="w-6 h-6" />,
    multiplier: 1,
  },
  High: {
    type: "High",
    icon: <TargetIcon className="w-6 h-6" />,
    multiplier: 1.25,
  },
} as const;

export interface OperatorTipFormFieldProps {
  averageTipPaid: number;
  preset: keyof typeof OperatorTipPresets;
  setPreset: (preset: keyof typeof OperatorTipPresets) => void;
}

export const OperatorTipFormField = ({ averageTipPaid, preset, setPreset }: OperatorTipFormFieldProps) => {
  return (
    <Row className="w-full justify-between">
      <Row className="pinto-sm-light text-pinto-secondary gap-1">
        Tip Per Execution
        <TooltipSimple content="The tip per execution of the Convert Up order." variant="outlined" />
      </Row>
      <OperatorTipPresetDropdown
        averageTipPaid={averageTipPaid}
        selectedPreset={preset}
        setSelectedPreset={setPreset}
      />
    </Row>
  );
};

const formatOperatorTipAmount = (amount: string | TV | undefined) => {
  if (!amount) return "--";
  const str = typeof amount === "string" ? amount : amount.toHuman();
  return `${formatter.number(str, { minDecimals: 2, maxDecimals: 3 })}`;
};

export const getTractorOperatorTipAmountFromPreset = (
  preset: TractorOperatorTipStrategy,
  averageTipPaid: number,
  customAmount: string | undefined,
  mainTokenDecimals: number,
) => {
  const data = OperatorTipPresets[preset];
  if (data) {
    if (data.type !== "Custom" && exists(data.multiplier)) {
      return TV.fromHuman(averageTipPaid, mainTokenDecimals).mul(data.multiplier);
    }

    if (data.type === "Custom") {
      if (!customAmount) {
        return undefined;
      }

      return TV.fromHuman(customAmount, mainTokenDecimals);
    }
  }

  throw new Error(`Invalid preset configuration: ${preset}`);
};

const InlineTipFormField = ({
  averageTipPaid,
  onReset,
  onConfirm,
}: {
  averageTipPaid: number;
  onReset: () => void;
  onConfirm: (str: string) => void;
}) => {
  const ctx = useFormContext<{ customOperatorTip?: string }>();
  const mainToken = useMainToken();

  const [value, setValue] = useState<string>(ctx.getValues("customOperatorTip") ?? "");

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = sanitizeNumericInputValue(e.target.value, mainToken.decimals);
    setValue(cleaned.str);
  };

  const invalidValue = sanitizeNumericInputValue(value, mainToken.decimals).nonAmount;

  const handleConfirmClick = () => {
    if (invalidValue) {
      return;
    }
    onConfirm(value);
  };

  return (
    <Row className="w-full p-2 gap-2 justify-between box-border">
      <Row className="gap-2">
        <div className="shrink-0">{OperatorTipPresets.Custom.icon}</div>
        <Input
          {...numericInputProps}
          outlined
          value={value}
          onChange={handleValueChange}
          className="max-w-24 h-10"
          placeholder={averageTipPaid.toFixed(2)}
        />
      </Row>
      <Row>
        <Button variant="ghost" className="p-2 sm:p-2 h-fit" onClick={handleConfirmClick} disabled={invalidValue}>
          <CheckIcon className={cn("w-4 h-4 text-pinto-success", invalidValue && "text-pinto-gray-2")} />
        </Button>
        <Button variant="ghost" className="p-2 sm:p-2 h-fit" onClick={onReset}>
          <Cross1Icon className="w-4 h-4 text-pinto-error" />
        </Button>
      </Row>
    </Row>
  );
};

export const OperatorTipPresetDropdown = ({
  averageTipPaid,
  selectedPreset,
  setSelectedPreset,
}: {
  averageTipPaid: number;
  selectedPreset: TractorOperatorTipStrategy;
  setSelectedPreset: (preset: TractorOperatorTipStrategy) => void;
}) => {
  // Hooks
  const ctx = useFormContext<{ customOperatorTip?: string }>();
  const customAmount = useWatch({ control: ctx.control, name: "customOperatorTip" });
  const mainToken = useMainToken();

  // Local State
  const [isOpen, setIsOpen] = useState(false);
  const [customOpen, setCustomOpen] = useState(false);
  const [prevPreset, setPrevPreset] = useState<TractorOperatorTipStrategy | undefined>(undefined);

  // Derived values
  const value =
    getTractorOperatorTipAmountFromPreset(
      selectedPreset,
      averageTipPaid,
      customAmount,
      mainToken.decimals,
    )?.toHuman() ?? "";

  // Toggle on the custom tip input state
  const handleOpenCustom = () => {
    setPrevPreset(selectedPreset);
    setCustomOpen(true);
  };

  // Set the selected preset to the clicked preset
  const handleOptionClick = (preset: TractorOperatorTipStrategy) => {
    // If the selected preset is custom, and there is no custom amount, open the custom input
    // Otherwise, set the selected preset to the clicked preset and close the popover
    if (preset === "Custom" && !customAmount) {
      handleOpenCustom();
      return;
    }
    setSelectedPreset(preset);
    setIsOpen(false);
    setCustomOpen(false);
  };

  // Reset the custom tip value to the previous preset
  const handleResetCustom = () => {
    setPrevPreset(undefined);
    setSelectedPreset(prevPreset ?? "Normal");
    setCustomOpen(false);
  };

  // Set the custom tip value in the form and close the custom input
  const handleConfirmCustom = (customTipValue: string) => {
    // In case an invalid value is entered, treat it the same as a reset

    console.log({ customTipValue });
    if (!customTipValue) {
      handleResetCustom();
      return;
    }
    // re-validate the custom tip value
    const cleaned = sanitizeNumericInputValue(customTipValue, mainToken.decimals);
    // set the custom tip value in the form
    ctx.setValue("customOperatorTip", cleaned.str);
    // Set the selected preset to custom, reset the cached preset, and close the custom input
    setSelectedPreset("Custom");
    setPrevPreset(undefined);
    setCustomOpen(false);
  };

  const amountsToWithPresets = Object.values(OperatorTipPresets).map((preset) => {
    const amt =
      getTractorOperatorTipAmountFromPreset(preset.type, averageTipPaid, customAmount, mainToken.decimals)?.toHuman() ??
      "";
    return {
      preset: preset,
      amount: amt,
    };
  });

  return (
    <Popover modal open={isOpen} onOpenChange={setIsOpen}>
      <Row className="space-x-2">
        <Row className="gap-1 flex-nowrap whitespace-nowrap">
          <IconImage src={mainToken.logoURI} size={4} />
          <span className="pinto-sm">
            {formatOperatorTipAmount(value)} {mainToken.symbol}
          </span>
        </Row>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="rounded-full px-2 py-2 sm:px-2 sm:py-2 w-24 flex items-center space-x-2 pinto-sm sm:pinto-sm h-fit border-pinto-gray-2"
          >
            <span>{selectedPreset}</span>
            <ChevronDownIcon className={cn("w-4 h-4", isOpen && "rotate-180 transition-transform duration-200")} />
          </Button>
        </PopoverTrigger>
      </Row>
      <PopoverContent side="top" align="center" className="w-[14rem] p-0 mr-3">
        <div className="p-3">
          <Row className="gap-1 justify-between">
            <h3 className="text-xl font-semibold">Operator Tip</h3>
            <Cross1Icon className="w-4 h-4 cursor-pointer" onClick={() => setIsOpen(false)} />
          </Row>
        </div>
        <Separator className="h-[0.5px] bg-pinto-gray-2" />
        <Col className="p-1 gap-1">
          {/**
           * If the custom tip input is open, show the inline tip form field
           */}
          {customOpen ? (
            <>
              <InlineTipFormField
                averageTipPaid={averageTipPaid}
                onReset={handleResetCustom}
                onConfirm={handleConfirmCustom}
              />
            </>
          ) : null}
          {/**
           * Preset Options
           */}
          {amountsToWithPresets.map(({ amount, preset }) => {
            if (customOpen && preset.type === "Custom") {
              return null;
            }
            const onEndIconClick = preset.type === "Custom" ? handleOpenCustom : undefined;
            const selected = selectedPreset === preset.type;

            return (
              <OperatorTipPreset
                key={`operator-tip-preset-${preset.type}-${amount}`}
                preset={preset}
                selected={selected}
                amount={amount}
                onClick={() => handleOptionClick(preset.type)}
                onEndIconClick={onEndIconClick}
              />
            );
          })}
        </Col>
      </PopoverContent>
    </Popover>
  );
};

const OperatorTipPreset = ({
  preset,
  amount,
  selected,
  onClick,
  onEndIconClick,
}: {
  preset: TractorOperatorTipPreset;
  amount: string | undefined;
  selected: boolean;
  onClick: (preset: TractorOperatorTipPreset) => void;
  onEndIconClick?: () => void;
}) => {
  const mainToken = useMainToken();

  const handleEndIconClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();
    onEndIconClick?.();
  };

  return (
    <Row
      className={cn(
        "gap-2 hover:bg-pinto-green-1/50 rounded-lg p-2 cursor-pointer w-full",
        selected && "bg-pinto-green-1/50",
      )}
      onClick={() => onClick(preset)}
    >
      {preset.icon}
      <Row className="flex-1 justify-between w-full">
        <Col className="gap-1">
          <span className="pinto-sm">{preset.type}</span>
          <span className="pinto-sm-light text-pinto-gray-4 whitespace-nowrap">
            {formatOperatorTipAmount(amount)} {mainToken.symbol}
          </span>
        </Col>
        {preset.endIcon ? (
          <div onClick={handleEndIconClick} className="cursor-pointer hover:bg-pinto-green-1/50 rounded-lg p-2">
            {preset.endIcon}
          </div>
        ) : (
          <></>
        )}
      </Row>
    </Row>
  );
};

interface TractorFormButtonsRowProps {
  handleLeft: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleRight: ((e: React.MouseEvent<HTMLButtonElement>) => void) | ((e: React.MouseEvent<HTMLButtonElement>) => void);
  left: {
    content: React.ReactNode;
    disabled?: boolean;
  };
  right: {
    content?: React.ReactNode;
    disabled?: boolean;
    tooltip?: React.ReactNode;
  };
  isLoading?: boolean;
  hideLeft?: boolean;
}

export const TractorFormButtonsRow = ({
  handleLeft,
  handleRight,
  isLoading,
  left: { content: leftContent, disabled: leftDisabled },
  right: { content: rightContent, disabled: rightDisabled, tooltip: rightTooltip },
  hideLeft = false,
}: TractorFormButtonsRowProps) => {
  return (
    <Row className="gap-4 w-full flex-1">
      {!hideLeft && (
        <Button
          variant="outline"
          size="xlargest"
          rounded="full"
          className="w-full flex-1 text-pinto-light bg-pinto-gray-1"
          disabled={leftDisabled}
          onClick={handleLeft}
          type="button"
        >
          {leftContent}
        </Button>
      )}
      <TooltipSimple content={rightTooltip} side="top" align="center" disabled={!rightTooltip}>
        <div className="flex-1">
          <Button
            size="xlargest"
            rounded="full"
            className={`w-full ${isLoading ? "bg-pinto-gray-2 text-pinto-light" : "bg-pinto-green-4 text-white"}`}
            disabled={rightDisabled}
            onClick={handleRight}
            type="button"
          >
            {rightContent}
          </Button>
        </div>
      </TooltipSimple>
    </Row>
  );
};
