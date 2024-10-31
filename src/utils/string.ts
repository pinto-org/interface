import { TokenValue } from "@/classes/TokenValue";
import { HashString } from "./types.generic";

export const truncateAddress = (address: string | HashString | undefined, options?: { suffix?: boolean }) => {
  if (!address) return "";

  return `${address.substring(0, 6)}...${options?.suffix ? address.substring(address.length - 4) : ""}`;
};

export const stringEq = (a: string | number | TokenValue | bigint, b: string | number | TokenValue | bigint) => {
  const aVal = a instanceof TokenValue ? a.toHuman() : a;
  const bVal = b instanceof TokenValue ? b.toHuman() : b;

  return aVal.toString().toLowerCase() === bVal.toString().toLowerCase();
};
