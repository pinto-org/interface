import {
  tractorTokenStrategyUtil as StrategyUtil,
  TRACTOR_TOKEN_STRATEGY_TYPES,
  getTractorTokenStrategySummary,
} from "@/lib/Tractor";
import { z } from "zod";
import { isValidAddress, postSanitizedSanitizedValue } from "./string";

// Helper function to validate positive numbers (doesn't allow 0)
const positiveNumber = (fieldName: string) =>
  z
    .string()
    .min(1, `${fieldName} is required`)
    .refine((val) => {
      const vals = postSanitizedSanitizedValue(val, 6);
      if (vals.nonAmount) return true;
      return vals.tv.gt(0);
    }, `${fieldName} must be greater than 0`);

// Helper function to validate non-negative numbers (allows 0)
const nonNegativeNumber = (fieldName: string) =>
  z
    .string()
    .min(1, `${fieldName} is required`)
    .refine((val) => {
      const vals = postSanitizedSanitizedValue(val, 6);
      if (vals.nonAmount) return true;
      return vals.tv.gte(0);
    }, `${fieldName} must be greater than or equal to 0`);

// Token strategy validation
const singleTokenStrategyValidation = z
  .object({
    type: z.enum(["LOWEST_SEEDS", "LOWEST_PRICE", "SPECIFIC_TOKEN"]),
    address: z.string().optional(),
  })
  .refine((data) => {
    if (data.type === "SPECIFIC_TOKEN") {
      return isValidAddress(data.address);
    }
    return true;
  }, "Token address is required for specific token strategy");

const tokenStrategyValidation = z
  .object({
    type: z.enum(TRACTOR_TOKEN_STRATEGY_TYPES),
    addresses: z.array(z.string()).optional(),
  })
  .refine((data) => {
    const s = getTractorTokenStrategySummary(data);
    if (s.isDynamic) return true;
    if (s.isSingle) return data.addresses && isValidAddress(data.addresses[0]);
    return data.addresses?.every((address) => isValidAddress(address));
  }, "All token addresses must be valid")
  .refine((data) => {
    if (StrategyUtil.isDynamic(data)) {
      if ("addresses" in data && Array.isArray(data.addresses)) {
        return data.addresses.length !== 0;
      }
    }
    return true;
  }, "No tokens should be selected for dynamic token strategies");

const addZodCTXErrors = (ctx: z.RefinementCtx, message: string, paths: string[]) => {
  for (const path of paths) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message,
      path: [path],
    });
  }
};

const validateFormLte = (left: string, right: string, leftDecimals: number, rightDecimals: number) => {
  const leftSanitized = postSanitizedSanitizedValue(left, leftDecimals);
  if (leftSanitized.nonAmount) {
    return true;
  }

  const rightSanitized = postSanitizedSanitizedValue(right, rightDecimals);
  if (rightSanitized.nonAmount) {
    return true;
  }

  return leftSanitized.tv.lte(rightSanitized.tv);
};

const FormSchemaUtils = {
  schema: {
    positiveNumber,
    nonNegativeNumber,
    tokenStrategy: tokenStrategyValidation,
    singleTokenStrategy: singleTokenStrategyValidation,
    addCTXErrors: addZodCTXErrors,
  },
  validate: {
    lte: validateFormLte,
  },
} as const;

export default FormSchemaUtils;
