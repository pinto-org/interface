import { TV } from "@/classes/TokenValue";

// Constants
export const TEMPERATURE_DECIMALS = 6;

export const TEMPERATURE_LOG_BASE = 3.5;

export const TEMPERATURE_PRECISION = 1e6;

export const L1_BLOCK_TIME = 1200;

export const L2_BLOCK_TIME = 25;

/**
 * @see LibDibbler.sol
 * 1200 / 25 = 48
 *
 * L1 block = 12 seconds & L2 block = ~0.25 seconds
 * 48 L2 blocks = 1 L1 block
 */

export type MorningBlockTemperature = {
  /** */
  temperature: TV;
  /** */
  maxTemperature: TV;
  /** */
  index: number;
  /** index + 1  */
  interval: number;
};

export type MorningTemperatureMap = {
  [blockNumber: string]: MorningBlockTemperature;
};

export type Temperature = {
  current: TV;
  next: TV;
  max: TV;
};

/**
 *
 * In a perfect world, we could just use the temperature stored on-chain by calling 'Beanstalk.temperature()';
 * however, there are times when the update we receive from the RPC provider lags 3-6 seconds behind.
 *
 * The formula used to calculate the scaled temperature is:
 *
 * =================================================================
 * || temperature = log3.5(0.1 * deltaBlocks + 1) * maxTemperature ||
 * =================================================================
 *
 * where: 'deltaBlocks' is scaled down to L1 block time as L2 block time is significantly shorter.
 *
 * Occasionally, when applying the formula, there can be a discrepancy of approximately 1e-6 compared to
 * the temperature obtained from the on-chain data due to rounding. To ensure precise results, we choose
 * to calculate the scaled temperature using the same method as the contract. By adopting this approach, we
 * eliminate the need to retrieve the temperature from the contract for each block during the Morning.
 *
 * Refer 'morningTemperature()'in 'Beanstalk/protocol/contracts/libraries/LibDibbler.sol'.
 *
 * Additional Notes:
 *
 * It is recommended to use this hook to read the current temperature of the field
 * instead of using the temperature fetched from the contract.
 */

/**
 * indexes in terms of L1 blocks
 */
const DELTA_TEMPERATURE_PCTS: Record<number, number> = {
  0: TEMPERATURE_PRECISION,
  1: 76079978576,
  2: 145535557307,
  3: 209428496104,
  4: 268584117732,
  5: 323656683909,
  6: 375173629062,
  7: 423566360442,
  8: 469192241217,
  9: 512350622036,
  10: 553294755665,
  11: 592240801642,
  12: 629374734241,
  13: 664857713614,
  14: 698830312972,
  15: 731415882267,
  16: 762723251769,
  17: 792848925126,
  18: 821878873397,
  19: 849890014127,
  20: 876951439574,
  21: 903125443474,
  22: 928468384727,
  23: 953031418151,
  24: 976861116107,
};
