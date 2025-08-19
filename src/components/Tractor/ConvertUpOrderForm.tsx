import { Col } from "@/components/Container";
import {
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

/**
 * Form Flow
 *
 * Entry Form
 *   - Back: Close the form
 *   - Review
 *       1. Validate Entry Form fields. Do nothing if the fields are invalid.
 *       2. Infer the advanced paramters fields & set 'didInitRestFields' to true.
 *       3. Set the form step to Review.
 *
 * Review Controller
 *   - Back: Set the form step to Entry.
 *   - Submit:
 *   - Advanced:
 *      - Back:
 *          - Revert all changes to the previous state from before the advanced field was open
 *          - Go back to Review
 *      - Save Changes
 *          - Go back to Review
 *   - Custom Operator Tip:
 *      - Back:
 *          - Revert to previous operator tip preset
 *          - Go back to Review
 *      - Save Changes:
 *          - Go back to Review
 *
 *
 */

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

const REVIEW_STEPS = new Set([FormStep.REVIEW, FormStep.ADVANCED, FormStep.OPERATOR_TIP]);

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
      {REVIEW_STEPS.has(formStep) && <ConvertUpTractorReviewController averageTipPaid={averageTipPaid ?? 1} />}
    </Col>
  );
}
