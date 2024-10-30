import { usePriceData } from "@/state/usePriceData";
import { Button } from "../ui/Button";
import pintoIcon from "@/assets/tokens/PINTO.png";
import chevronDown from "@/assets/misc/ChevronDown.svg";
import PriceButtonPanel from "../PriceButtonPanel";
import IconImage from "../ui/IconImage";
import { useIsMobile } from "@/hooks/display/breakpoints";

export default function PriceButton({ isOpen = false, togglePanel }: { isOpen: boolean; togglePanel: () => void }) {
  const priceData = usePriceData();
  const isMobile = useIsMobile();

  return (
    <>
      <Button
        variant="outline-primary"
        size="default"
        rounded="full"
        noShrink
        className={`flex flex-row gap-2 ${isOpen && "border-pinto-green"}`}
        onClick={() => togglePanel()}
      >
        <IconImage src={pintoIcon} size={6} alt="pinto icon" />
        <>${Number(priceData.price.toHuman()).toFixed(isMobile ? 2 : 4)}</>
        <IconImage src={chevronDown} size={4} mobileSize={2} alt="chevron down" />
      </Button>
      <PriceButtonPanel isOpen={isOpen} />
    </>
  );
}
