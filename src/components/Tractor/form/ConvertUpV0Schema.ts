import { TokenValue } from "@/classes/TokenValue";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { useTokenMap } from "@/hooks/pinto/useTokenMap";
import { Blueprint, TractorTokenStrategy, createBlueprint } from "@/lib/Tractor";
import { ConvertUpParams, createConvertUpBlueprint } from "@/lib/Tractor/convertUp";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import useTokenData from "@/state/useTokenData";
import { validateFormLte } from "@/utils/number";
import { postSanitizedSanitizedValue } from "@/utils/string";
import { Token } from "@/utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useAccount, usePublicClient } from "wagmi";
import { z } from "zod";

import FormUtils from "@/utils/form";

const {
  schema: { positiveNumber, nonNegativeNumber, multiTokenStrategy, addCTXErrors },
} = FormUtils;

// Helper function to validate percentage (0-100%)
const percentageNumber = (fieldName: string) =>
  z
    .string()
    .min(1, `${fieldName} is required`)
    .refine((val) => {
      const vals = postSanitizedSanitizedValue(val, 6);
      if (vals.nonAmount) return true;
      return vals.tv.gte(0) && vals.tv.lte(100);
    }, `${fieldName} must be between 0 and 100%`);

// Helper function to validate time in seconds
const timeInSeconds = (fieldName: string) =>
  z
    .string()
    .min(1, `${fieldName} is required`)
    .refine((val) => {
      const vals = postSanitizedSanitizedValue(val, 0); // Time doesn't need decimals
      if (vals.nonAmount) return true;
      return vals.tv.gte(60); // Minimum 1 minute between executions
    }, `${fieldName} must be at least 60 seconds (1 minute)`);

// Source token indices validation
const sourceTokenIndicesValidation = z
  .array(z.number().int().min(0))
  .min(1, "At least one source token must be selected")
  .max(10, "Cannot select more than 10 source tokens"); // Reasonable limit

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
    tokenStrategy: multiTokenStrategy,

    // Conversion amounts
    totalConvertBdv: positiveNumber("Total Convert BDV"),
    minConvertBdvPerExecution: positiveNumber("Min BDV per Execution"),
    maxConvertBdvPerExecution: positiveNumber("Max BDV per Execution"),

    // Time constraints
    minTimeBetweenConverts: timeInSeconds("Min Time Between Converts"),

    // Bonus/capacity parameters
    minConvertBonusCapacity: nonNegativeNumber("Min Convert Bonus Capacity"),
    maxGrownStalkPerBdv: positiveNumber("Max Grown Stalk per BDV"),
    minGrownStalkPerBdvBonus: nonNegativeNumber("Min Grown Stalk per BDV Bonus"),

    // Price constraints
    maxPriceToConvertUp: positiveNumber("Max Price to Convert Up"),
    minPriceToConvertUp: positiveNumber("Min Price to Convert Up"),

    // Penalty tolerance (can be negative)
    maxGrownStalkPerBdvPenalty: z
      .string()
      .min(1, "Max Grown Stalk per BDV Penalty is required")
      .refine((val) => {
        const vals = postSanitizedSanitizedValue(val, 6);
        if (vals.nonAmount) return true;
        return vals.tv.lte(0); // Must be negative or zero
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

// Default values for the form
export const defaultConvertUpOrderDialogValues: Partial<ConvertUpV0FormSchema> = {
  tokenStrategy: { type: "LOWEST_SEEDS" }, // Default to first silo token
  totalConvertBdv: "",
  minConvertBdvPerExecution: "",
  maxConvertBdvPerExecution: "",
  minTimeBetweenConverts: "3600", // 1 season
  minConvertBonusCapacity: "0",
  maxGrownStalkPerBdv: "0",
  minGrownStalkPerBdvBonus: "0",
  maxPriceToConvertUp: "0",
  minPriceToConvertUp: "0",
  maxGrownStalkPerBdvPenalty: "0",
  slippageRatio: "0.1", // 0.1%
  lowStalkDeposits: 0, // USE
  operatorTip: "0",
};

export type ConvertUpV0Form = {
  form: ReturnType<typeof useForm<ConvertUpV0FormSchema>>;
  prefillValues: (prefillValues: Partial<ConvertUpV0FormSchema>) => void;
  getAreAllFieldsFilled: () => boolean;
  getAreAllFieldsValid: () => boolean;
  getMissingFields: () => string[];
};

export const useConvertUpV0Form = (): ConvertUpV0Form => {
  const form = useForm<ConvertUpV0FormSchema>({
    resolver: zodResolver(convertUpOrderDialogSchema),
    defaultValues: { ...defaultConvertUpOrderDialogValues },
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
      if (key === "sourceTokenIndices") {
        return Array.isArray(value) && value.length > 0;
      }
      if (typeof value === "string") {
        return Boolean(value.trim());
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

      if (key === "sourceTokenIndices") {
        return !Array.isArray(value) || value.length === 0;
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

export const useConvertUpV0State = () => {
  const client = usePublicClient();
  const { address } = useAccount();
  const protocolAddress = useProtocolAddress();
  const tokenMap = useTokenMap();

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
        const requisition = createConvertUpBlueprint(convertUpParams, operatorParams, address);

        setOrderData({
          sourceTokenIndices: [],
          // tokenStrategy: formData.tokenStrategy,
          totalConvertBdv: formData.totalConvertBdv,
          minConvertBdvPerExecution: formData.minConvertBdvPerExecution,
          maxConvertBdvPerExecution: formData.maxConvertBdvPerExecution,
          minTimeBetweenConverts: formData.minTimeBetweenConverts,
          minConvertBonusCapacity: formData.minConvertBonusCapacity,
          maxGrownStalkPerBdv: formData.maxGrownStalkPerBdv,
          minGrownStalkPerBdvBonus: formData.minGrownStalkPerBdvBonus,
          maxPriceToConvertUp: formData.maxPriceToConvertUp,
          minPriceToConvertUp: formData.minPriceToConvertUp,
          maxGrownStalkPerBdvPenalty: formData.maxGrownStalkPerBdvPenalty,
          slippageRatio: formData.slippageRatio,
          lowStalkDeposits: formData.lowStalkDeposits,
          operatorTip: formData.operatorTip,
        });

        setState({
          blueprint: requisition.blueprint,
          encodedData: requisition.blueprint.data,
          operatorPasteInstructions: requisition.blueprint.operatorPasteInstrs,
          depositOptimizationCalls: [], // Convert up doesn't have deposit optimization calls
        });

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
