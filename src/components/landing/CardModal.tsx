import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/Dialog";
import { cn } from "@/utils/utils";
import { motion } from "framer-motion";
import Markdown from "react-markdown";

interface CardData {
  logo: string;
  title: string;
  subtitle: string;
  definition: string;
  description: string;
}

interface CardModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  cardData: CardData | null;
}

export default function CardModal({ isOpen, onOpenChange, cardData }: CardModalProps) {
  if (!cardData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-pinto-morning-yellow-0/80" />
      <DialogContent
        className={cn(
          "w-[90vw] max-h-[90dvh] sm:w-[60rem]",
          "max-w-none",
          "border border-gray-200 rounded-2xl shadow-2xl",
          "bg-pinto-off-white",
          "p-6 sm:p-10",
          "focus:outline-none focus:ring-0 focus:border-gray-200",
          "transition-all duration-300 ease-in-out",
          "flex flex-col",
          "overflow-clip",
        )}
      >
        <motion.div
          className="flex flex-col gap-4 flex-1 min-h-0"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{
            duration: 0.3,
            ease: [0.16, 1, 0.3, 1], // Custom ease for smooth feel
          }}
        >
          {/* Header section - fixed height */}
          <div className="flex flex-col gap-6 flex-shrink-0">
            <div className="flex flex-row items-center gap-6 sm:gap-8">
              <img src={cardData.logo} className="w-12 h-12 flex-shrink-0" alt={cardData.title} />
              <h2 className="text-2xl sm:text-4xl leading-[1.1] font-thin text-black">{cardData.title}</h2>
            </div>
          </div>
          <div className="overflow-auto overscroll-auto">
            <div className="overscroll-auto text-base mt-2 mb-4 sm:text-xl md:text-2xl lg:text-3xl leading-[1.2] font-thin text-pinto-gray-5 w-full">
              {cardData.subtitle}
            </div>
            {/* Definition section */}
            <div className="overscroll-auto text-sm sm:text-lg mb-4 leading-[1.3] font-thin text-black prose prose-p:leading-[1.3] prose-neutral max-w-none prose-strong:font-bold flex-shrink-0">
              <Markdown>{cardData.definition}</Markdown>
            </div>

            {/* Description section - fills remaining space with scroll */}
            <div className="overscroll-auto flex-1 rounded-lg">
              <div className="overscroll-auto text-sm sm:text-lg px-4 pt-4 sm:px-8 sm:pt-4 prose-p:leading-[1.3] prose-li:leading-[1.3] prose-a:text-pinto-green-4 hover:prose-a:text-pinto-green-2 prose-a:transition-all prose-a:duration-300 prose-a:after:content-['↗'] prose-a:after:ml-1 prose-a:after:inline-block font-thin text-black overflow-y-auto h-full prose prose-neutral max-w-none prose-h2:font-normal prose-h2:sm:text-lg prose-h2:text-sm prose-h2:text-pinto-gray-4 prose-img:inline prose-img:w-5 prose-img:h-5 sm:prose-img:w-6 sm:prose-img:h-6 prose-img:mx-1 prose-img:align-middle prose-img:-translate-y-0.5 prose-img:!my-0 prose-img:!py-0 prose-ul:!mt-4 prose-ul:!mb-4 prose-ul:!py-0 prose-li:!my-2 prose-li:!py-0 prose-p:!mb-4 prose-p:first:!mt-0 prose-p:last:!mb-0">
                <Markdown>{cardData.description}</Markdown>
              </div>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
