import { beanstalkAddress } from "@/generated/contractHooks";
import { useChainId } from "wagmi";

export const useProtocolAddress = () => {
  const chainId = useChainId();
  const protocolAddress = beanstalkAddress[chainId as keyof typeof beanstalkAddress];
  return protocolAddress;
};
