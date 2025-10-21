import { TV } from "@/classes/TokenValue";
import { Col, Row } from "@/components/Container";
import TooltipSimple from "@/components/TooltipSimple";
import Fields from "@/components/Tractor/form/fields/ConvertUpOrderV0Fields";
import { TokenStrategyFormField, TractorFormButtonsRow } from "@/components/Tractor/form/fields/sharedFields";
import { ConvertUpV0FormSchema, TractorConvertUpFormKeys } from "@/components/Tractor/form/schema/convertUp.schema";
import { Label } from "@/components/ui/Label";
import { Separator } from "@/components/ui/Separator";
import { SEEDS, STALK } from "@/constants/internalTokens";
import { useTokenMap } from "@/hooks/pinto/useTokenMap";
import useSowOrderV0Calculations from "@/hooks/tractor/useSowOrderV0Calculations";
import {
  tractorTokenStrategyUtil as StrategyUtil,
  TRACTOR_CONVERT_UP_DEFAULT_CONSTRAINTS,
  TractorTokenStrategy,
} from "@/lib/Tractor";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { useAverageGrownStalkPerBdvPerSeason, useSiloData } from "@/state/useSiloData";
import { useMainToken } from "@/state/useTokenData";
import { postSanitizedSanitizedValue } from "@/utils/string";
import { getTokenIndex } from "@/utils/token";
import { useCallback, useMemo, useState } from "react";
import { useFormContext, useFormState, useWatch } from "react-hook-form";
import TractorTokenStrategyDialog from "../TractorTokenStrategyDialog";
import { ConvertUpTractorOrderFormStep, useConvertUpOrderFormContext } from "./ConvertUpTractorContext";

/**
 * The entry form for the Convert Up Order
 */
const ConvertUpTractorEntryForm = ({
  farmerSilo,
  siloData,
  calculations,
  isLoading = false,
  didSetAdvancedFormFields,
  setDidSetAdvancedFormFields,
}: {
  isLoading?: boolean;
  farmerSilo: ReturnType<typeof useFarmerSilo>;
  siloData: ReturnType<typeof useSiloData>;
  calculations: ReturnType<typeof useSowOrderV0Calculations>;
  didSetAdvancedFormFields: boolean;
  setDidSetAdvancedFormFields: (val: boolean) => void;
}) => {
  const { form, setFormStep, onOpenChange } = useConvertUpOrderFormContext();
  const [showTokenStrategyDialog, setShowTokenStrategyDialog] = useState(false);
  const mainToken = useMainToken();
  const tokenMap = useTokenMap();

  const {
    errors: { minPriceToConvertUp, maxPriceToConvertUp },
  } = useFormState<ConvertUpV0FormSchema>();

  const errors = useMemo(() => {
    const set = new Set([minPriceToConvertUp?.message, maxPriceToConvertUp?.message]);

    return Array.from(set).filter((msg): msg is string => !!msg);
  }, [minPriceToConvertUp, maxPriceToConvertUp]);

  // -------------------- Callbacks --------------------

  const handleOpenDialog = () => {
    setShowTokenStrategyDialog(true);
  };

  const handleBack = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      // prevent default to avoid form submission
      e.preventDefault();
      e.stopPropagation();

      onOpenChange(false);
    },
    [onOpenChange],
  );

  // Handle preparing the args
  const handlePrepareArgs = async () => {
    // Trigger the form to validate the fields that are required to prepare the args
    const isValid = await form.trigger(TractorConvertUpFormKeys.initRequired);
    if (!isValid) {
      return false;
    }

    // if the args have already been prepared, return true
    if (didSetAdvancedFormFields) {
      return true;
    }

    // Only fill out the inferred data from the Entry Form Fields on the first pass
    const transformed = inferAdvancedFormFields(form.getValues(), mainToken.decimals);

    TractorConvertUpFormKeys.advanced.forEach((key) => {
      const value = transformed[key];
      if (value instanceof TV) {
        form.setValue(key, value.toHuman());
      } else if (typeof value === "number") {
        form.setValue(key, value);
      } else if (typeof value === "object" && "type" in value && "addresses" in value) {
        // Sort the addresses by the number of seeds they have in ascending order
        value.addresses.sort((a, b) => {
          const aSeeds = siloData.tokenData.get(tokenMap[getTokenIndex(a)])?.rewards.seeds;
          const bSeeds = siloData.tokenData.get(tokenMap[getTokenIndex(b)])?.rewards.seeds;

          return aSeeds && bSeeds ? aSeeds.sub(bSeeds).toNumber() : 0;
        });

        // Re-set the value with the sorted addresses
        form.setValue(key, value);
      }
    });

    setDidSetAdvancedFormFields(true);

    return true;
  };

  const handleNext = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!didSetAdvancedFormFields) {
      const prepared = await handlePrepareArgs();
      if (!prepared) {
        return;
      }
    }

    setFormStep(ConvertUpTractorOrderFormStep.REVIEW);
  };

  return (
    <>
      <Col className="gap-6 overflow-y-auto">
        <div className="flex flex-col gap-2">
          <div className="pinto-body font-medium text-pinto-secondary mb-4">{"🚜 Place a Convert Up Order"}</div>
          <Separator className="h-[1px] w-full bg-pinto-gray-2" />
        </div>
        <Col className="w-full gap-5">
          <>
            <TokenStrategyFormField
              openDialog={handleOpenDialog}
              label="Convert using"
              tooltipText="Select the token(s) you want to convert from."
            />
            <Fields.TotalConvertBdv farmerDeposits={farmerSilo.deposits} />
            <Fields.PriceRange />
            <Col className="gap-3">
              <Fields.GrownStalkPerBdvBonusBid />
              <EstimatedSeasonsOfGrownStalk />
            </Col>
          </>
        </Col>
        {errors.length ? (
          <div className="flex flex-col gap-2">
            {errors.map((error, i) => {
              return (
                <div key={`${error}-error-${i.toString()}`} className="pinto-sm-light text-pinto-red-2">
                  {error}
                </div>
              );
            })}
          </div>
        ) : null}
        <ButtonRow handleBack={handleBack} handleNext={handleNext} isLoading={isLoading} />
      </Col>
      {showTokenStrategyDialog && (
        <TokenStrategyDialog
          mode="bdv"
          open={showTokenStrategyDialog}
          onOpenChange={setShowTokenStrategyDialog}
          farmerDeposits={farmerSilo.deposits}
          calculations={calculations}
        />
      )}
    </>
  );
};

