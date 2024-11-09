import arrowDown from "@/assets/misc/ChevronDown.svg";
import { TV } from "@/classes/TokenValue";
import { ComboInputField } from "@/components/ComboInputField";
import { RightArrowIcon } from "@/components/Icons";
import OutputDisplay from "@/components/OutputDisplay";
import SlippageButton from "@/components/SlippageButton";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/Dialog";
import IconImage from "@/components/ui/IconImage";
import { Label } from "@/components/ui/Label";
import { Separator } from "@/components/ui/Separator";
import Text from "@/components/ui/Text";
import VerticalAccordion from "@/components/ui/VerticalAccordion";
import Warning from "@/components/ui/Warning";
import { basinWellABI } from "@/constants/abi/basinWellABI";
import { diamondABI } from "@/constants/abi/diamondABI";
import { SEEDS, STALK } from "@/constants/internalTokens";
import { PINTOcbBTC } from "@/constants/tokens";
import { useReadSilo_GetAmountOut } from "@/generated/contractHooks";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { useTokenMap } from "@/hooks/pinto/useTokenMap";
import { useWell, useWellUnderlying } from "@/hooks/wells/wells";
import { PipelineConvert as GenConvert } from "@/lib/PipelineConvert/PipelineConvert";
import { ZeroX } from "@/lib/matcha/ZeroX";
import ConvertProvider, { SiloTokenConvertPath, useConvertState } from "@/state/context/convert.provider";
import useFarmerDepositedBalances from "@/state/useFarmerDepositedBalances";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { PoolData, usePriceData } from "@/state/usePriceData";
import { useSiloData } from "@/state/useSiloData";
import useTokenData from "@/state/useTokenData";
import { bigIntGt } from "@/utils/bigint";
import { useResolvedChainId } from "@/utils/chain";
import { ConvertDetails, calculateConvert, calculateConvertData, sortAndPickCrates } from "@/utils/convert";
import { formatter } from "@/utils/format";
import { stringEq, stringToNumber } from "@/utils/string";
import { getTokenIndex, isProtocolToken } from "@/utils/token";
import { AddressMap, Token } from "@/utils/types";
import { useDebounceValue, useDebouncedEffect } from "@/utils/useDebounce";
import { cn, noop } from "@/utils/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import {
  useAccount,
  useConfig,
  useReadContract,
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

interface BaseConvertProps {
  siloToken: Token;
}

interface ConvertProps extends BaseConvertProps {
  farmerDepositMap: Map<Token, TV>;
  queryClient: ReturnType<typeof useQueryClient>;
  farmerDeposits: ReturnType<typeof useFarmerDepositedBalances>["data"];
  tokenPrices: ReturnType<typeof usePriceData>["tokenPrices"];
  siloTokenData: ReturnType<typeof useSiloData>["tokenData"];
  onSuccess: () => void;
}

// ------------------------------ DEFAULT CONVERT ------------------------------

const selectMaxConvert = (value: bigint, token: Token) => {
  return TV.fromBlockchain(value, token.decimals);
};

const DEBOUNCE_MS = 150;

interface DefaultConvertProps extends ConvertProps {
  sourceWell: PoolData | undefined;
  targetWell: PoolData | undefined;
}

