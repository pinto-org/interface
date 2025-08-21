import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { useTokenMap } from "@/hooks/pinto/useTokenMap";
import { Blueprint, tractorTokenStrategyUtil as StrategyUtil, TractorTokenStrategy } from "@/lib/Tractor";
import { createBlueprint } from "@/lib/Tractor/blueprint";
import { LowStalkDepositsMode, PreparedConvertUpArgs, createConvertUpTractorData } from "@/lib/Tractor/convertUp";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import useTokenData from "@/state/useTokenData";
import { validateFormLte } from "@/utils/number";
import { postSanitizedSanitizedValue } from "@/utils/string";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAccount, useChainId, usePublicClient } from "wagmi";
import { z } from "zod";

import { TV } from "@/classes/TokenValue";
import { STALK } from "@/constants/internalTokens";
import { MAIN_TOKEN } from "@/constants/tokens";
import { getChainConstant } from "@/utils/chain";
import FormUtils from "@/utils/form";
import { getChainTokenMap } from "@/utils/token";
import { exists } from "@/utils/utils";
import {
  SELECT_TIME_SCALES,
  TimeScaleSelect,
  TractorOperatorTipStrategy,
  getTractorOperatorTipAmountFromPreset,
} from "../fields/sharedFields";

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
      const vals = postSanitizedSanitizedValue(val, 18);
      if (vals.nonAmount) return true;
      return vals.tv.lte(100) && vals.tv.gte(0);
    }, `${fieldName} must be between 0 and 100%`);

// Helper function to validate time in seconds
const timeInSeconds = (fieldName: string) =>
  z
    .string()
    .min(1, `${fieldName} is required`)
    .refine((val) => {
      const vals = postSanitizedSanitizedValue(val, 18);
      if (vals.nonAmount) return true;
      return vals.tv.gte(0);
    }, `${fieldName} must be at least 0 seconds`);

const timeScale = (fieldName: string) =>
  z.enum(SELECT_TIME_SCALES).refine((data) => {
    return SELECT_TIME_SCALES.includes(data as TimeScaleSelect);
  }, `Invalid ${fieldName}`);

// Low stalk deposits mode validation
const lowStalkDepositsValidation = z.number().int().min(0).max(2).default(LowStalkDepositsMode.USE); // 0: USE, 1: OMIT, 2: USE_LAST

export const convertUpSchemaErrors = {
  minBdvLteMaxBdv: "Min PDV per execution exceeds Max PDV per execution",
  minBdvLteTotal: "Min PDV per execution exceeds Total Convert PDV",
  maxBdvLteTotal: "Max PDV per execution exceeds Total Convert PDV",
  minPriceLteMaxPrice: "Min Price exceeds Max Price",
} as const;

const inferrableKeys: (keyof ConvertUpV0FormSchema)[] = [
  "minConvertBdvPerExecution",
  "maxConvertBdvPerExecution",
  "minTimeBetweenConverts",
  "minConvertBonusCapacity",
  "maxGrownStalkPerBdv",
  "maxGrownStalkPerBdvPenalty",
  "lowStalkDeposits",
  "operatorTip",
  "slippageRatio",
] as const;

const initRequiredKeys: (keyof ConvertUpV0FormSchema)[] = [
  "tokenStrategy",
  "totalConvertBdv",
  "minGrownStalkPerBdvBonus",
  "minPriceToConvertUp",
  "maxPriceToConvertUp",
] as const;

const allFormKeys: (keyof ConvertUpV0FormSchema)[] = [...initRequiredKeys, ...inferrableKeys];

export const TractorConvertUpFormKeys = {
  advanced: inferrableKeys,
  initRequired: initRequiredKeys,
  all: allFormKeys,
} as const;

