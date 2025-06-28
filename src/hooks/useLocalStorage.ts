import { isFunction } from "@/utils/utils";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export interface UseLocalStorageOptions<T> {
  /**
   * If true, writes the initialValue to storage when the key is missing.
   * This ensures the storage is populated with a default value.
   * @default false
   */
  initializeIfEmpty?: boolean;
  /**
   * Whether to enable cross-tab synchronization via CustomEvents.
   * When true, changes in one tab will be reflected in other tabs.
   * @default false
   */
  sync?: boolean;
  /**
   * Custom serialization function to convert the value to a string.
   * @default JSON.stringify
   */
  serialize?: (value: T) => string;
  /**
   * Custom deserialization function to convert a string back to the value type.
   * @default JSON.parse
   */
  deserialize?: (raw: string) => T;
}

/**
 * Safely deserializes a value from storage, falling back to a default value if deserialization fails.
 * @template T - The type of the value to be deserialized
 * @param raw - The raw string value from storage
 * @param fallback - The value to return if deserialization fails
 * @param options - Deserialization options
 * @returns The deserialized value or fallback
 */
function safeDeserialize<T>(
  raw: string | null,
  fallback: T,
  { deserialize }: Pick<UseLocalStorageOptions<T>, "deserialize">,
): T {
  if (raw == null) return fallback;
  try {
    return deserialize?.(raw) ?? (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

/**
 * A React hook for managing state that persists in localStorage.
 *
 * @template T - The type of the value to be stored
 * @param key - The key under which to store the value in localStorage
 * @param initialValue - The initial value or a function that returns the initial value
 * @param options - Configuration options for the hook
 * @returns A tuple containing:
 *   - The current value
 *   - A function to update the value
 *   - A function to remove the value from storage
 *
 * @example
 * ```tsx
 * const [count, setCount, removeCount] = useLocalStorage('counter', 0);
 *
 * // Update the value
 * setCount((prev) => prev + 1);
 *
 * // Remove the value
 * removeCount();
 * ```
 *
 * @example
 * ```tsx
 * // With custom serialization and cross-tab sync
 * const [data, setData] = useLocalStorage<Data | null>('local-data', null, {
 *   serialize: (data) => JSON.stringify(data),
 *   deserialize: (raw) => JSON.parse(raw),
 *   sync: true
 * });
 * ```
 */
export default function useLocalStorage<T = unknown>(
  key: string,
  initialValue: T | (() => T),
  { initializeIfEmpty = false, sync = false, serialize, deserialize }: UseLocalStorageOptions<T> = {},
): readonly [T, (v: T | ((p: T) => T)) => void, () => void] {
  /* ------------------------------------ init ----------------------------------- */
  const initial = useMemo(() => (isFunction(initialValue) ? initialValue() : initialValue), []);

  const writeInitialIfNeeded = (value: T) => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(key, serialize ? serialize(value) : JSON.stringify(value));
      if (sync) {
        window.dispatchEvent(new CustomEvent("local-storage", { detail: { key, value } }));
      }
    } catch {
      /* swallow quota / serialisation errors */
    }
  };

  const read = () => {
    if (typeof window === "undefined") return initial;

    const raw = window.localStorage.getItem(key);

    // Populate storage if empty and user asked for it
    if (raw === null && initializeIfEmpty) {
      writeInitialIfNeeded(initial);
      return initial;
    }

    return safeDeserialize<T>(raw, initial, { deserialize });
  };

  const [state, setState] = useState<T>(read);

  /* -------------------------------------------------------------------------- */
  /*                         keep serializers on a stable ref                   */
  /* -------------------------------------------------------------------------- */

  const serializeRef = useRef(serialize);
  const deserializeRef = useRef(deserialize);
  serializeRef.current = serialize;
  deserializeRef.current = deserialize;

  /* -------------------------------------------------------------------------- */
  /*                    setter — sync React state  &  storage                   */
  /* -------------------------------------------------------------------------- */

  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      setState((prev) => {
        const value = typeof next === "function" ? (next as (p: T) => T)(prev) : next;

        if (typeof window !== "undefined") {
          try {
            window.localStorage.setItem(
              key,
              serializeRef.current ? serializeRef.current(value) : JSON.stringify(value),
            );
            if (sync) {
              window.dispatchEvent(new CustomEvent("local-storage", { detail: { key, value } }));
            }
          } catch {
            /* ignore */
          }
        }
        return value;
      });
    },
    [key, sync],
  );

  /* -------------------------------------------------------------------------- */
  /*                              remover helper                                */
  /* -------------------------------------------------------------------------- */

  const remove = useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.removeItem(key);
      if (sync) {
        window.dispatchEvent(new CustomEvent("local-storage", { detail: { key, value: initial } }));
      }
    } finally {
      setState(initial);
    }
  }, [key, initial, sync]);

  /* -------------------------------------------------------------------------- */
  /*                resubscribe when key / storage backend changes              */
  /* -------------------------------------------------------------------------- */

  // biome-ignore lint/correctness/useExhaustiveDependencies: custom refs intentionally excluded
  useEffect(() => {
    setState(read()); // sync immediately on key change

    if (typeof window === "undefined" || !sync) return;

    const handleStorage = (e: StorageEvent) => {
      if (e.key === key) setState(read());
    };
    const handleCustom = (e: Event) => {
      const { key: changed, value } = (e as CustomEvent).detail ?? {};
      if (changed === key) setState(value);
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("local-storage", handleCustom);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("local-storage", handleCustom);
    };
  }, [key, sync]);

  /* -------------------------------------------------------------------------- */
  /*                              public API tuple                              */
  /* -------------------------------------------------------------------------- */

  return useMemo(() => [state, set, remove] as const, [state, set, remove]);
}
