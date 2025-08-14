import { TV } from "@/classes/TokenValue";
import { Col, Row } from "@/components/Container";
import { Form } from "@/components/Form";
import TooltipSimple from "@/components/TooltipSimple";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import IconImage from "@/components/ui/IconImage";
import { Label } from "@/components/ui/Label";
import { Separator } from "@/components/ui/Separator";
import { STALK } from "@/constants/internalTokens";
import { useTokenMap } from "@/hooks/pinto/useTokenMap";
import useSowOrderV0Calculations from "@/hooks/tractor/useSowOrderV0Calculations";
import {
  tractorTokenStrategyUtil as StrategyUtil,
  isDynamicTractorTokenStrategy,
  isTractorTokenStrategy,
} from "@/lib/Tractor";
import { TractorTokenStrategy } from "@/lib/Tractor/types";
import useTractorOperatorAverageTipPaid from "@/state/tractor/useTractorOperatorAverageTipPaid";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { useSiloData } from "@/state/useSiloData";
import { useMainToken } from "@/state/useTokenData";
import { getTokenIndex } from "@/utils/token";
import { AnimatePresence, motion } from "framer-motion";
import { createContext, useCallback, useContext, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import TractorTokenStrategyDialog from "../TractorTokenStrategyDialog";
import Fields, { CONVERT_UP_TOOLTIP_COPY } from "./fields/ConvertUpOrderV0Fields";
import { TokenStrategyFormField } from "./fields/sharedFields";
import {
  ConvertUpV0FormSchema,
  prepareConvertUpInitialFormData,
  useConvertUpV0Form,
  useConvertUpV0State,
} from "./schema/convertUp.schema";

// ------------------------------------------------------------
// Interface, Types, Enums
// ------------------------------------------------------------

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
  const state = useConvertUpV0State();

  return (
    <ConvertUpOrderFormContext.Provider
      value={{
        ...form,
        formStep,
        setFormStep,
      }}
    >
      <Form {...form.form}>
        <ConvertUpOrderFormController onOpenChange={onOpenChange} />
      </Form>
    </ConvertUpOrderFormContext.Provider>
  );
}

// ------------------------------------------------------------
// Form Controller
// ------------------------------------------------------------

const inferrableKeys: (keyof ConvertUpV0FormSchema)[] = [
  "minConvertBdvPerExecution",
  "maxConvertBdvPerExecution",
  "minTimeBetweenConverts",
  "minConvertBonusCapacity",
  "maxGrownStalkPerBdv",
  "maxGrownStalkPerBdvPenalty",
  "lowStalkDeposits",
  "operatorTip",
  "slippageRatio",
] as const;

const initRequiredKeys: (keyof ConvertUpV0FormSchema)[] = [
  "tokenStrategy",
  "totalConvertBdv",
  "minGrownStalkPerBdvBonus",
  "minPriceToConvertUp",
  "maxPriceToConvertUp",
] as const;

/**
 * The contents of the form.
 */
