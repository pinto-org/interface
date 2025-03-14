import { DebouncedFunc, debounce, isEqual } from "lodash";
import { DependencyList, useEffect, useMemo, useRef, useState } from "react";
import { AnyFn } from "./types.generic";

export function useDebouncedEffect(effect: () => void, dependencies: DependencyList, delay: number = 250) {
  const effectRef = useRef(effect);
  const cleanupRef = useRef<(() => void) | undefined>();

  // Update the effect reference on each render
  effectRef.current = effect;

  // Memoize the debounced effect to prevent it from being recreated on every render
  const debouncedEffect = useMemo(
    () =>
      debounce(() => {
        // Execute the latest effect and handle cleanup
        const cleanup = effectRef.current();

        // Call the previous cleanup function if it exists
        if (typeof cleanupRef.current === "function") {
          cleanupRef.current();
          cleanupRef.current = undefined;
        }

        // If the new effect returns a cleanup function, store it
        if (typeof cleanup === "function") {
          cleanupRef.current = cleanup;
        } else {
          cleanupRef.current = undefined;
        }
      }, delay),
    [delay],
  );

  useEffect(() => {
    // Execute the debounced effect
    debouncedEffect();

    return () => {
      // Cancel any pending debounced calls
      debouncedEffect.cancel();
      // Call the cleanup function if it exists
      if (typeof cleanupRef.current === "function") {
        cleanupRef.current();
        cleanupRef.current = undefined;
      }
    };
    // Include dependencies and debouncedEffect in the dependency array
  }, [...dependencies, debouncedEffect]);
}

interface DebounceOptions<T> {
  leading?: boolean;
  trailing?: boolean;
  maxWait?: number;
  equalityFn?: (left: T, right: T) => boolean;
}

const empty = {};

/**
 * Debounces a function, updating the debounced function when the input value changes.
 * @param func - The function to debounce.
 * @param wait - The delay in milliseconds.
 * @param options - Options for the debounce function.
 * @returns The debounced function.
 */
export function useDebounceCallback<T, Func extends AnyFn>(
  func: Func,
  wait = 250,
  options: DebounceOptions<T> = empty,
): DebouncedFunc<Func> {
  const debouncedFunc = useMemo(() => debounce(func, wait, options), [func, wait, options]);

  useEffect(() => {
    return () => {
      debouncedFunc.cancel();
    };
  }, [debouncedFunc]);

  return debouncedFunc;
}

/**
 * Debounces a value, updating the debounced value when the input value changes.
 * @param value - The value to debounce.
 * @param delay - The delay in milliseconds.
 * @param options - Options for the debounce function.
 * - `leading`: Whether to invoke the debounced function on the leading edge of the timeout.
 * - `trailing`: Whether to invoke the debounced function on the trailing edge of the timeout.
 * - `maxWait`: The maximum time to wait before invoking the debounced function.
 * - `equalityFn`: A function to determine if two values are equal. Important to memoize this.
 * @returns The debounced value.
 */
export function useDebounceValue<T>(value: T, delay: number = 250, options: DebounceOptions<T> = {}): T {
  const { leading = false, trailing = true, maxWait, equalityFn = isEqual } = options;

  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const previousValueRef = useRef<T>(value);

  const debouncedFn = useMemo(() => {
    const fn = debounce(
      (newValue: T) => {
        setDebouncedValue(newValue);
      },
      delay,
      { leading, trailing, maxWait },
    );

    return fn;
  }, [delay, leading, trailing, maxWait]);

  useEffect(() => {
    if (!equalityFn(previousValueRef.current, value)) {
      previousValueRef.current = value;
      debouncedFn(value);

      if (leading) {
        setDebouncedValue(value);
      }
    }

    return () => {
      debouncedFn.cancel();
    };
  }, [value, debouncedFn, equalityFn, leading]);

  return debouncedValue;
}
