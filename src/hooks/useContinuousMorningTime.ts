import type { TV } from "@/classes/TokenValue";
import { MORNING_AUCTION_DURATION } from "@/constants/morning";
import { scaleTemperatureWithMaxTemperature } from "@/state/protocol/field";
import { useTemperature } from "@/state/useFieldData";
import { useMorning, useSunData } from "@/state/useSunData";
import { DateTime } from "luxon";
import { useEffect, useMemo, useState } from "react";
import { normalizeTV } from "./../utils/number";

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

/**
 * Hook that provides scaled temperature updates during the morning auction period.
 * Updates at a configurable interval (default: 2 seconds) for efficient temperature tracking.
 *
 * @param {number} intervalMs - Interval in milliseconds for temperature updates (default: 2000ms)
 * @returns {{ max: TV, scaled: TV, isLoading: boolean }} Object containing max and scaled temperatures with loading state
 *
 * During morning: Calculates scaled temperature based on elapsed time using the logarithmic formula
 * Outside morning: Returns the current temperature from contract state
 */
export function useScaledTemperature(intervalMs: number = 2000): { max: TV; scaled: TV; isLoading: boolean } {
  const morning = useMorning();
  const season = useSunData();
  const contractTemperature = useTemperature();

  const [scaledTemp, setScaledTemp] = useState<TV>(normalizeTV(contractTemperature.scaled));

  const isMorning = morning.isMorning;
  const maxTemperature = contractTemperature.max;

  // Use stable reference for sunrise timestamp (only changes when the actual timestamp value changes)
  const sunriseTimestampSeconds = useMemo(() => {
    return season.timestamp?.toSeconds() ?? 0;
  }, [season.timestamp?.toMillis()]);

  /**
   * Set the scaled temperature to the normalized value if it is less than 0
   * Initial value is set to 0, so we need to set it to the normalized value if it is less than 0
   */
  useEffect(() => {
    if (contractTemperature.scaled.lt(0)) {
      setScaledTemp(normalizeTV(contractTemperature.scaled));
    }
  }, [contractTemperature.scaled]);

  useEffect(() => {
    // If scaled temperature is already set, don't recalculate
    if (scaledTemp.lt(0)) {
      return;
    }
    // If not morning, use contract scaled temperature
    if (!isMorning) {
      setScaledTemp(contractTemperature.scaled);
      return;
    }

    // If no sunrise timestamp, can't calculate
    if (!sunriseTimestampSeconds) {
      setScaledTemp(contractTemperature.scaled);
      return;
    }

    // During morning, calculate scaled temperature at intervals
    const updateScaledTemperature = () => {
      const now = DateTime.now();
      const nowSecs = now.toSeconds();

      // Calculate seconds elapsed since sunrise
      const elapsed = nowSecs - sunriseTimestampSeconds;

      // Clamp between 0 and MORNING_AUCTION_DURATION (600 seconds)
      const clampedElapsed = Math.max(0, Math.min(elapsed, MORNING_AUCTION_DURATION));

      // Calculate scaled temperature using the logarithmic formula
      const calculated = scaleTemperatureWithMaxTemperature(maxTemperature, clampedElapsed);
      setScaledTemp(calculated);
    };

    // Initial calculation
    updateScaledTemperature();

    // Set up interval for periodic updates
    const intervalId = setInterval(updateScaledTemperature, intervalMs);

    // Cleanup on unmount or when dependencies change
    return () => {
      clearInterval(intervalId);
    };
  }, [isMorning, maxTemperature, sunriseTimestampSeconds, contractTemperature.scaled, intervalMs]);

  return useMemo(
    () => ({
      max: maxTemperature,
      scaled: scaledTemp,
      isLoading: contractTemperature.isLoading,
    }),
    [maxTemperature, scaledTemp, contractTemperature.isLoading],
  );
}
