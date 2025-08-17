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
  LowStalkDepositsMode,
  tractorTokenStrategyUtil as StrategyUtil,
  isDynamicTractorTokenStrategy,
  isTractorTokenStrategy,
} from "@/lib/Tractor";
import { TractorTokenStrategy } from "@/lib/Tractor/types";
import useTractorOperatorAverageTipPaid from "@/state/tractor/useTractorOperatorAverageTipPaid";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { useSiloData } from "@/state/useSiloData";
import { useMainToken } from "@/state/useTokenData";
import { formatter } from "@/utils/format";
import { getTokenIndex } from "@/utils/token";
import { exists } from "@/utils/utils";
import { AnimatePresence, motion } from "framer-motion";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useFormContext, useFormState, useWatch } from "react-hook-form";
import TractorTokenStrategyDialog from "../TractorTokenStrategyDialog";
import Fields, { CONVERT_UP_TOOLTIP_COPY } from "./fields/ConvertUpOrderV0Fields";
import {
  CustomOperatorTipFormField,
  OperatorTipFormField,
  TimeScaleSelectFormField,
  TokenStrategyFormField,
  TractorOperatorTipStrategy,
} from "./fields/sharedFields";
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
  OPERATOR_TIP = 4,
}

// ------------------------------------------------------------
// Context
// ------------------------------------------------------------

interface IConvertUpOrderFormContext extends ReturnType<typeof useConvertUpV0Form> {
  formStep: FormStep;
  operatorTipPreset: TractorOperatorTipStrategy;
  setOperatorTipPreset: (preset: TractorOperatorTipStrategy) => void;
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
  // Keep these at the top level
  const [formStep, setFormStep] = useState(FormStep.ENTRY);
  const [operatorTipPreset, setOperatorTipPreset] = useState<TractorOperatorTipStrategy>("Normal");

  // Hooks
  const form = useConvertUpV0Form();
  // const state = useConvertUpV0State();

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

const allFormKeys: (keyof ConvertUpV0FormSchema)[] = [...initRequiredKeys, ...inferrableKeys];

/**
 * The contents of the form.
 */
function ConvertUpOrderFormController({ onOpenChange }: IConvertUpOrderForm) {
  const { form, formStep, setFormStep } = useConvertUpOrderFormContext();
  const calculations = useSowOrderV0Calculations();
  const farmerSilo = useFarmerSilo();
  const siloData = useSiloData();
  const mainToken = useMainToken();
  const { data: averageTipPaid } = useTractorOperatorAverageTipPaid();

  const tokenMap = useTokenMap();

  // Whether the
  const [didInitRestFields, setDidInitRestFields] = useState(false);
  const [cachedValues, setCachedValues] = useState<ConvertUpV0FormSchema>(form.getValues());

  // ------------------------------------------------------------
  // Callbacks
  // ------------------------------------------------------------

  // Handle preparing the args
  const handlePrepareArgs = async () => {
    // Trigger the form to validate the fields that are required to prepare the args
    const isValid = await form.trigger(initRequiredKeys);
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
  const handleBack = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      // prevent default to avoid form submission
      e.preventDefault();
      e.stopPropagation();

      if (formStep === FormStep.ENTRY) {
        onOpenChange(false);
        return;
      }

      if (formStep === FormStep.REVIEW) {
        setFormStep(FormStep.ENTRY);
        return;
      }

      // ADVANCED & OPERATOR_TIP both stem from REVIEW
      setFormStep(FormStep.REVIEW);
    },
    [formStep, onOpenChange, setFormStep],
  );

  // Handle advancing to the next step
  const handleNext = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
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

