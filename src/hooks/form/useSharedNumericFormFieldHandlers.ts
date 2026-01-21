import { MAX_INPUT_VALUE, sanitizeNumericInputValue } from "@/utils/string";
import { useCallback, useMemo } from "react";
import { FieldPath, FieldValues, PathValue, useFormContext } from "react-hook-form";

interface BaseIFormContextHandlers {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => ReturnType<typeof sanitizeNumericInputValue>;
  onBlur: (e: { target: { value: string } }) => void;
  onFocus: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export const useSharedNumericFormFieldHandlers = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>(
  ctx: ReturnType<typeof useFormContext<TFieldValues>>,
  name: TName,
  decimals: number,
  allowNegative?: boolean,
  maxValue: number = MAX_INPUT_VALUE,
): BaseIFormContextHandlers => {
  const handleNumericInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement> | { target: { value: string } }) => {
      const cleaned = sanitizeNumericInputValue(e.target.value, decimals, allowNegative, maxValue);

      ctx.setValue(name, cleaned.str as PathValue<TFieldValues, TName>, { shouldValidate: true });
      return cleaned;
    },
    [ctx.setValue, decimals, name, maxValue],
  );

  const handleNumericInputBlur = useCallback(
    (e: React.ChangeEvent<HTMLInputElement> | { target: { value: string } }) => {
      const cleanValue = e.target.value.replace(/,/g, "");
      const parts = cleanValue.split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      const joined = parts.join(".");

      // only validate if the value is not empty
      ctx.setValue(name, joined as PathValue<TFieldValues, TName>, { shouldValidate: cleanValue !== "" });
    },
    [ctx.setValue, name],
  );

  const handleNumericInputFocus = useCallback(
    (e: React.FocusEvent<HTMLInputElement> | { target: { value: string } }) => {
      const cleanValue = e.target.value.replace(/,/g, "");
      ctx.setValue(name, cleanValue as PathValue<TFieldValues, TName>, { shouldValidate: false });
    },
    [ctx.setValue, name],
  );

  return useMemo(
    () => ({
      onChange: handleNumericInputChange,
      onBlur: handleNumericInputBlur,
      onFocus: handleNumericInputFocus,
    }),
    [handleNumericInputBlur, handleNumericInputChange, handleNumericInputFocus],
  );
};
