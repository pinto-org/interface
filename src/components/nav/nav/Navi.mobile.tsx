import { BurgerIcon } from "@/components/Icons";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import IconImage from "@/components/ui/IconImage";
import useIsMobile from "@/hooks/display/useIsMobile";
import useIsTablet from "@/hooks/display/useIsTablet";
import { FontVariant } from "@/utils/theme";
import { cn, isDev } from "@/utils/utils";
import { ChevronDownIcon, ChevronUpIcon, Cross2Icon } from "@radix-ui/react-icons";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link as ReactLink } from "react-router-dom";
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
  const [isLearnOpen, setLearnOpen] = useState(false);
  const [isMoreOpen, setMoreOpen] = useState(false);

  const isTablet = useIsTablet();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isTablet && isOpen) {
      setLearnOpen(false);
      setMoreOpen(false);
      close();
    }
  }, [isTablet, isOpen]);

  const showMobile = isMobile && mounted;
  const showTablet = isTablet && !isMobile && mounted;

  return (
    <>
      {<MobileNavTrigger isOpen={isOpen} togglePanel={togglePanel} />}
      <AnimatePresence>
        {showTablet ? (
          <Card
            className={`fixed top-[5rem] flex flex-col w-[24rem] overflow-clip h-[calc(100vh-6rem)] bg-white/100 z-[51] transition-all ${isOpen ? "right-[1.5rem]" : "-right-[38rem]"}`}
          >
            <div className="overflow-y-auto">
              <MobileNavContent
                learnOpen={isLearnOpen}
                moreOpen={isMoreOpen}
                setLearnOpen={setLearnOpen}
                setMoreOpen={setMoreOpen}
                unmount={unmount}
                close={close}
              />
            </div>
          </Card>
        ) : null}
        {showMobile && isOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed left-0 top-0 w-full h-full bg-white/100"
          >
            {" "}
            <div className="flex flex-col w-screen h-screen bg-pinto-mobile-navi overflow-y-auto">
              <MobileNavContent
                learnOpen={isLearnOpen}
                moreOpen={isMoreOpen}
                setLearnOpen={setLearnOpen}
                setMoreOpen={setMoreOpen}
                unmount={unmount}
                close={close}
              />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
};

export default MobileNavi;

interface IMobileNavContent {
  learnOpen: boolean;
  moreOpen: boolean;
  setLearnOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setMoreOpen: React.Dispatch<React.SetStateAction<boolean>>;
  unmount?: () => void;
  close: () => void;
}

function MobileNavContent({ learnOpen, moreOpen, setLearnOpen, setMoreOpen, unmount, close }: IMobileNavContent) {
  const isMobile = useIsMobile();

  const unmountAndClose = () => {
    close();
    setLearnOpen(false);
    setMoreOpen(false);
    unmount?.();
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? -100 : 100,
      opacity: 0,
    }),
  };

  return (
    <motion.div
      initial="enter"
      animate="center"
      exit="exit"
      variants={variants}
      custom={1}
      transition={{
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      }}
      className={`relative flex flex-col w-full`}
    >
      <div onClick={close} className="fixed sm:absolute top-4 right-4 cursor-pointer">
        <IconImage size={6} src={Cross2Icon} />
      </div>
      <div className={`flex flex-col gap-8 py-8 ${isMobile ? "justify-center" : "justify-start"}`}>
        <div className="flex flex-col gap-6 pl-4">
          <MobileNavLink href={navLinks.overview} onClick={unmountAndClose}>
            Overview
          </MobileNavLink>
          <MobileNavLink href={navLinks.silo} onClick={unmountAndClose}>
            Silo
          </MobileNavLink>
          <MobileNavLink href={navLinks.field} onClick={unmountAndClose}>
            Field
          </MobileNavLink>
          <MobileNavLink href={navLinks.swap} onClick={unmountAndClose}>
            Swap
          </MobileNavLink>
          <MobileNavLink href={navLinks.explorer} onClick={unmountAndClose}>
            Data
          </MobileNavLink>
          {/* Mobile not ready yet */}
          {/* <MobileNavLink href={navLinks.podmarket} onClick={unmountAndClose}>
            Pod Market
          </MobileNavLink> */}
          <MobileNavLink href={navLinks.wrap} onClick={unmountAndClose}>
            Wrap
          </MobileNavLink>
        </div>
        <hr className=" border-pinto-gray-2" />
        <div className="flex flex-col gap-6 pl-4">
          <div
            onClick={() =>
              setLearnOpen((prev) => {
                setMoreOpen(false);
                return !prev;
              })
            }
            className="pinto-h3 flex flex-row gap-2 items-center w-full"
          >
            Learn
            <div className="mt-[4px]">
              <IconImage size={6} src={learnOpen ? ChevronUpIcon : ChevronDownIcon} />
            </div>
          </div>
          <AnimatePresence>
            {learnOpen ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-6 pl-4 overflow-hidden"
              >
                <MobileNavLink variant="h4" nested external href={navLinks.docs} onClick={unmountAndClose}>
                  Docs
                </MobileNavLink>
                <MobileNavLink variant="h4" nested external href={navLinks.whitepaper} onClick={unmountAndClose}>
                  Whitepaper
                </MobileNavLink>
              </motion.div>
            ) : null}
          </AnimatePresence>
          <div
            onClick={() =>
              setMoreOpen((prev) => {
                setLearnOpen(false);
                return !prev;
              })
            }
            className="pinto-h3 flex flex-row gap-2 items-center w-full"
          >
            More
            <div className="mt-[4px]">
              <IconImage size={6} src={moreOpen ? ChevronUpIcon : ChevronDownIcon} />
            </div>
          </div>
          <AnimatePresence>
            {moreOpen ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-6 pl-4 overflow-hidden"
              >
                <MobileNavLink variant="h4" nested href="/?fromNav=true" onClick={close}>
                  About
                </MobileNavLink>
                <MobileNavLink variant="h4" nested href={navLinks.blog} onClick={unmountAndClose}>
                  Blog
                </MobileNavLink>
                <MobileNavLink variant="h4" nested href={navLinks.discord} onClick={unmountAndClose}>
                  Discord
                </MobileNavLink>
                <MobileNavLink variant="h4" nested href={navLinks.twitter} onClick={unmountAndClose}>
                  X
                </MobileNavLink>
                <MobileNavLink variant="h4" nested href={navLinks.github} onClick={unmountAndClose}>
                  GitHub
                </MobileNavLink>
                <MobileNavLink variant="h4" nested href={navLinks.disclosures} onClick={unmountAndClose}>
                  Disclosures
                </MobileNavLink>
                <MobileNavLink variant="h4" nested href={navLinks.exchange} onClick={unmountAndClose}>
                  Pinto Exchange
                </MobileNavLink>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

const MobileNavLink = ({
  href,
  external = false,
  variant = "h3",
  nested = false,
  noHover = false,
  children,
  className,
  onClick,
}: {
  href?: string;
  external?: boolean;
  variant?: FontVariant;
  nested?: boolean;
  noHover?: boolean;
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}) => {
  return (
    <ReactLink
      to={href ?? ""}
      onClick={onClick}
      className={cn(
        `cursor-pointer ${nested ? "text-pinto-gray-5" : "text-black"} ${noHover ? "" : "hover:text-pinto-green-4"}`,
        variant === "h4" ? "pinto-h4" : "pinto-h3",
        className,
      )}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
    >
      {children}
    </ReactLink>
  );
};
