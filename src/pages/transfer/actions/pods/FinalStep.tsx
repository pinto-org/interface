import { Label } from "@/components/ui/Label";
import AddressLink from "@/components/AddressLink";
import podIcon from "@/assets/protocol/Pod.png";
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
                        <div
                            key={`transfer_plot_${plotIndex.toHuman()}`}
                            className="flex flex-row gap-1.5 items-center font-[340] text-[2rem] text-pinto-gray-5"
                        >
                            <span>{podAmount.reDecimal(2).toHuman()}</span>
                            <img src={podIcon} className="h-8 w-8" alt="Plot" />
                            <span>Pods</span>
                            <span className="text-pinto-gray-3">@</span>
                            <span className="font-[340] text-[2rem] text-pinto-gray-5">
                                {plotIndex.add(transfer.start).reDecimal(2).toHuman()} in Line
                            </span>
                        </div>
                    );
                })}
            </div>
            </div>
            <div>
                <Label>To the following address</Label>
                <AddressLink address={destination} />
            </div>
        </div>
    );
}