export default ConvertUpTractorEntryForm;

const ButtonRow = ({
  handleBack,
  handleNext,
  isLoading,
}: {
  handleBack: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleNext: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
  isLoading: boolean;
}) => {
  const { getMissingFields, disallowCloseForm } = useConvertUpOrderFormContext();
  const { errors } = useFormState<ConvertUpV0FormSchema>();

  const missingFields = getMissingFields(TractorConvertUpFormKeys.initRequired);

  const hasErrors = Boolean(Object.keys(errors).length);

  const hasMissingFields = Boolean(missingFields.length);

  return (
    <TractorFormButtonsRow
      hideLeft={disallowCloseForm}
      handleLeft={handleBack}
      handleRight={handleNext}
      isLoading={isLoading}
      right={{
        content: "Review",
        disabled: Boolean(hasErrors || hasMissingFields),
        tooltip: hasMissingFields ? (
          <div className="p-1">
            <div className="font-medium mb-1">Please fill in the following fields:</div>
            <ul className="list-disc pl-4 text-sm">
              {missingFields.map((field) => (
                <li key={`missing-field${field}`}>{field}</li>
              ))}
            </ul>
          </div>
        ) : null,
      }}
      left={{
        content: "← Back",
      }}
    />
  );
};

/**
 * Isolated component that displays the estimated number of seasons of grown stalk that will be gained
 * given the current form values.
 */
const EstimatedSeasonsOfGrownStalk = () => {
  const { form } = useConvertUpOrderFormContext();
  const mainToken = useMainToken();

  const value = useWatch({ control: form.control, name: "grownStalkPerBdvBonusBid" });

  const { data: averageGrownStalkPerBdvPerSeason } = useAverageGrownStalkPerBdvPerSeason();

  // IN TERMS OF PINTO GROWN STALK / SEASON
  const seasonsOfGrownStalk = useMemo(() => {
    if (!averageGrownStalkPerBdvPerSeason) {
      return "0";
    }

    const bonusGrownStalkPerBdv = postSanitizedSanitizedValue(value, STALK.decimals - mainToken.decimals).tv;

    // 10,000 seeds = 1 grown stalk
    const seasons = bonusGrownStalkPerBdv.mul(10_000).div(averageGrownStalkPerBdvPerSeason);
    return seasons.lt(1) ? "< 1" : seasons.toNumber().toFixed(0);
  }, [value, mainToken.decimals]);

  return (
    <Row className="w-full justify-between">
      <Row className="gap-1 items-center">
        <Label variant="form">Approximate Seasons of Stalk Gained</Label>
        <TooltipSimple
          content="The approximate number Seasons of Stalk that will be gained if this order is cleared."
          variant="outlined"
        />
      </Row>
      <div className="pinto-sm-light text-pinto-green-4">~ {seasonsOfGrownStalk} season(s)</div>
    </Row>
  );
};

