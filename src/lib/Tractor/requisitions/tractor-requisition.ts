import { TokenValue } from "@/classes/TokenValue";
import { sowBlueprintv0ABI } from "@/constants/abi/SowBlueprintv0ABI";
import { convertUpBlueprintV0ABI } from "@/constants/abi/convertUpBlueprintV0ABI";
import { beanstalkAbi } from "@/generated/contractHooks";
import { stringEq } from "@/utils/string";
import { MinimumViableBlock } from "@/utils/types";
import { MayArray } from "@/utils/types.generic";
import { arrayify } from "@/utils/utils";
import { SignableMessage, decodeFunctionData } from "viem";
import { PublicClient } from "viem";
import { base } from "viem/chains";
import { ConvertUpBlueprintStruct, transformConvertUpRequisitionEvent } from "../convertUp";
import { Requisition, RequisitionType, TractorRequisitionData, TractorRequisitionEvent } from "../core";
import { fetchTractorEvents } from "../events/tractor-events";
import { SowBlueprintData, transformSowRequisitionEvent } from "../sowOrder";

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
    // Step 1: Attempt to decode.
    const calls = decodeFunctionData({
      abi: beanstalkAbi,
      data: encodedData,
    });

    if (calls.functionName === "advancedFarm" && calls.args[0]) {
      const farmCalls = calls.args[0];

      if (!farmCalls.length) {
        console.debug("[Tractor/decodeTractorBlueprint] No farm calls provided. Returning null.");
        return null;
      }
      // Step 3: Try to decode the inner call as advancedPipe
      try {
        const pipeCallData = farmCalls[0].callData;
        const advancedPipeDecoded = decodeFunctionData({
          abi: beanstalkAbi,
          data: pipeCallData,
        });

        if (advancedPipeDecoded.functionName === "advancedPipe" && advancedPipeDecoded.args?.[0]?.length) {
          const data = advancedPipeDecoded.args[0][0].callData;

          const decoded = decodeFunctionData({
            abi: combinedABI,
            data,
          });

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
            console.debug(
              "[Tractor/decodeTractorBlueprint] Transformation failed for function name:",
              decoded.functionName,
            );
            return null;
          }

          return {
            type: entry.type,
            data: transformed,
          } as DecodedTractorRequisition;
        }
      } catch (error) {
        console.debug("[Tractor/decodeTractorBlueprint] Failed to decode as advancedPipe:", error);
      }
    }
  } catch (e) {
    console.debug("[Tractor/decodeTractorBlueprint] Failed to decode as beanstalk advancedFarm:", e);
    //
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
      sowBlueprintV0: TractorRequisitionEvent<SowBlueprintData>[];
      convertUpBlueprint: TractorRequisitionEvent<ConvertUpBlueprintStruct<TokenValue>>[];
    } = {
      sowBlueprintV0: [],
      convertUpBlueprint: [],
    };

    console.log("publishEvents: ", publishEvents);

    for (const event of publishEvents) {
      const requisition = event.args?.requisition as TractorRequisitionData;
      if (!requisition?.blueprint || !requisition?.blueprintHash || !requisition?.signature) {
        continue;
      }

      // Only filter by address if one is provided
      if (address && !stringEq(requisition.blueprint.publisher, address)) {
        console.log("no address match... ");
        continue;
      }

      const data = decodeTractorBlueprint(requisition.blueprint.data);

      console.log("decoded data: ", data);

      // Filter by requisition type if provided
      if (!data || (requisitionsSet?.size && !requisitionsSet.has(data.type))) {
        console.log("no requisition type match... ");
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

      map[data.type].push({
        requisition,
        blockNumber: Number(event.blockNumber),
        timestamp,
        isCancelled: cancelledHashes.has(requisition.blueprintHash),
        requisitionType: data.type,
        decodedData: data.data,
      });
    }

    console.log("EVENTS: ", map);

    return map;
  };
};
