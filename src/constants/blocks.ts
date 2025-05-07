/**
 * The number of blocks in a given time period for the BASE mainnet
 */

const BASE_TIME_TO_BLOCKS = {
  // 30 days
  month: 1_296_000n,
  // 14 days
  fortnight: 604_800n,
  // 7 days
  week: 302_400n,
  // 1 day
  day: 43_200n,
  // 2 days
  days2: 86_400n,
  // 1 hour (season)
  hour: 1_800n,
  // 1 minute
  minute: 30n,
  // seconds per block
  seconds: 2n,
} as const;

export { BASE_TIME_TO_BLOCKS as TIME_TO_BLOCKS };
