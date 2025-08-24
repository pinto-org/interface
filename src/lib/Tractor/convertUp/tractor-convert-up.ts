import { TV } from "@/classes/TokenValue";
import { convertUpBlueprintV0ABI } from "@/constants/abi/convertUpBlueprintV0ABI";
import { CONVERT_UP_BLUEPRINT_V0_ADDRESS } from "@/constants/address";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { AdvancedPipeCall } from "@/utils/types";
import { PublicClient, decodeFunctionData, encodeFunctionData } from "viem";
import {
  CreateTractorDataReturnType,
  TRACTOR_DEPLOYMENT_BLOCK,
  encodeTractorAndOptimizeDeposits,
  getTokenIndexesFromTractorTokenStrategy,
} from "../core";
import {
  getTractorConvertUpParamsDecimalConfig,
  loadPublishedRequisitions,
  transformConvertUpRequisitionEvent,
} from "../requisitions/tractor-requisition";
import { ConvertUpBlueprintStruct, PreparedConvertUpArgs } from "./tractor-convert-up-types";

// ────────────────────────────────────────────────────────────────────────────────
// CONFIGURATION
// ────────────────────────────────────────────────────────────────────────────────

const guardDecimals = (args: PreparedConvertUpArgs<TV>, chainId: number) => {
  const decimalConfig = getTractorConvertUpParamsDecimalConfig(chainId);

  Object.entries(decimalConfig).forEach(([key, decimals]) => {
    const val = args[key as keyof PreparedConvertUpArgs<TV>];

    if (val instanceof TV) {
      if (val.decimals !== decimals) {
        throw new Error(`Invalid decimal for ${key}: expected ${decimals}, got ${val.decimals}`);
      }
    }
  });
};

// ────────────────────────────────────────────────────────────────────────────────
// ORDER CREATION
// ────────────────────────────────────────────────────────────────────────────────

export const TRACTOR_CONVERT_UP_DEFAULT_CONSTRAINTS = {
  minSizePerExecution: TV.fromHuman("100", 6),
  maxSizePerExecution: TV.fromHuman("125", 6),
  minSizePerExecutionPct: 0.05,
  maxSizePerExecutionPct: 0.1,
} as const;

export async function createConvertUpTractorData({
  publicClient,
  userAddress,
  protocolAddress,
  farmerDeposits,
  whitelistedOperators,
  ...args
}: PreparedConvertUpArgs<TV> & {
  publicClient: PublicClient;
  userAddress: `0x${string}`;
  protocolAddress: `0x${string}`;
  farmerDeposits?: ReturnType<typeof useFarmerSilo>["deposits"];
  whitelistedOperators?: `0x${string}`[];
}): Promise<CreateTractorDataReturnType & { struct: ConvertUpBlueprintStruct }> {
  console.debug("[tractor/convertUp/createConvertUpTractorData] args", args);

  const chainId = await publicClient.getChainId();

  if (!chainId) {
    throw new Error("Chain ID is required");
  }

  guardDecimals(args, chainId);

  // Get source token indices based on strategy
  const sourceTokenIndices = await getTokenIndexesFromTractorTokenStrategy(publicClient, args.tokenStrategy);

  console.debug("ConvertUp sourceTokenIndices:", sourceTokenIndices);

  const struct = {
    convertUpParams: {
      sourceTokenIndices,
      totalConvertBdv: args.totalConvertBdv.toBigInt(),
      minConvertBdvPerExecution: args.minConvertBdvPerExecution.toBigInt(),
      maxConvertBdvPerExecution: args.maxConvertBdvPerExecution.toBigInt(),
      minTimeBetweenConverts: args.minTimeBetweenConverts.toBigInt(),
      minConvertBonusCapacity: args.minConvertBonusCapacity.toBigInt(),
      maxGrownStalkPerBdv: args.maxGrownStalkPerBdv.toBigInt(),
      minGrownStalkPerBdvBonus: args.minGrownStalkPerBdvBonus.toBigInt(),
      maxPriceToConvertUp: args.maxPriceToConvertUp.toBigInt(),
      minPriceToConvertUp: args.minPriceToConvertUp.toBigInt(),
      maxGrownStalkPerBdvPenalty: args.maxGrownStalkPerBdvPenalty.toBigInt(),
      slippageRatio: args.slippageRatio.toBigInt(),
      lowStalkDeposits: Number(args.lowStalkDeposits),
    },
    opParams: {
      whitelistedOperators: whitelistedOperators || [],
      tipAddress: "0x0000000000000000000000000000000000000000" as `0x${string}`,
      operatorTipAmount: args.operatorTip.toBigInt(),
    },
  } as const;

  // Encode the convertUpBlueprintv0 function call
  const convertUpCall = encodeFunctionData({
    abi: convertUpBlueprintV0ABI,
    functionName: "convertUpBlueprint" as const,
    args: [struct],
  });

  const advPipeStruct = {
    target: CONVERT_UP_BLUEPRINT_V0_ADDRESS,
    callData: convertUpCall,
    clipboard: "0x0000" as `0x${string}`, // Minimal clipboard data
  } as const;

  const { data, depositOptimizationCalls } = await encodeTractorAndOptimizeDeposits(
    { client: publicClient, protocolAddress, farmerAddress: userAddress },
    advPipeStruct,
    farmerDeposits,
  );

  console.debug("[Tractor/convertUp/createConvertUpTractorData] RESULTS:", {
    data,
    operatorPasteInstrs: [], // TODO: Update if needed
    rawCall: convertUpCall,
    depositOptimizationCalls,
  });

  return {
    struct,
    data,
    operatorPasteInstrs: [], // TODO: Update if needed
    rawCall: convertUpCall, // Return the raw call data
    depositOptimizationCalls, // Return optimization calls for user transaction
  };
}

