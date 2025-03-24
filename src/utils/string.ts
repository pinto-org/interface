import { TokenValue } from "@/classes/TokenValue";
import { isAddress } from "viem";
import { HashString } from "./types.generic";
import { exists } from "./utils";

export const truncateAddress = (
  address: string | HashString | undefined,
  options?: { suffix?: boolean; letters?: number },
) => {
  if (!address) return "";
  const letters = options?.letters ?? 4;

  return `${address.substring(0, letters + 2)}...${options?.suffix ? address.substring(address.length - letters) : ""}`;
};

type Stringable = HashString | string | number | TokenValue | bigint | undefined | null;

export const stringEq = (a: Stringable, b: Stringable) => {
  if (!exists(a) || !exists(b)) return false;

  const aVal = a instanceof TokenValue ? a.toHuman() : a;
  const bVal = b instanceof TokenValue ? b.toHuman() : b;

  return aVal.toString().toLowerCase() === bVal.toString().toLowerCase();
};

const invalidNumInputs = new Set([".", "e", "nan", "-", "+"]);

export const toValidStringNumInput = (val: string): string => {
  if (!val) return "0";
  const valid = val.replace(/[e\-\+]/g, "");
  return valid;
};

export const stringToStringNum = (val: string) => {
  if (!val) return 0;
  if (invalidNumInputs.has(val.toLowerCase())) return 0;
  return val;
};

export const stringToNumber = (val: string) => {
  if (!val) return 0;
  if (invalidNumInputs.has(val.toLowerCase())) return 0;

  return Number(val);
};

export const getClaimText = (beanRewards: TokenValue, stalkRewards: TokenValue, seedRewards: TokenValue) => {
  const rewards: string[] = [];
  if (beanRewards.gte(0.01)) rewards.push("Pinto");
  if (stalkRewards.gte(0.01)) rewards.push("Stalk");
  if (seedRewards.gte(0.01)) rewards.push("Seed");

  if (rewards.length === 0) return "Nothing to claim";
  if (rewards.length === 1) return `Claim ${rewards[0]}`;
  if (rewards.length === 2) return `Claim ${rewards.join(" and ")}`;

  // When there are three rewards, add comma
  return `Claim ${rewards.slice(0, -1).join(", ")}, and ${rewards[rewards.length - 1]}`;
};

export const isValidAddress = (address: string | HashString | undefined) => {
  if (!address) return false;
  return isAddress(address);
};
