import { MORNING_AUCTION_DURATION } from "@/constants/morning";
import { getBlockchainNow, getMorningEndTime } from "@/state/protocol/sun";
import { useSunData, useTimeOffset } from "@/state/useSunData";
import { cn } from "@/utils/utils";
import { useEffect, useState } from "react";

const sizeToWidth = {
  lg: "w-[1.375rem] min-w-[1.375rem]",
  sm: "w-[0.625rem] min-w-[0.625rem]",
} as const;

const separatorStyles = {
  lg: "mx-[1px] bottom-0.5",
  sm: "px-[1px] bottom-[1px]",
} as const;

const MonoSpace = ({
  left = "",
  right = "",
  separator,
  size = "lg",
}: { left?: string; right?: string; separator?: string; size?: keyof typeof sizeToWidth }) => {
  return (
    <>
      {left.split("").map((char, i) => (
        <span className={cn("text-center", sizeToWidth[size])} key={`left-monospace-${i}-${char}`}>
          {char}
        </span>
      ))}
      {separator ? <span className={cn("relative", separatorStyles[size])}>{separator}</span> : null}
      {right.split("").map((char, i) => (
        <span className={cn("text-center", sizeToWidth[size])} key={`right-monospace-${i}-${char}`}>
          {char}
        </span>
      ))}
    </>
  );
};

export const MorningIntervalCountdown = ({ prefix }: { prefix?: string }) => {
  const season = useSunData();
  const timeOffsetMs = useTimeOffset();

  const [remainingSeconds, setRemainingSeconds] = useState(() => {
    const morningEndTime = getMorningEndTime(season.timestamp);
    const blockchainNow = getBlockchainNow(timeOffsetMs);
    return morningEndTime.diff(blockchainNow, "seconds").seconds;
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      const morningEndTime = getMorningEndTime(season.timestamp);
      const blockchainNow = getBlockchainNow(timeOffsetMs);
      const remaining = morningEndTime.diff(blockchainNow, "seconds").seconds;
      setRemainingSeconds(remaining);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [season.timestamp, timeOffsetMs]);

  const formatted = formatTime(remainingSeconds);
  const [minutes, seconds] = formatted.split(":");

  return (
    <div className="inline-flex items-center">
      {prefix ? <span className="mr-1">{prefix}</span> : null}
      <MonoSpace left={minutes} right={seconds} separator=":" size="sm" />
    </div>
  );
};

const TOTAL_DURATION = 10 * 60 - 1; // 10 minutes in seconds

// Function to format seconds into "m:ss"
const formatTime = (_seconds: number) => {
  const seconds = Math.abs(_seconds);
  const clampedSeconds = Math.min(Math.max(Math.floor(seconds), 0), TOTAL_DURATION);
  const minutes = Math.floor(clampedSeconds / 60);
  const remainingSeconds = clampedSeconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export const MorningTimer = () => {
  const season = useSunData();
  const timeOffsetMs = useTimeOffset();

  const [elapsedSeconds, setElapsedSeconds] = useState(() => {
    const blockchainNow = getBlockchainNow(timeOffsetMs);
    const elapsed = blockchainNow.diff(season.timestamp, "seconds").seconds;
    return Math.max(0, Math.min(elapsed, MORNING_AUCTION_DURATION));
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      const blockchainNow = getBlockchainNow(timeOffsetMs);
      const elapsed = blockchainNow.diff(season.timestamp, "seconds").seconds;
      const clamped = Math.max(0, Math.min(elapsed, MORNING_AUCTION_DURATION));
      setElapsedSeconds(clamped);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [season.timestamp, timeOffsetMs]);

  const formatted = formatTime(elapsedSeconds);
  const [minutes, seconds] = formatted.split(":");

  return (
    <>
      <div className="relative inline-flex items-center">
        <MonoSpace left={minutes} right={seconds} separator=":" />
        <span className="mx-1">/</span>
        <MonoSpace left={"10"} right={"00"} separator=":" />
      </div>
    </>
  );
};
