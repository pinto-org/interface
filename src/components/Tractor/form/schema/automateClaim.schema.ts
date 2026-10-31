import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// ────────────────────────────────────────────────────────────────────────────────
// SCHEMA
// ────────────────────────────────────────────────────────────────────────────────

const claimFrequencyPreset = z.enum(["high", "medium", "low", "custom"]).nullable().default(null);

export const automateClaimSchemaErrors = {
  noOperationEnabled: "At least one operation (Mow, Plant, or Harvest) must be enabled",
  customValueRequired: "A positive numeric value is required when Custom is selected",
} as const;

export const automateClaimSchema = z
  .object({
    mowEnabled: z.boolean().default(false),
    mowPreset: claimFrequencyPreset,
    mowCustomValue: z.string().default(""),

    plantEnabled: z.boolean().default(false),
    plantPreset: claimFrequencyPreset,
    plantCustomValue: z.string().default(""),

    harvestEnabled: z.boolean().default(false),
    harvestPreset: claimFrequencyPreset,
    harvestCustomValue: z.string().default(""),

    operatorTipPreset: z.enum(["Custom", "Low", "Normal", "High"] as const).default("Normal"),
    customOperatorTip: z.string().default(""),
  })
  .superRefine((data, ctx) => {
    // At least one operation must be enabled (Req 4.1)
    if (!data.mowEnabled && !data.plantEnabled && !data.harvestEnabled) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: automateClaimSchemaErrors.noOperationEnabled,
        path: ["mowEnabled"],
      });
    }

    // Custom preset validation — positive numeric value required (Req 4.2, 4.3)
    const operations = [
      { enabled: data.mowEnabled, preset: data.mowPreset, customValue: data.mowCustomValue, field: "mowCustomValue" },
      {
        enabled: data.plantEnabled,
        preset: data.plantPreset,
        customValue: data.plantCustomValue,
        field: "plantCustomValue",
      },
      {
        enabled: data.harvestEnabled,
        preset: data.harvestPreset,
        customValue: data.harvestCustomValue,
        field: "harvestCustomValue",
      },
    ] as const;

    for (const op of operations) {
      if (op.enabled && op.preset === "custom") {
        const trimmed = op.customValue.trim();
        const num = Number(trimmed);
        if (!trimmed || Number.isNaN(num) || num <= 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: automateClaimSchemaErrors.customValueRequired,
            path: [op.field],
          });
        }
      }
    }
  });

// ────────────────────────────────────────────────────────────────────────────────
// TYPES
// ────────────────────────────────────────────────────────────────────────────────

export type AutomateClaimFormValues = z.infer<typeof automateClaimSchema>;

// ────────────────────────────────────────────────────────────────────────────────
// DEFAULT VALUES
// ────────────────────────────────────────────────────────────────────────────────

export const defaultAutomateClaimValues: AutomateClaimFormValues = {
  mowEnabled: false,
  mowPreset: null,
  mowCustomValue: "",

  plantEnabled: false,
  plantPreset: null,
  plantCustomValue: "",

  harvestEnabled: false,
  harvestPreset: null,
  harvestCustomValue: "",

  operatorTipPreset: "Normal",
  customOperatorTip: "",
};

// ────────────────────────────────────────────────────────────────────────────────
// FORM HOOK
// ────────────────────────────────────────────────────────────────────────────────

export type IAutomateClaimForm = {
  form: ReturnType<typeof useForm<AutomateClaimFormValues>>;
  prefillValues: (values: Partial<AutomateClaimFormValues>) => void;
};

export const useAutomateClaimForm = (): IAutomateClaimForm => {
  const form = useForm<AutomateClaimFormValues>({
    resolver: zodResolver(automateClaimSchema),
    defaultValues: { ...defaultAutomateClaimValues },
    mode: "onChange",
  });

  const prefillValues = useCallback(
    (values: Partial<AutomateClaimFormValues>) => {
      form.reset(values, { keepDirty: true });
    },
    [form.reset],
  );

  return { form, prefillValues } as const;
};
