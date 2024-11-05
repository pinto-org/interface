import podIcon from "@/assets/protocol/Pod.png";
import AddressLink from "@/components/AddressLink";
import { Label } from "@/components/ui/Label";
import Text from "@/components/ui/Text";
import { formatter } from "@/utils/format";
import { PodTransferData } from "../TransferPods";

interface FinalStepProps {
  destination: string | undefined;
  transferData: PodTransferData[];
}

export default function FinalStep({ destination, transferData }: FinalStepProps) {
  if (!destination || transferData.length === 0) return null;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Label className="font-[340] text-[1.25rem] mb-2">I'm sending</Label>
        <div className="flex flex-col gap-4">
          {transferData.map((transfer) => {
            const podAmount = transfer.end.sub(transfer.start);
            const plotIndex = transfer.id;

            return (
              <Text
                key={`transfer_plot_${plotIndex.toHuman()}`}
                variant="h3"
                color={"secondary"}
                as="div"
                className="flex flex-row gap-1.5 place-self-end"
              >
                <span>{formatter.number(podAmount)}</span>
                <img src={podIcon} className="h-8 w-8" alt="Plot" />
                <span>Pods</span>
                <span className={"text-pinto-gray-3"}>@</span>
                <span>{formatter.number(plotIndex.add(transfer.start))} in Line</span>
              </Text>
            );
          })}
        </div>
      </div>
      <div>
        <Label className="font-[340] text-[1.25rem]">To the following address</Label>
        <AddressLink address={destination} />
      </div>
    </div>
  );
}
