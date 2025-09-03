import { useCallback, useEffect, useRef, useState } from "react";
import { useDebounceValue } from "../../utils/useDebounce";

export interface IUseDelayedLoading {
  loading: boolean;
  setLoadingTrue: () => void;
  setLoadingFalse: () => void;
  setLoading: (value: boolean) => void;
}

/**
 * Ensures loading stays `true` for a minimum duration to prevent brief flashes.
 *
 * **vs useDebouncedLoading:** This guarantees minimum display time, while useDebouncedLoading smooths rapid changes.
 *
 * @param delayMs - Minimum duration loading must stay true (default: 650ms)
 * @param defaultState - Initial loading state (default: false)
 *
 * @example
 * ```tsx
 * const { loading, setLoadingFalse } = useDelayedLoading(500);
 * // Loading stays visible for at least 500ms after setLoadingFalse()
 * ```
 */
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

/**
 * Configuration options for the useDebouncedLoading hook.
 *
 * @interface UseDebouncedLoadingOptions
 */
export interface UseDebouncedLoadingOptions {
  /** The external loading state to debounce */
  isLoading: boolean;
  /** Debounce delay in milliseconds. Default: 650ms */
  ms?: number;
  /** Whether debouncing is enabled. When false, bypasses debouncing entirely. Default: true */
  enabled?: boolean;
  /** Initial loading state to prevent flicker. If not provided, uses isLoading value. */
  defaultValue?: boolean;
}

/**
 * Debounces an external loading state to smooth rapid on/off changes.
 *
 * **vs useDelayedLoading:** This smooths rapid changes from external state, while useDelayedLoading guarantees minimum display time for manual setters.
 *
 * @param options.isLoading - External loading state to debounce
 * @param options.ms - Debounce delay (default: 650ms)
 * @param options.enabled - Enable debouncing (default: true)
 * @param options.defaultValue - Initial state to prevent flicker
 *
 * @example
 * ```tsx
 * // Smooth rapid query loading changes
 * const { loading } = useDebouncedLoading({ isLoading: queriesLoading });
 *
 * // Prevent flicker on page load with cached data
 * const { loading } = useDebouncedLoading({
 *   isLoading: queriesLoading,
 *   defaultValue: false
 * });
 * ```
 */
export function useDebouncedLoading(options: UseDebouncedLoadingOptions): IUseDelayedLoading {
  const { isLoading, ms = 200, enabled, defaultValue } = options;
  const [internalLoading, setInternalLoading] = useState(defaultValue ?? isLoading);

  // Update internal state when isLoading changes
  useEffect(() => {
    setInternalLoading(isLoading);
  }, [isLoading]);

  // Debounce the loading value, but only when enabled (default true)
  const shouldDebounce = enabled !== false;
  const debouncedLoading = useDebounceValue(internalLoading, shouldDebounce ? ms : 0);

  const setLoadingTrue = useCallback(() => {
    setInternalLoading(true);
  }, []);

  const setLoadingFalse = useCallback(() => {
    setInternalLoading(false);
  }, []);

  const setLoadingWithValue = useCallback((value: boolean) => {
    setInternalLoading(value);
  }, []);

  return {
    loading: debouncedLoading,
    setLoadingTrue,
    setLoadingFalse,
    setLoading: setLoadingWithValue,
  } as const;
}
