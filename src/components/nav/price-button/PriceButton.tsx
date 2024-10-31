import chevronDown from "@/assets/misc/ChevronDown.svg";
import pintoIcon from "@/assets/tokens/PINTO.png";
import PriceButtonPanel from "@/components/nav/price-button/PriceButtonPanel";
import { Button } from "@/components/ui/Button";
import IconImage from "@/components/ui/IconImage";
import useIsMobile from "@/hooks/display/useIsMobile";
import { usePriceData } from "@/state/usePriceData";
import { HTMLAttributes } from "react";

export interface IPriceButton extends HTMLAttributes<HTMLButtonElement> {
  isOpen: boolean;
  togglePanel: () => void;
}

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
        <IconImage src={chevronDown} size={4} mobileSize={2.5} alt="chevron down" />
      </Button>
      <PriceButtonPanel isOpen={isOpen} />
    </>
  );
}
