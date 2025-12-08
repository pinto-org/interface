import { TokenValue } from "@/classes/TokenValue";
import { MAIN_TOKEN } from "@/constants/tokens";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { useTokenMap } from "@/hooks/pinto/useTokenMap";
import { Blueprint, TractorTokenStrategy, createBlueprint, createSowTractorData } from "@/lib/Tractor";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { useChainConstant } from "@/utils/chain";
import { getTokenIndex } from "@/utils/token";
import { Token } from "@/utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useAccount, usePublicClient } from "wagmi";
import { z } from "zod";

import FormUtils from "@/utils/form";

const {
  schema: { tokenStrategy, positiveNumber },
  validate: { lte },
} = FormUtils;

export const sowOrderSchemaErrors = {
  minLteMax: "Min per Season cannot exceed Max per Season",
  minLteTotal: "Min per Season cannot exceed the total amount to Sow",
  maxLteTotal: "Max per Season cannot exceed the total amount to Sow",
} as const;

// Main schema for sow order dialog
export const sowOrderDialogSchema = z.object({
  totalAmount: positiveNumber("Total Amount"),
  minSoil: positiveNumber("Min per Season"),
  maxPerSeason: positiveNumber("Max per Season"),
  temperature: positiveNumber("Temperature"),
  podLineLength: positiveNumber("Pod Line Length"),
  morningAuction: z.boolean().default(false),
  operatorTip: positiveNumber("Operator Tip"),
  customOperatorTip: z.string().optional(),
  selectedTokenStrategy: tokenStrategy,
});

// Validation helper for advanced form
export const validateAdvancedFormFields = (
  data: {
    minSoil: string;
    maxPerSeason: string;
    totalAmount: string;
  },
  form: ReturnType<typeof useForm<SowOrderV0FormSchema>>,
): { isValid: boolean; errors: string[] } => {
  let hasErrors = false;
  const minSoilErrors: string[] = [];
  const maxPerSeasonErrors: string[] = [];
  const allErrors: string[] = [];

  // Cross-field validation: minSoil <= maxPerSeason
  if (!lte(data.minSoil, data.maxPerSeason, 6, 6)) {
    minSoilErrors.push(sowOrderSchemaErrors.minLteMax);
    maxPerSeasonErrors.push(sowOrderSchemaErrors.minLteMax);
    allErrors.push(sowOrderSchemaErrors.minLteMax);
    hasErrors = true;
  }

  // Cross-field validation: minSoil <= totalAmount
  if (!lte(data.minSoil, data.totalAmount, 6, 6)) {
    minSoilErrors.push(sowOrderSchemaErrors.minLteTotal);
    allErrors.push(sowOrderSchemaErrors.minLteTotal);
    hasErrors = true;
  }

  // Cross-field validation: maxPerSeason <= totalAmount
  if (!lte(data.maxPerSeason, data.totalAmount, 6, 6)) {
    maxPerSeasonErrors.push(sowOrderSchemaErrors.maxLteTotal);
    allErrors.push(sowOrderSchemaErrors.maxLteTotal);
    hasErrors = true;
  }

  // Set errors (show first error message for each field)
  if (minSoilErrors.length > 0) {
    form.setError("minSoil", {
      type: "manual",
      message: minSoilErrors[0],
    });
  } else {
    // Clear errors if validation passes
    const currentError = form.formState.errors.minSoil?.message;
    if (currentError === sowOrderSchemaErrors.minLteMax || currentError === sowOrderSchemaErrors.minLteTotal) {
      form.clearErrors("minSoil");
    }
  }

  if (maxPerSeasonErrors.length > 0) {
    form.setError("maxPerSeason", {
      type: "manual",
      message: maxPerSeasonErrors[0],
    });
  } else {
    // Clear errors if validation passes
    const currentError = form.formState.errors.maxPerSeason?.message;
    if (currentError === sowOrderSchemaErrors.minLteMax || currentError === sowOrderSchemaErrors.maxLteTotal) {
      form.clearErrors("maxPerSeason");
    }
  }

  // Remove duplicates from errors
  const uniqueErrors = Array.from(new Set(allErrors));

  return { isValid: !hasErrors, errors: uniqueErrors };
};

// Type inference from schema
export type SowOrderV0FormSchema = z.infer<typeof sowOrderDialogSchema>;

// Default values for the form
export const defaultSowOrderDialogValues: Partial<SowOrderV0FormSchema> = {
  totalAmount: "",
  minSoil: "",
  maxPerSeason: "",
  temperature: "",
  podLineLength: "",
  morningAuction: false,
  operatorTip: "1",
  selectedTokenStrategy: { type: "LOWEST_SEEDS" },
};

export type SowOrderV0Form = {
  form: ReturnType<typeof useForm<SowOrderV0FormSchema>>;
  prefillValues: (prefillValues: Partial<SowOrderV0FormSchema>) => void;
  getAreAllFieldsFilled: () => boolean;
  getAreAllFieldsValid: () => boolean;
  getMissingFields: () => string[];
};

