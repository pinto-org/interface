import { TV } from "@/classes/TokenValue";
import { Form } from "@/components/Form";
import {
  ConvertUpV0FormSchema,
  transformConvertUpFormValues,
  useConvertUpV0Form,
} from "@/components/Tractor/form/schema/convertUp.schema";
import { useGetTractorTokenStrategyWithBlueprint } from "@/hooks/tractor/useGetTractorTokenStrategy";
import { ConvertUpOrderbookEntry } from "@/lib/Tractor/convertUp/tractor-convert-up-types";
import { ExtendedTractorTokenStrategy } from "@/lib/Tractor/types";
import useTractorOperatorAverageTipPaid from "@/state/tractor/useTractorOperatorAverageTipPaid";
import { exists } from "@/utils/utils";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useChainId } from "wagmi";
import { TractorOperatorTipStrategy } from "../form/fields/sharedFields";

export enum ConvertUpTractorOrderFormStep {
  ENTRY = 1,
  REVIEW = 2,
  ADVANCED = 3,
  OPERATOR_TIP = 4,
}

export interface ConvertUpV0FormDraftState {
  isActive: boolean;
  originalValues: ConvertUpV0FormSchema | null;
}

// ------------------------------------------------------------
// Context
// ------------------------------------------------------------

export interface IConvertUpOrderFormContext extends ReturnType<typeof useConvertUpV0Form> {
  formStep: ConvertUpTractorOrderFormStep;
  operatorTipPreset: TractorOperatorTipStrategy;
  setOperatorTipPreset: (preset: TractorOperatorTipStrategy) => void;
  setFormStep: (step: ConvertUpTractorOrderFormStep) => void;
  draftState: ConvertUpV0FormDraftState;
  setDraftState: (val: boolean) => void;
  onOpenChange: (open: boolean) => void;
  disallowCloseForm: boolean;

  // Optional fields for modify mode
  mode?: "create" | "modify";
  existingOrder?: ConvertUpOrderbookEntry;
  onOrderModified?: () => void;
  getStrategyProps?: ReturnType<typeof useGetTractorTokenStrategyWithBlueprint>;
}

export const ConvertUpOrderFormContext = createContext<IConvertUpOrderFormContext | null>(null);

export const useConvertUpOrderFormContext = () => {
  const context = useContext(ConvertUpOrderFormContext);

  if (!context) {
    throw new Error("useConvertUpOrderFormContext must be used within a ConvertUpOrderForm");
  }
  return context;
};

interface Props {
  onOpenChange: (open: boolean) => void;
  disallowCloseForm?: boolean;
  children: React.ReactNode;

  // Optional props for modify mode
  mode?: "create" | "modify";
  existingOrder?: ConvertUpOrderbookEntry;
  onOrderModified?: () => void;
}

