import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { useTokenMap } from "@/hooks/pinto/useTokenMap";
import { Blueprint, tractorTokenStrategyUtil as StrategyUtil, TractorTokenStrategy } from "@/lib/Tractor";
import { ConvertUpParams } from "@/lib/Tractor/convertUp";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import useTokenData from "@/state/useTokenData";
import { validateFormLte } from "@/utils/number";
import { postSanitizedSanitizedValue } from "@/utils/string";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useAccount, usePublicClient } from "wagmi";
import { z } from "zod";

import { TV } from "@/classes/TokenValue";
import { STALK } from "@/constants/internalTokens";
import FormUtils from "@/utils/form";
import { SELECT_TIME_SCALES, TimeScaleSelect } from "../fields/sharedFields";

// ---------------------------------------------
// SCHEMA
// ---------------------------------------------

const {
  schema: { tokenStrategy: tokenStrategyValidation, positiveNumber, nonNegativeNumber, addCTXErrors },
} = FormUtils;

// Helper function to validate percentage (0-100%)
const percentageNumber = (fieldName: string) =>
  z
    .string()
    .min(1, `${fieldName} is required`)
    .refine((val) => {
      const num = Number(val);
      return !Number.isNaN(num) && num >= 0 && num <= 100;
    }, `${fieldName} must be between 0 and 100%`);

// Helper function to validate time in seconds
const timeInSeconds = (fieldName: string) =>
  z
    .string()
    .min(1, `${fieldName} is required`)
    .refine((val) => {
      const num = Number(val);
      return !Number.isNaN(num) && num >= 0;
    }, `${fieldName} must be at least 0 seconds`);

const timeScale = (fieldName: string) =>
  z.enum(SELECT_TIME_SCALES).refine((data) => {
    return SELECT_TIME_SCALES.includes(data as TimeScaleSelect);
  }, `Invalid ${fieldName}`);

// Low stalk deposits mode validation
const lowStalkDepositsValidation = z.number().int().min(0).max(2).default(0); // 0: USE, 1: OMIT, 2: USE_LAST

export const convertUpSchemaErrors = {
  minBdvLteMaxBdv: "Min BDV per execution cannot exceed Max BDV per execution",
  minBdvLteTotal: "Min BDV per execution cannot exceed total convert BDV",
  maxBdvLteTotal: "Max BDV per execution cannot exceed total convert BDV",
  minPriceLteMaxPrice: "Min price cannot exceed max price",
  invalidPenalty: "Max grown stalk per BDV penalty must be negative or zero",
} as const;

