import pintoIcon from "@/assets/tokens/PINTO.png";
import { TokenValue } from "@/classes/TokenValue";
import { Col, Row } from "@/components/Container";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import IconImage from "@/components/ui/IconImage";
import { ConvertUpOrderbookEntry } from "@/lib/Tractor/convertUp/tractor-convert-up-types";
import { formatter } from "@/utils/format";
import { getTokenNameByIndex } from "@/utils/token";
import { CalendarIcon, ClockIcon, CornerBottomLeftIcon, Cross1Icon, Pencil1Icon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import React from "react";

interface FarmerTractorConvertUpOrderCardProps {
  req: ConvertUpOrderbookEntry;
  onOrderClick: (req: ConvertUpOrderbookEntry) => void;
  onModifyClick: (req: ConvertUpOrderbookEntry) => void;
  onCancelClick: (req: ConvertUpOrderbookEntry, e: React.MouseEvent) => void;
  isSubmitting?: boolean;
  isConfirming?: boolean;
}

const FarmerTractorConvertUpOrderCard = ({
  req,
  onOrderClick,
  onModifyClick,
  onCancelClick,
  isSubmitting = false,
  isConfirming = false,
}: FarmerTractorConvertUpOrderCardProps) => {
  if (!req.decodedData) return null;

  const data = req.decodedData;
  const totalAmount = data.convertUpParams.totalConvertBdv;
  const bdvLeftToConvert = req.orderInfo.bdvLeftToConvert;

  // Calculate converted amount and completion percentage
  const convertedAmount = totalAmount.sub(bdvLeftToConvert);
  const percentComplete = totalAmount.gt(0) ? convertedAmount.div(totalAmount).mul(100) : TokenValue.ZERO;
  const percentCompleteNumber = Math.min(percentComplete.toHuman ? Number(percentComplete.toHuman()) : 0, 100);
  const isComplete = percentComplete.gte(100);

  // Format the publish date
  const publishDate = req.timestamp ? format(new Date(req.timestamp), "dd MMM yyyy") : "Unknown";

  // Helper function for formatting percentage
  const formatPercentage = (value: TokenValue): string => {
    return `${formatter.number(value)}`;
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
              <div className="bg-pinto-gray-1 px-2 py-1 rounded-xl">
                <span className="text-pinto-gray-4 text-sm font-thin whitespace-nowrap">from Silo</span>
              </div>
              {/* Divider */}
              <div className="border-t-2 border-pinto-gray-2 w-6 flex-shrink-0" />
              {/* Convert Up pill */}
              <div className="flex items-center px-2 py-1 bg-pinto-green-4 rounded-xl">
                <span className="text-white text-sm font-normal whitespace-nowrap">Convert Up</span>
              </div>
              {/* Divider */}
              <div className="border-t-2 border-pinto-gray-2 w-6 flex-shrink-0" />
              {/* Up to */}
              <div className="bg-pinto-gray-1 px-2 py-1 rounded-xl">
                <div className="flex items-center gap-1">
                  <span className="text-pinto-gray-4 text-sm font-thin whitespace-nowrap">up to</span>
                  <IconImage src={pintoIcon} size={4} />
                  <span className="text-pinto-green-4 text-sm font-thin whitespace-nowrap overflow-hidden text-ellipsis">
                    {formatter.number(totalAmount)} BDV
                    <span className="text-pinto-gray-4">
                      {" "}
                      ({formatter.number(data.convertUpParams.minConvertBdvPerExecution)} -{" "}
                      {formatter.number(data.convertUpParams.maxConvertBdvPerExecution)} per execution)
                    </span>
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-pinto-gray-4 text-sm whitespace-nowrap">Operator Tip:</span>
              <div className="bg-pinto-gray-1 px-2 py-1 rounded-xl flex items-center gap-1">
                <IconImage src={pintoIcon} size={4} />
                <span className="text-pinto-green-4 text-sm font-thin whitespace-nowrap overflow-hidden text-ellipsis">
                  {formatter.number(data.opParams.operatorTipAmount)} PINTO
                </span>
              </div>
            </div>
          </div>

          {/* Strategy description - new row */}
          <div className="flex items-center pl-6 gap-2">
            <CornerBottomLeftIcon className="h-4 w-4 text-pinto-gray-4" />
            <span className="text-pinto-gray-4 text-sm font-thin whitespace-nowrap overflow-hidden text-ellipsis">
              Withdraw Deposited Tokens from the Silo with the{" "}
              {data.convertUpParams.sourceTokenIndices.includes(255)
                ? "Lowest Seeds"
                : data.convertUpParams.sourceTokenIndices.includes(254)
                  ? "Best Price"
                  : getTokenNameByIndex(data.convertUpParams.sourceTokenIndices[0])}
            </span>
          </div>

          {/* Execution conditions */}
          <div className="flex justify-between items-end w-full">
            <div className="flex flex-col gap-2">
              <div className="flex items-center pl-6 gap-2">
                <CornerBottomLeftIcon className="h-4 w-4 text-pinto-gray-4" />
                <span className="text-pinto-gray-4 text-sm font-thin whitespace-nowrap overflow-hidden text-ellipsis">
                  Execute when price is between{" "}
                  {formatter.usd(data.convertUpParams.minPriceToConvertUp, { decimals: 3 })} -{" "}
                  {formatter.usd(data.convertUpParams.maxPriceToConvertUp, { decimals: 3 })}
                </span>
              </div>
              <div className="flex items-center pl-6 gap-2">
                <CornerBottomLeftIcon className="h-4 w-4 text-pinto-gray-4" />
                <span className="text-pinto-gray-4 text-sm font-thin whitespace-nowrap overflow-hidden text-ellipsis">
                  <span className="font-roboto">AND</span> when Grown Stalk Bonus ≥{" "}
                  {formatter.number(data.convertUpParams.minGrownStalkPerBdvBonus, { minDecimals: 2, maxDecimals: 6 })}{" "}
                  per BDV
                </span>
              </div>
              <div className="flex items-center pl-6 gap-2">
                <CornerBottomLeftIcon className="h-4 w-4 text-pinto-gray-4" />
                <span className="text-pinto-gray-4 text-sm font-thin whitespace-nowrap overflow-hidden text-ellipsis">
                  <span className="font-roboto">AND</span> when Convert Capacity ≥{" "}
                  {formatter.number(data.convertUpParams.minConvertBonusCapacity)} BDV
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <IconImage src={pintoIcon} size={4} />
              <span className="text-pinto-gray-4 text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                BDV Converted through this Order:
                <span className="text-black">
                  {" "}
                  {formatter.number(convertedAmount)}/{formatter.number(totalAmount)}
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

export default FarmerTractorConvertUpOrderCard;
