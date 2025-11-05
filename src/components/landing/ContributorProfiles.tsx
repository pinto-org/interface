import { ANALYTICS_EVENTS } from "@/constants/analytics-events";
import { trackClick } from "@/utils/analytics";
import { motion } from "framer-motion";
import { atom, useAtom } from "jotai";
import { useEffect, useMemo, useRef } from "react";

import DefaultJuiceBg from "@/assets/landing/DefaultJuice-bg.avif";
import DefaultJuiceAvatar from "@/assets/landing/DefaultJuice.avif";
import FordPintoBg from "@/assets/landing/FordPinto-bg.avif";
import FordPintoAvatar from "@/assets/landing/FordPinto.avif";
import PintoPirateBg from "@/assets/landing/PintoPirate-bg.avif";
import PintoPirateAvatar from "@/assets/landing/PintoPirate.avif";
import RyanBg from "@/assets/landing/Ryan-bg.avif";
import RyanAvatar from "@/assets/landing/Ryan.avif";
import burrBg from "@/assets/landing/burr-bg.avif";
// Import contributor images
import burrAvatar from "@/assets/landing/burr.avif";
import nattoBg from "@/assets/landing/natto-bg.avif";
import nattoAvatar from "@/assets/landing/natto.avif";

export const contributors = [
  {
    id: 1,
    name: "Ryan",
    avatar: RyanAvatar,
    background: RyanBg,
    description:
      "I believe a decentralized, pseudonymous group of creditors and value providers all around the world can work together to create stable value on the internet.",
    article:
      "https://mirror.xyz/0xe7731147bBe1BEBe5CF1Ab101C6EceD384dAbD07/hBE2TBv3KPE-w-TWdzn5EX-1e9hWE-jVeSaCWkU8vPU",
  },
  {
    id: 2,
    name: "DefaultJuice",
    avatar: DefaultJuiceAvatar,
    background: DefaultJuiceBg,
    description:
      "Living through a financial crisis showed me the underbelly of a centralized fiat currency system. I'm building a decentralized one.",
    article:
      "https://mirror.xyz/0xe7731147bBe1BEBe5CF1Ab101C6EceD384dAbD07/jvXg-a4qKjs7SzQS86DAx6VgMAUFmI5RUfLrocPLPAs",
  },
  {
    id: 3,
    name: "PintoPirate",
    avatar: PintoPirateAvatar,
    background: PintoPirateBg,
    description:
      "I don't want others to be aware of my financial activities, nor am I comfortable having a centralized custodian managing or holding my wealth and potentially restricting my access to it.",
    article:
      "https://mirror.xyz/0xe7731147bBe1BEBe5CF1Ab101C6EceD384dAbD07/g8Mq9ov6MYU3Eqbd5Scbfcfmtq9Lgi5UOnoa93RaAK8",
  },
  {
    id: 4,
    name: "natto",
    avatar: nattoAvatar,
    background: nattoBg,
    description:
      "Pinto is a push back against 'good enough' — it openly continues to experiment and will bring the industry one step closer to the scalable and decentralized money that we need.",
    article:
      "https://mirror.xyz/0xe7731147bBe1BEBe5CF1Ab101C6EceD384dAbD07/49D2MXRWcWhNx1_XnQHairfoXsQV_EI3S67aL3wKNio",
  },
  {
    id: 5,
    name: "FordPinto",
    avatar: FordPintoAvatar,
    background: FordPintoBg,
    description:
      "We want sustainable growth and functionality over the long term. We want a new money. Not in the hands of the government, but in the hands of those using the money, and only by their choice.",
    article:
      "https://mirror.xyz/0xe7731147bBe1BEBe5CF1Ab101C6EceD384dAbD07/bHDzAxNNJxpjbrbQu1HK5nJG7KImkHn6T0_ZLB68tss",
  },
  {
    id: 6,
    name: "burr",
    avatar: burrAvatar,
    background: burrBg,
    description:
      "This isn't just about rebuilding. It's about fulfilling the long-term vision: creating Leviathan-free, low-volatility money that can make the promise of Bitcoin work for the world. I look forward to seeing it through.",
    article:
      "https://mirror.xyz/0xe7731147bBe1BEBe5CF1Ab101C6EceD384dAbD07/UwlJoyWsUPyzct4IHT4Drlaea2PhtWsxyhSGJaoJqw8",
  },
];

export type Contributor = (typeof contributors)[0];

export const selectedContributorAtom = atom<Contributor>(contributors[0]);

