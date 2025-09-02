import { TV, TokenValue } from "@/classes/TokenValue";
import { sowBlueprintv0ABI } from "@/constants/abi/SowBlueprintv0ABI";
import { convertUpBlueprintV0ABI } from "@/constants/abi/convertUpBlueprintV0ABI";
import { diamondABI } from "@/constants/abi/diamondABI";
import { STALK } from "@/constants/internalTokens";
import { MAIN_TOKEN } from "@/constants/tokens";
import { getChainConstant } from "@/utils/chain";
import { stringEq } from "@/utils/string";
import { AdvancedFarmCall, AdvancedPipeCall, MinimumViableBlock } from "@/utils/types";
import { MayArray } from "@/utils/types.generic";
import { arrayify } from "@/utils/utils";
import { SignableMessage, decodeFunctionData } from "viem";
import { PublicClient } from "viem";
import { base } from "viem/chains";
import { decodeBlueprintCallData } from "../blueprint-decoders";
import { ConvertUpBlueprintStruct } from "../convertUp";
import {
  Requisition,
  RequisitionType,
  TractorRequisitionData,
  TractorRequisitionEvent,
  decodeEncodedTractorDataToAdvancedPipeCalls,
} from "../core";
import { fetchTractorEvents } from "../events/tractor-events";
import { SowBlueprintData, transformSowRequisitionEvent } from "../sowOrder";

// ────────────────────────────────────────────────────────────────────────────────
// CONVERT UP REQUISITION TRANSFORMATION
// ────────────────────────────────────────────────────────────────────────────────

const MAX_GROWN_STALK_PER_BDV_PENALTY_DECIMALS = 18;

export const getTractorConvertUpParamsDecimalConfig = (chainId: number) => {
  const { decimals } = getChainConstant(chainId, MAIN_TOKEN);

  return {
    totalConvertBdv: decimals,
    minConvertBdvPerExecution: decimals,
    maxConvertBdvPerExecution: decimals,
    minTimeBetweenConverts: 0,
    minConvertBonusCapacity: decimals,
    maxGrownStalkPerBdv: STALK.decimals,
    minGrownStalkPerBdvBonus: STALK.decimals,
    maxPriceToConvertUp: decimals,
    minPriceToConvertUp: decimals,
    operatorTip: decimals,
    maxGrownStalkPerBdvPenalty: MAX_GROWN_STALK_PER_BDV_PENALTY_DECIMALS,
    slippageRatio: 18,
  };
};

function shallowCheckIsConvertUpParams(data: unknown): data is ConvertUpBlueprintStruct {
  return typeof data === "object" && data !== null && "convertUpParams" in data && "opParams" in data;
}

export const transformConvertUpRequisitionEvent = (params: unknown | null, chainId: number) => {
  try {
    if (!shallowCheckIsConvertUpParams(params)) {
      console.debug("[Tractor/transformConvertUpRequisitionEvent] Invalid params structure.");
      return null;
    }

    const { convertUpParams: cup, opParams: op } = params;

    const dc = getTractorConvertUpParamsDecimalConfig(chainId);

    const convertUpParams: ConvertUpBlueprintStruct<TV>["convertUpParams"] = {
      sourceTokenIndices: cup.sourceTokenIndices,
      totalConvertBdv: TV.fromBigInt(cup.totalConvertBdv, dc.totalConvertBdv),
      minConvertBdvPerExecution: TV.fromBigInt(cup.minConvertBdvPerExecution, dc.minConvertBdvPerExecution),
      maxConvertBdvPerExecution: TV.fromBigInt(cup.maxConvertBdvPerExecution, dc.maxConvertBdvPerExecution),
      minTimeBetweenConverts: TV.fromBigInt(cup.minTimeBetweenConverts, dc.minTimeBetweenConverts),
      minConvertBonusCapacity: TV.fromBigInt(cup.minConvertBonusCapacity, dc.minConvertBonusCapacity),
      maxGrownStalkPerBdv: TV.fromBigInt(cup.maxGrownStalkPerBdv, dc.maxGrownStalkPerBdv),
      minGrownStalkPerBdvBonus: TV.fromBigInt(cup.minGrownStalkPerBdvBonus, dc.minGrownStalkPerBdvBonus),
      maxPriceToConvertUp: TV.fromBigInt(cup.maxPriceToConvertUp, dc.maxPriceToConvertUp),
      minPriceToConvertUp: TV.fromBigInt(cup.minPriceToConvertUp, dc.minPriceToConvertUp),
      maxGrownStalkPerBdvPenalty: TV.fromBigInt(cup.maxGrownStalkPerBdvPenalty, dc.maxGrownStalkPerBdvPenalty),
      slippageRatio: TV.fromBigInt(cup.slippageRatio, dc.slippageRatio),
      lowStalkDeposits: cup.lowStalkDeposits,
    };

    const opParams: ConvertUpBlueprintStruct<TV>["opParams"] = {
      whitelistedOperators: op.whitelistedOperators,
      tipAddress: op.tipAddress,
      operatorTipAmount: TV.fromBigInt(op.operatorTipAmount, dc.operatorTip),
    };

    return {
      convertUpParams,
      opParams,
    };
  } catch (error) {
    console.debug("Failed to transform convertUpParams:", error);
  }

  return null;
};

