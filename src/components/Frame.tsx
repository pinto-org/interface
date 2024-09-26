import ConnectButton from "./ConnectButton";
import Navi from "./Navi";
import PriceButton from "./PriceButton";
import SeasonsButton from "./SeasonsButton";
import { useState } from "react";

function Frame() {

  const [priceOpen, setPriceOpen] = useState(false);
  const [seasonsOpen, setSeasonsOpen] = useState(false);
  const [connectOpen, setConnectOpen] = useState(false);
  const [lastOpened, setLastOpened] = useState<'price' | 'seasons' | 'connect' | undefined>();

  const backdropActive = priceOpen || seasonsOpen

  function togglePanel(panel: 'price' | 'seasons' | 'connect') {
    setLastOpened(panel);
    if (panel === 'price') {
      setPriceOpen(!priceOpen);
    } else if (panel === 'seasons') {
      setSeasonsOpen(!seasonsOpen);
    } else if (panel === 'connect') {
      setConnectOpen(!connectOpen);
    };
  };

  function closePanel() {
    setPriceOpen(false)
    setSeasonsOpen(false)
    setConnectOpen(false)
  };

  return (
    <div className="flex justify-between p-6">
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
        <span className={`${lastOpened === 'connect' && 'z-[51]'}`} onClick={() => togglePanel('connect')}>
          <ConnectButton />
        </span>
      </div>
      <div onClick={closePanel} className={`fixed top-0 left-0 w-full h-full transition-all ${backdropActive ? 'backdrop-blur-[2px] bg-white/50 pointer-events-auto' : 'pointer-events-none'} z-50`} />
    </div>
  );
}

export default Frame;
