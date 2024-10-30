import chevronDown from "@/assets/misc/ChevronDown.svg";
import sunIcon from "@/assets/protocol/Sun.png";
import { useSunData } from "@/state/useSunData";
import { Button } from "../ui/Button";
import SeasonsButtonPanel from "../SeasonsButtonPanel";
import IconImage from "../ui/IconImage";

export default function SeasonsButton({ isOpen = false, togglePanel }: { isOpen: boolean; togglePanel: () => void }) {
  const sunData = useSunData();

  return (
    <>
      <Button
        variant="outline-secondary"
        className={`flex flex-row gap-2 ${isOpen && "border-pinto-green"}`}
        onClick={() => togglePanel()}
        noShrink
        rounded="full"
      >
        <IconImage src={sunIcon} />
        <div className="hidden sm:block">Season {sunData.current}</div>
        <IconImage src={chevronDown} size={4} />
      </Button>
      <SeasonsButtonPanel isOpen={isOpen} />
    </>
  );
}
