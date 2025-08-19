import { Form } from "@/components/Form";
import { ConvertUpV0FormSchema, useConvertUpV0Form } from "@/components/Tractor/form/schema/convertUp.schema";
import useTractorOperatorAverageTipPaid from "@/state/tractor/useTractorOperatorAverageTipPaid";
import { exists } from "@/utils/utils";
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
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

interface IConvertUpOrderFormContext extends ReturnType<typeof useConvertUpV0Form> {
  formStep: ConvertUpTractorOrderFormStep;
  operatorTipPreset: TractorOperatorTipStrategy;
  setOperatorTipPreset: (preset: TractorOperatorTipStrategy) => void;
  setFormStep: (step: ConvertUpTractorOrderFormStep) => void;
  draftState: ConvertUpV0FormDraftState;
  setDraftState: (val: boolean) => void;
}

const ConvertUpOrderFormContext = createContext<IConvertUpOrderFormContext | null>(null);

export const useConvertUpOrderFormContext = () => {
  const context = useContext(ConvertUpOrderFormContext);

  if (!context) {
    throw new Error("useConvertUpOrderFormContext must be used within a ConvertUpOrderForm");
  }
  return context;
};

interface Props {
  children: React.ReactNode;
}

export default function ConvertUpOrderProvider({ children }: Props) {
  const [formStep, setFormStep] = useState(ConvertUpTractorOrderFormStep.ENTRY);

  // Simplified operator tip state management
  const [operatorTipPreset, setOperatorTipPresetState] = useState<TractorOperatorTipStrategy>("Normal");
  const [draftState, setDraftState] = useState<ConvertUpV0FormDraftState>({
    isActive: false,
    originalValues: null,
  });

  const form = useConvertUpV0Form();

  const toggleDraftState = useCallback(
    (val: boolean) => {
      const args = {
        isActive: val,
        originalValues: val ? form.form.getValues() : null,
      };
      setDraftState(args);
    },
    [form.form],
  );

  // External hooks
  const { data: averageTipPaid } = useTractorOperatorAverageTipPaid();

  // Initialize operator tip
  const [didInitOperatorTip, setDidInitOperatorTip] = useState(false);
  useEffect(() => {
    if (!didInitOperatorTip && exists(averageTipPaid)) {
      setDidInitOperatorTip(true);
      form.form.setValue("operatorTip", averageTipPaid.toFixed(2));
    }
  }, [averageTipPaid, form.form.setValue, didInitOperatorTip]);

  const handleSetOperatorTipPreset = useCallback(
    (preset: TractorOperatorTipStrategy) => {
      setOperatorTipPresetState(preset);
    },
    [operatorTipPreset],
  );

  return (
    <ConvertUpOrderFormContext.Provider
      value={{
        ...form,
        formStep,
        operatorTipPreset,
        draftState,
        setDraftState: toggleDraftState,
        setFormStep,
        setOperatorTipPreset: handleSetOperatorTipPreset,
      }}
    >
      <Form {...form.form}>{children}</Form>
    </ConvertUpOrderFormContext.Provider>
  );
}
