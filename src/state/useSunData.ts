import { useReadBeanstalk_Time } from "@/generated/contractHooks";
import { TokenValue } from "@/classes/TokenValue";

const settings = {
  query: {
    staleTime: 1000 * 60 * 2,
    refetchInterval: 1000 * 60 * 3, // 3 minutes, in milliseconds
  },
};

export function useSunData() {
  // const seasonTime = useReadBeanstalk_SeasonTime(); /// the season that it could be if sunrise was called
  const time = useReadBeanstalk_Time(settings).data;

  return {
    /** The current Season in Beanstalk. */
    current: TokenValue.fromBlockchain(time?.current || 0n, 0),
    /** The Season in which the most recent consecutive series of Seasons of Plenty started. */
    lastSopStart: TokenValue.fromBlockchain(time?.lastSop || 0n, 0),
    /** The Season in which the most recent consecutive series of Seasons of Plenty ended. */
    lastSopEnd: TokenValue.fromBlockchain(time?.lastSopSeason || 0n, 0),
    /** The number of Seasons required to Withdraw a Deposit. */
    withdrawSeasons: TokenValue.fromBlockchain(time?.withdrawSeasons || 0n, 0),
    /** The most recent Season in which Rain started. */
    rainStart: TokenValue.fromBlockchain(time?.rainStart || 0n, 0),
    /** True if it is Raining (P > 1, Pod Rate Excessively Low). */
    raining: time?.raining || false,
    /** True if Beanstalk has Fertilizer left to be paid off. */
    fertilizing: time?.fertilizing || false,
    /** The block of the start of the current Season. */
    sunriseBlock: TokenValue.fromBlockchain(time?.sunriseBlock || 0n, 0),
    /** Boolean indicating whether the previous Season was above or below peg. */
    abovePeg: time?.abovePeg || false,
    /** The timestamp of the Beanstalk deployment rounded down to the nearest hour. */
    start: TokenValue.fromBlockchain(time?.start || 0n, 0),
    /** The length of each season in Beanstalk in seconds. */
    period: TokenValue.fromBlockchain(time?.period || 0n, 0),
    /** The timestamp of the start of the current Season. */
    timestamp: TokenValue.fromBlockchain(time?.timestamp || 0n, 0),
  };
}
