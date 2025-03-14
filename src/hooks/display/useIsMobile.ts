import { breakpoints } from "@/utils/theme/breakpoints";
import { useEffect, useState } from "react";

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${breakpoints.sm}px)`);

    // Handler to update state
    const handleChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    // Initialize with correct value
    setIsMobile(mediaQuery.matches);

    // Modern Safari & browsers
    mediaQuery.addEventListener("change", handleChange);

    // Fallback for older Safari versions
    return () => mediaQuery.removeEventListener?.("change", handleChange);
  }, []);

  return isMobile;
};

export default useIsMobile;
