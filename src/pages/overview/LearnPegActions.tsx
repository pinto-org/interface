import { TV } from "@/classes/TokenValue";
import InlineStats from "@/components/InlineStats";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import GradientCard from "@/components/ui/GradientCard";
import IconImage from "@/components/ui/IconImage";
import PageContainer from "@/components/ui/PageContainer";
import Text from "@/components/ui/Text";
import { PODS } from "@/constants/internalTokens";
import { PINTO } from "@/constants/tokens";
import useFarmerStatus from "@/hooks/useFarmerStatus";
import { usePodLine, useTemperature, useTotalSoil } from "@/state/useFieldData";
import { usePriceQuery } from "@/state/usePriceData";
import { useSiloData } from "@/state/useSiloData";
import useTokenData from "@/state/useTokenData";
import { formatter, numberAbbr } from "@/utils/format";
import { useDebounceCallback } from "@/utils/useDebounce";
import { cn } from "@/utils/utils";
import { Separator } from "@radix-ui/react-separator";
import { useQuery } from "@tanstack/react-query";
import { useModal } from "connectkit";
import { atom, useAtom, useSetAtom } from "jotai";
import { atomWithImmer } from "jotai-immer";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

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
      <Text variant="body-light" color="green4">
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

type Selected = "silo" | "field";
const targetIds = ["silo-info", "field-info"];

const selectedAtom = atom<Selected | undefined>(undefined);

const NewUserView = () => {
  const setSelected = useSetAtom(selectedAtom);
  const containerRef = useRef<HTMLDivElement>(null);
  const farmerStatus = useFarmerStatus();
  const siloData = useSiloData();
  const price = usePriceQuery();

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
              <div className="mt-[232px] flex flex-row gap-[140px] w-full ">
                <SiloInfo containerRef={containerRef} siloData={siloData} />
                <FieldInfo containerRef={containerRef} />
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
      <SVGOverlay targetIds={targetIds} sourceId="peg-state" verticalLineHeight={110} />
    </div>
  );
};

export default NewUserView;

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
    </div>
  );
};

const SiloInfo = ({ containerRef, siloData }: IContainerRef & { siloData: ReturnType<typeof useSiloData> }) => {
  const ref = useRef<HTMLDivElement>(null);
  useSetComponentPosition(ref, "silo-info", containerRef);

  const apyQuery = useQuery({
    queryKey: ["silo-yields", "apy"],
    queryFn: async () => {
      const res = await fetch("https://api.bean.money/silo/yield", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    },
    select: (data) => {
      console.log(data);
      const apy = {
        "720": TV.fromBlockchain(data.ema[720].beansPerSeason.toString(), 6),
        "168": TV.fromBlockchain(data.ema[168].beansPerSeason.toString(), 6),
        "24": TV.fromBlockchain(data.ema[24].beansPerSeason.toString(), 6),
      };
      return apy;
    },
  });

  const yields = useMemo(() => {
    if (!apyQuery.data) return undefined;

    // const siloYields = siloData.yields;
  }, []);

  return (
    <div className="relative flex flex-col items-center w-full">
      <div ref={ref} className="absolute top-[-28px]" />
      <Card className="flex flex-col w-full max-w-[600px] min-w-[300px] p-6">
        <Text>Silo</Text>
        <CardContent>
          <Text color="gray4">Deposit in the Silo for Stalk and Seed</Text>
        </CardContent>
      </Card>
    </div>
  );
};

const FieldInfo = ({ containerRef }: IContainerRef) => {
  const ref = useRef<HTMLDivElement>(null);
  useSetComponentPosition(ref, "field-info", containerRef);

  const temperature = useTemperature();
  const soil = useTotalSoil();
  const podline = usePodLine();

  const fieldStats = [
    {
      label: "Temperature",
      tooltip: "The current interest rate for Sowing Beans.",
      value: formatter.noDec(temperature.max),
    },
    {
      label: "Soil",
      tooltip: "The number of PINTO that the protocol is willing to borrow.",
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
      <Card className="flex flex-col w-full max-w-[600px] min-w-[300px] p-6">
        <Text variant="h3" className="pb-1">
          Field
        </Text>
        <Text variant="body-light" color="light" className="inline-flex items-center gap-1">
          Lend for <IconImage size={6} src={PODS.logoURI} /> Pods, the Pinto debt asset.
        </Text>
        <div className="flex flex-col w-full pt-6 gap-8">
          <Separator className="bg-pinto-gray-2 h-[1px]" />
          <Text color="gray4">Pods become redeemable for one Pinto each.</Text>
        </div>
        <InlineStats title="Field Stats" stats={fieldStats} />
      </Card>
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
        strokeDasharray="3,3"
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
              strokeDasharray="3,3"
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