// ────────────────────────────────────────────────────────────────────────────────
// Create Sow V0 Tractor Order & Sign Requisition
// ────────────────────────────────────────────────────────────────────────────────

/**
 * Signs a requisition using the publisher's wallet
 */
export async function signRequisition(
  requisition: Requisition,
  signer: { signMessage: (args: { message: SignableMessage }) => Promise<`0x${string}`> },
): Promise<`0x${string}`> {
  const signature = await signer.signMessage({ message: { raw: requisition.blueprintHash } });
  requisition.signature = signature;
  return signature;
}

// ────────────────────────────────────────────────────────────────────────────────
// Requisitions
// ────────────────────────────────────────────────────────────────────────────────

export async function loadPublishedRequisitions(
  address: string | undefined,
  protocolAddress: `0x${string}` | undefined,
  publicClient: PublicClient | null,
  latestBlock?: { number: bigint; timestamp: bigint } | null,
  requisitionType?: MayArray<RequisitionType>, // Add requisition type filter
  fromBlock?: bigint,
) {
  if (!protocolAddress || !publicClient) {
    return undefined;
  }

  try {
    const data = await fetchTractorEvents(publicClient, protocolAddress, fromBlock);
    const selectRequisitionType = getSelectRequisitionType(requisitionType, address);
    return selectRequisitionType({
      latestBlock: { number: latestBlock?.number ?? 0n, timestamp: latestBlock?.timestamp ?? 0n },
      data,
    });
  } catch (error) {
    console.error("Error loading published requisitions:", error);
    throw new Error("Failed to load published requisitions");
  }
}

type SelectRequisitionTypeArgs = {
  latestBlock: MinimumViableBlock<bigint>;
  data: Awaited<ReturnType<typeof fetchTractorEvents>>;
};

const combinedABI = [...sowBlueprintv0ABI, ...convertUpBlueprintV0ABI] as const;

type BaseDecodedTractorRequisition = {
  type: RequisitionType;
};

type DecodedSowRequisition = BaseDecodedTractorRequisition & {
  type: "sowBlueprintv0";
  data: NonNullable<ReturnType<typeof transformSowRequisitionEvent>>;
};

type DecodedConvertUpRequisition = BaseDecodedTractorRequisition & {
  type: "convertUpBlueprint";
  data: NonNullable<ReturnType<typeof transformConvertUpRequisitionEvent>>;
};

type DecodedTractorRequisition = DecodedSowRequisition | DecodedConvertUpRequisition;

const blueprintTransformerLookup = {
  sowBlueprintv0: {
    transformer: transformSowRequisitionEvent,
    type: "sowBlueprintv0",
  },
  convertUpBlueprint: {
    transformer: transformConvertUpRequisitionEvent,
    type: "convertUpBlueprint",
  },
} as const;

export const decodeTractorBlueprint = (
  encodedData: `0x${string}`,
  chainId: number = base.id,
): DecodedTractorRequisition | null => {
  try {
    const pipeCalls = decodeEncodedTractorDataToAdvancedPipeCalls(encodedData, "decodeTractorBlueprint");

    if (!pipeCalls?.length) {
      console.debug("[Tractor/decodeTractorBlueprint] No pipe calls provided. Returning null.");
      return null;
    }

    const data = pipeCalls[0].callData;

    // Try decoding with the combined ABI first
    let decoded: ReturnType<typeof decodeFunctionData>;
    try {
      decoded = decodeFunctionData({
        abi: combinedABI,
        data,
      });
    } catch (abiError) {
      console.debug(
        "[Tractor/decodeTractorBlueprint] Failed to decode with combinedABI, trying newer decoder system:",
        abiError,
      );

      // Fallback to newer blueprint decoder system
      const newDecoderResult = decodeBlueprintCallData(encodedData);
      if (newDecoderResult) {
        console.debug("[Tractor/decodeTractorBlueprint] Successfully decoded with newer decoder system");
        // For now, return null as we need to adapt the return type
        // TODO: Integrate newer decoder system return type
        return null;
      }

      console.debug("[Tractor/decodeTractorBlueprint] Both decoding methods failed");
      return null;
    }

    const entry = blueprintTransformerLookup[decoded.functionName as keyof typeof blueprintTransformerLookup];

    if (!entry) {
      console.debug("[Tractor/decodeTractorBlueprint] No entry found for function name:", decoded.functionName);
      return null;
    }

    if (!decoded.args.length) {
      console.debug("[Tractor/decodeTractorBlueprint] No args found for function name:", decoded.functionName);
      return null;
    }

    const transformed = entry.transformer(decoded.args[0], chainId);

    if (!transformed) {
      console.debug("[Tractor/decodeTractorBlueprint] Transformation failed for function name:", decoded.functionName);
      return null;
    }

    return {
      type: entry.type,
      data: transformed,
    } as DecodedTractorRequisition;
  } catch (e) {
    console.error("Failed to decode Tractor Blueprint:", e);
  }

  return null;
};

