import { TV } from "@/classes/TokenValue";
import InlineStats, { InlineStat } from "@/components/InlineStats";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import GradientCard from "@/components/ui/GradientCard";
import IconImage from "@/components/ui/IconImage";
import PageContainer from "@/components/ui/PageContainer";
import Text from "@/components/ui/Text";
import { PODS, SEEDS, STALK } from "@/constants/internalTokens";
import { PINTO } from "@/constants/tokens";
import useIsTablet from "@/hooks/display/useIsTablet";
import useFarmerStatus from "@/hooks/useFarmerStatus";
import { usePodLine, useTemperature, useTotalSoil } from "@/state/useFieldData";
import { usePriceQuery } from "@/state/usePriceData";
import { AverageBDVWeightedSiloAPYs, useAverageBDVWeightedSiloAPYs } from "@/state/useSiloAPYs";
import useTokenData from "@/state/useTokenData";
import { formatter, numberAbbr } from "@/utils/format";
import { useDebounceCallback } from "@/utils/useDebounce";
import { cn } from "@/utils/utils";
import { Separator } from "@radix-ui/react-separator";
import { useModal } from "connectkit";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { atomWithImmer } from "jotai-immer";
import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

/// ------------ BANNERS ------------ ///

const ConnectWalletBanner = () => {
  const modal = useModal();
  return (
    <GradientCard variant="light" className="w-full">
      <div className="flex flex-row w-full items-center justify-between py-3 px-6 gap-4">
        <Text variant="h4" weight="light">
          Connect your wallet to see your Deposits and Plots
        </Text>
        <Button variant="gradient" size="xl" rounded="full" onClick={() => modal.setOpen(true)}>
          Connect Wallet
        </Button>
      </div>
    </GradientCard>
  );
};

const UndepositedBalanceBanner = () => {
  const token = useTokenData().mainToken;
  return (
    <Card className="flex flex-row w-full rounded-full items-center justify-between border border-pinto-green-4 bg-pinto-green-1 p-6">
      <Text variant="h4" color="green4">
        You have Pinto in your Wallet that isn't earning yield. Deposit your Pinto for Stalk and Seed.
      </Text>
      <Button variant="gradient" size="xxl" rounded="full">
        <Link to={`/silo/${token.address}`}>
          <span className="px-11">Deposit</span>
        </Link>
      </Button>
    </Card>
  );
};

/// ------------ TOGGLE ------------ ///

type Selected = "silo" | "field";
const targetIds = ["silo-info", "field-info"];

const selectedAtom = atom<Selected | undefined>(undefined);

const NewUserView = () => {
  const setSelected = useSetAtom(selectedAtom);
  const containerRef = useRef<HTMLDivElement>(null);
  const farmerStatus = useFarmerStatus();
  const price = usePriceQuery();

  const { data: avgSiloYields } = useAverageBDVWeightedSiloAPYs();

  useEffect(() => {
    if (!price.data?.price) return;
    const p = TV.fromBlockchain(price.data?.price ?? 0n, 6);
    setSelected(p.gt(1) ? "silo" : "field");
  }, [price.data?.price, setSelected]);

  return (
    <div className="relative" ref={containerRef}>
      <PageContainer variant="full" className="w-full">
        {!farmerStatus.address ? (
          <ConnectWalletBanner />
        ) : farmerStatus.hasUndepositedBalance ? (
          <UndepositedBalanceBanner />
        ) : null}
        <div className="flex flex-col w-full items-center pt-8">
          <div className={"w-full max-w-[1346px]"}>
            <div className="flex flex-col items-center w-full max-w-[1340px]">
              <PegToggle containerRef={containerRef} />
              <div className="mt-[232px] flex flex-row gap-12 w-full justify-between">
                <SiloInfo containerRef={containerRef} avgSiloYields={avgSiloYields} />
                <FieldInfo containerRef={containerRef} />
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
      <SVGOverlay targetIds={targetIds} sourceId="peg-state" verticalLineHeight={80} />
    </div>
  );
};

export default NewUserView;

const InlineFlex = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center gap-1">{children}</span>
);

const FlowCard = ({
  children,
  textColor = "green4",
}: { children: React.ReactNode; textColor?: "green4" | "primary" }) => {
  return (
    <Text
      variant="body-light"
      color={textColor}
      className="bg-white/100 border-pinto-gray-2 border px-3 py-2 inline-flex items-center gap-1 rounded-xl flex-wrap"
    >
      {children}
    </Text>
  );
};

const PintoIcon = () => <IconImage size={6} src={PINTO.logoURI} />;

/**
 * Kind of hacky method, but no other way to get the text to wrap along w/ the icon
 * without the spacing being weird.
 */
