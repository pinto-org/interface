import { Separator } from "@/components/ui/Separator";
import fieldIcon from "@/assets/protocol/Field.png";
import podIcon from "@/assets/protocol/Pod.png";
import { useFieldData } from "@/state/useFieldData";
import { Button } from "@/components/ui/Button";
import PlotsTable from "@/components/PlotsTable";
import FieldActions from "./field/FieldActions";
import { Link } from "react-router-dom";
import { LeftArrowIcon, UpDownArrowsIcon } from "@/components/Icons";
import Text from "@/components/ui/Text";
import { useFarmerField } from "@/state/useFarmerField";
import { TokenValue } from "@/classes/TokenValue";
import { formatter } from "@/utils/format";

function Field() {
  const fieldData = useFieldData();
  const farmerField = useFarmerField();

  const totalPods = farmerField.plots.reduce((total, plot) => total.add(plot.pods), TokenValue.ZERO);

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-row w-[85%] items-start gap-14">
        <div className="flex flex-col w-[80%] gap-8">
          <div className="flex flex-col gap-2">
            <div className="inline-flex gap-2 items-center">
              <img src={fieldIcon} className="h-12 w-11" alt={"field"} />
              <span className="font-[300] text-[3.5rem] text-black">Field</span>
            </div>
            <div className="font-[400] text-xl text-pinto-gray-4">
              Lend in the decentralized credit facility for Pods, the Pinto debt asset.
            </div>
            <div className="font-[400] text-xl text-pinto-gray-4">
              Pods become Harvestable, redeemable for 1 Pinto when they reach the front of the Pod Line.
            </div>
            <a
              href={"https://link.to.pinto/explanation"}
              className="font-[400] text-xl text-pinto-green-4 hover:cursor-pointer hover:underline"
            >
              How do my Pods reach the front of the Pod Line?
            </a>
          </div>
          <Separator />
          <div className="flex flex-row justify-between">
            <div>
              <div className="text-black font-[400] text-[1.25rem]">Current Temperature</div>
              <div className="text-pinto-gray-4 font-[400] text-[1rem]">The interest rate for lending Pinto</div>
              <div className="text-black font-[400] text-[2rem]">{`${fieldData.temperature.max.toHuman("short")}%`}</div>
            </div>
            <div>
              <div className="text-black font-[400] text-[1.25rem]">Available Soil</div>
              <div className="text-pinto-gray-4 font-[400] text-[1rem]">The total number of Pinto that can be lent</div>
              <div className="text-black font-[400] text-[2rem]">{`${fieldData.soil.toHuman("short")}`}</div>
            </div>
            <div>
              <div className="text-black font-[400] text-[1.25rem]">Pod Line</div>
              <div className="text-pinto-gray-4 font-[400] text-[1rem]">The length of the queue for Pods to mature</div>
              <div className="text-black font-[400] text-[2rem]">{`${fieldData.podIndex.sub(fieldData.harvestableIndex).toHuman("short")}`}</div>
            </div>
          </div>
          <div className="flex rounded-[1.25rem] p-4 bg-pinto-off-white border-pinto-gray-2 border w-full h-96">
            Temperature chart goes here
          </div>
          <div className="flex flex-row items-center justify-between rounded-[1.25rem] p-4 bg-pinto-off-white border-pinto-gray-2 border w-full">
            <div className="flex flex-col">
              <div className="text-pinto-gray-4 text-[1.25rem]">
                Previously Harvested Pods which have been redeemed for one Pinto
              </div>
              <div className="text-black text-[2rem]">{fieldData.harvestableIndex.toHuman("short")}</div>
            </div>
            <Button asChild variant={"outline"} className="rounded-full text-[1.25rem]">
              <Link to={"/explorer"}>View Data</Link>
            </Button>
          </div>
          <div>
            <div className="flex flex-row justify-between">
              <div className="text-black text-[2rem] font-[400] mb-8">My Pods</div>
              <div className="flex flex-row gap-2 items-center">
                <img src={podIcon} className="w-8 h-8" alt={"total pods"} />
                <Text variant="h3">{formatter.number(totalPods)}</Text>
              </div>
            </div>
            <PlotsTable />
          </div>
        </div>
        <div className="w-[500px] mt-32 flex flex-col gap-6">
          <div className="p-4 rounded-[1.25rem] bg-pinto-off-white border-pinto-gray-2 border">
            <FieldActions />
          </div>
          <div className="p-2 rounded-[1.25rem] bg-pinto-off-white border-pinto-gray-2 border flex flex-col gap-2">
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
