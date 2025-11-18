import { TokenValue } from "@/classes/TokenValue";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { useTokenMap } from "@/hooks/pinto/useTokenMap";
import { Blueprint, TractorTokenStrategy, createBlueprint, createSowTractorData } from "@/lib/Tractor";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { usePodLine } from "@/state/useFieldData";
import { getTokenIndex } from "@/utils/token";
import { Token } from "@/utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useAccount, usePublicClient } from "wagmi";
import { z } from "zod";

import FormUtils from "@/utils/form";

const {
  schema: { tokenStrategy, positiveNumber },
} = FormUtils;

export const sowOrderSchemaErrors = {} as const;

// Custom validation for totalAmount with minimum 0.001
const totalAmountValidation = z
  .string()
  .min(1, "Total Amount is required")
  .refine((val) => {
    const num = parseFloat(val.replace(/,/g, ""));
    return !Number.isNaN(num) && num >= 0.001;
  }, "Total Amount must be at least 0.001");

// Main schema for sow order dialog
export const sowOrderDialogSchema = z.object({
  totalAmount: totalAmountValidation,
  temperature: positiveNumber("Temperature"),
  morningAuction: z.boolean().default(false),
  operatorTip: positiveNumber("Operator Tip"),
  selectedTokenStrategy: tokenStrategy,
});

// Type inference from schema
export type SowOrderV0FormSchema = z.infer<typeof sowOrderDialogSchema>;

// Default values for the form
export const defaultSowOrderDialogValues: Partial<SowOrderV0FormSchema> = {
  totalAmount: "",
  temperature: "",
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
  const form = useForm<SowOrderV0FormSchema>({
    resolver: zodResolver(sowOrderDialogSchema),
    defaultValues: { ...defaultSowOrderDialogValues },
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

    const missingFields = Object.keys(values).filter((key) => {
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
  minSoil: string;
  maxPerSeason: string;
  maxPodLine: string;
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

/**
 * Calculate smart defaults for sow order parameters
 * @param totalAmount - The total amount to sow (as string)
 * @param currentPodLine - The current pod line length (as TokenValue)
 * @returns Object containing calculated default values
 */
export function calculateSmartDefaults(
  totalAmount: string,
  currentPodLine: TokenValue,
): {
  minSoil: string;
  maxPerSeason: string;
  maxPodLine: string;
} {
  const totalAmountNum = parseFloat(totalAmount || "0");

  // Set minSoil to min(totalAmount, 25 PINTO)
  const minSoil = Math.min(totalAmountNum, 25).toString();

  // Set maxPerSeason to totalAmount
  const maxPerSeason = totalAmount;

  // Set maxPodLine to currentPodLine * 2
  const maxPodLine = currentPodLine.mul(2).toHuman();

  return {
    minSoil,
    maxPerSeason,
    maxPodLine,
  };
}

export const useSowOrderV0State = () => {
  const client = usePublicClient();
  const { address } = useAccount();
  const protocolAddress = useProtocolAddress();

  const tokenMap = useTokenMap();
  const podLine = usePodLine();

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

        // Calculate smart defaults
        const smartDefaults = calculateSmartDefaults(formData.totalAmount, podLine);

        const { data, operatorPasteInstrs, rawCall, depositOptimizationCalls } = await createSowTractorData({
          totalAmountToSow: formData.totalAmount,
          temperature: formData.temperature,
          minAmountPerSeason: smartDefaults.minSoil,
          maxAmountToSowPerSeason: smartDefaults.maxPerSeason,
          maxPodlineLength: smartDefaults.maxPodLine,
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
          minSoil: smartDefaults.minSoil || "",
          maxPerSeason: smartDefaults.maxPerSeason || "",
          maxPodLine: smartDefaults.maxPodLine || "",
          temperature: formData.temperature || "",
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
    [client, address, protocolAddress, tokenMap, podLine],
  );

  return {
    state,
    orderData,
    isLoading,
    handleCreateBlueprint,
  } as const;
};
