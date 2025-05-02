import { cn } from "@/utils/utils";
import * as React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  containerClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, containerClassName, type, startIcon, endIcon, ...props }, ref) => {
    return (
      <div className={cn("relative", containerClassName)}>
        {startIcon && <div className="absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none">{startIcon}</div>}
        <input
          type={type}
          className={cn(
            "flex h-12 w-full rounded-[0.75rem] border border-input bg-white px-3 py-1 text-[1.25rem] text-black shadow-none transition-colors file:border-0 file:bg-transparent file:text-[1.25rem] file:font-medium placeholder:text-pinto-gray-3 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
            startIcon && "pl-10",
            endIcon && "pr-10",
            className,
          )}
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
