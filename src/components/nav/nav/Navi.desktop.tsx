import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/NavigationMenu";
import { ANALYTICS_EVENTS } from "@/constants/analytics-events";
import { trackClick } from "@/utils/analytics";
import { stringEq } from "@/utils/string";
import { isDev } from "@/utils/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useRef, useState } from "react";
import { Link as ReactLink, useLocation, useMatch } from "react-router-dom";
import { navLinks, navPathNameToTopMenu } from "./Navbar";

const Link = ({
  topMenuSlug = "home",
  href,
  active,
  topMenu,
  className,
  ...props
}: {
  topMenuSlug?: string;
  href?: string;
  active?: boolean;
  topMenu?: boolean;
  className?: string;
  [x: string]: any;
}) => {
  const location = useLocation();
  const pathSlug = location.pathname.split("/")?.[1];

  const bottomMenuCheck = href ? location.pathname.startsWith(href) : false;

  const getIsActive = () => {
    if (topMenu && href) {
      return stringEq(topMenuSlug, navPathNameToTopMenu[pathSlug]) || active;
    }

    if (href) {
      return active || (href === "/" ? href === location.pathname : bottomMenuCheck);
    }
  };

  const isActive = getIsActive();

  if (href) {
    return (
      <NavigationMenuLink
        asChild
        active={isActive}
        className={`${className} ${topMenu ? `text-[1.5rem] data-[active]:text-black` : `text-[1.25rem] data-[active]:text-pinto-green-4`} font-[400] hover:cursor-pointer`}
      >
        <ReactLink to={href} className={navigationMenuTriggerStyle()} {...props} />
      </NavigationMenuLink>
    );
  }

  return (
    <NavigationMenuLink
      asChild
      active={isActive}
      className={`${className} ${topMenu ? `text-[1.5rem] data-[active]:text-black` : `text-[1.25rem]`} font-[400] hover:cursor-pointer`}
    >
      <div className={navigationMenuTriggerStyle()} {...props} />
    </NavigationMenuLink>
  );
};

const AppNavi = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className="pt-2"
    >
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link href={navLinks.overview} onClick={trackClick(ANALYTICS_EVENTS.NAVIGATION.MAIN_OVERVIEW_CLICK)}>
              Overview
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href={navLinks.silo} onClick={trackClick(ANALYTICS_EVENTS.NAVIGATION.MAIN_SILO_CLICK)}>
              Silo
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href={navLinks.field} onClick={trackClick(ANALYTICS_EVENTS.NAVIGATION.MAIN_FIELD_CLICK)}>
              Field
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href={navLinks.swap} onClick={trackClick(ANALYTICS_EVENTS.NAVIGATION.MAIN_SWAP_CLICK)}>
              Swap
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href={navLinks.podmarket} onClick={trackClick(ANALYTICS_EVENTS.NAVIGATION.MAIN_PODMARKET_CLICK)}>
              Pod Market
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href={navLinks.sPinto} onClick={trackClick(ANALYTICS_EVENTS.NAVIGATION.MAIN_SPINTO_CLICK)}>
              sPinto
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href={navLinks.collection} onClick={trackClick(ANALYTICS_EVENTS.NAVIGATION.MAIN_COLLECTION_CLICK)}>
              Collection
            </Link>
          </NavigationMenuItem>
          {isDev() && (
            <NavigationMenuItem>
              <Link href="/dev">Dev</Link>
            </NavigationMenuItem>
          )}
        </NavigationMenuList>
      </NavigationMenu>
    </motion.div>
  );
};

