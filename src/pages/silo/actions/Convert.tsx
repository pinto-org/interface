import arrowDown from "@/assets/misc/ChevronDown.svg";
import { TokenValue } from "@/classes/TokenValue";
import { ComboInputField } from "@/components/ComboInputField";
import SlippageButton from "@/components/SlippageButton";
import TokenSelectWithBalances from "@/components/TokenSelectWithBalances";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/Dialog";
import IconImage from "@/components/ui/IconImage";
import { Label } from "@/components/ui/Label";
import Text from "@/components/ui/Text";
import { beanstalkAbi, beanstalkAddress, useReadSilo_GetAmountOut } from "@/generated/contractHooks";
import useFarmerDepositedBalances from "@/state/useFarmerDepositedBalances";
import { PoolData, usePriceData } from "@/state/usePriceData";
import { useSeedGauge } from "@/state/useSeedGauge";
import useTokenData from "@/state/useTokenData";
import { calculateConvertData, sortAndPickCrates } from "@/utils/convert";
import { stringEq } from "@/utils/string";
import { Token } from "@/utils/types";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { BaseError } from "viem";
import { useWriteContract } from "wagmi";
import { useChainId } from "wagmi";

interface BaseConvertProps {
  siloToken: Token;
}

// ------------------------------ DEFAULT CONVERT ------------------------------

function DefaultConvert() {
  const { siloToken, setTargetToken: setToToken, targetToken: toToken } = useConvertContext();
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
  const { siloToken, convertDestinations, targetToken, setTargetToken } = useConvertContext();

  const { data: farmerDeposits } = useFarmerDepositedBalances();
  const seedGauge = useSeedGauge();

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
        <ConvertTokenSelect />
      </div>
      <div className="flex flex-row gap-2">
        <Button type="button" rounded="some" className="w-full flex grow h-[3.75rem] text-[1.5rem]">
          Convert
        </Button>
      </div>
    </div>
  );
};

// ------------------------------ TOKEN SELECT ------------------------------

export interface IConvertTokenSelect {
  tokens: Token[];
  selectedToken: Token;
  subheader?: React.ReactNode;
  setToken: React.Dispatch<React.SetStateAction<Token>> | ((token: Token) => void);
}

const ConvertTokenSelect = () => {
  const { convertDestinations, targetToken } = useConvertContext();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          rounded="full"
          className="shadow-[0px_1px_8px_0px_#E9F0F6] border-[#E9F0F6] bg-white/100"
        >
          <div className="flex flex-row items-center gap-1">
            <IconImage src={targetToken.logoURI} size={6} />
            <Text variant="body-light">{targetToken.symbol}</Text>
            <IconImage src={arrowDown} size={3} alt={"open token select dialog"} />
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div className="flex flex-col gap-4">d</div>
      </DialogContent>
    </Dialog>
  );
};

// ------------------------------ CONTEXT ------------------------------

type ConvertType = "convert" | "pipeline-convert";

interface ConvertContext {
  targetToken: Token;
  siloToken: Token;
  convertType: ConvertType;
  convertDestinations: Token[];
  setTargetToken: (token: Token) => void;
}

const ConvertContext = createContext<ConvertContext | null>(null);

const useConvertContext = () => {
  const context = useContext(ConvertContext);
  if (!context) {
    throw new Error("useConvertContext must be used within a ConvertProvider");
  }
  return context;
};

const getConvertableTargets = (pools: PoolData[], siloToken: Token) => {};

const ConvertProvider = ({ children, siloToken }: { children: React.ReactNode; siloToken: Token }) => {
  const priceData = usePriceData();
  const tokenData = useTokenData();

  const pools = priceData.pools;

  const [allTargets, setAllTargets] = useState<Token[]>([]);
  const [convertType, setConvertType] = useState<ConvertType>("convert");
  const [targetToken, setTargetToken] = useState<Token>(
    siloToken.isMain
      ? tokenData.lpTokens[0] // change me to best convertable LP
      : tokenData.mainToken,
  );

  const convertDestinations = useMemo(
    () => [tokenData.mainToken, ...tokenData.lpTokens].filter((tk) => !stringEq(tk.address, siloToken.address)),
    [tokenData, siloToken],
  );

  const handleSetTargetToken = useCallback(
    (token: Token) => {
      setTargetToken(token);

      if (token.isLP && siloToken.isLP) {
        setConvertType("pipeline-convert");
      } else {
        setConvertType("convert");
      }
    },
    [siloToken],
  );

  return (
    <ConvertContext.Provider
      value={{ siloToken, convertDestinations, targetToken, convertType, setTargetToken: handleSetTargetToken }}
    >
      {children}
    </ConvertContext.Provider>
  );
};

// ------------------------------ COMPONENT ------------------------------

const ConvertSwitch = () => {
  const { convertType } = useConvertContext();

  if (convertType === "convert") {
    return <DefaultConvert />;
  }

  return <PipelineConvert />;
};

const Convert = ({ siloToken }: BaseConvertProps) => {
  return (
    <ConvertProvider siloToken={siloToken}>
      <ConvertSwitch />
    </ConvertProvider>
  );
};

export default Convert;