// Main schema for convert up order dialog
export const convertUpOrderDialogSchema = z
  .object({
    // Source tokens to withdraw from
    tokenStrategy: tokenStrategyValidation,

    // Conversion amounts
    totalConvertBdv: positiveNumber("Total Convert BDV"),
    minConvertBdvPerExecution: positiveNumber("Min BDV per Execution"),
    maxConvertBdvPerExecution: positiveNumber("Max BDV per Execution"),

    // Time constraints
    minTimeBetweenConverts: timeInSeconds("Min Time Between Converts"),
    timeScale: timeScale("Time Scale"),

    // Bonus/capacity parameters
    minConvertBonusCapacity: nonNegativeNumber("Min Convert Bonus Capacity"),
    maxGrownStalkPerBdv: positiveNumber("Max Grown Stalk per BDV"),
    minGrownStalkPerBdvBonus: nonNegativeNumber("Min Grown Stalk per BDV Bonus"),

    // Price constraints
    maxPriceToConvertUp: positiveNumber("Max Price to Convert Up"),
    minPriceToConvertUp: positiveNumber("Min Price to Convert Up"),

    // Penalty tolerance
    maxGrownStalkPerBdvPenalty: z
      .string()
      .min(0, "Max Grown Stalk per BDV Penalty is required")
      .refine((val) => {
        const vals = postSanitizedSanitizedValue(val, 6);
        if (vals.nonAmount) return true;
        return vals.tv.gte(0); // Must be gte
      }, "Max Grown Stalk per BDV Penalty must be negative or zero"),

    // Execution parameters
    slippageRatio: percentageNumber("Slippage Ratio"),
    lowStalkDeposits: lowStalkDepositsValidation,

    // Operator tip
    operatorTip: positiveNumber("Operator Tip"),
  })
  .superRefine((data, ctx) => {
    // Cross-field validation: minConvertBdvPerExecution <= maxConvertBdvPerExecution
    if (!validateFormLte(data.minConvertBdvPerExecution, data.maxConvertBdvPerExecution, 6, 6)) {
      addCTXErrors(ctx, convertUpSchemaErrors.minBdvLteMaxBdv, [
        "minConvertBdvPerExecution",
        "maxConvertBdvPerExecution",
      ]);
    }
  })
  .superRefine((data, ctx) => {
    // Cross-field validation: minConvertBdvPerExecution <= totalConvertBdv
    if (!validateFormLte(data.minConvertBdvPerExecution, data.totalConvertBdv, 6, 6)) {
      addCTXErrors(ctx, convertUpSchemaErrors.minBdvLteTotal, ["minConvertBdvPerExecution", "totalConvertBdv"]);
    }
  })
  .superRefine((data, ctx) => {
    // Cross-field validation: maxConvertBdvPerExecution <= totalConvertBdv
    if (!validateFormLte(data.maxConvertBdvPerExecution, data.totalConvertBdv, 6, 6)) {
      addCTXErrors(ctx, convertUpSchemaErrors.maxBdvLteTotal, ["maxConvertBdvPerExecution", "totalConvertBdv"]);
    }
  })
  .superRefine((data, ctx) => {
    // Cross-field validation: minPriceToConvertUp <= maxPriceToConvertUp
    if (!validateFormLte(data.minPriceToConvertUp, data.maxPriceToConvertUp, 6, 6)) {
      addCTXErrors(ctx, convertUpSchemaErrors.minPriceLteMaxPrice, ["minPriceToConvertUp", "maxPriceToConvertUp"]);
    }
  });

// Type inference from schema
export type ConvertUpV0FormSchema = z.infer<typeof convertUpOrderDialogSchema>;

// ---------------------------------------------
// FORM
// ---------------------------------------------

// Default values for the form
const defaultConvertOrderUpValues: ConvertUpV0FormSchema = {
  // Initial required fields
  tokenStrategy: { type: "LOWEST_SEEDS" }, // Default to first silo token
  totalConvertBdv: "",
  minPriceToConvertUp: "0.001", // $0.001
  maxPriceToConvertUp: "0.999", // $0.999
  minGrownStalkPerBdvBonus: "",

  // inferrable fields
  minConvertBdvPerExecution: "",
  maxConvertBdvPerExecution: "",
  minTimeBetweenConverts: "0", // 0 seconds
  timeScale: "SECONDS",
  minConvertBonusCapacity: "",
  maxGrownStalkPerBdv: "100", // default of 100 max grown stalk per BDV
  maxGrownStalkPerBdvPenalty: "0", // default to 0 penalty
  slippageRatio: "0.1", // 0.1%
  lowStalkDeposits: 0, // USE (0) for default
  operatorTip: "0",
};

type IConvertUpV0Form = {
  form: ReturnType<typeof useForm<ConvertUpV0FormSchema>>;
  prefillValues: (prefillValues: Partial<ConvertUpV0FormSchema>) => void;
  getAreAllFieldsFilled: () => boolean;
  getAreAllFieldsValid: () => boolean;
  getMissingFields: () => string[];
};

