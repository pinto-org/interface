import Navi from "./Navi";
import PriceButton from "./PriceButton";
import SeasonsButton from "./SeasonsButton";
import { useState } from "react";
import WalletButton from "./WalletButton";
import ChainButton from "./ChainButton";

function Frame() {

  const [priceOpen, setPriceOpen] = useState(false);
  const [seasonsOpen, setSeasonsOpen] = useState(false);
  const [walletOpen, setWalletOpen] = useState(false);
  const [lastOpened, setLastOpened] = useState<'price' | 'seasons' | 'wallet' | undefined>();

  const backdropActive = priceOpen || seasonsOpen || walletOpen;

  function togglePanel(panel: 'price' | 'seasons' | 'wallet') {
    setLastOpened(panel);
    if (panel === 'price') {
      setPriceOpen(!priceOpen);
    } else if (panel === 'seasons') {
      setSeasonsOpen(!seasonsOpen);
    } else if (panel === 'wallet') {
      setWalletOpen(!walletOpen);
    };
  };

  function closePanel() {
    setPriceOpen(false)
    setSeasonsOpen(false)
    setWalletOpen(false)
  };

  return (
    <div className="flex justify-between p-6 fixed w-full overflow-x-clip bg-gradient-light z-[2]">
      <div className="flex w-1/3 gap-2">
        <span className={`${lastOpened === 'price' && 'z-[51]'}`}>
          <PriceButton isOpen={priceOpen} togglePanel={() => togglePanel('price')}/>
        </span>
        <span className={`${lastOpened === 'seasons' && 'z-[51]'}`}>
          <SeasonsButton isOpen={seasonsOpen} togglePanel={() => togglePanel('seasons')} />
        </span>
      </div>
      <div className="flex w-1/3 justify-center">
        <Navi />
      </div>
      <div className="flex w-1/3 justify-end">
        <span className={`${lastOpened === 'wallet' && 'z-[51]'} flex flex-row gap-2`}>
          <ChainButton />
          <WalletButton isOpen={walletOpen} togglePanel={() => togglePanel('wallet')} />
        </span>
      </div>
      <div onClick={closePanel} className={`fixed top-0 left-0 w-full h-full transition-all ${backdropActive ? 'backdrop-blur-[2px] bg-white/50 pointer-events-auto' : 'pointer-events-none -z-[-2]'} `} />
    </div>
  );
}

export default Frame;
