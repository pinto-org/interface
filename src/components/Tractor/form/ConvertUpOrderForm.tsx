import { Col, Row } from "@/components/Container";
import { Form } from "@/components/Form";
import TooltipSimple from "@/components/TooltipSimple";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { Separator } from "@/components/ui/Separator";
import useSowOrderV0Calculations from "@/hooks/tractor/useSowOrderV0Calculations";
import {
  extractAddressesFromTokenStrategy,
  isDynamicTractorTokenStrategy,
  isTractorTokenStrategy,
} from "@/lib/Tractor";
import { TractorTokenStrategy } from "@/lib/Tractor/types";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { useSiloData } from "@/state/useSiloData";
import { createContext, useCallback, useContext, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import TractorTokenStrategyDialog from "../TractorTokenStrategyDialog";
import Fields from "./fields/ConvertUpOrderV0Fields";
import { TokenStrategyFormField } from "./fields/sharedFields";
import { ConvertUpV0FormSchema, useConvertUpV0Form } from "./schema/convertUp.schema";

interface IConvertUpOrderForm {
  onOpenChange: (open: boolean) => void;
}

enum FormStep {
  ENTRY = 1,
  REVIEW = 2,
  ADVANCED = 3,
}

// ------------------------------------------------------------
// Context
// ------------------------------------------------------------

interface IConvertUpOrderFormContext extends ReturnType<typeof useConvertUpV0Form> {
  formStep: FormStep;
  setFormStep: (step: FormStep) => void;
}

const ConvertUpOrderFormContext = createContext<IConvertUpOrderFormContext | null>(null);

const useConvertUpOrderFormContext = () => {
  const context = useContext(ConvertUpOrderFormContext);

  if (!context) {
    throw new Error("useConvertUpOrderFormContext must be used within a ConvertUpOrderForm");
  }
  return context;
};

// ------------------------------------------------------------
// Form
// ------------------------------------------------------------

/**
 * The main form container for creating a Convert Up Tractor order.
 */
export default function ConvertUpOrderForm({ onOpenChange }: IConvertUpOrderForm) {
  const [formStep, setFormStep] = useState(FormStep.ENTRY);
  const form = useConvertUpV0Form();

  const handleSetFormStep = useCallback((step: FormStep) => {
    setFormStep(step);
  }, []);

  return (
    <ConvertUpOrderFormContext.Provider value={{ ...form, formStep, setFormStep: handleSetFormStep }}>
      <Form {...form.form}>
        <ConvertUpOrderFormController onOpenChange={onOpenChange} />
      </Form>
    </ConvertUpOrderFormContext.Provider>
  );
}

// ------------------------------------------------------------
// Form Controller
// ------------------------------------------------------------

/**
 * The contents of the form.
 */
function ConvertUpOrderFormController({ onOpenChange }: IConvertUpOrderForm) {
  const { formStep, setFormStep } = useConvertUpOrderFormContext();
  const calculations = useSowOrderV0Calculations();
  const farmerSilo = useFarmerSilo();
  const siloData = useSiloData();

  const handleBack = (e: React.MouseEvent<HTMLButtonElement>) => {
    // prevent default to avoid form submission
    e.preventDefault();
    onOpenChange(false);
  };

  const handleNext = (e: React.MouseEvent<HTMLButtonElement>) => {
    // prevent default to avoid form submission
    e.preventDefault();

    if (formStep === FormStep.ENTRY) {
      setFormStep(FormStep.REVIEW);
      return;
    }
  };

  const isLoading = false;

  return (
    <>
      <Col className="w-full gap-6">
        <div className="form-contents">
          {formStep === FormStep.ENTRY && (
            <FormEntry farmerSilo={farmerSilo} siloData={siloData} calculations={calculations} />
          )}
        </div>
        <Row className="gap-6 w-full flex-1">
          <Button
            variant="outline"
            size="xlargest"
            rounded="full"
            className="w-full flex-1 text-pinto-light bg-pinto-gray-1"
            onClick={handleBack}
            type="button"
          >
            ← Back
          </Button>
          <Button
            size="xlargest"
            rounded="full"
            className={`w-full flex-1 ${isLoading ? "bg-pinto-gray-2 text-pinto-light" : "bg-pinto-green-4 text-white"}`}
            // disabled={nextDisabled}
            onClick={handleNext}
            type="button"
          >
            {formStep === FormStep.ENTRY ? "Review" : "Next"}
          </Button>
        </Row>
      </Col>
    </>
  );
}

/**
 * ------------------------------------------------------------
 * Form Components
 * ------------------------------------------------------------
 */

/**
 * The entry form for the Convert Up Order
 */
const FormEntry = ({
  farmerSilo,
  siloData,
  calculations,
}: {
  farmerSilo: ReturnType<typeof useFarmerSilo>;
  siloData: ReturnType<typeof useSiloData>;
  calculations: ReturnType<typeof useSowOrderV0Calculations>;
}) => {
  const [showTokenStrategyDialog, setShowTokenStrategyDialog] = useState(false);

  return (
    <>
      <Col className="gap-6">
        <FormTitle title="🚜 Automated Convert Parameters" />
        <Col className="w-full gap-5">
          <>
            <Fields.TotalConvertBdv />
            <TokenStrategyFormField
              openDialog={() => setShowTokenStrategyDialog(true)}
              label="Convert using"
              tooltipText="Select the token(s) you want to convert from."
            />
            <Fields.PriceRange />
            <Col className="gap-3">
              <Fields.MinGrownStalkPerBdvBonus />
              <EstimatedSeasonsOfGrownStalk siloData={siloData} />
            </Col>
          </>
        </Col>
      </Col>
      {showTokenStrategyDialog && (
        <TokenStrategyDialog
          open={showTokenStrategyDialog}
          onOpenChange={setShowTokenStrategyDialog}
          farmerDeposits={farmerSilo.deposits}
          calculations={calculations}
        />
      )}
    </>
  );
};

/**
 * The Review form for the Convert Up Order
 */

const FormReview = () => {
  return (
    <Col className="gap-6">
      <FormTitle title="🚜 Automated Convert Parameters" />
    </Col>
  );
};

/**
 * The title of the form.
 */
const FormTitle = ({ title }: { title: string }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="pinto-body font-medium text-pinto-secondary mb-4">{title}</div>
      <Separator className="h-[1px] w-full bg-pinto-gray-2" />
    </div>
  );
};