export const getSelectRequisitionType = (requisitionsType: MayArray<RequisitionType> | undefined, address?: string) => {
  return (args: SelectRequisitionTypeArgs | undefined) => {
    if (!args) return undefined;

    const requisitionsSet = requisitionsType && new Set<RequisitionType>(arrayify(requisitionsType));

    const {
      data: { publishEvents, cancelledHashes },
      latestBlock,
    } = args;

    const latestTimestamp = Number(latestBlock.timestamp);
    const latestBlockNumber = Number(latestBlock.number);

    const map: {
      sowBlueprintv0: TractorRequisitionEvent<SowBlueprintData>[];
      convertUpBlueprint: TractorRequisitionEvent<ConvertUpBlueprintStruct<TokenValue>>[];
    } = {
      sowBlueprintv0: [],
      convertUpBlueprint: [],
    };

    for (const event of publishEvents) {
      const requisition = event.args?.requisition as TractorRequisitionData;
      if (!requisition?.blueprint || !requisition?.blueprintHash || !requisition?.signature) {
        continue;
      }

      // Only filter by address if one is provided
      if (address && !stringEq(requisition.blueprint.publisher, address)) {
        continue;
      }

      const data = decodeTractorBlueprint(requisition.blueprint.data);

      // Filter by requisition type if provided
      if (!data || (requisitionsSet?.size && !requisitionsSet.has(data.type))) {
        continue;
      }

      // Calculate timestamp if we have the latest block info
      let timestamp: number | undefined = undefined;
      if (latestBlock) {
        // Convert all BigInt values to Number before arithmetic operations
        const eventBlockNumber = Number(event.blockNumber);

        // Calculate timestamp (approximately 2 seconds per block)
        timestamp = latestTimestamp * 1000 - (latestBlockNumber - eventBlockNumber) * 2000;
      }

      // separate the convert up and sow blueprints for now to keep types simple
      if (data.type === "convertUpBlueprint") {
        map.convertUpBlueprint.push({
          requisition,
          blockNumber: Number(event.blockNumber),
          timestamp,
          isCancelled: cancelledHashes.has(requisition.blueprintHash),
          requisitionType: data.type,
          decodedData: data.data,
        });
      } else if (data.type === "sowBlueprintv0") {
        map.sowBlueprintv0.push({
          requisition,
          blockNumber: Number(event.blockNumber),
          timestamp,
          isCancelled: cancelledHashes.has(requisition.blueprintHash),
          requisitionType: data.type,
          decodedData: data.data,
        });
      }
    }

    return map;
  };
};

// Extract Tractor blueprint call function
export const extractTractorBlueprintCall = (data: `0x${string}`): `0x${string}` | null => {
  try {
    // Step 1: Decode as advancedFarm
    const advancedFarmDecoded = decodeFunctionData({
      abi: diamondABI,
      data: data,
    });

    if (advancedFarmDecoded.functionName === "advancedFarm" && advancedFarmDecoded.args[0]) {
      const farmCalls = advancedFarmDecoded.args[0] as AdvancedFarmCall[];
      if (farmCalls.length > 0) {
        // Step 2: Decode the inner call as advancedPipe
        const pipeCallData = farmCalls[0].callData;

        const advancedPipeDecoded = decodeFunctionData({
          abi: diamondABI,
          data: pipeCallData,
        });

        if (advancedPipeDecoded.functionName === "advancedPipe" && advancedPipeDecoded.args[0]) {
          const pipeCalls = advancedPipeDecoded.args[0] as AdvancedPipeCall[];

          if (pipeCalls.length > 0) {
            // Step 3: Get the tractor blueprint call data
            return pipeCalls[0].callData;
          }
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Failed to extract tractor blueprint call:", error);
    return null;
  }
};
