import podIcon from "@/assets/protocol/Pod.png";
import AddressLink from "@/components/AddressLink";
import { Label } from "@/components/ui/Label";
import { useFarmerBeanstalkRepayment } from "@/state/useFarmerBeanstalkRepayment";
import { formatter } from "@/utils/format";
import { computeSummaryRange } from "@/utils/podTransferUtils";
import { useMemo } from "react";
import { PodTransferData } from "../TransferBeanstalkPods";

interface FinalStepProps {
  destination: string | undefined;
  transferData: PodTransferData[];
}

export default function FinalStep({ destination, transferData }: FinalStepProps) {
  const harvestableIndex = useFarmerBeanstalkRepayment().pods.harvestableIndex;

  const summary = useMemo(() => {
    if (transferData.length === 0) return null;
    return computeSummaryRange(transferData, harvestableIndex);
  }, [transferData, harvestableIndex]);

  if (!destination || !summary) {
    return null;
  }

  const { totalPods, placeInLineStart, placeInLineEnd } = summary;
  const isSinglePlot = transferData.length === 1;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Label className="font-[340] text-[1rem] sm:text-[1.25rem] mb-2">I'm sending</Label>
        <div className="flex flex-col gap-4">
          <div className="pinto-h4 sm:pinto-h3 text-pinto-secondary sm:text-pinto-secondary flex flex-col gap-2 sm:flex-row sm:gap-1.5 place-self-end">
            <div className="flex flex-row gap-1.5 items-center place-self-end sm:place-self-auto">
              <span>{formatter.number(totalPods)}</span>
              <img src={podIcon} className="h-8 w-8" alt="Plot" />
              <span>Pods</span>
            </div>
            <div className="pinto-xs sm:pinto-h3 text-pinto-gray-4 sm:text-pinto-secondary flex flex-row gap-1.5 place-self-end sm:place-self-auto">
              {isSinglePlot ? (
                <>
                  <span className="text-pinto-gray-3">@</span>
                  <span>{formatter.number(placeInLineStart)} in Line</span>
                </>
              ) : (
                <span>
                  between {formatter.number(placeInLineStart)} - {formatter.number(placeInLineEnd)} in Line
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      <div>
        <Label className="font-[340] text-[1rem] sm:text-[1.25rem]">To the following address</Label>
        <AddressLink address={destination} />
      </div>
    </div>
  );
}
