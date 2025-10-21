import PDVIcon from "@/assets/protocol/PDV.png";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/Form";
import { Input } from "@/components/ui/Input";
import { MultiSlider } from "@/components/ui/Slider";
import { Switch } from "@/components/ui/Switch";
import { useCallback, useMemo } from "react";
import { ConvertUpV0FormSchema } from "../schema/convertUp.schema";

import { TV } from "@/classes/TokenValue";
import { Col, Row } from "@/components/Container";
import { TooltipLabel } from "@/components/ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { SEEDS, STALK } from "@/constants/internalTokens";
import { useSharedNumericFormFieldHandlers as useFieldHandlers } from "@/hooks/form/useSharedNumericFormFieldHandlers";
import { LOW_STALK_DEPOSIT_MODES_TO_LABELS, LowStalkDepositsMode, tractorTokenStrategyUtil } from "@/lib/Tractor";
import useConvertStalkPerBdvBonusAndMaximumCapacity from "@/state/useConvertStalkPerBdvBonusData";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { useSiloData } from "@/state/useSiloData";
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
  minBeansConvertPerExecution: "The minimum PDV per execution of the Convert Up order.",
  maxBeansConvertPerExecution: "The maximum PDV per execution of the Convert Up order.",
  capAmountToBonusCapacity:
    "Cap the conversion amount to the available bonus capacity. When enabled, conversions will be limited to the current bonus capacity regardless of your max PDV per execution setting.",
  minTimeBetweenConverts: "The minimum time between fills of your Convert Up order.",
  minConvertBonusCapacity: "The minimum Convert Bonus Capacity per PDV of the Convert Up order.",
  maxGrownStalkPerBdv:
    "The upper limit of Mown Stalk per PDV of Deposits eligible to be Converted by this Convert Up order. Deposits that exceed this limit will not be Converted.",
  grownStalkPerBdvBonusBid: "The minimum Stalk Bonus at which this order can be executed.",
  maxPriceToConvertUp: "The maximum price at which this order can be executed.",
  minPriceToConvertUp: "The minimum price at which this order can be executed.",
  maxGrownStalkPerBdvPenalty: "The maximum Stalk per PDV penalty of the Convert Up Order.",
  slippageRatio:
    "the maximum slippage allowed between when the transaction including the Convert Up and the price at which the Convert up occurs.",
  lowStalkDeposits: "This setting determines whether Deposits with low Stalk are used first, last or not at all. ",
  operatorTip: "The operator tip of the Convert Up Order.",
  priceRange:
    "The price range to execute the Convert Up Order. The order will be executed when the price is between the minimum and maximum price.",
  seedDifference:
    "The minimum Seed difference required between the tokens being Converted into Pinto and Pinto at the time of execution.",
} as const;

export default function ConvertUpOrderV0Fields({ children }: { children: React.ReactNode }) {
  return children;
}

const PDVIconAdornment = () => {
  return (
    <div className="flex items-center gap-2 pr-4 pl-2 bg-white">
      <img src={PDVIcon} alt="PDV" className="w-5 h-4 mb-0.5" />
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
      // Truncate to max 6 decimals
      const truncatedValue = Math.floor(value[0] * 1000000) / 1000000;
      // use the blur handler to set the value with commas
      handlers.onBlur({ target: { value: truncatedValue.toString() } });
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
      <TooltipLabel tooltipText={TOOLTIP_COPY.totalConvertBdv}>I want to Convert up to</TooltipLabel>
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
        endIcon={<PDVIconAdornment />}
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
        endIcon={<PDVIconAdornment />}
      />
    </Col>
  );
};

