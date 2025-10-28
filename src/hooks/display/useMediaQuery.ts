import { breakpoints } from "@/utils/theme/breakpoints";
import { useEffect, useState } from "react";

type BreakpointKey = keyof typeof breakpoints;
type MediaQueryType = "above" | "below" | "between";

// Overloaded function signatures
function useMediaQuery(type: "above", bp: BreakpointKey): boolean;
function useMediaQuery(type: "below", bp: BreakpointKey): boolean;
function useMediaQuery(type: "between", min: BreakpointKey, max: BreakpointKey): boolean;

function useMediaQuery(type: MediaQueryType, bp: BreakpointKey, maxBp?: BreakpointKey): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(buildQueryString(type, bp, maxBp));

    // Handler to update state
    const handleChange = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    // Initialize with correct value
    setMatches(mediaQuery.matches);

    // Modern Safari & browsers
    mediaQuery.addEventListener("change", handleChange);

    // Cleanup
    return () => mediaQuery.removeEventListener?.("change", handleChange);
  }, [type, bp, maxBp]);

  return matches;
}

export default useMediaQuery;

const buildQueryString = (type: MediaQueryType, bp: BreakpointKey, maxBp?: BreakpointKey) => {
  // Build media query string based on type
  switch (type) {
    case "above": {
      return `(min-width: ${breakpoints[bp]}px)`;
    }
    case "below": {
      return `(max-width: ${breakpoints[bp] - 1}px)`;
    }
    case "between": {
      if (!maxBp) {
        throw new Error('maxBreakpoint is required for "between" media query');
      }
      const minWidth = breakpoints[bp];
      const maxWidth = breakpoints[maxBp] - 1;

      if (minWidth >= breakpoints[maxBp]) {
        throw new Error(`Invalid range: ${bp} (${minWidth}px) should be less than ${maxBp} (${breakpoints[maxBp]}px)`);
      }

      return `(min-width: ${minWidth}px) and (max-width: ${maxWidth}px)`;
    }
    default:
      throw new Error(`Unsupported media query type: ${type}`);
  }
};
