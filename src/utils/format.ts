import { TokenValue } from "@/classes/TokenValue";
import { CBBTC, PINTOCBBTC } from "@/constants/tokens";
import { tokensEqual } from "./token";
import { InternalToken, Token } from "./types";

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

interface IShowPositiveSign {
  showPositiveSign?: boolean;
}

type FormatNumOptions = IMinValue & IDecimals & IDefaultValue & IAllowZero & IShowPositiveSign;

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

  const formatted = new Intl.NumberFormat("en-US", {
    notation: "standard",
    minimumFractionDigits: options?.minDecimals || 0,
    maximumFractionDigits: options?.maxDecimals || 2,
    useGrouping: true,
    signDisplay: options?.showPositiveSign ? "exceptZero" : "auto",
  }).format(num);

  return formatted;
};

export const formatUSD = (val: NumberPrimitive, options?: IShowPositiveSign) => {
  const formatted = formatNum(val || TokenValue.ZERO, {
    minDecimals: 2,
    maxDecimals: 2,
    defaultValue: "0.00",
    minValue: 0.01,
    allowZero: true,
    showPositiveSign: options?.showPositiveSign,
  });
  return `$${formatted}`;
};

export const formatPDV = (val: NumberPrimitive, options?: IShowPositiveSign) => {
  const formatted = formatNum(val || TokenValue.ZERO, {
    minDecimals: 2,
    maxDecimals: 2,
    defaultValue: "0.00",
    minValue: 0.01,
    allowZero: true,
    showPositiveSign: options?.showPositiveSign,
  });
  return `${formatted} PDV`;
};

export const formatPct = (val: NumberPrimitive, options?: IShowPositiveSign) => {
  if (val === undefined || val === null) return "0.00%";
  const formatted = formatNum(val, {
    minDecimals: 2,
    maxDecimals: 2,
    defaultValue: "0.00",
    minValue: 0.01,
    allowZero: true,
    showPositiveSign: options?.showPositiveSign,
  });
  return `${formatted}%`;
};

export const formatNoDecimals = (val: NumberPrimitive, options?: IShowPositiveSign) => {
  return formatNum(val || TokenValue.ZERO, {
    minDecimals: 0,
    maxDecimals: 0,
    defaultValue: "0",
    minValue: 0.01,
    allowZero: true,
    showPositiveSign: options?.showPositiveSign,
  });
};

export type Format2DecimalsOptions = IAllowZero & IShowPositiveSign;

export const format2Decimals = (val: NumberPrimitive, options?: Format2DecimalsOptions) => {
  return formatNum(val || TokenValue.ZERO, {
    minDecimals: 2,
    maxDecimals: 2,
    defaultValue: "0.00",
    minValue: 0.01,
    allowZero: options?.allowZero || true,
    showPositiveSign: options?.showPositiveSign,
  });
};

function normalizeTokenAmount(val: NumberPrimitive, token: Token | InternalToken) {
  if (val instanceof TokenValue) {
    return val.toNumber();
  }
  if (typeof val === "bigint") {
    return TokenValue.fromBlockchain(val, token.displayDecimals ?? token.decimals).toNumber();
  }
  return Number(val);
}

export const formatTokenAmount = (val: NumberPrimitive, token: Token | InternalToken, options?: IShowPositiveSign) => {
  if (tokensEqual(token, CBBTC) || tokensEqual(token, PINTOCBBTC)) {
    return formatNum(normalizeTokenAmount(val, token), {
      minDecimals: 6,
      maxDecimals: 6,
      defaultValue: "0.00",
      minValue: 0.000001,
      allowZero: true,
      showPositiveSign: options?.showPositiveSign,
    });
  }
  return format2Decimals(normalizeTokenAmount(val, token), {
    allowZero: true,
    showPositiveSign: options?.showPositiveSign,
  });
};

export const formatter = {
  number: formatNum,
  usd: formatUSD,
  pdv: formatPDV,
  pct: formatPct,
  noDec: formatNoDecimals,
  twoDec: format2Decimals,
  token: formatTokenAmount,
};

export function truncateHex(hex: string, left: number = 4, right: number = 3) {
  return `${hex.slice(0, left)}...${hex.slice(-right)}`;
}
