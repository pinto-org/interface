import { ANALYTICS_EVENTS } from "@/constants/analytics-events";
import { trackClick } from "@/utils/analytics";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { DiagonalRightArrowIcon } from "../Icons";
import { Carousel, CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/Carousel";

type TimelineEventType =
  | "event"
  | "modelImprovement"
  | "parametrization"
  | "utility"
  | "infrastructure"
  | "budget"
  | "security"
  | "governance"
  | "didNotPass"
  | "bugFix"
  | "emergencyBugFix"
  | "yearMarker"
  | "audit";

interface TimelineEvent {
  name: string;
  description: string;
  githubLink: string;
  hashLink: string;
  date: string;
  timestamp: number;
  auditHash: string;
  auditor: string;
  isYearMarker?: boolean;
  isCombined?: boolean;
  combinedHashes?: string[];
  combinedLinks?: string[];
  descriptions?: string[];
  customLines?: { before?: number; after?: number };
  isUpgrade?: boolean;
  type: TimelineEventType[];
}

// Pinto Improvement Proposals
const piAudits: TimelineEvent[] = [
  {
    name: "PI-12",
    description: "Decrease Excessively Low L2SR Threshold",
    githubLink: "https://github.com/pinto-org/protocol/issues/142",
    hashLink: "",
    date: "September 8, 2025",
    timestamp: new Date("September 8, 2025").getTime(),
    auditHash: "",
    auditor: "bean",
    type: ["modelImprovement", "parametrization"],
    customLines: { after: 6, before: 6 },
  },
  {
    name: "PI-11",
    description: "Update Convert Down Penalty Gauge and Dewhitelist Pools",
    githubLink: "https://github.com/pinto-org/protocol/pull/136",
    hashLink: "",
    date: "July 31, 2025",
    timestamp: new Date("July 31, 2025").getTime(),
    auditHash: "",
    auditor: "cantina",
    type: ["modelImprovement", "utility"],
  },
  {
    name: "PI-10",
    description: "Fix Cultivation Gauge and Revise Parameters",
    githubLink: "https://github.com/pinto-org/protocol/pull/114",
    hashLink: "",
    date: "June 19, 2025",
    timestamp: new Date("June 19, 2025").getTime(),
    auditHash: "",
    auditor: "cantina",
    type: ["modelImprovement", "parametrization"],
  },
  {
    name: "PI-9",
    description: "Helper Function Bug Fix",
    githubLink: "https://github.com/pinto-org/protocol/pull/77",
    hashLink: "",
    date: "April 18, 2025",
    timestamp: new Date("April 18, 2025").getTime(),
    auditHash: "",
    auditor: "cantina",
    type: ["bugFix"],
  },
  {
    name: "PI-8",
    description: "Misc. Efficiency Improvements",
    githubLink: "https://github.com/pinto-org/protocol/pull/47",
    hashLink: "",
    date: "April 17, 2025",
    timestamp: new Date("April 17, 2025").getTime(),
    auditHash: "",
    auditor: "cantina",
    type: ["modelImprovement", "parametrization", "utility"],
  },
  {
    name: "PI-7",
    description: "Convert Down Penalty",
    githubLink: "https://github.com/pinto-org/protocol/pull/33",
    hashLink: "",
    date: "March 25, 2025",
    timestamp: new Date("March 25, 2025").getTime(),
    auditHash: "",
    auditor: "cantina",
    type: ["modelImprovement", "parametrization"],
  },
  {
    name: "PI-6",
    description: "Soil Issuance Below Target, Crop Ratio Changes",
    githubLink: "https://github.com/pinto-org/protocol/pull/8",
    hashLink: "",
    date: "March 12, 2025",
    timestamp: new Date("March 12, 2025").getTime(),
    auditHash: "",
    auditor: "cantina",
    customLines: { before: 6, after: 6 },
    type: ["parametrization", "infrastructure", "modelImprovement"],
  },
  {
    name: "PI-5",
    description: "Soil Issuance and Parameter Changes",
    githubLink: "https://github.com/pinto-org/protocol/pull/7",
    hashLink: "",
    date: "January 2, 2025",
    timestamp: new Date("January 2, 2025").getTime(),
    auditHash: "",
    auditor: "cantina",
    type: ["parametrization", "infrastructure"],
  },
  {
    name: "PI-4",
    description: "Demand for Soil Adjustments",
    githubLink: "https://github.com/pinto-org/protocol/pull/5",
    hashLink: "",
    date: "December 8, 2024",
    timestamp: new Date("December 8, 2024").getTime(),
    auditHash: "",
    auditor: "cantina",
    type: ["parametrization"],
  },
  {
    name: "PI-3",
    description: "Bug Fixes and Parameter Changes",
    githubLink: "https://github.com/pinto-org/protocol/pull/4",
    hashLink: "",
    date: "December 4, 2024",
    timestamp: new Date("December 4, 2024").getTime(),
    auditHash: "",
    auditor: "cantina",
    type: ["parametrization", "utility"],
  },
  {
    name: "PI-2",
    description: "Remove Anti L2L Convert",
    githubLink: "https://github.com/pinto-org/protocol/pull/3",
    hashLink: "",
    date: "November 27, 2024",
    timestamp: new Date("November 27, 2024").getTime(),
    auditHash: "",
    auditor: "cantina",
    type: ["emergencyBugFix"],
  },
  {
    name: "PI-1",
    description: "Convert Earned Pinto, Misc. Fixes",
    githubLink: "https://github.com/pinto-org/protocol/pull/2",
    hashLink: "",
    date: "November 26, 2024",
    timestamp: new Date("November 26, 2024").getTime(),
    auditHash: "",
    auditor: "cantina",
    type: ["parametrization", "utility"],
  },
  {
    name: "PI-0",
    description: "Update Pump Parameters",
    githubLink: "https://github.com/pinto-org/protocol/pull/1",
    hashLink: "",
    date: "November 19, 2024",
    timestamp: new Date("November 19, 2024 13:00:00").getTime(),
    auditHash: "",
    auditor: "cantina",
    type: ["parametrization", "bugFix"],
  },
];

// Bean Improvement Proposals
const bipAudits: TimelineEvent[] = [
  {
    name: "BIP-50",
    description: "Reseed Beanstalk",
    githubLink: "https://github.com/BeanstalkFarms/Beanstalk/pull/909",
    hashLink: "https://github.com/BeanstalkFarms/Beanstalk/pull/909/commits/faa0ec60a455b0afdd20ad86f28f41cbc52c2e2d",
    date: "October 8, 2024",
    timestamp: new Date("October 8, 2024").getTime(),
    auditHash: "4e0ad0b964f74a1b4880114f4dd5b339bc69cd3e",
    auditor: "codehawks",
    type: ["modelImprovement", "infrastructure", "parametrization", "event"],
    isUpgrade: true,
  },
  {
    name: "BIP-49",
    description: "Misc. Improvements",
    githubLink: "https://github.com/BeanstalkFarms/Beanstalk/pull/802",
    hashLink: "https://github.com/BeanstalkFarms/Beanstalk/pull/802/commits/10c50916acdd1a2ea8c3699217779cbbe549389e",
    date: "August 5, 2024",
    timestamp: new Date("August 5, 2024").getTime(),
    auditHash: "0552609b63f76a69190015b7e2abfded60a30960",
    auditor: "codehawks",
    type: ["parametrization", "utility"],
    isUpgrade: true,
  },
  {
    name: "BIP-48",
    description: "Whitelist BEANwstETH",
    githubLink: "https://github.com/BeanstalkFarms/Beanstalk/pull/758",
    hashLink: "https://github.com/BeanstalkFarms/Beanstalk/pull/758/commits/45afeaf1f9c57bcdf506336aff63fa8805a1081f",
    date: "July 26, 2024",
    timestamp: new Date("July 26, 2024").getTime(),
    auditHash: "9b77984f43a1fd47f5617006502f28b8528962a3",
    auditor: "codehawks",
    type: ["utility"],
    isUpgrade: true,
  },
  {
    name: "BIP-47",
    description: "Adjust Quorum",
    githubLink: "https://github.com/BeanstalkFarms/Beanstalk/pull/866",
    hashLink: "",
    date: "May 29, 2024",
    timestamp: new Date("May 29, 2024").getTime(),
    auditHash: "",
    auditor: "bean",
    type: ["governance"],
  },
  {
    name: "BIP-46",
    description: "Hypernative",
    githubLink: "https://github.com/BeanstalkFarms/Beanstalk/pull/842",
    hashLink: "",
    date: "May 21, 2024",
    timestamp: new Date("May 21, 2024").getTime(),
    auditHash: "",
    auditor: "bean",
    type: ["security"],
    isUpgrade: true,
  },
  {
    name: "BIP-45",
    description: "Seed Gauge",
    githubLink: "https://github.com/BeanstalkFarms/Beanstalk/pull/722",
    hashLink: "https://github.com/BeanstalkFarms/Beanstalk/pull/722/commits/ac8e681c7daa7cb046c1e405b27e50e7e44c0504",
    date: "May 21, 2024",
    timestamp: new Date("May 21, 2024").getTime(),
    auditHash: "a3658861af8f5126224718af494d02352fbb3ea5",
    auditor: "codehawks",
    type: ["modelImprovement"],
    isUpgrade: true,
  },
  {
    name: "BIP-44",
    description: "Seed Gauge",
    githubLink: "https://github.com/BeanstalkFarms/Beanstalk-Governance-Proposals/blob/master/bip/bip-44-seed-gauge.md",
    hashLink: "https://github.com/BeanstalkFarms/Beanstalk/pull/722/commits/ac8e681c7daa7cb046c1e405b27e50e7e44c0504",
    date: "May 8, 2024",
    timestamp: new Date("May 8, 2024").getTime(),
    auditHash: "",
    auditor: "bean",
    type: ["modelImprovement", "didNotPass"],
  },
  {
    name: "BIP-43",
    description: "Hypernative",
    githubLink: "https://github.com/BeanstalkFarms/Beanstalk/pull/842",
    hashLink: "",
    date: "May 8, 2024",
    timestamp: new Date("May 8, 2024").getTime(),
    auditHash: "",
    auditor: "bean",
    type: ["security", "didNotPass"],
  },
  {
    name: "BIP-42",
    description: "Seed Gauge",
    githubLink: "https://github.com/BeanstalkFarms/Beanstalk-Governance-Proposals/blob/master/bip/bip-42-seed-gauge.md",
    hashLink: "https://github.com/BeanstalkFarms/Beanstalk/pull/722/commits/cbef4ff3330ed2642081e35a9e2435f442e628ae",
    date: "May 1, 2024",
    timestamp: new Date("May 1, 2024").getTime(),
    auditHash: "",
    auditor: "bean",
    type: ["modelImprovement", "didNotPass"],
  },
  {
    name: "BIP-41",
    description: "Immunefi Program Update",
    githubLink: "https://github.com/BeanstalkFarms/Beanstalk/pull/771",
    hashLink: "",
    date: "February 26, 2024",
    timestamp: new Date("February 26, 2024").getTime(),
    auditHash: "",
    auditor: "bean",
    type: ["security"],
  },
  {
    name: "BIP-40",
    description: "Beanstalk Farms 2024 Development Budget",
    githubLink: "https://github.com/BeanstalkFarms/Beanstalk/pull/770",
    hashLink: "",
    date: "February 26, 2024",
    timestamp: new Date("February 26, 2024").getTime(),
    auditHash: "",
    auditor: "bean",
    type: ["budget"],
  },
  {
    name: "BIP-39",
    description: "Beanstalk Farms 2024 Development Budget",
    githubLink: "https://github.com/BeanstalkFarms/Beanstalk/pull/756",
    hashLink: "",
    date: "January 31, 2024",
    timestamp: new Date("January 31, 2024").getTime(),
    auditHash: "",
    auditor: "bean",
    type: ["budget", "didNotPass"],
  },
  {
    name: "BIP-38",
    description: "Unripe Migration",
    githubLink: "https://github.com/BeanstalkFarms/Beanstalk/pull/655",
    hashLink: "https://github.com/BeanstalkFarms/Beanstalk/tree/76066733bcddb944b9af8f29acf150c02a5b8437",
    date: "October 20, 2023",
    timestamp: new Date("October 20, 2023").getTime(),
    auditHash: "76066733bcddb944b9af8f29acf150c02a5b8437",
    auditor: "cyfrin",
    type: ["event"],
    isUpgrade: true,
  },
  {
    name: "BIP-37",
    description: "Basin Integration",
    githubLink: "https://github.com/BeanstalkFarms/Beanstalk/pull/378",
    hashLink: "https://github.com/BeanstalkFarms/Beanstalk/tree/76a188233917afc1db103ca64b02dab8c5280b35",
    date: "August 30, 2023",
    timestamp: new Date("August 30, 2023").getTime(),
    auditHash: "78d7045a4e6900dfbdc5f1119b202b4f30ff6ab8",
    auditor: "halborn",
    type: ["infrastructure", "utility"],
    isUpgrade: true,
  },
  {
    name: "BIP-36",
    description: "Silo V3",
    githubLink: "https://github.com/BeanstalkFarms/Beanstalk/pull/410",
    hashLink: "https://github.com/BeanstalkFarms/Beanstalk/pull/410/commits/9f286e1f1b1e67bc40d35aaf4b16e5c6d83ebdd9",
    date: "July 10, 2023",
    timestamp: new Date("July 10, 2023").getTime(),
    auditHash: "24bf3d33355f516648b02780b4b232181afde200",
    auditor: "halborn",
    type: ["infrastructure", "modelImprovement"],
    isUpgrade: true,
  },
  {
    name: "BIP-35",
    description: "Stalk Delegation and Process Amendments",
    githubLink: "https://github.com/BeanstalkFarms/Beanstalk/pull/401",
    hashLink: "",
    date: "May 3, 2023",
    timestamp: new Date("May 3, 2023").getTime(),
    auditHash: "",
    auditor: "bean",
    type: ["governance"],
  },
  {
    name: "BIP-34",
    description: "Sunrise Improvements",
    githubLink: "https://github.com/BeanstalkFarms/Beanstalk/pull/337",
    hashLink: "https://github.com/BeanstalkFarms/Beanstalk/pull/337/commits/538b7a2a89760f6e7aab0fa3146551c030f388d1",
    date: "May 3, 2023",
    timestamp: new Date("May 3, 2023").getTime(),
    auditHash: "f37cb42809fb8dfc9a0f2891db1ad96a1b848a4c",
    auditor: "halborn",
    type: ["modelImprovement"],
    isUpgrade: true,
  },
  {
    name: "BIP-33",
    description: "Beanstalk Farms H1 2023 Budget",
    githubLink: "https://github.com/BeanstalkFarms/Beanstalk/pull/285",
    hashLink: "",
    date: "February 8, 2023",
    timestamp: new Date("February 8, 2023").getTime(),
    auditHash: "",
    auditor: "bean",
    type: ["budget"],
  },
  {
    name: "BIP-32",
    description: "Seraph",
    githubLink: "https://github.com/BeanstalkFarms/Beanstalk/pull/175",
    hashLink: "https://github.com/BeanstalkFarms/Beanstalk/pull/175/commits/bac39bb8c51e8076c6fe9690ac2fd09c5bdbeeea",
    date: "January 7, 2023",
    timestamp: new Date("January 7, 2023").getTime(),
    auditHash: "",
    auditor: "bean",
    type: ["security"],
    isUpgrade: true,
  },
  {
    name: "BIP-31",
    description: "Beanstalk Farms Q1 2023 Budget",
    githubLink: "https://github.com/BeanstalkFarms/Beanstalk/pull/176",
    hashLink: "https://github.com/BeanstalkFarms/Beanstalk/pull/176/commits/91554e8ebeb9237eb83ecbfa5451e170bdcc3c15",
    date: "January 7, 2023",
    timestamp: new Date("January 7, 2023").getTime(),
    auditHash: "",
    auditor: "bean",
    type: ["budget"],
  },
  {
    name: "BIP-30",
    description: "Pipeline",
    githubLink: "https://github.com/BeanstalkFarms/Beanstalk/pull/103",
    hashLink: "https://github.com/BeanstalkFarms/Beanstalk/pull/103/commits/9029875262f83cf394b0ed048704133e16e969d4",
    date: "December 1, 2022",
    timestamp: new Date("December 1, 2022").getTime(),
    auditHash: "e193bdf747e804c13280453f3dbb52ebc797091b",
    auditor: "halborn",
    type: ["utility"],
    isUpgrade: true,
  },
  {
    name: "BIP-29",
    description: "Pod Market Price Functions",
    githubLink: "https://github.com/BeanstalkFarms/Beanstalk/pull/87",
    hashLink: "https://github.com/BeanstalkFarms/Beanstalk/tree/0bdd376263b0fe94af84aaf4adb6391b39fa80ab",
    date: "November 11, 2022",
    timestamp: new Date("November 11, 2022").getTime(),
    auditHash: "0bdd376263b0fe94af84aaf4adb6391b39fa80ab",
    auditor: "halborn",
    type: ["utility"],
    isUpgrade: true,
  },
  {
    name: "BIP-28",
    description: "Pod Market Price Functions",
    githubLink:
      "https://github.com/BeanstalkFarms/Beanstalk-Governance-Proposals/blob/master/bip/bip-28-pod-market-price-functions.md",
    hashLink: "https://github.com/BeanstalkFarms/Beanstalk/commit/b6a567d842e72c73176099ffd8ddb04cae2232e6",
    date: "November 1, 2022",
    timestamp: new Date("November 1, 2022").getTime(),
    auditHash: "0bdd376263b0fe94af84aaf4adb6391b39fa80ab",
    auditor: "halborn",
    type: ["didNotPass"],
  },
  {
    name: "BIP-27",
    description: "Bean Sprout Q4 2022 Budget",
    githubLink: "https://github.com/BeanstalkFarms/Beanstalk/pull/101",
    hashLink: "",
    date: "October 6, 2022",
    timestamp: new Date("October 6, 2022").getTime(),
    auditHash: "",
    auditor: "bean",
    type: ["budget"],
  },
  {
    name: "BIP-26",
    description: "Immunefi Bug Bounty Program",
    githubLink: "https://github.com/BeanstalkFarms/Beanstalk/pull/100",
    hashLink: "",
    date: "October 6, 2022",
    timestamp: new Date("October 6, 2022").getTime(),
    auditHash: "",
    auditor: "bean",
    type: ["security"],
  },
  {
    name: "BIP-25",
    description: "Beanstalk Farms Q4 2022 Budget",
    githubLink: "https://github.com/BeanstalkFarms/Beanstalk/pull/99",
    hashLink: "https://github.com/BeanstalkFarms/Beanstalk/pull/99/commits/4e7a4a8417e743a8b4f3aec972ecbce9c267adc7",
    date: "October 5, 2022",
    timestamp: new Date("October 5, 2022").getTime(),
    auditHash: "",
    auditor: "bean",
    type: ["budget"],
  },
  {
    name: "BIP-24",
    description: "Fungible BDV Support",
    githubLink: "https://github.com/BeanstalkFarms/Beanstalk/pull/82",
    hashLink: "https://github.com/BeanstalkFarms/Beanstalk/pull/82/commits/877224df1f6f98245a8693fa74fd37657bee13e2",
    date: "October 5, 2022",
    timestamp: new Date("October 5, 2022").getTime(),
    auditHash: "6699e071626a17283facc67242536037989ecd91",
    auditor: "halborn",
    type: ["utility"],
    isUpgrade: true,
  },
  {
    name: "BIP-23",
    description: "Bean Sprout Q3 2022 Budget",
    githubLink: "https://github.com/BeanstalkFarms/Beanstalk/pull/79",
    hashLink: "https://github.com/BeanstalkFarms/Beanstalk/commit/42ebfdc80201361d7eb72c1c54dc3432fd9d3e4c",
    date: "August 16, 2022",
    timestamp: new Date("August 16, 2022").getTime(),
    auditHash: "",
    auditor: "bean",
    type: ["budget"],
  },
  {
    name: "BIP-22",
    description: "Beanstalk Farms Q3 2022 Budget",
    githubLink: "https://github.com/BeanstalkFarms/Beanstalk/pull/78",
    hashLink: "https://github.com/BeanstalkFarms/Beanstalk/commit/3b13177801b740d0f89918ea786f05f3f8d3cc0d",
    date: "August 16, 2022",
    timestamp: new Date("August 16, 2022").getTime(),
    auditHash: "",
    auditor: "bean",
    type: ["budget"],
  },
  {
    name: "BIP-21",
    description: "Replant Beanstalk",
    githubLink: "https://github.com/BeanstalkFarms/Beanstalk/pull/72",
    hashLink: "",
    date: "August 5, 2022",
    timestamp: new Date("August 5, 2022").getTime(),
    auditHash: "",
    auditor: "bean",
    customLines: { before: 6, after: 6 },
    type: ["event"],
    isUpgrade: true,
  },
  {
    name: "BIP-20",
    description: "Migration of Balances",
    githubLink:
      "https://github.com/BeanstalkFarms/Beanstalk-Governance-Proposals/blob/master/bip/bip-20-migration-of-balances.md",
    hashLink: "",
    date: "June 21, 2022",
    timestamp: new Date("June 21, 2022").getTime(),
    auditHash: "",
    auditor: "bean",
    type: ["event"],
    isUpgrade: true,
  },
  {
    name: "Governance Exploit Response",
    description: "",
    githubLink: "",
    hashLink: "",
    date: "April 17, 2022",
    combinedLinks: ["https://bean.money/bip-18", "https://bean.money/bip-19"],
    combinedHashes: ["", ""],
    descriptions: ["BIP-18", "BIP-19"],
    timestamp: new Date("April 17, 2022").getTime(),
    auditHash: "",
    auditor: "bean",
    isCombined: true,
    customLines: { before: 6, after: 6 },
    type: ["event"],
  },
  {
    name: "BIP-17",
    description: "Bean Sprout Q2 2022 Budget",
    githubLink: "https://github.com/BeanstalkFarms/Beanstalk/pull/69",
    hashLink: "",
    date: "April 14, 2022",
    timestamp: new Date("April 14, 2022").getTime(),
    auditHash: "",
    auditor: "bean",
    type: ["budget"],
  },
  {
    name: "BIP-16",
    description: "Whitelist BEAN:LUSD Curve Pool",
    githubLink: "https://github.com/BeanstalkFarms/Beanstalk/pull/66",
    hashLink: "",
    date: "April 13, 2022",
    timestamp: new Date("April 13, 2022").getTime(),
    auditHash: "",
    auditor: "bean",
    type: ["utility"],
    isUpgrade: true,
  },
  {
    name: "BIP-15",
    description: "Demand for Soil Improvement",
    githubLink: "https://github.com/BeanstalkFarms/Beanstalk/pull/62",
    hashLink: "",
    date: "April 11, 2022",
    timestamp: new Date("April 11, 2022").getTime(),
    auditHash: "",
    auditor: "bean",
    type: ["modelImprovement"],
    isUpgrade: true,
  },
  {
    name: "BIP-14",
    description: "Beanstalk Farms Q2 2022 Budget",
    githubLink: "https://github.com/BeanstalkFarms/Beanstalk/pull/61",
    hashLink: "",
    date: "April 10, 2022",
    timestamp: new Date("April 10, 2022").getTime(),
    auditHash: "",
    auditor: "bean",
    type: ["budget"],
  },
  {
    name: "BIP-13",
    description: "Adjustment to Weather Changes",
    githubLink: "https://github.com/BeanstalkFarms/Beanstalk/pull/52",
    hashLink: "",
    date: "March 11, 2022",
    timestamp: new Date("March 11, 2022").getTime(),
    auditHash: "",
    auditor: "bean",
    type: ["parametrization"],
    isUpgrade: true,
  },
  {
    name: "BIP-12",
    description: "Silo Generalization I",
    githubLink: "https://github.com/BeanstalkFarms/Beanstalk/pull/46",
    hashLink: "",
    date: "February 19, 2022",
    timestamp: new Date("February 19, 2022").getTime(),
    auditHash: "",
    auditor: "bean",
    type: ["infrastructure", "utility"],
    isUpgrade: true,
  },
  {
    name: "BIP-11",
    description: "Farmers Market",
    githubLink: "https://github.com/BeanstalkFarms/Beanstalk/pull/44",
    hashLink: "",
    date: "February 10, 2022",
    timestamp: new Date("February 10, 2022").getTime(),
    auditHash: "",
    auditor: "bean",
    type: ["utility"],
    isUpgrade: true,
  },
  {
    name: "BIP-10",
    description: "Omniscia Retainer",
    githubLink: "https://github.com/BeanstalkFarms/Beanstalk/pull/42",
    hashLink: "",
    date: "February 3, 2022",
    timestamp: new Date("February 3, 2022").getTime(),
    auditHash: "",
    auditor: "bean",
    type: ["security"],
  },
  {
    name: "BIP-9",
    description: "Various Efficiency Improvements",
    githubLink: "https://github.com/BeanstalkFarms/Beanstalk/pull/32",
    hashLink: "",
    date: "January 11, 2022",
    timestamp: new Date("January 11, 2022").getTime(),
    auditHash: "",
    auditor: "bean",
    type: ["parametrization"],
    isUpgrade: true,
  },
  {
    name: "BIP-8",
    description: "Beanstalk Q1 Budget",
    githubLink: "https://github.com/BeanstalkFarms/Beanstalk/pull/34",
    hashLink: "",
    date: "January 6, 2022",
    timestamp: new Date("January 6, 2022").getTime(),
    auditHash: "",
    auditor: "bean",
    type: ["budget"],
  },
  {
    name: "BIP-7",
    description: "Expanded Convert",
    githubLink: "https://github.com/BeanstalkFarms/Beanstalk/pull/19",
    hashLink: "",
    date: "December 19, 2021",
    timestamp: new Date("December 19, 2021").getTime(),
    auditHash: "",
    auditor: "bean",
    type: ["modelImprovement"],
    isUpgrade: true,
  },
  {
    name: "BIP-6",
    description: "Soil Efficiency",
    githubLink: "https://github.com/BeanstalkFarms/Beanstalk/pull/14",
    hashLink: "",
    date: "December 9, 2021",
    timestamp: new Date("December 9, 2021").getTime(),
    auditHash: "",
    auditor: "bean",
    type: ["parametrization"],
    isUpgrade: true,
  },
  {
    name: "BIP-5",
    description: "Omniscia Audit",
    githubLink: "https://github.com/BeanstalkFarms/Beanstalk/pull/10",
    hashLink: "",
    date: "December 4, 2021",
    timestamp: new Date("December 4, 2021").getTime(),
    auditHash: "",
    auditor: "bean",
    type: ["security"],
  },
  {
    name: "BIP-4",
    description: "Trail of Bits Audit and Fundraisers",
    githubLink: "https://github.com/BeanstalkFarms/Beanstalk/pull/9",
    hashLink: "",
    date: "December 4, 2021",
    timestamp: new Date("December 4, 2021").getTime(),
    auditHash: "",
    auditor: "bean",
    type: ["budget", "security"],
  },
  {
    name: "BIP-3",
    description: "Beanstalk Farms Capital Formation Advisor Budget",
    githubLink: "https://github.com/BeanstalkFarms/Beanstalk/pull/6",
    hashLink: "",
    date: "November 25, 2021",
    timestamp: new Date("November 25, 2021").getTime(),
    auditHash: "",
    auditor: "bean",
    type: ["budget", "didNotPass"],
  },
  {
    name: "BIP-2",
    description: "Capital Gains Tax Efficiency Improvement and Adjustment to Weather Changes",
    githubLink: "https://github.com/BeanstalkFarms/Beanstalk/pull/4",
    hashLink: "",
    date: "November 10, 2021",
    timestamp: new Date("November 10, 2021").getTime(),
    auditHash: "",
    auditor: "bean",
    type: ["budget"],
    isUpgrade: true,
  },
  {
    name: "BIP-1",
    description: "Beanstalk Farms Q4 2021 Dev and Marketing Budget",
    githubLink: "https://github.com/BeanstalkFarms/Beanstalk/pull/3",
    hashLink: "",
    date: "October 20, 2021",
    timestamp: new Date("October 20, 2021").getTime(),
    auditHash: "",
    auditor: "bean",
    type: ["budget"],
  },
  {
    name: "BIP-0",
    description: "Silo Refactor",
    githubLink: "https://github.com/BeanstalkFarms/Beanstalk/pull/1",
    hashLink: "",
    date: "August 25, 2021",
    timestamp: new Date("August 25, 2021").getTime(),
    auditHash: "",
    auditor: "bean",
    type: ["bugFix", "utility"],
    isUpgrade: true,
  },
];

// Emergency Bean Improvement Proposals
const ebipAudits: TimelineEvent[] = [
  {
    name: "EBIP-19",
    description: "Misc Bug Fixes 2",
    githubLink: "https://github.com/BeanstalkFarms/Beanstalk/pull/1148",
    hashLink: "https://github.com/BeanstalkFarms/Beanstalk/tree/a26664dd64ca39bdc1db98355736363f29a9fc06",
    date: "October 13, 2024",
    timestamp: new Date("October 13, 2024").getTime(),
    auditHash: "",
    auditor: "bean",
    type: ["emergencyBugFix"],
  },
  {
    name: "EBIP-18",
    description: "Burn Excess",
    githubLink:
      "https://github.com/BeanstalkFarms/Beanstalk-Governance-Proposals/blob/master/bip/ebip/ebip-18-burn-excess.md",
    hashLink: "",
    date: "October 8, 2024",
    timestamp: new Date("October 8, 2024").getTime(),
    auditHash: "",
    auditor: "bean",
    type: ["emergencyBugFix"],
  },
  {
    name: "EBIP-17",
    description: "Misc Bug Fixes",
    githubLink: "https://github.com/BeanstalkFarms/Beanstalk/pull/960",
    hashLink: "https://github.com/BeanstalkFarms/Beanstalk/tree/36b8574bdb96c1045a4d361ee0b2fe7e23e4cbcf",
    date: "July 16, 2024",
    timestamp: new Date("July 16, 2024").getTime(),
    auditHash: "",
    auditor: "bean",
    type: ["emergencyBugFix"],
  },
  {
    name: "EBIP-16",
    description: "Fix Germinating Earned Bean Deposits",
    githubLink: "https://github.com/BeanstalkFarms/Beanstalk/pull/914",
    hashLink: "https://github.com/BeanstalkFarms/Beanstalk/tree/52152aba368a99bedaface6f18ec432ee3bb9a0a",
    date: "June 2, 2024",
    timestamp: new Date("June 2, 2024").getTime(),
    auditHash: "",
    auditor: "bean",
    type: ["emergencyBugFix"],
  },
  {
    name: "EBIP-15",
    description: "Seed Gauge System Fixes",
    githubLink: "https://github.com/BeanstalkFarms/Beanstalk/pull/892",
    hashLink: "https://github.com/BeanstalkFarms/Beanstalk/tree/2315d3f4a5dc217140c3b95cfec9f48a1d9c35f7",
    date: "May 24, 2024",
    timestamp: new Date("May 24, 2024").getTime(),
    auditHash: "",
    auditor: "bean",
    type: ["emergencyBugFix"],
  },
  {
    name: "EBIP-14",
    description: "Remove Vesting Period",
    githubLink: "https://github.com/BeanstalkFarms/Beanstalk/pull/762",
    hashLink: "https://github.com/BeanstalkFarms/Beanstalk/tree/4f7f45832d2fd7b7d9e8ef81125f1392a307433c",
    date: "February 5, 2024",
    timestamp: new Date("February 5, 2024").getTime(),
    auditHash: "",
    auditor: "bean",
    type: ["emergencyBugFix"],
  },
  {
    name: "EBIP-13",
    description: "Re-Add Convert",
    githubLink: "https://github.com/BeanstalkFarms/Beanstalk/pull/682",
    hashLink: "https://github.com/BeanstalkFarms/Beanstalk/tree/77996e48e1979c493c94103c7b6f4876fa80e4dc",
    date: "November 9, 2023",
    timestamp: new Date("November 9, 2023").getTime(),
    auditHash: "",
    auditor: "bean",
    type: ["emergencyBugFix"],
  },
  {
    name: "EBIP-12",
    description: "Remove Convert",
    githubLink:
      "https://github.com/BeanstalkFarms/Beanstalk-Governance-Proposals/blob/master/bip/ebip/ebip-12-remove-convert.md",
    hashLink: "",
    date: "November 8, 2023",
    timestamp: new Date("November 8, 2023").getTime(),
    auditHash: "",
    auditor: "bean",
    type: ["emergencyBugFix"],
  },
  {
    name: "EBIP-11",
    description: "Upgrade Minting Oracle to 60 Minute TWA ETH/USD Price",
    githubLink: "https://github.com/BeanstalkFarms/Beanstalk/pull/676",
    hashLink: "https://github.com/BeanstalkFarms/Beanstalk/tree/82f980b8e94f97873fb3d1fc6e99930a01ad2c16",
    date: "October 30, 2023",
    timestamp: new Date("October 30, 2023").getTime(),
    auditHash: "",
    auditor: "bean",
    type: ["emergencyBugFix"],
  },
  {
    name: "EBIP-10",
    description: "Fix Bean to LP Well Convert",
    githubLink: "https://github.com/BeanstalkFarms/Beanstalk/pull/671",
    hashLink: "",
    date: "October 23, 2023",
    timestamp: new Date("October 23, 2023").getTime(),
    auditHash: "",
    auditor: "bean",
    type: ["emergencyBugFix"],
  },
  {
    name: "EBIP-9",
    description: "Temporarily Disable the Well Minting Oracle",
    githubLink: "https://github.com/BeanstalkFarms/Beanstalk/pull/669",
    hashLink: "",
    date: "October 20, 2023",
    timestamp: new Date("October 20, 2023").getTime(),
    auditHash: "",
    auditor: "bean",
    type: ["emergencyBugFix"],
  },
  {
    name: "EBIP-8",
    description: "Enroot BDV Rounding",
    githubLink: "https://github.com/BeanstalkFarms/Beanstalk/pull/389",
    hashLink: "https://github.com/BeanstalkFarms/Beanstalk/pull/389/commits/c6425b4e5ea6597a97e41a934583a31f4bf807ee",
    date: "May 13, 2023",
    timestamp: new Date("May 13, 2023").getTime(),
    auditHash: "",
    auditor: "bean",
    type: ["emergencyBugFix"],
  },
  {
    name: "EBIP-7",
    description: "Enroot BDV Update",
    githubLink: "https://github.com/BeanstalkFarms/Beanstalk/pull/170",
    hashLink: "",
    date: "December 9, 2022",
    timestamp: new Date("December 9, 2022").getTime(),
    auditHash: "",
    auditor: "bean",
    type: ["emergencyBugFix"],
  },
  {
    name: "EBIP-6",
    description: "Resolve EBIP-4 and EBIP-5",
    githubLink: "https://github.com/BeanstalkFarms/Beanstalk/pull/146",
    hashLink: "",
    date: "November 15, 2022",
    timestamp: new Date("November 15, 2022").getTime(),
    auditHash: "",
    auditor: "bean",
    type: ["emergencyBugFix"],
  },
  {
    name: "EBIP-5",
    description: "Remove transferTokenFrom Function",
    githubLink:
      "https://github.com/BeanstalkFarms/Beanstalk-Governance-Proposals/blob/master/bip/ebip/ebip-05-remove-transfertokenfrom-function.md",
    hashLink: "",
    date: "November 14, 2022",
    timestamp: new Date("November 14, 2022").getTime(),
    auditHash: "",
    auditor: "bean",
    type: ["emergencyBugFix"],
  },
  {
    name: "EBIP-4",
    description: "Remove V1 Pod Order Functions",
    githubLink:
      "https://github.com/BeanstalkFarms/Beanstalk-Governance-Proposals/blob/master/bip/ebip/ebip-04-remove-v1-pod-order-functions.md",
    hashLink: "",
    date: " November 12, 2022",
    timestamp: new Date("November 12, 2022").getTime(),
    auditHash: "",
    auditor: "bean",
    type: ["emergencyBugFix"],
  },
  {
    name: "EBIP-3",
    description: "Pod Listing Cancellation",
    githubLink: "https://github.com/BeanstalkFarms/Beanstalk/pull/135",
    hashLink: "https://github.com/BeanstalkFarms/Beanstalk/commit/b2b7b6af2913dda868030fba4947575258583c69",
    date: "October 25, 2022",
    timestamp: new Date("October 25, 2022").getTime(),
    auditHash: "",
    auditor: "bean",
    type: ["emergencyBugFix"],
  },
  {
    name: "EBIP-2",
    description: "deltaB Cap",
    githubLink: "https://github.com/BeanstalkFarms/Beanstalk/pull/92",
    hashLink: "https://github.com/BeanstalkFarms/Beanstalk/commit/7168560db94426bbf736b4919a1ea4bccbdeab27",
    date: "September 13, 2022",
    timestamp: new Date("September 13, 2022").getTime(),
    auditHash: "",
    auditor: "bean",
    type: ["emergencyBugFix"],
  },
  {
    name: "EBIP-1",
    description: "Remove Chop",
    githubLink:
      "https://github.com/BeanstalkFarms/Beanstalk-Governance-Proposals/blob/master/bip/ebip/ebip-01-remove-chop.md",
    hashLink: "",
    date: "September 5, 2022",
    timestamp: new Date("September 5, 2022").getTime(),
    auditHash: "",
    auditor: "bean",
    type: ["emergencyBugFix"],
  },
  {
    name: "EBIP-0",
    description: "Earned Beans Forfeiture",
    githubLink: "https://github.com/BeanstalkFarms/Beanstalk/pull/80",
    hashLink: "https://github.com/BeanstalkFarms/Beanstalk/commit/fa8612e3698d932004f45cd3260c5ad71893b006",
    date: "August 10, 2022",
    timestamp: new Date("August 10, 2022").getTime(),
    auditHash: "",
    auditor: "bean",
    type: ["emergencyBugFix"],
  },
];

// Audits
/*
const regularAudits: TimelineEvent[] = [
  {
    name: "Cyfrin Complete Audit",
    description: "",
    githubLink: "https://github.com/BeanstalkFarms/Beanstalk-Audits/blob/main/beanstalk/09-12-23-cyfrin-report.pdf",
    hashLink: "https://github.com/BeanstalkFarms/Beanstalk/tree/c7a20e56a0a6659c09314a877b440198eff0cd81",
    date: "September 12, 2023",
    timestamp: new Date("September 12, 2023").getTime(),
    auditHash: "c7a20e56a0a6659c09314a877b440198eff0cd81",
    auditor: "cyfrin",
    type: ["audit"]
  },
  {
    name: "Beanstalk Halborn Report #2",
    description: "",
    githubLink: "https://github.com/BeanstalkFarms/Beanstalk-Audits/blob/main/beanstalk/12-13-22-halborn-report.pdf",
    hashLink: "https://github.com/BeanstalkFarms/Beanstalk/tree/6699e071626a17283facc67242536037989ecd91",
    date: "December 13, 2022",
    timestamp: new Date("December 13, 2022").getTime(),
    auditHash: "6699e071626a17283facc67242536037989ecd91",
    auditor: "halborn",
    customLines: { before: 14, after: 14 },
    type: ["audit"]
  },
  {
    name: "Trail Of Bits Audit",
    description: "",
    githubLink: "",
    hashLink: "",
    date: "July 22, 2022",
    combinedLinks: [
      "https://github.com/BeanstalkFarms/Beanstalk-Audits/blob/main/beanstalk/07-22-22-tob-report.pdf",
      "https://github.com/BeanstalkFarms/Beanstalk-Audits/blob/main/beanstalk/07-22-22-tob-fix-review.pdf",
    ],
    combinedHashes: [
      "https://github.com/BeanstalkFarms/Beanstalk/tree/f501c25eb41e391c35a2926dacca7d9912e700f3",
      "https://github.com/BeanstalkFarms/Beanstalk/tree/9422ad60cbb4ece7cfb4f0925c4586fb4582e7df",
    ],
    descriptions: ["Report", "Fix Review"],
    timestamp: new Date("July 22, 2022").getTime(),
    auditHash: "",
    auditor: "trailOfBits",
    isCombined: true,
    type: ["audit"]
  },
  {
    name: "Omniscia Audit",
    description: "",
    githubLink: "https://github.com/BeanstalkFarms/Beanstalk-Audits/blob/main/beanstalk/04-02-22-omniscia-report.md",
    hashLink: "https://github.com/BeanstalkFarms/Beanstalk/tree/ee4720cdb449d5b6ff2b789083792c4395628674",
    date: "April 2, 2022",
    timestamp: new Date("April 2, 2022").getTime(),
    auditHash: "ee4720cdb449d5b6ff2b789083792c4395628674",
    auditor: "omniscia",
    type: ["audit"]
  },
  {
    name: "Halborn Audit",
    description: "",
    githubLink: "https://github.com/BeanstalkFarms/Beanstalk-Audits/blob/main/beanstalk/07-13-22-halborn-report.pdf",
    hashLink: "https://github.com/BeanstalkFarms/Beanstalk/tree/1447fa2c0d42c73345a38edb4f4dad076392f429",
    date: "July 13, 2022",
    timestamp: new Date("July 13, 2022").getTime(),
    auditHash: "1447fa2c0d42c73345a38edb4f4dad076392f429",
    auditor: "halborn",
    type: ["audit"]
  },
];
*/

interface FilterButtonProps {
  type: string;
  label: string;
  isSelected: boolean;
  hasNoFilters: boolean;
  colorClass: string;
  onClick: () => void;
}

function FilterButton({ type, label, isSelected, hasNoFilters, colorClass, onClick }: FilterButtonProps) {
  const opacity = hasNoFilters || isSelected ? "opacity-100" : "opacity-40";

  return (
    <button
      key={type}
      onClick={onClick}
      type="button"
      className={`flex items-center gap-1 px-1 py-0.5 sm:gap-2 sm:px-2 sm:py-1 rounded-xl text-xs sm:text-xl transition-all hover:bg-pinto-gray-2/30 ${opacity} ${
        isSelected ? "bg-pinto-gray-2/40 hover:bg-pinto-gray-2/50" : ""
      }`}
    >
      <div className={`w-2 h-2 sm:w-4 sm:h-4 rounded-full ${colorClass}`} />
      <span className="text-pinto-gray-5 mt-0.5 sm:mt-0 mr-0.5 sm:mr-1">{label}</span>
    </button>
  );
}

const events: TimelineEvent[] = [
  {
    name: "Beanstalk Launch",
    description: "",
    githubLink: "",
    hashLink: "",
    date: "August 6, 2021",
    timestamp: new Date("August 6, 2021").getTime(),
    auditHash: "",
    auditor: "",
    type: ["event"],
  },
  {
    name: "sPinto Launch + Cream Integration",
    description: "",
    githubLink: "",
    hashLink: "",
    customLines: { before: 8, after: 8 },
    date: "March 5, 2025",
    timestamp: new Date("March 5, 2025").getTime(),
    auditHash: "",
    auditor: "",
    type: ["event"],
  },
  {
    name: "Genesis Pinto Beaver NFTs",
    description: "",
    githubLink: "",
    hashLink: "",
    date: "August 20, 2025",
    timestamp: new Date("August 20, 2025").getTime(),
    auditHash: "",
    auditor: "",
    customLines: { before: 8, after: 8 },
    type: ["event"],
  },
  {
    name: "Tractor Sow Blueprint",
    description: "",
    githubLink: "",
    hashLink: "",
    date: "April 22, 2025",
    timestamp: new Date("April 22, 2025").getTime(),
    auditHash: "",
    auditor: "",
    type: ["event"],
  },
  {
    name: "Spectra Integration",
    description: "",
    githubLink: "",
    hashLink: "",
    date: "March 19, 2025",
    timestamp: new Date("March 19, 2025").getTime(),
    auditHash: "",
    auditor: "",
    type: ["event"],
  },
  {
    name: "Pinto Launch",
    description: "",
    githubLink: "",
    hashLink: "",
    date: "November 19, 2024",
    timestamp: new Date("November 19, 2024 12:00:00").getTime(),
    auditHash: "",
    auditor: "",
    type: ["event"],
  },
  {
    name: "Root Deployment",
    description: "",
    githubLink: "",
    hashLink: "",
    date: "July 26, 2022",
    timestamp: new Date("July 26, 2022").getTime(),
    auditHash: "",
    auditor: "",
    customLines: { before: 8, after: 8 },
    type: ["event"],
  },
  {
    name: "Paradox Deployment",
    description: "",
    githubLink: "",
    hashLink: "",
    date: "November 19, 2022",
    timestamp: new Date("November 19, 2022").getTime(),
    auditHash: "",
    auditor: "",
    type: ["event"],
  },
  {
    name: "BeaNFT Genesis Launch",
    description: "",
    githubLink: "",
    hashLink: "",
    date: "September 25, 2021",
    timestamp: new Date("September 25, 2021").getTime(),
    auditHash: "",
    auditor: "",
    type: ["event"],
  },
  {
    name: "BeaNFT Winter Launch",
    description: "",
    githubLink: "",
    hashLink: "",
    date: "December 22, 2021",
    timestamp: new Date("December 22, 2021").getTime(),
    auditHash: "",
    auditor: "",
    customLines: { before: 7, after: 7 },
    type: ["event"],
  },
  {
    name: "BeaNFT Barn Raise Launch",
    description: "",
    githubLink: "",
    hashLink: "",
    date: "July 27, 2022",
    timestamp: new Date("July 27, 2022").getTime(),
    auditHash: "",
    auditor: "",
    type: ["event"],
  },
  {
    name: "BeaNFT Basin Launch",
    description: "",
    githubLink: "",
    hashLink: "",
    date: "August 29, 2023",
    timestamp: new Date("August 29, 2023").getTime(),
    auditHash: "",
    auditor: "",
    type: ["event"],
  },
];

export const PROTOCOL_UPGRADES: TimelineEvent[] = [
  ...piAudits,
  ...bipAudits.filter((audit) => audit.isUpgrade === true),
  ...ebipAudits,
];

const ALL_DATA: TimelineEvent[] = [...piAudits, ...bipAudits, ...ebipAudits, ...events];

// Combine all audits and sort by timestamp (most recent first)
// If timestamps are equal, sort by audit number (lowest number first)
const audits: TimelineEvent[] = ALL_DATA.sort((a, b) => {
  // Primary sort: timestamp (most recent first)
  if (a.timestamp !== b.timestamp) {
    return b.timestamp - a.timestamp;
  }

  // Secondary sort: extract numbers from audit names for same timestamps
  const getAuditNumber = (name: string): number => {
    const match = name.match(/(?:BIP|PI|EBIP)-(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  };

  const aNumber = getAuditNumber(a.name);
  const bNumber = getAuditNumber(b.name);

  // If both have numbers, sort by number (lowest first)
  if (aNumber && bNumber) {
    return aNumber - bNumber;
  }

  // Fallback to alphabetical sort
  return a.name.localeCompare(b.name);
});

export default function ProtocolUpgrades() {
  const [api, setApi] = useState<CarouselApi>();

  const [carouselCenterData, setCarouselCenterData] = useState<TimelineEvent | null>(null);
  const [hoveredData, setHoveredData] = useState<TimelineEvent | null>(null);
  const [highlightedData, setHighlightedData] = useState<TimelineEvent | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<Set<TimelineEventType>>(new Set());
  const lastScrollTime = useRef(0);
  const isNavigating = useRef(false);

  // Create year markers for each year between the first and last audit
  const createYearMarkers = () => {
    const sortedOriginalAudits = [...audits].sort((a, b) => a.timestamp - b.timestamp);
    const firstYear = new Date(sortedOriginalAudits[0].timestamp).getFullYear();
    const lastYear = new Date(sortedOriginalAudits[sortedOriginalAudits.length - 1].timestamp).getFullYear();

    const yearMarkers: TimelineEvent[] = [];
    for (let year = firstYear; year <= lastYear; year++) {
      yearMarkers.push({
        name: `${year}`,
        description: "",
        githubLink: "",
        hashLink: "",
        date: `January 1, ${year}`,
        timestamp: new Date(`January 1, ${year}`).getTime(),
        auditHash: "",
        auditor: "",
        isYearMarker: true,
        type: ["yearMarker"],
      });
    }

    return [...sortedOriginalAudits, ...yearMarkers];
  };

  const allAudits = createYearMarkers().sort((a, b) => a.timestamp - b.timestamp);

  // Filter audits based on selected filters
  const sortedAudits =
    selectedFilters.size === 0
      ? allAudits
      : allAudits.filter(
          (audit) => audit && (audit.isYearMarker || audit.type?.some((type) => selectedFilters.has(type))),
        );

  const toggleFilter = (type: TimelineEventType) => {
    setSelectedFilters((prev) => {
      const newFilters = new Set(prev);
      if (newFilters.has(type)) {
        newFilters.delete(type);
      } else {
        newFilters.add(type);
      }
      return newFilters;
    });
    // Reset highlighted data when filters change
    setHighlightedData(null);
    setCarouselCenterData(null);
    setHoveredData(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const getTypeColor = (type: TimelineEventType): string => {
    switch (type) {
      case "bugFix":
        return "bg-amber-800"; // brown
      case "utility":
        return "bg-pink-400"; // pink
      case "budget":
        return "bg-green-300"; // light green
      case "modelImprovement":
        return "bg-green-700"; // dark green
      case "governance":
        return "bg-red-800"; // dark red
      case "emergencyBugFix":
        return "bg-red-300"; // light red
      case "didNotPass":
        return "bg-gray-400"; // gray
      case "security":
        return "bg-yellow-400"; // yellow
      case "parametrization":
        return "bg-orange-400"; // orange
      case "infrastructure":
        return "bg-blue-500"; // blue
      case "event":
        return "bg-purple-500"; // purple
      case "audit":
        return "bg-indigo-500"; // indigo
      case "yearMarker":
        return "bg-black"; // black
      default:
        return "bg-gray-300"; // fallback
    }
  };

  const calculateConnectingLines = (index: number) => {
    const currentAudit = sortedAudits[index];
    const nextAudit = sortedAudits[index + 1];

    // Check if current audit has custom lines specified
    if (currentAudit.customLines) {
      const customBefore = currentAudit.customLines.before ?? 5;
      const customAfter = currentAudit.customLines.after ?? 5;

      // For first entry, use custom before value
      if (index === 0) return { before: customBefore, after: customAfter };

      // For last entry, use custom after value
      if (index === sortedAudits.length - 1) return { before: customBefore, after: customAfter };

      return { before: customBefore, after: customAfter };
    }

    // First entry: always 10 lines before
    if (index === 0) return { before: 10, after: 10 };

    // Last entry: always 10 lines after
    if (index === sortedAudits.length - 1) return { before: 0, after: 10 };

    // Calculate time difference in days between current and next audit
    const currentTimestamp = currentAudit.timestamp;
    const nextTimestamp = nextAudit.timestamp;
    const daysDifference = (nextTimestamp - currentTimestamp) / (1000 * 60 * 60 * 24);

    // Check if either current or next audit is a year marker
    const isCurrentYear = currentAudit.isYearMarker;
    const isNextYear = nextAudit.isYearMarker;
    const isCombined = nextAudit.isCombined;

    // If either is a year marker, minimum 3 lines
    const minimumLines = isCombined ? 14 : isCurrentYear || isNextYear ? 4 : 6;

    // Scale lines based on time difference (1 line per day, with minimum and maximum)
    const lines = Math.min(Math.max(Math.round(daysDifference / 1), minimumLines), 15);

    return { before: Math.round(lines / 2), after: Math.round(lines / 2) };
  };

  // Initial scroll to end on mount
  useEffect(() => {
    if (api && sortedAudits.length > 0) {
      api.scrollTo(sortedAudits.length);
    }
  }, [api]);

  const handleSelect = useCallback(() => {
    if (!api) return;
    const selectedIndex = api.selectedScrollSnap();
    const selected = sortedAudits[selectedIndex];

    // Handle carousel item selection with safety check
    if (selected && !selected.isYearMarker) {
      setCarouselCenterData(selected);
    }
  }, [api, sortedAudits]);

  const handleSettle = useCallback(() => {
    if (!api) return;

    if (isNavigating.current) {
      // Reset navigation flag
      isNavigating.current = false;
    }

    const selectedIndex = api.selectedScrollSnap();
    const selected = sortedAudits[selectedIndex];

    // Update carousel center data with the final settled position
    if (selected && !selected.isYearMarker) {
      setCarouselCenterData(selected);
    }

    // If we settled on a year marker, find the nearest non-year marker and snap to it
    if (selected?.isYearMarker) {
      let nearestIndex = selectedIndex;
      let minDistance = Infinity;

      // Find the nearest non-year marker
      sortedAudits.forEach((audit, index) => {
        if (!audit.isYearMarker) {
          const distance = Math.abs(index - selectedIndex);
          if (distance < minDistance) {
            minDistance = distance;
            nearestIndex = index;
          }
        }
      });

      // Scroll to the nearest non-year marker
      if (nearestIndex !== selectedIndex && nearestIndex < sortedAudits.length) {
        isNavigating.current = true; // Set flag again for the corrective scroll
        api.scrollTo(nearestIndex);
      }
    } else if (selectedIndex < sortedAudits.length) {
      // Normal case - scroll to the selected index if it's not a year marker
      api.scrollTo(selectedIndex);
    }
  }, [api, sortedAudits]);

  const navigateToNearestNonYearMarker = useCallback(
    (direction: "prev" | "next") => {
      if (!api) return;

      // Set navigation flag to prevent intermediate handlers from firing
      isNavigating.current = true;

      // Reset the flag after a timeout as a safety measure
      setTimeout(() => {
        isNavigating.current = false;
      }, 300);

      const currentIndex = api.selectedScrollSnap();
      const nonYearMarkers = sortedAudits
        .map((audit, index) => ({ audit, index }))
        .filter(({ audit }) => !audit.isYearMarker);

      if (nonYearMarkers.length === 0) {
        isNavigating.current = false;
        return;
      }

      let targetIndex: number;

      if (direction === "prev") {
        // Find the previous non-year marker
        const prevMarkers = nonYearMarkers.filter(({ index }) => index < currentIndex);
        if (prevMarkers.length > 0) {
          targetIndex = prevMarkers[prevMarkers.length - 1].index;
        } else {
          // Loop to the last non-year marker
          targetIndex = nonYearMarkers[nonYearMarkers.length - 1].index;
        }
      } else {
        // Find the next non-year marker
        const nextMarkers = nonYearMarkers.filter(({ index }) => index > currentIndex);
        if (nextMarkers.length > 0) {
          targetIndex = nextMarkers[0].index;
        } else {
          // Loop to the first non-year marker
          targetIndex = nonYearMarkers[0].index;
        }
      }

      api.scrollTo(targetIndex);
    },
    [api, sortedAudits],
  );

  const handleScroll = useCallback(() => {
    if (!api || isNavigating.current) return;
    const now = Date.now();
    if (now - lastScrollTime.current >= 100) {
      lastScrollTime.current = now;

      const snapPoints = api.scrollSnapList();
      const scrollProgress = api.scrollProgress();

      const closestIndex = snapPoints.reduce((closest, point, index) => {
        const currentDistance = Math.abs(point - scrollProgress);
        const closestDistance = Math.abs(snapPoints[closest] - scrollProgress);
        return currentDistance < closestDistance ? index : closest;
      }, 0);

      const selected = sortedAudits[closestIndex];
      // Handle carousel item selection with safety check
      if (selected && !selected.isYearMarker && selected.name !== carouselCenterData?.name) {
        setCarouselCenterData(selected);
      }
    }
  }, [api, sortedAudits, carouselCenterData]);

  // Event handlers
  useEffect(() => {
    if (api) {
      api.on("select", handleSelect);
      api.on("settle", handleSettle);
      return () => {
        api.off("select", handleSelect);
        api.off("settle", handleSettle);
      };
    }
  }, [api, handleSelect, handleSettle]);

  useEffect(() => {
    if (api) {
      api.on("scroll", handleScroll);
      return () => {
        api.off("scroll", handleScroll);
      };
    }
  }, [api, handleScroll]);

  useEffect(() => {
    // Update selected data when hovered data changes
    if (hoveredData) {
      setHighlightedData(hoveredData);
    } else if (carouselCenterData) {
      setHighlightedData(carouselCenterData);
    }
  }, [hoveredData, carouselCenterData]);

  return (
    <div className={`relative w-screen sm:max-w-[1920px] p-0 transition-all transform-gpu items-center`}>
      <AnimatePresence mode="wait">
        <div className="h-12 sm:h-14 place-content-center">
          {highlightedData && (
            <motion.div
              key={highlightedData.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                duration: 0.4,
                ease: [0.16, 1, 0.3, 1], // Custom ease for smooth feel
              }}
              className="flex flex-col gap-0.5 sm:gap-1 items-center text-base sm:text-lg text-center w-full place-content-center text-pinto-gray-5"
            >
              <span>{`${highlightedData.name} ${highlightedData.description ? `- ${highlightedData.description}` : ""}`}</span>
              <span className="text-xs sm:text-xl text-pinto-gray-3">{highlightedData.date}</span>
            </motion.div>
          )}
        </div>
      </AnimatePresence>
      <AnimatePresence mode="wait">
        <motion.div
          key={`carousel-${Array.from(selectedFilters).sort().join(",")}`} // Key changes when filters change
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{
            duration: 0.4,
            ease: [0.16, 1, 0.3, 1], // Custom ease for smooth feel
          }}
        >
          <Carousel
            opts={{
              align: "center",
              loop: true,
              containScroll: "trimSnaps",
              dragFree: true,
            }}
            plugins={[WheelGesturesPlugin()]}
            className="w-[93.5%] select-none place-self-center"
            setApi={setApi}
          >
            <CarouselContent>
              {sortedAudits.map((audit, index) => {
                const { before, after } = calculateConnectingLines(index);
                return (
                  <CarouselItem key={audit.name} className="pl-3 xs:pl-4 basis-auto pb-4 pt-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                      {/* Before lines for first entry */}
                      {before > 0 &&
                        Array.from({ length: before }).map((_, i) => (
                          <div key={`before-${index}-${i}`} className="w-[0.5px] h-16 sm:h-24 bg-pinto-gray-2" />
                        ))}

                      <div key={audit.name} className="relative flex flex-col items-center flex-shrink-0">
                        {audit.isYearMarker ? (
                          <>
                            {/* Year marker */}
                            <span className="text-base sm:text-xl font-light text-black text-center items-center justify-center absolute -bottom-3 w-20">
                              {audit.name}
                            </span>
                            {/* Year connecting line */}
                            <div className="w-[0.5px] h-28 sm:h-36 bg-black mt-4 mb-2 sm:mt-6 sm:mb-4" />
                          </>
                        ) : (
                          <>
                            {audit.isCombined ? (
                              <div className="flex flex-col gap-0.5 absolute top-0 group text-center items-center justify-center py-2 px-4">
                                <span
                                  onMouseEnter={() => setHoveredData(audit)}
                                  onMouseLeave={() => setHoveredData(null)}
                                  className="text-base sm:text-xl font-light text-pinto-green-4 absolute top-0 group-hover:-top-4 whitespace-nowrap transition-all transform-gpu"
                                >
                                  {audit.name}
                                </span>
                                <div className="flex flex-row gap-2 whitespace-nowrap">
                                  {audit.descriptions?.map((description, index) => {
                                    if (!audit.combinedLinks) return;
                                    return (
                                      <Link
                                        key={index}
                                        to={audit.combinedLinks[index]}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex flex-row gap-0.5 text-pinto-green-4 hover:underline decoration-1 opacity-0 group-hover:opacity-100 transition-all transform-gpu text-center items-center justify-center"
                                        onClick={trackClick(ANALYTICS_EVENTS.LANDING.STATS_PROTOCOL_UPGRADE_CLICK, {
                                          upgrade_name: audit.name,
                                          upgrade_description: description,
                                          upgrade_type: audit.type.join(","),
                                          upgrade_date: audit.date,
                                          destination: audit.combinedLinks[index],
                                          section: "stats",
                                        })}
                                      >
                                        <span className="text-base sm:text-xl font-light text-pinto-green-4">
                                          {description}
                                        </span>
                                        <DiagonalRightArrowIcon
                                          color="currentColor"
                                          width={"1.5rem"}
                                          height={"1.5rem"}
                                        />
                                      </Link>
                                    );
                                  })}
                                </div>
                              </div>
                            ) : (
                              /* Audit name */
                              <div
                                onMouseEnter={() => setHoveredData(audit)}
                                onMouseLeave={() => setHoveredData(null)}
                                className="flex flex-col-reverse gap-0.5 absolute top-0 text-center items-center justify-center py-2 px-4"
                              >
                                {audit.githubLink ? (
                                  <Link
                                    to={audit.githubLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`flex flex-row gap-0.5 text-pinto-green-4 peer hover:underline decoration-1 whitespace-nowrap text-center items-center justify-center absolute top-0 transition-all transform-gpu`}
                                    onClick={trackClick(ANALYTICS_EVENTS.LANDING.STATS_PROTOCOL_UPGRADE_CLICK, {
                                      upgrade_name: audit.name,
                                      upgrade_description: audit.description,
                                      upgrade_type: audit.type.join(","),
                                      upgrade_date: audit.date,
                                      destination: audit.githubLink,
                                      section: "stats",
                                    })}
                                  >
                                    <span className="text-base sm:text-xl font-light text-pinto-green-4">
                                      {audit.name}
                                    </span>
                                    <DiagonalRightArrowIcon color="currentColor" width={"1.5rem"} height={"1.5rem"} />
                                  </Link>
                                ) : (
                                  <span className="text-base sm:text-xl font-light text-pinto-green-4 whitespace-nowrap text-center absolute top-0">
                                    {audit.name}
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Connecting line */}
                            <div className="w-[0.5px] h-[5rem] sm:h-[7.5rem] bg-pinto-green-4 mt-8 sm:mt-10 mb-6" />

                            {/* Category circles */}
                            <div className="flex flex-row gap-1 absolute -bottom-2 justify-center items-center">
                              {audit.type.map((type, typeIndex) => (
                                <div
                                  key={`${audit.name}-${type}-${typeIndex}`}
                                  className={`w-2 h-2 rounded-full ${getTypeColor(type)}`}
                                  title={type}
                                />
                              ))}
                            </div>

                            {/* Date */}
                            <span className="text-xs sm:text-base font-light text-pinto-gray-4 absolute bottom-0 w-20 text-center">
                              {formatDate(audit.date)}
                            </span>
                          </>
                        )}
                      </div>

                      {/* After lines */}
                      {after > 0 &&
                        Array.from({ length: after }).map((_, i) => (
                          <div key={`after-${index}-${i}`} className="w-[0.5px] h-16 sm:h-24 bg-pinto-gray-2" />
                        ))}
                    </div>
                  </CarouselItem>
                );
              })}
              {/* End marker */}
              <CarouselItem className="pl-2 md:pl-4 basis-auto pb-4 pt-4 place-self-center">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="relative flex flex-col items-center flex-shrink-0">
                    <div className="flex flex-col items-center text-center py-8">
                      <div className="text-2xl text-pinto-gray-4 mb-2">◦ ◦ ◦</div>
                      <div className="flex items-center gap-2 text-base text-pinto-gray-3 mt-2">
                        <span>← Present</span>
                        <span>•</span>
                        <span>Past →</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious
              variant="ghost"
              noPadding={true}
              className="[&>svg]:w-4 [&>svg]:h-4 sm:[&>svg]:w-8 sm:[&>svg]:h-8 -left-8 sm:-left-12"
              onClick={() => navigateToNearestNonYearMarker("prev")}
            />
            <CarouselNext
              variant="ghost"
              noPadding={true}
              className="[&>svg]:w-4 [&>svg]:h-4 sm:[&>svg]:w-8 sm:[&>svg]:h-8 -right-8 sm:-right-12"
              onClick={() => navigateToNearestNonYearMarker("next")}
            />
          </Carousel>
        </motion.div>
      </AnimatePresence>
      {/* Legend */}
      <div className="mt-2 sm:mt-8 px-4">
        <div className="flex flex-col items-center gap-0.5 sm:gap-1">
          {/* Tier 1 */}
          <div className="flex flex-nowrap justify-center gap-1 sm:gap-2">
            {[
              { type: "event" as TimelineEventType, label: "Event" },
              { type: "modelImprovement" as TimelineEventType, label: "Model" },
              { type: "parametrization" as TimelineEventType, label: "Parameters" },
              { type: "utility" as TimelineEventType, label: "Utility" },
            ].map(({ type, label }) => (
              <FilterButton
                key={type}
                type={type}
                label={label}
                isSelected={selectedFilters.has(type)}
                hasNoFilters={selectedFilters.size === 0}
                colorClass={getTypeColor(type)}
                onClick={() => toggleFilter(type)}
              />
            ))}
          </div>

          {/* Tier 2 */}
          <div className="flex flex-nowrap justify-center gap-1 sm:gap-2">
            {[
              { type: "infrastructure" as TimelineEventType, label: "Infrastructure" },
              { type: "budget" as TimelineEventType, label: "Budget" },
              { type: "security" as TimelineEventType, label: "Security" },
              { type: "governance" as TimelineEventType, label: "Governance" },
            ].map(({ type, label }) => (
              <FilterButton
                key={type}
                type={type}
                label={label}
                isSelected={selectedFilters.has(type)}
                hasNoFilters={selectedFilters.size === 0}
                colorClass={getTypeColor(type)}
                onClick={() => toggleFilter(type)}
              />
            ))}
          </div>

          {/* Tier 3 */}
          <div className="flex flex-nowrap justify-center gap-1 sm:gap-2">
            {[
              { type: "didNotPass" as TimelineEventType, label: "Did Not Pass" },
              { type: "bugFix" as TimelineEventType, label: "Bug Fix" },
              { type: "emergencyBugFix" as TimelineEventType, label: "Emergency" },
            ].map(({ type, label }) => (
              <FilterButton
                key={type}
                type={type}
                label={label}
                isSelected={selectedFilters.has(type)}
                hasNoFilters={selectedFilters.size === 0}
                colorClass={getTypeColor(type)}
                onClick={() => toggleFilter(type)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
