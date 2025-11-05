import { ANALYTICS_EVENTS } from "@/constants/analytics-events";
import { trackClick } from "@/utils/analytics";
import { AnimatePresence, motion } from "framer-motion";
import { useAtom } from "jotai";
import { Link } from "react-router-dom";
import { selectedContributorAtom } from "./ContributorProfiles";

function getBackgroundPosition(contributorName: string): string {
  switch (contributorName) {
    case "natto":
      return "bg-[center_top_0.5rem]";
    case "Ryan":
    case "burr":
      return "bg-[center_bottom_0.25rem]";
    default:
      return "bg-center";
  }
}

export default function ContributorMessage() {
  const [selectedContributor] = useAtom(selectedContributorAtom);

  return (
    <div className="flex flex-col mx-auto text-center w-full max-w-full px-4 sm:px-0 sm:w-[65%] h-[400px] sm:h-[400px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedContributor.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{
            duration: 0.4,
            ease: [0.16, 1, 0.3, 1], // Custom ease for smooth feel
          }}
          className="flex flex-col h-full"
        >
          <Link
            to={selectedContributor.article}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col h-full"
            onClick={trackClick(ANALYTICS_EVENTS.LANDING.STATS_CONTRIBUTOR_ARTICLE_CLICK, {
              contributor_name: selectedContributor.name,
              article_url: selectedContributor.article,
              section: "stats",
            })}
          >
            <motion.p
              className="text-xl sm:text-4xl font-light text-pinto-gray-5 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              "{selectedContributor.description}" - {selectedContributor.name}
            </motion.p>
            <motion.div
              className={`sm:h-[400px] sm:w-[900px] h-[400px] w-[400px] place-self-center bg-cover ${getBackgroundPosition(selectedContributor.name)} bg-no-repeat rounded-lg`}
              style={{
                backgroundImage: `url(${selectedContributor.background})`,
                maskImage:
                  "linear-gradient(to right, rgba(0,0,0,0) 5%, rgba(0,0,0,1) 7%, rgba(0,0,0,1) 93%, rgba(0,0,0,0) 95%), linear-gradient(to bottom, rgba(0,0,0,0) 5%, rgba(0,0,0,1) 10%, rgba(0,0,0,1) 90%, rgba(0,0,0,0) 95%)",
                maskComposite: "intersect",
              }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />
          </Link>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