function DefaultConvert({
  siloToken,
  farmerDepositMap,
  farmerDeposits,
  queryClient,
  sourceWell,
  targetWell,
  tokenPrices,
  siloTokenData,
  onSuccess,
}: DefaultConvertProps) {
  const { targetToken } = useSiloConvertContext();

  const protocolAddress = useProtocolAddress();
  const account = useAccount();

  const [convertData, setConvertData] = useState<ConvertDetails | undefined>(undefined);
  const [amountIn, setAmountIn] = useState("0");
  const [slippage, setSlippage] = useState(0.1);

  const { data: maxConvert = TV.ZERO, ...maxConvertQuery } = useReadContract({
    abi: diamondABI,
    address: protocolAddress,
    functionName: "getMaxAmountIn",
    args: [siloToken.address, targetToken.address],
    query: {
      enabled: !!account.address,
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      select: (max) => selectMaxConvert(max ?? 0n, siloToken),
    },
  });

  const convertCapacity = useReadContract({
    abi: diamondABI,
    address: protocolAddress,
    functionName: "getOverallConvertCapacity",
    args: [],
  });

  const wellConvertCapacity = useReadContract({
    abi: diamondABI,
    address: protocolAddress,
    functionName: "getWellConvertCapacity",
    args: [siloToken.isMain ? targetToken.address : siloToken.address],
  });

  useEffect(() => {
    if (convertCapacity.data) {
      console.log("convertCapacity: ", TV.fromBlockchain(convertCapacity.data, 6).toNumber());
    }
  }, [convertCapacity.data]);

  useEffect(() => {
    if (wellConvertCapacity.data) {
      console.log("wellConvertCapacity: ", TV.fromBlockchain(wellConvertCapacity.data, 6).toNumber());
    }
  }, [wellConvertCapacity.data]);

  const debouncedAmountIn = useDebounceValue(amountIn, DEBOUNCE_MS);
  const { data: minAmountOut = TV.ZERO, ...estimateQuery } = useReadSilo_GetAmountOut({
    args: [
      siloToken.address,
      targetToken.address,
      BigInt(TV.fromHuman(debouncedAmountIn || 0, siloToken.decimals).blockchainString),
    ],
    query: {
      enabled: !!amountIn && Number(amountIn) > 0 && !!account.address,
      select: (estAmountOut) => {
        return TV.fromBlockchain(estAmountOut ?? 0n, targetToken.decimals).subSlippage(slippage);
      },
    },
  });

  const { data: hash, writeContractAsync } = useWriteContract();

  const {
    data: receipt,
    isSuccess: isConfirmed,
    isLoading: isConfirming,
    error: receiptError,
    failureReason,
  } = useWaitForTransactionReceipt({
    hash,
    query: {
      enabled: !!hash,
    },
  });

  useEffect(() => {
    if (receipt && isConfirmed) {
      toast.dismiss();
      queryClient.invalidateQueries({ queryKey: maxConvertQuery.queryKey });
      queryClient.invalidateQueries({ queryKey: estimateQuery.queryKey });
      onSuccess();
      setAmountIn("0");
    }
  }, [receipt, isConfirmed, failureReason, receiptError]);

  useEffect(() => {
    if (receiptError) {
      toast.dismiss();
      console.log("receipt: ", receiptError);
      toast.error(receiptError instanceof Error ? receiptError?.message : "Transaction failed.");
    }
  }, [receiptError]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Reset amount in when target token changes
  useEffect(() => {
    setAmountIn("0");
  }, [targetToken]);

  useDebouncedEffect(
    () => {
      if (stringToNumber(amountIn) > 0) {
        setConvertData(
          calculateConvert(
            siloToken,
            targetToken,
            TV.fromHuman(amountIn, siloToken.decimals),
            farmerDeposits?.get(siloToken)?.convertibleDeposits || [],
            siloTokenData,
          ),
        );
      } else {
        setConvertData(undefined);
      }
    },
    [amountIn],
    DEBOUNCE_MS,
  );

  const onSubmit = async () => {
    try {
      const deposits = farmerDeposits.get(siloToken);

      if (!account.address) throw new Error("Signer required");
      if (!deposits) throw new Error("No deposits found");

      toast.loading("Submitting transaction...");

      const depositCrates = sortAndPickCrates(
        "convert",
        TV.fromHuman(amountIn, siloToken.decimals),
        deposits.convertibleDeposits,
        targetToken,
      );

      const stems: bigint[] = depositCrates.crates.map((crate) => crate.stem.toBigInt());
      const amounts: bigint[] = depositCrates.crates.map((crate) => crate.amount.toBigInt());

      const convertData = calculateConvertData(
        siloToken,
        targetToken,
        TV.fromHuman(amountIn, siloToken.decimals),
        minAmountOut,
      );

      if (!convertData || !stems.length || !amounts.length) {
        throw new Error("Invalid convert data");
      }

      await writeContractAsync({
        address: protocolAddress,
        abi: diamondABI,
        functionName: "convert",
        args: [convertData, stems, amounts],
      });
    } catch (e) {
      console.error(e);
      toast.dismiss();
      toast.error(e instanceof Error ? e.message : "Transaction failed.");
      return e;
    }
  };

  const getConvertWarning = () => {
    const lowerOrGreater = targetToken.isLP ? "greater" : "less";
    const well = siloToken.isLP ? sourceWell : targetWell;
    const wellSymbol = well?.pool.symbol;
    const message = `${siloToken.symbol} can only be Converted to ${targetToken.symbol} when deltaB in the ${wellSymbol} WELL is ${lowerOrGreater} than 0.`;
    return message;
  };

  const getMaxConvertWarning = () => {
    const maxConvertFormatted = formatter.number(maxConvert, {
      minDecimals: 2,
      maxDecimals: warningMessageDecimals,
      minValue: 0.000001,
    });
    return `Converting any more than ${maxConvertFormatted} ${siloToken.symbol} will result in a loss of Stalk and Seed`;
  };

  const warningMessageDecimals = maxConvert.gt(0) ? 2 : 6;
  const farmerConvertibleAmount = farmerDepositMap.get(siloToken);
  const canConvert = maxConvert.gt(0);
  const canExceedMax = farmerConvertibleAmount?.gt(maxConvert);

  const disabled =
    !stringToNumber(amountIn) ||
    stringEq(siloToken.address, targetToken.address) ||
    maxConvert?.lte(0) ||
    minAmountOut.lte(0) ||
    !account.address ||
    !convertData ||
    isConfirming;

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
          disableInput={!canConvert || !account.address || !farmerConvertibleAmount?.gt(0)}
          amount={amountIn}
          setToken={noop}
          customMaxAmount={maxConvert}
          setAmount={setAmountIn}
          selectedToken={siloToken}
          tokenAndBalanceMap={farmerDepositMap}
          altText="Deposited Balance:"
          mode="balance"
          disableButton
        />
      </div>
      {!canConvert || canExceedMax ? (
        <Warning>{!canConvert ? getConvertWarning() : getMaxConvertWarning()}</Warning>
      ) : null}
      <ConvertTokenOutput amount={minAmountOut} siloToken={siloToken} targetToken={targetToken} prices={tokenPrices} />
      {convertData ? (
        <OutputDisplay title="I receive">
          <OutputDisplay.Item label="Amount">
            <OutputDisplay.Value
              value={formatAmountOut(minAmountOut, targetToken)}
              token={targetToken}
              suffix={targetToken.symbol}
            />
          </OutputDisplay.Item>
          <OutputDisplay.Item label="Stalk">
            <OutputDisplay.Value
              value={formatter.twoDec(convertData.stalk)}
              suffix="Stalk"
              delta={convertData?.stalk.toNumber()}
              token={STALK}
              showArrow
            />
          </OutputDisplay.Item>
          <OutputDisplay.Item label="Seed">
            <OutputDisplay.Value
              value={formatter.twoDec(convertData.seeds)}
              suffix="Seed"
              delta={convertData.seeds.toNumber()}
              token={SEEDS}
              showArrow
            />
          </OutputDisplay.Item>
        </OutputDisplay>
      ) : null}
      <div className="flex flex-row gap-2">
        <Button type="button" rounded="full" width="full" size="xxl" onClick={onSubmit} disabled={disabled}>
          Convert
        </Button>
      </div>
    </div>
  );
}

