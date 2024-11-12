import podIcon from "@/assets/protocol/Pod.png";
import { TokenValue } from "@/classes/TokenValue";
import { LeftArrowIcon, UpDownArrowsIcon } from "@/components/Icons";
import PlotsTable from "@/components/PlotsTable";
import { Button } from "@/components/ui/Button";
import { Separator } from "@/components/ui/Separator";
import Text from "@/components/ui/Text";
import { useFarmerField } from "@/state/useFarmerField";
import { useFieldData } from "@/state/useFieldData";
import { formatter } from "@/utils/format";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import FieldActions from "./field/FieldActions";

function Field() {
  const fieldData = useFieldData();
  const farmerField = useFarmerField();

  const totalPods = farmerField.plots.reduce((total, plot) => total.add(plot.pods), TokenValue.ZERO);

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-row w-[85%] items-start gap-14">
        <div className="flex flex-col w-[80%] gap-8">
          <div className="flex flex-col gap-4 mx-4">
            <Text variant="h1">Field</Text>
            <Text variant="body-light" color="light">
              Lend in the decentralized credit facility for Pods, the Pinto debt asset.
            </Text>
            <Text variant="body-light" color="light">
              Pods become Harvestable, redeemable for 1 Pinto when they reach the front of the Pod Line.
            </Text>
            <Text
              variant="body-light"
              as="a"
              href={"https://link.to.pinto/explanation"}
              className="hover:cursor-pointer hover:underline"
              color="green4"
            >
              How do my Pods reach the front of the Pod Line?
            </Text>
          </div>
          <Separator />
          <div className="flex flex-row justify-between mx-4">
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-1">
                <Text variant="body-light">Current Temperature</Text>
                <Text variant="sm" color="light">
                  The interest rate for lending Pinto
                </Text>
              </div>
              <Text variant="h3">{`${fieldData.temperature.max.toHuman("short")}%`}</Text>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-1">
                <Text variant="body-light">Available Soil</Text>
                <Text variant="sm" color="light">
                  The total number of Pinto that can be lent
                </Text>
              </div>
              <Text variant="h3">{fieldData.soil.toHuman("short")}</Text>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-1">
                <Text variant="body-light">Pod Line</Text>
                <Text variant="sm" color="light">
                  The length of the queue for Pods to mature
                </Text>
              </div>
              <Text variant="h3">{formatter.number(fieldData.podIndex.sub(fieldData.harvestableIndex))}</Text>
            </div>
          </div>
          <div className="flex rounded-[1.25rem] p-4 bg-pinto-off-white border-pinto-gray-2 border w-full h-96">
            Temperature chart goes here
          </div>
          <div className="flex flex-row items-center justify-between rounded-[1.25rem] p-6 bg-pinto-off-white border-pinto-gray-2 border w-full">
            <div className="flex flex-col gap-2">
              <Text variant="body-light" color="light">
                Previously Harvested Pods which have been redeemed for one Pinto
              </Text>
              <Text variant="h3">{fieldData.harvestableIndex.toHuman("short")}</Text>
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
        <div className="w-[500px] mt-32 flex flex-col gap-6">
          <div className="p-4 rounded-[1.25rem] bg-pinto-off-white border-pinto-gray-2 border">
            <FieldActions />
          </div>
          <div className="p-4 rounded-[1.25rem] bg-pinto-off-white border-pinto-gray-2 border flex flex-col gap-2">
            <Button
              variant="ghost"
              className="px-2 hover:hover:bg-pinto-green w-full h-[2.5rem] rounded-[0.75rem] font-[400] text-[1.25rem] text-pinto-gray-5 hover:text-white flex flex-row justify-start gap-[0.625rem]"
            >
              <div className="rounded-full bg-pinto-green h-6 w-6 flex justify-evenly">
                <span className="self-center items-center">
                  <LeftArrowIcon color={"white"} height={16} width={16} />
                </span>
              </div>
              Send Pods
            </Button>
            <Button
              variant="ghost"
              className="px-2 hover:hover:bg-pinto-green w-full h-[2.5rem] rounded-[0.75rem] font-[400] text-[1.25rem] text-pinto-gray-5 hover:text-white flex flex-row justify-start gap-[0.625rem]"
            >
              <div className="rounded-full bg-pinto-green h-6 w-6 flex justify-evenly">
                <span className="self-center items-center">
                  <UpDownArrowsIcon color={"white"} height={16} width={16} />
                </span>
              </div>
              Buy or sell Pods in the Market
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Field;
