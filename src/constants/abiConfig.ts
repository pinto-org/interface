import { is0xString } from "@/utils/string";
import { ChainLookup, HashString } from "@/utils/types.generic";
import { Abi } from "viem";
import { arbitrum, base, foundry, localhost, mainnet } from "wagmi/chains";
import { pipelineABI } from "./abi/PipelineABI";
import { siloHelpersABI } from "./abi/SiloHelpersABI";
import { sowBlueprintv0ABI } from "./abi/SowBlueprintv0ABI";
import { tractorHelpersABI } from "./abi/TractorHelpersABI";
import { convertUpBlueprintV0ABI } from "./abi/convertUpBlueprintV0ABI";
import { depotABI } from "./abi/depotABI";
import { diamondABI } from "./abi/diamondABI";
import { diamondPriceABI } from "./abi/diamondPriceABI";

const TESTNET_CHAIN_ID = 41337;

const populateBaseIshAddress = (
  address: HashString | string,
  overrides?: {
    [chainId: number]: HashString;
  },
): ChainLookup<HashString> => {
  if (!is0xString(address)) {
    throw new Error(`Address must be a valid hex string: ${address}`);
  }

  return {
    [base.id]: address,
    [localhost.id]: address,
    [TESTNET_CHAIN_ID]: address,
    [foundry.id]: address,
    ...(overrides ?? {}),
  };
};

const ADDRESSES_LOOKUP = {
  // diamond
  beanstalk: {
    [mainnet.id]: "0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5",
    [arbitrum.id]: "0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70",
    ...populateBaseIshAddress("0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f"),
  },
  // diamond price
  beanstalkPrice: {
    [mainnet.id]: "0x4BEd6cb142b7d474242d87F4796387DEB9E1E1B4",
    [arbitrum.id]: "0xC218F5a782b0913931DCF502FA2aA959b36Ac9E7",
    ...populateBaseIshAddress("0x85D07892B8F3E3E7856C7d5f9e11025F4D564D4A"),
  },
  // ecosystem
  pipeline: {
    [mainnet.id]: "0xb1bE0000C6B3C62749b5F0c92480146452D15423",
    [arbitrum.id]: "0xb1bE000644bD25996b0d9C2F7a6D6BA3954c91B0",
    ...populateBaseIshAddress("0xb1bE0001f5a373b69b1E132b420e6D9687155e80"),
  },
  depot: {
    [mainnet.id]: "0xDEb0f00071497a5cc9b4A6B96068277e57A82Ae2",
    [arbitrum.id]: "0xDEb0f0dEEc1A29ab97ABf65E537452D1B00A619c",
    ...populateBaseIshAddress("0x02F7c20dabC251f35272492177E177035C21269B"),
  },
  // tractor
  tractorHelpers: {
    ...populateBaseIshAddress("0x8C40De70aaa48157cF554359d15eF2Dab43F9191"),
  },
  siloHelpers: {
    ...populateBaseIshAddress("0xC419dAEeec30524f568f4f72D8957728fe09AACa"),
  },
  sowBlueprintv0: {
    ...populateBaseIshAddress("0xbb0a41927895F8ca2b4ECCc659ba158735fCF28B"),
  },
  convertUpBlueprint: {
    ...populateBaseIshAddress("0xD7d1be99676c792066b162aB902eF6E2bbC291Fe"),
  },
} as const;

const ABI_CONFIG = {
  beanstalk: {
    abi: diamondABI as Abi,
    addresses: ADDRESSES_LOOKUP.beanstalk,
  },
  beanstalkPrice: {
    abi: diamondPriceABI as Abi,
    address: ADDRESSES_LOOKUP.beanstalkPrice,
  },
  pipeline: {
    abi: pipelineABI as Abi,
    address: ADDRESSES_LOOKUP.pipeline,
  },
  depot: {
    abi: depotABI as Abi,
    address: ADDRESSES_LOOKUP.depot,
  },
  tractorHelpers: {
    abi: tractorHelpersABI as Abi,
    address: ADDRESSES_LOOKUP.tractorHelpers,
  },
  siloHelpers: {
    abi: siloHelpersABI as Abi,
    address: ADDRESSES_LOOKUP.siloHelpers,
  },
  sowBlueprintv0: {
    abi: sowBlueprintv0ABI as Abi,
    address: ADDRESSES_LOOKUP.sowBlueprintv0,
  },
  convertUpBlueprint: {
    abi: convertUpBlueprintV0ABI as Abi,
    address: ADDRESSES_LOOKUP.convertUpBlueprint,
  },
} as const;

export default ABI_CONFIG;
