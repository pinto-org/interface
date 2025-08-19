import { Form } from "@/components/Form";
import { useConvertUpV0Form } from "@/components/Tractor/form/schema/convertUp.schema";
import useTractorOperatorAverageTipPaid from "@/state/tractor/useTractorOperatorAverageTipPaid";
import { exists } from "@/utils/utils";
import React, { createContext, useContext, useEffect, useState } from "react";
import { TractorOperatorTipStrategy } from "../form/fields/sharedFields";

export enum ConvertUpTractorOrderFormStep {
  ENTRY = 1,
  REVIEW = 2,
  ADVANCED = 3,
  OPERATOR_TIP = 4,
}

// ------------------------------------------------------------
// Context
// ------------------------------------------------------------

interface IConvertUpOrderFormContext extends ReturnType<typeof useConvertUpV0Form> {
  formStep: ConvertUpTractorOrderFormStep;
  operatorTipPreset: TractorOperatorTipStrategy;
  setOperatorTipPreset: (preset: TractorOperatorTipStrategy) => void;
  setFormStep: (step: ConvertUpTractorOrderFormStep) => void;
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
  const [operatorTipPreset, setOperatorTipPreset] = useState<TractorOperatorTipStrategy>("Normal");

  const form = useConvertUpV0Form();

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

  return (
    <ConvertUpOrderFormContext.Provider
      value={{
        ...form,
        formStep,
        operatorTipPreset,
        setFormStep,
        setOperatorTipPreset,
      }}
    >
      <Form {...form.form}>{children}</Form>
    </ConvertUpOrderFormContext.Provider>
  );
}
