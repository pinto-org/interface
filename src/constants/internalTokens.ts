import podLogo from "@/assets/protocol/Pod.png";
import seedLogo from "@/assets/protocol/Seed.png";
import stalkLogo from "@/assets/protocol/Stalk.png";

import { InternalToken } from "@/utils/types";

export const STALK: InternalToken = {
  name: "Stalk",
  symbol: "STALK",
  decimals: 16,
  displayDecimals: 2,
  logoURI: stalkLogo,
};

export const SEEDS: InternalToken = {
  name: "Seeds",
  symbol: "SEED",
  decimals: 6,
  displayDecimals: 2,
  logoURI: seedLogo,
};

export const PODS: InternalToken = {
  name: "Pods",
  symbol: "PODS",
  decimals: 6,
  displayDecimals: 2,
  logoURI: podLogo,
};
