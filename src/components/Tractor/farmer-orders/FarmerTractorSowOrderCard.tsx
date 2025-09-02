import pintoIcon from "@/assets/tokens/PINTO.png";
import { TokenValue } from "@/classes/TokenValue";
import { Col, Row } from "@/components/Container";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import IconImage from "@/components/ui/IconImage";
import {
  PublisherTractorExecution,
  TractorRequisitionEvent as RequisitionEvent,
  SowBlueprintData,
} from "@/lib/Tractor";
import { formatter } from "@/utils/format";
import { getTokenNameByIndex } from "@/utils/token";
import { CalendarIcon, ClockIcon, CornerBottomLeftIcon, Cross1Icon, Pencil1Icon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import React from "react";

interface FarmerTractorSowOrderCardProps {
  req: RequisitionEvent<SowBlueprintData>;
  executions?: PublisherTractorExecution[];
  onOrderClick: (req: RequisitionEvent<SowBlueprintData>) => void;
  onModifyClick: (req: RequisitionEvent<SowBlueprintData>) => void;
  onCancelClick: (req: RequisitionEvent, e: React.MouseEvent) => void;
  isSubmitting?: boolean;
  isConfirming?: boolean;
}

const FarmerTractorSowOrderCard = ({
  req,
  executions,
  onOrderClick,
  onModifyClick,
  onCancelClick,
  isSubmitting = false,
  isConfirming = false,
}: FarmerTractorSowOrderCardProps) => {
  if (req.requisitionType !== "sowBlueprintv0" || !req.decodedData) return null;

  const data = req.decodedData;
  const totalAmount = TokenValue.fromBlockchain(data.sowAmounts.totalAmountToSow, 6);

  // Get executions for this blueprint
  const blueprintExecutions = executions || [];

  // Count how many times this blueprint has been executed
  const executionCount = blueprintExecutions.length;

  // Calculate total PINTO sown so far for this blueprint
  const totalSown = blueprintExecutions.reduce((acc, exec) => {
    if (exec.sowEvent) {
      return acc.add(exec.sowEvent.beans);
    }
    return acc;
  }, TokenValue.ZERO);

  // Calculate percentage completion
  const percentComplete = totalAmount.gt(0) ? totalSown.div(totalAmount).mul(100) : TokenValue.ZERO;

  // Get percentage as number for display
  const percentCompleteNumber = Math.min(percentComplete.toHuman ? Number(percentComplete.toHuman()) : 0, 100);

  const isComplete = percentComplete.gte(100);

  // Format the publish date
  const publishDate = req.timestamp ? format(new Date(req.timestamp), "dd MMM yyyy") : "Unknown";

  // Helper function for formatting percentage
  const formatPercentage = (value: bigint): string => {
    return `${(Number(value) / 1e6).toFixed(2)}%`;
  };

  return (
    <Col className="gap-2">
      <Card
        className="box-border flex flex-col p-4 gap-2 bg-white border border-pinto-gray-2 rounded-xl cursor-pointer hover:border-pinto-green-4 transition-colors"
        onClick={() => onOrderClick(req)}
      >
        <div className="flex flex-col gap-2 w-full">
          {/* Header row with all the pills and labels */}
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-0">
              {/* Withdraw pill */}
              <div className="flex items-center px-2 py-1 bg-pinto-green-4 rounded-xl">
                <span className="text-white text-sm font-normal whitespace-nowrap">Withdraw</span>
              </div>
              {/* Divider */}
              <div className="border-t-2 border-pinto-gray-2 w-6 flex-shrink-0" />
              {/* From label */}
              <div className="bg-[#F8F8F8] px-2 py-1 rounded-xl">
                <span className="text-pinto-gray-4 text-sm font-thin whitespace-nowrap">from Silo</span>
              </div>
              {/* Divider */}
              <div className="border-t-2 border-pinto-gray-2 w-6 flex-shrink-0" />
              {/* Sow pill */}
              <div className="flex items-center px-2 py-1 bg-pinto-green-4 rounded-xl">
                <span className="text-white text-sm font-normal whitespace-nowrap">Sow</span>
              </div>
              {/* Divider */}
              <div className="border-t-2 border-pinto-gray-2 w-6 flex-shrink-0" />
              {/* Up to */}
              <div className="bg-[#F8F8F8] px-2 py-1 rounded-xl">
                <div className="flex items-center gap-1">
                  <span className="text-pinto-gray-4 text-sm font-thin whitespace-nowrap">up to</span>
                  <IconImage src={pintoIcon} size={4} />
                  <span className="text-pinto-green-4 text-sm font-thin whitespace-nowrap overflow-hidden text-ellipsis">
                    {formatter.number(totalAmount)} PINTO
                    <span className="text-pinto-gray-4">
                      {" "}
                      (max {formatter.number(TokenValue.fromBlockchain(data.sowAmounts.maxAmountToSowPerSeason, 6))} per
                      Season)
                    </span>
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-pinto-gray-4 text-sm whitespace-nowrap">Operator Tip:</span>
              <div className="bg-[#F8F8F8] px-2 py-1 rounded-xl flex items-center gap-1">
                <IconImage src={pintoIcon} size={4} />
                <span className="text-pinto-green-4 text-sm font-thin whitespace-nowrap overflow-hidden text-ellipsis">
                  {formatter.number(TokenValue.fromBlockchain(data.operatorParams.operatorTipAmount, 6))} PINTO
                </span>
              </div>
            </div>
          </div>

          {/* Strategy description - new row */}
          <div className="flex items-center pl-6 gap-2">
            <CornerBottomLeftIcon className="h-4 w-4 text-pinto-gray-4" />
            <span className="text-pinto-gray-4 text-sm font-thin whitespace-nowrap overflow-hidden text-ellipsis">
              Withdraw Deposited Tokens from the Silo with the{" "}
              {data.sourceTokenIndices.includes(255)
                ? "Lowest Seeds"
                : data.sourceTokenIndices.includes(254)
                  ? "Best Price"
                  : getTokenNameByIndex(data.sourceTokenIndices[0])}
            </span>
          </div>

          {/* Execution conditions */}
          <div className="flex justify-between items-end w-full">
            <div className="flex flex-col gap-2">
              <div className="flex items-center pl-6 gap-2">
                <CornerBottomLeftIcon className="h-4 w-4 text-pinto-gray-4" />
                <span className="text-pinto-gray-4 text-sm font-thin whitespace-nowrap overflow-hidden text-ellipsis">
                  Execute when Temperature is at least {formatPercentage(data.minTemp)}
                </span>
              </div>
              <div className="flex items-center pl-6 gap-2">
                <CornerBottomLeftIcon className="h-4 w-4 text-pinto-gray-4" />
                <span className="text-pinto-gray-4 text-sm font-thin whitespace-nowrap overflow-hidden text-ellipsis">
                  AND when Pod Line Length is at most{" "}
                  {formatter.number(TokenValue.fromHuman(data.maxPodlineLengthAsString, 6))}
                </span>
              </div>
              <div className="flex items-center pl-6 gap-2">
                <CornerBottomLeftIcon className="h-4 w-4 text-pinto-gray-4" />
                <span className="text-pinto-gray-4 text-sm font-thin whitespace-nowrap overflow-hidden text-ellipsis">
                  AND when Available Soil is at least {data.sowAmounts.minAmountToSowPerSeasonAsString}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <IconImage src={pintoIcon} size={4} />
              <span className="text-pinto-gray-4 text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                PINTO Sown through this Order:
                <span className="text-black">
                  {" "}
                  {formatter.number(totalSown)}/{formatter.number(totalAmount)}
                </span>
                <span className="text-pinto-gray-4"> ({Math.round(percentCompleteNumber)}%)</span>
              </span>
            </div>
          </div>

          {isComplete && (
            <div className="mt-2 p-2 bg-pinto-green-1 rounded-lg border border-pinto-green-4 text-pinto-green-4 text-center font-medium">
              Order Completed!
            </div>
          )}
        </div>
      </Card>

      {/* External actions - positioned outside the cell */}
      <Row className="self-end gap-2 pinto-sm text-pinto-light">
        <div className="inline-flex items-center gap-2">
          <CalendarIcon className="h-4 w-4" />
          <span className="inline-block whitespace-nowrap">Published {publishDate}</span>
        </div>
        <Row className="inline-flex items-center gap-2">
          <ClockIcon className="h-4 w-4" />
          <span className="inline-block whitespace-nowrap">
            Executed {executionCount} time{executionCount !== 1 ? "s" : ""}
          </span>
        </Row>
        <Row className="items-center gap-0">
          <Button
            variant="ghost"
            className="text-sm"
            onClick={() => onModifyClick(req)}
            disabled={isSubmitting || isConfirming}
          >
            <Pencil1Icon className="h-4 w-4" />
            <span className="inline ml-1">Modify</span>
          </Button>
          <Button
            variant="ghost"
            className="text-sm text-pinto-red-2 hover:bg-pinto-red-1"
            onClick={(e) => onCancelClick(req, e)}
            disabled={isSubmitting || isConfirming}
          >
            <Cross1Icon className="h-4 w-4" />
            <span className="inline ml-1">Cancel</span>
          </Button>
        </Row>
      </Row>
    </Col>
  );
};

export default FarmerTractorSowOrderCard;
