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

import { useFarmerField } from "@/state/useFarmerField";
import { useHarvestableIndex } from "@/state/useFieldData";
import { useMorning } from "@/state/useSunData";
import { formatter } from "@/utils/format";
import { useEffect, useMemo } from "react";
import { Link, NavLink } from "react-router-dom";
import FieldActions from "./field/FieldActions";
import FieldStats from "./field/FieldStats";
import MorningPanel from "./field/MorningPanel";
import TemperatureChart from "./field/Temperature";

function Field() {
  useUpdateMorningTemperatureOnInterval();
  useUpdateMorningSoilOnInterval();
  const farmerField = useFarmerField();
  const harvestableIndex = useHarvestableIndex();

  const hasPods = farmerField.plots.length > 0;
  const totalPods = useMemo(
    () => farmerField.plots.reduce((total, plot) => total.add(plot.pods), TokenValue.ZERO),
    [farmerField.plots],
  );

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  return (
    <PageContainer variant="xl">
      {/* <div className="flex flex-col w-full items-center"> */}
      <div className="flex flex-col lg:flex-row justify-between gap-14">
        <div className="flex flex-col w-full gap-8">
          <div className="flex flex-col gap-4">
            <Text variant="h1">Field</Text>
            <Text variant="body-light" color="light">
              Lend in the decentralized credit facility for Pods, the Pinto debt asset.
            </Text>
            <Text variant="body-light" color="light">
              Pods become redeemable for Pinto 1:1 when they reach the front of the Pod Line.
            </Text>
          </div>
          <Separator />
          <MorningPanel />
          <FieldStats />
          <DynamicTemperatureChart />
          <div className="flex flex-row items-center justify-between rounded-[1.25rem] p-6 bg-pinto-off-white border-pinto-gray-2 border w-full">
            <div className="flex flex-col gap-2">
              <Text variant="body-light" color="light">
                Previously Harvested Pods which have been redeemed for one Pinto
              </Text>
              <Text variant="h3">{formatter.noDec(harvestableIndex)}</Text>
            </div>
            <Button asChild variant={"outline"} className="rounded-full text-[1.25rem]">
              <Link to={"/explorer/field"}>View Data</Link>
            </Button>
          </div>
          <div className="flex flex-row justify-between items-center">
            <Text variant="h3">My Pods</Text>
            <div className="flex flex-row gap-2 items-center">
              <img src={podIcon} className="w-8 h-8" alt={"total pods"} />
              <Text variant="h3">{formatter.number(totalPods)}</Text>
            </div>
          </div>
          <div>{hasPods ? <PlotsTable showClaimable /> : <EmptyTable type="plots-field" />}</div>
        </div>
        {/*
         * Right side
         */}
        <div className="flex flex-col gap-6 w-full lg:max-w-[518px] lg:min-w-[425px] lg:mt-[84px]">
          <OnlyMorningCard onlyMorning className="p-4 w-full">
            <FieldActions />
          </OnlyMorningCard>
          {/* <div className="p-4 rounded-[1.25rem] bg-pinto-off-white border-pinto-gray-2 border"></div> */}
          <div className="p-4 rounded-[1.25rem] bg-pinto-off-white border-pinto-gray-2 border flex flex-col gap-2">
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
                    <LeftArrowIcon color={"white"} height={16} width={16} />
                  </span>
                </div>
                Send Pods
              </NavLink>
            </Button>
            <Button asChild variant="silo-action" className="w-full">
              <NavLink to="/podmarket" className="flex flex-row gap-2 items-center">
                <div className="rounded-full bg-pinto-green h-6 w-6 flex justify-evenly">
                  <span className="self-center items-center">
                    <UpDownArrowsIcon color={"white"} height={16} width={16} />
                  </span>
                </div>
                Buy or sell Pods in the Market
              </NavLink>
            </Button>
          </div>
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
