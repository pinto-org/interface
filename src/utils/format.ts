import { TokenValue } from "@/classes/TokenValue";

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

  return Number(normalised).toLocaleString("en-US", {
    minimumFractionDigits: options?.minDecimals || 0,
    maximumFractionDigits: options?.maxDecimals || 2,
  });
};

export const formatUSD = (val: NumberPrimitive) => {
  return `$${formatNum(val || TokenValue.ZERO, { minDecimals: 2, maxDecimals: 2, defaultValue: "0.00", minValue: 0.01 })}`;
};

export const formatPDV = (val: NumberPrimitive) => {
  return `${formatNum(val || TokenValue.ZERO, { minDecimals: 2, maxDecimals: 2, defaultValue: "0.00", minValue: 0.01 })} PDV`;
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

export const format2Decimals = (val: NumberPrimitive) => {
  return formatNum(val || TokenValue.ZERO, {
    minDecimals: 2,
    maxDecimals: 2,
    defaultValue: "0.00",
    minValue: 0.01,
    allowZero: true,
  });
};

export const formatter = {
  number: formatNum,
  usd: formatUSD,
  pdv: formatPDV,
  pct: formatPct,
  noDec: formatNoDecimals,
  twoDec: format2Decimals,
};

export function truncateHex(hex: string, left: number = 4, right: number = 3) {
  return `${hex.slice(0, left)}...${hex.slice(-right)}`;
}
