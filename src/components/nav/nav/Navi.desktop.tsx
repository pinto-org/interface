import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/NavigationMenu";
import { isDev } from "@/utils/utils";
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
  const topMenuCheck = href ? location.pathname.includes(href?.substring(1)) : false;
  const bottomMenuCheck = href ? location.pathname.startsWith(href) : false;
  const isActive = active || (href === "/" ? href === location.pathname : topMenu ? topMenuCheck : bottomMenuCheck);

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

export default function Navi() {
  return (
    <div className="flex items-center justify-center z-[2]">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link href={navLinks.overview} topMenu>
              Overview
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href={navLinks.silo} topMenu>
              Silo
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href={navLinks.field} topMenu>
              Field
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href={navLinks.explorer} topMenu>
              Weather Station
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href={navLinks.docs} rel="noopener noreferrer" target="_blank" topMenu>
              Library
            </Link>
          </NavigationMenuItem>
          {isDev() && (
            <NavigationMenuItem>
              <Link href="/dev" topMenu>
                Dev
              </Link>
            </NavigationMenuItem>
          )}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
