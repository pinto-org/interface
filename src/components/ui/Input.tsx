import { TV } from "@/classes/TokenValue";
import { formatter } from "@/utils/format";
import { useDebouncedEffect } from "@/utils/useDebounce";
import { cn, exists } from "@/utils/utils";
import React, { useEffect, useCallback, useState } from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  containerClassName?: string;
}

const RawInputField = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        className={cn(
          "flex h-12 w-full rounded-[0.75rem] border border-input bg-white px-3 py-1 text-[1.25rem] text-black shadow-none transition-colors file:border-0 file:bg-transparent file:text-[1.25rem] file:font-medium placeholder:text-pinto-gray-3 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none disabled:bg-transparent",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, containerClassName, type, startIcon, endIcon, ...props }, ref) => {
    return (
      <div className={cn("relative", containerClassName)}>
        {startIcon && <div className="absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none">{startIcon}</div>}
        <RawInputField
          type={type}
          className={cn(startIcon && "pl-10", endIcon && "pr-10", className)}
          ref={ref}
          {...props}
        />
        {endIcon && <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">{endIcon}</div>}
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input };

interface NumberInputProps extends Omit<InputProps, "value" | "type" | "min" | "max"> {
  // required
  value?: TV;
  error?: boolean;
  valueDecimals: number;
  setValue: (value: TV) => void;
  shouldClamp?: boolean;
  // optional
  min?: TV;
  max?: TV;
}

export const TokenValueInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      className,
      containerClassName,
      startIcon,
      error,
      endIcon,
      value,
      valueDecimals,
      shouldClamp = false,
      min,
      max,
      placeholder = "0",
      setValue,
      ...props
    },
    ref,
  ) => {
    const [displayValue, setDisplayValue] = useState(!value || value?.isZero ? "" : value.toHuman());

    const clamp = useCallback(
      (amt: TV) => {
        if (min && amt.lt(min)) return min;
        if (max && amt.gt(max)) return max;

        return amt;
      },
      [min, max],
    );

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const sanitized = sanitizeValue(value, valueDecimals);

        setDisplayValue(sanitized.str);
        props.onChange?.(e);
      },
      [props.onChange, valueDecimals],
    );

    // Handle the blur event
    const handleBlur = useCallback(() => {
      const sanitized = sanitizeValue(displayValue, valueDecimals);
      if (!shouldClamp) {
        setDisplayValue(formatter.number(sanitized.strValue, { minDecimals: 0, maxDecimals: valueDecimals }));
        return;
      }

      const clamped = shouldClamp ? clamp(sanitized.tv) : sanitized.tv;

      if (!clamped.eq(sanitized.tv)) {
        setDisplayValue(formatter.number(clamped.toHuman(), { minDecimals: 0, maxDecimals: valueDecimals }));
        setValue(clamped);
      }
    }, [displayValue, valueDecimals, shouldClamp, clamp, setValue]);

    const handleOnFocus = useCallback(() => {
      const sanitized = sanitizeValue(displayValue, valueDecimals);
      setDisplayValue(sanitized.str);
    }, [displayValue, valueDecimals]);

    // debounce the value change
    useDebouncedEffect(
      () => {
        const sanitized = sanitizeValue(displayValue, valueDecimals);
        setValue(sanitized.tv);
      },
      [displayValue, valueDecimals, setValue],
      50,
    );

    return (
      <div
        className={cn(
          "relative flex content-center rounded-lg overflow-hidden border border-pinto-gray-blue transition-colors focus-within:outline-none focus-within:ring-1",
          error ? "border-pinto-error focus-within:ring-errorRing" : "border-pinto-gray-blue focus-within:ring-ring",
          containerClassName,
        )}
      >
        {startIcon && <div className="absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none">{startIcon}</div>}
        <RawInputField
          type="text"
          className={cn(startIcon && "pl-10", endIcon && "pr-10", className)}
          ref={ref}
          value={displayValue}
          placeholder={placeholder}
          onChange={handleChange}
          onFocus={handleOnFocus}
          onBlur={handleBlur}
          {...props}
        />
        {endIcon && <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">{endIcon}</div>}
      </div>
    );
  },
);

TokenValueInput.displayName = "TokenValueInput";

// ────────────────────────────────────────────────────────────────────────────────
// Helper Functions
// ────────────────────────────────────────────────────────────────────────────────

const nonAmounts = new Set([".", ""]);

const cleanAmount = (value: string) => value.replace(/[^0-9.]/g, "");

/**
 * Sanitize the user input
 */
const sanitizeValue = (value: string, valueDecimals: number) => {
  const nonAmounts = new Set<string>([".", ""]);
  // if the value is a non-amount ("", ".", etc) return default values
  if (nonAmounts.has(value)) {
    return { str: value, strValue: "0", tv: TV.ZERO };
  }

  let str = "";
  let strValue = "";

  // remove all non-numeric characters
  const cleaned = cleanAmount(value);

  // treat all values after the first decimal point as decimal place.
  const [pre, ...post] = cleaned.split(".");
  const decimals = post.join("");

  const endsWithDot = cleaned.endsWith(".") && !post.length;
  const startsWithDot = cleaned.startsWith(".") && !pre.length;

  const mayDot = !!post.length || endsWithDot ? "." : "";
  const back = decimals.slice(0, valueDecimals);

  if (startsWithDot) {
    str = `.${back}`;
    strValue = `0.${back}`;
  } else if (endsWithDot) {
    str = `${pre}.`;
    strValue = `${pre}`;
  } else {
    strValue = `${pre}${mayDot}${back}`;
    str = strValue;
  }

  const tv = TV.fromHuman(strValue, valueDecimals);

  return {
    str,
    strValue,
    tv,
  };
};

const toMinMax = (value: string | undefined, valueDecimals: number) => {
  if (!value) return undefined;
  if (nonAmounts.has(value)) return TV.fromHuman(value, valueDecimals);
  return TV.fromHuman(value, valueDecimals);
};
