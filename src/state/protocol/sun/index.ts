import {
  APPROX_L2_BLOCK_PER_L1_BLOCK,
  APPROX_SECS_PER_L2_BLOCK,
  INTERVALS_PER_MORNING,
  MORNING_INTERVAL_1,
  SECONDS_PER_MORNING_INTERVAL,
} from "@/constants/morning";

import { BlockInfo } from "@/utils/types";
import { QueryKey } from "@tanstack/react-query";
import { DateTime, Duration } from "luxon";

export interface Morning {
  /** The L2 Block Number that represents the start of the current morning interval. */
  blockNumber: number;
  /** Whether it is morning */
  isMorning: boolean;
  /**
   * The index (0 - 24) of the current morning.
   * Can think of this as 12 second intervals (L1 blocks) since sunrise
   */
  index: number;
  /** The DateTime of the next expected morning interval update */
  next: DateTime;
}

export interface Sun {
  seasonTime: number;
  sunrise: {
    /** Whether we're waiting for the sunrise() function to be called. */
    awaiting: boolean;
    /** The DateTime of the next expected Sunrise */
    next: DateTime;
  };
  season: {
    /** The current Season in Beanstalk. */
    current: number;
    /** The Season in which the most recent consecutive series of Seasons of Plenty started. */
    lastSopStart: number;
    /** The Season in which the most recent consecutive series of Seasons of Plenty ended. */
    lastSopEnd: number;
    /** The most recent Season in which Rain started. */
    rainStart: number;
    /** True if it is Raining (P > 1, Pod Rate Excessively Low). */
    raining: boolean;
    /** The block of the start of the current Season. */
    sunriseBlock: number;
    /** Boolean indicating whether the previous Season was above or below peg. */
    abovePeg: boolean;
    /** The timestamp of the Beanstalk deployment rounded down to the nearest hour. */
    start: number;
    /** The length of each season in Beanstalk in seconds. */
    period: number;
    /** The timestamp of the start of the current Season. */
    timestamp: DateTime;
  };
  morning: Morning;
}

export interface SunQueryKeys {
  seasonTime: QueryKey;
  season: QueryKey;
}

export const getNextExpectedSunrise = () => {
  const now = DateTime.now();
  return now.set({ minute: 0, second: 0, millisecond: 0 }).plus({ hour: 1 });
};

export const getNextMorningIntervalUpdate = (from: DateTime = getNextExpectedSunrise()) =>
  from.plus({ seconds: SECONDS_PER_MORNING_INTERVAL });

/**
 * diff between some data & now rounded down to the nearest second
 * @param dt - the DateTime to calculate the difference from
 * @param _now - the current DateTime (defaults to now)
 */
export const getDiffNow = (dt: DateTime, _now?: DateTime) => {
  const now = (_now || DateTime.now()).toSeconds();
  const nowRounded = Math.floor(now);
  return dt.diff(DateTime.fromSeconds(nowRounded));
};

/**
 * current timestamp rounded down to the nearest second
 */
export const getNowRounded = () => {
  const now = Math.floor(DateTime.now().toSeconds());
  return DateTime.fromSeconds(now);
};

/**
 * @param timestamp the timestamp of the block in which gm() was called
 * @param blockNumber the blockNumber of the block in which gm() was called
 *
 * Ethereum block times don't include MS, so we use the current timestamp
 * rounded down to the nearest second.
 *
 * We approximate the current block using the difference in seconds between
 * the current timestamp & the sunriseBlock timestamp.
 *
 * We determine it is morning by calculating whether we are within 5 mins
 * since sunrise was called.
 *
 */
export const getMorningResult = ({
  timestamp: sunriseTime,
  blockNumber: sunriseBlock,
}: BlockInfo): Morning & {
  remaining: Duration;
} => {
  // sunrise timestamp in seconds
  const sunriseSecs = Math.floor(sunriseTime.toSeconds());
  // current timestamp in seconds
  const nowSecs = getNowRounded().toSeconds();
  // seconds since sunrise
  const secondsSinceSunrise = Math.floor(nowSecs - sunriseSecs);

  const diff = BigInt(secondsSinceSunrise) / BigInt(SECONDS_PER_MORNING_INTERVAL);

  // The morning interval index (0 - 24) (25 means we're no longer in the morning state)
  const index = Math.min(Math.floor(Number(diff)), INTERVALS_PER_MORNING);
  // The approximate blockNumber that represents the start the current morning interval
  const deltaBlocks = index * APPROX_L2_BLOCK_PER_L1_BLOCK * 2; // 24 seconds per interval

  // It is considered morning if...
  // - SunriseBlock has been fetched
  // - We are within the first 25 L1 blocks (1200 L2 blocks) since sunrise
  const isMorning = index >= 0 && index < INTERVALS_PER_MORNING && sunriseBlock > 0;

  // The L2 Block Number that represents the start of the current morning interval
  const blockNumber = sunriseBlock + deltaBlocks;

  // we could use secondsSinceSunrise, but this is more precise.
  // Using secondsSinceSunrise results in 0.5s inaccuracy.
  const elapsedSeconds = deltaBlocks * APPROX_SECS_PER_L2_BLOCK;

  const curr = isMorning
    ? sunriseTime.plus({ seconds: elapsedSeconds })
    : getNextExpectedSunrise().plus({ seconds: SECONDS_PER_MORNING_INTERVAL });

  const next = getNextMorningIntervalUpdate(curr);
  const remaining = getDiffNow(next);

  return {
    remaining,
    isMorning,
    blockNumber,
    index,
    next,
  };
};

export const getIsMorningInterval = (interval: number) => {
  return interval >= MORNING_INTERVAL_1 && interval <= INTERVALS_PER_MORNING;
};
