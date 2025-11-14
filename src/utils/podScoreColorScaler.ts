/**
 * Pod Score Color Scaler Utility
 * 
 * Provides percentile-based color scaling for Pod Score visualization.
 * Maps scores to a three-stop gradient: brown (poor) → gold (average) → green (good)
 */

type Hex = `#${string}`;

interface RGB {
  r: number;
  g: number;
  b: number;
}

interface ScalerOptions {
  lowerPct?: number;      // Default: 5
  upperPct?: number;      // Default: 95
  smoothFactor?: number;  // Default: 0 (no smoothing)
  bad?: Hex;              // Default: '#91580D'
  mid?: Hex;              // Default: '#E8C15F'
  good?: Hex;             // Default: '#A8E868'
}

export interface ColorScaler {
  toColor: (score: number) => Hex;
  toUnit: (score: number) => number;
  bounds: { low: number; high: number };
}

/**
 * Calculate percentile value from sorted array
 */
function percentile(values: number[], p: number): number {
  if (values.length === 0) return 0;
  if (values.length === 1) return values[0];
  
  // Sort values in ascending order
  const sorted = [...values].sort((a, b) => a - b);
  
  // Calculate index (using linear interpolation)
  const index = (p / 100) * (sorted.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index - lower;
  
  if (lower === upper) {
    return sorted[lower];
  }
  
  return sorted[lower] * (1 - weight) + sorted[upper] * weight;
}

/**
 * Clamp value between min and max
 */
function clamp(x: number, min: number, max: number): number {
  return Math.min(Math.max(x, min), max);
}

/**
 * Exponentially smooth value with previous value
 */
function smooth(prev: number, next: number, alpha: number): number {
  return prev + alpha * (next - prev);
}

/**
 * Convert hex color to RGB
 */
function hexToRgb(hex: Hex): RGB {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    throw new Error(`Invalid hex color: ${hex}`);
  }
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
}

/**
 * Convert RGB to hex color
 */
function rgbToHex(c: RGB): Hex {
  const toHex = (n: number) => {
    const hex = Math.round(clamp(n, 0, 255)).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(c.r)}${toHex(c.g)}${toHex(c.b)}` as Hex;
}

/**
 * Mix two RGB colors with interpolation factor t (0-1)
 */
function mix(a: RGB, b: RGB, t: number): RGB {
  const clampedT = clamp(t, 0, 1);
  return {
    r: a.r + (b.r - a.r) * clampedT,
    g: a.g + (b.g - a.g) * clampedT,
    b: a.b + (b.b - a.b) * clampedT,
  };
}

/**
 * Build a color scaler for Pod Scores
 * 
 * @param scores - Array of Pod Score values
 * @param prevBounds - Optional previous bounds for smoothing
 * @param opts - Optional configuration
 * @returns ColorScaler object with toColor, toUnit, and bounds
 */
export function buildPodScoreColorScaler(
  scores: number[],
  prevBounds?: { low: number; high: number } | null,
  opts?: ScalerOptions
): ColorScaler {
  // Default options
  const options: Required<ScalerOptions> = {
    lowerPct: opts?.lowerPct ?? 5,
    upperPct: opts?.upperPct ?? 95,
    smoothFactor: opts?.smoothFactor ?? 0,
    bad: opts?.bad ?? '#91580D',
    mid: opts?.mid ?? '#E8C15F',
    good: opts?.good ?? '#A8E868',
  };

  // Filter out invalid values (NaN, Infinity)
  const validScores = scores.filter(s => Number.isFinite(s));

  // Calculate percentile bounds
  let low: number;
  let high: number;

  if (validScores.length === 0) {
    // Fallback bounds for empty array
    low = 0;
    high = 1;
  } else if (validScores.length === 1) {
    // Single value - use it as both bounds with small range
    low = validScores[0] - 0.5;
    high = validScores[0] + 0.5;
  } else {
    // Calculate percentiles
    low = percentile(validScores, options.lowerPct);
    high = percentile(validScores, options.upperPct);
    
    // Ensure high > low
    if (high <= low) {
      high = low + 1;
    }
  }

  // Apply smoothing if previous bounds provided
  if (prevBounds && options.smoothFactor > 0) {
    low = smooth(prevBounds.low, low, options.smoothFactor);
    high = smooth(prevBounds.high, high, options.smoothFactor);
    
    // Ensure smoothed high > smoothed low
    if (high <= low) {
      high = low + 1;
    }
  }

  // Pre-calculate RGB values for color stops
  const badRgb = hexToRgb(options.bad);
  const midRgb = hexToRgb(options.mid);
  const goodRgb = hexToRgb(options.good);

  /**
   * Convert score to normalized 0-1 value
   */
  const toUnit = (score: number): number => {
    if (!Number.isFinite(score)) return 0;
    const clamped = clamp(score, low, high);
    return (clamped - low) / (high - low);
  };

  /**
   * Convert score to hex color
   */
  const toColor = (score: number): Hex => {
    const unit = toUnit(score);
    
    // Three-stop gradient: bad → mid → good
    // 0.0 - 0.5: bad to mid
    // 0.5 - 1.0: mid to good
    let rgb: RGB;
    if (unit <= 0.5) {
      // Interpolate from bad to mid
      const t = unit / 0.5;
      rgb = mix(badRgb, midRgb, t);
    } else {
      // Interpolate from mid to good
      const t = (unit - 0.5) / 0.5;
      rgb = mix(midRgb, goodRgb, t);
    }
    
    return rgbToHex(rgb);
  };

  return {
    toColor,
    toUnit,
    bounds: { low, high },
  };
}
