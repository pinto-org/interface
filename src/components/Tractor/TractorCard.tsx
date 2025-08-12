import { Col } from "@/components/Container";
import CornerBorders from "@/components/CornerBorders";
import { cn } from "@/utils/utils";
import { SizeIcon } from "@radix-ui/react-icons";
import { useState } from "react";

export default function TractorCard({
  label,
  subLabel,
  shouldAnimateZoom = false,
  corderBordersDisabled = false,
  onClick,
}: {
  label: string | JSX.Element;
  subLabel: string | JSX.Element;
  corderBordersDisabled?: boolean;
  shouldAnimateZoom?: boolean;
  onClick: () => void;
}) {
  const [hoveredTractor, setHoveredTractor] = useState(false);

  const handleOnMouseEnter = () => {
    setHoveredTractor(true);
  };

  const handleOnMouseLeave = () => {
    setHoveredTractor(false);
  };

  return (
    <div className="relative w-full cursor-pointer">
      <Col
        onClick={onClick}
        className={cn(
          "relative group box-border items-start p-4 gap-1 w-full rounded-[1rem]",
          "transition-colors duration-200 bg-white border border-pinto-gray-2",
        )}
        onMouseEnter={handleOnMouseEnter}
        onMouseLeave={handleOnMouseLeave}
        style={getTractorCTAStyles(shouldAnimateZoom, hoveredTractor)}
      >
        {/* Position the icon absolutely to place it on the right side and vertically centered */}
        <SizeIcon
          className={`absolute top-1/2 right-4 transform -translate-y-1/2 w-5 h-5 text-pinto-secondary ${
            shouldAnimateZoom || hoveredTractor ? "hidden" : "block"
          }`}
        />
        <div className="flex flex-row items-center gap-1">
          <span
            className={`pinto-h4 ${shouldAnimateZoom || hoveredTractor ? "text-pinto-green-4" : "text-pinto-light"}`}
          >
            {label}
            {/* 🚜 Want to Sow with size? */}
          </span>
        </div>
        <span
          className={`pinto-body-light ${shouldAnimateZoom || hoveredTractor ? "text-pinto-green-3" : "text-pinto-light"}`}
        >
          {subLabel}
          {/* Set up a Tractor Order to automate Sowing */}
        </span>
      </Col>
      {corderBordersDisabled && (
        <CornerBorders rowNumber={0} active={hoveredTractor} standalone={true} cornerRadius="1rem" />
      )}
    </div>
  );
}

const styles = {
  animate: {
    boxShadow: "0 0 0 2px rgba(56, 127, 92, 0.5)",
    animation: "pulse-scale 1.5s ease-in-out infinite",
  },
  background: {
    backgroundColor: "#E5F5E5",
    borderColor: "#387F5C",
  },
  empty: {},
} as const;

const getTractorCTAStyles = (isHighlighted: boolean, hoveredTractor: boolean) => {
  return {
    ...(isHighlighted || hoveredTractor ? styles.background : styles.empty),
    // If input exceeds soil, apply special highlight styling
    ...(isHighlighted ? styles.animate : styles.empty),
  };
};
