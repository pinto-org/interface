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

export const URBDV: InternalToken = {
  name: "Unripe BDV",
  symbol: "urBDV",
  decimals: 6,
  displayDecimals: 2,
  logoURI: "", // TODO: Add logo if needed
};

export const BSFERT: InternalToken = {
  name: "Beanstalk Payback Fertilizer",
  symbol: "bsFERT",
  decimals: 0,
  displayDecimals: 0,
  logoURI: "", // TODO: Add bsFERT icon
};

export const SPROUTS: InternalToken = {
  name: "Sprouts",
  symbol: "SPROUTS",
  decimals: 6,
  displayDecimals: 2,
  logoURI: "", // TODO: Add logo if needed
};
