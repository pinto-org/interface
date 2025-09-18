import { Form } from "@/components/Form";
import {
  ConvertUpV0FormSchema,
  transformConvertUpFormValues,
  useConvertUpV0Form,
} from "@/components/Tractor/form/schema/convertUp.schema";
import { useGetTractorTokenStrategyWithBlueprint } from "@/hooks/tractor/useGetTractorTokenStrategy";
import { ExtendedTractorTokenStrategy, TractorTokenStrategyUnion } from "@/lib/Tractor";
import { ConvertUpOrderbookEntry } from "@/lib/Tractor/convertUp/tractor-convert-up-types";
import useTractorOperatorAverageTipPaid from "@/state/tractor/useTractorOperatorAverageTipPaid";
import { formatter } from "@/utils/format";
import { exists } from "@/utils/utils";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useChainId } from "wagmi";
import {
  ConvertUpOrderFormContext,
  ConvertUpTractorOrderFormStep,
  ConvertUpV0FormDraftState,
  IConvertUpOrderFormContext,
} from "./ConvertUp/ConvertUpTractorContext";
import { TractorOperatorTipStrategy } from "./form/fields/sharedFields";

// ------------------------------------------------------------
// Context - Extends the base context for modify functionality
// ------------------------------------------------------------

interface IModifyConvertUpOrderFormContext extends IConvertUpOrderFormContext {
  onOrderModified?: () => void;
  existingOrder: ConvertUpOrderbookEntry;
  getStrategyProps: ReturnType<typeof useGetTractorTokenStrategyWithBlueprint>;
}

export const useModifyConvertUpOrderFormContext = () => {
  const context = useContext(ConvertUpOrderFormContext);

  if (!context) {
    throw new Error("useConvertUpOrderFormContext must be used within a ConvertUpOrderForm");
  }
  return context as IModifyConvertUpOrderFormContext;
};

interface Props {
  existingOrder: ConvertUpOrderbookEntry;
  onOpenChange: (open: boolean) => void;
  onOrderModified?: () => void;
  children: React.ReactNode;
}

