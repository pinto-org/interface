import { usePriceData } from "@/state/usePriceData";
import ConnectButton from "./ConnectButton";
import Navi from "./Navi";
import { useSunData } from "@/state/useSunData";
import PriceButton from "./PriceButton";
import SeasonsButton from "./SeasonsButton";

function Frame() {
  const priceData = usePriceData();
  const sunData = useSunData();

  return (
    <div className="flex justify-between p-6">
      <div className="flex w-1/3 gap-2">
        <PriceButton />
        <SeasonsButton />
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