export const useSowOrderV0Form = (): SowOrderV0Form => {
  const mainToken = useChainConstant(MAIN_TOKEN);

  const defaultValues = useMemo(
    () => ({
      ...defaultSowOrderDialogValues,
      selectedTokenStrategy: {
        type: "SPECIFIC_TOKEN" as const,
        addresses: [mainToken.address as `0x${string}`],
      },
    }),
    [mainToken.address],
  );

  const form = useForm<SowOrderV0FormSchema>({
    resolver: zodResolver(sowOrderDialogSchema),
    defaultValues,
    mode: "onChange",
  });

  const prefillValues = useCallback(
    (prefillValues: Partial<SowOrderV0FormSchema>) => {
      form.reset(prefillValues, { keepDirty: true });
    },
    [form.reset],
  );

  const getAreAllFieldsFilled = useCallback(() => {
    return Object.values(form.getValues()).every((v) => {
      if (typeof v === "string") return Boolean(v.trim());
      return true;
    });
  }, [form.getValues]);

  const getAreAllFieldsValid = useCallback(() => {
    return Object.values(form.formState.errors).every((value) => !value) && getAreAllFieldsFilled();
  }, [form.formState.errors, getAreAllFieldsFilled]);

  const getMissingFields = useCallback(() => {
    const values = form.getValues();

    // Fields that are auto-populated and shouldn't be shown as missing
    const autoPopulatedFields = ["minSoil", "maxPerSeason", "podLineLength"];

    const missingFields = Object.keys(values).filter((key) => {
      // Skip auto-populated fields
      if (autoPopulatedFields.includes(key)) {
        return false;
      }

      const value = values[key as keyof SowOrderV0FormSchema];
      if (typeof value === "string") {
        return value.trim() === "";
      }
      if (typeof value !== "boolean") {
      } else if (typeof value === "object" && value !== null) {
        return Object.values(value).every((v) => v === "");
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

export type SowV0FormOrderData = {
  totalAmount: string;
  temperature: string;
  podLineLength: string;
  minSoil: string;
  maxPerSeason: string;
  operatorTip: string;
  morningAuction: boolean;
  tokenStrategy: TractorTokenStrategy["type"];
  token: Token | undefined;
};

export type SowOrderV0State = {
  blueprint: Blueprint;
  encodedData: `0x${string}`;
  operatorPasteInstructions: `0x${string}`[];
  depositOptimizationCalls: `0x${string}`[];
};

export const useSowOrderV0State = () => {
  const client = usePublicClient();
  const { address } = useAccount();
  const protocolAddress = useProtocolAddress();

  const tokenMap = useTokenMap();

  const [state, setState] = useState<SowOrderV0State | undefined>(undefined);
  const [orderData, setOrderData] = useState<SowV0FormOrderData | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateBlueprint = useCallback(
    async (
      form: ReturnType<typeof useForm<SowOrderV0FormSchema>>,
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

        const { data, operatorPasteInstrs, rawCall, depositOptimizationCalls } = await createSowTractorData({
          totalAmountToSow: formData.totalAmount,
          temperature: formData.temperature,
          minAmountPerSeason: formData.minSoil,
          maxAmountToSowPerSeason: formData.maxPerSeason,
          maxPodlineLength: formData.podLineLength,
          maxGrownStalkPerBdv: "10000000000000000",
          runBlocksAfterSunrise: formData.morningAuction ? "0" : "300",
          operatorTip: formData.operatorTip,
          whitelistedOperators: [],
          tokenStrategy: formData.selectedTokenStrategy as TractorTokenStrategy,
          publicClient: client,
          farmerDeposits: deposits,
          userAddress: deposits ? address : undefined,
          protocolAddress: deposits ? protocolAddress : undefined,
        });

        const newBlueprint = createBlueprint({
          publisher: address,
          data,
          operatorPasteInstrs,
          maxNonce: TokenValue.MAX_UINT256.toBigInt(),
        });

        const tokenInstance =
          formData.selectedTokenStrategy?.type === "SPECIFIC_TOKEN"
            ? tokenMap[getTokenIndex(formData.selectedTokenStrategy.addresses?.[0] ?? "")]
            : undefined;

        setOrderData({
          totalAmount: formData.totalAmount || "",
          minSoil: formData.minSoil || "",
          maxPerSeason: formData.maxPerSeason || "",
          temperature: formData.temperature || "",
          podLineLength: formData.podLineLength || "",
          morningAuction: formData.morningAuction || false,
          tokenStrategy: formData.selectedTokenStrategy.type,
          token: tokenInstance,
          operatorTip: formData.operatorTip || "",
        });

        setState({
          blueprint: newBlueprint,
          encodedData: rawCall,
          operatorPasteInstructions: operatorPasteInstrs,
          depositOptimizationCalls: depositOptimizationCalls ?? [],
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
