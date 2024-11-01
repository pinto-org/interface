import { useEffect, useState } from "react";

import { ChevronDownIcon, ChevronUpIcon, Cross2Icon } from "@radix-ui/react-icons";
import { Link as ReactLink } from "react-router-dom";

import { BurgerIcon } from "@/components/Icons";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import IconImage from "@/components/ui/IconImage";
import { Sidebar } from "@/components/ui/Panel";
import Text from "@/components/ui/Text";
import useIsMobile from "@/hooks/display/useIsMobile";
import useIsTablet from "@/hooks/display/useIsTablet";
import { FontVariant } from "@/utils/theme";
import { cn } from "@/utils/utils";
import { navLinks } from "./Navbar";

interface IMobileNavTrigger {
  isOpen: boolean;
  togglePanel: () => void;
}

const MobileNavTrigger = ({ isOpen, togglePanel }: IMobileNavTrigger) => {
  return (
    <Button
      variant="outline-secondary"
      noShrink
      rounded="full"
      className={`p-0 sm:p-0 w-10 h-10 hover:border-pinto-green ${isOpen && "transition-border duration-100 sm:border-pinto-green"}`}
      onClick={togglePanel}
    >
      <BurgerIcon size={6} />
    </Button>
  );
};

interface IMobileNavi extends IMobileNavTrigger {
  mounted: boolean;
  close: () => void;
  unmount?: () => void;
}

const MobileNavi = ({ isOpen, mounted, close, unmount, togglePanel }: IMobileNavi) => {
  const [isDocsOpen, setDocsOpen] = useState(false);
  const [isMoreOpen, setMoreOpen] = useState(false);

  const isTablet = useIsTablet();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isTablet && isOpen) {
      setDocsOpen(false);
      setMoreOpen(false);
      close();
    }
  }, [isTablet, isOpen]);

  const showMobile = isMobile && mounted;
  const showTablet = isTablet && !isMobile && mounted;

  return (
    <>
      {<MobileNavTrigger isOpen={isOpen} togglePanel={togglePanel} />}
      {showTablet ? (
        <Card
          className={`fixed top-[5rem] flex flex-col w-[24rem] overflow-clip h-[calc(100vh-6rem)] bg-white/100 z-[51] transition-all ${isOpen ? "right-[1.5rem]" : "-right-[38rem]"}`}
        >
          <div className="overflow-y-auto">
            <MobileNavContent
              docsOpen={isDocsOpen}
              moreOpen={isMoreOpen}
              setDocsOpen={setDocsOpen}
              setMoreOpen={setMoreOpen}
              unmount={unmount}
              close={close}
            />
          </div>
        </Card>
      ) : null}
      {showMobile && isOpen ? (
        <div className="fixed left-0 top-0 w-full h-full bg-white/100 ">
          <div className="flex flex-col w-screen h-screen bg-pinto-mobile-navi overflow-y-auto">
            <MobileNavContent
              docsOpen={isDocsOpen}
              moreOpen={isMoreOpen}
              setDocsOpen={setDocsOpen}
              setMoreOpen={setMoreOpen}
              unmount={unmount}
              close={close}
            />
          </div>
        </div>
      ) : null}
    </>
  );
};

export default MobileNavi;

interface IMobileNavContent {
  docsOpen: boolean;
  moreOpen: boolean;
  setDocsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setMoreOpen: React.Dispatch<React.SetStateAction<boolean>>;
  unmount?: () => void;
  close: () => void;
}

