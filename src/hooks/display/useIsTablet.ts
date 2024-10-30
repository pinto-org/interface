import { breakpoints } from "@/utils/theme/breakpoints";
import { useState, useEffect } from "react";

const getTablet = () => window.innerWidth < breakpoints.lg;

const useIsTablet = () => {
  const [isMd, setIsMd] = useState(getTablet());

  useEffect(() => {
    const check = () => setIsMd(getTablet());
    check();
    window.addEventListener("resize", check);

    return () => window.removeEventListener("resize", check);
  }, []);

  return isMd;
};

export default useIsTablet;
