import { TokenValue } from "@/classes/TokenValue";
import { useReadSeasonFacetView_Time } from "@/generated/contractHooks";

const settings = {
  query: {
    staleTime: 1000 * 60 * 2,
    refetchInterval: 1000 * 60 * 3, // 3 minutes, in milliseconds
  },
};

export interface SunData {
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
  sunriseBlock: TokenValue;
  /** Boolean indicating whether the previous Season was above or below peg. */
  abovePeg: boolean;
  /** The timestamp of the Beanstalk deployment rounded down to the nearest hour. */
  start: TokenValue;
  /** The length of each season in Beanstalk in seconds. */
  period: TokenValue;
  /** The timestamp of the start of the current Season. */
  timestamp: TokenValue;
}

const defaultSunData: SunData = {
  /** The current Season in Beanstalk. */
  current: 0,
  /** The Season in which the most recent consecutive series of Seasons of Plenty started. */
  lastSopStart: 0,
  /** The Season in which the most recent consecutive series of Seasons of Plenty ended. */
  lastSopEnd: 0,
  /** The most recent Season in which Rain started. */
  rainStart: 0,
  /** True if it is Raining (P > 1, Pod Rate Excessively Low). */
  raining: false,
  /** The block of the start of the current Season. */
  sunriseBlock: TokenValue.fromBlockchain(0n, 0),
  /** Boolean indicating whether the previous Season was above or below peg. */
  abovePeg: false,
  /** The timestamp of the Beanstalk deployment rounded down to the nearest hour. */
  start: TokenValue.fromBlockchain(0n, 0),
  /** The length of each season in Beanstalk in seconds. */
  period: TokenValue.fromBlockchain(0n, 0),
  /** The timestamp of the start of the current Season. */
  timestamp: TokenValue.fromBlockchain(0n, 0),
} as const;

export function useSunData() {
  // const seasonTime = useReadBeanstalk_SeasonTime(); /// the season that it could be if sunrise was called
  const sunData = useReadSeasonFacetView_Time({
    query: {
      ...settings.query,
      select: (time) => {
        if (!time) return defaultSunData;
        return {
          /** The current Season in Beanstalk. */
          current: time.current,
          /** The Season in which the most recent consecutive series of Seasons of Plenty started. */
          lastSopStart: time.lastSop,
          /** The Season in which the most recent consecutive series of Seasons of Plenty ended. */
          lastSopEnd: time.lastSopSeason,
          /** The most recent Season in which Rain started. */
          rainStart: time.rainStart,
          /** True if it is Raining (P > 1, Pod Rate Excessively Low). */
          raining: time.raining,
          /** The block of the start of the current Season. */
          sunriseBlock: TokenValue.fromBlockchain(time.sunriseBlock, 0),
          /** Boolean indicating whether the previous Season was above or below peg. */
          abovePeg: time.abovePeg,
          /** The timestamp of the Beanstalk deployment rounded down to the nearest hour. */
          start: TokenValue.fromBlockchain(time.start, 0),
          /** The length of each season in Beanstalk in seconds. */
          period: TokenValue.fromBlockchain(time.period, 0),
          /** The timestamp of the start of the current Season. */
          timestamp: TokenValue.fromBlockchain(time.timestamp, 0),
        };
      },
    },
  });

  return sunData.data ?? defaultSunData;
}
