export type TimeScale = "SECONDS" | "MINUTES" | "HOURS" | "DAYS" | "WEEKS" | "MONTHS" | "YEARS";

export type TimeScalesUntilDays = Exclude<TimeScale, "WEEKS" | "MONTHS" | "YEARS">;

interface TimeScaleConfig {
  label: string; // base label (singular form)
  next: TimeScale;
  factor: number;
  order: number;
}

const TIME_CONFIG: Record<TimeScale, TimeScaleConfig> = {
  SECONDS: { label: "Second", next: "MINUTES", factor: 1, order: 0 },
  MINUTES: { label: "Minute", next: "HOURS", factor: 60, order: 1 },
  HOURS: { label: "Hour", next: "DAYS", factor: 24, order: 2 },
  DAYS: { label: "Day", next: "WEEKS", factor: 7, order: 3 },
  WEEKS: { label: "Week", next: "MONTHS", factor: 4, order: 4 },
  MONTHS: { label: "Month", next: "YEARS", factor: 12, order: 5 },
  YEARS: { label: "Year", next: "YEARS", factor: 1, order: 6 },
} as const;

// Derive ordered list of Time Scales (Seconds -> Years) from TIME_CONFIG (single source of truth)
const ORDERED: TimeScale[] = (Object.keys(TIME_CONFIG) as TimeScale[]).sort(
  (a, b) => TIME_CONFIG[a].order - TIME_CONFIG[b].order,
);

// Build a map of "seconds per unit" once (O(units)).
// Derive "seconds per unit" from the TIME_CONFIG (single source of truth)
const SECONDS_PER: Record<TimeScale, number> = (() => {
  const m = {} as Record<TimeScale, number>;
  // seed the smallest unit
  m.SECONDS = 1;
  TIME_CONFIG.SECONDS.factor;

  for (const u of ORDERED) {
    const next = TIME_CONFIG[u].next;
    m[next] = m[u] * TIME_CONFIG[u].factor;
  }

  return m;
})();

function formatUnit(unit: TimeScale, n: number): string {
  const base = TIME_CONFIG[unit]?.label || "";

  if (!base) {
    throw new Error(`Invalid time scale: ${unit}`);
  }
  return n === 1 ? base : `${base}s`;
}

function convert(n: number, from: TimeScale, to: TimeScale): number {
  if (from === to) return n;
  return n * (SECONDS_PER[from] / SECONDS_PER[to]);
}

type RoundingMode = "round" | "floor" | "ceil";
function applyRound(x: number, mode: RoundingMode): number {
  try {
    return Math[mode](x);
  } catch (e) {
    throw new Error(`Invalid rounding mode: ${mode}`);
  }
}

// Options
// biome-ignore format: keep unformatted for readability
type DisplayOpts =
  | { exact: true; approximate?: never; inputUnit?: TimeScale; roundingMode?: RoundingMode }
  | {
      exact?: never;
      approximate: true;
      inputUnit?: TimeScale;
      roundingMode?: RoundingMode; // applies to single-unit approximate value
      multiUnit?: boolean;         // breakdown into remainder parts
      maxParts?: number;           // default 2
      minUnit?: TimeScale;         // default "SECONDS"
    };

export function timeScaleToDisplay(
  timeScale: TimeScale, // target unit for exact mode
  num: string | number,
  opts?: DisplayOpts,
): string {
  let n: number;

  try {
    n = typeof num === "number" ? num : Number(num);
  } catch (e) {
    throw new Error(`Invalid number: ${num}`);
  }

  // Non-finite handling
  if (!Number.isFinite(n) || Number.isNaN(n)) return "—";

  // Preserve sign, operate on magnitude
  const sign = n < 0 ? "-" : "";
  const absN = Math.abs(n);

  const inputUnit: TimeScale = opts && "inputUnit" in opts && opts.inputUnit ? opts.inputUnit : timeScale;
  const roundingMode: RoundingMode = opts && "roundingMode" in opts && opts.roundingMode ? opts.roundingMode : "round";
  const fmt = formatUnit;

  if (opts?.exact) {
    const val = convert(absN, inputUnit, timeScale);
    const rounded = applyRound(val, roundingMode);
    return `${sign}${rounded} ${fmt(timeScale, rounded)}`;
  }

  // Approximate mode
  const totalSeconds = convert(absN, inputUnit, "SECONDS");

  // Largest unit whose size <= totalSeconds
  let bestUnit: TimeScale = ORDERED[0]; // "SECONDS"
  for (let i = ORDERED.length - 1; i >= 0; i--) {
    const u = ORDERED[i];
    if (totalSeconds >= SECONDS_PER[u]) {
      bestUnit = u;
      break;
    }
  }

  const approximated = TIME_CONFIG[bestUnit].order > TIME_CONFIG[inputUnit].order;

  if (!opts?.multiUnit) {
    const value = applyRound(totalSeconds / SECONDS_PER[bestUnit], roundingMode);
    const prefix = approximated ? "~" : "";
    return `${sign}${prefix}${value} ${fmt(bestUnit, value)}`;
  }

  // Multi-unit decomposition: greedy from bestUnit down to minUnit
  const maxParts = Math.max(1, opts?.maxParts ?? 2);
  const minUnit = opts?.minUnit ?? "SECONDS";

  const parts: string[] = [];
  let remaining = totalSeconds;

  const startIdx = TIME_CONFIG[bestUnit].order;
  const endIdx = TIME_CONFIG[minUnit].order;

  for (let i = startIdx; i >= endIdx && parts.length < maxParts; i--) {
    const u = ORDERED[i];
    const unitSize = SECONDS_PER[u];

    // For the last allowed part, absorb remainder down to minUnit
    if (i === endIdx || parts.length === maxParts - 1) {
      const lastVal = Math.floor(remaining / unitSize);
      if (lastVal > 0 || parts.length === 0) {
        parts.push(`${lastVal} ${fmt(u, lastVal)}`);
      }
      remaining -= lastVal * unitSize;
      break;
    }

    const whole = Math.floor(remaining / unitSize);
    if (whole > 0) {
      parts.push(`${whole} ${fmt(u, whole)}`);
      remaining -= whole * unitSize;
    }
  }

  if (parts.length === 0) {
    // Nothing emitted (e.g., n < minUnit), show a zero of minUnit
    parts.push(`0 ${fmt(minUnit, 0)}`);
  }

  const prefix = approximated ? "~" : "";
  return `${sign}${prefix}${parts.join(" ")}`;
}
