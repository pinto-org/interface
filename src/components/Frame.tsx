import { usePriceData } from "@/state/usePriceData";
import ConnectButton from "./ConnectButton";
import { Button } from "./ui/Button";
import Navi from "./Navi";
import { useSunData } from "@/state/useSunData";

function Frame() {
  const priceData = usePriceData();
  const sunData = useSunData();

  return (
    <div className="flex justify-between py-2 px-4">
      <div className="flex w-1/3 gap-2">
        <Button variant="outline">${priceData.price.toHuman("short")}</Button>
        <Button variant="outline">Season {sunData.current.toHuman()}</Button>
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
