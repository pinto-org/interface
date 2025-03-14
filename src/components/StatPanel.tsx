import pdvIcon from "@/assets/protocol/PDV.png";
import podIcon from "@/assets/protocol/Pod.png";
import seedIcon from "@/assets/protocol/Seed.png";
import stalkIcon from "@/assets/protocol/Stalk.png";
import { TokenValue } from "@/classes/TokenValue";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatter } from "@/utils/format";
import { ReactNode } from "react";
import TooltipSimple from "./TooltipSimple";
import DenominationSwitcher from "./ui/DenominationSwitcher";

interface StatPanelProps {
  mode: "depositedValue" | "stalk" | "seeds" | "pods";
  title: string;
  mainValue: TokenValue;
  secondaryValue: TokenValue;
  altDisplay?: ReactNode;
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
  isBalancesLoading?: boolean;
}

const StatPanel = ({
  mode,
  title,
  mainValue = TokenValue.ZERO,
  secondaryValue = TokenValue.ZERO,
  altDisplay,
  auxValue,
  mainValueChange,
  actionValue,
  altTooltipContent,
  tooltipContent,
  size = "small",
  variant = "overview",
  className,
  showActionValues = false,
  isBalancesLoading = false,
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
        <img
          src={getIcon(mode)}
          className={`${size === "large" ? "h-8 w-8 sm:h-12 sm:w-12" : "h-6 w-6 sm:h-8 sm:w-8"}`}
          alt={mode.toUpperCase()}
        />
      )}
      {!(mainValue.eq(0) && auxValue?.gt(0)) && (
        <span className={`${size === "large" ? "pinto-h2" : "pinto-body-light"} sm:pinto-inherit tracking-[0.01em]`}>
          {isBalancesLoading ? (
            <Skeleton
              className={`flex ${size === "large" ? "w-24 h-8 sm:w-32 sm:h-12" : "w-20 h-6 sm:w-24 sm:h-8"} rounded-[0.75rem]`}
            />
          ) : mode === "depositedValue" ? (
            `$${formatter.number(showActionValues && mainValueChange ? mainValue : mainValue, {
              minDecimals: 2,
              maxDecimals: 2,
              allowZero: true,
            })}`
          ) : (
            formatter.number(showActionValues && mainValueChange ? mainValue : mainValue)
          )}{" "}
        </span>
      )}
      {auxValue?.gt(0) && !showActionValues && (
        <TooltipSimple showOnMobile content={"This Stalk is germinating."}>
          <span
            className={`${size === "large" ? "pinto-h2" : "pinto-body-light"} sm:pinto-inherit sm:text-pinto-off-green/60 text-pinto-off-green/60 ml-1`}
          >
            {isBalancesLoading ? (
              <Skeleton
                className={`flex ${size === "large" ? "w-16 h-8 sm:w-20 sm:h-12" : "w-14 h-6 sm:w-16 sm:h-8"} rounded-[0.75rem]`}
              />
            ) : (
              formatter.number(auxValue, {
                showPositiveSign: !(mainValue.eq(0) && auxValue && auxValue.gt(0)),
              })
            )}
          </span>
        </TooltipSimple>
      )}
      {showActionValues && mainValueChange && mainValueChange?.abs().gt(0.01) && (
        <div
          className={`pl-2 tracking-[0.01em] ${
            mainValueChange.lt(0)
              ? "text-pinto-gray-4 sm:text-pinto-gray-4"
              : mode === "depositedValue"
                ? "text-pinto-green-4 sm:text-pinto-green-4"
                : mode === "stalk"
                  ? "text-pinto-stalk-gold sm:text-pinto-stalk-gold"
                  : mode === "seeds"
                    ? "text-pinto-seed-silver sm:text-pinto-seed-silver"
                    : "text-pinto-pod-bronze sm:text-pinto-pod-bronze"
          }

        ${size === "large" ? "pinto-h2 sm:pinto-h1" : "pinto-body-light sm:pinto-h3"}`}
        >
          {isBalancesLoading ? (
            <Skeleton
              className={`flex ${size === "large" ? "w-20 h-8 sm:w-24 sm:h-12" : "w-16 h-6 sm:w-20 sm:h-8"} rounded-[0.75rem]`}
            />
          ) : (
            formatter.number(mainValueChange, {
              showPositiveSign: true,
            })
          )}
        </div>
      )}
    </div>
  );

  const SecondaryDisplay = () => (
    <div className="pinto-sm sm:pinto-body font-thin sm:font-thin text-pinto-light sm:text-pinto-light">
      {mode === "depositedValue" && (
        <span className="inline-flex items-center gap-1">
          {showActionValues && actionValue && actionValue.gt(0.01) ? (
            <>
              <img src={getIcon(mode)} className="h-4 w-6" alt={mode.toUpperCase()} />
              <span>
                {isBalancesLoading ? (
                  <Skeleton className="flex w-20 h-4 sm:w-24 sm:h-6 rounded-[0.75rem]" />
                ) : (
                  `${formatter.number(secondaryValue, { minDecimals: 2, maxDecimals: 2, allowZero: true })} PDV`
                )}
              </span>
              <span className="text-pinto-green-4">
                {isBalancesLoading ? (
                  <Skeleton className="flex w-16 h-4 sm:w-20 sm:h-6 rounded-[0.75rem]" />
                ) : (
                  `+${formatter.pdv(actionValue)}`
                )}
              </span>
            </>
          ) : (
            <>
              <img src={getIcon(mode)} className="h-4 w-6" alt={mode.toUpperCase()} />
              <span>
                {isBalancesLoading ? (
                  <Skeleton className="flex w-20 h-4 sm:w-24 sm:h-6 rounded-[0.75rem]" />
                ) : (
                  `${formatter.number(secondaryValue, { minDecimals: 2, maxDecimals: 2, allowZero: true })} PDV`
                )}
              </span>
              <DenominationSwitcher />
            </>
          )}
        </span>
      )}
      {mode === "stalk" && variant === "overview" && (
        <>
          <span className="text-pinto-gray-5">
            {isBalancesLoading ? (
              <Skeleton className="flex w-16 h-4 sm:w-20 sm:h-6 rounded-[0.75rem]" />
            ) : mainValue.lt(0.01) ? (
              "0.00"
            ) : (
              formatter.xDec(secondaryValue, 3)
            )}
            %
          </span>{" "}
          {showActionValues && actionValue && (
            <span className="text-pinto-stalk-gold">
              {isBalancesLoading ? (
                <Skeleton className="flex w-16 h-4 sm:w-20 sm:h-6 rounded-[0.75rem]" />
              ) : (
                `+${formatter.xDec(actionValue, 3)}%`
              )}
            </span>
          )}{" "}
          of Stalk supply
        </>
      )}
      {mode === "stalk" && variant === "silo" && (
        <div className={`${showActionValues || secondaryValue.lt(0.01) ? "opacity-0" : "opacity-100"}`}>
          Claimable Stalk:
          <span className="pl-2 text-pinto-stalk-gold">
            {isBalancesLoading ? (
              <Skeleton className="flex w-20 h-4 sm:w-24 sm:h-6 rounded-[0.75rem]" />
            ) : (
              formatter.twoDec(secondaryValue, { showPositiveSign: true })
            )}
          </span>
        </div>
      )}
      {mode === "seeds" && variant === "overview" && (
        <span className="inline-flex gap-1">
          {showActionValues && actionValue ? (
            <span className="text-pinto-seed-silver">
              {isBalancesLoading ? (
                <Skeleton className="flex w-20 h-4 sm:w-24 sm:h-6 rounded-[0.75rem]" />
              ) : (
                `+${formatter.twoDec(mainValue.add(actionValue).div(10000))}`
              )}
            </span>
          ) : (
            <span className="text-pinto-gray-5">
              {isBalancesLoading ? (
                <Skeleton className="flex w-20 h-4 sm:w-24 sm:h-6 rounded-[0.75rem]" />
              ) : (
                `+${formatter.twoDec(mainValue.div(10000))}`
              )}
            </span>
          )}
          <span>Grown Stalk per Season</span>
        </span>
      )}
      {mode === "seeds" && variant === "silo" && (
        <div className={`${showActionValues || secondaryValue.lt(0.01) ? "opacity-0" : "opacity-100"} pinto-inherit`}>
          Claimable Seeds:
          <span className="pl-2 text-pinto-seed-silver">
            {isBalancesLoading ? (
              <Skeleton className="flex w-20 h-4 sm:w-24 sm:h-6 rounded-[0.75rem]" />
            ) : (
              formatter.twoDec(secondaryValue, { showPositiveSign: true })
            )}
          </span>
        </div>
      )}
      {mode === "pods" && (
        <div>
          {!mainValueChange || mainValueChange.eq(0) ? (
            <div>
              Next position in line:{" "}
              <span className="text-pinto-gray-5">
                {isBalancesLoading ? (
                  <Skeleton className="flex w-20 h-4 sm:w-24 sm:h-6 rounded-[0.75rem]" />
                ) : (
                  secondaryValue.toHuman("short")
                )}
              </span>
            </div>
          ) : (
            <span className="text-pinto-pod-bronze">
              {isBalancesLoading ? (
                <Skeleton className="flex w-24 h-4 sm:w-28 sm:h-6 rounded-[0.75rem]" />
              ) : (
                `${formatter.twoDec(mainValueChange.abs())} Pods are Harvestable`
              )}
            </span>
          )}
        </div>
      )}
    </div>
  );

  const TitleDisplay = () => (
    <div
      data-action-target={`${mode}-stats`}
      className={
        mainValue.add(auxValue || TokenValue.ZERO).lt(0.01) && !showActionValues
          ? "opacity-[0.4]"
          : showActionValues && secondaryValue.gt(0.01)
            ? "opacity-100"
            : "opacity-100"
      }
    >
      <div className="pinto-sm sm:pinto-body">{title}</div>
    </div>
  );

  const MainValueDisplay = () => (
    <div
      className={`${
        mainValue.add(auxValue || TokenValue.ZERO).lt(0.01) && !showActionValues
          ? "opacity-[0.4]"
          : showActionValues && secondaryValue.gt(0.01)
            ? "opacity-100"
            : "opacity-100"
      } ${size === "large" ? "pinto-h2 sm:pinto-h1" : "pinto-body-light sm:pinto-h3"}`}
    >
      <ValueDisplay />
    </div>
  );

  return (
    <div className={`relative min-w-[17rem]`}>
      <div className={`flex flex-col items-start sm:items-center gap-2 w-full ${className}`}>
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
          <div className={mainValue.lt(0.01) ? "opacity-[0.4]" : "opacity-100"}>
            {altDisplay || <SecondaryDisplay />}
          </div>
          {tooltipContent && (
            <TooltipSimple
              content={tooltipContent}
              variant={mode === "stalk" ? "stalk" : mode === "seeds" ? "seeds" : mode === "pods" ? "pods" : "gray"}
              opaque={mainValue.lt(0.01)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default StatPanel;
