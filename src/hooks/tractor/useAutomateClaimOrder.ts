import { TV } from "@/classes/TokenValue";
import {
  TractorOperatorTipStrategy,
  getTractorOperatorTipAmountFromPreset,
} from "@/components/Tractor/form/fields/sharedFields";
import { type AutomateClaimFormValues } from "@/components/Tractor/form/schema/automateClaim.schema";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { Blueprint, createBlueprintFromBlock } from "@/lib/Tractor";
import { createAutomateClaimTractorData } from "@/lib/Tractor/claimOrder";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useAccount, usePublicClient } from "wagmi";

// ────────────────────────────────────────────────────────────────────────────────
// TYPES
// ────────────────────────────────────────────────────────────────────────────────

export type AutomateClaimOrderState = {
  blueprint: Blueprint;
  encodedData: `0x${string}`;
  operatorPasteInstructions: `0x${string}`[];
  depositOptimizationCalls: `0x${string}`[];
};

export type AutomateClaimOrderData = {
  mowEnabled: boolean;
  plantEnabled: boolean;
  harvestEnabled: boolean;
  operatorTip: string;
};

// ────────────────────────────────────────────────────────────────────────────────
// HOOK
// ────────────────────────────────────────────────────────────────────────────────

export const useAutomateClaimOrder = () => {
  const client = usePublicClient();
  const { address } = useAccount();
  const protocolAddress = useProtocolAddress();

  const [state, setState] = useState<AutomateClaimOrderState | undefined>(undefined);
  const [orderData, setOrderData] = useState<AutomateClaimOrderData | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateBlueprint = useCallback(
    async (
      form: ReturnType<typeof useForm<AutomateClaimFormValues>>,
      averageTipPaid: number,
      operatorTipPreset: TractorOperatorTipStrategy,
      deposits?: ReturnType<typeof useFarmerSilo>["deposits"],
      options?: {
        onFailure?: () => void;
        onSuccess?: () => void;
      },
    ) => {
      if (!client) {
        throw new Error("No public client available.");
      }
      if (!address) {
        throw new Error("Signer not found.");
      }

      setIsLoading(true);

      try {
        const formData = form.getValues();
        console.debug("[useAutomateClaimOrder] Creating blueprint with form data:", formData);

        // Resolve operator tip amount from preset
        const tipTV = getTractorOperatorTipAmountFromPreset(
          operatorTipPreset,
          averageTipPaid,
          formData.customOperatorTip,
          6, // PINTO decimals
        );

        if (!tipTV) {
          throw new Error("Unable to resolve operator tip amount.");
        }

        const tipPerExecution = tipTV.toBigInt();
        console.debug("[useAutomateClaimOrder] Tip per execution:", tipPerExecution.toString());

        // Create tractor data and fetch latest block in parallel
        const [tractorData, block] = await Promise.all([
          createAutomateClaimTractorData({
            formValues: formData,
            tipPerExecution,
            whitelistedOperators: [],
            publicClient: client,
            farmerDeposits: deposits,
            userAddress: address,
            protocolAddress,
          }).catch((e) => {
            console.error("[useAutomateClaimOrder] Error creating tractor data:", e);
            throw e;
          }),
          client.getBlock({ blockTag: "latest" }),
        ]);

        console.debug("[useAutomateClaimOrder] Tractor data created:", tractorData);

        // Create the blueprint (Req 5.2)
        const blueprint = createBlueprintFromBlock({
          block,
          publisher: address,
          data: tractorData.data,
          operatorPasteInstrs: tractorData.operatorPasteInstrs,
          maxNonce: TV.MAX_UINT256.toBigInt(),
        });

        console.debug("[useAutomateClaimOrder] Blueprint created:", blueprint);

        // Set order data for display in ReviewTractorOrderDialog
        setOrderData({
          mowEnabled: formData.mowEnabled,
          plantEnabled: formData.plantEnabled,
          harvestEnabled: formData.harvestEnabled,
          operatorTip: tipTV.toHuman(),
        });

        // Set state for the blueprint and encoded data
        setState({
          blueprint,
          encodedData: tractorData.data,
          operatorPasteInstructions: tractorData.operatorPasteInstrs,
          depositOptimizationCalls: tractorData.depositOptimizationCalls || [],
        });

        options?.onSuccess?.();
      } catch (_) {
        options?.onFailure?.();
      } finally {
        setIsLoading(false);
      }
    },
    [client, address, protocolAddress],
  );

  return {
    state,
    orderData,
    isLoading,
    handleCreateBlueprint,
  } as const;
};
