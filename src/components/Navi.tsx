import { Link as ReactLink, useLocation } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "./ui/NavigationMenu";

const Link = ({ href, ...props }) => {
  const location = useLocation();
  const isActive = href === location.pathname;

  return (
    <NavigationMenuLink asChild active={isActive}>
      <ReactLink to={href} className={navigationMenuTriggerStyle()} {...props} />
    </NavigationMenuLink>
  );
};

export default function Navi() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href="/silo">Silo</Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/field">Field</Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/market">Market</Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/swap">Swap</Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
