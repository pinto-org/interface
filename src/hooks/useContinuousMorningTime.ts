import type { TV } from "@/classes/TokenValue";
import { MORNING_AUCTION_DURATION } from "@/constants/morning";
import { scaleTemperatureWithMaxTemperature } from "@/state/protocol/field";
import { useTemperature } from "@/state/useFieldData";
import { useMorning, useSunData } from "@/state/useSunData";
import { DateTime } from "luxon";
import { useEffect, useMemo, useState } from "react";

/**
 * Hook that provides continuous time tracking during the morning auction period.
 * Updates at 60fps using requestAnimationFrame for smooth animations.
 *
 * @returns {number} Seconds elapsed since sunrise (fractional, e.g., 45.234)
 *                   Returns 0 when not in morning period or before sunrise
 */
export function useContinuousMorningTime(): number {
  const morning = useMorning();
  const season = useSunData();
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);

  const isMorning = morning.isMorning;

  // Use stable reference for sunrise timestamp (only changes when the actual timestamp value changes)
  const sunriseTimestampSeconds = useMemo(() => {
    return season.timestamp?.toSeconds() ?? 0;
  }, [season.timestamp?.toMillis()]);

  useEffect(() => {
    if (!isMorning || !sunriseTimestampSeconds) {
      setSecondsElapsed(0);
      return;
    }

    let animationFrameId: number;

    const updateTime = () => {
      const now = DateTime.now();
      const nowSecs = now.toSeconds();

      // Calculate fractional seconds elapsed since sunrise
      const elapsed = nowSecs - sunriseTimestampSeconds;

      // Clamp between 0 and MORNING_AUCTION_DURATION (600 seconds)
      const clampedElapsed = Math.max(0, Math.min(elapsed, MORNING_AUCTION_DURATION));

      setSecondsElapsed(clampedElapsed);

      // Continue the animation loop
      animationFrameId = requestAnimationFrame(updateTime);
    };

    // Start the animation loop
    animationFrameId = requestAnimationFrame(updateTime);

    // Cleanup on unmount or when dependencies change
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isMorning, sunriseTimestampSeconds]);

  return secondsElapsed;
}
