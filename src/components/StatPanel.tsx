import pdvIcon from "@/assets/protocol/PDV.png";
import podIcon from "@/assets/protocol/Pod.png";
import seedIcon from "@/assets/protocol/Seed.png";
import stalkIcon from "@/assets/protocol/Stalk.png";
import { TokenValue } from "@/classes/TokenValue";
import { formatter } from "@/utils/format";
import { ReactNode, RefObject, forwardRef } from "react";
import { useNavigate } from "react-router-dom";
import ActionButton from "./ActionButton";
import TooltipSimple from "./TooltipSimple";
import Text from "./ui/Text";

interface StatPanel {
  mode: "depositedValue" | "stalk" | "seeds" | "pods";
  mainValue: TokenValue;
  secondaryValue: TokenValue;
  mainValueChange?: TokenValue;
  actionValue?: TokenValue;
  actionText?: string;
  tooltipContent?: ReactNode;
  size?: "large" | "small";
  variant?: "overview" | "silo";
  className?: string;
  showActionValues?: boolean;
}

const StatPanel = forwardRef<HTMLDivElement, StatPanel>(
  (
    {
      mode,
      mainValue = TokenValue.ZERO,
      secondaryValue = TokenValue.ZERO,
      mainValueChange,
      actionValue,
      tooltipContent,
      size = "small",
      variant = "overview",
      className,
      showActionValues = false,
    },
    ref,
  ) => {
    const navigate = useNavigate();

    const getIcon = (iconMode: typeof mode) =>
      ({
        stalk: stalkIcon,
        seeds: seedIcon,
        pods: podIcon,
        depositedValue: pdvIcon,
      })[iconMode];

    const ValueDisplay = () => (
      <div className="flex flex-row gap-1 items-center">
        {mode !== "depositedValue" && (
          <img
            src={getIcon(mode)}
            className={`${size === "large" ? "h-12 w-12" : "h-8 w-8"}`}
            alt={mode.toUpperCase()}
          />
        )}
        <Text as="span" variant="inherit">
          {mode === "depositedValue"
            ? formatter.usd(showActionValues && mainValueChange ? mainValue.add(mainValueChange) : mainValue)
            : formatter.number(showActionValues && mainValueChange ? mainValue.add(mainValueChange) : mainValue)}
        </Text>
        {showActionValues && mainValueChange?.gt(0) && (
          <Text
            variant={size === "large" ? "h1" : "h3"}
            className={`ml-2 ${
              mode === "depositedValue"
                ? "text-pinto-green-4"
                : mode === "stalk"
                  ? "text-pinto-stalk-gold"
                  : mode === "seeds"
                    ? "text-pinto-seed-silver"
                    : "text-pinto-pod-bronze"
            }`}
          >
            {mainValueChange.gt(0) ? "+ " : ""}
            {formatter.number(mainValueChange)}
          </Text>
        )}
      </div>
    );

    const SecondaryDisplay = () => (
      <Text color="light" size="body" weight="thin">
        {mode === "depositedValue" && (
          <span className="inline-flex items-center gap-1">
            <img src={getIcon(mode)} className="h-4 w-6" alt={mode.toUpperCase()} />
            {formatter.pdv(secondaryValue)}
            {showActionValues && actionValue && (
              <span className="text-pinto-green-4">{`+${formatter.number(actionValue)}`}</span>
            )}
          </span>
        )}
        {mode === "stalk" && variant === "overview" && (
          <>
            <span>{formatter.twoDec(secondaryValue)}%</span>{" "}
            {showActionValues && actionValue && (
              <span className="text-pinto-stalk-gold">+{formatter.twoDec(actionValue)}%</span>
            )}{" "}
            of Stalk supply
          </>
        )}
        {mode === "stalk" && variant === "silo" && (
          <>
            Claimable Stalk:
            <Text as="span" variant="inherit" color="green4" className="pl-2">
              {secondaryValue.gt(0) ? "+ " : ""}
              {formatter.noDec(secondaryValue)}
            </Text>
          </>
        )}
        {mode === "seeds" && variant === "overview" && (
          <span className="inline-flex gap-1">
            {showActionValues && actionValue ? (
              <span className="text-pinto-seed-silver">{`+${formatter.twoDec(mainValue.add(actionValue).div(10000))}`}</span>
            ) : (
              <span>{`+${formatter.twoDec(mainValue.div(10000))}`}</span>
            )}
            <span>Grown Stalk per Season</span>
          </span>
        )}
        {mode === "seeds" && variant === "silo" && (
          <>
            Claimable Seed:
            <Text as="span" variant="inherit" color="green4" className="pl-2">
              {secondaryValue.gt(0) ? "+ " : ""}
              {formatter.noDec(secondaryValue)}
            </Text>
          </>
        )}
        {mode === "pods" && `Next position in line: ${secondaryValue.toHuman("short")}`}
      </Text>
    );

    return (
      <div className="relative" data-action-target={`${mode}-stats`} ref={ref}>
        <div className={`flex flex-col items-center gap-2 ${className}`}>
          <Text variant="body">{`My ${mode === "stalk" ? "Stalk" : mode === "seeds" ? "Seed" : mode === "pods" ? "Pods" : "deposited value"}`}</Text>
          <Text variant={size === "large" ? "h1" : "h3"}>
            <ValueDisplay />
          </Text>
          <div className="flex flex-row gap-1 items-center">
            <SecondaryDisplay />
            {tooltipContent && (
              <TooltipSimple
                content={tooltipContent}
                variant={mode === "stalk" ? "stalk" : mode === "seeds" ? "seed" : "pod"}
              />
            )}
          </div>
        </div>
      </div>
    );
  },
);

StatPanel.displayName = "StatPanel";

export default StatPanel;
