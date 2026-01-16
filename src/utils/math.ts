import { TokenValue } from "@/classes/TokenValue";

/**
 * Solves arithmetic series sum for number of terms using the quadratic formula.
 *
 * Given an arithmetic series where:
 * - S = total sum (target amount)
 * - a = first term (initial value)
 * - d = common difference (delta/step)
 * - n = number of terms (what we're solving for)
 *
 * The sum formula is: S = n/2 * (2a + (n-1)d)
 *
 * Rearranging to quadratic form: (d/2)n² + (a - d/2)n - S = 0
 *
 * Using quadratic formula: n = (-(a - d/2) + √((a - d/2)² + 2dS)) / d
 *
 * @param totalAmount - The target sum (S) as a TokenValue
 * @param initialValue - The first term in the series (a) as a TokenValue
 * @param delta - The common difference between terms (d) as a TokenValue
 * @returns The number of terms needed (n) as a regular number
 *
 * @example
 * // For a Sow order with ramping soil:
 * const initialSoil = TV.fromHuman(100, 6);
 * const delta = TV.fromHuman(5, 6);
 * const target = TV.fromHuman(1000, 6);
 * const executions = solveArithmeticSeriesForN(target, initialSoil, delta);
 */
export function solveArithmeticSeriesForN(
  totalAmount: TokenValue,
  initialValue: TokenValue,
  delta: TokenValue,
): number {
  // Edge case: if delta is zero, fallback to simple division
  if (delta.eq(0)) {
    if (initialValue.eq(0)) {
      return 0;
    }
    const result = Number(totalAmount.div(initialValue).toHuman());
    return result;
  }

  // Edge case: if initialValue is zero and delta is positive
  if (initialValue.eq(0)) {
    // Series: 0 + d + 2d + 3d + ... + (n-1)d = S
    // Sum = d * (0 + 1 + 2 + ... + (n-1)) = d * n(n-1)/2 = S
    // Solving: n² - n - 2S/d = 0
    // n = (1 + √(1 + 8S/d)) / 2
    const term = totalAmount.mul(8).div(delta);
    const discriminant = TokenValue.ONE.add(term);

    if (discriminant.lt(0)) {
      return 0;
    }

    const sqrtDiscriminant = Math.sqrt(Number(discriminant.toHuman()));
    const n = (1 + sqrtDiscriminant) / 2;

    return Math.ceil(n);
  }

  // Standard case: solve (d/2)n² + (a - d/2)n - S = 0
  // n = (-(a - d/2) + √((a - d/2)² + 2dS)) / d

  // Calculate b = (a - d/2)
  const halfDelta = delta.div(2);
  const b = initialValue.sub(halfDelta);

  // Calculate discriminant = b² + 2dS
  const bSquared = b.mul(b);
  const twoDeltaS = delta.mul(2).mul(totalAmount);
  const discriminant = bSquared.add(twoDeltaS);

  // Handle negative discriminant (shouldn't happen in practice for valid inputs)
  if (discriminant.lt(0)) {
    console.warn("[solveArithmeticSeriesForN] Negative discriminant in arithmetic series calculation, returning 0");
    return 0;
  }

  // Calculate n = (-b + √discriminant) / d (take positive root)
  const sqrtDiscriminant = Math.sqrt(Number(discriminant.toHuman()));
  const numerator = -Number(b.toHuman()) + sqrtDiscriminant;
  const n = numerator / Number(delta.toHuman());

  // Return ceiling to ensure we have enough executions
  return Math.ceil(Math.max(0, n));
}
