import { beanstalkAbi } from "@/generated/contractHooks";
import { useGetTractorTokenStrategyWithBlueprint } from "@/hooks/tractor/useGetTractorTokenStrategy";
import {
  OrderbookEntry,
  TractorRequisitionEvent as RequisitionEvent,
  SowBlueprintData,
  decodeSowTractorData,
} from "@/lib/Tractor";
import { decodeConvertUpTractorOrder } from "@/lib/Tractor/convertUp/tractor-convert-up";
import { ConvertUpOrderbookEntry } from "@/lib/Tractor/convertUp/tractor-convert-up-types";
import { PublisherTractorExecution, prepareRequisitionEventForTxn } from "@/lib/Tractor/utils";
import { AdvancedFarmCall, AdvancedPipeCall } from "@/utils/types";
import React from "react";
import { decodeFunctionData } from "viem";
import { base } from "viem/chains";
import FarmerTractorConvertUpOrderCard from "./ConvertUp/FarmerTractorConvertUpOrderCard";
import ModifyConvertUpOrderDialog from "./ModifyConvertUpOrderDialog";
import ModifyTractorOrderDialog from "./ModifySowOrderDialog";
import FarmerTractorSowOrderCard from "./Sow/FarmerTractorSowOrderCard";
import { TractorOrderData } from "./types";

// Generic types for order configurations
export interface OrderCardProps<T> {
  req: T;
  executions?: PublisherTractorExecution[];
  onOrderClick: (req: T) => void;
  onModifyClick: (req: T) => void;
  onCancelClick: (req: T, e: React.MouseEvent) => void;
  isSubmitting?: boolean;
  isConfirming?: boolean;
}

export interface ModifyDialogProps<T> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingOrder: T;
  getStrategyProps: any;
}

export interface TractorOrdersPanelConfig<T> {
  OrderCard: any;
  ModifyDialog?: any;
  decodeData: (blueprintData: `0x${string}`) => any;
  prepareForCancellation: (req: T) => any;
  extractBlueprintCall?: (data: `0x${string}`) => `0x${string}` | null;
  transformOrderData: (req: T, getStrategyProps: any) => TractorOrderData;
  emptyTableType: "tractor";
}

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

const transformConvertUpOrderData = (req: ConvertUpOrderbookEntry, getStrategyProps: any): TractorOrderData => {
  if (!req.decodedData) throw new Error("Missing decoded data for ConvertUp order");

  return {
    type: "convertUp",
    totalConvertBdv: req.decodedData.convertUpParams.totalConvertBdv.toHuman(),
    minConvertBdvPerExecution: req.decodedData.convertUpParams.minConvertBdvPerExecution.toHuman(),
    maxConvertBdvPerExecution: req.decodedData.convertUpParams.maxConvertBdvPerExecution.toHuman(),
    minTimeBetweenConverts: req.decodedData.convertUpParams.minTimeBetweenConverts.toString(),
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
    tokenStrategy: getStrategyProps?.getTokenStrategy?.(req.decodedData) || { type: "specific", tokens: [] },
  };
};

// ConvertUp helper functions
const decodeConvertUpTractorData = (blueprintData: `0x${string}`) => {
  return decodeConvertUpTractorOrder(blueprintData, base.id);
};

// Extract Sow blueprint call function
const extractSowBlueprintCall = (data: `0x${string}`): `0x${string}` | null => {
  try {
    // Step 1: Decode as advancedFarm
    const advancedFarmDecoded = decodeFunctionData({
      abi: beanstalkAbi,
      data: data,
    });

    if (advancedFarmDecoded.functionName === "advancedFarm" && advancedFarmDecoded.args[0]) {
      const farmCalls = advancedFarmDecoded.args[0] as AdvancedFarmCall[];
      if (farmCalls.length > 0) {
        // Step 2: Decode the inner call as advancedPipe
        const pipeCallData = farmCalls[0].callData;

        const advancedPipeDecoded = decodeFunctionData({
          abi: beanstalkAbi,
          data: pipeCallData,
        });

        if (advancedPipeDecoded.functionName === "advancedPipe" && advancedPipeDecoded.args[0]) {
          const pipeCalls = advancedPipeDecoded.args[0] as AdvancedPipeCall[];

          if (pipeCalls.length > 0) {
            // Step 3: Get the sowBlueprintv0 call data
            return pipeCalls[0].callData;
          }
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Failed to extract sowBlueprintv0 call:", error);
    return null;
  }
};

// Order type configurations
export const ORDER_TYPE_CONFIGS = {
  sow: {
    OrderCard: FarmerTractorSowOrderCard,
    ModifyDialog: ModifyTractorOrderDialog,
    decodeData: decodeSowTractorData,
    prepareForCancellation: prepareRequisitionEventForTxn,
    extractBlueprintCall: extractSowBlueprintCall,
    transformOrderData: transformSowOrderData,
    emptyTableType: "tractor" as const,
  },

  convertUp: {
    OrderCard: FarmerTractorConvertUpOrderCard,
    ModifyDialog: ModifyConvertUpOrderDialog,
    decodeData: decodeConvertUpTractorData,
    prepareForCancellation: prepareRequisitionEventForTxn,
    transformOrderData: transformConvertUpOrderData,
    emptyTableType: "tractor" as const,
  },
};

export type OrderType = keyof typeof ORDER_TYPE_CONFIGS;
