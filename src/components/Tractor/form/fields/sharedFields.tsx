import arrowDown from "@/assets/misc/ChevronDown.svg";
import { Row } from "@/components/Container";
import { FormField, FormItem } from "@/components/Form";
import TooltipSimple from "@/components/TooltipSimple";
import { Button } from "@/components/ui/Button";
import IconImage from "@/components/ui/IconImage";
import { Label } from "@/components/ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { useTokenMap } from "@/hooks/pinto/useTokenMap";
import { TractorTokenStrategy, extractAddressesFromTokenStrategy } from "@/lib/Tractor";
import { getTokenIndex } from "@/utils/token";
import { cn } from "@/utils/utils";
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
