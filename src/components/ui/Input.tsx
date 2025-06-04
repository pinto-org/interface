import { TV } from "@/classes/TokenValue";
import { Col, Row } from "@/components/Container";
import { formatter } from "@/utils/format";
import { useDebouncedEffect } from "@/utils/useDebounce";
import { cn, exists } from "@/utils/utils";
import React, { useCallback, useEffect, useState } from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  below?: JSX.Element;
  error?: boolean;
  label?: string | JSX.Element;
  containerClassName?: string;
}

export interface InputFieldBorderWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  error?: boolean;
  disabled?: boolean;
}

const InputFieldBorderWrapper = React.forwardRef<HTMLDivElement, InputFieldBorderWrapperProps>(
  ({ className, error, disabled, ...props }, ref) => {
    return (
      <Col
        className={cn(
          "w-full px-3 py-1 rounded-lg overflow-hidden box-border content-center",
          "border border-pinto-gray-blue bg-white focus-within:ring-ring",
          "shadow-none transition-colors placeholder:text-pinto-gray-3 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
          "focus-within:outline-none focus-visible:outline-none", // focus behavior
          !disabled && "focus-within:ring-1 focus-within:ring-ring", // non-disabled behavior. Prevent focus-within
          error && "border-pinto-error focus-within:ring-[0.5px] focus-within:ring-pinto-error", // error behavior
          disabled && "pointer-events-none cursor-not-allowed bg-transparent opacity-50", // Disabled
          className,
        )}
        ref={ref}
        {...props}
      >
        {props.children}
      </Col>
    );
  },
);

InputFieldBorderWrapper.displayName = "InputFieldBorderWrapper";

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, containerClassName, type, error, disabled, startIcon, endIcon, below, ...props }, ref) => {
    return (
      <InputFieldBorderWrapper error={error} disabled={disabled} className={containerClassName}>
        <Row className={cn("flex w-full")}>
          {startIcon && <div className="flex-shrink-0">{startIcon}</div>}
          <input
            type="text"
            ref={ref}
            className={cn(
              "flex w-full flex-row min-w-0 bg-white box-border py-1.5",
              "text-[1rem] sm:text-[1.25rem] text-black placeholder:text-pinto-gray-3 shadow-none focus-visible:outline-none", // Typography
              "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none", // Input
              className,
            )}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? "invalid-input" : undefined}
            inputMode="numeric"
            {...props}
          />
          {endIcon && <div className="flex-shrink-0">{endIcon}</div>}
        </Row>
        {below && <>{below}</>}
      </InputFieldBorderWrapper>
    );
  },
);

Input.displayName = "Input";

export { Input, InputFieldBorderWrapper };

interface NumberInputProps extends Omit<InputProps, "value" | "type" | "min" | "max"> {
  value: TV | undefined;
  setValue: React.Dispatch<React.SetStateAction<TV | undefined>> | ((value: TV | undefined) => void);
  error?: boolean;
  isPercent?: boolean;
  valueDecimals: number;
  shouldClamp?: boolean;
  min?: TV;
  max?: TV;
}

const initTVState = (value: TV | undefined, valueDecimals: number) => {
  if (!value) {
    return "";
  }
  return formatter.number(value.toHuman(), { minDecimals: 0, maxDecimals: valueDecimals });
};

export const TokenValueInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      value,
      valueDecimals,
      shouldClamp = false,
      min,
      max,
      placeholder = "0.00",
      isPercent = false,
      setValue,
      ...props
    },
    ref,
  ) => {
    const [displayValue, setDisplayValue] = useState(initTVState(value, valueDecimals));

    useEffect(() => {
      console.log("value: ", value?.toHuman());
    }, [value]);

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
        const sanitized = sanitizeInputValue(value, valueDecimals);

        setDisplayValue(sanitized.str);
        props.onChange?.(e);
      },
      [props.onChange, valueDecimals],
    );

    // Handle the blur event
    const handleBlur = useCallback(() => {
      const sanitized = sanitizeInputValue(displayValue, valueDecimals);
      if (!shouldClamp) {
        if (sanitized.nonAmount) {
          setDisplayValue(sanitized.str);
        } else {
          setDisplayValue(formatter.number(sanitized.strValue, { minDecimals: 0, maxDecimals: valueDecimals }));
        }
        return;
      }

      if (sanitized.tv) {
        const clamped = shouldClamp ? clamp(sanitized.tv) : sanitized.tv;
        if (!clamped?.eq(sanitized.tv)) {
          if (sanitized.nonAmount) {
            setDisplayValue(sanitized.str);
          } else {
            setDisplayValue(formatter.number(clamped.toHuman(), { minDecimals: 0, maxDecimals: valueDecimals }));
            setValue(clamped);
          }
        }
      } else {
        setDisplayValue(sanitized.str);
      }
    }, [displayValue, valueDecimals, shouldClamp, clamp, setValue]);

    const handleOnFocus = useCallback(() => {
      const sanitized = sanitizeInputValue(displayValue, valueDecimals);
      setDisplayValue(sanitized.str);
    }, [displayValue, valueDecimals]);

    // debounce the value change
    useDebouncedEffect(
      () => {
        const sanitized = sanitizeInputValue(displayValue, valueDecimals);
        setValue(sanitized.tv);
      },
      [displayValue, valueDecimals, setValue],
      50,
    );

    return (
      <Input
        type="text"
        ref={ref}
        value={displayValue}
        placeholder={placeholder}
        onChange={handleChange}
        onFocus={handleOnFocus}
        onBlur={handleBlur}
        inputMode="numeric"
        {...props}
      />
    );
  },
);

TokenValueInput.displayName = "TokenValueInput";

// ────────────────────────────────────────────────────────────────────────────────
// Helper Functions
// ────────────────────────────────────────────────────────────────────────────────

const nonAmounts = new Set<string>([".", ""]);

const cleanAmount = (value: string) => value.replace(/[^0-9.]/g, "");

export const isValidInputValue = (value: string) => !nonAmounts.has(value);

/**
 * Sanitize the user input
 */
export const sanitizeInputValue = (value: string, valueDecimals: number) => {
  if (nonAmounts.has(value)) {
    return {
      str: value,
      strValue: "",
      tv: undefined,
      nonAmount: true,
    };
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
    nonAmount: false,
  };
};