// ------------------------------ PIPELINE CONVERT ------------------------------

interface PipelineConvertProps extends ConvertProps {
  pools: ReturnType<typeof usePriceData>["pools"];
  sourceWell: PoolData;
  targetWell: PoolData;
}

const genConvert = new GenConvert();

const PipelineConvert = ({
  siloToken,
  farmerDepositMap,
  farmerDeposits,
  queryClient,
  sourceWell,
  targetWell,
  tokenPrices,
  siloTokenData,
  pools,
  onSuccess,
}: PipelineConvertProps) => {
  const { targetToken } = useSiloConvertContext();
  const account = useAccount();
  const protocolAddress = useProtocolAddress();

  const [amountIn, setAmountIn] = useState("0");
  const [slippage, setSlippage] = useState(0.1);
  const config = useConfig();
  const chainId = useResolvedChainId();

  // siloToken: Token,
  // targetToken: Token,
  // pools: ReturnType<typeof usePriceData>["pools"],
  // farmerDeposits: ReturnType<typeof useFarmerDepositedBalances>["data"],
  // sourceWell: ReturnType<typeof useWell>,
  // targetWell: ReturnType<typeof useWell>,

  // useFarmerPipelineConvertMax(siloToken, targetToken, pools, farmerDeposits, sourceWell, targetWell);

  const debouncedAmountIn = useDebounceValue(amountIn, DEBOUNCE_MS);

  const convertibleDeposits = farmerDeposits?.get(siloToken)?.convertibleDeposits;

  const convertCapacity = useReadContract({
    abi: diamondABI,
    address: protocolAddress,
    functionName: "getOverallConvertCapacity",
    args: [],
  });

  const sourceConvertCapacity = useReadContract({
    abi: diamondABI,
    address: protocolAddress,
    functionName: "getWellConvertCapacity",
    args: [siloToken.address],
  });

  const targetConvertCapacity = useReadContract({
    abi: diamondABI,
    address: protocolAddress,
    functionName: "getWellConvertCapacity",
    args: [targetToken.address],
  });

  // decodePipeStuff();`

  useEffect(() => {
    if (convertCapacity.data) {
      console.log("convertCapacity: ", TV.fromBlockchain(convertCapacity.data, 6).toNumber());
    }
  }, [convertCapacity.data]);

  useEffect(() => {
    if (sourceConvertCapacity.data) {
      console.log("sourceConvertCapacity: ", TV.fromBlockchain(sourceConvertCapacity.data, 6).toNumber());
    }
  }, [sourceConvertCapacity.data]);

  useEffect(() => {
    if (targetConvertCapacity.data) {
      console.log("targetConvertCapacity: ", TV.fromBlockchain(targetConvertCapacity.data, 6).toNumber());
    }
  }, [targetConvertCapacity.data]);

  // const maxConvOut = useFarmerPipelineConvertMax(siloToken, targetToken, pools, farmerDeposits, sourceWell, targetWell);
  const { data, isLoading } = useQuery({
    queryKey: ["pipeline-convert", chainId, account.address, siloToken.address, targetToken.address, debouncedAmountIn],
    queryFn: async () => {
      if (!account.address || !convertibleDeposits?.length || stringToNumber(debouncedAmountIn) <= 0) return;
      if (!sourceWell || !targetWell) return;

      console.log("famerDeposits: ", farmerDeposits);

      console.log("convertibleDeposits: ", convertibleDeposits);

      const res = await genConvert
        .fetchEq2Eq(
          sourceWell,
          targetWell,
          convertibleDeposits,
          TV.fromHuman(debouncedAmountIn, siloToken.decimals),
          slippage / 100,
          slippage,
          siloTokenData,
        )
        .catch((e) => {
          console.error("Error fetching pipeline convert: ", e);
          return GenConvert.getEmptyResult();
        });

      return res;
    },
    enabled: !!account.address && !!convertibleDeposits?.length && stringToNumber(debouncedAmountIn) > 0,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 20, // 20 seconds
  });

  const simQuery2 = useSimulateContract({
    address: protocolAddress,
    abi: diamondABI,
    functionName: "advancedFarm",
    args: [data?.encoded ?? []],
    chainId: 1337,
    account: account.address,
    blockTag: "latest",
    query: {
      enabled: !!data?.encoded.length && stringToNumber(debouncedAmountIn) > 0 && !!account.address,
    },
  });

  useEffect(() => {
    console.log("simQuery2 loading: ", simQuery2.isLoading);
    console.log("simQuery2: ", simQuery2.data);
    console.log("simQuery2 error: ", simQuery2.error);
  }, [simQuery2.isLoading, simQuery2.data, simQuery2.error]);

  // const simQuery = useQuery({
  //   queryKey: ["pipe-convert-sim", data?.encoded],
  //   queryFn: async () => {
  //     if (!data?.encoded.length) return;
  //     console.log("data: ", data);
  //     console.log("simulating pipeline convert");
  //     const res = await simulateContract(config.getClient(), {
  //       address: protocolAddress,
  //       abi: diamondABI,
  //       functionName: "advancedFarm",
  //       args: [data?.encoded],
  //     }).catch((e) => {
  //       console.error("Error simulating pipeline convert: ", e);
  //       return 123;
  //     });

  //     console.log("simQuery res: ", res);

  //     return res;
  //   },
  //   enabled: !!data?.encoded.length && stringToNumber(debouncedAmountIn) > 0 && data?.amountOut.gt(0),
  // });

  // const simulated = useSimulateContract({
  //   address: protocolAddress,
  //   abi: diamondABI,
  //   functionName: "advancedFarm",
  //   args: [args],
  //   query: {
  //     enabled: !!(data?.encoded.length || 0 > 1000),
  //   },
  // });

  // decodePipeStuff();
  // const simulated = useSimulateContract({
  //   address: protocolAddress,
  //   abi: diamondABI,
  //   functionName: "advancedFarm",
  //   args: [data?.encoded ?? []],
  //   query: {
  //     enabled: !!data?.encoded.length && stringToNumber(debouncedAmountIn) > 0 && data?.amountOut.gt(0),
  //   },
  // });

  // console.log("loading: ", simulated.isLoading);
  // console.log("simulated data: ", simulated.data);
  // console.log("simulated.error: ", simulated.error);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="flex flex-row justify-between items-center">
          <Label>Amount</Label>
          <SlippageButton slippage={slippage} setSlippage={setSlippage} />
        </div>
        <ComboInputField
          amount={amountIn}
          setToken={noop}
          setAmount={setAmountIn}
          selectedToken={siloToken}
          tokenAndBalanceMap={farmerDepositMap}
          altText="Deposited Balance:"
          mode="balance"
          disableButton
        />
      </div>
      <ConvertTokenOutput
        amount={TV.ZERO} // fix me
        siloToken={siloToken}
        targetToken={targetToken}
        prices={tokenPrices}
      />
      <div className="flex flex-row gap-2">
        <Button type="button" rounded="some" className="w-full flex grow h-[3.75rem] text-[1.5rem]">
          Gen Convert
        </Button>
      </div>
    </div>
  );
};