export const useConvertUpV0Form = (): IConvertUpV0Form => {
  const form = useForm<ConvertUpV0FormSchema>({
    resolver: zodResolver(convertUpOrderDialogSchema),
    defaultValues: { ...defaultConvertOrderUpValues },
    mode: "onChange",
  });

  const prefillValues = useCallback(
    (prefillValues: Partial<ConvertUpV0FormSchema>) => {
      form.reset(prefillValues, { keepDirty: true });
    },
    [form.reset],
  );

  const getAreAllFieldsFilled = useCallback(() => {
    const values = form.getValues();
    return Object.entries(values).every(([key, value]) => {
      if (key === "tokenStrategy") {
        return StrategyUtil.isValidStrategy(value);
      }
      if (typeof value === "string") {
        return Boolean(value.trim().length);
      }
      if (typeof value === "number") {
        return value >= 0;
      }
      return true;
    });
  }, [form.getValues]);

  const getAreAllFieldsValid = useCallback(() => {
    return Object.values(form.formState.errors).every((value) => !value) && getAreAllFieldsFilled();
  }, [form.formState.errors, getAreAllFieldsFilled]);

  const getMissingFields = useCallback(() => {
    const values = form.getValues();

    const missingFields = Object.keys(values).filter((key) => {
      const value = values[key as keyof ConvertUpV0FormSchema];

      if (key === "tokenStrategy") {
        return !StrategyUtil.isValidStrategy(value);
      }
      if (typeof value === "string") {
        return value.trim() === "";
      }
      if (typeof value === "number") {
        return false; // Numbers always have a value
      }
      return false;
    });

    return missingFields;
  }, [form.getValues]);

  return {
    form,
    prefillValues,
    getAreAllFieldsFilled,
    getAreAllFieldsValid,
    getMissingFields,
  } as const;
};

export type ConvertUpV0FormOrderData = {
  sourceTokenIndices: number[];
  totalConvertBdv: string;
  minConvertBdvPerExecution: string;
  maxConvertBdvPerExecution: string;
  minTimeBetweenConverts: string;
  minConvertBonusCapacity: string;
  maxGrownStalkPerBdv: string;
  minGrownStalkPerBdvBonus: string;
  maxPriceToConvertUp: string;
  minPriceToConvertUp: string;
  maxGrownStalkPerBdvPenalty: string;
  slippageRatio: string;
  lowStalkDeposits: number;
  operatorTip: string;
};

export type ConvertUpV0State = {
  blueprint: Blueprint;
  encodedData: `0x${string}`;
  operatorPasteInstructions: `0x${string}`[];
  depositOptimizationCalls: `0x${string}`[];
};

export interface PreparedConvertUpArgs {
  tokenStrategy: TractorTokenStrategy;
  totalConvertBdv: TV;
  minConvertBdvPerExecution: TV;
  maxConvertBdvPerExecution: TV;
  minTimeBetweenConverts: number;
  minConvertBonusCapacity: TV;
  maxGrownStalkPerBdv: TV;
  minGrownStalkPerBdvBonus: TV;
  maxPriceToConvertUp: TV;
  minPriceToConvertUp: TV;
  maxGrownStalkPerBdvPenalty: TV;
  slippageRatio: number;
  lowStalkDeposits: number;
  operatorTip: TV;
}

const DEFAULT_MIN_SIZE_PER_EXECUTION = TV.fromHuman("100", 6);
const DEFAULT_MAX_SIZE_PER_EXECUTION = TV.fromHuman("125", 6);
const MIN_SIZE_PER_EXECUTION_PCT = 0.05;
const MAX_SIZE_PER_EXECUTION_PCT = 0.1;

