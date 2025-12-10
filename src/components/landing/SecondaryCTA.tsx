import chevronDown from "@/assets/misc/ChevronDown.svg";
import PropertyLowVolatility from "@/assets/misc/Property_Low_Volatility.svg";
import PropertyMediumOfExchange from "@/assets/misc/Property_Medium_of_Exchange.svg";
import PropertyScalable from "@/assets/misc/Property_Scalable.svg";
import PropertyUnitOfAccount from "@/assets/misc/Property_Unit_of_Account.svg";
import ValueCensorshipResistance from "@/assets/misc/Value_Censorship_Resistance.svg";
import ValueFairness from "@/assets/misc/Value_Fairness.svg";
import ValueOpenSource from "@/assets/misc/Value_Open_Source.svg";
import ValuePermissionlessness from "@/assets/misc/Value_Permissionlessness.svg";
import ValueTrustless from "@/assets/misc/Value_Trustlessness.svg";
import { ANALYTICS_EVENTS } from "@/constants/analytics-events";
import useIsMobile from "@/hooks/display/useIsMobile";
import { useLiquidityDistribution } from "@/hooks/useLiquidityDistribution";
import { trackClick } from "@/utils/analytics";
import clsx from "clsx";
import { useState } from "react";
import { Link } from "react-router-dom";
import { PintoRightArrow } from "../Icons";
import { navLinks } from "../nav/nav/Navbar";
import { Button } from "../ui/Button";
import IconImage from "../ui/IconImage";
import CardModal from "./CardModal";

