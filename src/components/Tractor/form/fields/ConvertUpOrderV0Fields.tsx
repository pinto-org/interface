import PDVIcon from "@/assets/protocol/PDV.png";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/Form";
import IconImage from "@/components/ui/IconImage";
import { Input } from "@/components/ui/Input";
import { MultiSlider } from "@/components/ui/Slider";
import { MAIN_TOKEN } from "@/constants/tokens";
import { useChainConstant } from "@/utils/chain";
import { useCallback, useMemo } from "react";
import { ConvertUpV0FormSchema } from "../schema/convertUp.schema";

import { TV } from "@/classes/TokenValue";
import { Col, Row } from "@/components/Container";
import { TooltipLabel } from "@/components/ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { SEEDS, STALK } from "@/constants/internalTokens";
import { useSharedNumericFormFieldHandlers as useFieldHandlers } from "@/hooks/form/useSharedNumericFormFieldHandlers";
import { LowStalkDepositsMode, tractorTokenStrategyUtil } from "@/lib/Tractor";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { useMainToken } from "@/state/useTokenData";
import { getTokenIndex } from "@/utils/token";
import { cn } from "@/utils/utils";
import { RegisterOptions, useFormContext, useWatch } from "react-hook-form";
import { useAccount } from "wagmi";

type StringInputFields = Pick<
  ConvertUpV0FormSchema,
  | "totalBeanAmountToConvert"
  | "minBeansConvertPerExecution"
  | "maxBeansConvertPerExecution"
  | "minTimeBetweenConverts"
  | "minConvertBonusCapacity"
  | "maxGrownStalkPerBdv"
  | "grownStalkPerBdvBonusBid"
  | "maxPriceToConvertUp"
  | "minPriceToConvertUp"
  | "maxGrownStalkPerBdvPenalty"
  | "seedDifference"
  | "slippageRatio"
>;

// Shared utility hook for form field props
const useFormFieldProps = (name: keyof StringInputFields, decimals: number) => {
  const ctx = useFormContext<StringInputFields>();
  const handlers = useFieldHandlers(ctx, name, decimals);
  const isError = !!ctx.formState.errors?.[name];

  const handleRegister = useCallback(
    (options?: RegisterOptions<StringInputFields, keyof StringInputFields>) => {
      return ctx.register(name, { ...handlers, ...options });
    },
    [ctx.register, handlers, name],
  );

  return {
    ctx,
    handlers,
    isError,
    register: handleRegister,
  };
};

const sharedInputProps = {
  type: "text",
  inputMode: "decimal",
  pattern: "[0-9]*.?[0-9]*",
  outlined: true,
} as const;

const TOOLTIP_COPY = {
  tokenStrategy: "The source token(s) use for the Convert Up Order.",
  totalConvertBdv: "The total PDV of the Convert Up Order.",
  minBeansConvertPerExecution: "The minimum PDV per execution of the Convert Up Order.",
  maxBeansConvertPerExecution: "The maximum PDV per execution of the Convert Up Order.",
  minTimeBetweenConverts: "The minimum time between converts of the Convert Up Order.",
  minConvertBonusCapacity: "The minimum convert bonus capacity of the Convert Up Order.",
  maxGrownStalkPerBdv: "The maximum grown stalk per PDV of the Convert Up Order.",
  grownStalkPerBdvBonusBid: "The minimum Grown Stalk Bonus in which this order can be executed.",
  maxPriceToConvertUp: "The maximum price to convert up to.",
  minPriceToConvertUp: "The minimum price to convert up to.",
  maxGrownStalkPerBdvPenalty: "The maximum grown stalk per PDV penalty of the Convert Up Order.",
  slippageRatio: "The slippage ratio of the Convert Up Order.",
  lowStalkDeposits: "The condition or eligibility in which Silo deposits with low Grown Stalk are used.",
  operatorTip: "The operator tip of the Convert Up Order.",
  priceRange:
    "The price range to execute the Convert Up Order. The order will be executed when the price is between the minimum and maximum price.",
  seedDifference:
    "The minimum seed difference required between your selected tokens and PINTO at the time of execution.",
} as const;

export default function ConvertUpOrderV0Fields({ children }: { children: React.ReactNode }) {
  return children;
}

const PDVIconAdornment = () => {
  return (
    <div className="flex items-center gap-2 pr-4 pl-2 bg-white">
      <img src={PDVIcon} alt="PDV" className="w-5 h-4" />
      <span className="hidden sm:block text-black pinto-sm-light">PDV</span>
    </div>
  );
};

const TextAdornment = ({ text, isEnd = true, className }: { text: string; isEnd?: boolean; className?: string }) => {
  return <div className={cn("text-black pinto-sm-light", isEnd ? "mr-2" : "ml-2", className)}>{text}</div>;
};

