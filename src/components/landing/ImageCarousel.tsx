import wpBasin from "@/assets/landing/wp_basin.png";
import wpBean from "@/assets/landing/wp_bean.png";
import wpMultiflow from "@/assets/landing/wp_multiflow.png";
import wpPinto from "@/assets/landing/wp_pinto.png";
import wpPipeline from "@/assets/landing/wp_pipeline.png";
import { ANALYTICS_EVENTS } from "@/constants/analytics-events";
import { trackClick } from "@/utils/analytics";
import AutoPlay from "embla-carousel-autoplay";
import ClassNames from "embla-carousel-class-names";
import WheelGesturesPlugin from "embla-carousel-wheel-gestures";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Carousel, CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/Carousel";

interface CarouselData {
  src: string;
  alt: string;
  href: string;
  date: string;
  year: string;
  name: string;
  description: string;
}

const whitepaperImages: CarouselData[] = [
  {
    src: wpBean,
    alt: "Beanstalk",
    href: "https://bean.money/beanstalk.pdf",
    date: "August 2021",
    year: "2021",
    name: "Beanstalk",
    description: "The OG paper that started it all",
  },
  {
    src: wpPipeline,
    alt: "Pipeline",
    href: "https://evmpipeline.org/pipeline.pdf",
    date: "November 2022",
    year: "2022",
    name: "Pipeline and Depot",
    description: "Do anything in DeFi in one transaction",
  },
  {
    src: wpBasin,
    alt: "Basin",
    href: "https://basin.exchange/basin.pdf",
    date: "August 2023",
    year: "2023",
    name: "Basin",
    description: "Fee-less swaps for hyper efficient peg maintenance",
  },
  {
    src: wpMultiflow,
    alt: "Multi Flow Pump",
    href: "https://basin.exchange/multi-flow-pump.pdf",
    date: "August 2023",
    year: "2023",
    name: "Multi-flow",
    description: "On-chain manipulation resistant oracle",
  },
  {
    src: wpPinto,
    alt: "Pinto",
    href: "https://pinto.money/pinto.pdf",
    date: "April 2025",
    year: "2025",
    name: "Pinto",
    description: "The new generation of crypto fiat",
  },
];

export default function ImageCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [currentWp, setCurrentWp] = useState<CarouselData>(whitepaperImages[0]);
  const [autoplayActive, setAutoplayActive] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    let manualSelectionTimeout: NodeJS.Timeout;

    api.on("select", () => {
      const selectedIndex = api.selectedScrollSnap();
      setCurrentIndex(selectedIndex);
      setCurrentWp(whitepaperImages[selectedIndex]);

      // Set a timeout to check if this was a manual selection
      clearTimeout(manualSelectionTimeout);
      manualSelectionTimeout = setTimeout(() => {
        // Manual selection detected - stopping autoplay
        setAutoplayActive(false);
      }, 0);
    });

    api.on("autoplay:select", () => {
      // Clear the timeout since this was an autoplay selection
      clearTimeout(manualSelectionTimeout);
    });

    return () => {
      clearTimeout(manualSelectionTimeout);
    };
  }, [api]);

  useEffect(() => {
    const autoplay = api?.plugins()?.autoplay;
    if (!autoplay || autoplay.isPlaying()) return;
    autoplay.play();
  }, [api]);

  const turnOffAutoplay = useCallback(() => {
    const autoplay = api?.plugins()?.autoplay;
    if (!autoplay || autoplay.isPlaying()) return;
    autoplay.stop();
  }, [api]);

  return (
    <div>
      <div className="flex flex-col text-center gap-1 text-xs sm:text-xl">
        <span>Pinto is the culmination of more than four years of rigorous development on Ethereum.</span>
      </div>
      <Carousel
        opts={{
          align: "center",
          loop: true,
          containScroll: "trimSnaps",
        }}
        plugins={[
          AutoPlay({ delay: 3000, stopOnInteraction: true, playOnInit: false }),
          ClassNames(),
          WheelGesturesPlugin(),
        ]}
        className="w-[90%] max-w-[90%] mx-4 sm:mx-6 sm:w-[95%] sm:max-w-[95%] place-self-center"
        setApi={setApi}
      >
        <CarouselContent className="overflow-y-visible">
          {whitepaperImages.map((image, index) => {
            const isSelected = currentIndex === index;
            return (
              <CarouselItem
                key={image.name}
                className={`overflow-y-visible basis-[70%] sm:basis-[33%] xl:basis-[33%] flex justify-center items-center opacity-[0.50] transition-[padding] pt-10 duration-300 [&.is-snapped]:opacity-100 [&.is-snapped]:pt-0`}
              >
                {!isSelected ? (
                  <div
                    className="w-full overflow-clip bg-top border-t border-x rounded-md object-cover object-top h-[10rem] sm:h-[15rem] xl:h-[18rem] cursor-pointer"
                    style={{
                      maskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 90%)",
                    }}
                    onClick={() => {
                      setAutoplayActive(false);
                      turnOffAutoplay();
                      if (api) {
                        api.scrollTo(index);
                      }
                    }}
                  >
                    <img src={image.src} alt={image.alt} />
                  </div>
                ) : (
                  <Link
                    to={image.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-top border-t border-x overflow-clip rounded-md object-cover object-top h-[10rem] sm:h-[15rem] xl:h-[18rem]"
                    style={{
                      maskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 90%)",
                    }}
                    onClick={trackClick(ANALYTICS_EVENTS.LANDING.STATS_YEARS_WHITEPAPER_CLICK, {
                      whitepaper_name: image.name,
                      whitepaper_url: image.href,
                      section: "stats",
                    })}
                  >
                    <img src={image.src} alt={image.alt} />
                  </Link>
                )}
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious
          variant="ghost"
          noPadding={true}
          className="[&>svg]:w-4 [&>svg]:h-4 sm:[&>svg]:w-8 sm:[&>svg]:h-8"
          onClick={() => {
            setAutoplayActive(false);
            turnOffAutoplay();
            if (api) {
              api?.scrollPrev();
            }
          }}
        />
        <CarouselNext
          variant="ghost"
          noPadding={true}
          className="[&>svg]:w-4 [&>svg]:h-4 sm:[&>svg]:w-8 sm:[&>svg]:h-8"
          onClick={() => {
            setAutoplayActive(false);
            if (api) {
              api?.scrollNext();
            }
          }}
        />
      </Carousel>
      <div className="flex flex-col text-center gap-1 -mt-4 text-xs sm:text-xl">
        <span>
          <span className="font-bold">{`${currentWp.name} (${currentWp.year}):`}</span> {currentWp.description}
        </span>
      </div>
    </div>
  );
}
