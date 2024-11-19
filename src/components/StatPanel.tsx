import pdvIcon from "@/assets/protocol/PDV.png";
import podIcon from "@/assets/protocol/Pod.png";
import seedIcon from "@/assets/protocol/Seed.png";
import stalkIcon from "@/assets/protocol/Stalk.png";
import { TokenValue } from "@/classes/TokenValue";
import { formatter } from "@/utils/format";
import { ReactNode } from "react";
import TooltipSimple from "./TooltipSimple";
import DenominationSwitcher from "./ui/DenominationSwitcher";
import Text from "./ui/Text";

interface StatPanelProps {
  mode: "depositedValue" | "stalk" | "seeds" | "pods";
  mainValue: TokenValue;
  secondaryValue: TokenValue;
  auxValue?: TokenValue;
  mainValueChange?: TokenValue;
  actionValue?: TokenValue;
  actionText?: string;
  altTooltipContent?: ReactNode;
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
  auxValue,
  mainValueChange,
  actionValue,
  altTooltipContent,
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
    <div className="flex flex-row gap-1 items-center whitespace-nowrap">
      {mode !== "depositedValue" && (
        <img src={getIcon(mode)} className={`${size === "large" ? "h-12 w-12" : "h-8 w-8"}`} alt={mode.toUpperCase()} />
      )}
      {!(mainValue.eq(0) && auxValue?.gt(0)) && (
        <Text as="span" variant="inherit" className="tracking-[0.01em]">
          {mode === "depositedValue"
            ? formatter.usd(showActionValues && mainValueChange ? mainValue : mainValue)
            : formatter.number(showActionValues && mainValueChange ? mainValue : mainValue)}
        </Text>
      )}
      {auxValue?.gt(0) && !showActionValues && (
        <TooltipSimple content={"This Stalk is germinating."}>
          <Text as="span" variant="inherit" className="tracking-[0.01em] text-pinto-off-green/60">
            {formatter.number(auxValue, { showPositiveSign: !(mainValue.eq(0) && auxValue && auxValue.gt(0)) })}
          </Text>
        </TooltipSimple>
      )}
      {showActionValues && mainValueChange && mainValueChange?.abs().gt(0.01) && (
        <Text
          variant={size === "large" ? "h1" : "h3"}
          className={`pl-2 tracking-[0.01em] ${
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
          {formatter.number(mainValueChange, { showPositiveSign: true })}
        </Text>
      )}
    </div>
  );

  const SecondaryDisplay = () => (
    <Text color="light" size="body" weight="thin">
      {mode === "depositedValue" && (
        <span className="inline-flex items-center gap-1">
          {showActionValues && actionValue && actionValue.gt(0.01) ? (
            <>
              <img src={getIcon(mode)} className="h-4 w-6" alt={mode.toUpperCase()} />
              <span>{formatter.pdv(secondaryValue)}</span>
              <span className="text-pinto-green-4">{`+${formatter.pdv(actionValue)}`}</span>
            </>
          ) : (
            <>
              <img src={getIcon(mode)} className="h-4 w-6" alt={mode.toUpperCase()} />
              <span>{formatter.pdv(secondaryValue)}</span>
              <DenominationSwitcher />
            </>
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
        <div className={`${showActionValues || secondaryValue.lt(0.01) ? "opacity-0" : "opacity-100"}`}>
          Claimable Stalk:
          <Text as="span" variant="inherit" color="green4" className="pl-2">
            {formatter.twoDec(secondaryValue, { showPositiveSign: true })}
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
        <div className={`${showActionValues || secondaryValue.lt(0.01) ? "opacity-0" : "opacity-100"}`}>
          Claimable Seeds:
          <Text as="span" variant="inherit" color="green4" className="pl-2">
            {formatter.twoDec(secondaryValue, { showPositiveSign: true })}
          </Text>
        </div>
      )}
      {mode === "pods" && `Next position in line: ${secondaryValue.toHuman("short")}`}
    </Text>
  );

  const TitleDisplay = () => (
    <div
      data-action-target={`${mode}-stats`}
      className={
        mainValue.add(auxValue || TokenValue.ZERO).eq(0) && !showActionValues
          ? "opacity-[0.4]"
          : showActionValues && secondaryValue.gt(0.01)
            ? "opacity-100"
            : "opacity-100"
      }
    >
      <Text variant="body">{`My ${mode === "stalk" ? "Stalk" : mode === "seeds" ? "Seeds" : mode === "pods" ? "Pods" : "Deposited value"}`}</Text>
    </div>
  );

  const MainValueDisplay = () => (
    <Text
      variant={size === "large" ? "h1" : "h3"}
      className={
        mainValue.add(auxValue || TokenValue.ZERO).eq(0) && !showActionValues
          ? "opacity-[0.4]"
          : showActionValues && secondaryValue.gt(0.01)
            ? "opacity-100"
            : "opacity-100"
      }
    >
      <ValueDisplay />
    </Text>
  );

  return (
    <div className={`relative min-w-[275px]`}>
      <div className={`flex flex-col items-center gap-2 ${className}`}>
        {altTooltipContent ? (
          <>
            <TooltipSimple content={altTooltipContent}>
              <div>
                <TitleDisplay />
              </div>
            </TooltipSimple>
            <TooltipSimple content={altTooltipContent}>
              <div>
                <MainValueDisplay />
              </div>
            </TooltipSimple>
          </>
        ) : (
          <>
            <TitleDisplay />
            <MainValueDisplay />
          </>
        )}
        <div className="flex flex-row gap-1 items-center">
          <div className={secondaryValue.eq(0) ? "opacity-[0.4]" : "opacity-100"}>
            <SecondaryDisplay />
          </div>
          {tooltipContent && (
            <TooltipSimple
              content={tooltipContent}
              variant={mode === "stalk" ? "stalk" : mode === "seeds" ? "seeds" : mode === "pods" ? "pods" : "gray"}
              opaque={mainValue.eq(0)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default StatPanel;
