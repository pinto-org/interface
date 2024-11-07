import arrowDown from "@/assets/misc/ChevronDown.svg";
import { TokenValue } from "@/classes/TokenValue";
import { TV } from "@/classes/TokenValue";
import { ComboInputField } from "@/components/ComboInputField";
import SlippageButton from "@/components/SlippageButton";
import TokenSelectWithBalances from "@/components/TokenSelectWithBalances";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/Dialog";
import IconImage from "@/components/ui/IconImage";
import { Label } from "@/components/ui/Label";
import { Separator } from "@/components/ui/Separator";
import Text from "@/components/ui/Text";
import VerticalAccordion from "@/components/ui/VerticalAccordion";
import { SEEDS } from "@/constants/internalTokens";
import { beanstalkAbi, beanstalkAddress, useReadSilo_GetAmountOut } from "@/generated/contractHooks";
import ConvertProvider, { SiloTokenConvertPath, useConvertState } from "@/state/context/convert.provider";
import useFarmerDepositedBalances from "@/state/useFarmerDepositedBalances";
import useTokenData from "@/state/useTokenData";
import { calculateConvertData, sortAndPickCrates } from "@/utils/convert";
import { formatter } from "@/utils/format";
import { stringEq } from "@/utils/string";
import { getTokenIndex, isProtocolToken } from "@/utils/token";
import { AddressMap, Token } from "@/utils/types";
import { useQueryClient } from "@tanstack/react-query";
import _ from "lodash";
import { toast } from "sonner";
import { BaseError } from "viem";
import { useReadContract, useWriteContract } from "wagmi";
import { useChainId } from "wagmi";

import { RightArrowIcon } from "@/components/Icons";
import { Button } from "@/components/ui/Button";
import Warning from "@/components/ui/Warning";
import { diamondABI } from "@/constants/abi/diamondABI";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { useTokenMap } from "@/hooks/pinto/useTokenMap";
import { useWellUnderlying } from "@/hooks/wells/wells";
import { cn } from "@/utils/utils";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

interface BaseConvertProps {
  siloToken: Token;
}

interface ConvertProps extends BaseConvertProps {
  farmerDepositMap: Map<Token, TokenValue>;
}

// ------------------------------ DEFAULT CONVERT ------------------------------

function DefaultConvert({ siloToken, farmerDepositMap }: ConvertProps) {
  const { targetToken } = useSiloConvertContext();
  const protocolAddress = useProtocolAddress();
  const chainId = useChainId();
  const tokenData = useTokenData();

  const [fromToken, setFromToken] = useState(siloToken);
  const [amountIn, setAmountIn] = useState("");
  const [slippage, setSlippage] = useState(0.1);

  const depositAmount = farmerDepositMap.get(siloToken);

  const queryClient = useQueryClient();
  const { data: farmerDeposits, queryKey: queryKey } = useFarmerDepositedBalances();

  const { data: maxConvert } = useReadContract({
    abi: diamondABI,
    address: protocolAddress,
    functionName: "getMaxAmountIn",
    args: [siloToken.address, targetToken.address],
  });

  const canExceedMax = depositAmount?.gt(maxConvert || 0n);

  const estimatedAmountOut =
    useReadSilo_GetAmountOut({
      args: [
        fromToken.address,
        targetToken.address,
        TokenValue.fromHuman(amountIn || 0, fromToken.decimals).toBigInt(),
      ],
      query: {
        enabled: !!amountIn && Number(amountIn) > 0,
      },
    }).data || 0n;

  const minAmountOut = TokenValue.fromBlockchain(estimatedAmountOut, targetToken.decimals).subSlippage(slippage);

  const { writeContractAsync } = useWriteContract({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey });
      },
    },
  });

  async function onSubmit() {
    const deposits = farmerDeposits.get(fromToken);

    if (!deposits) {
      throw new Error("No deposits found");
    }

    const depositCrates = sortAndPickCrates(
      "convert",
      TokenValue.fromHuman(amountIn, fromToken.decimals),
      deposits.deposits,
      targetToken,
    );

    const stems: bigint[] = depositCrates.crates.map((crate) => crate.stem.toBigInt());
    const amounts: bigint[] = depositCrates.crates.map((crate) => crate.amount.toBigInt());
    const convertData = calculateConvertData(
      fromToken,
      targetToken,
      TokenValue.fromHuman(amountIn, fromToken.decimals),
      minAmountOut,
    );

    if (convertData && stems && stems.length > 0 && amounts && amounts.length > 0) {
      const tx = () =>
        writeContractAsync({
          address: beanstalkAddress[chainId as keyof typeof beanstalkAddress],
          abi: beanstalkAbi,
          functionName: "convert",
          args: [convertData, stems, amounts],
        });

      toast.promise(tx, {
        loading: "Submitting transaction...",
        success: (_data) => {
          return `Transaction complete!`;
        },
        error: (error) => {
          return (error as BaseError).shortMessage || `Transaction failed.`;
        },
      });
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <div className="flex flex-row justify-between items-center">
          <Text variant="body-light" color="light">
            From
          </Text>
          <SlippageButton slippage={slippage} setSlippage={setSlippage} />
        </div>
        <ComboInputField
          amount={amountIn}
          setAmount={setAmountIn}
          setToken={setFromToken}
          selectedToken={fromToken}
          tokenAndBalanceMap={farmerDepositMap}
          disableButton
        />
      </div>
      {canExceedMax && (
        <Warning>
          {`Converting any more than ${formatter.number(maxConvert)} ${siloToken.symbol} will result in a loss of Stalk and Seed`}
        </Warning>
      )}
      <div className="flex flex-row justify-between">
        <Text variant="body-light" color="light">
          To
        </Text>
      </div>
      <div>
        <SiloConvertTokenSelect siloToken={siloToken} />
      </div>
      <div className="flex flex-row gap-2">
        <Button
          type="button"
          className="w-full flex grow h-[3.75rem] rounded-[0.75rem] text-[1.5rem]"
          onClick={onSubmit}
          disabled={!amountIn || !maxConvert || fromToken.address === targetToken.address}
        >
          Convert
        </Button>
      </div>
    </div>
  );
}

