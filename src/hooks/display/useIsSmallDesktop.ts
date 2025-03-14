import { breakpoints } from "@/utils/theme/breakpoints";
import { useEffect, useState } from "react";

const useIsSmallDesktop = () => {
  const [is3xl, setIs3xl] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${breakpoints["3xl"]}px)`);

    // Handler to update state
    const handleChange = (e: MediaQueryListEvent) => {
      setIs3xl(e.matches);
    };

    // Initialize with correct value
    setIs3xl(mediaQuery.matches);

    // Modern Safari & browsers
    mediaQuery.addEventListener("change", handleChange);

    // Fallback for older Safari versions
    return () => mediaQuery.removeEventListener?.("change", handleChange);
  }, []);

  return is3xl;
};

export default useIsSmallDesktop;
