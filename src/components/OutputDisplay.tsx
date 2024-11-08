import { InternalToken, Token } from "@/utils/types";
import { cn, exists } from "@/utils/utils";
import { forwardRef } from "react";
import { RightArrowIcon } from "./Icons";
import IconImage from "./ui/IconImage";
import Text from "./ui/Text";

export interface OutputDisplayProps {
  children: React.ReactNode;
  title?: string;
}

const OutputDisplay = ({ children, title = "I receive" }: OutputDisplayProps) => {
  return (
    <div className="flex flex-col w-full gap-4">
      <Text variant="body-light" color="light">
        {title}
      </Text>
      <div className="flex flex-col gap-2 px-2">{children}</div>
    </div>
  );
};

export interface DisplayItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  label: string;
}

const DisplayItem = forwardRef<HTMLDivElement, DisplayItemProps>(({ children, label, className, ...props }, ref) => {
  return (
    <div {...props} ref={ref} className={cn("flex flex-row justify-between items-center py-2", className)}>
      <Text variant="body-light" color="light">
        {label}
      </Text>
      {children}
    </div>
  );
});

export interface DisplayValueProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  suffix?: string;
  showArrow?: boolean;
  token?: Token | InternalToken;
  delta?: "up" | "down" | number;
}

const DisplayValue = forwardRef<HTMLDivElement, DisplayValueProps>(
  ({ value, suffix = "", showArrow, token, delta, className, ...props }, ref) => {
    const isPositiveDelta = delta ? (typeof delta === "number" ? delta > 0 : delta === "up") : false;

    return (
      <div {...props} ref={ref} className={cn("flex flex-row items-center gap-2", className)}>
        {showArrow && exists(delta) ? (
          <div className={`relative bottom-[2px] ${isPositiveDelta ? "-rotate-90" : "rotate-90"}`}>
            <RightArrowIcon width={24} height={24} color={isPositiveDelta ? "#387F5C" : "#FF0000"} />
          </div>
        ) : null}
        {token ? <IconImage src={token.logoURI} size={6} nudge={2} /> : null}
        <Text variant="h4" weight="light" color={delta ? (isPositiveDelta ? "green4" : "error") : "primary"}>
          {`${value}${suffix ? ` ${suffix}` : ""}`}
        </Text>
      </div>
    );
  },
);

OutputDisplay.Item = DisplayItem;

OutputDisplay.Value = DisplayValue;

export default OutputDisplay;
