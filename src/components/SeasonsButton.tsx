import chevronDown from "@/assets/misc/ChevronDown.svg";
import sunIcon from "@/assets/protocol/Sun.png";
import { useSunData } from "@/state/useSunData";
import { Button } from "./ui/Button";
import SeasonsButtonPanel from "./SeasonsButtonPanel";
import IconImage from "./ui/IconImage";

export default function SeasonsButton({
	isOpen = false,
	togglePanel,
}: { isOpen: boolean; togglePanel: () => void }) {
	const sunData = useSunData();

	return (
		<>
			<Button
				variant="outline-secondary"
				className={`flex flex-row gap-2 rounded-full ${isOpen && "border-pinto-green"}`}
				onClick={() => togglePanel()}
			>
				<IconImage src={sunIcon} />
				<>Season {sunData.current}</>
				<IconImage src={chevronDown} />
			</Button>
			<SeasonsButtonPanel isOpen={isOpen} />
		</>
	);
}
