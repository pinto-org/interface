import { z } from "zod";
import { isValidAddress, postSanitizedSanitizedValue } from "./string";

// Helper function to validate positive numbers
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
    type: z.enum(["LOWEST_SEEDS", "LOWEST_PRICE", "SPECIFIC_TOKEN", "MULTI_TOKENS"]),
    addresses: z.array(z.string()).optional(),
  })
  .refine((data) => {
    if (data.type === "LOWEST_PRICE" || data.type === "LOWEST_SEEDS") {
      return data.addresses?.length === 0;
    }
    if (data.type === "SPECIFIC_TOKEN") {
      return data.addresses && isValidAddress(data.addresses[0]);
    }
    return data.addresses?.every((address) => isValidAddress(address));
  }, "All token addresses must be valid");

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
