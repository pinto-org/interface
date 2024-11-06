import arrowDown from "@/assets/misc/ChevronDown.svg";
import { TokenValue } from "@/classes/TokenValue";
import { ComboInputField } from "@/components/ComboInputField";
import SlippageButton from "@/components/SlippageButton";
import TokenSelectWithBalances from "@/components/TokenSelectWithBalances";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import IconImage from "@/components/ui/IconImage";
import { Label } from "@/components/ui/Label";
import { Separator } from "@/components/ui/Separator";
import Text from "@/components/ui/Text";
import VerticalAccordion from "@/components/ui/VerticalAccordion";
import { SEEDS } from "@/constants/internalTokens";
import { beanstalkAbi, beanstalkAddress, useReadSilo_GetAmountOut } from "@/generated/contractHooks";
import useFarmerDepositedBalances from "@/state/useFarmerDepositedBalances";
import { PoolData, usePriceData } from "@/state/usePriceData";
import { useSeedGauge } from "@/state/useSeedGauge";
import { useSiloData } from "@/state/useSiloData";
import useTokenData from "@/state/useTokenData";
import { calculateConvertData, sortAndPickCrates } from "@/utils/convert";
import { formatter } from "@/utils/format";
import { stringEq } from "@/utils/string";
import { getTokenIndex } from "@/utils/token";
import { AddressMap, SiloTokenData, Token } from "@/utils/types";
import { useQueryClient } from "@tanstack/react-query";
import _ from "lodash";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import React from "react";
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
  const { siloToken, allTargets, targetToken, setTargetToken } = useConvertContext();

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

interface IConvertTokenSelectRow {
  token: Token;
  seedReward: TokenValue;
  deltaSeedReward: TokenValue;
}

interface ConvertableTokensState {
  up: IConvertTokenSelectRow[];
  down: IConvertTokenSelectRow[];
}

const ConvertTokenSelect = () => {
  const { siloToken, allTargets, targetToken, wlTokenData } = useConvertContext();
  const tokenData = useTokenData();
  const [open, setOpen] = useState(true);
  const [showOtherTokens, setShowOtherTokens] = useState(false);

  const handleOpenDialog = (toOpenState: boolean) => {
    setOpen(toOpenState);
    if (!toOpenState && showOtherTokens) {
      setShowOtherTokens(false);
    }
  };

  const pintoSelected = stringEq(targetToken.address, tokenData.mainToken.address);

  const siloTokenSeedRewards = wlTokenData[getTokenIndex(siloToken)]?.silo.rewards.seeds;

  const rows = allTargets.reduce<ConvertableTokensState>(
    (prev, token) => {
      const tokenSilo = wlTokenData[getTokenIndex(token)].silo;
      const seedReward = tokenSilo.rewards.seeds;

      const deltaSeedReward = seedReward.sub(siloTokenSeedRewards);

      const row: IConvertTokenSelectRow = {
        token,
        seedReward,
        deltaSeedReward,
      };

      prev[deltaSeedReward.gte(0) ? "up" : "down"].push(row);

      return prev;
    },
    { up: [], down: [] },
  );

  useEffect(() => {
    if (!open && showOtherTokens) {
      setShowOtherTokens(false);
    }
  }, [open, showOtherTokens]);

  const NonLP2LP = () => {
    return <div>asdf</div>;
  };

  const WhitelistedLPToOther = () => {};

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
        {/* Header */}
        <div className="flex flex-col gap-6 p-6">
          <DialogHeader>
            <Text variant="body">Select a token</Text>
          </DialogHeader>
          <div className="flex flex-col gap-6">
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
                {formatter.twoDec(siloTokenSeedRewards)}
              </Text>
            </div>
          </div>
          <Separator />
          {/* Token list */}
          <div className="flex flex-col">
            <VerticalAccordion title="Show other tokens" open={showOtherTokens} onOpenChange={setShowOtherTokens}>
              <div className="flex flex-col h-[140px] sm:h-[240px] justify-center items-center">
                <Text variant="sm" color="light">
                  Converting to any other token from Pinto will result in a loss.
                </Text>
              </div>
            </VerticalAccordion>

            {/* {!!rows.up.length ? (
              <div>asdf</div>
            ) : (
              <div className="flex flex-col h-[140px] sm:h-[240px] justify-center items-center">
                <Text variant="sm" color="light">
                  Converting to any other token from Pinto will result in a loss.
                </Text>
              </div>
            )} */}
          </div>
        </div>
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
  allTargets: Token[];
  wlTokenData: AddressMap<{ silo: SiloTokenData; pool?: PoolData }>;
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

const ConvertProvider = ({ children, siloToken }: { children: React.ReactNode; siloToken: Token }) => {
  const priceData = usePriceData();
  const tokenData = useTokenData();
  const siloData = useSiloData();

  const pools = priceData.pools;

  const [convertType, setConvertType] = useState<ConvertType>("convert");
  const [targetToken, setTargetToken] = useState<Token>(
    siloToken.isMain
      ? tokenData.lpTokens[0] // change me to best convertable LP
      : tokenData.mainToken,
  );

  const { allTargets, wlTokenData } = useMemo(() => {
    const all = [tokenData.mainToken, ...tokenData.lpTokens];
    const filteredTargets = all.filter((tk) => !stringEq(tk.address, siloToken.address));

    const poolMap = _.keyBy(pools, (pool) => getTokenIndex(pool.pool));

    const targetsData = all.reduce<AddressMap<{ silo: SiloTokenData; pool?: PoolData }>>((prev, token) => {
      const siloTokenData = siloData.tokenData.get(token);
      const tokenIndex = getTokenIndex(token);
      const siloTokenPoolData = poolMap[tokenIndex];

      // Filter out whitelisted tokens that we cannot convert to
      if (siloTokenData?.depositedBDV.gt(0)) {
        prev[tokenIndex] = {
          silo: siloTokenData,
          pool: siloTokenPoolData,
        };
      }

      return prev;
    }, {});

    const bySeedRewardsDesc = filteredTargets.sort((a, b) => {
      const aData = targetsData[getTokenIndex(a)];
      const bData = targetsData[getTokenIndex(b)];
      return bData.silo.rewards.seeds.toNumber() - aData.silo.rewards.seeds.toNumber();
    });

    return {
      wlTokenData: targetsData,
      allTargets: bySeedRewardsDesc,
    };
  }, [tokenData, siloToken, pools, siloData]);

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
      value={{
        siloToken,
        allTargets,
        wlTokenData,
        targetToken,
        convertType,
        setTargetToken: handleSetTargetToken,
      }}
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
