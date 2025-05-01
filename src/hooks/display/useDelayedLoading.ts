import { useCallback, useEffect, useRef, useState } from "react";

export interface IUseDelayedLoading {
  loading: boolean;
  setLoadingTrue: () => void;
  setLoadingFalse: () => void;
  setLoading: (value: boolean) => void;
}

export default function useDelayedLoading(delayMs: number = 650, defaultState: boolean = false): IUseDelayedLoading {
  const [loading, setLoading] = useState(defaultState);
  const startTimeRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const setLoadingTrue = useCallback(() => {
    // Clear any existing timeout to prevent premature state changes
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setLoading(true);
    startTimeRef.current = performance.now();
  }, []);

  const setLoadingFalse = useCallback(() => {
    if (startTimeRef.current === null) {
      // If loading was never set to true, ensure it's false
      setLoading(false);
      return;
    }

    const currentTime = performance.now();
    const elapsedTime = currentTime - startTimeRef.current;

    // Clear any existing timeout
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (elapsedTime >= delayMs) {
      // If enough time has passed, set loading to false immediately
      setLoading(false);
      startTimeRef.current = 0;
    } else {
      // Otherwise, wait for the remaining time
      const remainingTime = delayMs - elapsedTime;
      timeoutRef.current = window.setTimeout(() => {
        setLoading(false);
        startTimeRef.current = null;
        timeoutRef.current = null;
      }, remainingTime);
    }
  }, [delayMs]);

  const setLoadingWithValue = useCallback(
    (value: boolean) => {
      if (value) setLoadingTrue();
      else setLoadingFalse();
    },
    [setLoadingTrue, setLoadingFalse],
  );

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { loading, setLoadingTrue, setLoadingFalse, setLoading: setLoadingWithValue } as const;
}
