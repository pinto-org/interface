import { Link as ReactLink, useLocation } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "./ui/NavigationMenu";
import { useState } from "react";

const Link = ({ href, active, topMenu, className, ...props }: { href?: string, active?: boolean, topMenu?: boolean, className?: string, [x: string]: any }) => {
  const location = useLocation();
  const isActive = active || (href === "/" ? href === location.pathname : href ? location.pathname.includes(href?.substring(1)) : false);

  if (href) {
    return (
      <NavigationMenuLink asChild active={isActive} className={`${className} ${topMenu ? `text-[1.5rem] data-[active]:text-black` : `text-[1.25rem]`} font-[400] hover:cursor-pointer`}>
        <ReactLink to={href} className={navigationMenuTriggerStyle()} {...props} />
      </NavigationMenuLink>
    )
  };

  return (
    <NavigationMenuLink asChild active={isActive} className={`${className} ${topMenu ? `text-[1.5rem] data-[active]:text-black` : `text-[1.25rem]`} font-[400] hover:cursor-pointer`}>
      <div className={navigationMenuTriggerStyle()} {...props} />
    </NavigationMenuLink>
  );
};

const AppNavi = () => {
  return (    
    <NavigationMenu>
<NavigationMenuList>
  <NavigationMenuItem>
    <Link href="/">Overview</Link>
  </NavigationMenuItem>
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
    <Link href="/explorer">Explorer</Link>
  </NavigationMenuItem>
</NavigationMenuList>
</NavigationMenu>
  )
}

const DocNavi = () => {
  return (    
    <NavigationMenu>
<NavigationMenuList>
  <NavigationMenuItem>
    <Link href="https://link.to.pinto/whitepaper.pdf">Whitepaper</Link>
  </NavigationMenuItem>
  <NavigationMenuItem>
    <Link href="https://link.to.pinto/docs">Documentation</Link>
  </NavigationMenuItem>
</NavigationMenuList>
</NavigationMenu>
  )
}

const MoreNavi = () => {
  return (    
    <NavigationMenu>
    <NavigationMenuList>
      <NavigationMenuItem>
        <Link href="https://link.to.pinto/pintocord">Discord</Link>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <Link href="https://link.to.pinto/github">Github</Link>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <Link href="https://link.to.pinto/disclosures">Disclosures</Link>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <Link href="https://link.to.pinto/bugbounty">Bug Bounty Program</Link>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <Link href="https://basin.exchange/">Basin</Link>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <Link href="https://evmpipeline.org/">Pipeline</Link>
      </NavigationMenuItem>
    </NavigationMenuList>
    </NavigationMenu>
      )
}

export default function Navi() {
  
  const [naviTab, setNaviTab] = useState<string | undefined>('app');

  return (
    <div className="flex flex-col items-center justify-center gap-5" onMouseLeave={() => setNaviTab('app')}>
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href="/lmao" topMenu>Home</Link>
        </NavigationMenuItem>
        <NavigationMenuItem onMouseEnter={() => setNaviTab('app')}>
          <Link active={naviTab === 'app'} topMenu>App</Link>
        </NavigationMenuItem>
        <NavigationMenuItem onMouseEnter={() => setNaviTab('docs')}>
          <Link active={naviTab === 'docs'} topMenu>Documentation</Link>
        </NavigationMenuItem>
        <NavigationMenuItem onMouseEnter={() => setNaviTab('more')}>
          <Link active={naviTab === 'more'} topMenu>More</Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
    {naviTab === 'app' &&
      <AppNavi />
    }
    {naviTab === 'docs' &&
      <DocNavi />
    }
    {naviTab === 'more' && 
      <MoreNavi />
    }
    </div>
  );
}
