import { usePriceData } from "@/state/usePriceData";
import { Button } from "./ui/Button";
import pintoIcon from "@/assets/tokens/PINTO.png";
import chevronDown from "@/assets/misc/ChevronDown.svg";
import PriceButtonPanel from "./PriceButtonPanel";

export default function PriceButton({
	isOpen = false,
	togglePanel,
}: { isOpen: boolean; togglePanel: () => void }) {
	const priceData = usePriceData();

	return (
		<>
			<Button
				variant="outline-primary"
				size="default"
				className={`flex flex-row gap-2 rounded-full ${isOpen && "border-pinto-green"}`}
				onClick={() => togglePanel()}
			>
				<img src={pintoIcon} className="h-6 w-6" alt="pinto icon" />
				<>${Number(priceData.price.toHuman()).toFixed(4)}</>
				<img src={chevronDown} className="h-4 w-4" alt="chevron down" />
			</Button>
			<PriceButtonPanel isOpen={isOpen} />
		</>
	);
}
