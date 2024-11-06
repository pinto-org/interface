import { TokenValue } from "@/classes/TokenValue";
import { HashString } from "./types.generic";
import { exists } from "./utils";

export const truncateAddress = (address: string | HashString | undefined, options?: { suffix?: boolean }) => {
  if (!address) return "";

  return `${address.substring(0, 6)}...${options?.suffix ? address.substring(address.length - 4) : ""}`;
};

type Stringable = HashString | string | number | TokenValue | bigint | undefined | null;

export const stringEq = (a: Stringable, b: Stringable) => {
  if (!exists(a) || !exists(b)) return false;

  const aVal = a instanceof TokenValue ? a.toHuman() : a;
  const bVal = b instanceof TokenValue ? b.toHuman() : b;

  return aVal.toString().toLowerCase() === bVal.toString().toLowerCase();
};
