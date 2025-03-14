import { breakpoints } from "@/utils/theme/breakpoints";
import { useEffect, useState } from "react";

const useIsTablet = () => {
  const [isMd, setIsMd] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${breakpoints.lg}px)`);

    // Handler to update state
    const handleChange = (e: MediaQueryListEvent) => {
      setIsMd(e.matches);
    };

    // Initialize with correct value
    setIsMd(mediaQuery.matches);

    // Modern Safari & browsers
    mediaQuery.addEventListener("change", handleChange);

    // Fallback for older Safari versions
    return () => mediaQuery.removeEventListener?.("change", handleChange);
  }, []);

  return isMd;
};

export default useIsTablet;