const TotalConvertBdvSlider = ({
  disabled,
  ctx,
  maxPDV,
  handlers,
}: {
  disabled?: boolean;
  ctx: ReturnType<typeof useFormContext<ConvertUpV0FormSchema>>;
  maxPDV?: TV;
  handlers: ReturnType<typeof useFieldHandlers>;
}) => {
  const [totalBeanAmountToConvert] = useWatch({ control: ctx.control, name: ["totalBeanAmountToConvert"] });
  const sliderValue = useMemo(() => [Number(totalBeanAmountToConvert.replace(/,/g, ""))], [totalBeanAmountToConvert]);

  const handleOnChange = useCallback(
    (value: number[]) => {
      // use the blur handler to set the value with commas
      handlers.onBlur({ target: { value: value[0].toString() } });
    },
    [handlers],
  );

  return (
    <MultiSlider
      min={0}
      max={maxPDV?.toNumber() ?? 1000}
      disabled={disabled}
      step={0.1}
      value={sliderValue}
      onValueChange={handleOnChange}
    />
  );
};

ConvertUpOrderV0Fields.TotalConvertBdv = function TotalConvertBdv({
  farmerDeposits,
}: {
  farmerDeposits: ReturnType<typeof useFarmerSilo>["deposits"];
}) {
  const { address: accountAddress } = useAccount();
  const { decimals } = useMainToken();
  const ctx = useFormContext<ConvertUpV0FormSchema>();
  const { register, isError, handlers } = useFormFieldProps("totalBeanAmountToConvert", decimals);
  const [tokenStrategy] = useWatch({ control: ctx.control, name: ["tokenStrategy"] });

  const totalBdvsMap = useMemo(() => {
    const bdvsByStrategy: Record<string, TV> = {
      LOWEST_PRICE: TV.ZERO,
      LOWEST_SEEDS: TV.ZERO,
    };

    let totalConvertibleBdv = TV.ZERO;

    farmerDeposits.forEach((deposit, token) => {
      if (!token.isLP) {
        return;
      }
      const convertibleBdv = deposit.convertibleDeposits.reduce((acc, deposit) => acc.add(deposit.depositBdv), TV.ZERO);
      totalConvertibleBdv = totalConvertibleBdv.add(convertibleBdv);
      bdvsByStrategy[getTokenIndex(token)] = convertibleBdv;
    });

    bdvsByStrategy.LOWEST_PRICE = totalConvertibleBdv;
    bdvsByStrategy.LOWEST_SEEDS = totalConvertibleBdv;

    return bdvsByStrategy;
  }, [farmerDeposits, tokenStrategy]);

  const maxPDV = useMemo(() => {
    const summary = tractorTokenStrategyUtil.getSummary(tokenStrategy);
    if (summary.type in totalBdvsMap) {
      return totalBdvsMap[summary.type];
    }

    return summary.addresses?.reduce((acc, curr) => {
      return acc.add(totalBdvsMap[getTokenIndex(curr)] ?? TV.ZERO);
    }, TV.ZERO);
  }, [totalBdvsMap, tokenStrategy]);

  const showSlider = maxPDV?.gt(0) && accountAddress;

  return (
    <Col className={cn("flex-1", showSlider ? "gap-0" : "gap-2")}>
      <TooltipLabel tooltipText={TOOLTIP_COPY.totalConvertBdv}>I want to convert up to</TooltipLabel>
      <Row className="flex-1 gap-4 w-full">
        {showSlider ? (
          <TotalConvertBdvSlider maxPDV={maxPDV} disabled={!tokenStrategy} ctx={ctx} handlers={handlers} />
        ) : null}
        <Input
          {...register()}
          {...sharedInputProps}
          placeholder="0.00"
          isError={isError}
          containerClassName="w-full"
          className={cn(showSlider ? "min-w-[25rem]" : "")}
          endIcon={<PDVIconAdornment />}
        />
      </Row>
    </Col>
  );
};

ConvertUpOrderV0Fields.MinConvertBdvPerExecution = function MinConvertBdvPerExecution() {
  const { decimals } = useMainToken();
  const { register, isError } = useFormFieldProps("minBeansConvertPerExecution", decimals);

  return (
    <Col className="flex-1 gap-2">
      <TooltipLabel tooltipText={TOOLTIP_COPY.minBeansConvertPerExecution}>Min PDV per Execution</TooltipLabel>
      <Input
        {...register()}
        {...sharedInputProps}
        placeholder="0.00"
        isError={isError}
        endIcon={<TextAdornment text="PDV" />}
      />
    </Col>
  );
};

