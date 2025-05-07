import { TV } from "@/classes/TokenValue";
import { TractorAPIOrderOptions } from "@/lib/Tractor/api";
import { MinimumViableBlock } from "@/utils/types";
import { HashString } from "@/utils/types.generic";

// ────────────────────────────────────────────────────────────────────────────────
// BASE QueryKey
// ────────────────────────────────────────────────────────────────────────────────

const BASE_QKS = {
  tractor: ["TRACTOR"] as const,
  events: ["EVENTS"] as const,
  network: ["NETWORK"] as const,
} as const;

// ────────────────────────────────────────────────────────────────────────────────
// TRACTOR Query Keys
// ────────────────────────────────────────────────────────────────────────────────

const getLatestBlockKeyFragment = (args: MinimumViableBlock<bigint> | undefined) =>
  args?.number.toString() ?? "no-block-number";

const tractorQueryKeys = {
  // Sow Orders V0 api cal
  sowOrdersV0: (args?: TractorAPIOrderOptions) => [
    BASE_QKS.tractor,
    "sowOrdersV0",
    "api",
    args?.publisher,
    args?.orderType,
    args?.cancelled ?? false,
  ],
  sowOrdersV0Chain: (lastUpdatedBlock: number, maxTemp: TV | undefined) => [
    BASE_QKS.tractor,
    "sowOrdersV0",
    "chain",
    lastUpdatedBlock?.toString() ?? "0",
    maxTemp?.blockchainString ?? "0",
  ],
  operatorAverageTipPaid: (lookbackBlocks?: bigint) => [
    BASE_QKS.tractor,
    "operatorAverageTipPaid",
    lookbackBlocks?.toString() ?? "0",
  ],
  tractorEvents: [BASE_QKS.tractor, "events", "requisitions-and-cancelled-blueprints"],
  tractorExecutions: (publisher: HashString | undefined) => [
    BASE_QKS.tractor,
    "executions",
    publisher ?? "no-publisher",
  ],
  tractorExecutionsChain: (publisher: HashString | undefined, lastUpdatedBlock: number | undefined) => [
    BASE_QKS.tractor,
    "executions",
    publisher ?? "no-publisher",
    lastUpdatedBlock?.toString() ?? "0",
  ],
} as const;

// ────────────────────────────────────────────────────────────────────────────────
// Events Query Keys
// ────────────────────────────────────────────────────────────────────────────────

const eventsQueryKeys = {
  fieldSowEvents: [BASE_QKS.events, "fieldSowEvents"] as const,
} as const;

// ────────────────────────────────────────────────────────────────────────────────
// CHAIN Query Keys
// ────────────────────────────────────────────────────────────────────────────────

const networkQueryKeys = {
  latestBlock: (key: string = "default") => [BASE_QKS.network, "latestBlock", key] as const,
} as const;

// ────────────────────────────────────────────────────────────────────────────────
// AGGREGATE QUERY KEYS
// ────────────────────────────────────────────────────────────────────────────────

export const queryKeys = {
  tractor: tractorQueryKeys,
  events: eventsQueryKeys,
  network: networkQueryKeys,
} as const;