// ------------------------------ PIPELINE CONVERT ------------------------------

const PipelineConvert = ({ siloToken, farmerDepositMap }: ConvertProps) => {
  const { data: farmerDeposits } = useFarmerDepositedBalances();

  const farmerDeposit = useMemo(() => farmerDeposits.get(siloToken), [farmerDeposits, siloToken]);

  const [amountIn, setAmountIn] = useState("0");
  const [slippage, setSlippage] = useState(0.1);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="flex flex-row justify-between items-center">
          <Label>Amount</Label>
          <SlippageButton slippage={slippage} setSlippage={setSlippage} />
        </div>
        <ComboInputField
          amount={amountIn}
          setAmount={setAmountIn}
          setToken={() => {}}
          selectedToken={siloToken}
          tokenAndBalanceMap={farmerDepositMap}
          customMaxAmount={farmerDeposit?.convertibleAmount || TokenValue.ZERO}
          altText="Deposited Balance"
          mode="deposits"
          disableButton
        />
      </div>

      <div className="flex flex-row justify-between">
        <Label className="content-center">Convert to</Label>
        <SiloConvertTokenSelect siloToken={siloToken} />
      </div>
      <div className="flex flex-row gap-2">
        <Button type="button" rounded="some" className="w-full flex grow h-[3.75rem] text-[1.5rem]">
          Convert
        </Button>
      </div>
    </div>
  );
};

// ------------------------------ CONTEXT ------------------------------

interface ConvertContext {
  targetToken: Token;
  setTargetToken: React.Dispatch<React.SetStateAction<Token>>;
}

const ConvertContext = createContext<ConvertContext | null>(null);

const useSiloConvertContext = () => {
  const context = useContext(ConvertContext);
  if (!context) {
    throw new Error("useConvertContext must be used within a ConvertProvider");
  }
  return context;
};

const getDivorcedState = (paths: AddressMap<SiloTokenConvertPath>) => {
  const divorced = Object.values(paths).reduce<DivorcedConvertState>(
    (prev, path) => {
      if (path.enabled) {
        prev[path?.deltaSeedRewards.gte(0) ? "up" : "down"].push(path);
      }
      return prev;
    },
    { up: [], down: [] },
  );

  return divorced;
};

const SiloConvertProvider = ({ children, siloToken }: { children: React.ReactNode; siloToken: Token }) => {
  const { maxLPToken } = useConvertState();

  const tokenData = useTokenData();
  const [targetToken, setTargetToken] = useState<Token>(
    siloToken.isLP ? tokenData.mainToken : maxLPToken || tokenData.lpTokens[0],
  );

  return (
    <ConvertContext.Provider
      value={{
        targetToken,
        setTargetToken,
      }}
    >
      {children}
    </ConvertContext.Provider>
  );
};