// ------------------------------ CONTEXT ------------------------------

interface ConvertContext {
  targetToken: Token;
  mode?: string;
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

const useConvertUrlSearchParams = () => {
  const tokenMap = useTokenMap();
  const [params] = useSearchParams();

  const [token, setToken] = useState<Token | undefined>(undefined);
  const [mode, setMode] = useState<string | undefined>(undefined);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Only run on mount
  useEffect(() => {
    const tokenValue = params.get("target");
    const modeValue = params.get("mode");

    if (tokenValue) {
      setToken(tokenMap[getTokenIndex(tokenValue)]);
    }
    if (modeValue) {
      setMode(modeValue);
    }
  }, []);

  return { token, mode };
};

const SiloConvertProvider = ({ children, siloToken }: { children: React.ReactNode; siloToken: Token }) => {
  const { maxLPToken } = useConvertState();

  const { token, mode } = useConvertUrlSearchParams();

  const tokenData = useTokenData();
  const [targetToken, setTargetToken] = useState<Token>(
    token ? token : siloToken.isLP ? tokenData.mainToken : maxLPToken || tokenData.lpTokens[0],
  );

  return (
    <ConvertContext.Provider
      value={{
        targetToken,
        mode,
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
  const td = useTokenData();

  const farmerDepositsQuery = useFarmerDepositedBalances();
  const farmerDeposits = farmerDepositsQuery.data;
  const { queryKeys: priceQueryKeys, tokenPrices, pools } = usePriceData();
  const { queryKeys: farmerSiloQueryKeys } = useFarmerSilo(); // Fix me: inefficient fetching...
  const { tokenData: siloTokenData } = useSiloData();

  const queryClient = useQueryClient();

  const sourceWell = useWell(siloToken);
  const targetWell = useWell(targetToken);

  const onSuccess = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: farmerDepositsQuery.queryKey });
    for (const queryKey of priceQueryKeys) {
      queryClient.invalidateQueries({ queryKey });
    }
    for (const queryKey of farmerSiloQueryKeys) {
      queryClient.invalidateQueries({ queryKey });
    }
  }, [queryClient, farmerDepositsQuery.queryKey, priceQueryKeys, farmerSiloQueryKeys]);

