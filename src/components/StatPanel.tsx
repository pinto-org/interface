import pdvIcon from "@/assets/protocol/PDV.png";
import podIcon from "@/assets/protocol/Pod.png";
import seedIcon from "@/assets/protocol/Seed.png";
import stalkIcon from "@/assets/protocol/Stalk.png";
import { TokenValue } from "@/classes/TokenValue";
import { formatter } from "@/utils/format";
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import TooltipSimple from "./TooltipSimple";
import Text from "./ui/Text";

interface StatPanelProps {
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

const StatPanel = ({
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
}: StatPanelProps) => {
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
        <img src={getIcon(mode)} className={`${size === "large" ? "h-12 w-12" : "h-8 w-8"}`} alt={mode.toUpperCase()} />
      )}
      <Text as="span" variant="inherit">
        {mode === "depositedValue"
          ? formatter.usd(showActionValues && mainValueChange ? mainValue.add(mainValueChange) : mainValue)
          : formatter.number(showActionValues && mainValueChange ? mainValue.add(mainValueChange) : mainValue)}
      </Text>
      {showActionValues && mainValueChange && mainValueChange?.abs().gt(0.001) && (
        <Text
          variant={size === "large" ? "h1" : "h3"}
          className={`ml-2 ${
            mainValueChange.lt(0)
              ? "text-pinto-gray-4"
              : mode === "depositedValue"
                ? "text-pinto-green-4"
                : mode === "stalk"
                  ? "text-pinto-stalk-gold"
                  : mode === "seeds"
                    ? "text-pinto-seed-silver"
                    : "text-pinto-pod-bronze"
          }`}
        >
          {mainValueChange.gt(0) ? "+" : ""}
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
          {showActionValues && actionValue ? (
            <>
              <span>{formatter.pdv(secondaryValue.add(actionValue))}</span>
              <span className="text-pinto-green-4">{`+${formatter.number(actionValue)}`}</span>
            </>
          ) : (
            <span>{formatter.pdv(secondaryValue)}</span>
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
        <div className={`${showActionValues ? "opacity-0" : "opacity-100"}`}>
          Claimable Stalk:
          <Text as="span" variant="inherit" color="green4" className="pl-2">
            {secondaryValue.gt(0) ? "+" : ""}
            {formatter.noDec(secondaryValue)}
          </Text>
        </div>
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
        <div className={`${showActionValues ? "opacity-0" : "opacity-100"}`}>
          Claimable Seed:
          <Text as="span" variant="inherit" color="green4" className="pl-2">
            {secondaryValue.gt(0) ? "+" : ""}
            {formatter.noDec(secondaryValue)}
          </Text>
        </div>
      )}
      {mode === "pods" && `Next position in line: ${secondaryValue.toHuman("short")}`}
    </Text>
  );

  return (
    <div className={`relative`}>
      <div className={`flex flex-col items-center gap-2 ${className}`}>
        <div data-action-target={`${mode}-stats`} className={mainValue.eq(0) ? "opacity-[0.4]" : "opacity-100"}>
          <Text variant="body">{`My ${mode === "stalk" ? "Stalk" : mode === "seeds" ? "Seed" : mode === "pods" ? "Pods" : "deposited value"}`}</Text>
        </div>
        <Text variant={size === "large" ? "h1" : "h3"} className={mainValue.eq(0) ? "opacity-[0.4]" : "opacity-100"}>
          <ValueDisplay />
        </Text>
        <div className="flex flex-row gap-1 items-center">
          <div className={mainValue.eq(0) ? "opacity-[0.4]" : "opacity-100"}>
            <SecondaryDisplay />
          </div>
          {tooltipContent && (
            <TooltipSimple
              content={tooltipContent}
              variant={mode === "stalk" ? "stalk" : mode === "seeds" ? "seed" : mode === "pods" ? "pod" : "gray"}
              opaque={mainValue.eq(0)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default StatPanel;