// Function to create values data with dynamic liquidity distribution
const createValuesData = (liquidityDistributionText: string) => [
  {
    logo: ValueCensorshipResistance,
    title: "Censorship Resistance",
    subtitle: "Pinto is designed to be maximally resistant to censorship.",
    definition: "**Censorship Resistant:** resilient to the prevention of valid actions from being executed reliably.",
    description: `Censorship can take the form of: 

1. **Communication failures**

      **Communication:**  information sharing

2. **Availability failures**
    
      **Availability:** accessibility and operational readiness
    
3. **Liveness failures**
    
    **Liveness:** eventual progress and completion of all valid operations
    
4. **Integrity failures**
    
    **Integrity:** correct completion of operations
    

While Pinto trades against a variety of value which is subject to censorship, the currency itself is designed to be free from censorship. Due to the lack of censorship resistant value on chain (besides ETH), Pinto must manage the risk of censorship by minimizing the concentration of risk of censorship by any one party. Instances where some of the value Pinto trades against is censored, Pinto's price and liquidity would fall, but the integrity of the protocol as a whole would be maintained. 

${liquidityDistributionText || "Loading liquidity distribution data..."}

A future blacklist mitigation mechanism will extend the censorship resistance of the protocol by pushing the risk of holding censorable value within the protocol onto the holders of that value, instead of the protocol as a whole, by automatically freezing the Pinto in the censored pool. In this case, even if one of the non-Pinto assets in a Pinto liquidity pool is censored, while total liquidity would decrease, the value in all the other pools and pure Pinto would be protected. This design will safeguard the health of the protocol and encourage participants to favor Depositing value that increases overall censorship resistance.`,
  },
  {
    logo: ValueTrustless,
    title: "Trustlessness",
    subtitle:
      "Pinto is building fiat currency free from the risk of arbitrary money printing and interest rate manipulation.",
    definition:
      "**Trustlessness:** reliability is assured through autonomy, incorruptibility, and verifiability rather than trust.",
    description: `- **Reliability:** consistent and correct performance.
    - Reliable systems function as expected over time under both normal and adverse conditions.
- **Autonomy:** rule compliance guaranteed by internal mechanisms.
    - A system is autonomous if its rules are upheld by protocol design and crypto-economics without arbitrary or subjective judgement.
- **Incorruptibility:** resistance to unauthorized change.
    - Incorruptible systems prevent rules from being manipulated and tampered with. Change occurs only through explicitly defined mechanisms and authorized processes, ensuring the system's integrity cannot be compromised.
- **Verifiability:** the ability to independently validate correctness.
    - A system is verifiable to a participant if they can confirm correctness without trusting any party. Verification is typically enabled by transparency, reproducibility, or cryptographic proofs.


Pinto functions autonomously according to verifiable rules and parameters, which the Pinto Community Multisig (PCM) upgrades transparently to improve the protocol. Two weeks after the protocol reaches 500M supply, the PCM will forfeit governance of Pinto, with the exception of fixing security vulnerabilities and bugs. In its place, a permissionless fork system will enable continued improvements while protecting participants from having the code underlying their currency ever changed without their consent.`,
  },
  {
    logo: ValuePermissionlessness,
    title: "Permissionlessness",
    subtitle: "Anyone with an internet connection and funds on the Ethereum network can participate in Pinto.",
    definition: "**Permissionlessness:** the absence of approval requirements for participation.",
    description: `**Permissioned:** the quality of requiring approval for participation.

Note: Barriers of strict technical capacity do not constitute permissions (*e.g.,* internet connection, gas payment).

Pinto is open for anyone to participate.`,
  },
  {
    logo: ValueFairness,
    title: "Fairness",
    subtitle: "The Pinto printer is designed to be free from capture.",
    definition: "**Fair:** treating all parties impartially according to agreed upon rules and standards.",
    description: `In a fair market, informed participants act freely and compete on a playing field with the following properties:

- existing competitive advantages are difficult to entrench. 'Capture' is difficult, restricted to product or strategy alpha rather than privileged access or anti-competitive techniques.
- while participants can spend to achieve certain advantages over others, each additional marginal increase in advantage over other participants has increasing marginal costs.
- latency and information asymmetry are minimal.

Pinto functions according to explicitly defined rules. While Pinto rewards older and larger Deposits with more mints, the competitive advantage of older Deposits decreases over time and larger Deposits cost more for each marginal unit of value Deposited. [Tractor makes autonomous execution available to every participant](https://mirror.xyz/0x8F02813a0AC20affC2C7568e0CB9a7cE5288Ab27/cUuaXyfIWa3ugQUDs-7WVHy4DRBsfbLelzoaRv-H-QE), independent of technical savvy, and minimizes information asymmetry within the constraints of the EVM.`,
  },
  {
    logo: ValueOpenSource,
    title: "Open-Source",
    subtitle: "From code to plain language write-ups, Pinto is accessible to everyone.",
    definition: "**Open Source:** software that is freely available for anyone to:",
    description: `1. run;
2. study and modify;
3. redistribute in original and modified form.

The protocol is [completely open-source](https://github.com/pinto-org), and tremendous effort has gone into defining it and putting it into context, from rigorous technical documentation (*i.e.*, [the whitepaper](https://pinto.money/pinto.pdf)) to plain language [explainers](https://mirror.xyz/0x8F02813a0AC20affC2C7568e0CB9a7cE5288Ab27).`,
  },
];

// Properties data (USD properties - green glow)
const propertiesData = [
  {
    logo: PropertyScalable,
    title: "Scalable",
    subtitle: "Pinto can grow infinitely to meet market demand for trustless low-volatility currency.",
    definition: "**Scalable:** competitive volatility and carrying costs can be sustained at arbitrary supply.",
    description: `Collateralized stablecoins are limited by the amount of available collateral. Due to the lack of crypto-native collateral, collateralized stablecoins have been forced to sacrifice Ethereum's values and use centralized collateral in order to scale to meet demand. Instead of collateral, Pinto uses credit, which is infinitely scalable and network-native, enabling Pinto to grow to meet arbitrary demand without compromising on Ethereum's values.`,
  },
  {
    logo: PropertyLowVolatility,
    title: "Low Volatility",
    subtitle:
      "Pinto seeks to minimize the volatility of its value through thoughtful incentives instead of trying to maintain a perfect peg.",
    definition: "**Low Volatility:** purchasing power varies minimally over time.",
    description: `The stablecoin trilemma states that a stablecoin cannot be stable, scalable and decentralized. Pinto strikes the optimal balance within this trilemma by sacrificing perfect stability in favor of low volatility, thereby enabling it to scale to meet arbitrary demand without sacrificing the benefits of decentralization – which is not an end in and of itself – namely trustlessness, permissionlessness, censorship resistance and fairness.`,
  },
  {
    logo: PropertyMediumOfExchange,
    title: "Medium of Exchange",
    subtitle:
      "Prioritizing low volatility and yield over upward price movement makes Pinto the optimal crypto-native Medium of Exchange.",
    definition: "**Medium of Exchange:** an asset widely accepted as payment, enabling trade without direct barter.",
    description: `Pinto has the unique combination of being low in volatility and generating native yield, which makes an optimal medium of exchange between various types of value. sPinto, the fungible yield-bearing ERC-20 wrapper of Pinto Deposits, offers the ability to integrate Pinto into existing DeFi primitives and distribute yield to liquidity providers with minimal friction.`,
  },
  {
    logo: PropertyUnitOfAccount,
    title: "Unit of Account",
    subtitle:
      "Low volatility and algorithmic distribution of new mints make Pinto the optimal crypto-native Unit of Account for loans.",
    definition: "**Unit of Account:** a monetary standard used to price and compare value.",
    description: `Unlike centralized fiat currencies, in which new currency is printed and distributed arbitrarily, often devaluing the wealth of the respective system's participants and the purchasing power of each unit of the currency, Pinto autonomously distributes newly minted currency directly to its holders. Combined with its native volatility-minimization mechanisms, the protocol creates a currency designed to serve as a unit of account for value and loans of value.`,
  },
];

