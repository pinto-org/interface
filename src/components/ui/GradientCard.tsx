import { cn } from "@/utils/utils";
import clsx from "clsx";
import { forwardRef } from "react";

type GradientCardVariant = "light" | "morning";

export interface GradientCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant: GradientCardVariant;
}

const classes = {
  border: {
    morning: clsx("bg-morning-border"),
    light: clsx("bg-gradient-lighter-2"),
  },
  bg: {
    morning: clsx("bg-morning-light"),
    light: clsx("bg-gradient-lighter-1"),
  },
} as const;

const GradientCard = forwardRef<HTMLDivElement, GradientCardProps>(
  ({ children, className, variant, ...props }, ref) => {
    return (
      <div className="flex flex-col w-full items-center justify-center">
        {/* Outer Div: Gradient Border */}
        <div className={cn("rounded-xl w-full bg-morning-border p-[1px]", classes.border[variant])}>
          {/* Middle Div: Background Overlay to Handle Color Discrepancy */}
          <div className={"rounded-xl w-full, bg-gradient-light"}>
            {/* Inner Div: Actual Content Area */}
            <div
              className={cn("rounded-xl flex flex-col items-center justify-center w-full h-full", classes.bg[variant])}
            >
              <div {...props} className={className} ref={ref}>
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

export default GradientCard;
