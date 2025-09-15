import baseLogo from "@/assets/misc/base-logo-alt.png";
import IconImage from "@/components/ui/IconImage";
import { useGetTractorTokenStrategyWithBlueprint } from "@/hooks/tractor/useGetTractorTokenStrategy";
import {
  Requisition,
  TractorRequisitionEvent as RequisitionEvent,
  SowBlueprintData,
  decodeSowTractorData,
} from "@/lib/Tractor";
import { decodeConvertUpTractorOrder } from "@/lib/Tractor/convertUp/tractor-convert-up";
import { ConvertUpOrderbookEntry } from "@/lib/Tractor/convertUp/tractor-convert-up-types";
import { prepareRequisitionEventForTxn } from "@/lib/Tractor/utils";
import React from "react";
import { base } from "viem/chains";
import { Col } from "../../Container";
import ConvertUpExecutionHistory from "../executions/ConvertUpExecutionHistory";
import SowExecutionHistory from "../executions/SowExecutionHistory";
import { OrderTypeConfig, TractorOrderData } from "../types";
import ConvertUpOrderVisualization from "../visualizations/ConvertUpOrderVisualization";
import SowOrderVisualization from "../visualizations/SowOrderVisualization";

// Helper components
const BaseIcon = () => (
  <IconImage
    src={baseLogo}
    nudge={-6}
    mobileSize={4}
    size={6}
    className="inline align-baseline mx-[0.5px] rounded-full"
  />
);

// Sow Order Description
const SowOrderDescription = ({ isViewOnly }: { isViewOnly: boolean }) => {
  if (isViewOnly) {
    return (
      <div>
        This is your active Sow Order. It allows an Operator to execute a transaction for you on the{" "}
        <span className="whitespace-nowrap">
          <BaseIcon /> Base&nbsp;
        </span>
        network when the conditions are met.
      </div>
    );
  }

  return (
    <Col className="gap-3">
      <div>
        A Sow Order allows you to pay an Operator to execute a sowing transaction for you on the{" "}
        <span className="whitespace-nowrap">
          <BaseIcon /> Base&nbsp;
        </span>
        network.
      </div>
      <p>This allows you to interact with the Pinto protocol autonomously when the conditions of your Order are met.</p>
    </Col>
  );
};

// Convert Up Order Description
const ConvertUpOrderDescription = ({ isViewOnly }: { isViewOnly: boolean }) => {
  if (isViewOnly) {
    return (
      <div>
        This is your active Convert Order. It allows an Operator to execute convert transactions for you on the{" "}
        <span className="whitespace-nowrap">
          <BaseIcon /> Base&nbsp;
        </span>
        network when the conditions are met.
      </div>
    );
  }

  return (
    <Col className="gap-3">
      <div>
        A Convert Order allows you to pay an Operator to execute convert transactions for you on the{" "}
        <span className="whitespace-nowrap">
          <BaseIcon /> Base&nbsp;
        </span>
        network.
      </div>
      <div>
        This allows you to automatically convert your LP assets for bonus Grown Stalk when market conditions are
        favorable.
      </div>
    </Col>
  );
};

// Transform functions for order data
const transformSowOrderData = (
  req: RequisitionEvent<SowBlueprintData>,
  getStrategyProps: ReturnType<typeof useGetTractorTokenStrategyWithBlueprint>,
): TractorOrderData => {
  if (!req.decodedData) throw new Error("Missing decoded data for Sow order");

  return {
    type: "sow",
    totalAmount: req.decodedData.sowAmounts.totalAmountToSowAsString,
    temperature: req.decodedData.minTempAsString,
    podLineLength: req.decodedData.maxPodlineLengthAsString,
    minSoil: req.decodedData.sowAmounts.minAmountToSowPerSeasonAsString,
    operatorTip: req.decodedData.operatorParams.operatorTipAmountAsString,
    tokenStrategy: getStrategyProps.getTokenStrategy(req.decodedData),
  };
};

const transformConvertUpOrderData = (
  req: ConvertUpOrderbookEntry,
  getStrategyProps: ReturnType<typeof useGetTractorTokenStrategyWithBlueprint>,
): TractorOrderData => {
  if (!req.decodedData) throw new Error("Missing decoded data for ConvertUp order");

  return {
    type: "convertUp",
    totalConvertBdv: req.decodedData.convertUpParams.totalConvertBdv.toHuman(),
    minConvertBdvPerExecution: req.decodedData.convertUpParams.minConvertBdvPerExecution.toHuman(),
    maxConvertBdvPerExecution: req.decodedData.convertUpParams.maxConvertBdvPerExecution.toHuman(),
    minTimeBetweenConverts: req.decodedData.convertUpParams.minTimeBetweenConverts.toHuman(),
    timeScale: "SECONDS",
    minConvertBonusCapacity: req.decodedData.convertUpParams.minConvertBonusCapacity.toHuman(),
    maxGrownStalkPerBdv: req.decodedData.convertUpParams.maxGrownStalkPerBdv.toHuman(),
    minGrownStalkPerBdvBonus: req.decodedData.convertUpParams.minGrownStalkPerBdvBonus.toHuman(),
    maxPriceToConvertUp: req.decodedData.convertUpParams.maxPriceToConvertUp.toHuman(),
    minPriceToConvertUp: req.decodedData.convertUpParams.minPriceToConvertUp.toHuman(),
    maxGrownStalkPerBdvPenalty: req.decodedData.convertUpParams.maxGrownStalkPerBdvPenalty.toHuman(),
    slippageRatio: req.decodedData.convertUpParams.slippageRatio.toHuman(),
    lowStalkDeposits: req.decodedData.convertUpParams.lowStalkDeposits,
    sourceTokenIndices: req.decodedData.convertUpParams.sourceTokenIndices,
    operatorTip: req.decodedData.opParams.operatorTipAmount.toHuman(),
    tokenStrategy: getStrategyProps.getTokenStrategy(req.decodedData.convertUpParams) || {
      type: "LOWEST_SEEDS",
    },
  };
};