ConvertUpOrderV0Fields.MaxConvertBdvPerExecution = function MaxConvertBdvPerExecution() {
  const { decimals } = useMainToken();
  const { register, isError } = useFormFieldProps("maxBeansConvertPerExecution", decimals);

  return (
    <Col className="flex-1 gap-2">
      <TooltipLabel tooltipText={TOOLTIP_COPY.maxBeansConvertPerExecution}>Max PDV per Execution</TooltipLabel>
      <Input
        {...register()}
        {...sharedInputProps}
        placeholder="0.00"
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
              <Input {...field} {...sharedInputProps} {...handlers} placeholder="3600" isError={!!fieldState.error} />
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
              {...handlers}
              placeholder="0.00"
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
              {...handlers}
              placeholder="0.00"
              isError={!!fieldState.error}
              endIcon={<TextAdornment text="Grown Stalk / PDV" />}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};

ConvertUpOrderV0Fields.GrownStalkPerBdvBonusBid = function GrownStalkPerBdvBonusBid() {
  const ctx = useFormContext<ConvertUpV0FormSchema>();
  const handlers = useFieldHandlers(ctx, "grownStalkPerBdvBonusBid", STALK.decimals);

  return (
    <FormField
      control={ctx.control}
      name="grownStalkPerBdvBonusBid"
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel tooltipText={TOOLTIP_COPY.grownStalkPerBdvBonusBid}>Min Grown Stalk Bonus Per PDV</FormLabel>
          <FormControl>
            <Input
              {...field}
              {...sharedInputProps}
              {...handlers}
              placeholder="0.00"
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
    <>
      <Col className="gap-2 w-full">
        <TooltipLabel tooltipText={TOOLTIP_COPY.priceRange}>Execute when Price is Between</TooltipLabel>
        <MultiSlider
          min={sliderMin}
          max={sliderMax}
          step={sliderStep}
          value={sliderValues}
          onValueChange={handleSliderChange}
          className={cn("my-2 w-full", hasError && "opacity-50")}
        />
      </Col>
      <Row className="gap-4 w-full">
        <Col className="gap-2 w-full">
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
        <Col className="gap-2 w-full">
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
    </>
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
            <Input {...field} {...sharedInputProps} {...handlers} placeholder="0.00" isError={!!fieldState.error} />
          </FormControl>
        </FormItem>
      )}
    />
  );
};

ConvertUpOrderV0Fields.SeedDifference = function SeedDifference() {
  const ctx = useFormContext<ConvertUpV0FormSchema>();
  const handlers = useFieldHandlers(ctx, "seedDifference", SEEDS.decimals);

  return (
    <FormField
      control={ctx.control}
      name="seedDifference"
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel tooltipText={TOOLTIP_COPY.seedDifference}>Min Seed Difference</FormLabel>
          <FormControl>
            <Input {...field} {...sharedInputProps} {...handlers} placeholder="0.00" isError={!!fieldState.error} />
          </FormControl>
        </FormItem>
      )}
    />
  );
};

ConvertUpOrderV0Fields.SlippageRatio = function SlippageRatio() {
  const { register, isError } = useFormFieldProps("slippageRatio", 18);

  return (
    <div className="flex flex-row w-full items-center justify-between gap-2 space-y-0">
      <TooltipLabel tooltipText={TOOLTIP_COPY.slippageRatio}>Slippage Tolerance</TooltipLabel>
      <div className="flex flex-col">
        <Input
          {...register()}
          {...sharedInputProps}
          className="rounded-lg w-[140px]"
          placeholder="0.1"
          outlined
          isError={isError}
          endIcon={<div className="mr-2 text-pinto-primary pinto-body-bold">%</div>}
        />
      </div>
    </div>
  );
};

const LowStalkDepositModes = [
  {
    label: "No",
    value: LowStalkDepositsMode.OMIT,
  },
  {
    label: "Yes",
    value: LowStalkDepositsMode.USE,
  },
  {
    label: "Use Last",
    value: LowStalkDepositsMode.USE_LAST,
  },
];

ConvertUpOrderV0Fields.LowStalkDepositsSelect = function LowStalkDeposits({ className }: { className?: string }) {
  const ctx = useFormContext<ConvertUpV0FormSchema>();

  return (
    <Row className="gap-2 w-full justify-between">
      <FormLabel tooltipText={TOOLTIP_COPY.lowStalkDeposits} htmlFor="lowStalkDeposits">
        Allow Low Stalk Deposits
      </FormLabel>
      <FormField
        control={ctx.control}
        name="lowStalkDeposits"
        render={({ field }) => (
          <FormItem>
            <Select
              value={field.value.toString()}
              onValueChange={(value) => {
                field.onChange(Number(value));
              }}
            >
              <SelectTrigger variant="form" className={className}>
                <div className="mr-4">
                  <SelectValue placeholder="Select">
                    {LowStalkDepositModes.find((value) => value.value === field.value)?.label}
                  </SelectValue>
                </div>
              </SelectTrigger>
              <SelectContent>
                {LowStalkDepositModes.map((value) => {
                  return (
                    <SelectItem
                      key={`${value.label}-low-stalk-deposit-select`}
                      value={value.value.toString()}
                      className="pinto-sm focus:bg-pinto-green-1"
                    >
                      {value.label}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
    </Row>
  );
};

export { TOOLTIP_COPY as CONVERT_UP_TOOLTIP_COPY };
