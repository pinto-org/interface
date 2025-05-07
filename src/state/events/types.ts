import { TV } from "@/classes/TokenValue";

// ────────────────────────────────────────────────────────────────────────────────
// INTERFACE
// ────────────────────────────────────────────────────────────────────────────────

export type FieldActivityEventType = "sow" | "harvest" | "transfer" | "other";

export interface BaseFieldActivityEventItem {
  id: string;
  timestamp: number; // Unix timestamp
  type: FieldActivityEventType;
}

export interface FieldSowEventItem extends BaseFieldActivityEventItem {
  season: number | null;
  amount: TV;
  pods: TV;
  temperature: number;
  placeInLine: string;
  address: string;
  txHash: string;
}