  const depositMap = useMemo(() => {
    const map = new Map<Token, TV>();
    for (const token of farmerDeposits.keys()) {
      const farmerDepositData = farmerDeposits.get(token);
      if (farmerDepositData) {
        map.set(token, farmerDepositData.convertibleAmount);
      }
    }
    return map;
  }, [farmerDeposits]);

  if (siloToken.isLP && targetToken.isLP && sourceWell && targetWell) {
    return (
      <PipelineConvert
        siloToken={siloToken}
        farmerDepositMap={depositMap}
        farmerDeposits={farmerDeposits}
        queryClient={queryClient}
        sourceWell={sourceWell}
        targetWell={targetWell}
        onSuccess={onSuccess}
        tokenPrices={tokenPrices}
        siloTokenData={siloTokenData}
        pools={pools}
      />
    );
  }

  return (
    <DefaultConvert
      siloToken={siloToken}
      farmerDepositMap={depositMap}
      farmerDeposits={farmerDeposits}
      queryClient={queryClient}
      sourceWell={sourceWell}
      targetWell={targetWell}
      onSuccess={onSuccess}
      tokenPrices={tokenPrices}
      siloTokenData={siloTokenData}
    />
  );
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

// ------------------------------ Convert Output ------------------------------

const formatAmountOut = (amount: TV, token: Token) => {
  const isPINTOcbBTC = stringEq(token.address, PINTOcbBTC.address);

  if (!isPINTOcbBTC || amount.gt(0.1)) {
    return formatter.twoDec(amount);
  }
  if (amount.isZero) {
    return "0.00";
  }
  return formatter.number(amount, {
    allowZero: true,
    minDecimals: 8,
    maxDecimals: 8,
    minValue: 0.00000001,
  });
};

const ConvertTokenOutput = ({
  amount,
  siloToken,
  targetToken,
  prices,
}: {
  amount: TV;
  siloToken: Token;
  targetToken: Token;
  prices: ReturnType<typeof usePriceData>["tokenPrices"];
}) => {
  const usd = prices.get(targetToken)?.instant?.mul(amount || TV.ZERO);

  return (
    <div className="flex flex-col w-full py-4 gap-2">
      <Text variant="body-light" color="light">
        To
      </Text>
      <div className="flex flex-col w-full gap-1">
        <div className="flex flex-row items-center justify-between w-full">
          <div className="flex flex-col gap-1">
            <Text variant="h3">{formatAmountOut(amount, targetToken)}</Text>
          </div>
          <SiloConvertTokenSelect siloToken={siloToken} />
        </div>
        <Text variant="sm-light" color="light">
          {formatter.usd(usd)}
        </Text>
      </div>
    </div>
  );
};

// ------------------------------ Token Select ------------------------------

interface DivorcedConvertState {
  up: SiloTokenConvertPath[];
  down: SiloTokenConvertPath[];
}

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

const SiloConvertTokenSelectComponent = ({ siloToken }: BaseConvertProps) => {
  // Context
  const { convertState } = useConvertState();
  const { targetToken } = useSiloConvertContext();

  const { divorcedState, tokenConvertState } = useMemo(() => {
    const tokenState = convertState[getTokenIndex(siloToken)];

    return {
      tokenConvertState: tokenState,
      divorcedState: getDivorcedState(tokenState?.paths ?? []),
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

const SiloConvertTokenSelect = React.memo(SiloConvertTokenSelectComponent);

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
    return (
      <div className="flex flex-col h-[140px] sm:h-[240px] justify-center items-center">
        <Text variant="sm" color="light">
          Converting to any other token from Pinto will result in a loss.
        </Text>
      </div>
    );
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

// ------------------------------ PIPELINE CONVERT ------------------------------

const transferTokenABI = [
  {
    inputs: [
      {
        internalType: "contract IERC20",
        name: "token",
        type: "address",
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "enum LibTransfer.From",
        name: "fromMode",
        type: "uint8",
      },
      {
        internalType: "enum LibTransfer.To",
        name: "toMode",
        type: "uint8",
      },
    ],
    name: "transferToken",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
] as const;