// Function to randomly select contributors, ensuring selected contributor is always included
function getRandomContributors(count: number = 5, selectedContributor?: Contributor): Contributor[] {
  if (selectedContributor) {
    // Get all contributors except the selected one
    const others = contributors.filter((c) => c.id !== selectedContributor.id);
    // Shuffle the others and take (count - 1)
    const shuffledOthers = others.sort(() => 0.5 - Math.random()).slice(0, count - 1);
    // Return selected contributor plus random others
    return [selectedContributor, ...shuffledOthers];
  } else {
    // Original behavior when no selected contributor
    const shuffled = [...contributors].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
}

export default function ContributorProfiles() {
  const [selectedContributor, setSelectedContributor] = useAtom(selectedContributorAtom);
  const hasAutoSelected = useRef(false);
  const isInitialLoad = useRef(true);

  // Auto-select a contributor only once on first render
  useEffect(() => {
    if (!hasAutoSelected.current) {
      const randomContributor = contributors[Math.floor(Math.random() * contributors.length)];
      setSelectedContributor(randomContributor);
      hasAutoSelected.current = true;
    }
  }, [setSelectedContributor]);

  // Track contributor profile loads (both auto-selection and user clicks)
  useEffect(() => {
    if (selectedContributor) {
      trackClick(ANALYTICS_EVENTS.LANDING.STATS_CONTRIBUTOR_PROFILE_LOAD, {
        contributor_name: selectedContributor.name,
        section: "stats",
        contributor_article: selectedContributor.article,
        trigger_type: isInitialLoad.current ? "auto_select" : "user_click",
      })();
      isInitialLoad.current = false;
    }
  }, [selectedContributor]);

  // Get random contributors, always including the selected contributor
  const displayedContributors = useMemo(() => {
    return getRandomContributors(5, selectedContributor);
  }, []);

  const handleContributorClick = (contributor: Contributor) => {
    setSelectedContributor(contributor);
  };

  // Line shape positions for mobile: evenly spaced horizontally with slight random variation
  const positions = useMemo(
    () => [
      { x: 0 + (Math.random() * 0.3125 - 0.15625), y: 6.5 + (Math.random() * 0.3125 - 0.15625) },
      { x: 5 + (Math.random() * 0.3125 - 0.15625), y: 6.5 + (Math.random() * 0.3125 - 0.15625) },
      { x: 10 + (Math.random() * 0.3125 - 0.15625), y: 6.5 + (Math.random() * 0.3125 - 0.15625) },
      { x: 15 + (Math.random() * 0.3125 - 0.15625), y: 6.5 + (Math.random() * 0.3125 - 0.15625) },
      { x: 20 + (Math.random() * 0.3125 - 0.15625), y: 6.5 + (Math.random() * 0.3125 - 0.15625) },
    ],
    [],
  );

  // Memoize random animation values to prevent restarts on re-render
  const animationValues = useMemo(
    () =>
      displayedContributors.map(() => ({
        initialY: 20 + Math.random() * 4,
        bobbingY: -(6 + Math.random() * 4),
      })),
    [displayedContributors],
  );

  return (
    <div className="flex justify-center items-center relative -top-20 -left-20 pointer-events-none h-0">
      <div className="relative w-80 h-0">
        {displayedContributors.map((contributor, index) => (
          <motion.div
            key={contributor.id}
            initial={{ opacity: 0, scale: 0, y: animationValues[index].initialY }}
            animate={{
              opacity: 1,
              scale: 1,
              y: [0, animationValues[index].bobbingY, 0],
            }}
            transition={{
              // Entrance animation
              delay: index * 0.1,
              duration: 0.5,
              ease: "backOut",
              y: {
                duration: 2 + index * 0.2, // Slightly different timing for each
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
            className="absolute"
            style={{
              left: `${positions[index].x}rem`,
              top: `${positions[index].y}rem`,
            }}
            whileHover={{
              scale: 1.1,
              rotate: 5,
              transition: { duration: 0.2 },
            }}
          >
            <div className="relative">
              {/* Outer border ring */}
              <motion.div
                className="absolute -inset-2 rounded-full border-[1.5px] border-pinto-green/30 pointer-events-none"
                animate={{
                  opacity: contributor.id === selectedContributor.id ? 1 : 0,
                  scale: contributor.id === selectedContributor.id ? 1 : 0.8,
                }}
                transition={{ duration: 0.3, delay: 0.1 }}
              />
              {/* Middle border ring */}
              <motion.div
                className="absolute -inset-1 rounded-full border-[1.5px] border-pinto-green/60 pointer-events-none"
                animate={{
                  opacity: contributor.id === selectedContributor.id ? 1 : 0,
                  scale: contributor.id === selectedContributor.id ? 1 : 0.9,
                }}
                transition={{ duration: 0.3, delay: 0.05 }}
              />
              <div
                className="w-16 h-16 rounded-full relative overflow-hidden border-[1.5px] shadow-lg cursor-pointer pointer-events-auto border-pinto-gray-2"
                onClick={() => handleContributorClick(contributor)}
              >
                <img src={contributor.avatar} alt={contributor.name} className="w-full h-full object-cover" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
