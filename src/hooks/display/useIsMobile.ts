import { breakpoints } from "@/utils/theme/breakpoints";
import { useState, useEffect } from "react";

const getMobile = () => window.innerWidth < breakpoints.sm;

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(getMobile());

  useEffect(() => {
    const checkMobile = () => setIsMobile(getMobile());
    checkMobile();
    window.addEventListener("resize", checkMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
};

export default useIsMobile;
