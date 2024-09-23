import { usePriceData } from "@/state/usePriceData";
import { Button } from "./ui/Button";
import pintoIcon from "@/assets/tokens/Pinto-variant.png";
import chevronDown from "@/assets/misc/ChevronDown.svg";


export default function PriceButton() {

    const priceData = usePriceData();

    return (
        <Button variant="outline" className="font-[400] text-[1.25rem] h-10 text-pinto-green hover:text-pinto-green rounded-full flex flex-row gap-2">
        <img src={pintoIcon} className="h-8 w-8 mt-1 drop-shadow-md" />
        <span>${priceData.price.toHuman("short")}</span>
        <img src={chevronDown} className="h-4 w-4" />
      </Button>
    )
}