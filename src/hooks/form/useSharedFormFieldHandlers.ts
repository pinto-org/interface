import { sanitizeNumericInputValue } from "@/utils/string";
import { useCallback } from "react";
import { FieldPath, PathValue, useFormContext } from "react-hook-form";

interface BaseIFormContextHandlers {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => ReturnType<typeof sanitizeNumericInputValue>;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export const useSharedFormFieldHandlers = <Schema extends { [k: string]: string }, TName extends FieldPath<Schema>>(
  ctx: ReturnType<typeof useFormContext<Schema>>,
  name: TName,
  decimals: number,
): BaseIFormContextHandlers => {
  const handleNumericInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const cleaned = sanitizeNumericInputValue(e.target.value, decimals);

      ctx.setValue(name, cleaned.str as PathValue<Schema, TName>, { shouldValidate: true });
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
      ctx.setValue(name, joined as PathValue<Schema, TName>, { shouldValidate: cleanValue !== "" });
    },
    [ctx.setValue, name],
  );

  const handleNumericInputFocus = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      const cleanValue = e.target.value.replace(/,/g, "");
      ctx.setValue(name, cleanValue as PathValue<Schema, TName>, { shouldValidate: false });
    },
    [ctx.setValue, name],
  );

  return {
    onChange: handleNumericInputChange,
    onBlur: handleNumericInputBlur,
    onFocus: handleNumericInputFocus,
  };
};