// Unified transform function with overloads for type safety
function transformOrderData(
  req: RequisitionEvent<SowBlueprintData>,
  getStrategyProps: GetStrategyProps,
): TractorOrderData;
function transformOrderData(req: ConvertUpOrderbookEntry, getStrategyProps: GetStrategyProps): TractorOrderData;
function transformOrderData(
  req: RequisitionEvent<SowBlueprintData> | ConvertUpOrderbookEntry,
  getStrategyProps: GetStrategyProps,
): TractorOrderData {
  if (isSowRequest(req)) {
    return transformSowOrderData(req, getStrategyProps);
  }
  if (isConvertUpRequest(req)) {
    return transformConvertUpOrderData(req, getStrategyProps);
  }
  throw new Error("Unknown request type for order transformation");
}

// Unified prepare for cancellation function with overloads
function prepareForCancellation(req: RequisitionEvent<SowBlueprintData>): Requisition;
function prepareForCancellation(req: ConvertUpOrderbookEntry): Requisition;
function prepareForCancellation(req: RequisitionEvent<SowBlueprintData> | ConvertUpOrderbookEntry): Requisition {
  // Both types extend TractorRequisitionEvent, so we can safely cast
  return prepareRequisitionEventForTxn(req as any);
}

// ConvertUp helper functions
const decodeConvertUpTractorData = (blueprintData: `0x${string}`) => {
  return decodeConvertUpTractorOrder(blueprintData, base.id);
};

// Type guards for runtime safety
function isSowRequest(req: any): req is RequisitionEvent<SowBlueprintData> {
  return req && "requisitionType" in req && req.requisitionType === "sowBlueprintv0";
}

function isConvertUpRequest(req: any): req is ConvertUpOrderbookEntry {
  return req && "orderInfo" in req && "totalAvailableBdv" in req;
}

// Type for the strategy props hook
type GetStrategyProps = ReturnType<typeof useGetTractorTokenStrategyWithBlueprint>;

// Type for decoded data
type DecodedSowData = ReturnType<typeof decodeSowTractorData>;
type DecodedConvertUpData = ReturnType<typeof decodeConvertUpTractorData>;

// Extended OrderTypeConfig interface with only the used fields
export interface ExtendedOrderTypeConfig extends OrderTypeConfig {
  decodeData: (blueprintData: `0x${string}`) => DecodedSowData | DecodedConvertUpData | null;
  prepareForCancellation?: typeof prepareForCancellation;
  transformOrderData: typeof transformOrderData;
}

// Unified order type registry
export const ORDER_TYPE_REGISTRY = {
  sow: {
    // UI Components
    visualization: SowOrderVisualization,
    executionHistory: SowExecutionHistory,

    // Metadata
    title: "Review and Publish Sow Order",
    description: (isViewOnly: boolean) => <SowOrderDescription isViewOnly={isViewOnly} />,

    // Data Handling
    decodeData: decodeSowTractorData,
    prepareForCancellation: prepareForCancellation,
    transformOrderData: transformOrderData,
  },

  convertUp: {
    // UI Components
    visualization: ConvertUpOrderVisualization,
    executionHistory: ConvertUpExecutionHistory,

    // Metadata
    title: "Review and Publish Convert Order",
    description: (isViewOnly: boolean) => <ConvertUpOrderDescription isViewOnly={isViewOnly} />,

    // Data Handling
    decodeData: decodeConvertUpTractorData,
    prepareForCancellation: prepareForCancellation,
    transformOrderData: transformOrderData,
  },
} as const satisfies Record<string, ExtendedOrderTypeConfig>;

// Helper function to get order configuration by type
export function getOrderTypeConfig(orderType: OrderType): ExtendedOrderTypeConfig {
  const config = ORDER_TYPE_REGISTRY[orderType];
  if (!config) {
    throw new Error(
      `Unknown order type: ${orderType}. Available types: ${Object.keys(ORDER_TYPE_REGISTRY).join(", ")}`,
    );
  }
  return config;
}

export type OrderType = keyof typeof ORDER_TYPE_REGISTRY;
