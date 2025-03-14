import backArrowIcon from "@/assets/misc/LeftArrow.svg";
import podIcon from "@/assets/protocol/Pod.png";
import { TokenValue } from "@/classes/TokenValue";
import EmptyTable from "@/components/EmptyTable";

import { LeftArrowIcon, UpDownArrowsIcon } from "@/components/Icons";
import { OnlyMorningCard } from "@/components/MorningCard";
import PlotsTable from "@/components/PlotsTable";
import { Button } from "@/components/ui/Button";
import PageContainer from "@/components/ui/PageContainer";
import { Separator } from "@/components/ui/Separator";
import Text from "@/components/ui/Text";
import MorningTemperatureChart from "@/pages/field/MorningTemperature";
import {
  useUpdateMorningSoilOnInterval,
  useUpdateMorningTemperatureOnInterval,
} from "@/state/protocol/field/field.updater";

import MobileActionBar from "@/components/MobileActionBar";
import TooltipSimple from "@/components/TooltipSimple";
import IconImage from "@/components/ui/IconImage";
import { Skeleton } from "@/components/ui/Skeleton";
import useIsMobile from "@/hooks/display/useIsMobile";
import useFarmerField from "@/state/useFarmerField";
import { useHarvestableIndex, useHarvestableIndexLoading } from "@/state/useFieldData";
import { useMorning } from "@/state/useSunData";
import { formatter } from "@/utils/format";
import { useMemo } from "react";
import { Link, NavLink, useNavigate, useSearchParams } from "react-router-dom";
import FieldActions from "./field/FieldActions";
import FieldStats from "./field/FieldStats";
import MorningPanel from "./field/MorningPanel";
import TemperatureChart from "./field/Temperature";

function Field() {
  useUpdateMorningTemperatureOnInterval();
  useUpdateMorningSoilOnInterval();
  const farmerField = useFarmerField();
  const harvestableIndex = useHarvestableIndex();
  const harvestableIndexLoading = useHarvestableIndexLoading();

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

  const isMobile = useIsMobile();
  const [params] = useSearchParams();
  const currentAction = params.get("action");

  const morning = useMorning();

  return (
    <PageContainer variant="xlAltField">
      {/* <div className="flex flex-col w-full items-center"> */}
      <div className="flex flex-col lg:flex-row justify-between gap-14 mt-0 sm:mt-0">
        <div className="flex flex-col w-full gap-4 sm:gap-8">
          {(!isMobile || (!currentAction && isMobile)) && (
            <div className="flex flex-col gap-4">
              <div className="pinto-h2 sm:pinto-h1">Field</div>
              <div className="pinto-sm sm:pinto-body-light text-pinto-light sm:text-pinto-light">
                Lend in the decentralized credit facility for Pods, the Pinto debt asset.
              </div>
              <div className="hidden sm:block pinto-sm sm:pinto-body-light text-pinto-light sm:text-pinto-light">
                Pods become redeemable for Pinto 1:1 when they reach the front of the Pod Line.
              </div>
            </div>
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
                <div className="pinto-h4 sm:pinto-h3">
                  {harvestableIndexLoading ? (
                    <Skeleton className="flex w-20 h-4 sm:w-24 sm:h-[2.2rem] rounded-[0.75rem]" />
                  ) : (
                    formatter.noDec(harvestableIndex)
                  )}
                </div>
                <Button asChild variant={"outline"} className="rounded-full text-[1rem] sm:text-[1.25rem]">
                  <Link to={"/explorer/field"}>View Data</Link>
                </Button>
              </div>
            </div>
          )}
          {(!isMobile || (!currentAction && isMobile)) && (
            <div className="flex flex-row justify-between items-center">
              <div className="pinto-h3">My Pods</div>
              <div className="flex flex-row gap-2 items-center">
                <img src={podIcon} className="w-8 h-8" alt={"total pods"} />
                {harvestableIndexLoading ? (
                  <Skeleton className="w-6 h-8" />
                ) : (
                  <div className="pinto-h3">{formatter.number(totalPods)}</div>
                )}
              </div>
            </div>
          )}
          {(!isMobile || (!currentAction && isMobile)) && (
            <div>{hasPods ? <PlotsTable showClaimable disableHover /> : <EmptyTable type="plots-field" />}</div>
          )}
        </div>
        {/*
         * Right side
         */}
        <div className="flex flex-col gap-6 w-full mb-14 sm:mb-0 lg:max-w-[384px] 3xl:max-w-[518px] 3xl:min-w-[425px] lg:mt-[5.25rem]">
          {(!isMobile || (currentAction && isMobile)) && (
            <OnlyMorningCard onlyMorning className="p-4 w-full">
              <FieldActions />
            </OnlyMorningCard>
          )}
          {/* <div className="p-4 rounded-[1.25rem] bg-pinto-off-white border-pinto-gray-2 border"></div> */}
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
