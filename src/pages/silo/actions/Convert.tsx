import arrowDown from "@/assets/misc/ChevronDown.svg";
import { TokenValue } from "@/classes/TokenValue";
import { TV } from "@/classes/TokenValue";
import { ComboInputField } from "@/components/ComboInputField";
import SlippageButton from "@/components/SlippageButton";
import TokenSelectWithBalances from "@/components/TokenSelectWithBalances";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/Dialog";
import IconImage from "@/components/ui/IconImage";
import { Label } from "@/components/ui/Label";
import { Separator } from "@/components/ui/Separator";
import Text from "@/components/ui/Text";
import VerticalAccordion from "@/components/ui/VerticalAccordion";
import { SEEDS } from "@/constants/internalTokens";
import { beanstalkAbi, beanstalkAddress, useReadSilo_GetAmountOut } from "@/generated/contractHooks";
import ConvertProvider, {
  SiloTokenConvertPath,
  SiloTokenConvertState,
  useConvertState,
} from "@/state/context/convert.provider";
import useFarmerDepositedBalances from "@/state/useFarmerDepositedBalances";
import { usePriceData } from "@/state/usePriceData";
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
import { useWriteContract } from "wagmi";
import { useChainId } from "wagmi";

import { Button } from "@/components/ui/Button";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

interface BaseConvertProps {
  siloToken: Token;
}

// ------------------------------ DEFAULT CONVERT ------------------------------

function DefaultConvert() {
  const { siloToken, setTargetToken: setToToken, targetToken: toToken } = useSiloConvertContext();
  const chainId = useChainId();
  const tokenData = useTokenData();

  const convertDestinations = useMemo(
    () => [tokenData.mainToken, ...tokenData.lpTokens].filter((token) => !stringEq(token.address, siloToken.address)),
    [tokenData, siloToken],
  );

  const [fromToken, setFromToken] = useState(siloToken);
  const [amountIn, setAmountIn] = useState(0);
  const [slippage, setSlippage] = useState(0.1);

  const queryClient = useQueryClient();
  const { data: farmerDeposits, queryKey: queryKey } = useFarmerDepositedBalances();

  const sourceConvertData = useMemo(() => {
    const farmerDepositData = farmerDeposits.get(fromToken);
    const _sourceConvertData = new Map<Token, TokenValue>();

    if (farmerDepositData) {
      _sourceConvertData.set(siloToken, farmerDepositData?.convertibleAmount);
    }

    return _sourceConvertData;
  }, [farmerDeposits, fromToken, siloToken]);

  const convertTokens = useMemo(() => {
    const map = new Map<Token, TokenValue>();
    for (const convertDestination of convertDestinations) {
      const _depositData = farmerDeposits.get(convertDestination);
      map.set(convertDestination, _depositData ? _depositData.convertibleAmount : TokenValue.ZERO);
    }

    return map;
  }, [farmerDeposits, convertDestinations]);

  const estimatedAmountOut =
    useReadSilo_GetAmountOut({
      args: [fromToken.address, toToken.address, TokenValue.fromHuman(amountIn || 0, fromToken.decimals).toBigInt()],
      query: {
        enabled: !!amountIn && amountIn > 0,
      },
    }).data || 0n;

  const minAmountOut = TokenValue.fromBlockchain(estimatedAmountOut, toToken.decimals).subSlippage(slippage);

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
      toToken,
    );

    const stems: bigint[] = depositCrates.crates.map((crate) => crate.stem.toBigInt());
    const amounts: bigint[] = depositCrates.crates.map((crate) => crate.amount.toBigInt());
    const convertData = calculateConvertData(
      fromToken,
      toToken,
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
    <div className="flex flex-col gap-4">
      <div>
        <div className="flex flex-row justify-between items-center">
          <Label>Amount</Label>
          <SlippageButton slippage={slippage} setSlippage={setSlippage} />
        </div>
        <ComboInputField
          amount={amountIn}
          setAmount={setAmountIn}
          setToken={setFromToken}
          selectedToken={fromToken}
          tokenAndBalanceMap={sourceConvertData}
          disableButton
        />
      </div>
      <div className="flex flex-row justify-between">
        <Label className="content-center">Convert to</Label>
        <TokenSelectWithBalances setToken={setToToken} selectedToken={toToken} tokenAndBalanceMap={convertTokens} />
      </div>
      <div className="flex flex-row gap-2">
        <Button
          type="button"
          className="w-full flex grow h-[3.75rem] rounded-[0.75rem] text-[1.5rem]"
          onClick={onSubmit}
          disabled={fromToken.address === toToken.address}
        >
          Convert
        </Button>
      </div>
    </div>
  );
}

// ------------------------------ PIPELINE CONVERT ------------------------------

