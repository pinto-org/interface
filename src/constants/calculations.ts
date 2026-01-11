/**
 * Constants for arithmetic series calculations used in orderbook contexts.
 *
 * These constants are used for calculating accurate execution counts when
 * values ramp up linearly (e.g., soil increasing with each sow).
 */

/**
 * Initial cultivation factor constant for normalizing soil calculations to a baseline cultivation factor.
 */
export const INITIAL_CULTIVATION_FACTOR = 1; // 1%

/**
 * Default delta constant for calculating the step increase per execution in the arithmetic series.
 */
export const DEFAULT_DELTA = 0.5; // 0.5%. this can be found by calling `getGaugeData(0)` on the diamond contract.
