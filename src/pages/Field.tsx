import { Separator } from "@/components/ui/Separator";
import fieldIcon from "@/assets/protocol/Field.png";
import { useFieldData } from "@/state/useFieldData";
import { Button } from "@/components/ui/Button";
import PlotsTable from "@/components/PlotsTable";
import FieldActions from "./field/FieldActions";

function Field() {

  const fieldData = useFieldData();

  return (
    <div className="flex flex-col items-center">
        <div className="flex flex-row w-[85%] items-start gap-14">
          <div className="flex flex-col w-[80%] gap-8">
          <div className="flex flex-col gap-2">
            <div className="inline-flex gap-2 items-center">
              <img src={fieldIcon} className="h-12 w-11" />
              <span className="font-[300] text-[3.5rem] text-black">Field</span>
            </div>
            <div className="font-[400] text-xl text-pinto-gray-4">
              Lend in the decentralized credit facility for Pods, the Pinto debt asset.
            </div>
            <div className="font-[400] text-xl text-pinto-gray-4">
              Pods become Harvestable, redeemable for 1 Pinto when they reach the front of the Pod Line.
            </div>
            <a className="font-[400] text-xl text-pinto-green-2 hover:cursor-pointer hover:underline">
              How do my Pods reach the front of the Pod Line?
            </a>
          </div>
        <Separator />
        <div className="flex flex-row justify-between">
          <div>
            <div className="text-black font-[400] text-[1.25rem]">Current Temperature</div>
            <div className="text-pinto-gray-4 font-[400] text-[1rem]">The interest rate for lending Pinto</div>
            <div className="text-black font-[400] text-[2rem]">{`${fieldData.temperature.max.toHuman('short')}%`}</div>
          </div>
          <div>
            <div className="text-black font-[400] text-[1.25rem]">Available Soil</div>
            <div className="text-pinto-gray-4 font-[400] text-[1rem]">The total number of Pinto that can be lent</div>
            <div className="text-black font-[400] text-[2rem]">{`${fieldData.soil.toHuman('short')}`}</div>
          </div>
          <div>
            <div className="text-black font-[400] text-[1.25rem]">Pod Line</div>
            <div className="text-pinto-gray-4 font-[400] text-[1rem]">The length of the queue for Pods to mature</div>
            <div className="text-black font-[400] text-[2rem]">{`${fieldData.podIndex.sub(fieldData.harvestableIndex).toHuman('short')}`}</div>
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
            <div className="text-black text-[2rem]">
              {fieldData.harvestableIndex.toHuman('short')}
            </div>
          </div>
          <Button asChild variant={"outline"} className="rounded-full text-[1.25rem]">
            <a href={"/explorer"}>View Data</a>
          </Button>
        </div>
        <div>
          <div className="text-black text-[2rem] font-[400] mb-8">
            My Pods
          </div>
          <PlotsTable />
        </div>
          </div>
        <div className="w-[500px] mt-32 p-4 rounded-[1.25rem] bg-pinto-off-white border-pinto-gray-2 border">
          <FieldActions />
        </div> 
        </div>
    </div>
  );
}

export default Field;
