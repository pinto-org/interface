import { useEffect, useState } from "react";
import { Button } from "./ui/Button";
import { CloseIcon } from "./Icons";
import bridggLogo from "@/assets/misc/bridgg-logo.svg";
import baseLogo from "@/assets/misc/base-logo.png";
import coinbaseLogo from "@/assets/misc/coinbase-logo.png";
import { useAccount } from "wagmi";

export default function NoBaseValueAlert() {
  const [show, setShow] = useState(false);
  const { isConnected } = useAccount();

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

  if (!isConnected || !show) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50">
      <div className="bg-pinto-gray-1 border border-pinto-gray-2 rounded-[1.5rem] shadow-lg relative">
        <div className="absolute top-3 right-3">
          <Button
            variant="ghost"
            rounded="full"
            className="h-12 w-12 p-0 cursor-pointer hover:bg-transparent"
            onClick={handleDismiss}
          >
            <CloseIcon color="currentColor" width={24} height={24} />
          </Button>
        </div>
        <div className="flex flex-col gap-6 px-6 py-6 pr-16">
          <p className="text-black text-2xl font-[340] leading-[110%] tracking-[-0.02em] font-antarctica">
            Looks like you don't have any funds on Base. Bridge value from Ethereum, or send value to your wallet using
            an exchange.
          </p>
          <div className="flex flex-col lg:flex-row items-center gap-4 w-full">
            <Button
              asChild
              className="bg-[#0052FF] hover:bg-[#0052CC] text-white rounded-2xl h-20 w-full lg:flex-1 px-4 lg:px-6"
            >
              <a
                href="https://www.brid.gg/base?amount=&originChainId=1&token=ETH"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 w-full"
              >
                <div className="flex-shrink-0 flex items-center gap-2">
                  <img src={baseLogo} alt="Base" className="w-10 h-10 lg:w-12 lg:h-12" />
                  <img src={bridggLogo} alt="Brid.gg" className="w-7 h-7 lg:w-8 lg:h-8" />
                </div>
                <span className="text-2xl lg:text-2xl font-[500] leading-[110%] tracking-[-0.02em] font-antarctica text-left">
                  Bridge tokens to Base using Brid.gg
                </span>
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="bg-white text-black border-pinto-gray-2 hover:bg-gray-100 rounded-2xl h-20 w-full lg:flex-1 px-4 lg:px-6"
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
                    className="w-10 h-10 lg:w-12 lg:h-12 rounded-full object-cover"
                  />
                </div>
                <span className="text-2xl lg:text-2xl font-[500] leading-[110%] tracking-[-0.02em] font-antarctica text-center">
                  Send tokens from Coinbase
                </span>
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