function ConvertUpOrderFormController({ onOpenChange }: IConvertUpOrderForm) {
  const { form, formStep, setFormStep } = useConvertUpOrderFormContext();
  const calculations = useSowOrderV0Calculations();
  const farmerSilo = useFarmerSilo();
  const siloData = useSiloData();
  const mainToken = useMainToken();

  const tokenMap = useTokenMap();

  // Whether the
  const [didInitRestFields, setDidInitRestFields] = useState(false);

  // ------------------------------------------------------------
  // Callbacks
  // ------------------------------------------------------------

  // Handle preparing the args
  const handlePrepareArgs = async () => {
    // Trigger the form to validate the fields that are required to prepare the args
    const isValid = await form.trigger(initRequiredKeys);
    console.log({
      valuesBefore: form.getValues(),
      errors: form.formState.errors,
      isValid: isValid,
    });

    if (!isValid) {
      return false;
    }

    // if the args have already been prepared, return true
    if (didInitRestFields) {
      return true;
    }

    // Only fill out the inferred data from the Entry Form Fields on the first pass
    const prepared = prepareConvertUpInitialFormData(form.getValues(), mainToken.decimals);

    inferrableKeys.forEach((key) => {
      const value = prepared[key];
      if (value instanceof TV) {
        form.setValue(key, value.toHuman());
      } else if (typeof value === "number") {
        form.setValue(key, value);
      } else if (typeof value === "object" && "type" in value && "addresses" in value) {
        // Sort the addresses by the number of seeds they have in ascending order
        value.addresses.sort((a, b) => {
          const aSeeds = siloData.tokenData.get(tokenMap[getTokenIndex(a)])?.rewards.seeds;
          const bSeeds = siloData.tokenData.get(tokenMap[getTokenIndex(b)])?.rewards.seeds;

          return aSeeds && bSeeds ? aSeeds.sub(bSeeds).toNumber() : 0;
        });

        // Re-set the value with the sorted addresses
        form.setValue(key, value);
      }
    });

    setDidInitRestFields(true);

    // Validate the token strategy to prevent type casting
    return true;
  };

  // Handle backwards navigation
  const handleBack = (e: React.MouseEvent<HTMLButtonElement>) => {
    // prevent default to avoid form submission
    e.preventDefault();
    e.stopPropagation();

    if (formStep === FormStep.ENTRY) {
      onOpenChange(false);
      return;
    }

    setFormStep(formStep - 1);
  };

  // Handle advancing to the next step
  const handleNext = async (e: React.MouseEvent<HTMLButtonElement>) => {
    // prevent default to avoid form submission
    e.preventDefault();
    e.stopPropagation();

    if (formStep === FormStep.ENTRY) {
      const prepared = await handlePrepareArgs();
      // If prepared is false, it means the form is not valid
      if (!prepared) return;
      setFormStep(FormStep.REVIEW);
      return;
    }
  };

  const isLoading = false;

  return (
    <>
      <Col className="w-full gap-6">
        <div className="">
          <AnimatePresence mode="wait">
            {formStep === FormStep.ENTRY && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <FormEntry farmerSilo={farmerSilo} siloData={siloData} calculations={calculations} />
              </motion.div>
            )}
            {formStep === FormStep.REVIEW && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <FormReview />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <Row className="gap-4 w-full flex-1">
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

  const handleOpenDialog = () => {
    setShowTokenStrategyDialog(true);
  };

  return (
    <>
      <Col className="gap-6">
        <FormTitle title="🚜 Automated Convert Parameters" />
        <Col className="w-full gap-5">
          <>
            <Fields.TotalConvertBdv />
            <TokenStrategyFormField
              openDialog={handleOpenDialog}
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
  const { form, setFormStep } = useConvertUpOrderFormContext();
  const tokenMap = useTokenMap();
  const { data: averageTipPaid = 1 } = useTractorOperatorAverageTipPaid();

  const values = form.watch();

  const totalValueToConvert = `${values.totalConvertBdv} PDV`;
  const priceRange = `$${values.minPriceToConvertUp} - $${values.maxPriceToConvertUp}`;

  const renderTokenStrategy = () => {
    const summary = StrategyUtil.getSummary(values.tokenStrategy);
    if (summary.isLowestPrice) return "Token with Best Price";
    if (summary.isLowestSeeds) return "Token with Least Seeds";

    const addresses = summary.addresses ?? [];

    if ((summary.isMulti || summary.isSingle) && !!addresses.length) {
      return (
        <Col className="gap-1">
          {addresses.map((adr) => {
            const tk = tokenMap[getTokenIndex(adr)];
            return (
              <Row key={`${adr}-selected-token-strategy`} className="gap-1 items-center">
                <IconImage src={tk.logoURI} size={4} alt={tk.symbol} />
                <div className="pinto-sm font-normal">{tk.symbol}</div>
              </Row>
            );
          })}
        </Col>
      );
    }

    // revert to previous formStep if the token strategy is invalid
    setFormStep(FormStep.ENTRY);

    return <></>;
  };

  return (
    <Col className="gap-6 w-full">
      <FormTitle title="🚜 Review Automated Convert Parameters" />
      <Col className="w-full gap-5">
        <Col className="w-full gap-3">
          <ReviewRow
            label="Total Value to Convert"
            tooltip={CONVERT_UP_TOOLTIP_COPY.totalConvertBdv}
            value={totalValueToConvert}
          />
          <ReviewRow label="Execution Price Bounds" tooltip={CONVERT_UP_TOOLTIP_COPY.priceRange} value={priceRange} />
          <ReviewRow
            label="Token Sources"
            tooltip={CONVERT_UP_TOOLTIP_COPY.tokenStrategy}
            value={renderTokenStrategy()}
          />
          <ReviewRow
            label="Min Grown Stalk Bonus Per PDV"
            tooltip={CONVERT_UP_TOOLTIP_COPY.minGrownStalkPerBdvBonus}
            value={
              <Row className="gap-1 items-center">
                <IconImage src={STALK.logoURI} size={4} alt={STALK.symbol} />
                <div className="pinto-sm font-normal">{values.minGrownStalkPerBdvBonus}</div>
              </Row>
            }
          />
          <Accordion className="AccordionRoot" type="multiple">
            <AccordionItem className="AccordionItem" value="advanced-settings">
              <AccordionTrigger
                className="pinto-sm-light text-pinto-secondary pb-3"
                iconClassName="text-pinto-secondary"
              >
                <span>Advanced</span>
              </AccordionTrigger>
              <AccordionContent>
                <Card className="flex flex-col p-3 gap-2 rounded-sm border-pinto-gray-2 bg-white">
                  <ReviewRow
                    label="Min Time Between Executions"
                    tooltip={CONVERT_UP_TOOLTIP_COPY.minTimeBetweenConverts}
                    value={`${values.minTimeBetweenConverts} s`}
                  />
                  <ReviewRow
                    label="Min Convert Capacity"
                    tooltip={CONVERT_UP_TOOLTIP_COPY.minConvertBonusCapacity}
                    value={`${values.minConvertBonusCapacity} PDV`}
                  />
                  <ReviewRow
                    label="Max Grown Stalk per PDV Penalty"
                    tooltip={CONVERT_UP_TOOLTIP_COPY.maxGrownStalkPerBdvPenalty}
                    value={`${values.maxGrownStalkPerBdvPenalty} PDV`}
                  />
                  <ReviewRow
                    label="Max Grown Stalk per PDV"
                    tooltip={CONVERT_UP_TOOLTIP_COPY.maxGrownStalkPerBdv}
                    value={`${values.maxGrownStalkPerBdv} Grown Stalk`}
                  />
                  <ReviewRow
                    label="Execution Size"
                    tooltip="The minimum and maximum execution size of the Convert Up Order"
                    value={`${values.minConvertBdvPerExecution} - ${values.maxConvertBdvPerExecution} PDV`}
                  />
                  <ReviewRow
                    label="Slippage Tolerance"
                    tooltip={CONVERT_UP_TOOLTIP_COPY.slippageRatio}
                    value={`${values.slippageRatio}%`}
                  />
                  <ReviewRow
                    label="Low Stalk Deposits"
                    tooltip={CONVERT_UP_TOOLTIP_COPY.lowStalkDeposits}
                    value={values.lowStalkDeposits === 0 ? "Use" : values.lowStalkDeposits === 1 ? "Omit" : "Use Last"}
                  />
                  <Separator className="h-[0.5px] bg-pinto-gray-2 my-1" />
                  <Button variant="outline-primary-2" size="md" className="w-full rounded-sm">
                    <span>Edit Advanced Parameters</span>
                  </Button>
                </Card>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Col>
      </Col>
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

const ReviewRow = ({
  label,
  tooltip,
  value,
}: {
  label: string;
  tooltip?: string;
  value: string | JSX.Element;
}) => {
  return (
    <Row className="w-full justify-between items-start">
      <Row className="gap-1 items-center">
        {tooltip ? (
          <Row className="gap-1 items-center">
            <Label variant="form" className="pinto-sm-light text-pinto-secondary">
              {label}
            </Label>
            <TooltipSimple content={tooltip} variant="outlined" triggerClassName="text-pinto-secondary" />
          </Row>
        ) : (
          <Label variant="form">{label}</Label>
        )}
      </Row>
      {typeof value === "string" ? <div className="pinto-sm font-normal">{value}</div> : value}
    </Row>
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
      onlyLP
      {...calculations}
    />
  );
};
