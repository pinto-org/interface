import backArrowIcon from "@/assets/misc/LeftArrow.svg";
import podIcon from "@/assets/protocol/Pod.png";
import { TokenValue } from "@/classes/TokenValue";
import EmptyTable from "@/components/EmptyTable";

import { LeftArrowIcon, UpDownArrowsIcon } from "@/components/Icons";
import { OnlyMorningCard } from "@/components/MorningCard";
import PlotsTable from "@/components/PlotsTable";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import PageContainer from "@/components/ui/PageContainer";
import { Separator } from "@/components/ui/Separator";
import { ANALYTICS_EVENTS } from "@/constants/analytics-events";
import MorningTemperatureChart from "@/pages/field/MorningTemperature";
import { useUpdateMorningSoilOnInterval } from "@/state/protocol/field/field.updater";
import { trackSimpleEvent } from "@/utils/analytics";

import { Col } from "@/components/Container";
import CornerBorders from "@/components/CornerBorders";
import MobileActionBar from "@/components/MobileActionBar";
import ReadMoreAccordion from "@/components/ReadMoreAccordion";
import SowOrderDialog, { AnimateSowOrderDialog } from "@/components/SowOrderDialog";
import TextSkeleton from "@/components/TextSkeleton";
import TooltipSimple from "@/components/TooltipSimple";
import TractorCard from "@/components/Tractor/TractorCard";
import { TractorSowOrdersPanel } from "@/components/Tractor/farmer-orders/TractorOrdersPanel";
import { navLinks } from "@/components/nav/nav/Navbar";
import useIsMobile from "@/hooks/display/useIsMobile";
import useLocalStorage from "@/hooks/useLocalStorage";
import { inputExceedsSoilAtom } from "@/state/protocol/field/field.atoms";
import { useFarmerField } from "@/state/useFarmerField";
import { useHarvestableIndex, useHarvestableIndexLoading, useTotalSoil } from "@/state/useFieldData";
import { useMorning } from "@/state/useSunData";
import { formatter } from "@/utils/format";
import { SizeIcon } from "@radix-ui/react-icons";
import { useAtomValue } from "jotai";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { useAccount } from "wagmi";
import FieldActions from "./field/FieldActions";
import FieldActivity from "./field/FieldActivity";
import FieldStats from "./field/FieldStats";
import FieldTemperatureBarChart from "./field/FieldTemperatureBarChart";
import MorningPanel from "./field/MorningPanel";
import TemperatureChart from "./field/Temperature";

// Add a custom hook to track the current sow amount
function useTotalSowAmount() {
  // Simple hook to simulate fetching the current sow amount
  // In a real implementation, this would fetch from the proper data source
  const [data, setData] = useState<TokenValue | null>(null);
  const { totalSoil } = useTotalSoil();

  // Simulate fetching data - in reality this would use proper data sources
  useEffect(() => {
    // Check localStorage for a debug value to simulate exceeding soil
    const debugExceedSoil = localStorage.getItem("debug_exceed_soil") === "true";

    if (debugExceedSoil && totalSoil) {
      // Set a value higher than available soil for testing
      setData(totalSoil.mul(1.2)); // 120% of available soil
    } else {
      // For now, set to null or some reasonable value
      setData(null);
    }
  }, [totalSoil]);

  return { data, isLoading: false };
}

// TractorButton component
function TractorButton({ onClick }: { onClick: () => void }) {
  const inputExceedsSoil = useAtomValue(inputExceedsSoilAtom);

  return (
    <TractorCard
      label="🚜 Want to Sow with size?"
      subLabel="Set up a Tractor Order to automate Sowing"
      onClick={onClick}
      shouldAnimateZoom={inputExceedsSoil}
      corderBordersDisabled={!inputExceedsSoil}
    />
  );
}