export default function ModifyConvertUpOrderProvider({
  children,
  existingOrder,
  onOpenChange,
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

  const toggleDraftState = useCallback(
    (val: boolean) => {
      const values = form.form.getValues();

      const transformed = transformConvertUpFormValues(values, chainId);

      const newDraftState = val
        ? {
            ...transformed,
            totalConvertBdv: transformed.totalConvertBdv.tv.toHuman(),
            minConvertBdvPerExecution: transformed.minConvertBdvPerExecution.tv.toHuman(),
            maxConvertBdvPerExecution: transformed.maxConvertBdvPerExecution.tv.toHuman(),
            minTimeBetweenConverts: transformed.minTimeBetweenConverts.tv.toHuman(),
            minConvertBonusCapacity: transformed.minConvertBonusCapacity.tv.toHuman(),
            maxGrownStalkPerBdv: transformed.maxGrownStalkPerBdv.tv.toHuman(),
            minGrownStalkPerBdvBonus: transformed.minGrownStalkPerBdvBonus.tv.toHuman(),
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
    [form.form, chainId],
  );

  // External hooks
  const { data: averageTipPaid } = useTractorOperatorAverageTipPaid();

  // Pre-fill form with existing order data
  const [didPrefill, setDidPrefill] = useState(false);

  useEffect(() => {
    if (didPrefill || getStrategyProps.isLoading || !existingOrder.decodedData) {
      return;
    }

    try {
      const data = existingOrder.decodedData;

      // Check if we have the expected structure
      if (!data.convertUpParams || !data.opParams) {
        console.error("Invalid decoded data structure - missing convertUpParams or opParams:", {
          hasConvertUpParams: !!data.convertUpParams,
          hasOpParams: !!data.opParams,
          data,
        });
        return;
      }
      // Check if sourceTokenIndices exists and is an array
      if (!data.convertUpParams.sourceTokenIndices || !Array.isArray(data.convertUpParams.sourceTokenIndices)) {
        console.error("Invalid sourceTokenIndices:", {
          sourceTokenIndices: data.convertUpParams.sourceTokenIndices,
          isArray: Array.isArray(data.convertUpParams.sourceTokenIndices),
          convertUpParams: data.convertUpParams,
        });
        return;
      }

      let tokenStrategy: ExtendedTractorTokenStrategy | undefined;
      try {
        tokenStrategy = getStrategyProps.getTokenStrategy({
          sourceTokenIndices: existingOrder.decodedData.convertUpParams.sourceTokenIndices,
        });
        console.log("Token strategy:", tokenStrategy);
      } catch (strategyError) {
        console.error("Error getting token strategy:", strategyError);
        tokenStrategy = { type: "LOWEST_SEEDS" as const };
      }

      // Prepare the prefill values - handle TokenValue objects properly
      const prefillValues = {
        tokenStrategy: tokenStrategy ?? { type: "LOWEST_SEEDS" as const },
        totalConvertBdv: data.convertUpParams.totalConvertBdv.toHuman(),
        minConvertBdvPerExecution: data.convertUpParams.minConvertBdvPerExecution.toHuman(),
        maxConvertBdvPerExecution: data.convertUpParams.maxConvertBdvPerExecution.toHuman(),
        minTimeBetweenConverts: data.convertUpParams.minTimeBetweenConverts.toHuman(),
        timeScale: "SECONDS" as const, // Default to seconds, might need to derive this
        minConvertBonusCapacity: data.convertUpParams.minConvertBonusCapacity.toHuman(),
        maxGrownStalkPerBdv: data.convertUpParams.maxGrownStalkPerBdv.toHuman(),
        minGrownStalkPerBdvBonus: data.convertUpParams.minGrownStalkPerBdvBonus.toHuman(),
        maxPriceToConvertUp: data.convertUpParams.maxPriceToConvertUp.toHuman(),
        minPriceToConvertUp: data.convertUpParams.minPriceToConvertUp.toHuman(),
        maxGrownStalkPerBdvPenalty: data.convertUpParams.maxGrownStalkPerBdvPenalty.toHuman(),
        slippageRatio: data.convertUpParams.slippageRatio.toHuman(),
        operatorTip: data.opParams.operatorTipAmount.toHuman(),
        lowStalkDeposits: data.convertUpParams.lowStalkDeposits,
      };

      // Map the decoded data to form schema
      form.prefillValues(prefillValues);
      console.log("Form prefilled successfully");
      setDidPrefill(true);
    } catch (error) {
      console.error("Failed to pre-fill form with existing order data:", error);
    }
  }, [existingOrder, didPrefill, form.prefillValues, getStrategyProps]);

  // Initialize operator tip
  const [didInitOperatorTip, setDidInitOperatorTip] = useState(false);
  useEffect(() => {
    if (!didInitOperatorTip && exists(averageTipPaid) && didPrefill) {
      setDidInitOperatorTip(true);
      // Only set if not already pre-filled from existing order
      const currentTip = form.form.getValues("operatorTip");
      if (!currentTip) {
        form.form.setValue("operatorTip", averageTipPaid.toFixed(2));
      }
    }
  }, [averageTipPaid, form.form.setValue, didInitOperatorTip, didPrefill]);

  const handleSetOperatorTipPreset = useCallback(
    (preset: TractorOperatorTipStrategy) => {
      setOperatorTipPresetState(preset);
    },
    [operatorTipPreset],
  );

  // Create the context value with modify-specific data
  const contextValue: IModifyConvertUpOrderFormContext = {
    ...form,
    formStep,
    operatorTipPreset,
    draftState,
    setDraftState: toggleDraftState,
    setFormStep,
    onOpenChange,
    onOrderModified,
    existingOrder,
    getStrategyProps,
    setOperatorTipPreset: handleSetOperatorTipPreset,
  };

  return (
    <ConvertUpOrderFormContext.Provider value={contextValue}>
      <Form {...form.form}>{children}</Form>
    </ConvertUpOrderFormContext.Provider>
  );
}
