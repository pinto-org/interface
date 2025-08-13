import { sanitizeNumericInputValue } from "@/utils/string";
import { useCallback } from "react";
import { FieldPath, FieldValues, PathValue, useFormContext } from "react-hook-form";

interface BaseIFormContextHandlers {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => ReturnType<typeof sanitizeNumericInputValue>;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export const useSharedNumericFormFieldHandlers = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>(
  ctx: ReturnType<typeof useFormContext<TFieldValues>>,
  name: TName,
  decimals: number,
): BaseIFormContextHandlers => {
  const handleNumericInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const cleaned = sanitizeNumericInputValue(e.target.value, decimals);

      ctx.setValue(name, cleaned.str as PathValue<TFieldValues, TName>, { shouldValidate: true });
      return cleaned;
    },
    [ctx.setValue, decimals, name],
  );

  const handleNumericInputBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
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
    (e: React.FocusEvent<HTMLInputElement>) => {
      const cleanValue = e.target.value.replace(/,/g, "");
      ctx.setValue(name, cleanValue as PathValue<TFieldValues, TName>, { shouldValidate: false });
    },
    [ctx.setValue, name],
  );

  return {
    onChange: handleNumericInputChange,
    onBlur: handleNumericInputBlur,
    onFocus: handleNumericInputFocus,
  };
};