// Main schema for convert up order dialog
export const convertUpOrderDialogSchema = z
  .object({
    // Source tokens to withdraw from
    tokenStrategy: tokenStrategyValidation,

    // Conversion amounts
    totalConvertBdv: positiveNumber("Total Convert PDV"),
    minConvertBdvPerExecution: positiveNumber("Min PDV per Execution"),
    maxConvertBdvPerExecution: positiveNumber("Max PDV per Execution"),

    // Time constraints
    minTimeBetweenConverts: timeInSeconds("Min Time Between Executions"),
    timeScale: timeScale("Time Scale"),

    // Bonus/capacity parameters
    minConvertBonusCapacity: nonNegativeNumber("Min Convert Bonus Capacity"),
    maxGrownStalkPerBdv: positiveNumber("Max Grown Stalk per PDV"),
    minGrownStalkPerBdvBonus: nonNegativeNumber("Min Grown Stalk per BDV Bonus"),

    // Price constraints
    maxPriceToConvertUp: positiveNumber("Max Price").refine((data) => {
      const vals = postSanitizedSanitizedValue(data, 6);

      return vals.tv.lt(1);
    }, "Max Price must be less than 1"),

    minPriceToConvertUp: positiveNumber("Min Price").refine((data) => {
      const vals = postSanitizedSanitizedValue(data, 6);
      return vals.tv.lt(1);
    }, "Min Price must be less than 1"),

    // Penalty tolerance
    maxGrownStalkPerBdvPenalty: z.string().min(0, "Max Grown Stalk per BDV Penalty is required"),

    // Execution parameters
    slippageRatio: percentageNumber("Slippage Ratio"),
    lowStalkDeposits: lowStalkDepositsValidation,

    // Operator tip
    operatorTip: nonNegativeNumber("Operator Tip"),
    customOperatorTip: nonNegativeNumber("Custom Operator Tip").optional(),
  })
  .superRefine((data, ctx) => {
    // Consolidated cross-field validation
    const validations = [
      {
        condition: !validateFormLte(data.minConvertBdvPerExecution, data.maxConvertBdvPerExecution, 6, 6),
        error: convertUpSchemaErrors.minBdvLteMaxBdv,
        paths: ["minConvertBdvPerExecution", "maxConvertBdvPerExecution"],
      },
      {
        condition: !validateFormLte(data.minConvertBdvPerExecution, data.totalConvertBdv, 6, 6),
        error: convertUpSchemaErrors.minBdvLteTotal,
        paths: ["minConvertBdvPerExecution", "totalConvertBdv"],
      },
      {
        condition: !validateFormLte(data.maxConvertBdvPerExecution, data.totalConvertBdv, 6, 6),
        error: convertUpSchemaErrors.maxBdvLteTotal,
        paths: ["maxConvertBdvPerExecution", "totalConvertBdv"],
      },
      {
        condition: !validateFormLte(data.minPriceToConvertUp, data.maxPriceToConvertUp, 6, 6),
        error: convertUpSchemaErrors.minPriceLteMaxPrice,
        paths: ["minPriceToConvertUp", "maxPriceToConvertUp"],
      },
    ];

    validations.forEach(({ condition, error, paths }) => {
      if (condition) {
        addCTXErrors(ctx, error, paths);
      }
    });
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
  customOperatorTip: "",
};

type IConvertUpV0Form = {
  form: ReturnType<typeof useForm<ConvertUpV0FormSchema>>;
  prefillValues: (prefillValues: Partial<ConvertUpV0FormSchema>) => void;
  getAreAllFieldsFilled: (fields?: (keyof ConvertUpV0FormSchema)[]) => boolean;
  getAreAllFieldsValid: (fields?: (keyof ConvertUpV0FormSchema)[]) => boolean;
  getMissingFields: (fields?: (keyof ConvertUpV0FormSchema)[]) => string[];
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

  const getAreAllFieldsFilled = useCallback(
    (fields?: (keyof ConvertUpV0FormSchema)[]): boolean => {
      const values = form.getValues();

      const fieldSet = fields ? new Set(fields) : new Set(Object.keys(values));

      return Array.from(fieldSet).every((key) => {
        const value = values[key as keyof ConvertUpV0FormSchema];

        switch (true) {
          case key === "tokenStrategy":
            return StrategyUtil.isValidStrategy(value);
          case typeof value === "string":
            return Boolean(value.trim().length);
          case typeof value === "number":
            return value >= 0;
          default:
            return true;
        }
      });
    },
    [form.getValues],
  );

  const getAreAllFieldsValid = useCallback(
    (fields?: (keyof ConvertUpV0FormSchema)[]): boolean => {
      if (!!fields?.length) {
        const hasFieldErrors = fields.every((key) => {
          !form.formState.errors[key as keyof ConvertUpV0FormSchema];
        });
        return hasFieldErrors && getAreAllFieldsFilled(fields);
      }

      return Object.values(form.formState.errors).every((value) => !value) && getAreAllFieldsFilled();
    },
    [form.formState.errors, getAreAllFieldsFilled],
  );

  const getMissingFields = useCallback(
    (fields?: (keyof ConvertUpV0FormSchema)[]): (keyof ConvertUpV0FormSchema)[] => {
      const values = form.getValues();

      const fieldSet = fields?.length ? new Set(fields) : new Set(Object.keys(values));

      const missingFields = Array.from(fieldSet).filter((k) => {
        const key = k as keyof ConvertUpV0FormSchema;
        const value = values[key];

        switch (true) {
          case key === "tokenStrategy":
            return !StrategyUtil.isValidStrategy(value);
          case typeof value === "string": {
            return value === "";
          }
          case key === "lowStalkDeposits":
            return value !== 0 && value !== 1 && value !== 2;
          default:
            return false;
        }
      });

      return missingFields as (keyof ConvertUpV0FormSchema)[];
    },
    [form],
  );

  return {
    form,
    prefillValues,
    getAreAllFieldsFilled,
    getAreAllFieldsValid,
    getMissingFields,
  } as const;
};

const getSecondsBetweenConverts = (minTimeBetweenConverts: TV, timeScale: TimeScaleSelect) => {
  switch (timeScale) {
    case "SECONDS":
      return minTimeBetweenConverts;
    case "MINUTES":
      return minTimeBetweenConverts.mul(60);
    case "HOURS":
      return minTimeBetweenConverts.mul(60).mul(60);
    case "DAYS":
      return minTimeBetweenConverts.mul(60).mul(60).mul(24);
    default:
      throw new Error(`Invalid time scale: ${timeScale}`);
  }
};

export const transformConvertUpFormValues = (values: ConvertUpV0FormSchema, chainId: number) => {
  const { decimals } = getChainConstant(chainId, MAIN_TOKEN);

  const totalConvertBdv = postSanitizedSanitizedValue(values.totalConvertBdv, decimals);
  const minConvertBdvPerExecution = postSanitizedSanitizedValue(values.minConvertBdvPerExecution, decimals);
  const maxConvertBdvPerExecution = postSanitizedSanitizedValue(values.maxConvertBdvPerExecution, decimals);
  const minTimeBetweenConverts = postSanitizedSanitizedValue(values.minTimeBetweenConverts, 0);

  const minConvertBonusCapacity = postSanitizedSanitizedValue(values.minConvertBonusCapacity, decimals);
  const maxGrownStalkPerBdv = postSanitizedSanitizedValue(values.maxGrownStalkPerBdv, STALK.decimals);
  const minGrownStalkPerBdvBonus = postSanitizedSanitizedValue(values.minGrownStalkPerBdvBonus, STALK.decimals);

  const maxPriceToConvertUp = postSanitizedSanitizedValue(values.maxPriceToConvertUp, decimals);
  const minPriceToConvertUp = postSanitizedSanitizedValue(values.minPriceToConvertUp, decimals);

  const maxGrownStalkPerBdvPenalty = postSanitizedSanitizedValue(values.maxGrownStalkPerBdvPenalty, 18);

  const operatorTip = postSanitizedSanitizedValue(values.operatorTip, decimals);
  const customOperatorTip = postSanitizedSanitizedValue(values.customOperatorTip ?? "", decimals);
  const slippageRatio = postSanitizedSanitizedValue(values.slippageRatio, 18);

  return {
    ...values,
    totalConvertBdv: totalConvertBdv,
    minConvertBdvPerExecution: minConvertBdvPerExecution,
    maxConvertBdvPerExecution: maxConvertBdvPerExecution,
    minTimeBetweenConverts: minTimeBetweenConverts,
    minConvertBonusCapacity: minConvertBonusCapacity,
    maxGrownStalkPerBdv: maxGrownStalkPerBdv,
    minGrownStalkPerBdvBonus: minGrownStalkPerBdvBonus,
    maxPriceToConvertUp: maxPriceToConvertUp,
    minPriceToConvertUp: minPriceToConvertUp,
    maxGrownStalkPerBdvPenalty: maxGrownStalkPerBdvPenalty,
    slippageRatio: slippageRatio,
    operatorTip: operatorTip,
    customOperatorTip: customOperatorTip,
  };
};

const prepareConvertUpFormValuesForBlueprint = (
  values: ConvertUpV0FormSchema,
  operatorTipPreset: TractorOperatorTipStrategy,
  averageTipPaid: number,
  chainId: number,
) => {
  const mainToken = getChainConstant(chainId, MAIN_TOKEN);
  const cleaned = transformConvertUpFormValues(values, chainId);

  const minTimeBetweenConverts = getSecondsBetweenConverts(cleaned.minTimeBetweenConverts.tv, values.timeScale);

  const operatorTip = getTractorOperatorTipAmountFromPreset(
    operatorTipPreset,
    averageTipPaid,
    cleaned.customOperatorTip?.tv.toHuman() ?? "",
    mainToken.decimals,
  );

  if (!exists(operatorTip)) {
    throw new Error(`Invalid operator tip: ${values.operatorTip}`);
  }

  const tokenStrategy = StrategyUtil.isValidStrategy(values.tokenStrategy) ? values.tokenStrategy : undefined;

  if (!tokenStrategy) {
    throw new Error(`Invalid token strategy: ${values.tokenStrategy}`);
  }

  return {
    ...cleaned,
    tokenStrategy,
    totalConvertBdv: cleaned.totalConvertBdv.tv,
    minConvertBdvPerExecution: cleaned.minConvertBdvPerExecution.tv,
    maxConvertBdvPerExecution: cleaned.maxConvertBdvPerExecution.tv,
    minConvertBonusCapacity: cleaned.minConvertBonusCapacity.tv,
    maxGrownStalkPerBdv: cleaned.maxGrownStalkPerBdv.tv,
    minGrownStalkPerBdvBonus: cleaned.minGrownStalkPerBdvBonus.tv,
    maxPriceToConvertUp: cleaned.maxPriceToConvertUp.tv,
    minPriceToConvertUp: cleaned.minPriceToConvertUp.tv,
    maxGrownStalkPerBdvPenalty: cleaned.maxGrownStalkPerBdvPenalty.tv,
    slippageRatio: cleaned.slippageRatio.tv,
    operatorTip: operatorTip,
    minTimeBetweenConverts: minTimeBetweenConverts,
    lowStalkDeposits: Number(values.lowStalkDeposits),
  };
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

export const useConvertUpV0State = ({
  averageTipPaid,
  operatorTipPreset,
}: {
  averageTipPaid: number;
  operatorTipPreset: TractorOperatorTipStrategy;
}) => {
  const client = usePublicClient();
  const chainId = useChainId();
  const { address } = useAccount();
  const protocolAddress = useProtocolAddress();
  const tokenMap = useTokenMap();

  const [state, setState] = useState<ConvertUpV0State | undefined>(undefined);
  const [orderData, setOrderData] = useState<ConvertUpV0FormOrderData | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

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
        console.debug("[useConvertUpV0State] Creating blueprint with form data:", formData);

        // Transform form data to prepared args
        const preparedArgs = prepareConvertUpFormValuesForBlueprint(
          formData,
          operatorTipPreset,
          averageTipPaid,
          chainId,
        );
        console.debug("[useConvertUpV0State] Prepared args:", preparedArgs);

        // Create the tractor data using our implemented function
        const tractorData = await createConvertUpTractorData({
          ...preparedArgs,
          farmerDeposits: deposits,
          publicClient: client,
          userAddress: address,
          protocolAddress,
          whitelistedOperators: [], // TODO: Add operator whitelist support if needed
        });

        console.debug("[useConvertUpV0State] Tractor data created:", tractorData);

        // Create the blueprint
        const blueprint = createBlueprint({
          publisher: address,
          data: tractorData.data,
          operatorPasteInstrs: tractorData.operatorPasteInstrs,
          maxNonce: 1n,
        });

        console.debug("[useConvertUpV0State] Blueprint created:", blueprint);

        // Set order data for display in ReviewTractorOrderDialog
        setOrderData({
          sourceTokenIndices: [], // Will be populated from the token strategy
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

        // Set state for the blueprint and encoded data
        setState({
          blueprint,
          encodedData: tractorData.data,
          operatorPasteInstructions: tractorData.operatorPasteInstrs,
          depositOptimizationCalls: tractorData.depositOptimizationCalls || [],
        });

        toast.success("ConvertUp blueprint created successfully");
        options?.onSuccess?.();
      } catch (error) {
        console.error("Error creating convert up blueprint:", error);
        toast.error("Failed to create ConvertUp blueprint");
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
