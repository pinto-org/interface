import ChartIncreasing from "@/assets/landing/chart-increasing.png";
import Farmer_1 from "@/assets/landing/farmer_1.png";
import Hammer from "@/assets/landing/hammer.png";
import Memo from "@/assets/landing/memo.png";
import { ANALYTICS_EVENTS } from "@/constants/analytics-events";
import useIsMobile from "@/hooks/display/useIsMobile";
import { trackClick } from "@/utils/analytics";
import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
import { Button } from "../ui/Button";
import ContributorMessage from "./ContributorMessage";
import ContributorProfiles from "./ContributorProfiles";
import ImageCarousel from "./ImageCarousel";
import LandingVolume from "./LandingVolume";
import ProtocolUpgrades, { PROTOCOL_UPGRADES } from "./ProtocolUpgrades";

type ActiveButton = "upgrades" | "contributors" | "years" | "volume" | null;

interface StatContentProps {
  activeButton: ActiveButton;
  isMobile: boolean;
}

function StatContent({ activeButton, isMobile }: StatContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      animate={{
        height: activeButton ? (isMobile ? 300 : 400) : 0,
        opacity: activeButton ? 1 : 0,
        y: activeButton ? 0 : -20,
      }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="flex items-start"
    >
      <div ref={contentRef} className="sm:mt-4">
        <AnimatePresence mode="wait" initial={false}>
          {activeButton === "upgrades" && (
            <motion.div
              key="upgrades"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <ProtocolUpgrades />
            </motion.div>
          )}
          {activeButton === "years" && (
            <motion.div
              key="years"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <ImageCarousel />
            </motion.div>
          )}
          {activeButton === "volume" && (
            <motion.div
              key="volume"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <LandingVolume />
            </motion.div>
          )}
          {activeButton === "contributors" && (
            <motion.div
              key="contributors"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <ContributorMessage />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function ProjectStats() {
  const [activeButton, setActiveButton] = useState<ActiveButton>("upgrades");
  const isMobile = useIsMobile();

  // Handle manual button selection
  const handleButtonClick = (buttonType: ActiveButton, event?: React.MouseEvent) => {
    // Track button click with specific analytics events
    if (buttonType) {
      const eventMapping = {
        upgrades: ANALYTICS_EVENTS.LANDING.STATS_UPGRADES_BUTTON_CLICK,
        contributors: ANALYTICS_EVENTS.LANDING.STATS_CONTRIBUTORS_BUTTON_CLICK,
        years: ANALYTICS_EVENTS.LANDING.STATS_YEARS_BUTTON_CLICK,
        volume: ANALYTICS_EVENTS.LANDING.STATS_VOLUME_BUTTON_CLICK,
      };

      const analyticsEvent = eventMapping[buttonType];
      if (analyticsEvent) {
        trackClick(analyticsEvent, {
          button_type: buttonType,
          section: "stats",
          previous_active: activeButton || "none",
        })(event);
      }
    }

    setActiveButton(buttonType);

    // Handle scrolling behavior for both mobile and desktop
    if (event?.currentTarget) {
      const scrollContainer = document.getElementById("scrollContainer");

      if (scrollContainer) {
        if (isMobile) {
          // Mobile: scroll to position upgrades button at specific offset from top
          const upgradesButton = document.getElementById("upgradesButton");

          if (upgradesButton) {
            const containerRect = scrollContainer.getBoundingClientRect();
            const upgradesRect = upgradesButton.getBoundingClientRect();

            const offset = buttonType === "contributors" ? 140 : 70;

            // Calculate position relative to the scroll container
            const upgradesRelativeTop = upgradesRect.top - containerRect.top;
            const currentScrollTop = scrollContainer.scrollTop;
            const targetScrollTop = currentScrollTop + upgradesRelativeTop - offset;

            scrollContainer.scrollTo({
              top: targetScrollTop,
              behavior: "smooth",
            });
          }
        } else {
          // Desktop: scroll to stats section
          const statsElement = document.getElementById("stats");

          if (statsElement) {
            const viewportHeight = scrollContainer.clientHeight;
            let targetScrollTop = statsElement.offsetTop;

            const topCtaSpace = viewportHeight * 0.02;
            const ctaOffset = topCtaSpace;
            targetScrollTop = targetScrollTop - ctaOffset;

            scrollContainer.scrollTo({
              top: targetScrollTop,
              behavior: "smooth",
            });
          }
        }
      }
    }
  };

  // Helper to determine opacity class
  const getElementOpacity = (isActive: boolean) => {
    if (activeButton === null) return "opacity-100";
    return isActive ? "opacity-100" : "opacity-50";
  };

  function Upgrades() {
    return (
      <span className="flex flex-row gap-3 sm:gap-6 items-center">
        <span
          className={`text-[2rem] sm:text-[4rem] leading-[1.4] text-black transition-all duration-300 ${getElementOpacity(activeButton === "upgrades")}`}
        >
          {/* Protocol Upgrades + Pinto Launch (+1)*/}
          {PROTOCOL_UPGRADES.length + 1}
        </span>
        <Button
          variant={"outline-rounded"}
          className={`text-pinto-gray-5 text-2xl sm:text-4xl font-thin h-[3rem] sm:h-[4rem] cursor-pointer transition-all duration-300 ${getElementOpacity(activeButton === "upgrades")}`}
          onClick={(event) => handleButtonClick("upgrades", event)}
          glow={activeButton === "upgrades"}
          shimmer={!activeButton || activeButton === "upgrades"}
          shimmerColor="rgba(156, 156, 156, 0.2)" // pinto-gray-4
          glowColor="rgba(156, 156, 156, 0.5)" // pinto-gray-4
          id={"upgradesButton"}
        >
          <span className="flex items-center gap-2">
            <img src={Hammer} alt="hammer" className="w-6 h-6 sm:w-8 sm:h-8" />
            protocol upgrades
          </span>
        </Button>
      </span>
    );
  }

  function Contributors() {
    return (
      <span className="flex flex-row gap-3 sm:gap-6 items-center">
        <span className={`transition-all duration-300 ${getElementOpacity(false)}`}>from</span>
        <span
          className={`text-[2rem] sm:text-[4rem] leading-[1.4] text-black transition-all duration-300 ${getElementOpacity(activeButton === "contributors")}`}
        >
          52
        </span>
        {/* Contributors floating above the button */}
        <span className="relative">
          <AnimatePresence>
            {activeButton === "contributors" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="absolute -left-[4.5rem] -top-40 sm:-left-4 sm:-top-[12.5rem] min-[1000px]:left-5 min-[1000px]:-top-24"
              >
                <ContributorProfiles />
              </motion.div>
            )}
          </AnimatePresence>
          <Button
            variant="outline-rounded"
            className={`text-pinto-gray-5 text-2xl sm:text-4xl font-thin h-[3rem] sm:h-[4rem] cursor-pointer transition-all duration-300 ${getElementOpacity(activeButton === "contributors")}`}
            onClick={(event) => handleButtonClick("contributors", event)}
            glow={activeButton === "contributors"}
            shimmer={!activeButton || activeButton === "contributors"}
            shimmerColor="rgba(156, 156, 156, 0.2)" // pinto-gray-4
            glowColor="rgba(156, 156, 156, 0.5)" // pinto-gray-4
          >
            <span className="flex items-center gap-2">
              <img src={Farmer_1} alt="farmer" className="w-6 h-6 sm:w-8 sm:h-8" />
              contributors
            </span>
          </Button>
        </span>
        <span className={`transition-all duration-300 ${getElementOpacity(false)} max-sm:hidden`}>over</span>
      </span>
    );
  }

  function Years() {
    return (
      <span className="flex flex-row gap-3 sm:gap-6 items-center">
        <span className={`transition-all duration-300 ${getElementOpacity(false)} sm:hidden`}>over</span>
        <span
          className={`text-[2rem] sm:text-[4rem] leading-[1.4] text-black transition-all duration-300 ${getElementOpacity(activeButton === "years")}`}
        >
          4+
        </span>
        <Button
          variant={"outline-rounded"}
          className={`text-pinto-gray-5 text-2xl sm:text-4xl font-thin h-[3rem] sm:h-[4rem] cursor-pointer transition-all duration-300 ${getElementOpacity(activeButton === "years")}`}
          onClick={(event) => handleButtonClick("years", event)}
          glow={activeButton === "years"}
          shimmer={!activeButton || activeButton === "years"}
          shimmerColor="rgba(156, 156, 156, 0.2)" // pinto-gray-4
          glowColor="rgba(156, 156, 156, 0.5)" // pinto-gray-4
        >
          <span className="flex items-center gap-2">
            <img src={Memo} alt="memo" className="w-6 h-6 sm:w-8 sm:h-8" />
            years
          </span>
        </Button>
      </span>
    );
  }

  function Volume() {
    return (
      <span className="flex flex-col min-[1000px]:flex-row gap-3 sm:gap-6 items-center">
        <span className={`transition-all flex flex-row gap-3 sm:gap-6 items-center whitespace-nowrap`}>
          <span className={`${getElementOpacity(false)} duration-300`}>to facilitate</span>
          <span
            className={`text-[2rem] sm:text-[4rem] leading-[1.4] text-black transition-all duration-300 ${getElementOpacity(activeButton === "volume")}`}
          >
            $800M+
          </span>
        </span>
        <span className="flex flex-row gap-3 sm:gap-6 items-center">
          <Button
            variant={"outline-rounded"}
            className={`text-pinto-gray-5 text-2xl sm:text-4xl font-thin h-[3rem] sm:h-[4rem] cursor-pointer transition-all duration-300 ${getElementOpacity(activeButton === "volume")}`}
            onClick={(event) => handleButtonClick("volume", event)}
            glow={activeButton === "volume"}
            shimmer={!activeButton || activeButton === "volume"}
            shimmerColor="rgba(156, 156, 156, 0.2)" // pinto-gray-4
            glowColor="rgba(156, 156, 156, 0.5)" // pinto-gray-4
          >
            <span className="flex items-center gap-2">
              <img src={ChartIncreasing} alt="chart" className="w-6 h-6 sm:w-8 sm:h-8" />
              in cumulative volume
            </span>
          </Button>
        </span>
      </span>
    );
  }

  return (
    <div>
      <motion.div
        className="flex flex-col max-sm:gap-3 sm:max-w-[1920px] max-[850px]:scale-90 items-center sm:mx-auto sm:my-auto text-2xl sm:text-4xl font-thin text-pinto-gray-4 transform-gpu transition-all relative"
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        <span className="flex flex-col min-[1000px]:flex-row gap-3 min-[1000px]:gap-6 items-center">
          <Upgrades />
          <Contributors />
        </span>
        <span className="flex flex-col min-[1000px]:flex-row gap-3 min-[1000px]:gap-6 items-center">
          <Years />
          <Volume />
        </span>
        <StatContent activeButton={activeButton} isMobile={isMobile} />
      </motion.div>
    </div>
  );
}
