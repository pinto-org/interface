import baseLogo from "@/assets/misc/base-logo.svg";
import bridggLogo from "@/assets/misc/bridgg-logo.svg";
import coinbaseLogo from "@/assets/misc/coinbase-logo.svg";
import useDelayedLoading from "@/hooks/display/useDelayedLoading";
import useFarmerStatus from "@/hooks/useFarmerStatus";
import { Cross2Icon } from "@radix-ui/react-icons";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { Button } from "./ui/Button";
import IconImage from "./ui/IconImage";

export default function NoBaseValueAlert() {
  const [show, setShow] = useState(false);
  const { isConnected } = useAccount();
  const { loading, didLoad, hasBalanceOnBase } = useFarmerStatus();

  const { loading: isLoading, setLoading } = useDelayedLoading(3000, !didLoad);

  useEffect(() => {
    setLoading(loading);
  }, [loading, setLoading]);

  useEffect(() => {
    if (isConnected) {
      const dismissed = localStorage.getItem("baseValueAlertDismissed");
      if (!dismissed) {
        setShow(true);
      }
    } else {
      setShow(false);
    }
  }, [isConnected]);

  const handleDismiss = () => {
    localStorage.setItem("baseValueAlertDismissed", "true");
    setShow(false);
  };

  const variants = {
    enter: (direction: number) => ({
      y: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      y: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      y: direction < 0 ? -100 : 100,
      opacity: 0,
    }),
  };

  return (
    <AnimatePresence>
      {isConnected && show && !isLoading && !hasBalanceOnBase && (
        <motion.div
          initial="enter"
          animate="center"
          exit="exit"
          variants={variants}
          custom={1}
          transition={{
            y: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          className="fixed bottom-4 left-4 right-4 z-50"
        >
          <div className="bg-pinto-gray-1 border border-pinto-gray-2 rounded-[1.5rem] shadow-lg relative">
            <div className="absolute top-3 right-3">
              <Button
                variant="ghost"
                rounded="full"
                className="h-6 w-6 sm:h-12 sm:w-12 p-0 cursor-pointer hover:bg-transparent"
                onClick={handleDismiss}
              >
                <IconImage size={8} mobileSize={6} src={Cross2Icon} />
              </Button>
            </div>
            <div className="flex flex-col gap-4 p-4 sm:gap-6 sm:p-6">
              <p className="text-sm sm:text-2xl pr-2">
                Looks like you don't have any funds on Base. Bridge value from Ethereum, or send value to your wallet
                using an exchange.
              </p>
              <div className="flex flex-col lg:flex-row items-center gap-4 w-full">
                <Button
                  asChild
                  className="bg-[#0052FF] hover:bg-[#0052CC] text-white rounded-2xl h-12 sm:h-20 w-full sm:flex-1 px-4 sm:px-6"
                >
                  <a
                    href="https://www.brid.gg/base?amount=&originChainId=1&token=ETH"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 w-full"
                  >
                    <div className="flex-shrink-0 flex items-center gap-2">
                      <img src={baseLogo} alt="Base" className="w-6 h-6 sm:w-12 sm:h-12" />
                      <img src={bridggLogo} alt="Brid.gg" className="w-4 h-4 sm:w-8 sm:h-8" />
                    </div>
                    <span className="hidden sm:block text-sm sm:text-2xl text-left">
                      Bridge tokens to Base using Brid.gg
                    </span>
                    <span className="sm:hidden text-sm sm:text-2xl text-left">Bridge to Base using Brid.gg</span>
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="bg-white text-black border-pinto-gray-2 hover:bg-gray-100 rounded-2xl h-12 sm:h-20 w-full sm:flex-1 px-4 sm:px-6"
                >
                  <a
                    href="https://help.coinbase.com/en/coinbase/trading-and-funding/cryptocurrency-trading-pairs/how-to-send-and-receive-cryptocurrency"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 w-full"
                  >
                    <div className="flex-shrink-0">
                      <img
                        src={coinbaseLogo}
                        alt="Coinbase"
                        className="w-6 h-6 sm:w-12 sm:h-12 rounded-full object-cover"
                      />
                    </div>
                    <span className="text-sm sm:text-2xl text-left">Send tokens from Coinbase</span>
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
