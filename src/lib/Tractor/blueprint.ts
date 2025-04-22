import { diamondABI } from "@/constants/abi/diamondABI";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { Address, encodeAbiParameters, encodePacked, getAddress, keccak256 } from "viem";
import { useChainId, useReadContract, useSignTypedData } from "wagmi";
import { Blueprint, Requisition } from "./types";

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
    startTime: startTime ?? now - 24n * 3600n, // Default 24 hours before now, this makes testing easier
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
