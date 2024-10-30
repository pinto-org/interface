import Navi from "./Navi";
import PriceButton from "./nav/PriceButton";
import SeasonsButton from "./nav/SeasonsButton";
import { useState } from "react";
import WalletButton from "./WalletButton";
import { Button } from "./ui/Button";
import { BurgerIcon } from "./Icons";

function Frame() {
  const [priceOpen, setPriceOpen] = useState(false);
  const [seasonsOpen, setSeasonsOpen] = useState(false);
  const [walletOpen, setWalletOpen] = useState(false);
  const [lastOpened, setLastOpened] = useState<"price" | "seasons" | "wallet" | undefined>();

  const backdropActive = priceOpen || seasonsOpen || walletOpen;

  const togglePanel = (panel: "price" | "seasons" | "wallet") => {
    setLastOpened(panel);
    if (panel === "price") {
      setPriceOpen(!priceOpen);
    } else if (panel === "seasons") {
      setSeasonsOpen(!seasonsOpen);
    } else if (panel === "wallet") {
      setWalletOpen(!walletOpen);
    }
  };

  const closePanel = () => {
    setPriceOpen(false);
    setSeasonsOpen(false);
    setWalletOpen(false);
    setLastOpened(undefined);
  };

  return (
    <div className="grid grid-cols-[240px_1fr] sm:grid-cols-[350px_1fr] lg:grid-cols-[350px_1fr_200px] grid-rows-1 p-4 md:p-6 fixed w-full z-[2]">
      <div className="flex flex-row gap-2 shrink-0">
        <div className={`${lastOpened === "seasons" && "z-[51]"}`}>
          <PriceButton isOpen={priceOpen} togglePanel={() => togglePanel("price")} />
        </div>
        <div className={`${lastOpened === "price" && "z-[51]"}`}>
          <SeasonsButton isOpen={seasonsOpen} togglePanel={() => togglePanel("seasons")} />
        </div>
      </div>
      <div className="hidden lg:flex lg:last:min-w-0 lg:justify-center lg:shrink-0">
        <Navi />
      </div>
      <div className={`flex justify-end flex-row gap-2 shrink-0 min-w-0 ${lastOpened === "wallet" && "z-[51]"}`}>
        <WalletButton isOpen={walletOpen} togglePanel={() => togglePanel("wallet")} />
        <Button variant="outline-secondary" noShrink className="p-0 sm:p-0 rounded-full w-10 h-10 lg:hidden">
          <BurgerIcon size={6} />
        </Button>
      </div>
      <Backdrop active={backdropActive} onClick={closePanel} />
    </div>
  );
}

const Backdrop = ({ active, onClick }: { active: boolean; onClick: () => void }) => {
  return (
    <div
      onClick={onClick}
      className={`fixed top-0 left-0 w-full h-full transition-all ${active ? "backdrop-blur-[2px] bg-white/50 pointer-events-auto" : "pointer-events-none -z-[-2]"} `}
    />
  );
};

export default Frame;
