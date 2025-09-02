import { TokenValue } from "@/classes/TokenValue";
import { Col, Row } from "@/components/Container";
import IconImage from "@/components/ui/IconImage";
import { formatter } from "@/utils/format";
import { cn } from "@/utils/utils";
import { CornerBottomLeftIcon } from "@radix-ui/react-icons";
import React, { ReactNode } from "react";
import { ClassNameValue } from "tailwind-merge";

// ===== FlowVisualization =====
export interface FlowStep {
  type: "action" | "context" | "amount";
  content: ReactNode;
  variant?: "primary" | "secondary";
}

export interface FlowVisualizationProps {
  steps: FlowStep[];
  className?: ClassNameValue;
}

const Divider = () => <div className="border-t-2 border-pinto-gray-2 w-6 flex-shrink-0" />;

const ActionPill = ({ content, variant = "primary" }: { content: ReactNode; variant?: "primary" | "secondary" }) => (
  <div
    className={cn(
      "flex items-center px-2 py-1 rounded-xl",
      variant === "primary" ? "bg-pinto-green-4 text-white" : "bg-pinto-gray-1 text-pinto-gray-4",
    )}
  >
    <span className="text-sm font-normal whitespace-nowrap">{content}</span>
  </div>
);

const ContextLabel = ({ content }: { content: ReactNode }) => (
  <div className="bg-pinto-gray-1 px-2 py-1 rounded-xl">
    <span className="text-pinto-gray-4 text-sm font-thin whitespace-nowrap">{content}</span>
  </div>
);

const AmountDisplay = ({ content }: { content: ReactNode }) => (
  <div className="bg-pinto-gray-1 px-2 py-1 rounded-xl">
    <div className="flex items-center gap-1">{content}</div>
  </div>
);

export const FlowVisualization = ({ steps, className }: FlowVisualizationProps) => {
  return (
    <Row className={cn("items-center gap-0", className)}>
      {steps.map((step, index) => (
        <React.Fragment key={`flow-step-${index}`}>
          {step.type === "action" && <ActionPill content={step.content} variant={step.variant} />}
          {step.type === "context" && <ContextLabel content={step.content} />}
          {step.type === "amount" && <AmountDisplay content={step.content} />}
          {index < steps.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </Row>
  );
};

// ===== ConditionsList =====
export interface ConditionItem {
  text: ReactNode;
  operator?: "AND" | "OR";
}

export interface ConditionsListProps {
  conditions: ConditionItem[];
  className?: ClassNameValue;
  indentLevel?: number;
}

export const ConditionsList = ({ conditions, className, indentLevel = 6 }: ConditionsListProps) => {
  if (!conditions.length) return null;

  return (
    <Col className={cn("gap-2", className)}>
      {conditions.map((condition, index) => (
        <div key={`condition-${index}`} className={`flex items-center pl-${indentLevel} gap-2`}>
          <CornerBottomLeftIcon className="h-4 w-4 text-pinto-gray-4" />
          <span className="text-pinto-gray-4 text-sm font-thin whitespace-nowrap overflow-hidden text-ellipsis">
            {condition.operator && <span className="font-roboto">{condition.operator} </span>}
            {condition.text}
          </span>
        </div>
      ))}
    </Col>
  );
};

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
      <span className="text-pinto-gray-4 text-sm whitespace-nowrap">Operator Tip:</span>
      <div className="bg-pinto-gray-1 px-2 py-1 rounded-xl flex items-center gap-1">
        <IconImage src={icon} size={4} />
        <span className="text-pinto-green-4 text-sm font-thin whitespace-nowrap overflow-hidden text-ellipsis">
          {amount} {token}
        </span>
      </div>
    </Row>
  );
};

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
  FlowVisualization,
  ConditionsList,
  TipDisplay,
  ProgressIndicator,
};