interface CardData {
  logo: string;
  title: string;
  subtitle: string;
  definition: string;
  description: string;
}

interface CarouselCardProps {
  data: CardData;
  index: number;
  keyPrefix: string;
  color: string;
  cardType: "values" | "properties";
  onClick: (cardData: CardData, cardType: "values" | "properties") => void;
}

function CarouselCard({ data, index, keyPrefix, color, cardType, onClick }: CarouselCardProps) {
  return (
    <Button
      key={`${keyPrefix}_${data.title}_${index}`}
      variant="outline-white"
      className={clsx(
        // Base styles
        "flex items-center rounded-2xl md:justify-between",

        // Color & gradient styles
        color === "green"
          ? "border-pinto-green-4/50 bg-[linear-gradient(90deg,#D8F1E2_0%,#FCFCFC_35%)] hover:bg-[linear-gradient(90deg,#D8F1E2_0%,#D8F1E2_35%)] md:bg-[linear-gradient(180deg,#D8F1E2_0%,#FCFCFC_50%)] hover:md:bg-[linear-gradient(180deg,#D8F1E2_0%,#D8F1E2_0%)]"
          : "border-pinto-purple-2 bg-[linear-gradient(90deg,#F0EBF6_0%,#FCFCFC_35%)] hover:bg-[linear-gradient(90deg,#F0EBF6_0%,#F0EBF6_35%)] md:bg-[linear-gradient(180deg,#F0EBF6_0%,#FCFCFC_50%)] hover:md:bg-[linear-gradient(180deg,#F0EBF6_0%,#F0EBF6_50%)]",

        // Mobile (default)
        "flex-row gap-4 w-full h-auto px-4",

        // Small screens and up
        "md:flex-col md:gap-4 md:p-4 md:w-[14rem] md:h-[18rem] md:flex-shrink-0 md:active:scale-95 md:hover:scale-105",

        // Medium screens
        "min-[1000px]:w-[16rem] min-[1000px]:h-[17rem]",

        // Large screens
        "min-[1100px]:w-[17rem] min-[1100px]:h-[17rem]",

        // Extra large screens
        "xl:w-[19rem] xl:h-[18rem]",

        // 3XL screens
        "3xl:w-[17rem] 3xl:h-[17rem] 3xl:gap-6",

        "min-[2100px]:w-[19rem] min-[2100px]:h-[19rem]",

        "duration-200 transition-all",
      )}
      onClick={() => onClick(data, cardType)}
    >
      <img
        src={data.logo}
        className={clsx(
          // Base styles
          "flex-shrink-0 object-contain",

          // Mobile (default)
          "w-8 h-8",

          // Small screens and up
          "sm:w-16 sm:h-16",

          // Large screens
          "lg:w-[4.5rem] lg:h-[4.5rem]",

          // Extra large screens
          "xl:w-20 xl:h-20",

          // 3XL screens
          "3xl:w-[4.5rem] 3xl:h-[4.5rem]",

          "min-[2100px]:w-24 min-[2100px]:h-24",
        )}
        alt={data.title}
      />
      <div
        className={clsx(
          // Base styles
          "flex flex-col md:flex-1",

          // Mobile (default)
          "gap-1 w-full",

          // Small screens and up
          "sm:gap-2 sm:-ml-[4rem]",

          "md:ml-0 md:w-auto",

          // Large screens
          "lg:gap-3",

          // 2XL screens
          "2xl:gap-4",
        )}
      >
        <div
          className={clsx(
            // Base styles
            "leading-[1.1] font-thin text-black",

            // Mobile (default)
            "text-[1.25rem] md:text-xl lg:text-lg text-center max-sm:whitespace-pre-wrap",
          )}
        >
          {data.title}
        </div>
        <div
          className={clsx(
            // Base styles
            "leading-[1.1] font-normal text-pinto-gray-4 whitespace-normal text-center",

            // Mobile (default)
            "hidden",

            // Small screens and up
            "md:block md:text-base",

            // Large screens

            // Extra large screens
          )}
        >
          {data.subtitle}
        </div>
      </div>
      <IconImage src={chevronDown} size={6} className="block ml-2 sm:-ml-5 md:hidden" alt="chevron down" />
    </Button>
  );
}