function MobileNavContent({ docsOpen, moreOpen, setDocsOpen, setMoreOpen, unmount, close }: IMobileNavContent) {
  const isMobile = useIsMobile();

  const unmountAndClose = () => {
    close();
    setDocsOpen(false);
    setMoreOpen(false);
    unmount?.();
  };

  return (
    <div className={`relative flex flex-col w-full`}>
      <div onClick={close} className="fixed sm:absolute top-4 right-4 cursor-pointer">
        <IconImage size={6} src={Cross2Icon} />
      </div>
      <div className={`flex flex-col gap-8 py-8 ${isMobile ? "justify-center" : "justify-start"}`}>
        <div className="flex flex-col gap-6 pl-4">
          <MobileNavLink href="/" onClick={close}>
            About
          </MobileNavLink>
          <MobileNavLink href={navLinks.overview} onClick={unmountAndClose}>
            Overview
          </MobileNavLink>
          <MobileNavLink href={navLinks.silo} onClick={unmountAndClose}>
            Silo
          </MobileNavLink>
          <MobileNavLink href={navLinks.field} onClick={unmountAndClose}>
            Field
          </MobileNavLink>
          <MobileNavLink href={navLinks.market} onClick={unmountAndClose}>
            Market
          </MobileNavLink>
          <MobileNavLink href={navLinks.explorer} onClick={unmountAndClose}>
            Explorer
          </MobileNavLink>
        </div>
        <hr className=" border-pinto-gray-2" />
        <div className="flex flex-col gap-6 pl-4">
          <MobileNavLink
            noHover
            className="flex flex-row gap-2 items-center w-full cursor-pointer"
            onClick={() =>
              setDocsOpen((prev) => {
                setMoreOpen(false);
                return !prev;
              })
            }
          >
            Docs
            <div className="mt-[4px]">
              <IconImage size={6} src={docsOpen ? ChevronUpIcon : ChevronDownIcon} />
            </div>
          </MobileNavLink>
          {docsOpen ? (
            <div className="flex flex-col gap-6  pl-4">
              <MobileNavLink variant="h4" nested href={navLinks.whitepaper} onClick={unmount}>
                Whitepaper
              </MobileNavLink>
              <MobileNavLink variant="h4" nested href={navLinks.docs} onClick={unmount}>
                GitBook
              </MobileNavLink>
            </div>
          ) : null}
          <MobileNavLink
            noHover
            className="flex flex-row gap-2 items-center w-full"
            onClick={() =>
              setMoreOpen((prev) => {
                setDocsOpen(false);
                return !prev;
              })
            }
          >
            More
            <div className="mt-[4px]">
              <IconImage size={6} src={moreOpen ? ChevronUpIcon : ChevronDownIcon} />
            </div>
          </MobileNavLink>
          {moreOpen ? (
            <div className="flex flex-col gap-6  pl-4">
              <MobileNavLink variant="h4" nested href={navLinks.discord} onClick={unmount}>
                Discord
              </MobileNavLink>
              <MobileNavLink variant="h4" nested href={navLinks.github} onClick={unmount}>
                GitHub
              </MobileNavLink>
              <MobileNavLink variant="h4" nested href={navLinks.disclosures} onClick={unmount}>
                Disclosures
              </MobileNavLink>
              <MobileNavLink variant="h4" nested href={navLinks.bugbounty} onClick={unmount}>
                Bug Bounty
              </MobileNavLink>
              <MobileNavLink variant="h4" nested href={navLinks.exchange} onClick={unmount}>
                Pinto Exchange
              </MobileNavLink>
              <MobileNavLink variant="h4" nested href={navLinks.pipeline} onClick={unmount}>
                Pipeline
              </MobileNavLink>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

const MobileNavLink = ({
  href,
  variant = "h3",
  nested = false,
  noHover = false,
  children,
  className,
  onClick,
}: {
  href?: string;
  variant?: FontVariant;
  nested?: boolean;
  noHover?: boolean;
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}) => {
  return (
    <Text
      as={ReactLink}
      to={href ?? ""}
      onClick={onClick}
      variant={variant}
      className={cn(
        `cursor-pointer ${nested ? "text-pinto-gray-5" : "text-black"} ${noHover ? "" : "hover:text-pinto-green-4"}`,
        className,
      )}
    >
      {children}
    </Text>
  );
};
