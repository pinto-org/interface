import { Col } from "@/components/Container";
import {
  ConvertUpCustomOperatorTipForm,
  ConvertUpOrderProvider,
  ConvertUpTractorEntryForm,
  ConvertUpTractorReviewController,
  ConvertUpTractorOrderFormStep as FormStep,
  useConvertUpOrderFormContext,
} from "@/components/Tractor/ConvertUp";
import useSowOrderV0Calculations from "@/hooks/tractor/useSowOrderV0Calculations";
import useTractorOperatorAverageTipPaid from "@/state/tractor/useTractorOperatorAverageTipPaid";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { useSiloData } from "@/state/useSiloData";
import { useState } from "react";

// ------------------------------------------------------------
// Interface, Types, Enums
// ------------------------------------------------------------

interface IConvertUpOrderForm {
  onOpenChange: (open: boolean) => void;
}

// ------------------------------------------------------------
// Form
// ------------------------------------------------------------

/**
 * The main form container for creating a Convert Up Tractor order.
 */
export default function ConvertUpOrderForm({ onOpenChange }: IConvertUpOrderForm) {
  return (
    <ConvertUpOrderProvider>
      <ConvertUpOrderFormController onOpenChange={onOpenChange} />
    </ConvertUpOrderProvider>
  );
}

/**
 * The contents of the form.
 */
function ConvertUpOrderFormController({ onOpenChange }: IConvertUpOrderForm) {
  // External hooks
  const { formStep } = useConvertUpOrderFormContext();
  const calculations = useSowOrderV0Calculations();
  const farmerSilo = useFarmerSilo();
  const siloData = useSiloData();
  const { data: averageTipPaid } = useTractorOperatorAverageTipPaid();

  // Local State
  // Whether the advanced fields have been initialized
  const [didInitRestFields, setDidInitRestFields] = useState(false);

  return (
    <Col className="w-full">
      {formStep === FormStep.ENTRY && (
        <ConvertUpTractorEntryForm
          farmerSilo={farmerSilo}
          siloData={siloData}
          calculations={calculations}
          didSetAdvancedFormFields={didInitRestFields}
          setDidSetAdvancedFormFields={setDidInitRestFields}
          handleOpenChange={onOpenChange}
        />
      )}
      {(formStep === FormStep.REVIEW || formStep === FormStep.ADVANCED) && (
        <ConvertUpTractorReviewController averageTipPaid={averageTipPaid ?? 1} />
      )}
    </Col>
  );
}
