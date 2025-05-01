import { TokenValue } from "@/classes/TokenValue";
import { CBBTC, PINTOCBBTC, PINTOWSOL, WSOL } from "@/constants/tokens";
import { tokensEqual } from "./token";
import { InternalToken, Token } from "./types";
import { exists } from "./utils";

type NumberPrimitive = string | number | TokenValue | bigint | undefined | null;

interface IMinValue {
  minValue?: number;
}

interface IDecimals {
  minDecimals?: number;
  maxDecimals?: number;
}

interface IExactDecimals {
  decimals?: number;
}

interface IDefaultValue {
  defaultValue?: string;
}

interface IAllowZero {
  allowZero?: boolean;
}

interface IShowPositiveSign {
  showPositiveSign?: boolean;
  showPlusOnZero?: boolean;
}

type FormatNumOptions = IMinValue & IDecimals & IDefaultValue & IAllowZero & IShowPositiveSign;

type FormatPctOptions = IDecimals & IShowPositiveSign & IDefaultValue;

type FormatUSDOptions = IShowPositiveSign & IExactDecimals;

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
    const formatted = num.toLocaleString("en-US", {
      minimumFractionDigits: options.minDecimals || 0,
      maximumFractionDigits: options.maxDecimals || 2,
    });
    return options?.showPlusOnZero && options?.showPositiveSign ? `+${formatted}` : formatted;
  }

  if (options?.minValue) {
    if (num > 0 && num < options.minValue) {
      return `<${options.minValue}`;
    }
  }

  const formatted = new Intl.NumberFormat("en-US", {
    notation: "standard",
    minimumFractionDigits: options?.minDecimals ?? 0,
    maximumFractionDigits: options?.maxDecimals ?? 2,
    useGrouping: true,
    signDisplay: options?.showPositiveSign ? (options?.showPlusOnZero ? "always" : "exceptZero") : "auto",
  }).format(num);

  return formatted;
};

export const formatUSD = (val: NumberPrimitive, options?: FormatUSDOptions) => {
  const formatted = formatNum(val || TokenValue.ZERO, {
    minDecimals: options?.decimals ?? 2,
    maxDecimals: options?.decimals ?? 2,
    defaultValue: "0.00",
    minValue: 0.01,
    allowZero: true,
    showPositiveSign: options?.showPositiveSign,
    showPlusOnZero: options?.showPlusOnZero,
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
    showPlusOnZero: options?.showPlusOnZero,
  });
  return `${formatted} PDV`;
};

export const formatPct = (val: NumberPrimitive, options?: FormatPctOptions) => {
  if (val === undefined || val === null) {
    return options?.defaultValue || "0.00%";
  }
  const formatted = formatNum(val, {
    minDecimals: options?.minDecimals ?? 2,
    maxDecimals: options?.maxDecimals ?? 2,
    defaultValue: "0.00",
    minValue: 0.01,
    allowZero: true,
    showPositiveSign: options?.showPositiveSign,
    showPlusOnZero: options?.showPlusOnZero,
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
    showPlusOnZero: options?.showPlusOnZero,
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
    showPlusOnZero: options?.showPlusOnZero,
  });
};

export type FormatXDecimalsOptions = IAllowZero & IShowPositiveSign;

export const formatXDecimals = (val: NumberPrimitive, decimals: number, options?: FormatXDecimalsOptions) => {
  return formatNum(val || TokenValue.ZERO, {
    minDecimals: decimals,
    maxDecimals: decimals,
    defaultValue: `0.${"0".repeat(decimals)}`,
    minValue: 1 / 10 ** decimals,
    allowZero: options?.allowZero || true,
    showPositiveSign: options?.showPositiveSign,
    showPlusOnZero: options?.showPlusOnZero,
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

function normalizeTokenAmount(val: NumberPrimitive, token: Token | InternalToken) {
  if (!exists(val)) {
    return 0;
  }

  if (val instanceof TokenValue) {
    return val.toNumber();
  }
  if (typeof val === "bigint") {
    return TokenValue.fromBlockchain(val, token.displayDecimals ?? token.decimals).toNumber();
  }
  return typeof val === "string" ? Number(val) : val;
}

export const formatTokenAmount = (val: NumberPrimitive, token: Token | InternalToken, options?: IShowPositiveSign) => {
  const btcish = tokensEqual(token, CBBTC) || tokensEqual(token, PINTOCBBTC);
  const solish = tokensEqual(token, WSOL) || tokensEqual(token, PINTOWSOL);

  if (btcish || solish) {
    const normalized = normalizeTokenAmount(val, token);
    return formatNum(normalized, {
      minDecimals: normalized ? 6 : 2,
      maxDecimals: normalized ? 6 : 2,
      defaultValue: "0.00",
      minValue: normalized ? 0.000001 : 0.01,
      allowZero: true,
      showPositiveSign: options?.showPositiveSign,
      showPlusOnZero: options?.showPlusOnZero,
    });
  }
  return format2Decimals(normalizeTokenAmount(val, token), {
    allowZero: true,
    showPositiveSign: options?.showPositiveSign,
    showPlusOnZero: options?.showPlusOnZero,
  });
};

const numberAbbrThresholds: [number, string][] = [
  [10 ** 12, "t"],
  [10 ** 9, "b"],
  [10 ** 6, "m"],
  [10 ** 3, "k"],
];

export const numberAbbr = (num: number, decimals = 1): string => {
  for (const threshold of numberAbbrThresholds) {
    if (num > threshold[0]) {
      return `${(num / threshold[0]).toFixed(decimals)}${threshold[1]}`;
    }
  }
  return num.toString();
};

export const formatter = {
  number: formatNum,
  usd: formatUSD,
  pdv: formatPDV,
  pct: formatPct,
  noDec: formatNoDecimals,
  twoDec: format2Decimals,
  xDec: formatXDecimals,
  date: formatDate,
  token: formatTokenAmount,
};

export const chartFormatters = {
  number0dFormatter: (v: number) => `${formatter.number(v, { minDecimals: 0, maxDecimals: 0 })}`,
  number2dFormatter: (v: number) => `${formatter.number(v, { minDecimals: 2, maxDecimals: 2 })}`,
  number6dFormatter: (v: number) => `${formatter.number(v, { minDecimals: 6, maxDecimals: 6 })}`,
  largeNumberFormatter: numberAbbr,
  price0dFormatter: (v: number) => `$${formatter.number(v, { minDecimals: 0, maxDecimals: 0 })}`,
  price2dFormatter: (v: number) => `$${formatter.number(v, { minDecimals: 2, maxDecimals: 2 })}`,
  price6dFormatter: (v: number) => `$${formatter.number(v, { minDecimals: 6, maxDecimals: 6 })}`,
  largePriceFormatter: (v: number) => `$${numberAbbr(v)}`,
  percent0dFormatter: (v: number) => `${formatter.number(v * 100, { minDecimals: 0, maxDecimals: 0 })}%`,
  percent2dFormatter: (v: number) => `${formatter.number(v * 100, { minDecimals: 2, maxDecimals: 2 })}%`,
  percent3dFormatter: (v: number) => `${formatter.number(v * 100, { minDecimals: 3, maxDecimals: 3 })}%`,
};

export function truncateHex(hex: string, left: number = 4, right: number = 3) {
  return `${hex.slice(0, left)}...${hex.slice(-right)}`;
}

export function toFixedNumber(num: number, digits: number, base?: number) {
  const pow = (base ?? 10) ** digits;
  return Math.round(num * pow) / pow;
}

export const trulyTheBestTimeFormat = "yyyy MMM dd, t";
