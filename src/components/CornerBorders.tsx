import { Variants, motion } from "framer-motion";
import { FC } from "react";

interface TableRowCornersProps {
  rowNumber: number; // Zero index
  active?: boolean;
  standalone?: boolean; // Add new prop for standalone usage
  cornerRadius?: string; // Add prop for corner radius
}

/**
 * Component designed to add animated corners to table rows or standalone elements
 */
const CornerBorders: FC<TableRowCornersProps> = ({
  rowNumber = 0,
  active = true,
  standalone = false,
  cornerRadius = "0", // Default radius set to 0 for square corners
}) => {
  // Animation variants
  const cornerVariants: Variants = {
    // Top left corner
    topLeftIn: {
      top: -6,
      left: -6,
      transition: { duration: 1, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
    },
    topLeftOut: { top: 0, left: 0 },

    // Top right corner
    topRightIn: {
      top: -6,
      right: -6,
      transition: { duration: 1, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
    },
    topRightOut: { top: 0, right: 0 },

    // Bottom left corner
    bottomLeftIn: {
      bottom: -6,
      left: -6,
      transition: { duration: 1, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
    },
    bottomLeftOut: { bottom: 0, left: 0 },

    // Bottom right corner
    bottomRightIn: {
      bottom: -6,
      right: -6,
      transition: { duration: 1, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
    },
    bottomRightOut: { bottom: 0, right: 0 },
  };

  // Calculate position in rem for table row mode
  const rowPositionRem = rowNumber * 4.5;

  return (
    <>
      <div
        className={`absolute left-0 w-full pointer-events-none overflow-visible z-10 transition-opacity ${active ? "opacity-100" : "opacity-0"} ${
          standalone ? "top-0 bottom-0 right-0" : `h-[4.5rem] mt-[3.5rem]`
        }`}
        style={standalone ? {} : { top: `${rowPositionRem}rem` }}
      >
        {/* Top Left Corner */}
        <motion.div
          initial="topLeftOut"
          animate="topLeftIn"
          variants={cornerVariants}
          className="absolute mt-[1px] top-0 left-0 border-pinto-green-4 w-6 h-6 border-t-2 border-l-2"
          style={{ borderTopLeftRadius: cornerRadius }}
        />

        {/* Top Right Corner */}
        <motion.div
          initial="topRightOut"
          animate="topRightIn"
          variants={cornerVariants}
          transition={{ delay: 0.5 }}
          className="absolute mt-[1px] top-0 right-0 border-pinto-green-4 w-6 h-6 border-t-2 border-r-2"
          style={{ borderTopRightRadius: cornerRadius }}
        />

        {/* Bottom Left Corner */}
        <motion.div
          initial="bottomLeftOut"
          animate="bottomLeftIn"
          variants={cornerVariants}
          transition={{ delay: 1.0 }}
          className="absolute -mb-[1px] bottom-0 left-0 border-pinto-green-4 w-6 h-6 border-l-2 border-b-2"
          style={{ borderBottomLeftRadius: cornerRadius }}
        />

        {/* Bottom Right Corner */}
        <motion.div
          initial="bottomRightOut"
          animate="bottomRightIn"
          variants={cornerVariants}
          transition={{ delay: 1.5 }}
          className="absolute -mb-[1px] bottom-0 right-0 border-pinto-green-4 w-6 h-6 border-r-2 border-b-2"
          style={{ borderBottomRightRadius: cornerRadius }}
        />
      </div>
    </>
  );
};

export default CornerBorders;
