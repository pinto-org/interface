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
import MorningTemperatureChart from "@/pages/field/MorningTemperature";
import {
  useUpdateMorningSoilOnInterval,
  useUpdateMorningTemperatureOnInterval,
} from "@/state/protocol/field/field.updater";

import AccordionGroup, { IBaseAccordionContent } from "@/components/AccordionGroup";
import { Col } from "@/components/Container";
import CornerBorders from "@/components/CornerBorders";
import MobileActionBar from "@/components/MobileActionBar";
import ReadMoreAccordion from "@/components/ReadMoreAccordion";
import SowOrderDialog, { AnimateSowOrderDialog } from "@/components/SowOrderDialog";
import TextSkeleton from "@/components/TextSkeleton";
import TooltipSimple from "@/components/TooltipSimple";
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
import MorningPanel from "./field/MorningPanel";
import TemperatureChart from "./field/Temperature";
import TractorOrdersPanel from "./field/TractorOrdersPanel";

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
  const [hoveredTractor, setHoveredTractor] = useState(false);
  const { totalSoil, isLoading: totalSoilLoading } = useTotalSoil();
  // Use the atom value directly instead of localStorage
  const inputExceedsSoil = useAtomValue(inputExceedsSoilAtom);

  // Create the animation styles on mount
  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.innerHTML = `
      @keyframes pulse-scale {
        0%, 100% { transform: scale(0.98); }
        50% { transform: scale(1.02); }
      }
    `;
    document.head.appendChild(styleEl);

    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={onClick}
        className="group box-border flex flex-col items-start p-4 gap-1 w-full rounded-[1rem] transition-colors duration-200 bg-white border border-pinto-gray-2 relative"
        onMouseEnter={() => setHoveredTractor(true)}
        onMouseLeave={() => setHoveredTractor(false)}
        style={{
          ...(inputExceedsSoil || hoveredTractor
            ? {
                backgroundColor: "#E5F5E5",
                borderColor: "#387F5C",
              }
            : {}),
          // If input exceeds soil, apply special highlight styling
          ...(inputExceedsSoil && {
            boxShadow: "0 0 0 2px rgba(56, 127, 92, 0.5)",
            animation: "pulse-scale 1.5s ease-in-out infinite",
          }),
        }}
      >
        {/* Position the icon absolutely to place it on the right side and vertically centered */}
        <SizeIcon
          className={`absolute top-1/2 right-4 transform -translate-y-1/2 w-5 h-5 text-[#404040] ${
            inputExceedsSoil || hoveredTractor ? "hidden" : "block"
          }`}
        />

        <div className="flex flex-row items-center gap-1">
          <span className={`pinto-h4 ${inputExceedsSoil || hoveredTractor ? "text-pinto-green-4" : "text-[#404040]"}`}>
            🚜 Want to Sow with size?
          </span>
        </div>
        <span
          className={`pinto-body-light ${inputExceedsSoil || hoveredTractor ? "text-pinto-green-3" : "text-[#9C9C9C]"}`}
        >
          Set up a Tractor Order to automate Sowing
        </span>
      </button>
      <CornerBorders rowNumber={0} active={hoveredTractor} standalone={true} cornerRadius="1rem" />
    </div>
  );
}

