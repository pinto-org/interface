import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { useTokenMap } from "@/hooks/pinto/useTokenMap";
import {
  Blueprint,
  LowStalkDepositsMode,
  tractorTokenStrategyUtil as StrategyUtil,
  TractorTokenStrategyUnion,
  createBlueprintFromBlock,
  createConvertUpTractorData,
  getTractorConvertUpParamsDecimalConfig,
} from "@/lib/Tractor";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { validateFormLte } from "@/utils/number";
import { SanitizedTV, postSanitizedSanitizedValue } from "@/utils/string";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useAccount, useChainId, usePublicClient } from "wagmi";
import { z } from "zod";

import { TV } from "@/classes/TokenValue";
import { MAIN_TOKEN } from "@/constants/tokens";
import { getChainConstant } from "@/utils/chain";
import FormUtils from "@/utils/form";
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

type FormSchema<T = string> = {
  tokenStrategy: TractorTokenStrategyUnion;
  totalBeanAmountToConvert: T;
  minBeansConvertPerExecution: T;
  maxBeansConvertPerExecution: T;
  minTimeBetweenConverts: T;
  timeScale: TimeScaleSelect;
  minConvertBonusCapacity: T;
  maxGrownStalkPerBdv: T;
  grownStalkPerBdvBonusBid: T;
  maxPriceToConvertUp: T;
  minPriceToConvertUp: T;
  seedDifference: T;
  maxGrownStalkPerBdvPenalty: T;
  slippageRatio: T;
  operatorTip: T;
  customOperatorTip?: T | undefined;
  lowStalkDeposits: LowStalkDepositsMode;
};

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
      return vals.tv.gte(1);
    }, `${fieldName} must be at least 1 seconds`);

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

const inferrableKeys: (keyof FormSchema)[] = [
  "minBeansConvertPerExecution",
  "maxBeansConvertPerExecution",
  "minTimeBetweenConverts",
  "minConvertBonusCapacity",
  "maxGrownStalkPerBdv",
  "maxGrownStalkPerBdvPenalty",
  "lowStalkDeposits",
  "operatorTip",
  "seedDifference",
  "slippageRatio",
] as const;

const initRequiredKeys: (keyof FormSchema)[] = [
  "tokenStrategy",
  "totalBeanAmountToConvert",
  "grownStalkPerBdvBonusBid",
  "minPriceToConvertUp",
  "maxPriceToConvertUp",
] as const;

