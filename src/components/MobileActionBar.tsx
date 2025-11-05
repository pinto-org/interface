import useIsMobile from "@/hooks/display/useIsMobile";
import useIsTablet from "@/hooks/display/useIsTablet";
import React, { useEffect } from "react";
import { useMobileActionBarContext } from "./MobileActionBarContext";

interface MobileActionBarProps {
  children: React.ReactNode;
  showOnTablet?: boolean;
}

const MobileActionBar = ({ children, showOnTablet }: MobileActionBarProps) => {
  const { setMobileActionBarVisible } = useMobileActionBarContext();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  useEffect(() => {
    // Only register as visible if the component will actually be displayed
    // showOnTablet=true means show on mobile + tablet (lg:hidden)
    // showOnTablet=false means show on mobile only (sm:hidden)
    const shouldBeVisible = showOnTablet ? isMobile || isTablet : isMobile;

    setMobileActionBarVisible(shouldBeVisible);

    // Cleanup when component unmounts
    return () => {
      setMobileActionBarVisible(false);
    };
  }, [setMobileActionBarVisible, isMobile, isTablet, showOnTablet]);

  return (
    <div
      className={`${showOnTablet ? "lg:hidden" : "sm:hidden"} fixed bottom-0 left-0 border-t h-[4.5rem] bg-pinto-off-white w-full max-w-full flex flex-row gap-2 justify-between items-center p-3 z-20`}
    >
      {children}
    </div>
  );
};

export default MobileActionBar;
