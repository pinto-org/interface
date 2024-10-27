import { usePriceData } from "@/state/usePriceData";
import { Button } from "./ui/Button";
import pintoIcon from "@/assets/tokens/Pinto.png";
import chevronDown from "@/assets/misc/ChevronDown.svg";
import PriceButtonPanel from "./PriceButtonPanel";

export default function PriceButton({isOpen = false, togglePanel}: {isOpen: boolean, togglePanel: () => void}) {

    const priceData = usePriceData();

    return (
      <>
      <Button 
        variant="outline" 
        className={`font-[400] text-[1.25rem] h-10 text-pinto-green hover:text-pinto-green rounded-full flex flex-row gap-2 ${isOpen && 'border-pinto-green'}`}
        onClick={() => togglePanel()}
      >
        <img src={pintoIcon} className="h-6 w-6" />
        <span>${Number(priceData.price.toHuman()).toFixed(4)}</span>
        <img src={chevronDown} className="h-4 w-4" />
      </Button>
      <PriceButtonPanel isOpen={isOpen} />
      </>
    )
}