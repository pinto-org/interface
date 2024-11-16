import { Address } from "viem";
import { base } from "viem/chains";
import { useChainId } from "wagmi";

export function useChainConstant<T>(lookup: { [key: number]: T }) {
  const chainId = useResolvedChainId();
  return lookup[chainId as keyof typeof lookup];
}

export const useChainAddress = useChainConstant<Address>;

export const useResolvedChainId = () => {
  const chainId = useChainId();

  if (chainId === 1337 || chainId === 41337) {
    return base.id;
  }

  return chainId;
};
