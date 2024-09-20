import { usePriceData } from "@/state/usePriceData";
import ConnectButton from "./ConnectButton";
import { Button } from "./ui/Button";
import Navi from "./Navi";
import { useSunData } from "@/state/useSunData";
import pintoIcon from "@/assets/tokens/Pinto-variant.png";
import chevronDown from "@/assets/misc/ChevronDown.svg";
import sunIcon from "@/assets/protocol/Sun.png";

function Frame() {
  const priceData = usePriceData();
  const sunData = useSunData();

  return (
    <div className="flex justify-between p-6">
      <div className="flex w-1/3 gap-2">
        <Button variant="outline" className="font-[400] text-[1.25rem] h-10 text-pinto-green hover:text-pinto-green rounded-full flex flex-row gap-2">
          <img src={pintoIcon} className="h-8 w-8 mt-1 drop-shadow-md" />
          <span>${priceData.price.toHuman("short")}</span>
          <img src={chevronDown} className="h-4 w-4" />
        </Button>
        <Button variant="outline" className="font-[400] text-[1.25rem] h-10 text-pinto-gray-5 hover:text-pinto-gray-5 rounded-full flex flex-row gap-2">
          <img src={sunIcon} className="h-6 w-6" />
          <span>Season {sunData.current.toHuman()}</span>
          <img src={chevronDown} className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex w-1/3 justify-center">
        <Navi />
      </div>
      <div className="flex w-1/3 justify-end">
        <ConnectButton />
      </div>
    </div>
  );
}

export default Frame;
