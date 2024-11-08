import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/NavigationMenu";
import { useState } from "react";
import { Link as ReactLink, useLocation } from "react-router-dom";
import { navLinks } from "./Navbar";

const Link = ({
  href,
  active,
  topMenu,
  className,
  ...props
}: {
  href?: string;
  active?: boolean;
  topMenu?: boolean;
  className?: string;
  [x: string]: any;
}) => {
  const location = useLocation();
  const isActive =
    active ||
    (href === "/"
      ? href === location.pathname
      : href
        ? location.pathname.includes(href?.substring(1))
        : false);

  if (href) {
    return (
      <NavigationMenuLink
        asChild
        active={isActive}
        className={`${className} ${topMenu ? `text-[1.5rem] data-[active]:text-black` : `text-[1.25rem]`} font-[400] hover:cursor-pointer`}
      >
        <ReactLink
          to={href}
          className={navigationMenuTriggerStyle()}
          {...props}
        />
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
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href={navLinks.overview}>Overview</Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href={navLinks.silo}>Silo</Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href={navLinks.field}>Field</Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href={navLinks.market}>Market</Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href={navLinks.explorer}>Explorer</Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

const DocNavi = () => {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href={navLinks.whitepaper}>Whitepaper</Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href={navLinks.docs}>Documentation</Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

const MoreNavi = () => {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href={navLinks.discord}>Discord</Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href={navLinks.github}>Github</Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href={navLinks.disclosures}>Disclosures</Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href={navLinks.bugbounty}>Bug Bounty Program</Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href={navLinks.exchange}>Exchange</Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href={navLinks.pipeline}>Pipeline</Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default function Navi() {
  const [naviTab, setNaviTab] = useState<string | undefined>("landing");

  return (
    <div
      className="flex flex-col items-center justify-center gap-5 z-[2]"
      onMouseLeave={() => setNaviTab("landing")}
    >
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link href="/" topMenu>
              About
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem onMouseEnter={() => setNaviTab("app")}>
            <Link active={naviTab === "app"} topMenu>
              App
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem onMouseEnter={() => setNaviTab("docs")}>
            <Link active={naviTab === "docs"} topMenu>
              Documentation
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem onMouseEnter={() => setNaviTab("more")}>
            <Link active={naviTab === "more"} topMenu>
              More
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      {naviTab === "app" && <AppNavi />}
      {naviTab === "docs" && <DocNavi />}
      {naviTab === "more" && <MoreNavi />}
    </div>
  );
}
