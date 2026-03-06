import AddressLink from "@/components/AddressLink";
import { Label } from "@/components/ui/Label";
import { formatter } from "@/utils/format";
import { type FertilizerTransferItem } from "../TransferBeanstalkFertilizer";

interface FinalStepProps {
  destination: string | undefined;
  selectedIds: FertilizerTransferItem[];
}

export default function FinalStep({ destination, selectedIds }: FinalStepProps) {
  if (!destination || selectedIds.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Label className="font-[340] text-[1rem] sm:text-[1.25rem] mb-2">I'm sending</Label>
        <div className="flex flex-col gap-2">
          {selectedIds.map((item) => (
            <div
              key={`transfer_fert_${item.id.toString()}`}
              className="pinto-h4 sm:pinto-h3 text-pinto-secondary sm:text-pinto-secondary flex flex-row gap-1.5 items-center place-self-end"
            >
              <span>{formatter.number(Number(item.value))}</span>
              <span>bsFERT</span>
              <span className="text-pinto-gray-3">ID {formatter.number(Number(item.id))}</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <Label className="font-[340] text-[1rem] sm:text-[1.25rem]">To the following address</Label>
        <AddressLink address={destination} />
      </div>
    </div>
  );
}