export default function ConvertUpOrderProvider({
  children,
  onOpenChange,
  disallowCloseForm = false,
  mode = "create",
  existingOrder,
  onOrderModified,
}: Props) {
  const [formStep, setFormStep] = useState(ConvertUpTractorOrderFormStep.ENTRY);
  const chainId = useChainId();

  // Simplified operator tip state management
  const [operatorTipPreset, setOperatorTipPresetState] = useState<TractorOperatorTipStrategy>("Normal");
  const [draftState, setDraftState] = useState<ConvertUpV0FormDraftState>({
    isActive: false,
    originalValues: null,
  });

  const form = useConvertUpV0Form();
  const getStrategyProps = useGetTractorTokenStrategyWithBlueprint();
  const { data: averageTipPaid } = useTractorOperatorAverageTipPaid();

  /**
   * Manages the draft state of the form, allowing preservation of form values
   * when switching between views or comparing against original values.
   *
   * @param val - true to activate draft mode (saves current form state), false to deactivate
   *
   * When activated:
   * - Captures current form values
   * - Transforms them to their final format via transformConvertUpFormValues
   * - Converts all numeric TokenValue fields to human-readable strings
   * - Stores this snapshot as originalValues for later reference
   *
   * Common usage scenarios:
   * - Preserving form state when navigating to advanced settings
   * - Comparing current values against a saved baseline
   * - Restoring form to a previous state after cancellation
   */
  const toggleDraftState = useCallback(
    (val: boolean) => {
      const values = form.form.getValues();

      const transformed = transformConvertUpFormValues(values, chainId);

      const newDraftState = val
        ? {
            ...transformed,
            totalBeanAmountToConvert: transformed.totalBeanAmountToConvert.tv.toHuman(),
            minBeansConvertPerExecution: transformed.minBeansConvertPerExecution.tv.toHuman(),
            maxBeansConvertPerExecution: transformed.maxBeansConvertPerExecution.tv.toHuman(),
            minTimeBetweenConverts: transformed.minTimeBetweenConverts.tv.toHuman(),
            minConvertBonusCapacity: transformed.minConvertBonusCapacity.tv.toHuman(),
            maxGrownStalkPerBdv: transformed.maxGrownStalkPerBdv.tv.toHuman(),
            grownStalkPerBdvBonusBid: transformed.grownStalkPerBdvBonusBid.tv.toHuman(),
            seedDifference: transformed.seedDifference.tv.toHuman(),
            maxPriceToConvertUp: transformed.maxPriceToConvertUp.tv.toHuman(),
            minPriceToConvertUp: transformed.minPriceToConvertUp.tv.toHuman(),
            maxGrownStalkPerBdvPenalty: transformed.maxGrownStalkPerBdvPenalty.tv.toHuman(),
            slippageRatio: transformed.slippageRatio.tv.toHuman(),
            operatorTip: transformed.operatorTip.tv.toHuman(),
            customOperatorTip: transformed.customOperatorTip?.nonAmount
              ? ""
              : transformed.customOperatorTip?.tv.toHuman() ?? "",
          }
        : null;

      setDraftState({ isActive: val, originalValues: newDraftState });
    },
    [form.form],
  );

  // External hooks
  // const { data: averageTipPaid } = useTractorOperatorAverageTipPaid();

  // Pre-fill form with existing order data (modify mode only)
  const [didPrefill, setDidPrefill] = useState(false);
  useEffect(() => {
    if (mode !== "modify" || !existingOrder || didPrefill || getStrategyProps.isLoading || !existingOrder.decodedData) {
      return;
    }

    try {
      const data = existingOrder.decodedData;

      if (!data.convertUpParams || !data.opParams) {
        console.error("Invalid decoded data structure:", data);
        return;
      }

      if (!data.convertUpParams.sourceTokenIndices || !Array.isArray(data.convertUpParams.sourceTokenIndices)) {
        console.error("Invalid sourceTokenIndices:", data.convertUpParams);
        return;
      }

      let tokenStrategy: ExtendedTractorTokenStrategy | undefined;
      try {
        tokenStrategy = getStrategyProps.getTokenStrategy({
          sourceTokenIndices: data.convertUpParams.sourceTokenIndices,
        });
      } catch (strategyError) {
        console.error("Error getting token strategy:", strategyError);
        tokenStrategy = { type: "LOWEST_SEEDS" as const };
      }

      const seedDiff = data.convertUpParams.seedDifference;
      const checkSeedDifference = !seedDiff.eq(TV.fromBigInt(1n, seedDiff.decimals));

      const prefillValues = {
        tokenStrategy: tokenStrategy ?? { type: "LOWEST_SEEDS" as const },
        capAmountToBonusCapacity: data.convertUpParams.capAmountToBonusCapacity,
        totalBeanAmountToConvert: data.convertUpParams.totalBeanAmountToConvert.toHuman(),
        minBeansConvertPerExecution: data.convertUpParams.minBeansConvertPerExecution.toHuman(),
        maxBeansConvertPerExecution: data.convertUpParams.maxBeansConvertPerExecution.toHuman(),
        minTimeBetweenConverts: data.convertUpParams.minTimeBetweenConverts.toHuman(),
        timeScale: "SECONDS" as const,
        minConvertBonusCapacity: data.convertUpParams.minConvertBonusCapacity.toHuman(),
        maxGrownStalkPerBdv: data.convertUpParams.maxGrownStalkPerBdv.toHuman(),
        grownStalkPerBdvBonusBid: data.convertUpParams.grownStalkPerBdvBonusBid.toHuman(),
        maxPriceToConvertUp: data.convertUpParams.maxPriceToConvertUp.toHuman(),
        minPriceToConvertUp: data.convertUpParams.minPriceToConvertUp.toHuman(),
        maxGrownStalkPerBdvPenalty: data.convertUpParams.maxGrownStalkPerBdvPenalty.toHuman(),
        seedDifference: seedDiff.toHuman(),
        seedDifferenceCheck: checkSeedDifference,
        slippageRatio: data.convertUpParams.slippageRatio.toHuman(),
        operatorTip: data.opParams.operatorTipAmount.toHuman(),
        lowStalkDeposits: data.convertUpParams.lowStalkDeposits,
      };

      form.prefillValues(prefillValues);
      setDidPrefill(true);
    } catch (error) {
      console.error("Failed to pre-fill form:", error);
    }
  }, [mode, existingOrder, didPrefill, form.prefillValues, getStrategyProps]);

  const handleSetOperatorTipPreset = useCallback(
    (preset: TractorOperatorTipStrategy) => {
      setOperatorTipPresetState(preset);
    },
    [operatorTipPreset],
  );

  const [didSetOperatorTipPreset, setDidSetOperatorTipPreset] = useState(false);

  useEffect(() => {
    if (didSetOperatorTipPreset) {
      return;
    }

    if (averageTipPaid) {
      setDidSetOperatorTipPreset(true);
      form.form.setValue("operatorTip", averageTipPaid.toFixed(2));
    }
  }, [didSetOperatorTipPreset, averageTipPaid]);

  return (
    <ConvertUpOrderFormContext.Provider
      value={{
        ...form,
        formStep,
        operatorTipPreset,
        draftState,
        disallowCloseForm: !!disallowCloseForm,
        setDraftState: toggleDraftState,
        setFormStep,
        onOpenChange,
        setOperatorTipPreset: handleSetOperatorTipPreset,
        getStrategyProps,

        // Include mode-specific fields
        mode,
        ...(mode === "modify" && {
          existingOrder,
          onOrderModified,
        }),
      }}
    >
      <Form {...form.form}>{children}</Form>
    </ConvertUpOrderFormContext.Provider>
  );
}