/**
 * Form Context specific dialog that allows the user to select the token strategy for the Convert Up Order.
 */
const TokenStrategyDialog = ({
  open,
  onOpenChange,
  farmerDeposits,
  calculations,
  mode = "amount",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  farmerDeposits: ReturnType<typeof useFarmerSilo>["deposits"];
  calculations: ReturnType<typeof useSowOrderV0Calculations>;
  mode?: "bdv" | "amount";
}) => {
  const ctx = useFormContext<ConvertUpV0FormSchema>();

  const selected = useWatch({
    control: ctx.control,
    name: "tokenStrategy",
  });

  // Memoize the callback to prevent recreating on every render
  const handleTokenStrategySelected = useCallback(
    (newStrategy: TractorTokenStrategy) => {
      ctx.setValue("tokenStrategy", newStrategy);
      StrategyUtil.isDynamic(newStrategy) && onOpenChange(false);
    },
    [ctx],
  );

  if (!StrategyUtil.isValidStrategy(selected)) {
    return null;
  }

  return (
    <TractorTokenStrategyDialog
      open={open}
      selectedTokenStrategy={selected}
      onOpenChange={onOpenChange}
      onTokenStrategySelected={handleTokenStrategySelected}
      farmerDeposits={farmerDeposits}
      multiSelect
      onlyLP
      mode={mode}
      {...calculations}
    />
  );
};

const inferAdvancedFormFields = (
  values: ConvertUpV0FormSchema, // Will be typed properly when we import the form schema
  mainTokenDecimals: number,
) => {
  // Import the strategy util locally to avoid circular imports

  const strategy = StrategyUtil.isValidStrategy(values.tokenStrategy) ? values.tokenStrategy : undefined;

  if (!strategy) {
    throw new Error("Invalid token strategy");
  }

  const totalConvertBdv = postSanitizedSanitizedValue(values.totalBeanAmountToConvert, mainTokenDecimals).tv;
  const minPriceToConvertUp = postSanitizedSanitizedValue(values.minPriceToConvertUp, mainTokenDecimals).tv;
  const maxPriceToConvertUp = postSanitizedSanitizedValue(values.maxPriceToConvertUp, mainTokenDecimals).tv;
  const grownStalkPerBdvBonusBid = postSanitizedSanitizedValue(values.grownStalkPerBdvBonusBid, STALK.decimals).tv;
  const minSizePerExecution = postSanitizedSanitizedValue(values.minBeansConvertPerExecution, mainTokenDecimals).tv;
  const maxSizePerExecution = postSanitizedSanitizedValue(values.maxBeansConvertPerExecution, mainTokenDecimals).tv;

  // min(TotalValueToConvert, min(50 BDV, 5%-10%))
  const defaultMinSizePerExecution = TV.min(
    TRACTOR_CONVERT_UP_DEFAULT_CONSTRAINTS.minSizePerExecution,
    totalConvertBdv.mul(TRACTOR_CONVERT_UP_DEFAULT_CONSTRAINTS.minSizePerExecutionPct),
    totalConvertBdv,
  );

  const preparedArgs = {
    tokenStrategy: strategy,
    totalBeanAmountToConvert: totalConvertBdv,
    minConvertBonusCapacity: defaultMinSizePerExecution,
    minBeansConvertPerExecution: minSizePerExecution.eq(0) ? defaultMinSizePerExecution : minSizePerExecution,
    // default to total convert bdv if max size per execution is not set
    maxBeansConvertPerExecution: maxSizePerExecution.eq(0) ? totalConvertBdv : maxSizePerExecution,
    minPriceToConvertUp,
    maxPriceToConvertUp,
    minTimeBetweenConverts: values.minTimeBetweenConverts,
    maxGrownStalkPerBdv: postSanitizedSanitizedValue(values.maxGrownStalkPerBdv, STALK.decimals).tv,
    grownStalkPerBdvBonusBid,
    seedDifference: postSanitizedSanitizedValue(values.seedDifference, SEEDS.decimals).tv,
    maxGrownStalkPerBdvPenalty: postSanitizedSanitizedValue(values.maxGrownStalkPerBdvPenalty, 18).tv,
    slippageRatio: values.slippageRatio,
    operatorTip: postSanitizedSanitizedValue(values.operatorTip, mainTokenDecimals).tv,
    lowStalkDeposits: values.lowStalkDeposits,
  };

  return preparedArgs;
};