const flowCards: {
  [key in Selected]: {
    upper?: JSX.Element;
    silo: JSX.Element;
    field: JSX.Element;
  };
} = {
  silo: {
    upper: (
      <FlowCard>
        <InlineFlex>
          New <PintoIcon />
        </InlineFlex>
        <span>Pinto</span> <span>is</span> <span>minted</span>{" "}
      </FlowCard>
    ),
    silo: (
      <FlowCard>
        <InlineFlex>
          <PintoIcon /> 48.5%
        </InlineFlex>{" "}
        <span>of</span> <span>new</span> <span>Pinto</span> <span>is</span> <span>distributed</span> <span>based</span>{" "}
        <span>on</span> <span>Stalk</span>
      </FlowCard>
    ),
    field: (
      <FlowCard>
        <InlineFlex>
          <PintoIcon /> 48.5%
        </InlineFlex>{" "}
        <span>of</span> <span>new</span> <span>Pinto</span> <span>makes</span> <span>Pods</span> <span>at</span>{" "}
        <span>the</span> <span>front</span> <span>of</span> <span>the</span> <span>Line</span> <span>redeemable</span>
      </FlowCard>
    ),
  },
  field: {
    silo: (
      <FlowCard textColor="primary">
        <InlineFlex>
          <PintoIcon /> Depositors
        </InlineFlex>{" "}
        <span>can</span> <span>convert</span> <span>LP</span> <span>into</span> <span>Pinto</span> <span>to</span>{" "}
        <span>buy</span> <span>at</span> <span>a</span> <span>lower</span> <span>price</span>
      </FlowCard>
    ),
    field: (
      <FlowCard textColor="primary">
        <InlineFlex>
          <IconImage size={6} src={PODS.logoURI} /> Temperature
        </InlineFlex>{" "}
        <span>(interest rate)</span> <span>for</span> <span>lending</span> <span>increases</span>
      </FlowCard>
    ),
  },
} as const;

interface IContainerRef {
  containerRef: React.RefObject<HTMLDivElement>;
}

const info = [
  { id: "silo", text: "Greater than $1.00" },
  { id: "field", text: "Less than $1.00" },
] as const;

