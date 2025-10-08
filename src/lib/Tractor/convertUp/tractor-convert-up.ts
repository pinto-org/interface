import { TV } from "@/classes/TokenValue";
import { siloHelpersABI } from "@/constants/abi/SiloHelpersABI";
import { tractorHelpersABI } from "@/constants/abi/TractorHelpersABI";
import { convertUpBlueprintV0ABI } from "@/constants/abi/convertUpBlueprintV0ABI";
import { diamondABI } from "@/constants/abi/diamondABI";
import { diamondPriceABI } from "@/constants/abi/diamondPriceABI";
import { CONVERT_UP_BLUEPRINT_V0_ADDRESS, SILO_HELPERS_ADDRESS, TRACTOR_HELPERS_ADDRESS } from "@/constants/address";
import { STALK } from "@/constants/internalTokens";
import { MAIN_TOKEN } from "@/constants/tokens";
import { beanstalkPriceAddress } from "@/generated/contractHooks";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { getChainConstant } from "@/utils/chain";
import { AdvancedPipeCall } from "@/utils/types";
import { PublicClient, decodeFunctionData, encodeFunctionData } from "viem";
import { multicall } from "viem/actions";
import { base } from "viem/chains";
import {
  CreateTractorDataReturnType,
  TRACTOR_DEPLOYMENT_BLOCK,
  TRACTOR_DEPLOYMENT_BLOCKS_BY_TYPE,
  WithdrawalPlan,
  WithdrawalPlanFilterParams,
  decodeEncodedTractorDataToAdvancedPipeCalls,
  encodeTractorAndOptimizeDeposits,
  getTokenIndexesFromTractorTokenStrategy,
} from "../core";
import {
  getTractorConvertUpParamsDecimalConfig,
  loadPublishedRequisitions,
  transformConvertUpRequisitionEvent,
} from "../requisitions/tractor-requisition";
import { ConvertUpBlueprintStruct, ConvertUpOrderbookEntry, PreparedConvertUpArgs } from "./tractor-convert-up-types";

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
  console.debug("ConvertUp args:", args);

  const struct = {
    convertUpParams: {
      sourceTokenIndices,
      totalBeanAmountToConvert: args.totalBeanAmountToConvert.toBigInt(),
      minBeansConvertPerExecution: args.minBeansConvertPerExecution.toBigInt(),
      maxBeansConvertPerExecution: args.maxBeansConvertPerExecution.toBigInt(),
      capAmountToBonusCapacity: args.capAmountToBonusCapacity,
      minTimeBetweenConverts: args.minTimeBetweenConverts.toBigInt(),
      minConvertBonusCapacity: args.minConvertBonusCapacity.toBigInt(),
      maxGrownStalkPerBdv: args.maxGrownStalkPerBdv.toBigInt(),
      grownStalkPerBdvBonusBid: args.grownStalkPerBdvBonusBid.toBigInt(),
      maxPriceToConvertUp: args.maxPriceToConvertUp.toBigInt(),
      minPriceToConvertUp: args.minPriceToConvertUp.toBigInt(),
      maxGrownStalkPerBdvPenalty: args.maxGrownStalkPerBdvPenalty.toBigInt(),
      slippageRatio: args.slippageRatio.toBigInt(),
      seedDifference: args.seedDifference.toBigInt(),
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
    struct,
    operatorPasteInstrs: [], // TODO: Update if needed
    rawCall: convertUpCall,
    depositOptimizationCalls,
  });

  return {
    struct: struct as unknown as ConvertUpBlueprintStruct<bigint>,
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

export async function loadConvertUpOrderbookData(
  address: string | undefined,
  protocolAddress: `0x${string}` | undefined,
  publicClient: PublicClient | null,
  latestBlock?: { number: bigint; timestamp: bigint } | null,
  _activeApiEntries: ConvertUpOrderbookEntry[] = [], // Any for now since we don't know the schema
  lookbackBlocks?: bigint,
  options?: LoadOrderbookDataOptions,
) {
  if (!protocolAddress || !publicClient) return [];

  const cid = await publicClient.getChainId();

  const mainToken = getChainConstant(cid, MAIN_TOKEN);

  const loadOptions: Required<LoadOrderbookDataOptions> = { filterOutCompleted: true, ...options };

  const knownBlueprintHashes = new Set<string>(
    _activeApiEntries?.map((order) => order.requisition.blueprintHash.toLowerCase()) ?? [],
  );

  let fromBlock: bigint = TRACTOR_DEPLOYMENT_BLOCKS_BY_TYPE.convertUpBlueprint;

  if (lookbackBlocks && latestBlock?.number) {
    const newFromBlock = latestBlock.number - lookbackBlocks;
    if (newFromBlock > 0n) {
      fromBlock = newFromBlock;
    }
  }

  const [_requisitions, _priceResult, bonusAndCapacityResult] = await Promise.all([
    // publicClient.getContractEvents({
    //   address: CONVERT_UP_BLUEPRINT_V0_ADDRESS,
    //   abi: convertUpBlueprintV0ABI,
    //   eventName: "ConvertUpOrderComplete" as const,
    //   fromBlock: fromBlock,
    //   toBlock: "latest",
    // }),
    loadPublishedRequisitions(address, protocolAddress, publicClient, latestBlock, "convertUpBlueprint", fromBlock),
    publicClient.readContract({
      address: beanstalkPriceAddress[cid],
      abi: diamondPriceABI,
      functionName: "price",
      args: [],
    }),
    publicClient.readContract({
      address: protocolAddress,
      abi: diamondABI,
      functionName: "getConvertStalkPerBdvBonusAndMaximumCapacity",
      args: [],
    }),
  ]);

  console.debug("TRACTOR/loadConvertUpOrderbookData] result", {
    requisitions: _requisitions,
    // completedEvents,
    bonusAndCapacityResult,
    priceResult: _priceResult,
  });

  const requisitions = _requisitions?.convertUpBlueprint ?? [];

  // Process market data
  const currentPrice = TV.fromBigInt(_priceResult.price, mainToken.decimals);
  const [bonusRaw, capacityRaw] = bonusAndCapacityResult;
  const currentBonus = TV.fromBigInt(bonusRaw, STALK.decimals - mainToken.decimals);
  const currentCapacity = TV.fromBigInt(capacityRaw, mainToken.decimals);

  console.debug("[TRACTOR/loadConvertUpOrderbookData] Market data:", {
    currentPrice: currentPrice.toHuman(),
    currentBonus: currentBonus.toHuman(),
    currentCapacity: capacityRaw,
  });

  // Update meetsConditions and conversion amounts for API entries based on current market data
  const updatedApiEntries = _activeApiEntries.map((entry) => {
    const meetsConditions = {
      price: false,
      bonus: false,
      capacity: false,
    };

    // Calculate conversion amounts for API entries
    let currentlyConvertible = TV.ZERO;
    let amountConvertibleNextExecution = TV.ZERO;

    if (entry.decodedData) {
      const minPrice = entry.decodedData.convertUpParams.minPriceToConvertUp;
      const maxPrice = entry.decodedData.convertUpParams.maxPriceToConvertUp;
      const minBonus = entry.decodedData.convertUpParams.grownStalkPerBdvBonusBid;
      const minCapacity = entry.decodedData.convertUpParams.minConvertBonusCapacity;

      meetsConditions.price = currentPrice.gte(minPrice) && currentPrice.lte(maxPrice);
      meetsConditions.bonus = currentBonus.gte(minBonus);
      meetsConditions.capacity = currentCapacity.gte(minCapacity);

      // Calculate how much BDV this order can convert
      currentlyConvertible = TV.min(entry.orderInfo.bdvLeftToConvert, entry.totalAvailableBdv);

      // Calculate amount convertible next execution
      const maxBdvPerExecution = entry.decodedData.convertUpParams.maxBeansConvertPerExecution;
      amountConvertibleNextExecution = TV.min(currentlyConvertible, maxBdvPerExecution);
    }

    return {
      ...entry,
      meetsConditions,
      amountConvertibleNextExecution,
    };
  });

  // Create a set of completed blueprint hashes
  // const completedOrders = new Set<`0x${string}`>(
  //   loadOptions.filterOutCompleted
  //     ? completedEvents
  //         .map((event) => event.args?.blueprintHash)
  //         .filter((hash): hash is `0x${string}` => hash !== undefined)
  //     : [],
  // );

  // Filter out cancelled and completed orders
  const activeRequisitions = requisitions.filter((req) => {
    const hash = req.requisition.blueprintHash;
    if (knownBlueprintHashes.has(hash.toLowerCase())) {
      return false;
    }
    return !req.isCancelled;
  });

  console.log("activeRequisitions", activeRequisitions);

  // Fetch order info for all active requisitions
  const mcResults = await multicall(publicClient, {
    contracts: activeRequisitions.map((req) => ({
      address: CONVERT_UP_BLUEPRINT_V0_ADDRESS,
      abi: convertUpBlueprintV0ABI,
      functionName: "orderInfo" as const,
      args: [req.requisition.blueprintHash],
    })),
  });

  // Process requisitions with decoded data and market condition checks
  const requisitionsWithConditions = activeRequisitions.map((req, idx) => {
    const decodedData = req.decodedData;
    const orderInfoResult = mcResults[idx];

    let orderInfo = {
      lastExecutedTimestamp: undefined as string | undefined,
      bdvLeftToConvert: TV.ZERO,
    };

    if (orderInfoResult?.status === "success") {
      const [lastExecutedTimestamp, bdvLeftToConvert] = orderInfoResult.result;
      let bdvLeftToConvertTV = decodedData?.convertUpParams.totalBeanAmountToConvert ?? TV.ZERO;

      // Order has been executed at least once
      if (lastExecutedTimestamp !== 0n) {
        bdvLeftToConvertTV = TV.fromBigInt(bdvLeftToConvert, mainToken.decimals);
      }

      orderInfo = {
        lastExecutedTimestamp: lastExecutedTimestamp !== 0n ? lastExecutedTimestamp.toString() : undefined,
        bdvLeftToConvert: bdvLeftToConvertTV,
      };
    }

    // Check market conditions
    const meetsConditions = {
      price: false,
      bonus: false,
      capacity: false,
    };

    if (decodedData) {
      const minPrice = decodedData.convertUpParams.minPriceToConvertUp;
      const maxPrice = decodedData.convertUpParams.maxPriceToConvertUp;
      const minBonus = decodedData.convertUpParams.grownStalkPerBdvBonusBid;
      const minCapacity = decodedData.convertUpParams.minConvertBonusCapacity;

      meetsConditions.price = currentPrice.gte(minPrice) && currentPrice.lte(maxPrice);
      meetsConditions.bonus = currentBonus.gte(minBonus);
      meetsConditions.capacity = currentCapacity.gte(minCapacity);
    }

    return {
      ...req,
      decodedData: decodedData || undefined,
      orderInfo,
      meetsConditions,
      // Initialize fields that will be populated later
      withdrawalPlan: undefined,
      totalAvailableBdv: TV.ZERO,
      currentlyConvertible: TV.ZERO,
      amountConvertibleNextExecution: TV.ZERO,
    } as ConvertUpOrderbookEntry;
  });

  // Implement three-tier sorting for chain requisitions only
  const sortedRequisitions = [...requisitionsWithConditions];
  sortConvertOrderbookData(sortedRequisitions, "hash");

  console.debug(
    "[TRACTOR/loadConvertUpOrderbookData] Sorted orders:",
    sortedRequisitions.map((req, idx) => ({
      index: idx,
      req: req,
      publisher: req.requisition.blueprint.publisher,
      meetsConditions: req.meetsConditions,
      tip: req.decodedData?.opParams.operatorTipAmount ? req.decodedData.opParams.operatorTipAmount : "0",
    })),
  );

  // Track used withdrawal plans per publisher
  const publisherWithdrawalPlans: { [publisher: string]: WithdrawalPlan[] } = {};

  // create a copy
  const remainingCapacity = TV.from(currentCapacity.value);

  // Initialize orderbook data with updated API entries (they don't need withdrawal plan processing)
  const orderbookData: ConvertUpOrderbookEntry[] = [...updatedApiEntries];

  for (let i = 0; i < sortedRequisitions.length; i++) {
    const entry = sortedRequisitions[i];
    const publisher = entry.requisition.blueprint.publisher;
    const decodedData = entry.decodedData;

    if (!decodedData) {
      orderbookData.push(entry);
      continue;
    }

    console.debug(`\n--- Processing ConvertUp Order #${i + 1} ---`, {
      publisher,
      meetsConditions: entry.meetsConditions,
    });

    try {
      // Get existing withdrawal plans for this publisher
      const existingPlans: WithdrawalPlan[] = publisherWithdrawalPlans[publisher] || [];
      console.debug("Existing plans for publisher:", existingPlans.length);

      let combinedExistingPlan: WithdrawalPlan | null = null;

      // If we have existing plans, combine them
      if (existingPlans.length > 0) {
        try {
          const combinedPlan = await publicClient.readContract({
            address: TRACTOR_HELPERS_ADDRESS,
            abi: tractorHelpersABI,
            functionName: "combineWithdrawalPlans",
            args: [existingPlans as any],
          });

          combinedExistingPlan = combinedPlan as WithdrawalPlan;

          console.debug("Combined existing plans for publisher:", publisher);
          console.debug(
            "Total available BDV in combined plan:",
            TV.fromBlockchain(combinedPlan.totalAvailableBeans, mainToken.decimals).toHuman(),
          );
        } catch (error) {
          console.error("Failed to combine withdrawal plans:", error);
          combinedExistingPlan = null;
        }
      }

      const filterParams: WithdrawalPlanFilterParams = {
        maxGrownStalkPerBdv: decodedData.convertUpParams.maxGrownStalkPerBdv.toBigInt(),
        minStem: 0n - TV.MAX_INT96.toBigInt(), // negative max stem
        excludeGerminatingDeposits: true,
        excludeBean: true,
        lowStalkDeposits: Number(decodedData.convertUpParams.lowStalkDeposits),
        lowGrownStalkPerBdv: decodedData.convertUpParams.grownStalkPerBdvBonusBid.toBigInt(),
        maxStem: TV.MAX_INT96.toBigInt(),
        seedDifference: decodedData.convertUpParams.seedDifference.toBigInt(),
      } as const;

      // Get a new withdrawal plan that excludes deposits already allocated
      let withdrawalPlan: WithdrawalPlan | null = null;
      let totalAvailableBdv = TV.ZERO;

      const emptyPlan: WithdrawalPlan = {
        sourceTokens: [] as readonly `0x${string}`[],
        stems: [] as readonly (readonly bigint[])[],
        amounts: [] as readonly (readonly bigint[])[],
        availableBeans: [] as readonly bigint[],
        totalAvailableBeans: 0n,
      };

      try {
        // For subsequent orders, use getWithdrawalPlanExcludingPlan
        withdrawalPlan = await publicClient.readContract({
          address: SILO_HELPERS_ADDRESS,
          abi: siloHelpersABI,
          functionName: "getWithdrawalPlanExcludingPlan" as const,
          args: [
            publisher,
            decodedData.convertUpParams.sourceTokenIndices,
            decodedData.convertUpParams.totalBeanAmountToConvert.toBigInt(),
            filterParams as never, // TODO: Fix this
            (combinedExistingPlan || emptyPlan) as never,
          ],
        });

        console.debug("Got updated withdrawal plan excluding existing orders");
        totalAvailableBdv = TV.fromBlockchain(withdrawalPlan.totalAvailableBeans, mainToken.decimals);

        // Add this plan to the list of existing plans for future orders
        if (withdrawalPlan.sourceTokens.length > 0) {
          if (!publisherWithdrawalPlans[publisher]) {
            publisherWithdrawalPlans[publisher] = [];
          }
          publisherWithdrawalPlans[publisher].push(withdrawalPlan);
        }
      } catch (error: any) {
        console.warn("Failed to get withdrawal plan:", error?.message || error);

        withdrawalPlan = {
          sourceTokens: [] as readonly `0x${string}`[],
          stems: [] as readonly (readonly bigint[])[],
          amounts: [] as readonly (readonly bigint[])[],
          availableBeans: [] as readonly bigint[],
          totalAvailableBeans: 0n,
        };
        totalAvailableBdv = TV.ZERO;

        // Handle specific error cases
        if (
          error?.message?.includes("No beans available") ||
          error?.message?.includes("reverted") ||
          error?.cause?.reason
        ) {
          console.debug("No BDV available for this order or contract reverted, setting available BDV to 0");
        } else {
          // For unexpected errors, still set empty plan to continue processing
          console.error("Unexpected error getting withdrawal plan, continuing with empty plan:", error);
        }
      }

      // Calculate how much BDV this order can convert
      const currentlyConvertible = TV.min(entry.orderInfo.bdvLeftToConvert, totalAvailableBdv);
      console.debug(`Total available BDV: ${totalAvailableBdv.toHuman()}`);
      console.debug(`Currently convertible: ${currentlyConvertible.toHuman()}`);

      // Calculate amount convertible next execution
      let amountConvertibleNextExecution = currentlyConvertible;
      const maxBdvPerExecution = decodedData.convertUpParams.maxBeansConvertPerExecution;
      amountConvertibleNextExecution = TV.min(currentlyConvertible, maxBdvPerExecution);
      console.debug(`Max BDV per execution: ${maxBdvPerExecution.toHuman()}`);
      console.debug(`Amount convertible next execution: ${amountConvertibleNextExecution.toHuman()}`);

      orderbookData.push({
        ...entry,
        withdrawalPlan: withdrawalPlan || undefined,
        totalAvailableBdv,
        amountConvertibleNextExecution,
      });
    } catch (error) {
      console.error(`Failed to process order ${entry.requisition.blueprintHash}:`, error);
      orderbookData.push({
        ...entry,
        withdrawalPlan: undefined,
        totalAvailableBdv: TV.ZERO,
        amountConvertibleNextExecution: TV.ZERO,
      });
    }
  }

  // Final sort by operator tips for display/execution priority
  sortConvertOrderbookData(orderbookData, "tip");

  console.debug("[TRACTOR/loadConvertUpOrderbookData] Final results:", {
    totalOrders: orderbookData.length,
    ordersWithWithdrawalPlans: orderbookData.filter((o) => o.withdrawalPlan).length,
    ordersReadyToConvert: orderbookData.filter((o) => o.amountConvertibleNextExecution.gt(0)).length,
  });

  console.log("orderbookData", orderbookData);

  return orderbookData;
}

const sortConvertOrderbookData = (orderbookData: ConvertUpOrderbookEntry[], finalSortBy: "hash" | "tip" = "tip") => {
  orderbookData.sort((a, b) => {
    // Count how many conditions each order meets
    const aScore =
      (a.meetsConditions.price ? 1 : 0) + (a.meetsConditions.bonus ? 1 : 0) + (a.meetsConditions.capacity ? 1 : 0);
    const bScore =
      (b.meetsConditions.price ? 1 : 0) + (b.meetsConditions.bonus ? 1 : 0) + (b.meetsConditions.capacity ? 1 : 0);

    // Higher score (more conditions met) comes first
    if (aScore !== bScore) {
      return bScore - aScore;
    }

    // If same score, prioritize by individual conditions in order: price > bonus > capacity
    if (a.meetsConditions.price !== b.meetsConditions.price) return a.meetsConditions.price ? -1 : 1;
    if (a.meetsConditions.bonus !== b.meetsConditions.bonus) return a.meetsConditions.bonus ? -1 : 1;
    if (a.meetsConditions.capacity !== b.meetsConditions.capacity) return a.meetsConditions.capacity ? -1 : 1;

    if (finalSortBy === "tip") {
      const aTip = a.decodedData?.opParams.operatorTipAmount ?? TV.ZERO;
      const bTip = b.decodedData?.opParams.operatorTipAmount ?? TV.ZERO;
      return bTip.sub(aTip).toNumber();
    }

    // If all conditions are the same, sort by blueprint hash (higher first). This way it is deterministic.
    return BigInt(a.requisition.blueprintHash) > BigInt(b.requisition.blueprintHash) ? 1 : -1;
  });
};

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

export const decodeConvertUpTractorOrder = (
  encodedData: `0x${string}`,
  chainId: number = base.id,
): ConvertUpBlueprintStruct<TV> | null => {
  try {
    const pipeCalls = decodeEncodedTractorDataToAdvancedPipeCalls(encodedData, "convertUp");

    if (pipeCalls?.length) {
      return decodeConvertUpBlueprintFromAdvancedPipe(pipeCalls, chainId);
    }
  } catch (e) {
    console.error("Failed to decode convertUp Tractor Data:", e);
  }

  return null;
};
