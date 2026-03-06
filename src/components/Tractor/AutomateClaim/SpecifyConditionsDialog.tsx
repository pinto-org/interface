import { TokenValue } from "@/classes/TokenValue";
import { Col, Row } from "@/components/Container";
import { Form } from "@/components/Form";
import ReviewTractorOrderDialog from "@/components/ReviewTractorOrderDialog";
import TooltipSimple from "@/components/TooltipSimple";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/Dialog";
import IconImage from "@/components/ui/IconImage";
import { Separator } from "@/components/ui/Separator";
import { useAutomateClaimOrder } from "@/hooks/tractor/useAutomateClaimOrder";
import { estimatedTotalTipRange } from "@/lib/Tractor/claimOrder";
import { isValidCustomValue } from "@/lib/Tractor/claimOrder/automate-claim-helpers";
import type { ClaimFrequencyPreset } from "@/lib/Tractor/claimOrder/tractor-claim-types";
import useTractorOperatorAverageTipPaid from "@/state/tractor/useTractorOperatorAverageTipPaid";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { useMainToken } from "@/state/useTokenData";
import { formatter } from "@/utils/format";
import { useCallback, useMemo, useState } from "react";
import { useWatch } from "react-hook-form";
import { toast } from "sonner";
import {
  OperatorTipFormField,
  type TractorOperatorTipStrategy,
  getTractorOperatorTipAmountFromPreset,
} from "../form/fields/sharedFields";
import { defaultAutomateClaimValues, useAutomateClaimForm } from "../form/schema/automateClaim.schema";
import { ConditionSection } from "./ConditionSection";

// ────────────────────────────────────────────────────────────────────────────────
// Preset display configs
// ────────────────────────────────────────────────────────────────────────────────

// ────────────────────────────────────────────────────────────────────────────────
// Props
// ────────────────────────────────────────────────────────────────────────────────

export interface SpecifyConditionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// ────────────────────────────────────────────────────────────────────────────────
// Component
// ────────────────────────────────────────────────────────────────────────────────

