import { addressAllowanceSlotMap } from "@/constants/slots";
import { beanstalkAddress } from "@/generated/contractHooks";
import { useMemo } from "react";
import { Address, StateOverride, encodePacked, keccak256, maxUint256, numberToHex } from "viem";
import { base } from "viem/chains";
import { useChainId } from "wagmi";
import { stringEq } from "./string";
import { getTokenIndex } from "./token";
import { Token } from "./types";
import { ChainLookup } from "./types.generic";
import { arrayify, exists } from "./utils";

export function getChainConstant<T>(chainId: number, item: ChainLookup<T>) {
  return item[resolveChainId(chainId)];
}

export function useChainConstant<T>(lookup: { [key: number]: T }) {
  const chainId = useChainId();
  return useMemo(() => getChainConstant(chainId, lookup), [chainId, lookup]);
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
  approvalToken: Token | Token[] | undefined,
  account: Address | undefined,
): StateOverride | undefined => {
  const tokens = arrayify(approvalToken ?? []).filter((t) => !t.isNative);

  if (!account || !tokens.length) {
    return undefined;
  }

  const stateOverrides: StateOverride = [];

  for (const token of tokens) {
    const slot = addressAllowanceSlotMap[resolveChainId(chainId)]?.[getTokenIndex(token)];

    if (!exists(slot)) {
      continue;
    }

    stateOverrides.push({
      address: token.address,
      stateDiff: [
        {
          slot: computeAllowanceStorageSlot(account, beanstalkAddress[resolveChainId(chainId)], slot),
          value: numberToHex(maxUint256),
        },
      ],
    });
  }

  return stateOverrides;
};

// in the future a local blockchain explorer link can be added here if chainId is not Base
export const getExplorerLink = (hash: string, chainId: number) => {
  const baseUrl = "https://basescan.org";
  return `${baseUrl}/tx/${hash}`;
};

/**
 * Validate that the address is in the lookup table
 */
export function getMatchingAddressFromLookup(address: Address, lookup: ChainLookup<Address>) {
  return Object.values(lookup).find((a) => stringEq(a, address));
}