// -----------------------------------------------------------------------
// ------------------------------ COMPONENT ------------------------------
// -----------------------------------------------------------------------

const ConvertSwitch = ({ siloToken }: BaseConvertProps) => {
  const { targetToken } = useSiloConvertContext();

  const { data: farmerDeposits, queryKey: queryKey } = useFarmerDepositedBalances();

  const depositMap = useMemo(() => {
    const farmerDepositData = farmerDeposits.get(siloToken);
    const map = new Map<Token, TokenValue>();

    if (farmerDepositData) {
      map.set(siloToken, farmerDepositData?.convertibleAmount);
    }

    return map;
  }, [farmerDeposits, siloToken]);

  if (siloToken.isLP && targetToken.isLP) {
    return <PipelineConvert siloToken={siloToken} farmerDepositMap={depositMap} />;
  }

  return <DefaultConvert siloToken={siloToken} farmerDepositMap={depositMap} />;
};

const Convert = ({ siloToken }: BaseConvertProps) => {
  return (
    <ConvertProvider>
      <SiloConvertProvider siloToken={siloToken}>
        <ConvertSwitch siloToken={siloToken} />
      </SiloConvertProvider>
    </ConvertProvider>
  );
};

export default Convert;

// ------------------------------ Token Select ------------------------------

interface DivorcedConvertState {
  up: SiloTokenConvertPath[];
  down: SiloTokenConvertPath[];
}