export default function SecondaryCTA() {
  const isMobile = useIsMobile();
  const { formattedText: liquidityDistributionText } = useLiquidityDistribution();

  // Create valuesData with dynamic liquidity distribution
  const valuesData = createValuesData(liquidityDistributionText);

  // Modal state
  const [selectedCard, setSelectedCard] = useState<(typeof valuesData)[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = (cardData: (typeof valuesData)[0], cardType: "values" | "properties") => {
    // Track card click with specific analytics events
    if (cardType === "values") {
      // Track general values card click
      trackClick(ANALYTICS_EVENTS.LANDING.VALUES_CARD_CLICK, {
        card_title: cardData.title,
        card_type: "ethereum_values",
        section: "values_properties",
      })();

      // Track specific values card based on title
      const specificEvent = getSpecificValuesEvent(cardData.title);
      if (specificEvent) {
        trackClick(specificEvent, {
          card_title: cardData.title,
          section: "values_properties",
        })();
      }
    } else {
      // Track general properties card click
      trackClick(ANALYTICS_EVENTS.LANDING.PROPERTIES_CARD_CLICK, {
        card_title: cardData.title,
        card_type: "usd_properties",
        section: "values_properties",
      })();

      // Track specific properties card based on title
      const specificEvent = getSpecificPropertiesEvent(cardData.title);
      if (specificEvent) {
        trackClick(specificEvent, {
          card_title: cardData.title,
          section: "values_properties",
        })();
      }
    }

    // Track modal open
    trackClick(ANALYTICS_EVENTS.LANDING.CARD_MODAL_OPEN, {
      card_title: cardData.title,
      card_type: cardType === "values" ? "ethereum_values" : "usd_properties",
      section: "values_properties",
    })();

    setSelectedCard(cardData);
    setIsModalOpen(true);
  };

  const handleModalClose = (open: boolean) => {
    if (!open && selectedCard) {
      // Track modal close
      trackClick(ANALYTICS_EVENTS.LANDING.CARD_MODAL_CLOSE, {
        card_title: selectedCard.title,
        section: "values_properties",
      })();
    }

    setIsModalOpen(open);
    if (!open) {
      setSelectedCard(null);
    }
  };

  // Helper functions to get specific analytics events
  const getSpecificValuesEvent = (title: string) => {
    switch (title) {
      case "Censorship Resistance":
        return ANALYTICS_EVENTS.LANDING.VALUES_CENSORSHIP_RESISTANCE_CLICK;
      case "Trustlessness":
        return ANALYTICS_EVENTS.LANDING.VALUES_TRUSTLESSNESS_CLICK;
      case "Permissionlessness":
        return ANALYTICS_EVENTS.LANDING.VALUES_PERMISSIONLESSNESS_CLICK;
      case "Fairness":
        return ANALYTICS_EVENTS.LANDING.VALUES_FAIRNESS_CLICK;
      case "Open-Source":
        return ANALYTICS_EVENTS.LANDING.VALUES_OPEN_SOURCE_CLICK;
      default:
        return null;
    }
  };

  const getSpecificPropertiesEvent = (title: string) => {
    switch (title) {
      case "Scalable":
        return ANALYTICS_EVENTS.LANDING.PROPERTIES_SCALABLE_CLICK;
      case "Low Volatility":
        return ANALYTICS_EVENTS.LANDING.PROPERTIES_LOW_VOLATILITY_CLICK;
      case "Medium of Exchange":
        return ANALYTICS_EVENTS.LANDING.PROPERTIES_MEDIUM_OF_EXCHANGE_CLICK;
      case "Unit of Account":
        return ANALYTICS_EVENTS.LANDING.PROPERTIES_UNIT_OF_ACCOUNT_CLICK;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="flex flex-col items-center">
        {/* Values Carousel */}
        <div className="flex flex-col max-md:w-[95%] md:flex-row items-center place-self-center gap-4 min-[1700px]:gap-8">
          {valuesData.map((info, index) => {
            return (
              <CarouselCard
                key={`dataInfo1_${info.title}_${index}`}
                data={info}
                index={index}
                keyPrefix="dataInfo1"
                color="purple"
                cardType="values"
                onClick={handleCardClick}
              />
            );
          })}
        </div>

        {/* Middle Content */}
        <div className="flex flex-col items-center place-content-center px-3 lg:px-12 gap-3 lg:gap-4 min-[2100px]:gap-6 w-full sm:max-w-[59rem] mx-auto my-[3.75rem] 3xl:my-[1rem] min-[2100px]:my-[3.75rem]">
          <h2 className="text-[1.75rem] md:pinto-h2 md:text-5xl leading-[1.1] text-black flex flex-row gap-4 items-center text-center">
            <span>
              Pinto combines <span className="text-pinto-purple-2">the values of Ethereum</span> with{" "}
              <span className="text-pinto-green-4">the properties of USD</span>
            </span>
          </h2>
          <span className="text-xl lg:text-lg lg:leading-[1.4] font-thin text-black text-center sm:whitespace-nowrap">
            Pinto is designed to save the Ethereum network from the threat of centralized stablecoins.
          </span>
          <Link to={navLinks.printsToThePeople} target="_blank" rel="noopener noreferrer">
            <Button
              rounded="full"
              variant={"defaultAlt"}
              size={isMobile ? "md" : "xl"}
              className={`z-20 hover:bg-pinto-green-2/20 max-sm:text-sm h-auto border border-pinto-green-3 bg-pinto-green-1 max-sm:pl-4 max-sm:pr-2 transition-all duration-300 ease-in-out flex flex-row gap-[10px] sm:gap-2 items-center relative overflow-hidden text-xl leading-6 !font-[300]`}
              onClick={trackClick(ANALYTICS_EVENTS.LANDING.SECONDARY_CTA_ARTICLE_CLICK, {
                button_text: "Why is Pinto the best alternative to centralized stablecoins?",
                destination: navLinks.printsToThePeople,
                section: "values_properties",
                article_type: "external_blog_post",
              })}
            >
              <span>
                Why does Ethereum need <br className={"min-[400px]:hidden"} /> crypto-native fiat?
              </span>
              <span className="text-pinto-green-4 transition-all duration-300 ease-in-out">
                <PintoRightArrow width={"1rem"} height={"1rem"} className="transition-all" color="currentColor" />
              </span>
            </Button>
          </Link>
        </div>

        {/* Properties Carousel */}
        <div className="flex flex-col max-md:w-[95%] md:flex-row items-center place-self-center gap-4 min-[1700px]:gap-8">
          {propertiesData.map((info, index) => {
            return (
              <CarouselCard
                key={`dataInfo2_${info.title}_${index}`}
                data={info}
                index={index}
                keyPrefix="dataInfo2"
                color="green"
                cardType="properties"
                onClick={handleCardClick}
              />
            );
          })}
        </div>
      </div>
      <CardModal isOpen={isModalOpen} onOpenChange={handleModalClose} cardData={selectedCard} />
    </>
  );
}