function Field() {
  useUpdateMorningSoilOnInterval();
  const farmerField = useFarmerField();
  const harvestableIndex = useHarvestableIndex();
  const harvestableIndexLoading = useHarvestableIndexLoading();
  const [searchParams] = useSearchParams();
  const isMobile = useIsMobile();
  const [tractorRefreshCounter, setTractorRefreshCounter] = useState(0);
  const [showSowOrder, setShowSowOrder] = useState(false);

  const { address, isConnecting } = useAccount();

  const isPodsLoading = (!address && isConnecting) || farmerField.isLoading;

  const refreshTractorOrders = useCallback(() => {
    setTractorRefreshCounter((prev) => prev + 1);
  }, []);

  const currentAction = searchParams.get("action");

  // Set the active tab (default to 'activity' or 'pods' on mobile)
  const [activeTab, setActiveTab] = useState(() => {
    // Get tab from query params if available
    const tabParam = searchParams.get("tab");

    // On mobile devices, default to 'pods'
    if (isMobile) {
      return tabParam === "activity" || tabParam === "pods" || tabParam === "tractor" ? tabParam : "pods";
    }

    // On desktop, use the param or default to 'activity'
    return tabParam === "activity" || tabParam === "pods" || tabParam === "tractor" ? tabParam : "activity";
  });

  // On mobile, if the tab is not 'pods', set it to 'pods'
  useEffect(() => {
    if (isMobile) {
      const tabParams = searchParams.get("tab");
      if (tabParams !== "pods") {
        setActiveTab("pods");
      }
    }
  }, [isMobile]);

  // Effect to update activeTab when URL parameters change
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "activity" || tabParam === "pods" || tabParam === "tractor") {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const hasPods = farmerField.plots.length > 0;
  const totalPods = useMemo(
    () =>
      farmerField.plots.reduce(
        (total, plot) =>
          total
            .add(plot.unharvestablePods ?? TokenValue.ZERO) // Add non-harvestable pods
            .add(plot.harvestablePods ?? TokenValue.ZERO), // Add harvestable pods (or 0 if undefined)
        TokenValue.ZERO,
      ),
    [farmerField.plots],
  );

  const navigate = useNavigate();

  const morning = useMorning();

  const showInfos = !isMobile || (!currentAction && isMobile);

  return (
    <PageContainer variant="xlAltField">
      {/* <div className="flex flex-col w-full items-center"> */}
      <div className="flex flex-col lg:flex-row justify-between gap-14 mt-0 sm:mt-0">
        <div className="flex flex-col w-full gap-4 sm:gap-8">
          {showInfos && (
            <Col className="gap-4">
              <div className="flex flex-col gap-4">
                <div className="pinto-h2 sm:pinto-h1">Field</div>
                <div className="pinto-sm sm:pinto-body-light text-pinto-light sm:text-pinto-light">
                  Lend Pinto to the protocol to earn interest.
                </div>
              </div>
              <ReadMoreField />
            </Col>
          )}
          {currentAction && isMobile && (
            <Button variant={"outline"} rounded="full" noPadding className="h-9 w-9 sm:h-12 sm:w-12">
              <Link to={`/field`}>
                <img src={backArrowIcon} alt="go to previous page" className="h-6 w-6 sm:h-8 sm:w-8" />
              </Link>
            </Button>
          )}
          {showInfos && <Separator />}
          <MorningPanel />
          <FieldStats />
          <FieldCharts show={showInfos} />
          {showInfos && (
            <div className="flex flex-row items-center justify-between rounded-[1rem] p-4 sm:p-6 bg-pinto-off-white border-pinto-gray-2 border w-full">
              <div className="flex flex-col gap-2">
                <div className="pinto-sm sm:pinto-body-light text-pinto-light sm:text-pinto-light flex flex-row gap-1 items-center">
                  Pods which have become Harvestable
                  <TooltipSimple
                    variant="gray"
                    content="Debt repaid to Pod holders since deployment. These Pods do not count towards the current Pod Line"
                  />
                </div>
                <TextSkeleton loading={harvestableIndexLoading} desktopHeight="h3" height="h4" className="w-20">
                  <div className="pinto-h4 sm:pinto-h3">{formatter.noDec(harvestableIndex)}</div>
                </TextSkeleton>
              </div>
              <Button asChild variant={"outline"} className="rounded-full text-[1rem] sm:text-[1.25rem]">
                <Link
                  to="/explorer/field"
                  onClick={() =>
                    trackSimpleEvent(ANALYTICS_EVENTS.FIELD.EXPLORER_LINK_CLICK, {
                      source_page: "field",
                      destination: "/explorer/field",
                    })
                  }
                >
                  View Data
                </Link>
              </Button>
            </div>
          )}
          {showInfos && (
            <>
              <div className="flex flex-row justify-between items-center overflow-x-auto scrollbar-none">
                <div className="flex space-x-1">
                  <button
                    type="button"
                    className={`hidden sm:block pinto-h3 py-2 pr-4 pl-0 text-left ${activeTab === "activity" ? "text-pinto-secondary" : "text-pinto-gray-4"}`}
                    onClick={() => {
                      trackSimpleEvent(ANALYTICS_EVENTS.FIELD.TAB_CLICK, {
                        previous_tab: activeTab,
                        new_tab: "activity",
                      });
                      setActiveTab("activity");
                      const params = new URLSearchParams(window.location.search);
                      params.set("tab", "activity");
                      navigate(`/field?${params.toString()}`);
                    }}
                  >
                    Field Activity
                  </button>
                  <button
                    type="button"
                    className={`hidden sm:block pinto-h3 py-2 pr-4 pl-0 text-left ${activeTab === "tractor" ? "text-pinto-secondary" : "text-pinto-gray-4"}`}
                    onClick={() => {
                      trackSimpleEvent(ANALYTICS_EVENTS.FIELD.TAB_CLICK, {
                        previous_tab: activeTab,
                        new_tab: "tractor",
                      });
                      setActiveTab("tractor");
                      const params = new URLSearchParams(window.location.search);
                      params.set("tab", "tractor");
                      navigate(`/field?${params.toString()}`);
                    }}
                  >
                    My Tractor Orders
                  </button>
                  <button
                    type="button"
                    className={`pinto-h3 py-2 pr-4 pl-0 text-left ${activeTab === "pods" ? "text-pinto-secondary" : "text-pinto-gray-4"}`}
                    onClick={() => {
                      trackSimpleEvent(ANALYTICS_EVENTS.FIELD.TAB_CLICK, {
                        previous_tab: activeTab,
                        new_tab: "pods",
                      });
                      setActiveTab("pods");
                      const params = new URLSearchParams(window.location.search);
                      params.set("tab", "pods");
                      navigate(`/field?${params.toString()}`);
                    }}
                  >
                    My Pods
                  </button>
                </div>

                <div className="flex flex-row gap-2 items-center">
                  <img src={podIcon} className="w-8 h-8" alt={"total pods"} />
                  <TextSkeleton loading={isPodsLoading} height="h3" className="w-20">
                    <div className="pinto-h3">{formatter.number(totalPods)}</div>
                  </TextSkeleton>
                </div>
              </div>

              {activeTab === "activity" && <FieldActivity />}
              {activeTab === "pods" && (
                <div>{hasPods ? <PlotsTable showClaimable disableHover /> : <EmptyTable type="plots-field" />}</div>
              )}
              {activeTab === "tractor" && (
                <div className="w-full">
                  <TractorSowOrdersPanel
                    refreshData={tractorRefreshCounter}
                    onCreateOrder={() => setShowSowOrder(true)}
                  />
                </div>
              )}
            </>
          )}
        </div>
        {/*
         * Right side
         */}
        <div className="flex flex-col gap-6 w-full mb-14 sm:mb-0 lg:max-w-[384px] 3xl:max-w-[518px] 3xl:min-w-[425px] lg:mt-[5.25rem]">
          {(!isMobile || (currentAction && isMobile)) && (
            <div className="relative">
              <OnlyMorningCard onlyMorning className="p-4 w-full">
                <FieldActions onTractorOrderPublished={refreshTractorOrders} />
              </OnlyMorningCard>
              {showSowOrder && (
                <AnimateSowOrderDialog className="absolute inset-x-0 -top-[calc(-1rem)] z-10">
                  <Card className="rounded-xl z-10 mx-auto w-[95%]" id="sow-order-dialog">
                    <div className="flex flex-col w-full items-center p-4">
                      <SowOrderDialog
                        open={showSowOrder}
                        onOpenChange={setShowSowOrder}
                        onOrderPublished={refreshTractorOrders}
                      />
                    </div>
                  </Card>
                </AnimateSowOrderDialog>
              )}
            </div>
          )}
          {!isMobile && (
            <TractorButton
              onClick={() => {
                trackSimpleEvent(ANALYTICS_EVENTS.FIELD.TRACTOR_BUTTON_CLICK, {
                  source_page: "field",
                });
                setShowSowOrder(true);
              }}
            />
          )}
          {!isMobile && (
            <div className="p-2 rounded-[1rem] bg-pinto-off-white border-pinto-gray-2 border flex flex-col gap-2">
              <Button
                asChild
                className="w-full"
                variant="silo-action"
                disabled={totalPods.isZero}
                onClick={(e) => {
                  if (totalPods.isZero) {
                    e.preventDefault();
                    e.stopPropagation();
                  } else {
                    trackSimpleEvent(ANALYTICS_EVENTS.FIELD.SEND_PODS_CLICK, {
                      source_page: "field",
                      destination: "/transfer/pods",
                    });
                  }
                }}
              >
                <NavLink to="/transfer/pods" className="flex flex-row gap-2 items-center">
                  <div className="rounded-full bg-pinto-green h-6 w-6 flex justify-evenly">
                    <span className="self-center items-center">
                      <LeftArrowIcon color={"white"} height={"1rem"} width={"1rem"} />
                    </span>
                  </div>
                  Send Pods
                </NavLink>
              </Button>
              <Button asChild variant="silo-action" className="w-full">
                <NavLink
                  to="/market/pods"
                  className="flex flex-row gap-2 items-center"
                  onClick={() =>
                    trackSimpleEvent(ANALYTICS_EVENTS.FIELD.MARKET_PODS_CLICK, {
                      source_page: "field",
                      destination: "/market/pods",
                    })
                  }
                >
                  <div className="rounded-full bg-pinto-green h-6 w-6 flex justify-evenly">
                    <span className="self-center items-center">
                      <UpDownArrowsIcon color={"white"} height={"1rem"} width={"1rem"} />
                    </span>
                  </div>
                  Buy or sell Pods in the Market
                </NavLink>
              </Button>
            </div>
          )}
          {!currentAction && (
            <MobileActionBar>
              <Button
                onClick={() => {
                  trackSimpleEvent(ANALYTICS_EVENTS.FIELD.MOBILE_HARVEST_CLICK, {
                    source_page: "field",
                    destination: "/field?action=harvest",
                  });
                  navigate(`/field?action=harvest`);
                }}
                rounded={"full"}
                variant={"outline-secondary"}
                className="pinto-sm-bold text-sm flex-1 flex h-full"
              >
                Harvest
              </Button>
              <Button
                onClick={() => {
                  trackSimpleEvent(ANALYTICS_EVENTS.FIELD.MOBILE_SOW_CLICK, {
                    source_page: "field",
                    destination: "/field?action=sow",
                    is_morning: morning.isMorning,
                  });
                  navigate(`/field?action=sow`);
                }}
                rounded={"full"}
                className={`pinto-sm-bold text-sm flex-1 flex h-full transition-colors ${morning.isMorning ? "bg-pinto-morning-orange text-pinto-morning" : ""}`}
              >
                Sow
              </Button>
            </MobileActionBar>
          )}
        </div>
      </div>
    </PageContainer>
  );
}

