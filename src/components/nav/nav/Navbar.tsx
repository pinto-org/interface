import { cn } from "@/utils/utils";
import clsx from "clsx";
import { useState } from "react";
import WalletButton from "../../WalletButton";
import Backdrop from "../../ui/Backdrop";
import PriceButton from "../PriceButton";
import SeasonsButton from "../SeasonsButton";
import Navi from "./Navi.desktop";
import MobileNavi from "./Navi.mobile";

type Panel = "price" | "seasons" | "wallet" | "mobile-navi";

const DURATION = 150;

const Navbar = () => {
  const [openPanel, setOpenPanel] = useState<Panel | undefined>();
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [backdropMounted, setBackdropMounted] = useState(true);

  const priceOpen = openPanel === "price";
  const seasonsOpen = openPanel === "seasons";
  const walletOpen = openPanel === "wallet";
  const mobileNaviOpen = openPanel === "mobile-navi";

  const closePanel = () => {
    setOpenBackdrop(false);
    setOpenPanel(undefined);
  };

  const togglePanel = (panel: Panel) => {
    if (openPanel === panel) {
      closePanel();
    } else {
      setBackdropMounted(true);
      setOpenBackdrop(true);
      setOpenPanel(panel);
    }
  };

  return (
    <>
      <div
        className={cn(
          "fixed grid px-4 pt-4 pb-2 sm:px-6 sm:pt-6 w-full z-[2] bg-gradient-light",
          styles.navGrid
        )}
      >
        <div className="flex flex-row gap-2 sm:gap-4">
          <div
            className={`transition-all duration-100 ${priceOpen && "z-[51]"}`}
          >
            <PriceButton
              isOpen={priceOpen}
              togglePanel={() => togglePanel("price")}
            />
          </div>
          <div
            className={`transition-all duration-100 ${seasonsOpen && "z-[51]"}`}
          >
            <SeasonsButton
              isOpen={seasonsOpen}
              togglePanel={() => togglePanel("seasons")}
            />
          </div>
        </div>
        <div className="hidden lg:flex lg:justify-center">
          <Navi />
        </div>
        <div className={`flex flex-row justify-end gap-2`}>
          <div className={`${walletOpen && "z-[51]"}`}>
            <WalletButton
              isOpen={walletOpen}
              togglePanel={() => togglePanel("wallet")}
            />
          </div>
          <div className={`lg:hidden ${mobileNaviOpen && "z-[51]"}`}>
            <MobileNavi
              isOpen={mobileNaviOpen}
              togglePanel={() => togglePanel("mobile-navi")}
              close={closePanel}
              mounted={backdropMounted}
              unmount={() => setBackdropMounted(false)}
            />
          </div>
        </div>
        <div className="hidden sm:block">
          <Backdrop
            active={openBackdrop}
            onClick={closePanel}
            transitionDuration={DURATION}
          />
        </div>
      </div>
    </>
  );
};

export default Navbar;

const styles = {
  navGrid: clsx(
    "grid-cols-[220px_1fr] sm:grid-cols-[350px_1fr] lg:grid-cols-[350px_1fr_200px] grid-rows-1"
  ),
} as const;

export const navLinks = {
  landing: "/",
  overview: "/overview",
  silo: "/silo",
  field: "/field",
  market: "/market",
  explorer: "/explorer",
  whitepaper: "https://link.to.pinto/whitepaper.pdf",
  docs: "https://link.to.pinto/docs",
  discord: "https://link.to.pinto/pintocord",
  github: "https://link.to.pinto/github",
  disclosures: "https://link.to.pinto/disclosures",
  bugbounty: "https://link.to.pinto/bugbounty",
  exchange: "https://pinto.exchange/",
  pipeline: "https://evmpipeline.org/",
} as const;
