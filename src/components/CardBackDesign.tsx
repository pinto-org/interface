import pintoLogo from "@/assets/tokens/PINTO.png";
import { motion } from "framer-motion";

interface CardBackDesignProps {
  onClick: () => void;
  isFlipping: boolean;
  className?: string;
}

export function CardBackDesign({ onClick, isFlipping, className = "" }: CardBackDesignProps) {
  return (
    <motion.div
      className={`
        relative w-full h-full 
        bg-gradient-to-br from-pinto-green-1 via-pinto-green-2 to-pinto-green-3
        border border-pinto-green-3/30
        rounded-2xl
        cursor-pointer
        select-none
        overflow-hidden
        shadow-2xl
        ${className}
      `}
      onClick={onClick}
      whileHover={!isFlipping ? { scale: 1.02 } : {}}
      whileTap={!isFlipping ? { scale: 0.98 } : {}}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-transparent" />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "20px 20px",
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center p-8">
        {/* Pinto Logo */}
        <motion.div
          className="mb-6"
          animate={{
            scale: [1, 1.05, 1],
            rotate: [0, 1, -1, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <img src={pintoLogo} alt="Pinto" className="w-24 h-24 drop-shadow-lg" />
        </motion.div>

        {/* Brand Text */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2 drop-shadow-md">PINTO</h2>
          <p className="text-white/80 text-sm font-medium">NFT Collection</p>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-6 left-6 w-3 h-3 bg-white/30 rounded-full" />
        <div className="absolute top-6 right-6 w-3 h-3 bg-white/30 rounded-full" />
        <div className="absolute bottom-6 left-6 w-3 h-3 bg-white/30 rounded-full" />
        <div className="absolute bottom-6 right-6 w-3 h-3 bg-white/30 rounded-full" />

        {/* Click Instruction */}
        {!isFlipping && (
          <motion.div
            className="absolute bottom-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <motion.p
              className="text-white/70 text-xs font-medium"
              animate={{
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              Click to reveal your NFT
            </motion.p>
          </motion.div>
        )}
      </div>

      {/* Hover Glow Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/5 to-white/0 rounded-2xl"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />

      {/* Card Shine Effect */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent rounded-2xl"
        style={{
          background: `
            linear-gradient(
              135deg, 
              transparent 30%, 
              rgba(255,255,255,0.1) 50%, 
              transparent 70%
            )
          `,
        }}
      />
    </motion.div>
  );
}
