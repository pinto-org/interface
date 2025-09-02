import pintoIcon from "@/assets/tokens/PINTO.png";
import { TokenValue } from "@/classes/TokenValue";
import { Col, Row } from "@/components/Container";
import { OrderVisualization } from "@/components/OrderVisualization";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import IconImage from "@/components/ui/IconImage";
import { useGetTractorTokenStrategyWithBlueprint } from "@/hooks/tractor/useGetTractorTokenStrategy";
import { ConvertUpOrderbookEntry } from "@/lib/Tractor/convertUp/tractor-convert-up-types";
import { formatter } from "@/utils/format";
import { getTokenNameByIndex } from "@/utils/token";
import { CalendarIcon, Cross1Icon, Pencil1Icon } from "@radix-ui/react-icons";
import { format } from "date-fns";

interface FarmerTractorConvertUpOrderCardProps {
  req: ConvertUpOrderbookEntry;
  onOrderClick: (req: ConvertUpOrderbookEntry) => void;
  onModifyClick: (req: ConvertUpOrderbookEntry) => void;
  onCancelClick: (req: ConvertUpOrderbookEntry, e: React.MouseEvent) => void;
  getStrategyProps: ReturnType<typeof useGetTractorTokenStrategyWithBlueprint>;
  isSubmitting?: boolean;
  isConfirming?: boolean;
}

const FarmerTractorConvertUpOrderCard = ({
  req,
  onOrderClick,
  onModifyClick,
  onCancelClick,
  getStrategyProps,
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

  return (
    <Col className="gap-2">
      <Card
        className="box-border flex flex-col p-4 gap-2 bg-white border border-pinto-gray-2 rounded-xl cursor-pointer hover:border-pinto-green-4 transition-colors"
        onClick={() => onOrderClick(req)}
      >
        <div className="flex flex-col gap-2 w-full">
          {/* Header row with all the pills and labels */}
          <div className="flex justify-between items-center w-full">
            <OrderVisualization.FlowVisualization
              steps={[
                { type: "action", content: "Withdraw" },
                { type: "context", content: "from Silo" },
                { type: "action", content: "Convert Up" },
                {
                  type: "amount",
                  content: (
                    <>
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
                    </>
                  ),
                },
              ]}
            />
            <OrderVisualization.TipDisplay
              amount={formatter.number(data.opParams.operatorTipAmount)}
              token="PINTO"
              icon={pintoIcon}
            />
          </div>
          {/* Execution conditions */}
          <div className="flex justify-between items-end w-full">
            <OrderVisualization.ConditionsList
              conditions={[
                {
                  text: (
                    <>
                      Withdraw Deposited Tokens from the Silo with the{" "}
                      {data.convertUpParams.sourceTokenIndices.includes(255)
                        ? "Lowest Seeds"
                        : data.convertUpParams.sourceTokenIndices.includes(254)
                          ? "Best Price"
                          : getTokenNameByIndex(data.convertUpParams.sourceTokenIndices[0])}
                    </>
                  ),
                },
                {
                  text: (
                    <>
                      Execute when price is between{" "}
                      {formatter.usd(data.convertUpParams.minPriceToConvertUp, { decimals: 3 })} -{" "}
                      {formatter.usd(data.convertUpParams.maxPriceToConvertUp, { decimals: 3 })}
                    </>
                  ),
                },
                {
                  text: (
                    <>
                      when Grown Stalk Bonus ≥{" "}
                      {formatter.number(data.convertUpParams.minGrownStalkPerBdvBonus, {
                        minDecimals: 2,
                        maxDecimals: 6,
                      })}{" "}
                      per BDV
                    </>
                  ),
                  operator: "AND",
                },
                {
                  text: (
                    <>when Convert Capacity ≥ {formatter.number(data.convertUpParams.minConvertBonusCapacity)} BDV</>
                  ),
                  operator: "AND",
                },
              ]}
            />
            <OrderVisualization.ProgressIndicator
              completed={convertedAmount}
              total={totalAmount}
              unit="BDV"
              icon={pintoIcon}
              label="BDV Converted through this Order"
            />
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