const PegToggle = ({ containerRef }: IContainerRef) => {
  const ref = useRef<HTMLDivElement>(null);
  useSetComponentPosition(ref, "peg-state", containerRef);

  const [selected, setSelected] = useAtom(selectedAtom);

  return (
    <div className="relative flex flex-col">
      <div className="flex flex-col justify-center p-4 gap-4">
        <Text variant="body-light">Pinto adjusts incentives depending on token price:</Text>
        <div className="flex flex-row w-fit items-center">
          {info.map((text, index) => {
            return (
              <React.Fragment key={`${text.text}-${index}`}>
                <div
                  className={cn(
                    "flex flex-row items-center px-4 py-2 w-[235px] justify-center cursor-pointer",
                    selected === text.id ? "bg-pinto-green-1" : "bg-pinto-gray-1",
                    index === 0 ? "rounded-l-full" : "rounded-r-full",
                    selected === text.id ? "border border-pinto-green-4" : "border border-pinto-gray-2",
                    index === 0 ? "border-r-0" : "border-l-0",
                  )}
                  onClick={() => setSelected(text.id)}
                >
                  <Text variant="body-light" color="green3" className="inline-flex items-center gap-1">
                    <IconImage size={6} nudge={0} src={PINTO.logoURI} />
                    <span>{text.text}</span>
                  </Text>
                </div>
                {index < info.length - 1 && (
                  <Separator
                    orientation="vertical"
                    className={cn("bg-pinto-gray-2 w-[1px] h-[42px]", selected && "bg-pinto-green-4")}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
      <div ref={ref} />
      {selected && flowCards[selected]?.upper && (
        <div className="absolute self-center bottom-[-60px] z-40">{flowCards[selected].upper}</div>
      )}
    </div>
  );
};

type SiloInfoProps = IContainerRef & {
  avgSiloYields: AverageBDVWeightedSiloAPYs | undefined;
};

const SiloInfo = ({ containerRef, avgSiloYields }: SiloInfoProps) => {
  const ref = useRef<HTMLDivElement>(null);
  useSetComponentPosition(ref, "silo-info", containerRef);
  const selected = useAtomValue(selectedAtom);

  const ema720 = avgSiloYields?.ema720 ?? 0;
  const ema168 = avgSiloYields?.ema168 ?? 0;
  const ema24 = avgSiloYields?.ema24 ?? 0;

  const stats: InlineStat[] = [
    {
      label: "24H:",
      value: ema24 ? formatter.pct(ema24 * 100) : "-",
    },
    {
      label: "7D:",
      value: ema168 ? formatter.pct(ema168 * 100) : "-",
    },
    {
      label: "30D:",
      value: ema720 ? formatter.pct(ema720 * 100) : "-",
    },
  ];

  return (
    <div className="relative flex flex-col items-center w-full">
      <div ref={ref} className="absolute top-[-28px]" />
      <Card className="flex flex-col w-full max-w-[600px] min-w-[300px] p-6 gap-8  h-full justify-between">
        <div className="flex flex-col w-full gap-1">
          <Text variant="h3">Silo</Text>
          <Text variant="body-light" color="light" className="inline-flex items-center gap-1 flex-wrap">
            Deposit in the Silo for{" "}
            <InlineFlex>
              <IconImage size={6} src={STALK.logoURI} /> Stalk
            </InlineFlex>{" "}
            and{" "}
            <InlineFlex>
              <IconImage size={6} src={SEEDS.logoURI} /> Seeds.
            </InlineFlex>
          </Text>
        </div>
        <Separator className="bg-pinto-gray-2 h-[1px]" />
        <Text color="light">Stalk entitles the holder to yield. Seed grows Stalk every hour.</Text>
        <InlineStats title="Variable APY:" stats={stats} />
        <Button asChild size="xxl" rounded="full" width="full">
          <Link to={`/silo`}>Deposit in the Silo</Link>
        </Button>
      </Card>
      {selected && <div className="absolute self-center top-[-120px] z-40">{flowCards[selected].silo}</div>}
    </div>
  );
};

const FieldInfo = ({ containerRef }: IContainerRef) => {
  const ref = useRef<HTMLDivElement>(null);
  useSetComponentPosition(ref, "field-info", containerRef);
  const selected = useAtomValue(selectedAtom);
  const isTablet = useIsTablet();

  const temperature = useTemperature();
  const soil = useTotalSoil();
  const podline = usePodLine();

  const stats = [
    {
      label: isTablet ? "Temp" : "Temperature",
      tooltip: "The current interest rate for Sowing Beans.",
      value: formatter.pct(temperature.max),
    },
    {
      label: "Soil",
      tooltip: "The number of Pinto that the protocol is willing to borrow.",
      value: formatter.noDec(soil),
    },
    {
      label: "Podline",
      tooltip: "The total number of Pods that are not yet redeemable.",
      value: numberAbbr(podline.toNumber()),
    },
  ];

  return (
    <div className="relative flex flex-col items-center w-full">
      <div ref={ref} className="absolute top-[-28px]" />
      <Card className="flex flex-col w-full max-w-[600px] min-w-[300px] p-6 gap-8 h-full justify-between">
        <div className="flex flex-col w-full gap-1">
          <Text variant="h3">Field</Text>
          <Text variant="body-light" color="light" className="inline-flex items-center gap-1 flex-wrap">
            Lend for{" "}
            <InlineFlex>
              <IconImage size={6} src={PODS.logoURI} /> Pods,
            </InlineFlex>{" "}
            the <span>Pinto</span> debt asset.
          </Text>
        </div>

        <Separator className="bg-pinto-gray-2 h-[1px]" />
        <Text color="light">Pods become redeemable for one Pinto each.</Text>
        <InlineStats title="Field Conditions:" stats={stats} />
        <Button asChild size="xxl" rounded="full" width="full" className="self-end">
          <Link to={`/field`}>Sow in the Field</Link>
        </Button>
      </Card>
      {selected && flowCards[selected]?.field ? (
        <div className="absolute top-[-120px] self-center z-40">{flowCards[selected].field}</div>
      ) : null}
    </div>
  );
};

interface Position {
  x: number;
  y: number;
}

const portalPositionsAtom = atomWithImmer<{ [key: string]: Position }>({});

function useSetComponentPosition(
  ref: React.RefObject<HTMLElement>,
  key: string,
  containerRef: React.RefObject<HTMLDivElement>,
) {
  const setPositions = useSetAtom(portalPositionsAtom);
  const updatePosition = useDebounceCallback(() => {
    if (ref.current && containerRef.current) {
      const rect = ref.current.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      setPositions((draft) => {
        draft[key] = {
          x: rect.left + rect.width / 2 - containerRect.left,
          y: rect.top + rect.height / 2 - containerRect.top,
        };
      });
    }
  }, 5);

  useEffect(() => {
    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition);
    };
  }, [updatePosition]);
}

interface SVGOverlayProps {
  targetIds: string[];
  sourceId: string;
  verticalLineHeight: number;
}

const SVGOverlay: React.FC<SVGOverlayProps> = ({ targetIds, sourceId, verticalLineHeight }) => {
  const [positions] = useAtom(portalPositionsAtom);

  const sourcePos = positions[sourceId];
  if (!sourcePos) return null;

  const splitY = sourcePos.y + verticalLineHeight;

  return (
    <svg className="pointer-events-none absolute top-0 left-0 w-full h-full" style={{ zIndex: 30 }}>
      <defs>
        <marker id="arrowhead" markerWidth="9" markerHeight="9" refX="4.5" refY="1.5">
          <polyline
            points="0.75 1.5, 4.5 6, 8.25 1.5"
            fill="none"
            stroke="#387F5C"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </marker>
      </defs>
      <path
        key="source-line"
        d={`M ${sourcePos.x},${sourcePos.y} V ${splitY}`}
        stroke="#387F5C"
        strokeWidth="2"
        strokeDasharray="2,2"
        fill="none"
      />
      {targetIds.map((targetId, index) => {
        const targetPos = positions[targetId];
        if (targetPos) {
          const pathData = `M ${sourcePos.x},${splitY} H ${targetPos.x} V ${targetPos.y}`;
          return (
            <path
              key={`target-line-${targetId}-${index.toString()}`}
              d={pathData}
              stroke="#387F5C"
              strokeWidth="2"
              strokeDasharray="2,2"
              fill="none"
              markerEnd="url(#arrowhead)" // Arrow pointing to the target
            />
          );
        }
        return null;
      })}
    </svg>
  );
};
