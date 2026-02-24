import pintoIcon from "@/assets/tokens/PINTO.png";
import { TokenValue } from "@/classes/TokenValue";
import { Col, Row } from "@/components/Container";
import { OrderVisualization } from "@/components/OrderVisualization";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import IconImage from "@/components/ui/IconImage";
import { TractorRequisitionEvent as RequisitionEvent } from "@/lib/Tractor";
import { PublisherTractorExecution } from "@/lib/Tractor";
import {
  getClaimOpConditionLabel,
  getEnabledClaimOpLabels,
  getEnabledClaimOps,
  transformAutomateClaimRequisitionEvent,
} from "@/lib/Tractor/claimOrder";
import { AutomateClaimBlueprintStruct } from "@/lib/Tractor/claimOrder/tractor-claim-types";
import { formatter } from "@/utils/format";
import { CalendarIcon, ClockIcon, Cross1Icon } from "@radix-ui/react-icons";
import { format } from "date-fns";

interface FarmerTractorAutomateClaimOrderCardProps {
  req: RequisitionEvent<AutomateClaimBlueprintStruct>;
  executions?: PublisherTractorExecution[];
  onOrderClick: (req: RequisitionEvent<AutomateClaimBlueprintStruct>) => void;
  onCancelClick: (req: RequisitionEvent, e: React.MouseEvent) => void;
  isSubmitting?: boolean;
  isConfirming?: boolean;
}

const FarmerTractorAutomateClaimOrderCard = ({
  req,
  executions,
  onOrderClick,
  onCancelClick,
  isSubmitting = false,
  isConfirming = false,
}: FarmerTractorAutomateClaimOrderCardProps) => {
  if (req.requisitionType !== "automateClaimBlueprint" || !req.decodedData) return null;

  const transformed = transformAutomateClaimRequisitionEvent(req.decodedData);
  if (!transformed) return null;

  const { mowEnabled, plantEnabled, harvestEnabled } = getEnabledClaimOps(transformed);
  const enabledOps = getEnabledClaimOpLabels({ mowEnabled, plantEnabled, harvestEnabled });

  const operatorTip = TokenValue.fromBlockchain(transformed.operatorParams.operatorTipAmount, 6);

  // Build condition labels with threshold details
  const conditions: { text: string }[] = [];
  if (mowEnabled) {
    conditions.push({ text: getClaimOpConditionLabel("mow", true, transformed.claimParams.minMowAmount) });
  }
  if (plantEnabled) {
    conditions.push({ text: getClaimOpConditionLabel("plant", true, transformed.claimParams.minPlantAmount) });
  }
  if (harvestEnabled) {
    const harvestThreshold = transformed.claimParams.fieldHarvestConfigs[0]?.minHarvestAmount ?? 0n;
    conditions.push({ text: getClaimOpConditionLabel("harvest", true, harvestThreshold) });
  }

  const blueprintExecutions = executions || [];
  const executionCount = blueprintExecutions.length;
  const publishDate = req.timestamp ? format(new Date(req.timestamp), "dd MMM yyyy") : "Unknown";

  return (
    <Col className="gap-2">
      <Card
        className="box-border flex flex-col p-4 gap-2 bg-white border border-pinto-gray-2 rounded-xl cursor-pointer hover:border-pinto-green-4 transition-colors"
        onClick={() => onOrderClick(req)}
      >
        <div className="flex flex-col gap-2 w-full">
          <div className="flex justify-between items-center w-full">
            <OrderVisualization.FlowVisualization
              steps={[
                { type: "action", content: "Automate Claim" },
                {
                  type: "amount",
                  content: (
                    <span className="text-pinto-green-4 text-sm font-thin whitespace-nowrap">
                      {enabledOps.join(", ")}
                    </span>
                  ),
                },
              ]}
            />
            <OrderVisualization.TipDisplay amount={formatter.number(operatorTip)} token="PINTO" icon={pintoIcon} />
          </div>

          <OrderVisualization.ConditionsList conditions={conditions} />
        </div>
      </Card>

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

export default FarmerTractorAutomateClaimOrderCard;
