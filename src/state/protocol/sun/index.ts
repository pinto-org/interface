import { MORNING_AUCTION_DURATION } from "@/constants/morning";

import { QueryKey } from "@tanstack/react-query";
import { DateTime, Duration } from "luxon";

export interface Morning {
  /** Whether it is currently morning (within 600 seconds of season start) */
  isMorning: boolean;
}

export interface Sun {
  seasonTime: number;
  /** Time offset in milliseconds between user's local clock and blockchain time */
  timeOffsetMs: number;
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

/**
 * Get blockchain-synchronized current time by adjusting for time offset
 * @param timeOffsetMs - Time offset in milliseconds between user's local clock and blockchain time
 * @returns DateTime representing the current blockchain time
 */
export const getBlockchainNow = (timeOffsetMs: number): DateTime => {
  return DateTime.now().minus({ milliseconds: timeOffsetMs });
};

/**
 * Calculate if currently in morning period (first 600 seconds after season start)
 * @param seasonTimestamp - The DateTime when the season started
 * @param timeOffsetMs - Time offset in milliseconds between user's local clock and blockchain time
 * @returns true if currently in morning period
 */
export const getIsMorning = (seasonTimestamp: DateTime, timeOffsetMs: number): boolean => {
  const blockchainNow = getBlockchainNow(timeOffsetMs);
  const secondsSinceSunrise = blockchainNow.diff(seasonTimestamp, "seconds").seconds;
  console.log({
    seasonTimestamp: seasonTimestamp.toFormat("HH:mm:ss"),
    secondsSinceSunrise: secondsSinceSunrise,
    timeSinceSunrise: getDiffNow(seasonTimestamp, timeOffsetMs),
    blockchainNow: blockchainNow.toFormat("HH:mm:ss"),
    isMorning: secondsSinceSunrise >= 0 && secondsSinceSunrise < MORNING_AUCTION_DURATION,
  });
  return secondsSinceSunrise >= 0 && secondsSinceSunrise < MORNING_AUCTION_DURATION;
};

/**
 * Get the end time of the morning period
 * @param seasonTimestamp - The DateTime when the season started
 * @returns DateTime when morning period ends (season start + 600 seconds)
 */
export const getMorningEndTime = (seasonTimestamp: DateTime): DateTime => {
  return seasonTimestamp.plus({ seconds: MORNING_AUCTION_DURATION });
};

/**
 * Get seconds elapsed in the current morning period
 * @param seasonTimestamp - The DateTime when the season started
 * @param timeOffsetMs - Time offset in milliseconds between user's local clock and blockchain time
 * @returns Seconds elapsed since sunrise, clamped between 0 and MORNING_AUCTION_DURATION
 */
export const getSecondsElapsedInMorning = (seasonTimestamp: DateTime, timeOffsetMs: number): number => {
  const blockchainNow = getBlockchainNow(timeOffsetMs);
  const elapsed = blockchainNow.diff(seasonTimestamp, "seconds").seconds;
  return Math.max(0, Math.min(elapsed, MORNING_AUCTION_DURATION));
};

/**
 * diff between some date & now rounded down to the nearest second
 * @param dt - the DateTime to calculate the difference from
 * @param timeOffsetMs - Optional time offset in milliseconds for blockchain synchronization
 */
export const getDiffNow = (dt: DateTime, timeOffsetMs?: number): Duration => {
  const now = timeOffsetMs !== undefined ? getBlockchainNow(timeOffsetMs) : DateTime.now();
  const nowSecs = now.toSeconds();
  const nowRounded = Math.floor(nowSecs);
  return dt.diff(DateTime.fromSeconds(nowRounded));
};

/**
 * current timestamp rounded down to the nearest second
 * @param timeOffsetMs - Optional time offset in milliseconds for blockchain synchronization
 */
export const getNowRounded = (timeOffsetMs?: number): DateTime => {
  const now = timeOffsetMs !== undefined ? getBlockchainNow(timeOffsetMs) : DateTime.now();
  const nowSecs = Math.floor(now.toSeconds());
  return DateTime.fromSeconds(nowSecs);
};
