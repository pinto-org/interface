import podIcon from "@/assets/protocol/Pod.png";
import { TokenValue } from "@/classes/TokenValue";
import { LeftArrowIcon, UpDownArrowsIcon } from "@/components/Icons";
import PlotsTable from "@/components/PlotsTable";
import { Button } from "@/components/ui/Button";
import PageContainer from "@/components/ui/PageContainer";
import { Separator } from "@/components/ui/Separator";
import Text from "@/components/ui/Text";
import { useFarmerField } from "@/state/useFarmerField";
import { useHarvestableIndex } from "@/state/useFieldData";
import { formatter } from "@/utils/format";
import { useEffect, useMemo } from "react";
import { Link, NavLink } from "react-router-dom";
import FieldActions from "./field/FieldActions";
import FieldStats from "./field/FieldStats";
import MorningPanel, { MorningDev } from "./field/MorningPanel";

function Field() {
  const farmerField = useFarmerField();
  const harvestableIndex = useHarvestableIndex();

  const totalPods = useMemo(
    () => farmerField.plots.reduce((total, plot) => total.add(plot.pods), TokenValue.ZERO),
    [farmerField.plots],
  );

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  return (
    <PageContainer variant="xl">
      <div className="flex flex-col w-full items-center">
        <div className="flex flex-col lg:flex-row justify-between gap-14">
          <div className="flex flex-col w-full gap-8">
            <div className="flex flex-col gap-4 px-4">
              <Text variant="h1">Field</Text>
              <Text variant="body-light" color="light">
                Lend in the decentralized credit facility for Pods, the Pinto debt asset.
              </Text>
              <Text variant="body-light" color="light">
                Pods become Harvestable, redeemable for 1 Pinto when they reach the front of the Pod Line.
              </Text>
            </div>
            <Separator />
            <MorningPanel />
            <FieldStats />
            <TemperatureChart />
            <MorningDev />
            <div className="flex flex-row items-center justify-between rounded-[1.25rem] p-6 bg-pinto-off-white border-pinto-gray-2 border w-full">
              <div className="flex flex-col gap-2">
                <Text variant="body-light" color="light">
                  Previously Harvested Pods which have been redeemed for one Pinto
                </Text>
                <Text variant="h3">{formatter.noDec(harvestableIndex)}</Text>
              </div>
              <Button asChild variant={"outline"} className="rounded-full text-[1.25rem]">
                <Link to={"/explorer"}>View Data</Link>
              </Button>
            </div>
            <div className="flex flex-row justify-between items-center mx-4">
              <Text variant="h3">My Pods</Text>
              <div className="flex flex-row gap-2 items-center">
                <img src={podIcon} className="w-8 h-8" alt={"total pods"} />
                <Text variant="h3">{formatter.number(totalPods)}</Text>
              </div>
            </div>
            <div className="mx-4">
              <PlotsTable />
            </div>
          </div>
          {/*
           * Right side
           */}
          <div className="flex flex-col gap-6 w-full lg:max-w-[518px] lg:min-w-[425px] lg:mt-[84px]">
            <div className="p-4 rounded-[1.25rem] bg-pinto-off-white border-pinto-gray-2 border">
              <FieldActions />
            </div>
            <div className="p-4 rounded-[1.25rem] bg-pinto-off-white border-pinto-gray-2 border flex flex-col gap-2">
              <Button
                variant="ghost"
                className="px-2 hover:hover:bg-pinto-green w-full h-[2.5rem] rounded-[0.75rem] font-[400] text-[1.25rem] text-pinto-gray-5 hover:text-white flex flex-row justify-start gap-[0.625rem]"
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
              <Button
                asChild
                variant="ghost"
                className="px-2 hover:hover:bg-pinto-green w-full h-[2.5rem] rounded-[0.75rem] font-[400] text-[1.25rem] text-pinto-gray-5 hover:text-white flex flex-row justify-start gap-[0.625rem]"
              >
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
      </div>
    </PageContainer>
  );
}

export default Field;

const TemperatureChart = () => {
  return (
    <div className="flex rounded-[1.25rem] p-4 bg-pinto-off-white border-pinto-gray-2 border w-full h-96">
      Temperature chart goes here
    </div>
  );
};
