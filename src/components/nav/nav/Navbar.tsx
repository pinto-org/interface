import HelperLink from "@/components/HelperLink";
import { ScrollHideComponent } from "@/components/ScrollHideComponent";
import useFarmerActions from "@/hooks/useFarmerActions";
import { useFarmerBalances } from "@/state/useFarmerBalances";
import useFarmerDepositedBalances from "@/state/useFarmerDepositedBalances";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import useFieldSnapshots from "@/state/useFieldSnapshots";
import { usePriceData } from "@/state/usePriceData";
import useSiloSnapshots from "@/state/useSiloSnapshots";
import { useSunData } from "@/state/useSunData";
import { formatter } from "@/utils/format";
import { cn } from "@/utils/utils";
import { useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { useMemo, useRef, useState } from "react";
import { useMatch } from "react-router-dom";
import { useAccount } from "wagmi";
import WalletButton from "../../WalletButton";
import Backdrop from "../../ui/Backdrop";
import PriceButton from "../PriceButton";
import SeasonsButton from "../SeasonsButton";
import Navi from "./Navi.desktop";
import MobileNavi from "./Navi.mobile";

type Panel = "price" | "seasons" | "wallet" | "mobile-navi";

const DURATION = 150;

const Navbar = () => {
  const [openPanel, setOpenPanel] = useState<Panel | undefined>();
  const [showClaim, setShowClaim] = useState(false);
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [backdropMounted, setBackdropMounted] = useState(true);

  const account = useAccount();
  const queryClient = useQueryClient();

  const farmerActions = useFarmerActions();
  const farmerBalances = useFarmerBalances();
  const farmerDeposits = useFarmerDepositedBalances();
  const priceData = usePriceData();
  const farmerSilo = useFarmerSilo();

  const sunData = useSunData();
  const fieldSnapshots = useFieldSnapshots();
  const siloSnapshots = useSiloSnapshots();

  const hasInternal = farmerActions.totalValue.wallet.internal.gt(0);
  const hasFlood = farmerActions.floodAssets.enabled;
  const usdValue = farmerActions.totalValue.wallet.total;

  const isRoot = useMatch("/");

  const priceOpen = openPanel === "price";
  const seasonsOpen = openPanel === "seasons";
  const walletOpen = openPanel === "wallet";
  const mobileNaviOpen = openPanel === "mobile-navi";

  const walletButton = useRef<HTMLButtonElement>(null);

  const closePanel = () => {
    setOpenBackdrop(false);
    setOpenPanel(undefined);
  };

  const invalidateData = (panel: Panel) => {
    if (panel === "wallet") {
      const allQueryKeys = [
        ...priceData.queryKeys,
        ...farmerSilo.queryKeys,
        ...farmerBalances.queryKeys,
        farmerDeposits.queryKey,
      ];
      allQueryKeys.forEach((query) => queryClient.invalidateQueries({ queryKey: query, refetchType: "active" }));
    } else if (panel === "seasons") {
      const allQueryKeys = [sunData.queryKey, fieldSnapshots.queryKey, siloSnapshots.queryKey];
      allQueryKeys.forEach((query) => queryClient.invalidateQueries({ queryKey: query, refetchType: "active" }));
    } else if (panel === "price") {
      const allQueryKeys = [...priceData.queryKeys];
      allQueryKeys.forEach((query) => queryClient.invalidateQueries({ queryKey: query, refetchType: "active" }));
    }
  };

  const togglePanel = (panel: Panel) => {
    if (openPanel === panel) {
      closePanel();
      setShowClaim(false);
    } else {
      setBackdropMounted(true);
      setOpenBackdrop(true);
      invalidateData(panel);
      setOpenPanel(panel);
    }
  };

  return (
    <>
      <div
        className={cn(
          "fixed grid px-4 pt-4 pb-2 sm:px-6 sm:pt-6 w-full z-[2] bg-gradient-light action-container",
          styles.navGrid,
        )}
      >
        <div className="flex flex-row gap-2 sm:gap-4">
          <div className={`transition-all duration-100 ${priceOpen && "z-[51]"}`}>
            <PriceButton isOpen={priceOpen} togglePanel={() => togglePanel("price")} />
          </div>
          <div className={`transition-all duration-100 ${seasonsOpen && "z-[51]"}`}>
            <SeasonsButton isOpen={seasonsOpen} togglePanel={() => togglePanel("seasons")} />
          </div>
        </div>
        <div className="hidden lg:flex lg:justify-center">
          <Navi />
        </div>
        <div className="flex flex-row justify-end">
          <div className={`${walletOpen && "z-[51]"}`}>
            <div data-action-target={"wallet-button"}>
              <WalletButton
                isOpen={walletOpen}
                togglePanel={() => togglePanel("wallet")}
                ref={walletButton}
                showClaim={showClaim}
                setShowClaim={setShowClaim}
              />
            </div>
          </div>
          <div className={`lg:hidden ${mobileNaviOpen && "z-[51]"}`}>
            <MobileNavi
              isOpen={mobileNaviOpen}
              togglePanel={() => togglePanel("mobile-navi")}
              close={closePanel}
              mounted={backdropMounted}
              unmount={() => setBackdropMounted(false)}
            />
          </div>
          <div className="hidden sm:block">
            <Backdrop active={openBackdrop} onClick={closePanel} transitionDuration={DURATION} />
          </div>
          {!openPanel && isRoot && (
            <ScrollHideComponent>
              <HelperLink
                onClick={() => {
                  if (hasFlood) {
                    setShowClaim(true);
                  }
                  togglePanel("wallet");
                }}
                text={
                  !account.address
                    ? "Connect your Wallet"
                    : hasFlood
                      ? "Claim assets from Flood"
                      : `Manage ${usdValue.gt(0.01) ? `${formatter.usd(usdValue)} in` : "your"} Wallet ${hasInternal ? "+ Farm Balances" : "Balance"}`
                }
                className={`absolute top-[150px] right-[340px]`}
                sourceAnchor="right"
                targetAnchor="left"
                source90Degree={true}
                perpLength={5}
                dataTarget="wallet-button"
                fixed
              />
            </ScrollHideComponent>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;

const styles = {
  navGrid: clsx("grid-cols-[220px_1fr] sm:grid-cols-[350px_1fr] lg:grid-cols-[350px_1fr_200px] grid-rows-1"),
} as const;

export const navLinks = {
  overview: "/",
  silo: "/silo",
  field: "/field",
  market: "/market",
  explorer: "/explorer",
  whitepaper: "https://link.to.pinto/whitepaper.pdf",
  docs: "https://link.to.pinto/docs",
  discord: "https://link.to.pinto/pintocord",
  github: "https://link.to.pinto/github",
  disclosures: "https://link.to.pinto/disclosures",
  bugbounty: "https://link.to.pinto/bugbounty",
  exchange: "https://pinto.exchange/",
  pipeline: "https://evmpipeline.org/",
} as const;