export const useConvertUpV0State = () => {
  const client = usePublicClient();
  const { address } = useAccount();
  const protocolAddress = useProtocolAddress();
  const tokenMap = useTokenMap();
  const [preparedArgs, setPreparedArgs] = useState<PreparedConvertUpArgs | undefined>(undefined);

  const [state, setState] = useState<ConvertUpV0State | undefined>(undefined);
  const [orderData, setOrderData] = useState<ConvertUpV0FormOrderData | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const { mainToken } = useTokenData();

  const handleCreateBlueprint = useCallback(
    async (
      form: ReturnType<typeof useForm<ConvertUpV0FormSchema>>,
      deposits?: ReturnType<typeof useFarmerSilo>["deposits"],
      options?: {
        onFailure?: () => void;
        onSuccess?: () => void;
      },
    ) => {
      if (!client) {
        throw new Error("No public client available.");
      }
      if (!address) {
        throw new Error("Signer not found.");
      }

      if (!deposits) {
        throw new Error("No deposits found.");
      }

      setIsLoading(true);

      try {
        const formData = form.getValues();

        // Convert form data to ConvertUpParams format
        const convertUpParams: Partial<ConvertUpParams> = {
          sourceTokenIndices: [],
          // tokenStrategy: formData.tokenStrategy.type === "LOWEST_SEEDS" ? [255] : formData.tokenStrategy.type === "LOWEST_PRICE" ? [254] : [formData.tokenStrategy.addresses?.[0]],
          totalConvertBdv: BigInt(postSanitizedSanitizedValue(formData.totalConvertBdv, 6).tv.toBigInt()),
          minConvertBdvPerExecution: BigInt(
            postSanitizedSanitizedValue(formData.minConvertBdvPerExecution, 6).tv.toBigInt(),
          ),
          maxConvertBdvPerExecution: BigInt(
            postSanitizedSanitizedValue(formData.maxConvertBdvPerExecution, 6).tv.toBigInt(),
          ),
          minTimeBetweenConverts: BigInt(postSanitizedSanitizedValue(formData.minTimeBetweenConverts, 0).tv.toBigInt()),
          minConvertBonusCapacity: BigInt(
            postSanitizedSanitizedValue(formData.minConvertBonusCapacity, 6).tv.toBigInt(),
          ),
          maxGrownStalkPerBdv: BigInt(postSanitizedSanitizedValue(formData.maxGrownStalkPerBdv, 6).tv.toBigInt()),
          minGrownStalkPerBdvBonus: BigInt(
            postSanitizedSanitizedValue(formData.minGrownStalkPerBdvBonus, 6).tv.toBigInt(),
          ),
          maxPriceToConvertUp: BigInt(postSanitizedSanitizedValue(formData.maxPriceToConvertUp, 6).tv.toBigInt()),
          minPriceToConvertUp: BigInt(postSanitizedSanitizedValue(formData.minPriceToConvertUp, 6).tv.toBigInt()),
          maxGrownStalkPerBdvPenalty: BigInt(
            postSanitizedSanitizedValue(formData.maxGrownStalkPerBdvPenalty, 6).tv.toBigInt(),
          ),
          slippageRatio: BigInt(
            postSanitizedSanitizedValue((parseFloat(formData.slippageRatio) / 100).toString(), 6).tv.toBigInt(),
          ), // Convert percentage to ratio
          lowStalkDeposits: formData.lowStalkDeposits,
        };

        const operatorParams = {
          whitelistedOperators: [],
          tipAddress: address,
          operatorTipAmount: BigInt(postSanitizedSanitizedValue(formData.operatorTip, 6).tv.toBigInt()),
        };

        // Create the convert up blueprint
        // const requisition = createConvertUpBlueprint(convertUpParams, operatorParams, address);

        // setOrderData({
        //   sourceTokenIndices: [],
        //   // tokenStrategy: formData.tokenStrategy,
        //   totalConvertBdv: formData.totalConvertBdv,
        //   minConvertBdvPerExecution: formData.minConvertBdvPerExecution,
        //   maxConvertBdvPerExecution: formData.maxConvertBdvPerExecution,
        //   minTimeBetweenConverts: formData.minTimeBetweenConverts,
        //   minConvertBonusCapacity: formData.minConvertBonusCapacity,
        //   maxGrownStalkPerBdv: formData.maxGrownStalkPerBdv,
        //   minGrownStalkPerBdvBonus: formData.minGrownStalkPerBdvBonus,
        //   maxPriceToConvertUp: formData.maxPriceToConvertUp,
        //   minPriceToConvertUp: formData.minPriceToConvertUp,
        //   maxGrownStalkPerBdvPenalty: formData.maxGrownStalkPerBdvPenalty,
        //   slippageRatio: formData.slippageRatio,
        //   lowStalkDeposits: formData.lowStalkDeposits,
        //   operatorTip: formData.operatorTip,
        // });

        // setState({
        //   blueprint: requisition.blueprint,
        //   encodedData: requisition.blueprint.data,
        //   operatorPasteInstructions: requisition.blueprint.operatorPasteInstrs,
        //   depositOptimizationCalls: [], // Convert up doesn't have deposit optimization calls
        // });

        options?.onSuccess?.();
      } catch (error) {
        console.error("Error creating convert up blueprint:", error);
        options?.onFailure?.();
      } finally {
        setIsLoading(false);
      }
    },
    [client, address, protocolAddress, tokenMap],
  );

  return {
    state,
    orderData,
    isLoading,
    handleCreateBlueprint,
  } as const;
};

