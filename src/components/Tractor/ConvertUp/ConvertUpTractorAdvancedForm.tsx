import { Col, Row } from "@/components/Container";
import { Form } from "@/components/Form";
import React, { useCallback, useEffect, useState } from "react";
import { useFormContext, useFormState } from "react-hook-form";
import Fields from "../form/fields/ConvertUpOrderV0Fields";
import { TimeScaleSelectFormField, TractorFormButtonsRow } from "../form/fields/sharedFields";
import { ConvertUpV0FormSchema, TractorConvertUpFormKeys, useConvertUpV0Form } from "../form/schema/convertUp.schema";
import { ConvertUpTractorOrderFormStep } from "./ConvertUpTractorContext";

interface Props {
  outerFormValues: ConvertUpV0FormSchema;
  setOuterFormValues: (values: ConvertUpV0FormSchema) => void;
  setFormStep: (step: ConvertUpTractorOrderFormStep) => void;
}

const ConvertUpTractorAdvancedForm = (props: Props) => {
  const { form, getMissingFields } = useConvertUpV0Form();

  return (
    // Nest the same provider to create a new instance of the form
    // This way, we can retain the previously set values in the case where the
    // user goes back to previous form step
    <Form {...form}>
      <FormInner {...props} getMissingFields={getMissingFields} />
    </Form>
  );
};

export default ConvertUpTractorAdvancedForm;

interface IFormInner extends Props {
  getMissingFields: (fields?: (keyof ConvertUpV0FormSchema)[]) => string[];
}

const FormInner = ({ outerFormValues, getMissingFields, setFormStep, setOuterFormValues }: IFormInner) => {
  const ctx = useFormContext<ConvertUpV0FormSchema>();

  const [didSyncForms, setDidSyncForms] = useState(false);

  // Sync the outer form values to the inner form
  useEffect(() => {
    if (didSyncForms) {
      return;
    }

    ctx.reset(outerFormValues);
    setDidSyncForms(true);
  }, [outerFormValues, ctx, didSyncForms]);

  const handleBack = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      e.preventDefault();

      setFormStep(ConvertUpTractorOrderFormStep.REVIEW);
    },
    [setFormStep],
  );

  const handleNext = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      e.preventDefault();

      const isValid = await ctx.trigger(TractorConvertUpFormKeys.all);
      if (!isValid) {
        return;
      }

      setOuterFormValues(ctx.getValues());
      setFormStep(ConvertUpTractorOrderFormStep.REVIEW);
    },
    [ctx, setOuterFormValues, setFormStep],
  );

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
      <ButtonRow
        handleBack={handleBack}
        handleNext={handleNext}
        isLoading={false}
        getMissingFields={getMissingFields}
      />
    </Col>
  );
};

interface IButtonRow {
  handleBack: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleNext: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
  getMissingFields: (fields?: (keyof ConvertUpV0FormSchema)[]) => string[];
  isLoading: boolean;
}

const ButtonRow = ({ handleBack, handleNext, getMissingFields, isLoading }: IButtonRow) => {
  const { errors } = useFormState<ConvertUpV0FormSchema>();

  const missingFields = getMissingFields(TractorConvertUpFormKeys.advanced);

  const hasErrors = Boolean(Object.keys(errors).length);

  const hasMissingFields = Boolean(missingFields.length);

  return (
    <TractorFormButtonsRow
      handleLeft={handleBack}
      handleRight={handleNext}
      isLoading={isLoading}
      right={{
        content: "Submit",
        disabled: Boolean(hasErrors || hasMissingFields),
        tooltip: hasMissingFields ? (
          <div className="p-1">
            <div className="font-medium mb-1">Please fill in the following fields:</div>
            <ul className="list-disc pl-4 text-sm">
              {missingFields.map((field) => (
                <li key={`missing-field${field}`}>{field}</li>
              ))}
            </ul>
          </div>
        ) : null,
      }}
      left={{
        content: "← Back",
      }}
    />
  );
};
