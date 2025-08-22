import { Col, Row } from "@/components/Container";
import { cn } from "@/utils/utils";
import { CornerBottomLeftIcon } from "@radix-ui/react-icons";
import React, { ReactNode, Fragment } from "react";
import { ClassNameValue } from "tailwind-merge";

interface BaseVizAtomProps {
  content: ReactNode;
  className?: ClassNameValue;
}

interface VizAtomProps extends BaseVizAtomProps {
  isStart?: boolean;
}

const NodeEdge = () => <div className="border-t-2 border-gray-300 w-3 flex-shrink-0" />;

const StartNode = ({ content, className }: BaseVizAtomProps) => {
  return (
    <Row className={cn("bg-pinto-green-4 text-white px-3 py-0.5 rounded-full flex-shrink-0", className)}>{content}</Row>
  );
};

const NextNode = ({ content, className }: BaseVizAtomProps) => {
  return <Row className={cn("text-box rounded-xl flex items-center", className)}>{content}</Row>;
};

interface ConditionProps {
  condition: ReactNode;
  operator?: "AND" | "OR";
}

const Conditions = ({ conditions }: { conditions?: React.ReactNode[] }) => {
  if (!conditions?.length) return null;

  return (
    <ul className="gap-1 text-gray-500 text-sm">
      {conditions.map((condition, i) => (
        <li
          className="flex flex-row items-center gap-2 font-light text-pinto-light"
          key={`viz-atom-conditions-${i.toString()}`}
        >
          <CornerBottomLeftIcon className="text-gray-300 ml-4" />
          {condition}
        </li>
      ))}
    </ul>
  );
};

export interface LinkedVisualizationProps {
  nodes: VizAtomProps[];
  className?: ClassNameValue;
  conditions?: React.ReactNode[];
}

export const LinkedVisualization = ({ nodes, className, conditions }: LinkedVisualizationProps) => {
  return (
    <Col className="bg-white rounded-xl px-2 py-2 shadow-sm gap-2 border border-gray-200">
      <Row className={cn(className)}>
        {nodes.map((node, index) => (
          <React.Fragment key={`viz-atom-${index.toString()}`}>
            {node.isStart && <StartNode content={node.content} />}
            {!node.isStart && <NextNode content={node.content} />}
            {index < nodes.length - 1 && <NodeEdge />}
          </React.Fragment>
        ))}
      </Row>
      <Conditions conditions={conditions} />
    </Col>
  );
};