const allFormKeys: (keyof FormSchema)[] = [...initRequiredKeys, ...inferrableKeys];

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
    totalBeanAmountToConvert: positiveNumber("Total Convert PDV"),
    minBeansConvertPerExecution: positiveNumber("Min PDV per Execution"),
    maxBeansConvertPerExecution: positiveNumber("Max PDV per Execution"),

    // Time constraints
    minTimeBetweenConverts: timeInSeconds("Min Time Between Executions"),
    timeScale: timeScale("Time Scale"),

    // Bonus/capacity parameters
    minConvertBonusCapacity: nonNegativeNumber("Min Convert Bonus Capacity"),
    maxGrownStalkPerBdv: positiveNumber("Max Grown Stalk per PDV"),
    grownStalkPerBdvBonusBid: nonNegativeNumber("Min Grown Stalk per BDV Bonus"),

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
        condition: !validateFormLte(data.minBeansConvertPerExecution, data.maxBeansConvertPerExecution, 6, 6),
        error: convertUpSchemaErrors.minBdvLteMaxBdv,
        paths: ["minBeansConvertPerExecution", "maxBeansConvertPerExecution"],
      },
      {
        condition: !validateFormLte(data.minBeansConvertPerExecution, data.totalBeanAmountToConvert, 6, 6),
        error: convertUpSchemaErrors.minBdvLteTotal,
        paths: ["minBeansConvertPerExecution", "totalBeanAmountToConvert"],
      },
      {
        condition: !validateFormLte(data.maxBeansConvertPerExecution, data.totalBeanAmountToConvert, 6, 6),
        error: convertUpSchemaErrors.maxBdvLteTotal,
        paths: ["maxBeansConvertPerExecution", "totalBeanAmountToConvert"],
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

// ---------------------------------------------
// FORM
// ---------------------------------------------

// Type inference from schema
export type ConvertUpV0FormSchema = FormSchema<string>;

// Default values for the form
const defaultConvertOrderUpValues: FormSchema = {
  // Initial required fields
  tokenStrategy: { type: "LOWEST_SEEDS" }, // Default to first silo token
  totalBeanAmountToConvert: "",
  minPriceToConvertUp: "0.001", // $0.001
  maxPriceToConvertUp: "0.999", // $0.999
  grownStalkPerBdvBonusBid: "",

  // inferrable fields
  seedDifference: "",
  minBeansConvertPerExecution: "",
  maxBeansConvertPerExecution: "",
  minTimeBetweenConverts: "1", // 0 seconds
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

export const transformConvertUpFormValues = (values: FormSchema, chainId: number): FormSchema<SanitizedTV> => {
  const dc = getTractorConvertUpParamsDecimalConfig(chainId);

  const totalBeanAmountToConvert = postSanitizedSanitizedValue(
    values.totalBeanAmountToConvert,
    dc.totalBeanAmountToConvert,
  );
  const minBeansConvertPerExecution = postSanitizedSanitizedValue(
    values.minBeansConvertPerExecution,
    dc.minBeansConvertPerExecution,
  );
  const maxBeansConvertPerExecution = postSanitizedSanitizedValue(
    values.maxBeansConvertPerExecution,
    dc.maxBeansConvertPerExecution,
  );
  const minTimeBetweenConverts = postSanitizedSanitizedValue(values.minTimeBetweenConverts, dc.minTimeBetweenConverts);

  const minConvertBonusCapacity = postSanitizedSanitizedValue(
    values.minConvertBonusCapacity,
    dc.minConvertBonusCapacity,
  );
  const maxGrownStalkPerBdv = postSanitizedSanitizedValue(values.maxGrownStalkPerBdv, dc.maxGrownStalkPerBdv);
  const grownStalkPerBdvBonusBid = postSanitizedSanitizedValue(
    values.grownStalkPerBdvBonusBid,
    dc.grownStalkPerBdvBonusBid,
  );

  const maxPriceToConvertUp = postSanitizedSanitizedValue(values.maxPriceToConvertUp, dc.maxPriceToConvertUp);
  const minPriceToConvertUp = postSanitizedSanitizedValue(values.minPriceToConvertUp, dc.minPriceToConvertUp);

  const maxGrownStalkPerBdvPenalty = postSanitizedSanitizedValue(
    values.maxGrownStalkPerBdvPenalty,
    dc.maxGrownStalkPerBdvPenalty,
  );

  const seedDifference = postSanitizedSanitizedValue(values.seedDifference, dc.seedDifference);

  const operatorTip = postSanitizedSanitizedValue(values.operatorTip, dc.operatorTip);
  const customOperatorTip = postSanitizedSanitizedValue(values.customOperatorTip ?? "", dc.operatorTip);
  const slippageRatio = postSanitizedSanitizedValue(values.slippageRatio, dc.slippageRatio);

  return {
    ...values,
    totalBeanAmountToConvert: totalBeanAmountToConvert,
    minBeansConvertPerExecution: minBeansConvertPerExecution,
    maxBeansConvertPerExecution: maxBeansConvertPerExecution,
    minTimeBetweenConverts: minTimeBetweenConverts,
    minConvertBonusCapacity: minConvertBonusCapacity,
    maxGrownStalkPerBdv: maxGrownStalkPerBdv,
    grownStalkPerBdvBonusBid: grownStalkPerBdvBonusBid,
    maxPriceToConvertUp: maxPriceToConvertUp,
    seedDifference: seedDifference,
    minPriceToConvertUp: minPriceToConvertUp,
    maxGrownStalkPerBdvPenalty: maxGrownStalkPerBdvPenalty,
    slippageRatio: slippageRatio,
    operatorTip: operatorTip,
    customOperatorTip: customOperatorTip,
  } satisfies FormSchema<SanitizedTV>;
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
    totalBeanAmountToConvert: cleaned.totalBeanAmountToConvert.tv,
    minBeansConvertPerExecution: cleaned.minBeansConvertPerExecution.tv,
    maxBeansConvertPerExecution: cleaned.maxBeansConvertPerExecution.tv,
    minConvertBonusCapacity: cleaned.minConvertBonusCapacity.tv,
    maxGrownStalkPerBdv: cleaned.maxGrownStalkPerBdv.tv,
    grownStalkPerBdvBonusBid: cleaned.grownStalkPerBdvBonusBid.tv,
    maxPriceToConvertUp: cleaned.maxPriceToConvertUp.tv,
    minPriceToConvertUp: cleaned.minPriceToConvertUp.tv,
    maxGrownStalkPerBdvPenalty: cleaned.maxGrownStalkPerBdvPenalty.tv,
    slippageRatio: cleaned.slippageRatio.tv,
    seedDifference: cleaned.seedDifference.tv,
    operatorTip: operatorTip,
    minTimeBetweenConverts: minTimeBetweenConverts,
    lowStalkDeposits: Number(values.lowStalkDeposits),
  };
};

export type ConvertUpV0FormOrderData = {
  sourceTokenIndices: number[];
  totalBeanAmountToConvert: string;
  minBeansConvertPerExecution: string;
  maxBeansConvertPerExecution: string;
  minTimeBetweenConverts: string;
  minConvertBonusCapacity: string;
  maxGrownStalkPerBdv: string;
  grownStalkPerBdvBonusBid: string;
  maxPriceToConvertUp: string;
  minPriceToConvertUp: string;
  maxGrownStalkPerBdvPenalty: string;
  seedDifference: string;
  timeScale: TimeScaleSelect;
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
      averageTipPaid: number,
      operatorTipPreset: TractorOperatorTipStrategy,
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
        const [tractorData, block] = await Promise.all([
          createConvertUpTractorData({
            ...(preparedArgs as any),
            farmerDeposits: deposits,
            publicClient: client,
            userAddress: address,
            protocolAddress,
            whitelistedOperators: [], // TODO: Add operator whitelist support if needed
          }).catch((e) => {
            console.error("[useConvertUpV0State] Error creating tractor data:", e);
            throw e;
          }),
          client.getBlock({ blockTag: "latest" }),
        ]);

        console.debug("[useConvertUpV0State] Tractor data created:", tractorData);

        // Create the blueprint
        const blueprint = createBlueprintFromBlock({
          block,
          publisher: address,
          data: tractorData.data,
          operatorPasteInstrs: tractorData.operatorPasteInstrs,
          maxNonce: TV.MAX_UINT256.toBigInt(),
        });

        console.debug("[useConvertUpV0State] Blueprint created:", blueprint);

        // Set order data for display in ReviewTractorOrderDialog
        setOrderData({
          sourceTokenIndices: tractorData.struct.convertUpParams.sourceTokenIndices,
          totalBeanAmountToConvert: formData.totalBeanAmountToConvert,
          minBeansConvertPerExecution: formData.minBeansConvertPerExecution,
          maxBeansConvertPerExecution: formData.maxBeansConvertPerExecution,
          minTimeBetweenConverts: formData.minTimeBetweenConverts,
          minConvertBonusCapacity: formData.minConvertBonusCapacity,
          maxGrownStalkPerBdv: formData.maxGrownStalkPerBdv,
          grownStalkPerBdvBonusBid: formData.grownStalkPerBdvBonusBid,
          maxPriceToConvertUp: formData.maxPriceToConvertUp,
          minPriceToConvertUp: formData.minPriceToConvertUp,
          seedDifference: formData.seedDifference,
          timeScale: formData.timeScale,
          maxGrownStalkPerBdvPenalty: formData.maxGrownStalkPerBdvPenalty,
          slippageRatio: formData.slippageRatio,
          lowStalkDeposits: formData.lowStalkDeposits,
          operatorTip: TV.fromBigInt(tractorData.struct.opParams.operatorTipAmount, 6).toHuman(),
        });

        // Set state for the blueprint and encoded data
        setState({
          blueprint,
          encodedData: tractorData.data,
          operatorPasteInstructions: tractorData.operatorPasteInstrs,
          depositOptimizationCalls: tractorData.depositOptimizationCalls || [],
        });

        options?.onSuccess?.();
      } catch (_) {
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
