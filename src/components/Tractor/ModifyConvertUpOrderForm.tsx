import { Col } from "@/components/Container";
import { ConvertUpTractorEntryForm, ConvertUpTractorOrderFormStep as FormStep } from "@/components/Tractor/ConvertUp";
import useSowOrderV0Calculations from "@/hooks/tractor/useSowOrderV0Calculations";
import { ConvertUpOrderbookEntry } from "@/lib/Tractor/convertUp/tractor-convert-up-types";
import useTractorOperatorAverageTipPaid from "@/state/tractor/useTractorOperatorAverageTipPaid";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { useSiloData } from "@/state/useSiloData";
import { useState } from "react";
import { useConvertUpOrderFormContext } from "./ConvertUp/ConvertUpTractorContext";
import ModifyConvertUpOrderProvider from "./ModifyConvertUpOrderContext";
import { ModifyConvertUpTractorReviewController } from "./ModifyConvertUpTractorReviewController";

/**
 * Form Flow for Modify Convert Up Order
 *
 * Entry Form
 *   - Back: Close the form
 *   - Review
 *       1. Validate Entry Form fields. Do nothing if the fields are invalid.
 *       2. Infer the advanced parameters fields & set 'didInitRestFields' to true.
 *       3. Set the form step to Review.
 *
 * Review Controller
 *   - Back: Set the form step to Entry.
 *   - Submit: Execute modify operation (cancel old + create new)
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
 */

interface IModifyConvertUpOrderForm {
  existingOrder: ConvertUpOrderbookEntry;
  onOpenChange: (open: boolean) => void;
  onOrderModified?: () => void;
}

// ------------------------------------------------------------
// Form
// ------------------------------------------------------------

/**
 * The main form container for modifying a Convert Up Tractor order.
 */
export default function ModifyConvertUpOrderForm({
  existingOrder,
  onOpenChange,
  onOrderModified,
}: IModifyConvertUpOrderForm) {
  return (
    <ModifyConvertUpOrderProvider
      existingOrder={existingOrder}
      onOpenChange={onOpenChange}
      onOrderModified={onOrderModified}
    >
      <ModifyConvertUpOrderFormController />
    </ModifyConvertUpOrderProvider>
  );
}

const REVIEW_STEPS = new Set([FormStep.REVIEW, FormStep.ADVANCED, FormStep.OPERATOR_TIP]);

/**
 * The contents of the form.
 */
function ModifyConvertUpOrderFormController() {
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
        />
      )}
      {REVIEW_STEPS.has(formStep) && (
        <ModifyConvertUpTractorReviewController didInitAdv={didInitRestFields} averageTipPaid={averageTipPaid ?? 1} />
      )}
    </Col>
  );
}
