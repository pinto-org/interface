import HelperLink from "@/components/HelperLink";
import { ScrollHideComponent } from "@/components/ScrollHideComponent";
import useFarmerActions from "@/hooks/useFarmerActions";
import useFarmerStatus from "@/hooks/useFarmerStatus";
import { useFarmerBalances } from "@/state/useFarmerBalances";
import { useFarmerSiloNew } from "@/state/useFarmerSiloNew";
import useFieldSnapshots from "@/state/useFieldSnapshots";
import { usePriceData } from "@/state/usePriceData";
import useSiloSnapshots from "@/state/useSiloSnapshots";
import { useInvalidateSun } from "@/state/useSunData";
import { formatter } from "@/utils/format";
import { cn } from "@/utils/utils";
import { useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { useModal } from "connectkit";
import { useRef, useState } from "react";
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
  const priceData = usePriceData();
  const farmerSilo = useFarmerSiloNew();
  const invalidateSun = useInvalidateSun();

  const fieldSnapshots = useFieldSnapshots();
  const siloSnapshots = useSiloSnapshots();

  const hasInternal = farmerActions.totalValue.wallet.internal.gt(0);
  const hasFlood = farmerActions.floodAssets.enabled;
  const usdValue = farmerActions.totalValue.wallet.total;

  const isHome = useMatch("/");
  const isOverview = useMatch("/overview");
  const isSilo = useMatch("/silo");

  const { address, hasDeposits, hasPlots, loading, didLoad } = useFarmerStatus();
  const isNewUser = !address || (!hasDeposits && !hasPlots);

  const showWalletHelper = isOverview && !isNewUser && !loading && didLoad;

  const priceOpen = openPanel === "price";
  const seasonsOpen = openPanel === "seasons";
  const walletOpen = openPanel === "wallet";
  const mobileNaviOpen = openPanel === "mobile-navi";

  const walletButton = useRef<HTMLButtonElement>(null);
  const modal = useModal();

  const closePanel = () => {
    setOpenBackdrop(false);
    setOpenPanel(undefined);
  };

  const invalidateData = (panel: Panel) => {
    if (panel === "wallet") {
      const allQueryKeys = [...priceData.queryKeys, ...farmerSilo.queryKeys, ...farmerBalances.queryKeys];
      allQueryKeys.forEach((query) => queryClient.invalidateQueries({ queryKey: query, refetchType: "active" }));
    } else if (panel === "seasons") {
      const allQueryKeys = [fieldSnapshots.queryKey, siloSnapshots.queryKey];
      allQueryKeys.forEach((query) => queryClient.invalidateQueries({ queryKey: query, refetchType: "active" }));
      invalidateSun("all", { refetchType: "active" });
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
      setOpenPanel(panel);
    }
  };

  return (
    <>
      <div
        className={cn(
          `fixed grid px-4 pt-4 pb-2 sm:px-6 sm:pt-6 w-full z-[2] ${isHome ? "bg-transparent" : "bg-gradient-light"} action-container transition-colors`,
          styles.navGrid,
        )}
      >
        <div className="flex flex-row gap-2 sm:gap-4">
          <div className={`transition-all duration-100 ${priceOpen && "z-[51]"}`}>
            <PriceButton
              isOpen={priceOpen}
              togglePanel={() => togglePanel("price")}
              onMouseEnter={() => invalidateData("price")}
            />
          </div>
          <div className={`transition-all duration-100 ${seasonsOpen && "z-[51]"}`}>
            <SeasonsButton
              isOpen={seasonsOpen}
              togglePanel={() => togglePanel("seasons")}
              onMouseEnter={() => invalidateData("seasons")}
            />
          </div>
        </div>
        <div className="hidden lg:flex lg:justify-center">
          <Navi />
        </div>
        <div className="flex flex-row justify-end gap-x-4">
          <div className="flex flex-row justify-end gap-x-1">
            <div className={`${walletOpen && "z-[51]"} relative`}>
              <div data-action-target={"wallet-button"}>
                <WalletButton
                  isOpen={walletOpen}
                  togglePanel={() => togglePanel("wallet")}
                  onMouseEnter={() => invalidateData("wallet")}
                  ref={walletButton}
                  showClaim={showClaim}
                  setShowClaim={setShowClaim}
                />
              </div>

              {!openPanel && showWalletHelper && (
                <ScrollHideComponent>
                  <HelperLink
                    onClick={() => {
                      if (!account.address) {
                        modal.setOpen(true);
                        return;
                      }
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
                    className={`absolute top-[150px] right-[340px] flex flex-row-reverse`}
                    sourceAnchor="right"
                    targetAnchor="left"
                    source90Degree={true}
                    perpLength={5}
                    dataTarget="wallet-button"
                  />
                </ScrollHideComponent>
              )}
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
          </div>
          <div className="hidden sm:block">
            <Backdrop active={openBackdrop} onClick={closePanel} transitionDuration={DURATION} />
          </div>
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
  landing: "/",
  overview: "/overview",
  silo: "/silo",
  field: "/field",
  market: "/market",
  explorer: "/explorer",
  // whitepaper: "https://link.to.pinto/whitepaper.pdf",
  twitter: "https://x.com/pintocommunity",
  docs: "https://docs.pinto.money/",
  discord: "https://pinto.money/discord",
  github: "https://github.com/moneyprotocolonbase",
  disclosures: "https://docs.pinto.money/disclosures",
  exchange: "https://pinto.exchange/",
} as const;
