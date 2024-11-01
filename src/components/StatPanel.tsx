import pdvIcon from "@/assets/protocol/PDV.png";
import podIcon from "@/assets/protocol/Pod.png";
import seedIcon from "@/assets/protocol/Seed.png";
import stalkIcon from "@/assets/protocol/Stalk.png";
import { TokenValue } from "@/classes/TokenValue";
import { formatter } from "@/utils/format";
import { ReactNode } from "react";
import TooltipSimple from "./TooltipSimple";
import Text from "./ui/Text";

interface StatPanel {
  mode: "depositedValue" | "stalk" | "seeds" | "pods";
  mainValue: TokenValue;
  secondaryValue: TokenValue;
  mainValueChange?: TokenValue;
  tooltipContent?: ReactNode;
  size?: "large" | "small" | undefined;
  variant?: "overview" | "silo";
}

export default function StatPanel({
  mode,
  mainValue = TokenValue.ZERO,
  secondaryValue = TokenValue.ZERO,
  tooltipContent,
  size = "small",
  variant = "overview",
}: StatPanel) {
  return (
    <div className="flex flex-col items-center gap-2">
      <Text variant="body">
        {mode === "depositedValue" && "My deposited value"}
        {mode === "stalk" && "My Stalk"}
        {mode === "seeds" && "My Seeds"}
        {mode === "pods" && "My Pods"}
      </Text>
      <Text variant={size === "large" ? "h1" : "h3"}>
        {mode === "depositedValue" && `${formatter.usd(mainValue)}`}
        {mode === "stalk" && (
          <div className="flex flex-row gap-1 items-center">
            <img src={stalkIcon} className={`${size === "large" ? "h-12 w-12" : "h-8 w-8"}`} alt="STALK" />
            <Text as="span" variant="inherit">
              {mainValue.toHuman("short")}
            </Text>
          </div>
        )}
        {mode === "seeds" && (
          <div className="flex flex-row gap-1 items-center">
            <img src={seedIcon} className={`${size === "large" ? "h-12 w-12" : "h-8 w-8"}`} alt="SEED" />
            <Text variant="inherit">{formatter.number(mainValue)}</Text>
          </div>
        )}
        {mode === "pods" && (
          <div className="flex flex-row gap-1 items-center">
            <img src={podIcon} className={`${size === "large" ? "h-12 w-12" : "h-8 w-8"}`} alt="PODS" />
            <Text as="span" variant="inherit">
              {formatter.number(mainValue)}
            </Text>
          </div>
        )}
      </Text>
      <div className="flex flex-row gap-1 items-center">
        {mode === "depositedValue" && (
          <>
            <img src={pdvIcon} className="scale-[1.2]" alt="PDV" />
            <Text variant="body-light" color="light">
              {formatter.pdv(secondaryValue)}
            </Text>
          </>
        )}
        {mode === "stalk" && (
          <>
            <Text variant="body-light" color="light">
              {variant === "overview" && `${secondaryValue.toHuman("short")}% of Stalk supply`}
              {variant === "silo" && (
                <>
                  Claimable Stalk:
                  <Text as="span" variant="inherit" color="green4" className="pl-2">
                    {secondaryValue.gt(0) ? "+" : ""}
                    {formatter.noDec(secondaryValue)}
                  </Text>
                </>
              )}
            </Text>
            {tooltipContent && <TooltipSimple content={tooltipContent} variant="stalk" />}
          </>
        )}
        {mode === "seeds" && (
          <>
            <Text variant="body-light" color="light">
              {variant === "overview" && `+${formatter.twoDec("short")} Grown Stalk per Season`}
              {variant === "silo" && (
                <>
                  Claimable Seeds:
                  <Text as="span" variant="body-light" color="green4" className="pl-2">
                    {secondaryValue.gt(0) ? "+" : ""}
                    {formatter.noDec(secondaryValue)}
                  </Text>
                </>
              )}
            </Text>
            {tooltipContent && <TooltipSimple content={tooltipContent} variant="seed" />}
          </>
        )}
        {mode === "pods" && (
          <>
            <div className="text-[1.25rem] text-pinto-gray-4 font-[300] leading-none">
              Next position in line: {secondaryValue.toHuman("short")}
            </div>
            {tooltipContent && <TooltipSimple content={tooltipContent} variant="pod" />}
          </>
        )}
      </div>
    </div>
  );
}