export const prepareConvertUpInitialFormData = (
  values: ConvertUpV0FormSchema,
  mainTokenDecimals: number,
): PreparedConvertUpArgs => {
  const strategy = StrategyUtil.isValidStrategy(values.tokenStrategy) ? values.tokenStrategy : undefined;

  if (!strategy) {
    throw new Error("Invalid token strategy");
  }

  const decimals = mainTokenDecimals;

  const totalConvertBdv = postSanitizedSanitizedValue(values.totalConvertBdv, decimals).tv;
  const minPriceToConvertUp = postSanitizedSanitizedValue(values.minPriceToConvertUp, decimals).tv;
  const maxPriceToConvertUp = postSanitizedSanitizedValue(values.maxPriceToConvertUp, decimals).tv;
  const minGrownStalkPerBdvBonus = postSanitizedSanitizedValue(values.minGrownStalkPerBdvBonus, decimals).tv;
  const minSizePerExecution = postSanitizedSanitizedValue(values.minConvertBdvPerExecution, decimals).tv;
  const maxSizePerExecution = postSanitizedSanitizedValue(values.maxConvertBdvPerExecution, decimals).tv;

  // Default to min of (5% of total convert bdv) or (100 PDV)
  const defaultMinSizePerExecution = TV.min(
    totalConvertBdv.mul(MIN_SIZE_PER_EXECUTION_PCT),
    DEFAULT_MIN_SIZE_PER_EXECUTION,
  );

  // default to min of (10% of total convert bdv) or (125 PDV)
  const defaultMaxSizePerExecution = TV.min(
    totalConvertBdv.sub(MAX_SIZE_PER_EXECUTION_PCT),
    DEFAULT_MAX_SIZE_PER_EXECUTION,
  );

  const thisPreparedArgs: PreparedConvertUpArgs = {
    tokenStrategy: strategy,
    totalConvertBdv,
    minConvertBonusCapacity: defaultMinSizePerExecution,
    minConvertBdvPerExecution: minSizePerExecution.eq(0) ? defaultMinSizePerExecution : minSizePerExecution,
    maxConvertBdvPerExecution: maxSizePerExecution.eq(0) ? defaultMaxSizePerExecution : maxSizePerExecution,
    minPriceToConvertUp,
    maxPriceToConvertUp,
    minTimeBetweenConverts: Number(values.minTimeBetweenConverts),
    maxGrownStalkPerBdv: postSanitizedSanitizedValue(values.maxGrownStalkPerBdv, STALK.decimals).tv,
    minGrownStalkPerBdvBonus,
    maxGrownStalkPerBdvPenalty: postSanitizedSanitizedValue(values.maxGrownStalkPerBdvPenalty, decimals).tv,
    slippageRatio: postSanitizedSanitizedValue(values.slippageRatio, decimals).tv.toNumber(),
    operatorTip: postSanitizedSanitizedValue(values.operatorTip, decimals).tv,
    lowStalkDeposits: values.lowStalkDeposits,
  };

  return thisPreparedArgs;
};
