import { createContext, useContext } from "react";

export interface BeanstalkMarketContextValue {
  isBeanstalkMarketplace: boolean;
  fieldId: bigint;
  podMarketplaceId: string | undefined;
}

export const BeanstalkMarketContext = createContext<BeanstalkMarketContextValue>({
  isBeanstalkMarketplace: false,
  fieldId: 0n,
  podMarketplaceId: undefined,
});

export function useBeanstalkMarket() {
  return useContext(BeanstalkMarketContext);
}
