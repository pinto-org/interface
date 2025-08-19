import { Col, Row } from "@/components/Container";
import React, { useCallback } from "react";
import { useFormState } from "react-hook-form";
import Fields from "../form/fields/ConvertUpOrderV0Fields";
import { TimeScaleSelectFormField, TractorFormButtonsRow } from "../form/fields/sharedFields";
import { ConvertUpV0FormSchema, TractorConvertUpFormKeys } from "../form/schema/convertUp.schema";
import { useConvertUpOrderFormContext } from "./ConvertUpTractorContext";

interface Props {
  onSubmit: () => void;
  onCancel: () => void;
}

const ConvertUpTractorAdvancedForm = ({ onSubmit, onCancel }: Props) => {
  const { form, getMissingFields } = useConvertUpOrderFormContext();

  const handleBack = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      e.preventDefault();

      onCancel();
    },
    [onCancel],
  );

  const handleNext = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      e.preventDefault();

      const isValid = await form.trigger(TractorConvertUpFormKeys.all);
      if (!isValid) {
        return;
      }

      onSubmit();
    },
    [form, onSubmit],
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
      <ButtonRow handleBack={handleBack} handleNext={handleNext} getMissingFields={getMissingFields} />
    </Col>
  );
};

const ButtonRow = ({
  handleBack,
  handleNext,
  getMissingFields,
  isLoading,
}: {
  handleBack: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleNext: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
  getMissingFields: (fields?: (keyof ConvertUpV0FormSchema)[]) => string[];
  isLoading?: boolean;
}) => {
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
        content: "Save Changes",
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
        content: "← Cancel",
      }}
    />
  );
};

export default ConvertUpTractorAdvancedForm;
