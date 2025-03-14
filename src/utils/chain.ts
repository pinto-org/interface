import { addressAllowanceSlotMap } from "@/constants/slots";
import { beanstalkAddress } from "@/generated/contractHooks";
import { Address, StateOverride, encodePacked, keccak256, maxUint256, numberToHex } from "viem";
import { base } from "viem/chains";
import { useChainId } from "wagmi";
import { getTokenIndex } from "./token";
import { Token } from "./types";
import { exists } from "./utils";

export function useChainConstant<T>(lookup: { [key: number]: T }) {
  const chainId = useResolvedChainId();
  return lookup[chainId as keyof typeof lookup];
}

export const useChainAddress = useChainConstant<Address>;

export const useResolvedChainId = () => {
  const chainId = useChainId();
  return resolveChainId(chainId);
};

export const resolveChainId = (chainId: number) => {
  if (chainId === 1337 || chainId === 41337) {
    return base.id;
  }

  return chainId;
};

export const computeAllowanceStorageSlot = (owner: Address, spender: Address, baseSlot: number) => {
  // First hash: key1 and baseSlot
  const initialHash = keccak256(encodePacked(["uint256", "uint256"], [BigInt(owner), BigInt(baseSlot)]));
  // Second hash: key2 and initialHash
  return keccak256(encodePacked(["uint256", "uint256"], [BigInt(spender), BigInt(initialHash)]));
};

export const getOverrideAllowanceStateOverride = (
  chainId: number,
  approvalToken: Token | undefined,
  account: Address | undefined,
): StateOverride | undefined => {
  if (!account || !approvalToken || approvalToken.isNative) return undefined;
  const slot = addressAllowanceSlotMap[resolveChainId(chainId)]?.[getTokenIndex(approvalToken)];
  if (!exists(slot)) return undefined;

  return [
    {
      address: approvalToken.address,
      stateDiff: [
        {
          slot: computeAllowanceStorageSlot(account, beanstalkAddress[resolveChainId(chainId)], slot),
          value: numberToHex(maxUint256),
        },
      ],
    },
  ];
};

// in the future a local blockchain explorer link can be added here if chainId is not Base
export const getExplorerLink = (hash: string, chainId: number) => {
  const baseUrl = "https://basescan.org";
  return `${baseUrl}/tx/${hash}`;
};