const PipelineConvert = () => {
  const { siloToken, allTargets, targetToken, setTargetToken } = useSiloConvertContext();

  const { data: farmerDeposits } = useFarmerDepositedBalances();

  const sourceConvertData = useMemo(() => {
    const farmerDepositData = farmerDeposits.get(siloToken);
    const _sourceConvertData = new Map<Token, TokenValue>();

    if (farmerDepositData) {
      _sourceConvertData.set(siloToken, farmerDepositData?.convertibleAmount);
    }

    return _sourceConvertData;
  }, [farmerDeposits, siloToken]);

  const farmerDeposit = useMemo(() => farmerDeposits.get(siloToken), [farmerDeposits, siloToken]);

  const [amountIn, setAmountIn] = useState(0);
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
          tokenAndBalanceMap={sourceConvertData}
          customMaxAmount={farmerDeposit?.convertibleAmount || TokenValue.ZERO}
          altText="Deposited Balance"
          mode="deposits"
          disableButton
        />
      </div>
      <div className="flex flex-row justify-between">
        <Label className="content-center">Convert to</Label>
        <SiloConvertTokenSelect />
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
  siloTokenConvertState: SiloTokenConvertState;
  siloToken: Token;
  allTargets: Token[];
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

const SiloConvertProvider = ({ children, siloToken }: { children: React.ReactNode; siloToken: Token }) => {
  const { getTargetTokens, maxLPToken, convertState } = useConvertState();

  const tokenData = useTokenData();
  const [targetToken, setTargetToken] = useState<Token>(
    siloToken.isMain ? maxLPToken || tokenData.lpTokens[0] : tokenData.mainToken,
  );

  const allTargets = useMemo(() => getTargetTokens(siloToken), [getTargetTokens, siloToken]);

  const tokenConvertState = useMemo(() => convertState[getTokenIndex(siloToken)], [convertState, siloToken]);

  return (
    <ConvertContext.Provider
      value={{
        siloTokenConvertState: tokenConvertState,
        siloToken,
        allTargets,
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

const ConvertSwitch = () => {
  const { siloToken, targetToken } = useSiloConvertContext();

  if (siloToken.isLP && targetToken.isLP) {
    return <PipelineConvert />;
  }

  return <DefaultConvert />;
};

const Convert = ({ siloToken }: BaseConvertProps) => {
  return (
    <ConvertProvider>
      <SiloConvertProvider siloToken={siloToken}>
        <ConvertSwitch />
      </SiloConvertProvider>
    </ConvertProvider>
  );
};

export default Convert;

// ------------------------------ Token Select ------------------------------

interface IConvertTokenSelect {
  tokens: Token[];
  selectedToken: Token;
  subheader?: React.ReactNode;
  setToken: React.Dispatch<React.SetStateAction<Token>> | ((token: Token) => void);
}
interface DivorcedConvertState {
  up: SiloTokenConvertPath[];
  down: SiloTokenConvertPath[];
}

interface IConvertFrame {
  title: string;
  price: TV;
  convertState: DivorcedConvertState;
}

const sortByPintoThenSeedsDesc = (a: SiloTokenConvertPath, b: SiloTokenConvertPath) => {
  if (isProtocolToken(a.token)) return -1;
  if (isProtocolToken(b.token)) return 1;
  return b.seedReward.toNumber() - a.seedReward.toNumber();
};

const ConvertFrame = ({ title, convertState }: IConvertFrame) => {};

const LPConvertFrame = ({ title, price, convertState: { up, down } }: IConvertFrame) => {
  const sorted = up.sort(sortByPintoThenSeedsDesc);
};

const getDivorcedState = (paths: AddressMap<SiloTokenConvertPath>) => {
  const divorced = Object.values(paths).reduce<DivorcedConvertState>(
    (prev, path) => {
      prev[path?.deltaSeedRewards.gte(0) ? "up" : "down"].push(path);
      return prev;
    },
    { up: [], down: [] },
  );

  return divorced;
};

const SiloConvertTokenSelect = () => {
  // Context
  const { siloToken, targetToken, siloTokenConvertState } = useSiloConvertContext();

  // Local STate
  const [open, setOpen] = useState(true);
  const [showOtherTokens, setShowOtherTokens] = useState(false);
  const [divorced, setDivorced] = useState<DivorcedConvertState>(getDivorcedState(siloTokenConvertState.paths));

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

  useEffect(() => {
    setDivorced(getDivorcedState(siloTokenConvertState.paths));
  }, [siloTokenConvertState.paths]);

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
        <div className="flex flex-col gap-6 p-6">
          {/* Header */}
          <DialogHeader>
            <Text variant="body">Select a token</Text>
          </DialogHeader>
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
              {formatter.twoDec(siloTokenConvertState?.rewards.seeds)}
            </Text>
          </div>
          <Separator />
          {/* Token list */}
          <div className="flex flex-col">
            {divorced.up.length ? (
              <div>asdf</div>
            ) : (
              <div className="flex flex-col h-[140px] sm:h-[240px] justify-center items-center">
                <Text variant="sm" color="light">
                  Converting to any other token from Pinto will result in a loss.
                </Text>
              </div>
            )}
            {/* <VerticalAccordion title="Show other tokens" open={showOtherTokens} onOpenChange={setShowOtherTokens}>
              
            </VerticalAccordion> */}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
