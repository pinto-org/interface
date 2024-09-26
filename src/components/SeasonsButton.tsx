import chevronDown from "@/assets/misc/ChevronDown.svg";
import sunIcon from "@/assets/protocol/Sun.png";
import { useSunData } from "@/state/useSunData";
import { Button } from "./ui/Button";
import SeasonsButtonPanel from "./SeasonsButtonPanel";

export default function SeasonsButton({isOpen = false, togglePanel}: {isOpen: boolean, togglePanel: () => void}) {

    const sunData = useSunData();

    return (
      <>
        <Button 
          variant="outline" 
          className={`font-[400] text-[1.25rem] h-10 text-pinto-gray-5 hover:text-pinto-gray-5 rounded-full flex flex-row gap-2 ${isOpen && 'border-pinto-green'}`}
          onClick={() => togglePanel()}
        >
          <img src={sunIcon} className="h-6 w-6" />
          <span>Season {sunData.current.toHuman()}</span>
          <img src={chevronDown} className="h-4 w-4" />
        </Button>
        <SeasonsButtonPanel isOpen={isOpen} />
      </>
    )
}