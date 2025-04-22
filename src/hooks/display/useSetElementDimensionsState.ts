import { useEffect, useRef } from "react";

export interface ElementDimensions {
  width: number;
  height: number;
}

export default function useSetElementDimensionsState(
  ref: React.MutableRefObject<HTMLElement | null>,
  onChange: React.Dispatch<React.SetStateAction<ElementDimensions>>,
) {
  // Previous dimensions for comparison
  const prev = useRef<ElementDimensions>({ width: 0, height: 0 });

  // Effect to set the element dimensions state.
  // biome-ignore lint/correctness/useExhaustiveDependencies: only reset when swap data changes
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new ResizeObserver((entries) => {
      if (!entries.length) {
        return;
      }

      const entry = entries[0];

      if (entry) {
        const { width, height } = entry.contentRect;

        // Only update if the dimensions have changed to prevent unnecessary re-renders
        if (prev.current.width !== width || prev.current.height !== height) {
          prev.current = { width, height };
          onChange({ width, height });
        }
      }
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref]);
}
