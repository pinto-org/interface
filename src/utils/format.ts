import { TokenValue } from "@/classes/TokenValue";
import { CBBTC, PINTOCBBTC } from "@/constants/tokens";
import { tokensEqual } from "./token";
import { Token } from "./types";

type NumberPrimitive = string | number | TokenValue | bigint | undefined | null;

interface IMinValue {
  minValue?: number;
}

interface IDecimals {
  minDecimals?: number;
  maxDecimals?: number;
}

interface IDefaultValue {
  defaultValue?: string;
}

interface IAllowZero {
  allowZero?: boolean;
}

type FormatNumOptions = IMinValue & IDecimals & IDefaultValue & IAllowZero;

/**
 * We can for the most part use TokenValue.toHuman("short"),
 * but we can use this in cases where we don't want the shorthand K/M/B/T suffixes.
 * We use Number.toLocaleString() instead of Number.toFixed() as it includes thousands separators
 */
export const formatNum = (val: NumberPrimitive, options?: FormatNumOptions) => {
  if (val === undefined || val === null) return options?.defaultValue || "0";

  const normalised = val instanceof TokenValue ? val.toHuman() : val.toString();

  const num = Number(normalised);

  if (options?.allowZero && num === 0) {
    return num.toLocaleString("en-US", {
      minimumFractionDigits: options.minDecimals || 0,
      maximumFractionDigits: options.maxDecimals || 2,
    });
  }
  if (options?.minValue) {
    if (num > 0 && num < options.minValue) {
      return `<${options.minValue}`;
    }
  }

  return new Intl.NumberFormat("en-US", {
    notation: "standard",
    minimumFractionDigits: options?.minDecimals ?? 0,
    maximumFractionDigits: options?.maxDecimals ?? 2,
    useGrouping: true,
  }).format(num);
};

export const formatUSD = (val: NumberPrimitive) => {
  return `$${formatNum(val || TokenValue.ZERO, { minDecimals: 2, maxDecimals: 2, defaultValue: "0.00", minValue: 0.01, allowZero: true })}`;
};

export const formatPDV = (val: NumberPrimitive) => {
  return `${formatNum(val || TokenValue.ZERO, { minDecimals: 2, maxDecimals: 2, defaultValue: "0.00", minValue: 0.01, allowZero: true })} PDV`;
};

export const formatPct = (val: NumberPrimitive) => {
  if (val === undefined || val === null) return "0.00%";
  const formatted = formatNum(val, {
    minDecimals: 2,
    maxDecimals: 2,
    defaultValue: "0.00",
    minValue: 0.01,
    allowZero: true,
  });
  return `${formatted}%`;
};

export const formatNoDecimals = (val: NumberPrimitive) => {
  return formatNum(val || TokenValue.ZERO, {
    minDecimals: 0,
    maxDecimals: 0,
    defaultValue: "0",
    minValue: 0.01,
    allowZero: true,
  });
};

export type Format2DecimalsOptions = IAllowZero;

export const format2Decimals = (val: NumberPrimitive, options?: IAllowZero) => {
  return formatNum(val || TokenValue.ZERO, {
    minDecimals: 2,
    maxDecimals: 2,
    defaultValue: "0.00",
    minValue: 0.01,
    allowZero: options?.allowZero || true,
  });
};

export const formatDate = (date: Date) => {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const period = hours >= 12 ? "pm" : "am";

  hours = hours % 12 || 12;
  const formattedTime = `${hours}:${minutes}${period}`;

  return `${month}/${day}/${year} • ${formattedTime}`;
};

function normalizeTokenAmount(val: NumberPrimitive, token: Token) {
  if (val instanceof TokenValue) {
    return val.toNumber();
  }
  if (typeof val === "bigint") {
    return TokenValue.fromBlockchain(val, token.decimals).toNumber();
  }
  return Number(val);
}

export const formatTokenAmount = (val: NumberPrimitive, token: Token) => {
  if (tokensEqual(token, CBBTC) || tokensEqual(token, PINTOCBBTC)) {
    return formatNum(normalizeTokenAmount(val, token), {
      minDecimals: 6,
      maxDecimals: 6,
      defaultValue: "0.00",
      minValue: 0.000001,
      allowZero: true,
    });
  }
  return format2Decimals(normalizeTokenAmount(val, token), { allowZero: true });
};

export const formatter = {
  number: formatNum,
  usd: formatUSD,
  pdv: formatPDV,
  pct: formatPct,
  noDec: formatNoDecimals,
  twoDec: format2Decimals,
  date: formatDate,
  token: formatTokenAmount,
};

export function truncateHex(hex: string, left: number = 4, right: number = 3) {
  return `${hex.slice(0, left)}...${hex.slice(-right)}`;
}
