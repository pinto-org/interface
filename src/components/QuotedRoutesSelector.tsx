import { SEEDS, STALK } from "@/constants/internalTokens";
import { SiloConvertResultResult, useParseConvertRouteRoutes } from "@/hooks/silo/useSiloConvertResult";
import { SiloConvertSummary } from "@/lib/siloConvert/SiloConvert";
import { SiloConvertType } from "@/lib/siloConvert/strategies/core";
import { formatter } from "@/utils/format";
import { Token } from "@/utils/types";
import { cn } from "@/utils/utils";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { ClassNameValue } from "tailwind-merge";
import { Col, Row } from "./Container";
import { Card, CardContent, CardHeader } from "./ui/Card";
import IconImage from "./ui/IconImage";

interface QuotedRoutesSelectorProps {
  quote: SiloConvertSummary<SiloConvertType>[] | undefined;
  convertResults: SiloConvertResultResult[] | undefined;
  sortedIndexes: number[] | undefined;
  routeIndex: number | undefined;
  targetToken: Token;
  onRouteSelect: (index: number) => void;
}

interface RouteCardProps {
  result: SiloConvertResultResult;
  targetToken: Token;
  isSelected: boolean;
  onClick: () => void;
  routeIndex: number;
  summary: SiloConvertSummary<SiloConvertType>;
}

const InlineRow = ({
  label,
  value,
  className,
}: { label: string; value: JSX.Element | string; className?: ClassNameValue }) => {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <span className="text-pinto-sm-light text-pinto-light">{label}</span>
      <span className="flex flex-row items-center gap-2 text-sm-light text-pinto-primary">{value}</span>
    </div>
  );
};

function RouteCard({ result, targetToken, isSelected, onClick, summary }: RouteCardProps) {
  const parsedRoute = useParseConvertRouteRoutes();

  const routes = parsedRoute(summary);

  return (
    <div
      onClick={onClick}
      className={cn(
        "relative rounded-lg border p-4 cursor-pointer transition-all duration-200",
        "hover:shadow-sm hover:border-border-dark",
        isSelected ? "border-pinto-green-4 bg-pinto-green-1" : "border-border bg-card",
      )}
    >
      {/* Route metrics */}
      <div className="space-y-2">
        {routes.length ? (
          <InlineRow
            label="Routing"
            value={
              <Row>
                {routes.map((r, _, arr) => (
                  <div key={`convert-route-${r.address}-${r.symbol}`} className={`${arr.length > 1 ? "-ml-1" : ""}`}>
                    <IconImage src={r.logoURI} size={4} className="h-4 w-4" />
                  </div>
                ))}
              </Row>
            }
          />
        ) : null}
        {/* Token Amount */}
        <InlineRow
          label="Deposited Amount"
          className={"items-start"}
          value={
            <Col className="gap-0 items-end">
              <div className="flex flex-row items-center gap-1  text-pinto-light">
                <IconImage src={targetToken.logoURI} size={4} className="h-4 w-4" />
                {formatter.token(result.totalAmountOut, targetToken)}
              </div>
              <div className="place-self-end text-xs text-pinto-light font-thin">
                ({formatter.token(result.toBdv, targetToken)} PDV)
              </div>
            </Col>
          }
        />
        {/* Stalk */}
        <InlineRow
          label="Stalk"
          value={
            <span
              className={cn(
                "flex flex-row items-center gap-1 text-pinto-sm-light text-pinto-light",
                result.deltaStalk.gte(0) ? "text-pinto-green-4" : "text-pinto-error",
              )}
            >
              {result.deltaStalk.gt(0) ? "+" : result.deltaStalk.lt(0) ? "-" : ""}
              <IconImage src={STALK.logoURI} size={4} className="h-4 w-4" />
              {formatter.token(result.deltaStalk, STALK)}
            </span>
          }
        />
        {/* Seeds */}
        <InlineRow
          label="Seeds"
          value={
            <span
              className={cn(
                "flex flex-row items-center gap-1 text-pinto-sm-light text-pinto-light",
                result.deltaSeed.gte(0) ? "text-pinto-green-4" : "text-pinto-error",
              )}
            >
              {result.deltaSeed.gt(0) ? "+" : result.deltaSeed.lt(0) ? "-" : ""}
              <IconImage src={SEEDS.logoURI} size={4} className="h-4 w-4" />
              {formatter.token(result.deltaSeed, SEEDS)}
            </span>
          }
        />
      </div>
    </div>
  );
}

export default function QuotedRoutesSelector({
  quote,
  convertResults,
  sortedIndexes,
  routeIndex,
  targetToken,
  onRouteSelect,
}: QuotedRoutesSelectorProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Don't render if we don't have multiple routes
  if (!quote || !convertResults || !sortedIndexes || quote.length <= 1) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader
        className="cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between text-pinto-light">
          <div className="text-pinto-body-light">View Routes</div>
          <ChevronDownIcon
            className={cn(
              "h-4 w-4 text-pinto-primary transition-transform duration-200",
              isExpanded ? "rotate-180" : "",
            )}
          />
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent className="pt-0">
          <Col className="gap-4 w-full">
            {sortedIndexes.map((originalIndex, _displayIndex) => {
              const result = convertResults[originalIndex];
              const summary = quote[originalIndex];
              if (!result || !summary) return null;

              return (
                <RouteCard
                  key={originalIndex}
                  result={result}
                  targetToken={targetToken}
                  isSelected={routeIndex === originalIndex}
                  onClick={() => onRouteSelect(originalIndex)}
                  routeIndex={originalIndex}
                  summary={summary}
                />
              );
            })}
          </Col>
        </CardContent>
      )}
    </Card>
  );
}
