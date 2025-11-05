import { breakpoints } from "@/utils/theme/breakpoints";
import { useEffect, useState } from "react";

const useIsExtraSmall = () => {
  const [isExtraSmall, setIsExtraSmall] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${breakpoints.xs}px)`);

    // Handler to update state
    const handleChange = (e: MediaQueryListEvent) => {
      setIsExtraSmall(e.matches);
    };

    // Initialize with correct value
    setIsExtraSmall(mediaQuery.matches);

    // Modern Safari & browsers
    mediaQuery.addEventListener("change", handleChange);

    // Fallback for older Safari versions
    return () => mediaQuery.removeEventListener?.("change", handleChange);
  }, []);

  return isExtraSmall;
};

export default useIsExtraSmall;