const DataNavi = ({ setNaviTab }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className="pt-2"
    >
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link href={navLinks.explorer_pinto} onClick={trackClick(ANALYTICS_EVENTS.NAVIGATION.EXPLORER_PINTO_CLICK)}>
              Pinto
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href={navLinks.explorer_silo} onClick={trackClick(ANALYTICS_EVENTS.NAVIGATION.EXPLORER_SILO_CLICK)}>
              Silo
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href={navLinks.explorer_field} onClick={trackClick(ANALYTICS_EVENTS.NAVIGATION.EXPLORER_FIELD_CLICK)}>
              Field
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link
              href={navLinks.explorer_seasons}
              onClick={trackClick(ANALYTICS_EVENTS.NAVIGATION.EXPLORER_SEASONS_CLICK)}
            >
              Seasons
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link
              href={navLinks.explorer_tractor}
              onClick={trackClick(ANALYTICS_EVENTS.NAVIGATION.EXPLORER_TRACTOR_CLICK)}
            >
              Tractor
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link
              href={navLinks.explorer_farmer}
              onClick={trackClick(ANALYTICS_EVENTS.NAVIGATION.EXPLORER_FARMER_CLICK)}
            >
              My Silo
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href={navLinks.explorer_all} onClick={trackClick(ANALYTICS_EVENTS.NAVIGATION.EXPLORER_ALL_CLICK)}>
              All
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </motion.div>
  );
};

const LearnNavi = ({ setNaviTab }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className="pt-2"
    >
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link
              href={navLinks.docs}
              rel="noopener noreferrer"
              target="_blank"
              onClick={trackClick(ANALYTICS_EVENTS.NAVIGATION.LEARN_DOCS_CLICK, {
                link_type: "external",
                link_url: navLinks.docs,
              })}
            >
              Docs
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link
              href={navLinks.blog}
              rel="noopener noreferrer"
              target="_blank"
              onClick={trackClick(ANALYTICS_EVENTS.NAVIGATION.LEARN_BLOG_CLICK, {
                link_type: "external",
                link_url: navLinks.blog,
              })}
            >
              Blog
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link
              href={navLinks.communityBlog}
              rel="noopener noreferrer"
              target="_blank"
              onClick={trackClick(ANALYTICS_EVENTS.NAVIGATION.LEARN_COMMUNITY_BLOG_CLICK, {
                link_type: "external",
                link_url: navLinks.communityBlog,
              })}
            >
              Community Blog
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link
              href={navLinks.whitepaper}
              rel="noopener noreferrer"
              target="_blank"
              onClick={trackClick(ANALYTICS_EVENTS.NAVIGATION.LEARN_WHITEPAPER_CLICK, {
                link_type: "external",
                link_url: navLinks.whitepaper,
              })}
            >
              Whitepaper
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </motion.div>
  );
};

export default function Navi() {
  const [naviTab, setNaviTab] = useState("home");
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = useCallback((tab: string) => {
    // Clear any existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    // Set timeout for 100ms before activating sub-nav
    hoverTimeoutRef.current = setTimeout(() => {
      setNaviTab(tab);
    }, 100);
  }, []);

  const handleMouseLeave = useCallback(() => {
    // Cancel the timeout if user moves away before 100ms
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-2 z-[2]">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem onMouseEnter={() => handleMouseEnter("home")} onMouseLeave={handleMouseLeave}>
            <Link
              href={navLinks.overview}
              topMenu
              topMenuSlug="home"
              onClick={trackClick(ANALYTICS_EVENTS.NAVIGATION.HEADER_HOME_CLICK)}
            >
              Home
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem onMouseEnter={() => handleMouseEnter("learn")} onMouseLeave={handleMouseLeave}>
            <Link
              active={naviTab === "learn"}
              topMenu
              topMenuSlug="learn"
              onClick={trackClick(ANALYTICS_EVENTS.NAVIGATION.HEADER_LEARN_CLICK)}
            >
              Learn
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem onMouseEnter={() => handleMouseEnter("data")} onMouseLeave={handleMouseLeave}>
            <Link
              active={naviTab === "data"}
              href={navLinks.explorer}
              topMenu
              topMenuSlug="data"
              onClick={trackClick(ANALYTICS_EVENTS.NAVIGATION.HEADER_DATA_CLICK)}
            >
              Data
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <div className="h-[3.75rem]">
        <AnimatePresence mode="wait">
          {naviTab === "home" && <AppNavi />}
          {naviTab === "data" && <DataNavi setNaviTab={setNaviTab} />}
          {naviTab === "learn" && <LearnNavi setNaviTab={setNaviTab} />}
        </AnimatePresence>
      </div>
    </div>
  );
}
