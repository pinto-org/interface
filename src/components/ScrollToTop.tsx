// components/ScrollToTop.tsx
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();
  const prevPathnameRef = useRef<string | null>(null);

  useEffect(() => {
    const prev = prevPathnameRef.current;
    const isMarketPodsPrev = prev?.startsWith("/market/pods");
    const isMarketPodsCurrent = pathname.startsWith("/market/pods");

    // Preserve scroll position when navigating within the Pod Market
    if (isMarketPodsPrev && isMarketPodsCurrent) {
      prevPathnameRef.current = pathname;
      return;
    }

    document.body.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });

    prevPathnameRef.current = pathname;
  }, [pathname]);

  return null;
}