export default Field;

const FieldCharts = ({ show }: { show: boolean }) => {
  const { isMorning } = useMorning();

  if (!show) return null;

  return (
    <>
      {isMorning && <MorningTemperatureChart />}
      {!isMorning && (
        <TemperatureChart chartWrapperClassName="h-[200px] sm:h-[300px]" className="h-[325px] sm:h-[435px]" />
      )}
      <FieldTemperatureBarChart />
    </>
  );
};

const initialValue = { field: false };

const ReadMoreField = () => {
  const [learnDidVisit, setLearnDidVisit] = useLocalStorage<{ field: boolean }>(
    "pinto-learn-state-field",
    initialValue,
    { initializeIfEmpty: true },
  );

  // Set the learnDidVisit state to true if it is not already true
  useEffect(() => {
    if (learnDidVisit.field) return;
    setLearnDidVisit({ field: true });
  }, []);

  return (
    <ReadMoreAccordion defaultOpen={false}>
      <>
        Pinto can be lent (Sown) to the protocol in exchange for Pods, protocol-native debt issued with a fixed interest
        rate. Pods function as zero coupon bonds that become redeemable (Harvestable) for 1 Pinto each on a first in,
        first out (FIFO) basis when new Pinto are minted.
        <br />
        When the time-weighted average Pinto price over the previous Season is over $1, new Pinto are minted, 48.5% of
        which are distributed to Pod holders.
        <br />
        Soil is the amount of Pinto the protocol is willing to purchase on the open market and Temperature is the
        interest rate it will pay. At the beginning of each Season (i.e., the top of each hour), the Soil and maximum
        Temperature are set based on protocol state.
      </>
    </ReadMoreAccordion>
  );
};
