import { TV } from "@/classes/TokenValue";
import { Col, Row } from "@/components/Container";
import { cn } from "@/utils/utils";
import React from "react";

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

type ButtonRadioProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export { Input, InputFieldBorderWrapper };

// ────────────────────────────────────────────────────────────────────────────────
// Helper Functions
// ────────────────────────────────────────────────────────────────────────────────

const nonAmounts = new Set<string>([".", ""]);

const cleanAmount = (value: string) => value.replace(/[^0-9.]/g, "");

export interface SanitizedNumericStrInput {
  str: string;
  strValue: string;
  tv: TV | undefined;
  nonAmount: boolean;
}

const sanitizedNonAmount: SanitizedNumericStrInput = {
  str: "",
  strValue: "",
  tv: undefined,
  nonAmount: true,
} as const;

export const isValidNumericInputValue = (value: string) => !nonAmounts.has(value);

/**
 * Sanitize the user input
 */
export const sanitizeNumericInputValue = (value: string, valueDecimals: number): SanitizedNumericStrInput => {
  const obj = { ...sanitizedNonAmount, str: value };

  // Early return for special cases
  if (nonAmounts.has(value)) {
    return obj;
  }

  // remove all non-numeric characters
  const cleaned = cleanAmount(value);
  if (!cleaned) {
    return obj;
  }

  // treat all values after the first decimal point as decimal place.
  const [pre, ...post] = cleaned.split(".");
  const decimals = post.join("");

  const endsWithDot = cleaned.endsWith(".") && !post.length;
  const startsWithDot = cleaned.startsWith(".") && !pre.length;

  const mayDot = !!post.length || endsWithDot ? "." : "";
  const back = decimals.slice(0, valueDecimals);

  if (startsWithDot) {
    obj.str = `.${back}`;
    obj.strValue = `0.${back}`;
  } else if (endsWithDot) {
    obj.str = `${pre}.`;
    obj.strValue = `${pre}.0`;
  } else {
    obj.strValue = `${pre}${mayDot}${back}`;
    obj.str = obj.strValue;
  }

  obj.tv = TV.fromHuman(obj.strValue, valueDecimals);
  obj.nonAmount = false;

  return obj;
};
