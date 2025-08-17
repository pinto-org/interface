import arrowDown from "@/assets/misc/ChevronDown.svg";
import { Col, Row } from "@/components/Container";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/Form";
import TooltipSimple from "@/components/TooltipSimple";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import IconImage from "@/components/ui/IconImage";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Separator } from "@/components/ui/Separator";
import { useSharedNumericFormFieldHandlers } from "@/hooks/form/useSharedNumericFormFieldHandlers";
import { useTokenMap } from "@/hooks/pinto/useTokenMap";
import { TractorTokenStrategy, extractAddressesFromTokenStrategy } from "@/lib/Tractor";
import { useMainToken } from "@/state/useTokenData";
import { formatter } from "@/utils/format";
import { getTokenIndex } from "@/utils/token";
import { cn } from "@/utils/utils";
import {
  ChevronDownIcon,
  CircleIcon,
  Cross1Icon,
  DiscIcon,
  GearIcon,
  Pencil1Icon,
  TargetIcon,
} from "@radix-ui/react-icons";
import { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { ClassNameValue } from "tailwind-merge";

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

  const addresses = extractAddressesFromTokenStrategy(strategy);

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

export const TimeScaleSelectFormField = ({ className }: { className?: ClassNameValue }) => {
  const ctx = useFormContext<{ timeScale: TimeScaleSelect }>();

  return (
    <FormField
      control={ctx.control}
      name="timeScale"
      render={({ field }) => (
        <FormItem>
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger
              className={cn(
                "cursor-pointer rounded-[0.75rem] w-fit h-12 bg-white",
                "px-3 py-1 text-[1.25rem] text-black",
                "border border-pinto-gray-2 shadow-none",
                "ring-0 focus:ring-0 focus-visible:ring-0",
                "focus:ring-offset-0 focus-visible:ring-offset-0",
                "outline-none focus:outline-none focus-visible:outline-none",
                className,
              )}
            >
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

export const CustomOperatorTipFormField = ({ averageTipPaid }: { averageTipPaid: number }) => {
  const ctx = useFormContext<{ customOperatorTip: number }>();
  const mainToken = useMainToken();

  const handlers = useSharedNumericFormFieldHandlers(ctx, "customOperatorTip", mainToken.decimals);

  return (
    <FormField
      control={ctx.control}
      name="customOperatorTip"
      render={({ field, formState }) => (
        <FormItem>
          <FormLabel tooltipText="The amount of Pinto you're willing to pay per execution">
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
                    <span className="hidden sm:block text-black pinto-sm-light">{mainToken.symbol}</span>
                  </div>
                }
                isError={!!formState.errors.customOperatorTip}
              />
            </FormControl>
          </FormLabel>
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

export const OperatorTipPresets: TractorOperatorTipPreset[] = [
  {
    type: "Custom",
    endIcon: <Pencil1Icon className="w-6 h-6" />,
    icon: <GearIcon className="w-6 h-6" />,
  },
  {
    type: "Low",
    icon: <CircleIcon className="w-6 h-6" />,
    multiplier: 0.75,
  },
  {
    type: "Normal",
    icon: <DiscIcon className="w-6 h-6" />,
    multiplier: 1,
  },
  {
    type: "High",
    icon: <TargetIcon className="w-6 h-6" />,
    multiplier: 1.25,
  },
] as const;

export interface OperatorTipFormFieldProps {
  averageTipPaid: number;
  preset: (typeof OperatorTipPresets)[number]["type"];
  setPreset: (preset: (typeof OperatorTipPresets)[number]["type"]) => void;
}

export const OperatorTipFormField = ({ averageTipPaid, preset, setPreset }: OperatorTipFormFieldProps) => {
  const ctx = useFormContext<{ operatorTip: number }>();

  return (
    <Row className="w-full justify-between">
      <Row className="pinto-sm-light text-pinto-secondary gap-1">
        Tip Per Execution
        <TooltipSimple content="The tip per execution of the Convert Up Order." variant="outlined" />
      </Row>
      <OperatorTipPresetDropdown
        averageTipPaid={averageTipPaid}
        selectedPreset={preset}
        setSelectedPreset={setPreset}
      />
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
  const ctx = useFormContext<{ operatorTip: number; customOperatorTip?: number }>();
  const value = useWatch({ control: ctx.control, name: "operatorTip" });
  const customAmount = useWatch({ control: ctx.control, name: "customOperatorTip" });
  const mainToken = useMainToken();

  const [isOpen, setIsOpen] = useState(false);

  const handleOptionClick = (preset: TractorOperatorTipStrategy) => {
    setIsOpen(false);
    setSelectedPreset(preset);
  };

  return (
    <div className="relative z-10">
      {/* Custom Dropdown Button */}
      <Row className="space-x-2">
        <Row className="gap-1">
          <IconImage src={mainToken.logoURI} size={4} />
          <span className="pinto-sm">
            {value} {mainToken.symbol}
          </span>
        </Row>
        <Button
          variant="outline"
          className="rounded-full px-2 py-2 sm:px-2 sm:py-2 flex items-center space-x-2 pinto-sm sm:pinto-sm h-fit border-pinto-gray-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>{selectedPreset}</span>
          <ChevronDownIcon className={cn("w-4 h-4", isOpen && "rotate-180 transition-transform duration-200")} />
        </Button>
      </Row>

      {/* Operator Tip Card - Only visible when open */}
      {isOpen && (
        <Card className="absolute bottom-full left-1/2 transform -translate-x-1/4 shadow-sm z-20 w-[12rem]">
          <CardContent className="p-0">
            <div className="p-3">
              <Row className="gap-1 justify-between">
                <h3 className="text-xl font-semibold">Operator Tip</h3>
                <Cross1Icon className="w-4 h-4 cursor-pointer" onClick={() => setIsOpen(false)} />
              </Row>
            </div>
            <Separator className="h-[0.5px] bg-pinto-gray-2" />
            <Col className="p-1 gap-1">
              {OperatorTipPresets.map((preset) => {
                const amount = preset.multiplier ? preset.multiplier * averageTipPaid : averageTipPaid;

                return (
                  <OperatorTipPreset
                    key={preset.type}
                    preset={preset}
                    selected={selectedPreset === preset.type}
                    amount={formatter.number(amount)}
                    onClick={() => handleOptionClick(preset.type)}
                  />
                );
              })}
            </Col>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const OperatorTipPreset = ({
  preset,
  amount,
  selected,
  onClick,
}: {
  preset: (typeof OperatorTipPresets)[number];
  amount: string;
  selected: boolean;
  onClick: (preset: (typeof OperatorTipPresets)[number]) => void;
}) => {
  const mainToken = useMainToken();

  return (
    <Row
      className={cn(
        "gap-1 hover:bg-pinto-green-1/50 rounded-lg p-2 cursor-pointer w-full",
        selected && "bg-pinto-green-1/50",
      )}
      onClick={() => onClick(preset)}
    >
      {preset.icon}
      <Row className="flex-1 justify-between w-full">
        <Col className="gap-1">
          <span className="pinto-sm">{preset.type}</span>
          <span className="pinto-sm-light text-pinto-gray-4 whitespace-nowrap">
            {amount} {mainToken.symbol}
          </span>
        </Col>
        {preset.endIcon ? preset.endIcon : <></>}
      </Row>
    </Row>
  );
};
