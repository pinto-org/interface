import { formatUnits } from "viem";
import { usePriceData } from "@/state/usePriceData";
import ChainButton from "./ChainButton";
import ConnectButton from "./ConnectButton";
import { Button } from "./ui/Button";
import useTokenData from "@/state/useTokenData";

function Frame() {
  const priceData = usePriceData();
  const BEAN = useTokenData().mainToken;

  return (
    <div className="flex justify-between py-2 px-4 border-black border-b-[0.5px]">
      <div className="flex self-center">something</div>
      <div className="flex gap-2">
        <Button variant="outline">${priceData.price.toHuman("short")}</Button>
        <ChainButton />
        <ConnectButton />
      </div>
    </div>
  );
}

export default Frame;
