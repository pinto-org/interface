import PintoLogo from "@/assets/protocol/PintoLogo.svg";
import PintoLogoText from "@/assets/protocol/PintoLogoText.svg";
import Footer from "@/components/Footer";
import { PintoRightArrow } from "@/components/Icons";
import BugBounty from "@/components/landing/BugBounty";
import LandingChart from "@/components/landing/LandingChart";
import ProjectStats from "@/components/landing/ProjectStats";
import Resources from "@/components/landing/Resources";
import SecondaryCTA from "@/components/landing/SecondaryCTA";
import { navLinks } from "@/components/nav/nav/Navbar";
import { Button } from "@/components/ui/Button";
import { ANALYTICS_EVENTS } from "@/constants/analytics-events";
import useIsMobile from "@/hooks/display/useIsMobile";
import { trackClick } from "@/utils/analytics";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

export default function Landing() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const isMobile = useIsMobile();
  const [isInLastSection, setIsInLastSection] = useState<boolean>(false); // Track if in last section

  // Tracking refs for one-time events
  const hasScrolledRef = useRef(false);
  const scrollDepthTrackedRef = useRef(new Set<number>());
  const sessionTimersRef = useRef<NodeJS.Timeout[]>([]);

  // Track page load and session time
  useEffect(() => {
    // Track page load immediately
    trackClick(ANALYTICS_EVENTS.LANDING.PAGE_LOAD, {
      timestamp: Date.now(),
    })();

    // Set up session time tracking
    const sessionTimers = [
      setTimeout(() => {
        trackClick(ANALYTICS_EVENTS.LANDING.SESSION_TIME_30S, {
          session_duration: 30000,
          timestamp: Date.now(),
        })();
      }, 30000), // 30 seconds

      setTimeout(() => {
        trackClick(ANALYTICS_EVENTS.LANDING.SESSION_TIME_60S, {
          session_duration: 60000,
          timestamp: Date.now(),
        })();
      }, 60000), // 1 minute

      setTimeout(() => {
        trackClick(ANALYTICS_EVENTS.LANDING.SESSION_TIME_120S, {
          session_duration: 120000,
          timestamp: Date.now(),
        })();
      }, 120000), // 2 minutes
    ];

    sessionTimersRef.current = sessionTimers;

    // Cleanup timers on unmount
    return () => {
      sessionTimers.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  // Track scroll position to determine if at top
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      const currentScrollTop = scrollContainer.scrollTop;

      // Track first scroll
      if (!hasScrolledRef.current && currentScrollTop > 0) {
        hasScrolledRef.current = true;
        trackClick(ANALYTICS_EVENTS.LANDING.PAGE_SCROLL_START, {
          timestamp: Date.now(),
          initial_scroll_position: currentScrollTop,
        })();
      }

      // Calculate scroll depth
      const scrollHeight = scrollContainer.scrollHeight - scrollContainer.clientHeight;
      const scrollPercentage = Math.round((currentScrollTop / scrollHeight) * 100);

      // Track scroll depth milestones
      const depthMilestones = [25, 50, 75, 100];
      const eventMap = {
        25: ANALYTICS_EVENTS.LANDING.PAGE_SCROLL_DEPTH_25,
        50: ANALYTICS_EVENTS.LANDING.PAGE_SCROLL_DEPTH_50,
        75: ANALYTICS_EVENTS.LANDING.PAGE_SCROLL_DEPTH_75,
        100: ANALYTICS_EVENTS.LANDING.PAGE_SCROLL_DEPTH_100,
      };

      depthMilestones.forEach((milestone) => {
        if (scrollPercentage >= milestone && !scrollDepthTrackedRef.current.has(milestone)) {
          scrollDepthTrackedRef.current.add(milestone);
          const event = eventMap[milestone as keyof typeof eventMap];
          if (event) {
            trackClick(event, {
              scroll_depth: milestone,
              timestamp: Date.now(),
            })();
          }
        }
      });

      // Check if in last section
      const sections = scrollContainer.querySelectorAll("section");
      if (sections.length > 0) {
        const lastSection = sections[sections.length - 1] as HTMLElement;
        const lastSectionTop = lastSection.offsetTop;
        const viewportHeight = window.innerHeight;
        const isInLast = currentScrollTop >= lastSectionTop - viewportHeight / 2;
        setIsInLastSection(isInLast);
      }
    };

    (scrollContainer as HTMLElement).addEventListener("scroll", handleScroll, { passive: true });

    // Check initial position
    handleScroll();

    return () => {
      (scrollContainer as HTMLElement).removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Track section views using Intersection Observer
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const viewedSections = new Set<string>(); // Track which sections have been viewed

    // Map section IDs to analytics events
    const sectionEventMap: Record<string, string> = {
      chart: ANALYTICS_EVENTS.LANDING.CHART_SECTION_VIEW,
      values_properties: ANALYTICS_EVENTS.LANDING.SECONDARY_CTA_SECTION_VIEW,
      stats: ANALYTICS_EVENTS.LANDING.STATS_SECTION_VIEW,
      bug_bounty: ANALYTICS_EVENTS.LANDING.BUG_BOUNTY_SECTION_VIEW,
      resources: ANALYTICS_EVENTS.LANDING.RESOURCES_SECTION_VIEW,
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const sectionId = entry.target.id;
          const analyticsEvent = sectionEventMap[sectionId];

          // Track when section becomes visible (50% threshold) and hasn't been tracked yet
          if (entry.isIntersecting && analyticsEvent && !viewedSections.has(sectionId)) {
            viewedSections.add(sectionId);
            // Track section view with context
            trackClick(analyticsEvent, {
              section: sectionId,
              view_time: Date.now(),
            })();
          }
        });
      },
      {
        root: scrollContainer,
        threshold: 0.5, // Trigger when 50% of section is visible
        rootMargin: "-10% 0px -10% 0px", // Add some margin to be more precise
      },
    );

    // Observe all sections
    const sections = scrollContainer.querySelectorAll("section[id]");
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
      observer.disconnect();
    };
  }, []);

  const handleArrowClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const sections = scrollContainer.querySelectorAll("section");
    if (sections.length === 0) return;

    const currentScrollTop = scrollContainer.scrollTop;
    const viewportHeight = window.innerHeight;

    // Find current section
    let currentSectionIndex = 0;
    let currentSectionId = "";
    sections.forEach((section, index) => {
      const sectionTop = (section as HTMLElement).offsetTop;
      if (currentScrollTop >= sectionTop - viewportHeight / 10) {
        currentSectionIndex = index;
        currentSectionId = (section as HTMLElement).id || `section-${index}`;
      }
    });

    // Get next section
    const nextSectionIndex = Math.min(currentSectionIndex + 1, sections.length - 1);
    const nextSection = sections[nextSectionIndex] as HTMLElement;
    const nextSectionId = nextSection?.id || `section-${nextSectionIndex}`;

    // Track the scroll arrow click with section context
    trackClick(ANALYTICS_EVENTS.LANDING.SCROLL_ARROW_CLICK, {
      current_section: currentSectionId,
      target_section: nextSectionId,
      scroll_direction: "down",
      action_type: "navigation",
    })(e);

    if (nextSection) {
      let targetScrollTop = nextSection.offsetTop;

      // Special mobile handling for stats section
      if (isMobile && nextSectionId === "stats") {
        const upgradesButton = document.getElementById("upgradesButton");

        if (upgradesButton) {
          const containerRect = scrollContainer.getBoundingClientRect();
          const upgradesRect = upgradesButton.getBoundingClientRect();

          const offset = 70; // Fixed offset for mobile stats section

          // Calculate position relative to the scroll container
          const upgradesRelativeTop = upgradesRect.top - containerRect.top;
          const currentScrollTop = scrollContainer.scrollTop;
          targetScrollTop = currentScrollTop + upgradesRelativeTop - offset;
        }
      } else {
        // Default behavior for other sections
        if (nextSectionIndex !== sections.length - 1) {
          const topCtaSpace = viewportHeight * 0.02;
          const ctaOffset = topCtaSpace;
          targetScrollTop = targetScrollTop - ctaOffset;
        }
      }

      scrollContainer.scrollTo({
        top: targetScrollTop,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="w-full place-self-center relative">
      <div
        id={"scrollContainer"}
        className={`flex flex-col items-center h-[100dvh] overflow-y-auto overflow-x-clip scrollbar-none`}
        data-scroll-container="true"
        ref={scrollContainerRef}
      >
        {/* Header Logo and Text - static, above everything */}
        <div className="flex flex-col gap-2 sm:gap-4 self-stretch items-center pt-[5dvh] sm:pt-[10dvh] 3xl:pt-[6dvh] min-[2130px]:pt-[8dvh] min-[2400px]:pt-[10dvh]">
          <motion.h2
            className="text-[4rem] leading-[1.1] font-thin text-black"
            initial={{ opacity: 0, transform: "translateY(20px)" }}
            animate={{ opacity: 1, transform: "translateY(0px)" }}
            transition={{ duration: 0.5, ease: "easeInOut", delay: 0.2 }}
          >
            <div className="flex flex-row gap-4 items-center">
              <img src={PintoLogo} alt="Pinto Logo" className="h-14 sm:h-20" />
              <img src={PintoLogoText} alt="Pinto Logo" className="h-14 sm:h-20" />
            </div>
          </motion.h2>
          <motion.span
            className="text-[1.25rem] sm:text-2xl font-thin text-pinto-gray-4 min-w-[20rem] max-sm:max-w-[20rem] w-[70%] sm:w-fit text-center"
            initial={{ opacity: 0, transform: "translateY(20px)" }}
            animate={{ opacity: 1, transform: "translateY(0px)" }}
            transition={{ duration: 0.5, ease: "easeInOut", delay: 0.4 }}
          >
            An Algorithmic Stablecoin Balanced by Farmers Like You.
          </motion.span>
        </div>
        {/* Sticky CTA Button - below header, outside scroll container */}
        <motion.div
          id="landing-cta"
          className="flex flex-col sm:flex-row gap-4 mx-auto items-center sticky top-4 mt-2 sm:mt-4 mb-4 sm:mb-10 place-self-center z-50 justify-center"
          initial={{ opacity: 0, transform: "translateY(20px)" }}
          animate={{ opacity: 1, transform: "translateY(0px)" }}
          transition={{ duration: 0.5, ease: "easeInOut", delay: 0.6 }}
        >
          <Link to={navLinks.overview}>
            <Button
              rounded="full"
              size={isMobile ? "lg" : "xxl"}
              className="hover:bg-pinto-green-4 max-sm:px-4 hover:brightness-125 [transition:filter_0.3s_ease] flex flex-row gap-2 items-center relative overflow-hidden !font-[340] !tracking-[-0.025rem]"
              id={"come-seed-the-trustless-economy"}
              shimmer
              glow
              onClick={(e) => {
                // Determine current section
                const scrollContainer = scrollContainerRef.current;
                let currentSectionId = "chart"; // Default if no scroll container

                if (scrollContainer) {
                  const sections = scrollContainer.querySelectorAll("section");
                  const currentScrollTop = scrollContainer.scrollTop;
                  const viewportHeight = window.innerHeight;

                  // Find current section
                  sections.forEach((section) => {
                    const sectionTop = (section as HTMLElement).offsetTop;
                    if (currentScrollTop >= sectionTop - viewportHeight / 10) {
                      currentSectionId = (section as HTMLElement).id || currentSectionId;
                    }
                  });
                }

                // Track with current section context
                trackClick(ANALYTICS_EVENTS.LANDING.MAIN_CTA_CLICK, {
                  button_text: "Come Seed the Leviathan Free Economy",
                  destination: navLinks.overview,
                  current_section: currentSectionId,
                })(e);
              }}
            >
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-pinto-green-2/50 to-transparent" />
              <span className="relative z-10">Come Seed the Leviathan Free Economy</span>
              <div className="relative z-10" style={{ isolation: "isolate" }}>
                <PintoRightArrow width={isMobile ? "1rem" : "1.25rem"} height={isMobile ? "1rem" : "1.25rem"} />
              </div>
            </Button>
          </Link>
        </motion.div>
        <section
          id="chart"
          className="flex flex-col overflow-clip place-content-center min-h-[calc(100dvh-250px)] sm:min-h-[calc(100dvh-300px)] w-full bg-[linear-gradient(180deg,transparent_-0.11%,#ECF7ED_49.41%,transparent_99.89%)]"
        >
          <div className="sm:max-w-[1920px] w-full mx-auto min-h-[calc(100dvh-250px)] sm:min-h-[calc(100dvh-300px)] overflow-clip">
            <LandingChart />
          </div>
        </section>
        <section
          id="values_properties"
          className="flex flex-col overflow-clip place-content-center gap-4 min-h-[64rem] sm:w-full sm:min-h-[max(1024px,100vh)] bg-[linear-gradient(180deg,transparent_-0.11%,#ECF7ED_49.41%,transparent_99.89%)]"
        >
          <SecondaryCTA />
        </section>
        <section
          id="stats"
          className="flex flex-col overflow-clip place-content-center sm:w-full min-h-[50rem] sm:min-h-[max(800px,100vh)] bg-[linear-gradient(180deg,transparent_-0.11%,#ECF7ED_49.41%,transparent_99.89%)]"
        >
          <ProjectStats />
        </section>
        <section
          id="bug_bounty"
          className="flex flex-col overflow-clip place-content-center sm:w-full min-h-[34rem] sm:min-h-[54rem] bg-[linear-gradient(180deg,transparent_-0.11%,#D8F1E2_49.41%,transparent_99.89%)]"
        >
          <BugBounty />
        </section>
        <section
          id="resources"
          className="flex flex-col overflow-clip place-content-center h-auto min-h-[116rem] -mb-[5rem] sm:mb-0 w-full sm:min-h-[90dvh] bg-[linear-gradient(180deg,transparent_-0.11%,#D8F1E2_49.41%,transparent_99.89%)]"
        >
          <Resources />
        </section>
        <div className="flex-1 w-full">
          <Footer landingPageVersion />
        </div>
      </div>
      <div
        className={`fixed left-1/2 -translate-x-1/2 flex z-20 justify-center ${
          !isInLastSection ? "bottom-[1vh] sm:bottom-[2vh]" : "-bottom-28"
        } transition-all duration-500 ease-in-out pointer-events-none`}
        onClick={handleArrowClick}
      >
        <Button
          rounded="full"
          size={"md"}
          className={`z-20 h-8 sm:px-2 sm:scale-[1.5] hover:bg-pinto-green-4 hover:brightness-125 transition-all [transition:transform_300ms_cubic-bezier(0.4,0,0.2,1)] ease-in-out flex flex-row gap-2 items-center relative overflow-hidden !font-[340] !tracking-[-0.025rem] pointer-events-auto`}
          shimmer={true}
          glow={true}
        >
          <div className="rotate-90">
            <PintoRightArrow width={"1rem"} height={"1rem"} className="transition-all" />
          </div>
        </Button>
      </div>
    </div>
  );
}
