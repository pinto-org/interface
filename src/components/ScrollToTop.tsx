// components/ScrollToTop.tsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    document.body.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
    // biome-ignore lint/correctness/useExhaustiveDependencies: pathname is intentionally used to trigger scroll on route changes
  }, [pathname]); // Trigger on pathname or search param changes

  return null;
}
