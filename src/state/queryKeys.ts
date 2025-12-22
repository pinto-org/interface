import { TV } from "@/classes/TokenValue";
import { TractorAPIOrderOptions } from "@/lib/Tractor/api";
import { HashString } from "@/utils/types.generic";

// ────────────────────────────────────────────────────────────────────────────────
// BASE QueryKey
// ────────────────────────────────────────────────────────────────────────────────

const BASE_QKS = {
  tractor: ["TRACTOR"],
  events: ["EVENTS"],
  network: ["NETWORK"],
  silo: {
    convert: ["SILO-CONVERT"],
  },
} as const;

// ────────────────────────────────────────────────────────────────────────────────
// TRACTOR Query Keys
// ────────────────────────────────────────────────────────────────────────────────

const convertUpQK = {
  convertUpOrders: (args: TractorAPIOrderOptions) => [
    BASE_QKS.tractor,
    "convertUpOrders",
    "api",
    `publisher-${args?.publisher ?? "none"}`,
    `orderType-${args?.orderType ?? "any"}`,
    `cancelled-${args?.cancelled ?? "any"}`,
  ],
  convertUpOrdersV0Chain: (
    lastUpdatedBlock: number,
    options?: {
      cancelled?: boolean;
      filterOutCompleted?: boolean;
    },
  ) => [
    BASE_QKS.tractor,
    "convertUpOrders",
    "chain",
    lastUpdatedBlock?.toString() ?? "0",
    `filter-completed-${Number(options?.filterOutCompleted ?? true)}`,
    `cancelled-${Number(options?.cancelled ?? "any")}`,
  ],
} as const;

const tractorQueryKeys = {
  // Sow Orders V0 api cal
  sowOrdersV0: (args?: TractorAPIOrderOptions) => [
    BASE_QKS.tractor,
    "sowOrdersV0",
    "api",
    `publisher-${args?.publisher ?? "none"}`,
    `orderType-${args?.orderType ?? "any"}`,
    `cancelled-${args?.cancelled ?? "any"}`,
  ],
  sowOrdersV0Chain: (
    lastUpdatedBlock: number,
    maxTemp: TV | undefined,
    options?: {
      cancelled?: boolean;
      filterOutCompleted?: boolean;
    },
  ) => [
    BASE_QKS.tractor,
    "sowOrdersV0",
    "chain",
    lastUpdatedBlock?.toString() ?? "0",
    maxTemp?.blockchainString ?? "0",
    `filter-completed-${Number(options?.filterOutCompleted ?? true)}`,
    `cancelled-${Number(options?.cancelled ?? "any")}`,
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
  ...convertUpQK,
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

const siloQueryKeys = {
  convert: {
    quote: (
      account: HashString | undefined,
      source: HashString | undefined,
      target: HashString | undefined,
      amountIn: string,
      isPairWithdrawal: boolean,
      isConvertDeposit: boolean,
      slippage: number,
    ) => {
      return [
        BASE_QKS.silo.convert,
        "quote",
        `account=${account ?? "no-account"}`,
        `source=${source ?? "no-source"}`,
        `target=${target ?? "no-target"}`,
        `amount=${amountIn}`,
        `isPairWithdrawal=${isPairWithdrawal}`,
        `slippage=${slippage}`,
      ] as const;
    },
    maxConvert: (
      source: HashString | undefined,
      target: HashString | undefined,
      farmerMaxConvertible: string | undefined,
    ) =>
      [
        BASE_QKS.silo.convert,
        "max-convert",
        `source=${source ?? "no-source"}`,
        `target=${target ?? "no-target"}`,
        `farmerMaxConvertible=${farmerMaxConvertible ?? "none"}`,
      ] as const,
  },
} as const;

// ────────────────────────────────────────────────────────────────────────────────
// AGGREGATE QUERY KEYS
// ────────────────────────────────────────────────────────────────────────────────

export const queryKeys = {
  base: BASE_QKS,
  tractor: tractorQueryKeys,
  events: eventsQueryKeys,
  network: networkQueryKeys,
  silo: siloQueryKeys,
} as const;
