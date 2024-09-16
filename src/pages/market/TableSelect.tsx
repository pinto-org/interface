import { Link as ReactLink, useLocation } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/NavigationMenu";

const Link = ({ href, ...props }) => {
  const location = useLocation();
  const isActive = href === "?view=listings" && !location.search ? true : href === location.search;

  return (
    <NavigationMenuLink asChild active={isActive}>
      <ReactLink to={href} className={navigationMenuTriggerStyle()} {...props} />
    </NavigationMenuLink>
  );
};

function TableSelect() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href="?view=listings">Listings</Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="?view=orders">Orders</Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="?view=activity">Your Activity</Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export default TableSelect;