/**
 * Isolated component that displays the estimated number of seasons of grown stalk that will be gained
 * given the current form values.
 */
const EstimatedSeasonsOfGrownStalk = ({ siloData }: { siloData: ReturnType<typeof useSiloData> }) => {
  const { form } = useConvertUpOrderFormContext();

  const value = useWatch({
    control: form.control,
    name: "minGrownStalkPerBdvBonus",
  });

  const tokenStrategies = useWatch({
    control: form.control,
    name: "tokenStrategy",
  });

  const approxGrownStalk = 0;

  return (
    <Row className="w-full justify-between">
      <Row className="gap-1 items-center">
        <Label variant="form">Approximate Seasons of Grown Stalk Gained</Label>
        <TooltipSimple
          content="The approximate number of seasons of Grown Stalk that will be gained."
          variant="outlined"
        />
      </Row>
      <div className="pinto-sm-light text-pinto-green-4">~ {approxGrownStalk} TODO</div>
    </Row>
  );
};

// ------------------------------------------------------------
// Dialogs
// ------------------------------------------------------------

/**
 * Form Context specific dialog that allows the user to select the token strategy for the Convert Up Order.
 */
const TokenStrategyDialog = ({
  open,
  onOpenChange,
  farmerDeposits,
  calculations,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  farmerDeposits: ReturnType<typeof useFarmerSilo>["deposits"];
  calculations: ReturnType<typeof useSowOrderV0Calculations>;
}) => {
  const ctx = useFormContext<ConvertUpV0FormSchema>();

  const selected = useWatch({
    control: ctx.control,
    name: "tokenStrategy",
  });

  // Memoize the callback to prevent recreating on every render
  const handleTokenStrategySelected = useCallback(
    (newStrategy: TractorTokenStrategy) => {
      ctx.setValue("tokenStrategy", newStrategy);
      isDynamicTractorTokenStrategy(newStrategy) && onOpenChange(false);
    },
    [ctx],
  );

  if (!isTractorTokenStrategy(selected)) {
    return null;
  }

  return (
    <TractorTokenStrategyDialog
      open={open}
      selectedTokenStrategy={selected}
      onOpenChange={onOpenChange}
      onTokenStrategySelected={handleTokenStrategySelected}
      farmerDeposits={farmerDeposits}
      multiSelect
      {...calculations}
    />
  );
};
