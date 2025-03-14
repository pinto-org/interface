import { Address, encodeAbiParameters, keccak256, encodePacked, getAddress } from "viem";
import { Blueprint, Requisition } from "./types";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { useReadContract, useSignTypedData, useChainId } from "wagmi";
import { diamondABI } from "@/constants/abi/diamondABI";

// EIP-712 Domain and Types
const DOMAIN_TYPE = {
  name: "Tractor",
  version: "1.0.0",
} as const;

const TYPES = {
  Blueprint: [
    { name: "publisher", type: "address" },
    { name: "data", type: "bytes" },
    { name: "operatorPasteInstrs", type: "bytes32[]" },
    { name: "maxNonce", type: "uint256" },
    { name: "startTime", type: "uint256" },
    { name: "endTime", type: "uint256" },
  ],
} as const;

/**
 * Creates a new Blueprint with the given parameters
 */
export function createBlueprint({
  publisher,
  data,
  operatorPasteInstrs = [],
  maxNonce = 1n,
  startTime,
  endTime,
}: {
  publisher: Address;
  data: `0x${string}`;
  operatorPasteInstrs?: `0x${string}`[];
  maxNonce?: bigint;
  startTime?: bigint;
  endTime?: bigint;
}): Blueprint {
  const now = BigInt(Math.floor(Date.now() / 1000));
  return {
    publisher: publisher.toLowerCase() as Address,
    data,
    operatorPasteInstrs,
    maxNonce,
    startTime: startTime ?? now - 10n * 3600n, // Default 10 hours before now
    endTime: endTime ?? BigInt(2) ** BigInt(256) - BigInt(1), // Default uint256 max
  };
}

/**
 * Hook to get the blueprint hash from the contract
 */
export function useGetBlueprintHash(blueprint: Blueprint | null) {
  const protocolAddress = useProtocolAddress();

  const result = useReadContract({
    address: protocolAddress,
    abi: diamondABI,
    functionName: "getBlueprintHash",
    args: blueprint ? [blueprint] : undefined,
  });

  return result;
}

/**
 * Creates a new Requisition from a Blueprint
 */
export function createRequisition(blueprint: Blueprint, hash: `0x${string}`): Requisition {
  return {
    blueprint,
    blueprintHash: hash,
  };
}

/**
 * Hook to sign a requisition using EIP-712 typed data
 */
export function useSignRequisition() {
  const protocolAddress = useProtocolAddress();
  const chainId = useChainId();
  const { signTypedDataAsync } = useSignTypedData();

  return async (requisition: Requisition): Promise<Requisition> => {
    const domain = {
      ...DOMAIN_TYPE,
      chainId,
      verifyingContract: protocolAddress,
    };

    const signature = await signTypedDataAsync({
      domain,
      types: TYPES,
      primaryType: "Blueprint",
      message: requisition.blueprint,
    });

    return {
      ...requisition,
      signature,
    };
  };
}
