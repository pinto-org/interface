import { Link as ReactLink, useLocation, useParams } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/NavigationMenu";

const Link = ({ href, ...props }) => {
  const { mode, plotId } = useParams();
  const location = useLocation();
  const isActive = href === "/market/buy" && !mode && !plotId ? true : href === location.pathname;

  return (
    <NavigationMenuLink asChild active={isActive}>
      <ReactLink to={href} className={navigationMenuTriggerStyle()} {...props} />
    </NavigationMenuLink>
  );
};

function ModeSelect() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href="/market/buy">Buy</Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/market/sell">Sell</Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export default ModeSelect;
