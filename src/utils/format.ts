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

type FormatNumOptions = IMinValue &
  IDecimals &
  IDefaultValue &
  IAllowZero &
  IShowPositiveSign & {
    compact?: boolean;
  };

type FormatPctOptions = IDecimals & IShowPositiveSign & IDefaultValue;

type FormatUSDOptions = IShowPositiveSign & IExactDecimals;

/**
 * We can for the most part use TokenValue.toHuman("short"),
 * but we can use this in cases where we don't want the shorthand K/M/B/T suffixes.
 * We use Number.toLocaleString() instead of Number.toFixed() as it includes thousands separators
 */
export const formatNum = (val: NumberPrimitive, options?: FormatNumOptions) => {
  if (val === undefined || val === null) return options?.defaultValue || "0";

  const normalised = val instanceof TokenValue ? val.toHuman() : val.toString().replaceAll(",", "");

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

  // Use compact notation for very large numbers
  if (options?.compact) {
    return numberAbbr(num, options?.maxDecimals ?? 2, 0, true);
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

const formatNumNoDecimalTruncation = (val: NumberPrimitive, options?: IDefaultValue) => {
  if (val === undefined || val === null) return options?.defaultValue || "0.00";

  const numStr = val instanceof TokenValue ? val.toHuman() : val.toString();

  const cleanValue = numStr.replace(/,/g, "");
  const parts = cleanValue.split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const joined = parts.join(".");

  return joined;
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

const formatDateFromTimestamp = (timestamp: number | undefined) => {
  if (!timestamp) return "Unknown";
  const date = new Date(timestamp);

  return (
    date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
    }) +
    " " +
    date
      .toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      .replace(" ", "")
  );
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

/** Thresholds for number abbreviation: [value, suffix] */
export const NUMBER_ABBR_THRESHOLDS = {
  QUADRILLION: 10 ** 15,
  TRILLION: 10 ** 12,
  BILLION: 10 ** 9,
  MILLION: 10 ** 6,
  THOUSAND: 10 ** 3,
} as const;

const numberAbbrThresholds: [number, string][] = [
  [NUMBER_ABBR_THRESHOLDS.QUADRILLION, "q"],
  [NUMBER_ABBR_THRESHOLDS.TRILLION, "t"],
  [NUMBER_ABBR_THRESHOLDS.BILLION, "b"],
  [NUMBER_ABBR_THRESHOLDS.MILLION, "m"],
  [NUMBER_ABBR_THRESHOLDS.THOUSAND, "k"],
];

export const numberAbbr = (
  num: number,
  decimals = 1,
  min = 0,
  uppercase = false,
  fallback: ((num: number) => string) | undefined = undefined,
): string => {
  if (Math.abs(num) >= min) {
    for (const threshold of numberAbbrThresholds) {
      if (Math.abs(num) >= threshold[0]) {
        const letter = uppercase ? threshold[1].toUpperCase() : threshold[1];
        return `${(num / threshold[0]).toFixed(decimals)}${letter}`;
      }
    }
  }
  if (fallback) {
    return fallback(num);
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
  dateFromTS: formatDateFromTimestamp,
  token: formatTokenAmount,
  noDecTrunc: formatNumNoDecimalTruncation,
};

const numberFormatter = (d: number) => (v: number) => `${formatter.number(v, { minDecimals: d, maxDecimals: d })}`;
const priceFormatter = (d: number) => (v: number) => {
  const formatted = formatter.number(v, { minDecimals: d, maxDecimals: d });
  return formatted.startsWith("-") ? `-$${formatted.slice(1)}` : `$${formatted}`;
};
const largeNumberFormatter =
  ({ decimals = 1, min = 0, uppercase = false, fallback = numberFormatter(0) } = {}) =>
  (v: number) =>
    numberAbbr(v, decimals, min, uppercase, fallback);
const largePriceFormatter =
  ({ decimals = 1, min = 0, uppercase = false, fallback = numberFormatter(0) } = {}) =>
  (v: number) => {
    const formatted = numberAbbr(v, decimals, min, uppercase, fallback);
    return formatted.startsWith("-") ? `-$${formatted.slice(1)}` : `$${formatted}`;
  };
const percentFormatter = (d: number) => (v: number) =>
  `${formatter.number(v * 100, { minDecimals: d, maxDecimals: d })}%`;

export const chartFormatters = {
  // Stable references for common formatters
  percent0dFormatter: percentFormatter(0),
  percent2dFormatter: percentFormatter(2),
  percent3dFormatter: percentFormatter(3),
  number0dFormatter: numberFormatter(0),
  number2dFormatter: numberFormatter(2),
  number6dFormatter: numberFormatter(6),
  price0dFormatter: priceFormatter(0),
  price2dFormatter: priceFormatter(2),
  price6dFormatter: priceFormatter(6),
  largeNumber1dFormatter: largeNumberFormatter(),
  largePrice1dFormatter: largePriceFormatter(),
  // Factories
  numberFormatter,
  priceFormatter,
  largeNumberFormatter,
  largePriceFormatter,
  percentFormatter,
};

export function truncateHex(hex: string, left: number = 4, right: number = 3) {
  return `${hex.slice(0, left)}...${hex.slice(-right)}`;
}

export function toFixedNumber(num: number, digits: number, base?: number) {
  const pow = (base ?? 10) ** digits;
  return Math.round(num * pow) / pow;
}

export const trulyTheBestTimeFormat = "yyyy MMM dd, t";

// Time conversion constants
const HOURS_PER_DAY = 24;
const DAYS_PER_WEEK = 7;
const AVERAGE_DAYS_PER_MONTH = 30.44; // Average days per month
const DAYS_PER_YEAR_WITH_LEAP = 365.25; // Account for leap years

export const formatSeasonsAsTime = (seasons: number): string => {
  const hours = seasons;
  const days = Math.floor(hours / HOURS_PER_DAY);
  const weeks = Math.floor(days / DAYS_PER_WEEK);
  const months = Math.floor(days / AVERAGE_DAYS_PER_MONTH);
  const years = Math.floor(days / DAYS_PER_YEAR_WITH_LEAP);

  if (years >= 1) {
    const remainingMonths = Math.floor((days % DAYS_PER_YEAR_WITH_LEAP) / AVERAGE_DAYS_PER_MONTH);
    return years === 1 && remainingMonths === 0
      ? " (1 year)"
      : remainingMonths === 0
        ? ` (${years} years)`
        : ` (${years} year${years > 1 ? "s" : ""}, ${remainingMonths} month${remainingMonths > 1 ? "s" : ""})`;
  }

  if (months >= 1) {
    const remainingWeeks = Math.floor((days % AVERAGE_DAYS_PER_MONTH) / DAYS_PER_WEEK);
    return months === 1 && remainingWeeks === 0
      ? " (1 month)"
      : remainingWeeks === 0
        ? ` (${months} months)`
        : ` (${months} month${months > 1 ? "s" : ""}, ${remainingWeeks} week${remainingWeeks > 1 ? "s" : ""})`;
  }

  if (weeks >= 1) {
    const remainingDays = days % DAYS_PER_WEEK;
    return weeks === 1 && remainingDays === 0
      ? " (1 week)"
      : remainingDays === 0
        ? ` (${weeks} weeks)`
        : ` (${weeks} week${weeks > 1 ? "s" : ""}, ${remainingDays} day${remainingDays > 1 ? "s" : ""})`;
  }

  return ` (${days} day${days > 1 ? "s" : ""})`;
};
