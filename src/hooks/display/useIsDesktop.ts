import { breakpoints } from "@/utils/theme/breakpoints";
import { useEffect, useState } from "react";

const useIsDesktop = () => {
  const [isLg, setIsLg] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(min-width: ${breakpoints.lg}px)`);

    // Handler to update state
    const handleChange = (e: MediaQueryListEvent) => {
      setIsLg(e.matches);
    };

    // Initialize with correct value
    setIsLg(mediaQuery.matches);

    // Modern Safari & browsers
    mediaQuery.addEventListener("change", handleChange);

    // Fallback for older Safari versions
    return () => mediaQuery.removeEventListener?.("change", handleChange);
  }, []);

  return isLg;
};

export default useIsDesktop;