      if (formStep === FormStep.REVIEW) {
      }
    },
    [formStep, handlePrepareArgs, setFormStep],
  );

  // Cache the values when the form step is advanced
  // biome-ignore lint/correctness/useExhaustiveDependencies: Only cache when the form step is advanced
  useEffect(() => {
    if (formStep === FormStep.ADVANCED) {
      setCachedValues(form.getValues());
    }
  }, [formStep]);

  const isLoading = false;

  return (
    <>
      <Col className="w-full gap-6">
        <div className="">
          <AnimatePresence mode="sync">
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
            {(formStep === FormStep.REVIEW || formStep === FormStep.ADVANCED) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <FormReview averageTipPaid={averageTipPaid ?? 1} />
              </motion.div>
            )}
            {formStep === FormStep.OPERATOR_TIP ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <CustomOperatorTip averageTipPaid={averageTipPaid ?? 1} />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
        {formStep !== FormStep.ADVANCED ? (
          <ButtonRow handleBack={handleBack} handleNext={handleNext} isLoading={isLoading} />
        ) : null}
      </Col>
    </>
  );
}

/**
 * ------------------------------------------------------------
 * Form Components
 * ------------------------------------------------------------
 */

const ButtonRow = ({
  handleBack,
  handleNext,
  isLoading,
}: {
  handleBack: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleNext: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
  isLoading: boolean;
}) => {
  const { formStep, getMissingFields } = useConvertUpOrderFormContext();
  const { errors } = useFormState<ConvertUpV0FormSchema>();

  const keys = formStep === FormStep.ENTRY ? initRequiredKeys : allFormKeys;

  const missingFields = getMissingFields(keys);

  const hasErrors = Boolean(Object.keys(errors).length);

  const hasMissingFields = Boolean(missingFields.length);

  const isFormFormStep = formStep === FormStep.ADVANCED || formStep === FormStep.ENTRY;

  return (
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
      <TooltipSimple
        content={
          hasMissingFields ? (
            <div className="p-1">
              <div className="font-medium mb-1">Please fill in the following fields:</div>
              <ul className="list-disc pl-4 text-sm">
                {missingFields.map((field) => (
                  <li key={`missing-field${field}`}>{field}</li>
                ))}
              </ul>
            </div>
          ) : null
        }
        side="top"
        align="center"
        disabled={isFormFormStep ? !hasMissingFields : true}
      >
        <div className="flex-1">
          <Button
            size="xlargest"
            rounded="full"
            className={`w-full ${isLoading ? "bg-pinto-gray-2 text-pinto-light" : "bg-pinto-green-4 text-white"}`}
            disabled={hasErrors || hasMissingFields}
            onClick={handleNext}
            type="button"
          >
            {formStep === FormStep.ENTRY ? "Review" : "Next"}
          </Button>
        </div>
      </TooltipSimple>
    </Row>
  );
};

const SaveAdvancedParametersButton = () => {
  const { formStep, setFormStep, getMissingFields } = useConvertUpOrderFormContext();
  const { errors } = useFormState<ConvertUpV0FormSchema>();

  if (formStep !== FormStep.ADVANCED) {
    return null;
  }

  const missingFields = getMissingFields(allFormKeys);

  const hasErrors = Boolean(Object.keys(errors).length);

  const hasMissingFields = Boolean(missingFields.length);

  return (
    <TooltipSimple
      content={
        hasMissingFields ? (
          <div className="p-1">
            <div className="font-medium mb-1">Please fill in the following fields:</div>
            <ul className="list-disc pl-4 text-sm">
              {missingFields.map((field) => (
                <li key={`missing-field${field}`}>{field}</li>
              ))}
            </ul>
          </div>
        ) : null
      }
      side="top"
      align="center"
      disabled={!hasMissingFields}
    >
      <div className="flex-1">
        <Button
          variant="outline-primary-2"
          size="xl"
          className="w-full rounded-sm disabled:opacity-50"
          onClick={() => setFormStep(FormStep.REVIEW)}
          disabled={hasErrors || hasMissingFields}
        >
          <span>Save</span>
        </Button>
      </div>
    </TooltipSimple>
  );
};

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

  const {
    errors: { minPriceToConvertUp, maxPriceToConvertUp },
  } = useFormState<ConvertUpV0FormSchema>();

  const errors = useMemo(() => {
    const set = new Set([minPriceToConvertUp?.message, maxPriceToConvertUp?.message]);

    return Array.from(set).filter((msg): msg is string => !!msg);
  }, [minPriceToConvertUp, maxPriceToConvertUp]);

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
        {errors.length ? (
          <div className="flex flex-col gap-2">
            {errors.map((error, i) => {
              return (
                <div key={`${error}-error-${i.toString()}`} className="pinto-sm-light text-pinto-red-2">
                  {error}
                </div>
              );
            })}
          </div>
        ) : null}
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