function Field() {
  useUpdateMorningTemperatureOnInterval();
  useUpdateMorningSoilOnInterval();
  const farmerField = useFarmerField();
  const harvestableIndex = useHarvestableIndex();
  const harvestableIndexLoading = useHarvestableIndexLoading();
  const [searchParams] = useSearchParams();
  const isMobile = useIsMobile();
  const [tractorRefreshCounter, setTractorRefreshCounter] = useState(0);
  const [showSowOrder, setShowSowOrder] = useState(false);
  const [shouldHideShowOrders, setShouldHideShowOrders] = useState(false);

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

  return (
    <PageContainer variant="xlAltField">
      {/* <div className="flex flex-col w-full items-center"> */}
      <div className="flex flex-col lg:flex-row justify-between gap-14 mt-0 sm:mt-0">
        <div className="flex flex-col w-full gap-4 sm:gap-8">
          {(!isMobile || (!currentAction && isMobile)) && (
            <Col className="gap-2">
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
          {(!isMobile || (!currentAction && isMobile)) && <Separator />}
          <MorningPanel />
          <FieldStats />
          {(!isMobile || (!currentAction && isMobile)) && <DynamicTemperatureChart />}
          {(!isMobile || (!currentAction && isMobile)) && (
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
                <Link to="/explorer/field">View Data</Link>
              </Button>
            </div>
          )}

          {(!isMobile || (!currentAction && isMobile)) && (
            <>
              <div className="flex flex-row justify-between items-center overflow-x-auto scrollbar-none">
                <div className="flex space-x-1">
                  <button
                    type="button"
                    className={`pinto-h3 py-2 pr-4 pl-0 text-left ${activeTab === "activity" ? "text-pinto-secondary" : "text-pinto-gray-4"}`}
                    onClick={() => {
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
                    className={`pinto-h3 py-2 pr-4 pl-0 text-left ${activeTab === "tractor" ? "text-pinto-secondary" : "text-pinto-gray-4"}`}
                    onClick={() => {
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
                  <TractorOrdersPanel refreshData={tractorRefreshCounter} onCreateOrder={() => setShowSowOrder(true)} />
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
          {!isMobile && <TractorButton onClick={() => setShowSowOrder(true)} />}
          {!isMobile && (
            <div className="p-2 rounded-[1rem] bg-pinto-off-white border-pinto-gray-2 border flex flex-col gap-2">
              <Button
                className="w-full"
                variant="silo-action"
                disabled={totalPods.isZero}
                onClick={(e) => {
                  if (totalPods.isZero) {
                    e.preventDefault();
                    e.stopPropagation();
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
                <NavLink to="/market/pods" className="flex flex-row gap-2 items-center">
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
          <AccordionGroup groupTitle="Frequently Asked Questions" items={FieldFAQ} allExpanded={false} size="small" />
          {!currentAction && (
            <MobileActionBar>
              <Button
                onClick={() => navigate(`/field?action=harvest`)}
                rounded={"full"}
                variant={"outline-secondary"}
                className="pinto-sm-bold text-sm flex-1 flex h-full"
              >
                Harvest
              </Button>
              <Button
                onClick={() => navigate(`/field?action=sow`)}
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

export const DynamicTemperatureChart = () => {
  const { isMorning } = useMorning();

  if (isMorning) {
    return <MorningTemperatureChart />;
  } else {
    return <TemperatureChart />;
  }
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
    <ReadMoreAccordion defaultOpen={!learnDidVisit.field}>
      <>
        Pinto can be lent to the protocol in exchange for a fixed interest rate bond, where the rate payback is a
        function of Pinto supply growth. The debt to the user is represented by Pods, which are defined by their
        position in the Pod Line. Soil is the amount of Pinto the protocol is willing to purchase on the open market and
        temperature is the interest rate it will pay. Each season the Soil and maximum Temperature are set based on
        Protocol state. When Pinto is priced over $1 new Pinto is minted with 48.5% being distributed to lenders in the
        Field. Loans are paid back in first in first out (FIFO) ordering.
      </>
    </ReadMoreAccordion>
  );
};

const FieldFAQ: IBaseAccordionContent[] = [
  {
    key: "what-are-pods",
    title: "What are Pods?",
    content:
      "Pods are the native debt asset of the Pinto protocol. They are minted when a user Sows Pinto in the Field. Pods are represented by their position in the Pod Line and mature on a first in first out (FIFO) basis. 48.5% of new Pinto mints are used to pay off Pods in the Pod Line.",
  },
  {
    key: "what-is-soil",
    title: "What is Soil?",
    content:
      "Soil is the amount of Pinto the protocol is willing to borrow in a given Season. The protocol issues debt every Season, but the exact Soil available varies with system conditions.",
  },
  {
    key: "what-is-temperature",
    title: "What is Temperature?",
    content:
      "Temperature is the interest rate for Pods. It adjusts incrementally each season based on prior market activity, with no fixed cap to avoid systemic risk.",
  },
  {
    key: "what-is-the-morning-auction",
    title: "What is the Morning Auction?",
    content:
      "The Morning Auction is a Dutch Auction where Temperature increases over the first 10 minutes of each Season. When demand for Soil is high at max Temperature, Farmers may choose to purchase Pods earlier—at lower rates—to avoid a longer pod line as the protocol reduces Temperature over time.",
  },
  {
    key: "how-can-i-learn-more-about-the-field",
    title: "How can I learn more about the Field?",
    content: (
      <>
        Head to the{" "}
        <Link
          className="text-pinto-green-4 hover:underline transition-all"
          to={`${navLinks.docs}/farm/field`}
          rel="noopener noreferrer"
          target="_blank"
        >
          Pinto docs
        </Link>{" "}
        for more info, or ask any questions in the{" "}
        <Link
          className="text-pinto-green-4 hover:underline transition-all"
          to={navLinks.discord}
          rel="noopener noreferrer"
          target="_blank"
        >
          discord
        </Link>{" "}
        community!
      </>
    ),
  },
] as const;
