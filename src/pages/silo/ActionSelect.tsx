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
  const isActive = href === "?action=deposit" && !location.search ? true : href === location.search;

  return (
    <NavigationMenuLink asChild active={isActive}>
      <ReactLink to={href} className={navigationMenuTriggerStyle()} {...props} />
    </NavigationMenuLink>
  );
};

function ActionSelect() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href="?action=deposit">Deposit</Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="?action=convert">Convert</Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="?action=transfer">Transfer</Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="?action=withdraw">Withdraw</Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export default ActionSelect;