ConvertUpOrderV0Fields.CapAmountToBonusCapacity = function CapAmountToBonusCapacity() {
  const ctx = useFormContext<ConvertUpV0FormSchema>();

  return (
    <FormField
      control={ctx.control}
      name="capAmountToBonusCapacity"
      render={({ field }) => (
        <FormItem className="flex flex-row w-full items-center justify-between gap-2 space-y-0">
          <FormLabel tooltipText={TOOLTIP_COPY.capAmountToBonusCapacity}>
            Cap Amount per Execution to Bonus Capacity
          </FormLabel>
          <FormControl>
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
        </FormItem>
      )}
    />
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
          <FormLabel tooltipText={TOOLTIP_COPY.minTimeBetweenConverts}>Min Time Between Executions</FormLabel>
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
              endIcon={<PDVIconAdornment />}
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

const GrownStalkPerBdvBonusBidSlider = ({
  disabled,
  ctx,
  maxGrownStalk,
  handlers,
}: {
  disabled?: boolean;
  ctx: ReturnType<typeof useFormContext<ConvertUpV0FormSchema>>;
  maxGrownStalk?: number;
  handlers: ReturnType<typeof useFieldHandlers>;
}) => {
  const [grownStalkPerBdvBonusBid] = useWatch({ control: ctx.control, name: ["grownStalkPerBdvBonusBid"] });
  const sliderValue = useMemo(() => [Number(grownStalkPerBdvBonusBid.replace(/,/g, ""))], [grownStalkPerBdvBonusBid]);

  const handleOnChange = useCallback(
    (value: number[]) => {
      // Truncate to max 6 decimals
      const truncatedValue = (Math.floor(value[0] * 1000000) / 1000000).toFixed(2);
      // use the blur handler to set the value with commas
      handlers.onBlur({ target: { value: truncatedValue } });
    },
    [handlers],
  );

  return (
    <MultiSlider
      min={0}
      max={maxGrownStalk ?? 1}
      disabled={disabled}
      step={0.01}
      value={sliderValue}
      onValueChange={handleOnChange}
    />
  );
};

ConvertUpOrderV0Fields.GrownStalkPerBdvBonusBid = function GrownStalkPerBdvBonusBid() {
  const ctx = useFormContext<ConvertUpV0FormSchema>();
  const handlers = useFieldHandlers(ctx, "grownStalkPerBdvBonusBid", STALK.decimals);
  const { address: accountAddress } = useAccount();

  // Fetch data for max calculation
  const { data: bonusData } = useConvertStalkPerBdvBonusAndMaximumCapacity();
  const { averageGrownStalkPerBdvPerSeason, isLoading } = useSiloData();

  // Calculate max value using the formula: current bonus + 1000 * seeds per PDV per season
  const maxGrownStalk = useMemo(() => {
    if (!bonusData?.bonus || !averageGrownStalkPerBdvPerSeason) {
      return undefined;
    }

    // Formula: current bonus + (1000 * average grown stalk per season)
    const currentBonus = bonusData.bonus.toNumber();
    const seedsPerBdvPerSeason = averageGrownStalkPerBdvPerSeason.toNumber();
    return Number((currentBonus + 1000 * seedsPerBdvPerSeason).toFixed(6));
  }, [bonusData?.bonus, averageGrownStalkPerBdvPerSeason]);

  const showSlider = maxGrownStalk && maxGrownStalk > 0 && accountAddress;

  return (
    <Col className={cn("flex-1", showSlider ? "gap-0" : "gap-2")}>
      <TooltipLabel tooltipText={TOOLTIP_COPY.grownStalkPerBdvBonusBid}>Min Stalk Bonus Per PDV</TooltipLabel>
      <Row className="flex-1 gap-4 w-full">
        {showSlider ? (
          <GrownStalkPerBdvBonusBidSlider
            maxGrownStalk={maxGrownStalk}
            disabled={isLoading}
            ctx={ctx}
            handlers={handlers}
          />
        ) : null}
        <FormField
          control={ctx.control}
          name="grownStalkPerBdvBonusBid"
          render={({ field, fieldState }) => (
            <FormControl>
              <Input
                {...field}
                {...sharedInputProps}
                {...handlers}
                placeholder="0.00"
                disabled={isLoading}
                isError={!!fieldState.error}
                containerClassName="w-full"
                className={cn(showSlider ? "min-w-[30rem]" : "")}
                endIcon={<TextAdornment text="Grown Stalk / PDV" className="bg-white" />}
              />
            </FormControl>
          )}
        />
      </Row>
    </Col>
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
        <TooltipLabel tooltipText={TOOLTIP_COPY.priceRange}>Execute when price is between</TooltipLabel>
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
          <FormLabel tooltipText={TOOLTIP_COPY.maxGrownStalkPerBdvPenalty}>
            Max Grown Stalk per PDV Penalty Percent
          </FormLabel>
          <FormControl>
            <Input
              {...field}
              {...sharedInputProps}
              {...handlers}
              placeholder="0"
              isError={!!fieldState.error}
              endIcon={<TextAdornment text="%" />}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};

ConvertUpOrderV0Fields.SeedDifference = function SeedDifference() {
  const ctx = useFormContext<ConvertUpV0FormSchema>();
  const handlers = useFieldHandlers(ctx, "seedDifference", SEEDS.decimals, true);

  const [shouldSeedCheck] = useWatch({ control: ctx.control, name: ["seedDifferenceCheck"] });

  return (
    <>
      <FormField
        control={ctx.control}
        name="seedDifferenceCheck"
        render={({ field }) => (
          <FormItem>
            <Row className="gap-2 w-full justify-between">
              <FormLabel tooltipText={TOOLTIP_COPY.seedDifference}>
                Check for Seed difference before Converting
              </FormLabel>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </Row>
          </FormItem>
        )}
      />
      {shouldSeedCheck ? (
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
      ) : null}
    </>
  );
};

// ConvertUpOrderV0Fields.SeedDifference = function SeedDifference() {
//   const ctx = useFormContext<ConvertUpV0FormSchema>();
//   const handlers = useFieldHandlers(ctx, "seedDifference", SEEDS.decimals, true);

//   return (
//     <FormField
//       control={ctx.control}
//       name="seedDifference"
//       render={({ field, fieldState }) => (
//         <FormItem>
//           <FormLabel tooltipText={TOOLTIP_COPY.seedDifference}>Min Seed Difference</FormLabel>
//           <FormControl>
//             <Input {...field} {...sharedInputProps} {...handlers} placeholder="0.00" isError={!!fieldState.error} />
//           </FormControl>
//         </FormItem>
//       )}
//     />
//   );
// };

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

const LowStalkDepositModes = Object.entries(LOW_STALK_DEPOSIT_MODES_TO_LABELS).map(([key, value]) => {
  return {
    label: value,
    value: Number(key) as LowStalkDepositsMode,
  };
});

ConvertUpOrderV0Fields.LowStalkDepositsSelect = function LowStalkDeposits({ className }: { className?: string }) {
  const ctx = useFormContext<ConvertUpV0FormSchema>();

  return (
    <Row className="gap-2 w-full justify-between">
      <FormLabel tooltipText={TOOLTIP_COPY.lowStalkDeposits} htmlFor="lowStalkDeposits">
        Low Stalk Deposit Utilization Priority
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
