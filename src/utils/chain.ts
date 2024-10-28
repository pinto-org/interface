import { useChainId } from "wagmi";
import { Address } from "viem";

export function useChainConstant<T>(lookup: { [key: number]: T }) {
  const chainId = useChainId();
  return lookup[chainId as keyof typeof lookup];
}

export const useChainAddress = useChainConstant<Address>;