// ────────────────────────────────────────────────────────────────────────────────
// DECODE / LOAD ORDERS
// ────────────────────────────────────────────────────────────────────────────────

interface LoadOrderbookDataOptions {
  filterOutCompleted?: boolean;
}

export async function loadConvertUpOrderbokData(
  address: string | undefined,
  protocolAddress: `0x${string}` | undefined,
  publicClient: PublicClient | null,
  latestBlock?: { number: bigint; timestamp: bigint } | null,
  _activeApiEntries: any[] = [], // Any for now since we don't know the schema
  lookbackBlocks?: bigint,
  options?: LoadOrderbookDataOptions,
) {
  if (!protocolAddress || !publicClient) return [];

  const loadOptions: Required<LoadOrderbookDataOptions> = { filterOutCompleted: true, ...options };

  const knownBlueprintHashes = new Set<string>(
    // _activeApiEntries?.map((order) => order.requisition.blueprintHash.toLowerCase()) ?? [],
  );

  const fromBlock =
    lookbackBlocks && latestBlock?.number ? latestBlock.number - lookbackBlocks : TRACTOR_DEPLOYMENT_BLOCK;

  const [completedEvents, _requisitions, _priceResult] = await Promise.all([
    publicClient.getContractEvents({
      address: CONVERT_UP_BLUEPRINT_V0_ADDRESS,
      abi: convertUpBlueprintV0ABI,
      eventName: "ConvertUpOrderComplete" as const,
      fromBlock: fromBlock,
      toBlock: "latest",
    }),
    loadPublishedRequisitions(address, protocolAddress, publicClient, latestBlock, "convertUpBlueprint", fromBlock),
    publicClient.readContract({
      address: CONVERT_UP_BLUEPRINT_V0_ADDRESS,
      abi: convertUpBlueprintV0ABI,
      functionName: "beanstalkPrice",
      args: [],
    }),
  ]);

  const requisitions = _requisitions?.convertUpBlueprint ?? [];

  // Create a set of completed blueprint hashes
  const completedOrders = new Set<`0x${string}`>(
    loadOptions.filterOutCompleted
      ? completedEvents
          .map((event) => event.args?.blueprintHash)
          .filter((hash): hash is `0x${string}` => hash !== undefined)
      : [],
  );

  // Filter out cancelled and completed orders
  requisitions.filter((req) => {
    const hash = req.requisition.blueprintHash;
    if (knownBlueprintHashes.has(hash.toLowerCase())) {
      return false;
    }
    return !req.isCancelled && !completedOrders.has(req.requisition.blueprintHash);
  });

  const data = requisitions;

  return data;
}

export const decodeConvertUpBlueprintFromAdvancedPipe = (
  calls: readonly AdvancedPipeCall[] | undefined,
  chainId: number,
): ConvertUpBlueprintStruct<TV> | null => {
  if (!calls?.length) {
    console.debug("[Tractor/handleDecodeBlueprintFromAdvancedPipe] No calls provided. Returning null.");
    return null;
  }

  const callData = calls[0].callData;

  try {
    const decoded = decodeFunctionData({
      abi: convertUpBlueprintV0ABI,
      data: callData,
    });

    const params = decoded.args?.[0];

    return transformConvertUpRequisitionEvent(params, chainId);
  } catch (error) {
    console.debug("Failed to decode sowBlueprintv0 data:", error);
    return null;
  }
};

export const loadConvertUpOrderbookData = () => {};
