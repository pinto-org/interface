import { TokenValue } from "@/classes/TokenValue";
import { Col, Row } from "@/components/Container";
import IconImage from "@/components/ui/IconImage";
import { useTokenMap } from "@/hooks/pinto/useTokenMap";
import { tractorTokenStrategyUtil as StrategyUtil, TractorTokenStrategyUnion } from "@/lib/Tractor";
import { formatter } from "@/utils/format";
import { stringEq } from "@/utils/string";
import { getTokenIndex } from "@/utils/token";
import { cn } from "@/utils/utils";
import { CornerBottomLeftIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import React, { ReactNode } from "react";
import { ClassNameValue } from "tailwind-merge";

interface SizeProps {
  size?: "sm" | "md";
}

interface ContentProps {
  content: ReactNode;
}

interface StepProps extends SizeProps, ContentProps {}
export interface FlowStep {
  type: "action" | "context" | "amount";
  content: ReactNode;
  variant?: "primary" | "secondary";
}

export interface FlowVisualizationProps {
  steps: FlowStep[];
  size?: "sm" | "md";
  className?: ClassNameValue;
}

const sizeClasses = {
  sm: {
    font: clsx("text-pinto-xs"),
    pill: clsx("px-3 py-0.5"),
  },
  md: {
    font: clsx("text-sm"),
    pill: clsx("px-2 py-1"),
  },
} as const;

const Divider = ({ size = "md" }: SizeProps) => (
  <div className={cn("border-t-2 border-pinto-gray-2 w-6 flex-shrink-0", size === "sm" ? "w-3" : "w-6")} />
);

const ActionPill = ({
  content,
  size = "md",
  variant = "primary",
}: StepProps & { variant?: "primary" | "secondary" }) => (
  <div
    className={cn(
      "flex items-center px-2 py-1 rounded-xl",
      sizeClasses[size].pill,
      sizeClasses[size].font,
      variant === "primary" ? "bg-pinto-green-4 text-white" : "bg-pinto-gray-1 text-pinto-gray-4",
    )}
  >
    <div className={cn("whitespace-nowrap")}>{content}</div>
  </div>
);

const ContextLabel = ({ content, size = "md" }: StepProps) => (
  <div className={cn("px-2 py-1 rounded-full text-box", sizeClasses[size].pill)}>
    <div className={cn(sizeClasses[size].font, "border-gray-300 font-thin whitespace-nowrap")}>{content}</div>
  </div>
);

const AmountDisplay = ({ content, size = "md" }: StepProps) => (
  <div className="bg-pinto-gray-1 px-2 py-1 rounded-xl">
    <div className={cn("flex items-center gap-1", sizeClasses[size].pill, sizeClasses[size].font)}>{content}</div>
  </div>
);

const Container = ({ children, className }: { children: ReactNode; className?: ClassNameValue }) => (
  <div className={cn("bg-white rounded-xl px-2 py-2 shadow-sm flex flex-col gap-2 border border-gray-200", className)}>
    {children}
  </div>
);

// ONLY re-render when the Length of the steps array changes.
// TODO: Monitor whether this memoization is too much
export const FlowVisualization = React.memo(
  ({ steps, size = "md", className }: FlowVisualizationProps) => {
    return (
      <Row className={cn("items-center gap-0", className)}>
        {steps.map((step, index) => (
          <React.Fragment key={`flow-step-${index}`}>
            {step.type === "action" && <ActionPill content={step.content} variant={step.variant} size={size} />}
            {step.type === "context" && <ContextLabel content={step.content} size={size} />}
            {step.type === "amount" && <AmountDisplay content={step.content} size={size} />}
            {index < steps.length - 1 && <Divider size={size} />}
          </React.Fragment>
        ))}
      </Row>
    );
  },
  (prev, next) => {
    return prev.steps.length === next.steps.length;
  },
);

// ===== ConditionsList =====
export interface ConditionItem {
  text: ReactNode;
  operator?: "AND" | "OR";
}

export interface ConditionsListProps {
  conditions: ConditionItem[];
  className?: ClassNameValue;
  indentLevel?: number;
  size?: "sm" | "md";
}

export const ConditionsList = React.memo(
  ({ conditions, className, indentLevel = 6, size = "md" }: ConditionsListProps) => {
    if (!conditions.length) return null;

    return (
      <Col className={cn(size === "sm" ? "gap-1" : "gap-2", className)}>
        {conditions.map((condition, index) => (
          <div key={`condition-${index}`} className={`flex items-center pl-${indentLevel} gap-2`}>
            <CornerBottomLeftIcon className={"text-gray-300 font-light"} />
            <span
              className={cn(
                sizeClasses[size].font,
                "text-pinto-gray-4 whitespace-nowrap overflow-hidden text-ellipsis",
              )}
            >
              {condition.operator ? (
                <span className="font-roboto text-pinto-gray-4 font-bold">{condition.operator} </span>
              ) : null}
              <span>{condition.text}</span>
            </span>
          </div>
        ))}
      </Col>
    );
  },
  (prev, next) => {
    return prev.conditions.length === next.conditions.length;
  },
);

// ===== TipDisplay =====
export interface TipDisplayProps {
  amount: string;
  token: string;
  icon: string;
  className?: ClassNameValue;
}

export const TipDisplay = ({ amount, token, icon, className }: TipDisplayProps) => {
  return (
    <Row className={cn("items-center gap-2", className)}>
      <span className="text-pinto-gray-4 text-sm whitespace-nowrap">Tip Per Execution:</span>
      <div className="bg-pinto-gray-1 px-2 py-1 rounded-xl flex items-center gap-1">
        <IconImage src={icon} size={4} />
        <span className="text-pinto-green-4 text-sm font-thin whitespace-nowrap overflow-hidden text-ellipsis">
          {amount} {token}
        </span>
      </div>
    </Row>
  );
};

const TractorTokenStrategyDisplay = React.memo(
  ({ strategy }: { strategy: TractorTokenStrategyUnion }) => {
    const tokenMap = useTokenMap();

    const summary = StrategyUtil.getSummary(strategy);

    if (summary.isLowestPrice) return "Token with Best Price";
    if (summary.isLowestSeeds) return "Token with Least Seeds";

    const addresses = summary.addresses ?? [];

    if ((summary.isMulti || summary.isSingle) && !!addresses.length) {
      return (
        <Row className="gap-1 items-center">
          {addresses.slice(0, 3).map((adr, index) => {
            const tk = tokenMap[getTokenIndex(adr)];
            return (
              <Row key={`${adr}-selected-token-strategy`} className="gap-1 items-center">
                <IconImage src={tk.logoURI} size={4} alt={tk.symbol} />
                <div>{tk.symbol}</div>
                {index < Math.min(addresses.length - 1, 2) && <span> + </span>}
              </Row>
            );
          })}
          {addresses.length > 3 && <span>+{addresses.length - 3} more</span>}
        </Row>
      );
    }

    return "Selected Tokens";
  },
  (prev, next) => {
    const typesEquals = prev.strategy.type === next.strategy.type;
    if (!typesEquals) {
      return false;
    }

    const prevAddresses = prev.strategy.addresses ?? [];
    const nextAddresses = next.strategy.addresses ?? [];

    if (prevAddresses.length !== nextAddresses.length) {
      return false;
    }

    return prevAddresses.every((adr, index) => stringEq(nextAddresses[index] ?? "", adr));
  },
);

// ===== ProgressIndicator =====
export interface ProgressIndicatorProps {
  completed: TokenValue;
  total: TokenValue;
  unit: string;
  icon?: string;
  label?: string;
  className?: ClassNameValue;
}

export const ProgressIndicator = ({ completed, total, icon, label, className }: ProgressIndicatorProps) => {
  const percentComplete = total.gt(0) ? completed.div(total).mul(100) : TokenValue.ZERO;
  const percentCompleteNumber = Math.min(percentComplete.toHuman ? Number(percentComplete.toHuman()) : 0, 100);

  return (
    <Row className={cn("items-center gap-1", className)}>
      {icon && <IconImage src={icon} size={4} />}
      <span className="text-pinto-gray-4 text-sm whitespace-nowrap overflow-hidden text-ellipsis">
        {label && `${label}: `}
        <span className="text-black">
          {formatter.number(completed)}/{formatter.number(total)}
        </span>
        <span className="text-pinto-gray-4"> ({Math.round(percentCompleteNumber)}%)</span>
      </span>
    </Row>
  );
};

// ===== Compound Component =====
export const OrderVisualization = {
  Container,
  FlowVisualization,
  ConditionsList,
  TipDisplay,
  ProgressIndicator,
  TractorTokenStrategyDisplay,
};
