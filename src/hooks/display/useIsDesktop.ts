import { breakpoints } from "@/utils/theme/breakpoints";
import { useState, useEffect } from "react";

const getDesktop = () => window.innerWidth >= breakpoints.lg;

const useIsDesktop = () => {
  const [isLg, setIsLg] = useState(getDesktop());

  useEffect(() => {
    const check = () => setIsLg(getDesktop());
    check();
    window.addEventListener("resize", check);

    return () => window.removeEventListener("resize", check);
  }, []);

  return isLg;
};

export default useIsDesktop;
