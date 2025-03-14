import { Variants, motion } from "framer-motion";
import { FC } from "react";

interface TableRowCornersProps {
  rowNumber: number; // Zero index
  active?: boolean;
}

/**
 * Component specifically designed to add animated corners to table rows
 */
const CornerBorders: FC<TableRowCornersProps> = ({ rowNumber = 0, active = true }) => {
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

  // Calculate position in rem
  const rowPositionRem = rowNumber * 4.5;

  // The corner elements with animation
  return (
    <>
      {/*
      <div
        className={`absolute left-0 w-full h-[4.5rem] flex justify-center pointer-events-none overflow-visible z-10 mt-[3.5rem] transition-opacity ${active ? "opacity-100" : "opacity-0"} text-pinto-gray-5 pinto-body`}
        style={{ top: `${rowPositionRem - 2}rem` }}
      >
        Wrap your Deposited Pinto to sPINTO and use it across DeFi
      </div>
    */}
      <div
        className={`absolute left-0 w-full h-[4.5rem] pointer-events-none overflow-visible z-10 mt-[3.5rem] transition-opacity ${active ? "opacity-100" : "opacity-0"}`}
        style={{ top: `${rowPositionRem}rem` }}
      >
        {/* Top Left Corner */}
        <motion.div
          initial="topLeftOut"
          animate="topLeftIn"
          variants={cornerVariants}
          className="absolute mt-[1px] top-0 left-0 border-pinto-green-4 w-6 h-6 border-t-2 border-l-2"
        />

        {/* Top Right Corner */}
        <motion.div
          initial="topRightOut"
          animate="topRightIn"
          variants={cornerVariants}
          transition={{ delay: 0.5 }}
          className="absolute mt-[1px] top-0 right-0 border-pinto-green-4 w-6 h-6 border-t-2 border-r-2"
        />

        {/* Bottom Left Corner */}
        <motion.div
          initial="bottomLeftOut"
          animate="bottomLeftIn"
          variants={cornerVariants}
          transition={{ delay: 1.0 }}
          className="absolute -mb-[1px] bottom-0 left-0 border-pinto-green-4 w-6 h-6 border-l-2 border-b-2"
        />

        {/* Bottom Right Corner */}
        <motion.div
          initial="bottomRightOut"
          animate="bottomRightIn"
          variants={cornerVariants}
          transition={{ delay: 1.5 }}
          className="absolute -mb-[1px] bottom-0 right-0 border-pinto-green-4 w-6 h-6 border-r-2 border-b-2"
        />
      </div>
    </>
  );
};

export default CornerBorders;