const SiloConvertTokenSelect = ({ siloToken }: BaseConvertProps) => {
  // Context
  const { convertState } = useConvertState();
  const { targetToken } = useSiloConvertContext();

  const { divorcedState, tokenConvertState } = useMemo(() => {
    const tokenState = convertState[getTokenIndex(siloToken)];

    return {
      tokenConvertState: tokenState,
      divorcedState: getDivorcedState(tokenState.paths),
    };
  }, [convertState, siloToken]);

  // Local State
  const [open, setOpen] = useState(false);
  const [showOtherTokens, setShowOtherTokens] = useState(false);

  // Handlers
  const handleOpenDialog = (toOpenState: boolean) => {
    setOpen(toOpenState);
    if (!toOpenState && showOtherTokens) {
      setShowOtherTokens(false);
    }
  };

  // Effects
  useEffect(() => {
    if (!open && showOtherTokens) {
      setShowOtherTokens(false);
    }
  }, [open, showOtherTokens]);

  return (
    <Dialog open={open} onOpenChange={handleOpenDialog}>
      <DialogTrigger asChild>
        <Button variant="outline-gray-shadow" size="xl" rounded="full">
          <div className="flex flex-row items-center gap-1">
            <IconImage src={targetToken.logoURI} size={6} />
            <Text variant="body-light">{targetToken.symbol}</Text>
            <IconImage src={arrowDown} size={3} alt={"open token select dialog"} />
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-dialog-600 min-w-dialog-600 gap-3 p-0">
        <div className="flex flex-col p-0">
          {/* Header */}
          <div className="flex flex-col p-6 gap-3">
            <DialogTitle>
              <DialogHeader>
                <Text variant="body">Select a token</Text>
              </DialogHeader>
            </DialogTitle>

            {/* Subheader */}
            <div className="flex flex-row justify-between">
              <Text variant="body-light" color="light" className="inline-flex items-center gap-1">
                Currently Deposited:
                <IconImage nudge={1} src={siloToken.logoURI} size={6} className="ml-1" />
                <Text as="span" variant="body-light" color="secondary">
                  {siloToken.name}
                </Text>
              </Text>
              <Text variant="h4" weight="light" className="inline-flex items-center gap-2">
                <IconImage nudge={1} src={SEEDS.logoURI} size={6} />
                {formatter.twoDec(tokenConvertState?.rewards.seeds)}
              </Text>
            </div>
          </div>
          <Separator />
          {/* Token list */}
          <div className="flex flex-col gap-2 p-2">
            {divorcedState.up.length ? (
              <RecommendedConverts paths={divorcedState.up} closeDialog={() => setOpen(false)} />
            ) : (
              <div className="flex flex-col h-[140px] sm:h-[240px] justify-center items-center">
                <Text variant="sm" color="light">
                  Converting to any other token from Pinto will result in a loss.
                </Text>
              </div>
            )}
            {divorcedState.down.length ? (
              <OtherConverts
                paths={divorcedState.down}
                open={showOtherTokens}
                onOpenChange={setShowOtherTokens}
                closeDialog={() => setOpen(false)}
              />
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const sortByPintoThenSeedsDesc = (a: SiloTokenConvertPath, b: SiloTokenConvertPath) => {
  if (isProtocolToken(a.token)) return -1;
  if (isProtocolToken(b.token)) return 1;
  return b.seedReward.toNumber() - a.seedReward.toNumber();
};

const OtherConverts = ({
  paths,
  open,
  onOpenChange,
  closeDialog,
}: {
  paths: DivorcedConvertState["down"];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  closeDialog: () => void;
}) => {
  return (
    <VerticalAccordion title="Show other tokens" open={open} onOpenChange={onOpenChange} marginOnOpen={true}>
      <ConvertFrameSection title="Other" paths={paths} closeDialog={closeDialog} />
    </VerticalAccordion>
  );
};

const RecommendedConverts = ({
  paths,
  closeDialog,
}: {
  paths: DivorcedConvertState["up"];
  closeDialog: () => void;
}) => {
  if (!paths.length) {
    <div className="flex flex-col h-[140px] sm:h-[240px] justify-center items-center">
      <Text variant="sm" color="light">
        Converting to any other token from Pinto will result in a loss.
      </Text>
    </div>;
  }

  return <ConvertFrameSection title="Recommended" paths={paths} closeDialog={closeDialog} />;
};

const ConvertFrameSection = ({
  title,
  paths,
  closeDialog,
}: {
  title: string;
  paths: SiloTokenConvertPath[];
  lastChildMb?: number;
  closeDialog: () => void;
}) => {
  return (
    <div className="flex flex-col w-full gap-2">
      <Text variant="sm" color="light" className="px-4 py-2">
        {title}
      </Text>
      {paths.map((path) => (
        <div key={`convert-select-row-${path.token.address.toLowerCase()}`}>
          <ConvertSelectRow path={path} closeDialog={closeDialog} />
        </div>
      ))}
    </div>
  );
};

const ConvertSelectRow = ({ path, closeDialog }: { path: SiloTokenConvertPath; closeDialog: () => void }) => {
  const { targetToken, setTargetToken } = useSiloConvertContext();
  const underlying = useWellUnderlying(path.token);
  const tokenMap = useTokenMap();

  const getConvertSelectRowDescription = () => {
    if (!underlying || underlying.length !== 2) return path.token.name;
    const underlyingTokens = underlying.map((t) => tokenMap[getTokenIndex(t)]);
    if (!underlyingTokens[0] || !underlyingTokens[1]) return path.token.name;

    return `${underlyingTokens.map((t) => t?.symbol).join(":")} Liquidity`;
  };

  const handleClick = () => {
    setTargetToken(path.token);
    closeDialog();
  };

  const positiveDelta = path.deltaSeedRewards.gt(0);

  return (
    <div
      className={cn(
        "flex flex-row box-border items-center justify-between p-4 cursor-pointer bg-white hover:bg-pinto-gray-1 rounded-xl",
        stringEq(targetToken.address, path.token.address) ? "bg-pinto-gray-1" : "",
      )}
      onClick={handleClick}
    >
      <div className="flex flex-row w-full items-center gap-4">
        <IconImage src={path.token.logoURI} size={12} />
        <div className="flex flex-col gap-1 items-start">
          <Text variant="body" color="secondary">
            {path.token.symbol}
          </Text>
          <Text variant="sm-light" color="light">
            {getConvertSelectRowDescription()}
          </Text>
        </div>
      </div>
      <div className="flex flex-col w-full self-end items-end">
        <Text variant="h4" weight="light" align="right" className="inline-flex items-center gap-2">
          <IconImage src={SEEDS.logoURI} nudge={1} size={6} />
          {formatter.twoDec(path.seedReward)}
        </Text>
        <Text
          variant="sm-light"
          color={positiveDelta ? "success" : "error"}
          align="right"
          className="inline-flex items-center self-end gap-1"
        >
          <div className={`${positiveDelta ? "-rotate-90" : "rotate-90"}`}>
            <RightArrowIcon width={14} height={14} color={positiveDelta ? "#00C767" : "#FF0000"} />
          </div>
          {formatter.twoDec(path.deltaSeedRewards.abs())}
        </Text>
      </div>
    </div>
  );
};
