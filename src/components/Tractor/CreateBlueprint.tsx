import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useCallback, useState, useEffect } from "react";
import { useAccount } from "wagmi";
import {
  createBlueprint,
  createRequisition,
  createSowTractorData,
  useSignRequisition,
} from "@/lib/Tractor";
import useTransaction from "@/hooks/useTransaction";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { diamondABI } from "@/constants/abi/diamondABI";
import { Blueprint } from "@/lib/Tractor/types";
import { useGetBlueprintHash } from "@/lib/Tractor/blueprint";
import { toast } from "sonner";
import { decodeFunctionData } from "viem";
import {
  HighlightedCallData,
  decodeCallData,
} from "@/components/Tractor/HighlightedCallData";
import { beanstalkAbi } from "@/generated/contractHooks";

export default function CreateBlueprint() {
  const [pintoAmount, setPintoAmount] = useState("1000");
  const [temperature, setTemperature] = useState("22.5");
  const [repeatCount, setRepeatCount] = useState("3");
  const [minPintoAmount, setMinPintoAmount] = useState("500");
  const [operatorTip, setOperatorTip] = useState("1");
  const [refreshCounter, setRefreshCounter] = useState(0);

  const [decodeAbi, setDecodeAbi] = useState(false);

  const { address } = useAccount();
  const protocolAddress = useProtocolAddress();
  const signRequisition = useSignRequisition();

  const [encodedData, setEncodedData] = useState<`0x${string}` | null>(null);
  const [encodingError, setEncodingError] = useState<string>("");
  const [blueprint, setBlueprint] = useState<Blueprint | null>(null);
  const [requisitionData, setRequisitionData] = useState<any>(null);

  // Get blueprint hash from contract
  const { data: blueprintHash } = useGetBlueprintHash(blueprint);

  // // Update encoded data and blueprint when inputs change
  // useEffect(() => {
  //   if (!address) return;

  //   try {
  //     const { data, operatorPasteInstrs } = createSowTractorData({
  //       totalAmountToSow: pintoAmount,
  //       temperature,
  //       minAmountPerSeason: minPintoAmount,
  //       maxAmountToSowPerSeason: "1000000000000000000000000",
  //       maxPodlineLength: "1000000000000000000000000",
  //       maxGrownStalkPerBdv: "1000000000000000000000000",
  //       runBlocksAfterSunrise: "0",
  //       operatorTip,
  //       whitelistedOperators: [],
  //     });
  //     setEncodedData(data);
  //     setEncodingError("");

  //     // Create blueprint
  //     const newBlueprint = createBlueprint({
  //       publisher: address,
  //       data,
  //       operatorPasteInstrs,
  //       maxNonce: BigInt(repeatCount),
  //     });
  //     setBlueprint(newBlueprint);

  //     // Create requisition without signature if we have a hash
  //     if (blueprintHash) {
  //       const requisition = createRequisition(newBlueprint, blueprintHash);
  //       setRequisitionData(requisition);
  //     }
  //   } catch (error) {
  //     console.error("Error encoding data: ", error);
  //     setEncodedData(null);
  //     setEncodingError("Invalid input values");
  //     setBlueprint(null);
  //     setRequisitionData(null);
  //   }
  // }, [pintoAmount, temperature, repeatCount, address, blueprintHash, minPintoAmount, operatorTip]);

  const handleSuccess = useCallback(() => {
    setRefreshCounter((prev) => prev + 1);
  }, []);

  const { writeWithEstimateGas, submitting, setSubmitting } = useTransaction({
    successMessage: "Publish successful",
    errorMessage: "Publish failed",
    successCallback: handleSuccess,
  });

  const handleSignBlueprint = async () => {
    if (!address || !blueprint || !blueprintHash) {
      console.error("No wallet connected, invalid blueprint, or missing hash");
      return;
    }

    try {
      // Create and sign the requisition using stored blueprint
      const requisition = createRequisition(blueprint, blueprintHash);
      const signedRequisition = await signRequisition(requisition);

      // Update requisition data with signature
      setRequisitionData(signedRequisition);
    } catch (error) {
      console.error("Error signing blueprint:", error);
    }
  };

  const handlePublishRequisition = async () => {
    if (!requisitionData?.signature) {
      toast.error("No signature available");
      return;
    }

    try {
      toast.loading("Publishing requisition...");
      // call publish
      await writeWithEstimateGas({
        address: protocolAddress,
        abi: diamondABI,
        functionName: "publishRequisition",
        args: [requisitionData],
      });
      toast.success("Requisition published successfully");
    } catch (error) {
      console.error("Error publishing requisition:", error);
      toast.error("Failed to publish requisition");
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">Tractor</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm">Decode ABI</span>
            <input
              type="checkbox"
              checked={decodeAbi}
              onChange={(e) => setDecodeAbi(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span>Sow up to</span>
          <input
            type="text"
            value={pintoAmount}
            onChange={(e) => setPintoAmount(e.target.value)}
            className="w-24 px-2 py-1 text-right rounded-lg bg-card border border-border hover:border-foreground focus:border-foreground focus:outline-none"
          />
          <span>Pinto (minimum</span>
          <input
            type="text"
            value={minPintoAmount}
            onChange={(e) => setMinPintoAmount(e.target.value)}
            className="w-24 px-2 py-1 text-right rounded-lg bg-card border border-border hover:border-foreground focus:border-foreground focus:outline-none"
          />
          <span>Pinto) from my Farm Balance, at a minimum temperature of</span>
          <input
            type="text"
            value={temperature}
            onChange={(e) => setTemperature(e.target.value)}
            className="w-24 px-2 py-1 text-right rounded-lg bg-card border border-border hover:border-foreground focus:border-foreground focus:outline-none"
          />
          <span>percent, up to</span>
          <input
            type="text"
            value={repeatCount}
            onChange={(e) => setRepeatCount(e.target.value)}
            className="w-24 px-2 py-1 text-right rounded-lg bg-card border border-border hover:border-foreground focus:border-foreground focus:outline-none"
          />
          <span>number of times.</span>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <span>Tip operator</span>
          <input
            type="text"
            value={operatorTip}
            onChange={(e) => setOperatorTip(e.target.value)}
            className="w-24 px-2 py-1 text-right rounded-lg bg-card border border-border hover:border-foreground focus:border-foreground focus:outline-none"
          />
          <span>Pinto from Farm Balance.</span>
        </div>

        <div className="text-base font-semibold mt-6 mb-2">Farm Call:</div>
        <div className="p-4 bg-gray-100 rounded-lg font-mono text-sm space-y-4">
          {encodingError ? (
            encodingError
          ) : (
            <div>
              <div className="text-sm text-gray-500 mb-1">
                sowWithSource call:
              </div>
              <div className="break-all text-blue-500">
                {blueprint?.data && (
                  <div>
                    {decodeAbi
                      ? decodeCallData(blueprint.data)
                      : blueprint.data}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="text-base font-semibold mb-2">Encoded Farm Data:</div>
        <div className="p-4 bg-gray-100 rounded-lg font-mono text-sm break-all">
          {encodingError ||
            (blueprint?.data && (
              <HighlightedCallData
                blueprintData={blueprint.data}
                targetData={encodedData || ""}
                decodeAbi={decodeAbi}
                encodedData={encodedData}
              />
            ))}
        </div>

        <div className="text-base font-semibold mt-6 mb-2">
          Requisition Data:
        </div>
        <div className="p-4 bg-gray-100 rounded-lg font-mono text-sm mb-6">
          {requisitionData ? (
            <div className="whitespace-pre-wrap break-all">
              {blueprint?.data && (
                <HighlightedCallData
                  blueprintData={blueprint.data}
                  targetData={JSON.stringify(requisitionData, null, 2)}
                  className="whitespace-pre-wrap"
                  decodeAbi={decodeAbi}
                  isRequisitionData={true}
                />
              )}
            </div>
          ) : (
            "Requisition data loading or unavailable."
          )}
        </div>

        <div className="flex flex-row gap-2">
          <Button onClick={handleSignBlueprint} disabled={submitting}>
            {submitting ? "Signing..." : "Sign Blueprint"}
          </Button>

          <Button
            onClick={handlePublishRequisition}
            disabled={submitting || !requisitionData?.signature}
          >
            {submitting ? "Publishing..." : "Publish Requisition"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
