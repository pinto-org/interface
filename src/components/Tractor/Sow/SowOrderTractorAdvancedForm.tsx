import { Col } from "@/components/Container";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/Form";
import IconImage from "@/components/ui/IconImage";
import { Input } from "@/components/ui/Input";
import Warning from "@/components/ui/Warning";
import { MAIN_TOKEN } from "@/constants/tokens";
import { useSharedNumericFormFieldHandlers } from "@/hooks/form/useSharedNumericFormFieldHandlers";
import { usePodLine } from "@/state/useFieldData";
import { useChainConstant } from "@/utils/chain";
import { formatter } from "@/utils/format";
import { useCallback, useEffect, useState } from "react";
import { useFormContext, useFormState, useWatch } from "react-hook-form";
import { SowOrderV0FormSchema, validateAdvancedFormFields } from "../form/SowOrderV0Schema";
import { TractorFormButtonsRow } from "../form/fields/sharedFields";

interface Props {
  onSubmit: () => void;
  onCancel: () => void;
}

const MainTokenAdornment = () => {
  const mainToken = useChainConstant(MAIN_TOKEN);
  return (
    <div className="flex items-center gap-2 pr-4 pl-2 bg-white">
      <IconImage src={mainToken.logoURI} alt="PINTO" size={6} className="rounded-full" />
      <span className="hidden sm:block text-black pinto-sm-light">PINTO</span>
    </div>
  );
};

const sharedInputProps = {
  type: "text",
  inputMode: "decimal",
  pattern: "[0-9]*.?[0-9]*",
  outlined: true,
} as const;

const SowOrderTractorAdvancedForm = ({ onSubmit, onCancel }: Props) => {
  const form = useFormContext<SowOrderV0FormSchema>();
  const mainToken = useChainConstant(MAIN_TOKEN);
  const podLine = usePodLine();

  // State for tracking cross-field validation errors
  const [crossFieldErrors, setCrossFieldErrors] = useState<string[]>([]);

  const minSoilHandlers = useSharedNumericFormFieldHandlers(form, "minSoil", mainToken.decimals);
  const maxPerSeasonHandlers = useSharedNumericFormFieldHandlers(form, "maxPerSeason", mainToken.decimals);
  const podLineLengthHandlers = useSharedNumericFormFieldHandlers(form, "podLineLength", mainToken.decimals);

  // Watch the relevant fields to trigger validation on change
  const [minSoil, maxPerSeason, totalAmount] = useWatch({
    control: form.control,
    name: ["minSoil", "maxPerSeason", "totalAmount"],
  });

  // Run cross-field validation whenever watched values change
  useEffect(() => {
    if (!minSoil || !maxPerSeason || !totalAmount) {
      setCrossFieldErrors([]);
      return;
    }

    const validationResult = validateAdvancedFormFields(
      {
        minSoil,
        maxPerSeason,
        totalAmount,
      },
      form,
    );

    setCrossFieldErrors(validationResult.errors);
  }, [minSoil, maxPerSeason, totalAmount, form]);

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

      // First validate individual fields
      const isValid = await form.trigger(["minSoil", "maxPerSeason", "podLineLength"]);
      if (!isValid) {
        return;
      }

      // Then validate cross-field relationships
      const formData = form.getValues();
      const validationResult = validateAdvancedFormFields(
        {
          minSoil: formData.minSoil,
          maxPerSeason: formData.maxPerSeason,
          totalAmount: formData.totalAmount,
        },
        form,
      );

      if (!validationResult.isValid) {
        return;
      }

      onSubmit();
    },
    [form, onSubmit],
  );

  return (
    <Col className="w-full gap-5">
      <FormField
        control={form.control}
        name="minSoil"
        render={({ field, fieldState }) => (
          <FormItem className="flex-1">
            <FormLabel>Min per Season</FormLabel>
            <FormControl>
              <Input
                {...field}
                {...sharedInputProps}
                {...minSoilHandlers}
                placeholder="0.00"
                isError={!!fieldState.error}
                endIcon={<MainTokenAdornment />}
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="maxPerSeason"
        render={({ field, fieldState }) => (
          <FormItem className="flex-1">
            <FormLabel>Max per Season</FormLabel>
            <FormControl>
              <Input
                {...field}
                {...sharedInputProps}
                {...maxPerSeasonHandlers}
                placeholder="0.00"
                isError={!!fieldState.error}
                endIcon={<MainTokenAdornment />}
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="podLineLength"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel>Pod Line Length</FormLabel>
            <FormControl>
              <Input
                {...field}
                {...sharedInputProps}
                {...podLineLengthHandlers}
                placeholder={podLine.gt(0) ? formatter.number(podLine) : "0.00"}
                isError={!!fieldState.error}
              />
            </FormControl>
          </FormItem>
        )}
      />
      <AdvancedFormErrors errors={crossFieldErrors} />
      <ButtonRow handleBack={handleBack} handleNext={handleNext} hasErrors={crossFieldErrors.length > 0} />
    </Col>
  );
};

// Error display component for advanced form validation errors
const AdvancedFormErrors = ({ errors }: { errors: string[] }) => {
  if (!errors.length) return null;

  return (
    <Col className="gap-1">
      {errors.map((err) => (
        <div key={`${err}-error`}>
          <Warning variant="warning">{err}</Warning>
        </div>
      ))}
    </Col>
  );
};

const ButtonRow = ({
  handleBack,
  handleNext,
  hasErrors: crossFieldHasErrors,
}: {
  handleBack: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleNext: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
  hasErrors?: boolean;
}) => {
  const { errors } = useFormState<SowOrderV0FormSchema>();

  const hasFormErrors = Boolean(Object.keys(errors).length);
  const hasErrors = hasFormErrors || crossFieldHasErrors;

  return (
    <TractorFormButtonsRow
      handleLeft={handleBack}
      handleRight={handleNext}
      right={{
        content: "Save Changes",
        disabled: Boolean(hasErrors),
      }}
      left={{
        content: "← Back",
      }}
    />
  );
};

export default SowOrderTractorAdvancedForm;
