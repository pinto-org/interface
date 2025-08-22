import baseLogo from "@/assets/misc/base-logo-alt.png";
import IconImage from "@/components/ui/IconImage";
import React from "react";
import { Col } from "../Container";
import ConvertUpExecutionHistory from "./executions/ConvertUpExecutionHistory";
import SowExecutionHistory from "./executions/SowExecutionHistory";
import { OrderTypeConfig } from "./types";
import ConvertUpOrderVisualization from "./visualizations/ConvertUpOrderVisualization";
import SowOrderVisualization from "./visualizations/SowOrderVisualization";

type TractorOrderType = "sow" | "convertUp";

// Order type configuration registry
export const ORDER_TYPE_REGISTRY: Record<TractorOrderType, OrderTypeConfig> = {
  sow: {
    visualization: SowOrderVisualization,
    executionHistory: SowExecutionHistory,
    title: "Review and Publish Sow Order",
    description: (isViewOnly: boolean) => {
      if (isViewOnly) {
        return (
          <p>
            This is your active Sow Order. It allows an Operator to execute a transaction for you on the{" "}
            <span className="whitespace-nowrap">
              <IconImage
                src={baseLogo}
                nudge={-6}
                mobileSize={4}
                size={6}
                className="inline align-baseline mx-[0.5px] rounded-full"
              />{" "}
              Base&nbsp;
            </span>
            network when the conditions are met.
          </p>
        );
      }

      return (
        <Col className="gap-3">
          <p>
            A Sow Order allows you to pay an Operator to execute a sowing transaction for you on the{" "}
            <span className="whitespace-nowrap">
              <IconImage
                src={baseLogo}
                nudge={-6}
                mobileSize={4}
                size={6}
                className="inline align-baseline mx-[0.5px] rounded-full"
              />{" "}
              Base&nbsp;
            </span>
            network.
          </p>
          <p>
            This allows you to interact with the Pinto protocol autonomously when the conditions of your Order are met.
          </p>
        </Col>
      );
    },
  },
  convertUp: {
    visualization: ConvertUpOrderVisualization,
    executionHistory: ConvertUpExecutionHistory,
    title: "Review and Publish Convert Order",
    description: (isViewOnly: boolean) => {
      if (isViewOnly) {
        return (
          <p>
            This is your active Convert Order. It allows an Operator to execute convert transactions for you on the{" "}
            <span className="whitespace-nowrap">
              <IconImage
                src={baseLogo}
                nudge={-6}
                mobileSize={4}
                size={6}
                className="inline align-baseline mx-[0.5px] rounded-full"
              />{" "}
              Base&nbsp;
            </span>
            network when the conditions are met.
          </p>
        );
      }

      return (
        <Col className="gap-3">
          <p>
            A Convert Order allows you to pay an Operator to execute convert transactions for you on the{" "}
            <span className="whitespace-nowrap">
              <IconImage
                src={baseLogo}
                nudge={-6}
                mobileSize={4}
                size={6}
                className="inline align-baseline mx-[0.5px] rounded-full"
              />{" "}
              Base&nbsp;
            </span>
            network.
          </p>
          <p>
            This allows you to automatically convert your deposits to higher-yielding assets when market conditions are
            favorable.
          </p>
        </Col>
      );
    },
  },
};

// Helper function to get order configuration by type
export function getOrderTypeConfig(orderType: TractorOrderType): OrderTypeConfig {
  const config = ORDER_TYPE_REGISTRY[orderType];
  if (!config) {
    throw new Error(
      `Unknown order type: ${orderType}. Available types: ${Object.keys(ORDER_TYPE_REGISTRY).join(", ")}`,
    );
  }
  return config;
}