export const SpecifyConditionsDialog = ({ open, onOpenChange }: SpecifyConditionsDialogProps) => {
  const mainToken = useMainToken();
  const farmerSilo = useFarmerSilo();
  const { data: averageTipPaid = 0.15 } = useTractorOperatorAverageTipPaid();

  // Form state
  const { form } = useAutomateClaimForm();

  // Operator tip preset state
  const [operatorTipPreset, setOperatorTipPreset] = useState<TractorOperatorTipStrategy>("Normal");

  // Blueprint creation state
  const { state, orderData, isLoading, handleCreateBlueprint } = useAutomateClaimOrder();
  const [showReviewDialog, setShowReviewDialog] = useState(false);

  // Watch form values for condition sections
  const [
    mowPreset,
    plantPreset,
    harvestPreset,
    mowCustomValue,
    plantCustomValue,
    harvestCustomValue,
    customOperatorTip,
  ] = useWatch({
    control: form.control,
    name: [
      "mowPreset",
      "plantPreset",
      "harvestPreset",
      "mowCustomValue",
      "plantCustomValue",
      "harvestCustomValue",
      "customOperatorTip",
    ],
  });

  // Derived: which operations are enabled (a preset has been selected)
  const mowEnabled = mowPreset !== null;
  const plantEnabled = plantPreset !== null;
  const harvestEnabled = harvestPreset !== null;

  // ── Preset change handlers ──────────────────────────────────────────────────

  const handleMowPresetChange = useCallback(
    (preset: ClaimFrequencyPreset | null) => {
      form.setValue("mowPreset", preset, { shouldValidate: true });
      form.setValue("mowEnabled", preset !== null, { shouldValidate: true });
    },
    [form],
  );

  const handlePlantPresetChange = useCallback(
    (preset: ClaimFrequencyPreset | null) => {
      form.setValue("plantPreset", preset, { shouldValidate: true });
      form.setValue("plantEnabled", preset !== null, { shouldValidate: true });
    },
    [form],
  );

  const handleHarvestPresetChange = useCallback(
    (preset: ClaimFrequencyPreset | null) => {
      form.setValue("harvestPreset", preset, { shouldValidate: true });
      form.setValue("harvestEnabled", preset !== null, { shouldValidate: true });
    },
    [form],
  );

  // ── Submit handler ───────────────────────────────────────────────────────────

  const handleSubmit = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();

      // Validate the form first
      const isValid = await form.trigger();
      if (!isValid) return;

      try {
        await handleCreateBlueprint(form, averageTipPaid, operatorTipPreset, farmerSilo.deposits, {
          onSuccess: () => {
            setShowReviewDialog(true);
          },
          onFailure: () => {
            toast.error("Failed to create Automate Claim blueprint");
          },
        });
      } catch (error) {
        console.error("[SpecifyConditionsDialog] Error creating blueprint:", error);
        toast.error("Failed to create Automate Claim blueprint");
      }
    },
    [form, handleCreateBlueprint, averageTipPaid, operatorTipPreset, farmerSilo.deposits],
  );

  // ── Estimated tip range ─────────────────────────────────────────────────────

  const tipRange = useMemo(() => {
    const enabledCount = (mowEnabled ? 1 : 0) + (plantEnabled ? 1 : 0) + (harvestEnabled ? 1 : 0);

    if (enabledCount === 0) {
      return { min: 0n, max: 0n };
    }

    const tipTV = getTractorOperatorTipAmountFromPreset(
      operatorTipPreset,
      averageTipPaid,
      customOperatorTip,
      mainToken.decimals,
    );

    if (!tipTV) {
      return { min: 0n, max: 0n };
    }

    return estimatedTotalTipRange(tipTV.toBigInt(), enabledCount);
  }, [
    mowEnabled,
    plantEnabled,
    harvestEnabled,
    operatorTipPreset,
    averageTipPaid,
    customOperatorTip,
    mainToken.decimals,
  ]);

  // Check if submit should be disabled
  const hasAnyEnabled = mowEnabled || plantEnabled || harvestEnabled;

  const hasInvalidCustom =
    (mowPreset === "custom" && !isValidCustomValue(mowCustomValue)) ||
    (plantPreset === "custom" && !isValidCustomValue(plantCustomValue)) ||
    (harvestPreset === "custom" && !isValidCustomValue(harvestCustomValue));

  if (!open) return null;

  return (
    <>
      {/* modal={false} to prevent operator tip popover from blocking input events */}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogPortal>
          <DialogOverlay className="fixed inset-0 backdrop-blur-[2px] bg-white/50" />
          <DialogContent className="max-w-[35rem] p-6">
            <DialogHeader>
              <DialogTitle className="font-normal text-[1.25rem] tracking-normal">Specify conditions</DialogTitle>
              <DialogDescription className="pinto-sm-light text-pinto-light">
                Configure which Silo claim operations to automate and their execution thresholds.
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <Col className="flex-1">
                {/* Conditions area */}
                <Col className="gap-4 flex-1">
                  <Separator className="h-[1px] w-full bg-pinto-gray-2" />

                  {/* Condition Sections */}
                  <Col className="gap-3 h-[28rem]">
                    <ConditionSection
                      title="Mow my Silo"
                      enabled={mowEnabled}
                      preset={mowPreset}
                      customValue={mowCustomValue}
                      onPresetChange={handleMowPresetChange}
                      onCustomValueChange={(v) => form.setValue("mowCustomValue", v)}
                      unit="Stalk"
                    />
                    <ConditionSection
                      title="Plant"
                      enabled={plantEnabled}
                      preset={plantPreset}
                      customValue={plantCustomValue}
                      onPresetChange={handlePlantPresetChange}
                      onCustomValueChange={(v) => form.setValue("plantCustomValue", v)}
                      unit="PINTO"
                    />
                    <ConditionSection
                      title="Harvest"
                      enabled={harvestEnabled}
                      preset={harvestPreset}
                      customValue={harvestCustomValue}
                      onPresetChange={handleHarvestPresetChange}
                      onCustomValueChange={(v) => form.setValue("harvestCustomValue", v)}
                      unit="PINTO"
                    />
                  </Col>
                </Col>

                {/* Fixed footer: always pinned to bottom */}
                <Col className="gap-4 pt-4 shrink-0">
                  <Separator className="h-[1px] w-full bg-pinto-gray-2" />

                  <Col className="gap-2">
                    <OperatorTipFormField
                      averageTipPaid={averageTipPaid}
                      preset={operatorTipPreset}
                      setPreset={setOperatorTipPreset}
                    />
                    <EstimatedTotalTipRange tipRange={tipRange} mainToken={mainToken} />
                  </Col>

                  <Button
                    size="xlargest"
                    rounded="full"
                    className={`w-full ${isLoading ? "bg-pinto-gray-2 text-pinto-light" : "bg-pinto-green-4 text-white"}`}
                    disabled={!hasAnyEnabled || hasInvalidCustom || isLoading}
                    onClick={handleSubmit}
                    type="button"
                  >
                    {isLoading ? "Publishing..." : "Publish Order"}
                  </Button>
                </Col>
              </Col>
            </Form>
          </DialogContent>
        </DialogPortal>
      </Dialog>

      {/* Review → Sign → Publish dialog */}
      {showReviewDialog && state && orderData && (
        <ReviewTractorOrderDialog
          open={showReviewDialog}
          onOpenChange={setShowReviewDialog}
          onSuccess={() => {
            form.reset({ ...defaultAutomateClaimValues });
            setShowReviewDialog(false);
            onOpenChange(false);
          }}
          orderData={{
            type: "automateClaim" as const,
            ...orderData,
          }}
          encodedData={state.encodedData}
          operatorPasteInstrs={state.operatorPasteInstructions}
          blueprint={state.blueprint}
          depositOptimizationCalls={state.depositOptimizationCalls}
        />
      )}
    </>
  );
};

// ────────────────────────────────────────────────────────────────────────────────
// Internal: Estimated Total Tip Range display
// ────────────────────────────────────────────────────────────────────────────────

const EstimatedTotalTipRange = ({
  tipRange,
  mainToken,
}: {
  tipRange: { min: bigint; max: bigint };
  mainToken: ReturnType<typeof useMainToken>;
}) => {
  const formatTip = (value: bigint) => {
    const tv = TokenValue.fromBlockchain(value, mainToken.decimals);
    return formatter.number(tv.toHuman(), { minDecimals: 2, maxDecimals: 3 });
  };

  return (
    <Row className="w-full justify-between">
      <Row className="gap-1 items-center">
        <div className="pinto-sm-light text-pinto-secondary">Estimated Total Tip</div>
        <TooltipSimple
          variant="outlined"
          content="The minimum and maximum PINTO you will pay to the Operator per execution, depending on how many operations are triggered."
        />
      </Row>
      <Row className="gap-1 pinto-sm font-normal">
        <IconImage src={mainToken.logoURI} alt="PINTO" size={4} className="rounded-full" />
        {formatTip(tipRange.min)} - {formatTip(tipRange.max)}
      </Row>
    </Row>
  );
};
