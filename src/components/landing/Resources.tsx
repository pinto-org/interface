import Resources1 from "@/assets/landing/Resources_1.avif";
import Resources2 from "@/assets/landing/Resources_2.avif";
import Resources3 from "@/assets/landing/Resources_3.avif";
import { ANALYTICS_EVENTS } from "@/constants/analytics-events";
import { trackClick } from "@/utils/analytics";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { PintoRightArrow } from "../Icons";
import { navLinks } from "../nav/nav/Navbar";
import { Button } from "../ui/Button";

const resourceCards = [
  {
    title: "Learn",
    description:
      "Uncover the mission and history driving Pinto, and how protocol-native incentives coordinate participants to minimize the volatility of Pinto's price without collateral.",
    image: Resources1,
    buttons: [
      {
        href: navLinks.docs,
        icon: "gitbook.png",
        label: "Docs",
      },
      {
        href: navLinks.blog,
        icon: "mirror.png",
        label: "Blog",
      },
    ],
  },
  {
    title: "Engage",
    description:
      "Join the community to ask questions, participate in discussion about protocol improvements and connect with other farmers.",
    image: Resources2,
    buttons: [
      {
        href: navLinks.twitter,
        icon: "twitter.png",
        label: "@pintodotmoney",
      },
      {
        href: navLinks.discord,
        icon: "discord.png",
        label: "Discord",
      },
    ],
  },
  {
    title: "Participate",
    description: "Deposit value into or lend to the protocol to benefit from the future growth of Pinto.",
    image: Resources3,
    buttons: [
      {
        href: navLinks.overview,
        label: "Take me to the Farm",
        variant: "default",
        ctaStyle: true,
      },
    ],
  },
];

const cardStyles = clsx(
  "border border-pinto-gray-2 rounded-[1.25rem] flex flex-col gap-2 sm:gap-8 overflow-clip bg-white",
  "flex-shrink-0 snap-center sm:w-full sm:max-w-[32rem] xl:max-w-[30rem] 2xl:max-w-[32rem] sm:flex-shrink sm:snap-align-none",
);
const buttonStyles = clsx(
  "w-full flex p-2 pr-3 sm:p-4 sm:pr-4 justify-center items-center gap-2.5 h-[3.125rem] text-sm font-normal",
);

// Helper function to get the appropriate analytics event based on button label
function getResourcesAnalyticsEvent(label: string) {
  switch (label) {
    case "Docs":
      return ANALYTICS_EVENTS.LANDING.RESOURCES_DOCS_CLICK;
    case "Blog":
      return ANALYTICS_EVENTS.LANDING.RESOURCES_BLOG_CLICK;
    case "@pintodotmoney":
      return ANALYTICS_EVENTS.LANDING.RESOURCES_TWITTER_CLICK;
    case "Discord":
      return ANALYTICS_EVENTS.LANDING.RESOURCES_DISCORD_CLICK;
    case "Take me to the Farm":
      return ANALYTICS_EVENTS.LANDING.RESOURCES_FARM_CTA_CLICK;
    default:
      return null;
  }
}

export default function Resources() {
  return (
    <div className="flex flex-col items-center self-stretch gap-8 2xl:gap-12">
      <div className="flex flex-col gap-6 items-center">
        <h2 className="text-2xl sm:text-4xl leading-same-h2 font-light text-black flex flex-col md:flex-row md:gap-2 items-center">
          <span>Printed directly to the people.</span>
          <span>Founded on leviathan-free credit.</span>
        </h2>
      </div>
      <div className="flex flex-col w-full sm:flex-row sm:justify-center gap-4 lg:gap-8 max-2xl:px-4 sm:max-2xl:px-4">
        {resourceCards.map((card, index) => (
          <div key={index} className={cardStyles}>
            <div className="overflow-hidden relative h-[16rem] sm:h-[24rem] xl:h-[15rem] min-[1300px]:h-[20rem] 3xl:h-[18rem] min-[2100px]:h-[24rem] flex justify-center items-center">
              <img
                src={card.image}
                alt={card.title}
                className={`w-full h-full object-cover ${card.title !== "Participate" ? "xl:object-top min-[1300px]:object-cover" : ""}`}
              />
            </div>
            <div className="flex flex-col justify-between flex-1 gap-4 2xl:gap-8 mx-4 mb-4 2xl:mx-6 2xl:mb-6">
              <div className="flex flex-col gap-4">
                <span className="text-[1.5rem] sm:text-[2rem] xl:text-[1.5rem] 2xl:text-[2rem] font-light text-black">
                  {card.title}
                </span>
                <span className="text-[1rem] sm:text-[1.5rem] xl:text-[1rem] 2xl:text-[1.5rem] font-light text-pinto-gray-4 h-fit">
                  {card.description}
                </span>
              </div>
              <div className={`flex flex-col min-[1200px]:flex-row gap-4`}>
                {card.buttons.map((button, buttonIndex) => (
                  <Link
                    key={buttonIndex}
                    to={button.href}
                    target={button.ctaStyle ? undefined : "_blank"}
                    rel={button.ctaStyle ? undefined : "noopener noreferrer"}
                    className="flex-1"
                    onClick={(() => {
                      const analyticsEvent = getResourcesAnalyticsEvent(button.label);
                      return analyticsEvent
                        ? trackClick(analyticsEvent, {
                            section: "resources",
                            card_title: card.title.toLowerCase(),
                            button_label: button.label,
                            destination: button.href,
                            button_type: button.ctaStyle ? "cta" : "external_link",
                          })
                        : undefined;
                    })()}
                  >
                    <Button
                      variant={button.variant || "outline-white"}
                      className={buttonStyles}
                      shimmer={button.ctaStyle || false}
                    >
                      {button.icon && (
                        <img
                          src={button.icon}
                          className="w-6 h-6 min-w-6 min-h-6 2xl:w-8 2xl:h-8 2xl:min-w-8 2xl:min-h-8"
                          alt={button.label}
                        />
                      )}
                      <span className="w-full text-start z-10">{button.label}</span>
                      {button.ctaStyle ? (
                        <div className="relative z-10" style={{ isolation: "isolate" }}>
                          <PintoRightArrow width={"1rem"} height={"1rem"} />
                        </div>
                      ) : (
                        <span>→</span>
                      )}
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