const FormReview = ({ averageTipPaid }: { averageTipPaid: number }) => {
  const { form, formStep, operatorTipPreset, setFormStep, setOperatorTipPreset } = useConvertUpOrderFormContext();
  const [accordionValue, setAccordionValue] = useState<string | undefined>(undefined);
  const [accordionOpen, setAccordionOpen] = useState(false);

  const values = useWatch({ control: form.control });
  const tokenMap = useTokenMap();

  const totalValueToConvert = `${values.totalConvertBdv} PDV`;
  const priceRange = `$${values.minPriceToConvertUp} - $${values.maxPriceToConvertUp}`;

  const summary = StrategyUtil.getSummary((values.tokenStrategy ?? { type: "LOWEST_SEEDS" }) as TractorTokenStrategy);

  const handleSetAccordionValue = (value: string) => {
    if (accordionOpen && accordionValue === "advanced-settings" && formStep === FormStep.ADVANCED) {
      return;
    }

    setAccordionOpen(!!value);
    setAccordionValue(value);
  };

  const renderTokenStrategy = () => {
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
          <Accordion
            className="AccordionRoot"
            type="single"
            collapsible
            value={accordionValue}
            onValueChange={handleSetAccordionValue}
          >
            <AccordionItem className="AccordionItem" value="advanced-settings">
              <AccordionTrigger
                className="pinto-sm-light text-pinto-secondary pt-3"
                iconClassName="text-pinto-secondary"
              >
                <span>Advanced</span>
              </AccordionTrigger>
              <AccordionContent>
                {formStep === FormStep.ADVANCED ? (
                  <div className="py-3">
                    <EditAdvancedParameters />
                  </div>
                ) : (
                  <AdvancedParametersSummary control={form.control} toggleEdit={() => setFormStep(FormStep.ADVANCED)} />
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <OperatorTipFormField
            averageTipPaid={averageTipPaid}
            preset={operatorTipPreset}
            setPreset={setOperatorTipPreset}
          />
        </Col>
      </Col>
      {formStep === FormStep.ADVANCED && accordionOpen ? <SaveAdvancedParametersButton /> : null}
    </Col>
  );
};

const noDecimalsProps = { minDecimals: 0, maxDecimals: 0 } as const;

const DEPOSIT_MODE_LABELS = {
  [LowStalkDepositsMode.USE]: "Yes",
  [LowStalkDepositsMode.OMIT]: "No",
  [LowStalkDepositsMode.USE_LAST]: "Use Last",
} as const;

const AdvancedParametersSummary = ({
  control,
  toggleEdit,
}: {
  control: ReturnType<typeof useFormContext<ConvertUpV0FormSchema>>["control"];
  toggleEdit: () => void;
}) => {
  const values = useWatch({ control });
  const { setFormStep } = useConvertUpOrderFormContext();

  const getTimeScaleDisplay = () => {
    const timeScale = values.timeScale;
    switch (timeScale) {
      case "SECONDS":
        return "seconds";
      case "MINUTES":
        return "minutes";
      case "HOURS":
        return "hours";
      default:
        return "days";
    }
  };

  const minTimeBetweenConverts = values.minTimeBetweenConverts;
  const minConvertBonusCapacity = values.minConvertBonusCapacity;
  const maxGrownStalkPerBdvPenalty = values.maxGrownStalkPerBdvPenalty;
  const maxGrownStalkPerBdv = values.maxGrownStalkPerBdv;
  const minConvertBdvPerExecution = values.minConvertBdvPerExecution;
  const maxConvertBdvPerExecution = values.maxConvertBdvPerExecution;
  const slippageRatio = values.slippageRatio;
  const lowStalkDeposits = values.lowStalkDeposits;

  return (
    <Card className="flex flex-col p-3 gap-2 rounded-sm border-pinto-gray-2 bg-white">
      <ReviewRow
        label="Min Time Between Executions"
        tooltip={CONVERT_UP_TOOLTIP_COPY.minTimeBetweenConverts}
        value={minTimeBetweenConverts ? `${formatter.noDec(minTimeBetweenConverts)} ${getTimeScaleDisplay()}` : "--"}
      />
      <ReviewRow
        label="Min Convert Capacity"
        tooltip={CONVERT_UP_TOOLTIP_COPY.minConvertBonusCapacity}
        value={minConvertBonusCapacity ? `${formatter.twoDec(minConvertBonusCapacity)} PDV` : "--"}
      />
      <ReviewRow
        label="Max Grown Stalk per PDV Penalty"
        tooltip={CONVERT_UP_TOOLTIP_COPY.maxGrownStalkPerBdvPenalty}
        value={`${formatter.twoDec(maxGrownStalkPerBdvPenalty)} PDV`}
      />
      <ReviewRow
        label="Max Grown Stalk per PDV"
        tooltip={CONVERT_UP_TOOLTIP_COPY.maxGrownStalkPerBdv}
        value={`${formatter.twoDec(maxGrownStalkPerBdv)} Grown Stalk`}
      />
      <ReviewRow
        label="Execution Size"
        tooltip="The minimum and maximum execution size of the Convert Up Order"
        value={`${formatter.twoDec(minConvertBdvPerExecution)} - ${formatter.twoDec(maxConvertBdvPerExecution)} PDV`}
      />
      <ReviewRow
        label="Slippage Tolerance"
        tooltip={CONVERT_UP_TOOLTIP_COPY.slippageRatio}
        value={`${formatter.pct(slippageRatio)}`}
      />
      <ReviewRow
        label="Use Low Stalk Deposits"
        tooltip={CONVERT_UP_TOOLTIP_COPY.lowStalkDeposits}
        value={DEPOSIT_MODE_LABELS[lowStalkDeposits as LowStalkDepositsMode]}
      />
      <Separator className="h-[0.5px] bg-pinto-gray-2 my-1" />
      <Button variant="outline-primary-2" size="md" className="w-full rounded-sm" onClick={toggleEdit}>
        <span>Edit Advanced Parameters</span>
      </Button>
    </Card>
  );
};

const EditAdvancedParameters = () => {
  const { form, formStep, setFormStep } = useConvertUpOrderFormContext();

  return (
    <Col className="w-full gap-5">
      <Fields>
        <Row className="w-full justify-between gap-4 items-end">
          <Fields.MinTimeBetweenConverts />
          <TimeScaleSelectFormField />
        </Row>
        <Row className="w-full justify-between gap-4">
          <Fields.MinConvertBdvPerExecution />
          <Fields.MaxConvertBdvPerExecution />
        </Row>
        <Fields.MinConvertBonusCapacity />
        <Fields.MaxGrownStalkPerBdvPenalty />
        <Fields.MaxGrownStalkPerBdv />
        <Fields.SlippageRatio />
      </Fields>
    </Col>
  );
};

const CustomOperatorTip = ({ averageTipPaid }: { averageTipPaid: number }) => {
  return (
    <Col className="w-full ">
      <FormTitle title="🚜 Custom Operator Tip" />
      <Col className="w-full justify-between min-h-[21rem] h-full">
        <CustomOperatorTipFormField averageTipPaid={averageTipPaid} />
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
            <div className="pinto-sm-light text-pinto-secondary">{label}</div>
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
