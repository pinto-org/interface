import { Blueprint, Requisition, createRequisition, useSignRequisition } from "@/lib/Tractor";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { useAccount } from "wagmi";

export default function useSignTractorBlueprint() {
  const [signing, setSigning] = useState(false);

  const signRequisition = useSignRequisition();
  const [signedRequisition, setSignedRequisition] = useState<Requisition | undefined>(undefined);

  const { address } = useAccount();

  const signBlueprint = useCallback(
    async (blueprint: Blueprint, blueprintHash: `0x${string}`) => {
      try {
        if (!address) {
          throw new Error("No signer found.");
        }

        console.log("[useSignTractorBlueprint] Starting signature process", { address, blueprintHash });
        setSigning(true);

        const requisition = createRequisition(blueprint, blueprintHash);
        console.log("[useSignTractorBlueprint] Created requisition, requesting signature...");

        const signedRequisition = await signRequisition(requisition);

        console.log("[useSignTractorBlueprint] Signature successful", signedRequisition);
        setSignedRequisition(signedRequisition);
        toast.success("Blueprint signed successfully");
      } catch (e) {
        console.error("[useSignTractorBlueprint] Signature failed:", e);

        // Check if user rejected the signature
        const errorMessage = e instanceof Error ? e.message : String(e);
        if (
          errorMessage.includes("User rejected") ||
          errorMessage.includes("denied") ||
          errorMessage.includes("cancelled")
        ) {
          toast.error("Signature cancelled");
        } else {
          toast.error(`Failed to sign blueprint: ${errorMessage}`);
        }
      } finally {
        setSigning(false);
      }
    },
    [address, signRequisition],
  );

  return {
    signBlueprint,
    signedRequisition,
    isSigning: signing,
  } as const;
}
