import arrowDown from "@/assets/misc/ChevronDown.svg";
import { TV } from "@/classes/TokenValue";
import { ComboInputField } from "@/components/ComboInputField";
import { RightArrowIcon } from "@/components/Icons";
import FrameAnimator from "@/components/LoadingSpinner";
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
import { diamondABI } from "@/constants/abi/diamondABI";
import { SEEDS, STALK } from "@/constants/internalTokens";
import { PINTO } from "@/constants/tokens";
import { useReadSilo_GetAmountOut } from "@/generated/contractHooks";
import useDelayedLoading from "@/hooks/display/useDelayedLoading";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { useTokenMap } from "@/hooks/pinto/useTokenMap";
import useTransaction from "@/hooks/useTransaction";
import { useWell, useWellUnderlying } from "@/hooks/wells/wells";
import {
  PipelineConvert as GenConvert,
  PipelineConvertDepositResult,
  PipelineConvertQuote,
} from "@/lib/PipelineConvert/PipelineConvert";
import ConvertProvider, { SiloTokenConvertPath, useConvertState } from "@/state/context/convert.provider";
import { useOverallConvertCapacity, useWellConvertCapacity } from "@/state/useConvertCapacity";
import useFarmerDepositedBalances from "@/state/useFarmerDepositedBalances";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { PoolData, usePriceData } from "@/state/usePriceData";
import { useSiloData } from "@/state/useSiloData";
import useTokenData from "@/state/useTokenData";
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
import { simulateContract } from "viem/actions";
import { useAccount, useChainId, useConfig, useReadContract } from "wagmi";

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

  const { loading, setLoadingTrue, setLoadingFalse } = useDelayedLoading();

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

  useEffect(() => {
    if (estimateQuery.isFetching) {
      setLoadingTrue();
    } else if (!estimateQuery.isFetching) {
      setLoadingFalse();
    }
  }, [estimateQuery.isFetching, setLoadingTrue, setLoadingFalse]);

  const { writeContractAsync, isConfirming } = useTransaction({
    successMessage: "Convert successful",
    successCallback: () => {
      setAmountIn("0");
      queryClient.invalidateQueries({ queryKey: maxConvertQuery.queryKey });
      queryClient.invalidateQueries({ queryKey: estimateQuery.queryKey });
      onSuccess();
    },
  });

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

  const onSubmit = useCallback(async () => {
    try {
      const deposits = farmerDeposits.get(siloToken);

      if (!account.address) throw new Error("Signer required");
      if (!deposits) throw new Error("No deposits found");
      if (minAmountOut.lte(0)) throw new Error("No convert quote");

      const formattedAmountIn = formatter.token(debouncedAmountIn, siloToken);
      const formattedAmountOut = formatter.token(minAmountOut, targetToken);

      toast.loading(
        `Converting ${formattedAmountIn} ${siloToken.symbol} for ${formattedAmountOut} ${targetToken.symbol}`,
      );

      const depositCrates = sortAndPickCrates(
        "convert",
        TV.fromHuman(debouncedAmountIn, siloToken.decimals),
        deposits.convertibleDeposits,
        targetToken,
      );

      const stems: bigint[] = depositCrates.crates.map((crate) => crate.stem.toBigInt());
      const amounts: bigint[] = depositCrates.crates.map((crate) => crate.amount.toBigInt());

      const convertData = calculateConvertData(
        siloToken,
        targetToken,
        TV.fromHuman(debouncedAmountIn, siloToken.decimals),
        minAmountOut,
      );

      if (!convertData || !stems.length || !amounts.length) {
        throw new Error("Invalid convert data");
      }

      return writeContractAsync({
        address: protocolAddress,
        abi: diamondABI,
        functionName: "convert",
        args: [convertData, stems, amounts],
      });
    } catch (e) {
      console.error(e);
      toast.error(e instanceof Error ? e.message : "Convert failed");
      return e;
    }
  }, [
    writeContractAsync,
    protocolAddress,
    account.address,
    farmerDeposits,
    siloToken,
    targetToken,
    debouncedAmountIn,
    minAmountOut,
  ]);

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
    minAmountOut?.lte(0) ||
    !account.address ||
    !convertData ||
    isConfirming ||
    amountIn !== debouncedAmountIn;

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
      <ConvertTokenOutput
        amount={minAmountOut || TV.ZERO}
        siloToken={siloToken}
        targetToken={targetToken}
        prices={tokenPrices}
      />
      {loading ? (
        <div className="flex flex-col w-full h-[181px] items-center justify-center">
          <FrameAnimator size={64} />
        </div>
      ) : convertData ? (
        <OutputDisplay title="I receive">
          <OutputDisplay.Item label="Amount">
            <OutputDisplay.Value
              value={formatter.token(minAmountOut, targetToken)}
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
      <Button type="button" rounded="full" width="full" size="xxl" onClick={onSubmit} disabled={disabled}>
        Convert
      </Button>
    </div>
  );
}

// ------------------------------ PIPELINE CONVERT ------------------------------

interface PipelineConvertProps extends ConvertProps {
  pools: ReturnType<typeof usePriceData>["pools"];
  sourceWell: PoolData;
  targetWell: PoolData;
  genConvert: GenConvert;
}

const PipelineConvert = ({
  siloToken,
  farmerDepositMap,
  farmerDeposits,
  queryClient,
  genConvert,
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

  const [minCapacity, setMinCapacity] = useState(0);
  const [amountIn, setAmountIn] = useState("0");
  const [slippage, setSlippage] = useState(0.1);
  const config = useConfig();
  // const chainId = useResolvedChainId();
  const chainId = useChainId();

  const { loading, setLoadingTrue, setLoadingFalse } = useDelayedLoading();

  const debouncedAmountIn = useDebounceValue(amountIn, DEBOUNCE_MS);

  const tokenDeposits = farmerDeposits?.get(siloToken);
  const convertibleDeposits = tokenDeposits?.convertibleDeposits;
  const maxConvertible = tokenDeposits?.convertibleAmount;

  const queryConvertCapacityEnabled = stringToNumber(amountIn) > 0;

  const { data: overallConvertCapacity } = useOverallConvertCapacity(queryConvertCapacityEnabled);
  const { data: sourceWellConvertCapacity } = useWellConvertCapacity(
    sourceWell.pool.address,
    queryConvertCapacityEnabled,
  );
  const { data: targetWellConvertCapacity } = useWellConvertCapacity(
    targetWell.pool.address,
    queryConvertCapacityEnabled,
  );

  useEffect(() => {
    if (overallConvertCapacity) {
      console.log("overallConvertCapacity", overallConvertCapacity);
    }
  }, [overallConvertCapacity]);

  useEffect(() => {
    if (sourceWellConvertCapacity) {
      console.log("sourceWellConvertCapacity", sourceWellConvertCapacity);
    }
  }, [sourceWellConvertCapacity]);

  useEffect(() => {
    if (targetWellConvertCapacity) {
      console.log("targetWellConvertCapacity", targetWellConvertCapacity);
    }
  }, [targetWellConvertCapacity]);

  // useEffect(() => {
  //   if (!overallConvertCapacity || !sourceWellConvertCapacity) return;

  //   const min = Math.min(
  //     Number(overallConvertCapacity),
  //     Number(sourceWellConvertCapacity),
  //     // Number(targetWellConvertCapacity),
  //   );
  //   setMinCapacity(min);
  // }, [overallConvertCapacity, sourceWellConvertCapacity]);

  const { data: quote, ...quoteQuery } = useQuery({
    queryKey: ["pipeline-convert", chainId, account.address, siloToken.address, targetToken.address, debouncedAmountIn],
    queryFn: async () => {
      if (!account.address || !convertibleDeposits?.length || stringToNumber(debouncedAmountIn) <= 0) return;
      if (!sourceWell || !targetWell) return;

      setLoadingTrue();

      const res = await genConvert
        .quote(convertibleDeposits, TV.fromHuman(debouncedAmountIn, siloToken.decimals), slippage, slippage / 100)
        .catch((e) => {
          console.error("Error fetching pipeline convert: ", e);
          setLoadingFalse();
          return GenConvert.getEmptyResult();
        });

      return res;
    },
    enabled: !!account.address && !!convertibleDeposits?.length && stringToNumber(debouncedAmountIn) > 0,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 20, // 20 seconds
  });

  const { data: simulation, ...simulateQuery } = useQuery({
    queryKey: ["pipe-convert-sim", chainId, siloToken.address, targetToken.address, quote?.encoded],
    queryFn: async () => {
      try {
        if (!quote?.encoded.length) {
          throw new Error("No encoded data to simulate");
        }
        return simulateContract(config.getClient({ chainId }), {
          address: protocolAddress,
          abi: diamondABI,
          functionName: "advancedFarm",
          args: [quote?.encoded ?? []],
          account: account.address,
          blockTag: "latest",
        }).then((res) => res.result);
      } catch (e: any) {
        console.error("Error simulating pipeline convert: ", e);
        throw new Error(e.message || e.shortMessage || "Error simulating pipeline convert");
      } finally {
        setLoadingFalse();
      }
    },
    enabled: !!quote?.encoded.length && stringToNumber(debouncedAmountIn) > 0 && quote?.totalAmountOut.gt(0),
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 20, // 20 seconds
    select: (rpcResult) => {
      const decodedFarmResult = GenConvert.decodeStaticResults(rpcResult as string[]);
      return decodedFarmResult.map((result) => ({
        toStem: TV.fromBigInt(result.toStem, PINTO.decimals),
        fromAmount: TV.fromBigInt(result.fromAmount, siloToken.decimals),
        toAmount: TV.fromBigInt(result.toAmount, targetToken.decimals),
        fromBdv: TV.fromBigInt(result.fromBdv, PINTO.decimals),
        toBdv: TV.fromBigInt(result.toBdv, PINTO.decimals),
      }));
    },
  });

  const convertData = usePipelineConvertResults({
    siloTokenData,
    siloToken,
    quote,
    results: simulation,
    targetStemTip: siloTokenData.get(targetToken)?.stemTip,
  });

  const { writeContractAsync, isConfirming } = useTransaction({
    successCallback: () => {
      setAmountIn("0");
      toast.dismiss();
      toast.success("Convert successful");
      onSuccess();
    },
    successMessage: "Convert successful",
  });

  const onSubmit = async () => {
    try {
      const depositData = farmerDeposits.get(siloToken);

      if (!account.address || !depositData) throw new Error("Signer required");
      if (!convertData || !quote) throw new Error("No convert quote");
      if (depositData.convertibleAmount.lt(TV.fromHuman(debouncedAmountIn, siloToken.decimals))) {
        throw new Error("Amount exceeds balance");
      }

      const formattedAmountIn = formatter.token(debouncedAmountIn, siloToken);
      const formattedAmountOut = formatter.token(convertData?.amountOut, targetToken);

      toast.loading(
        `Converting ${formattedAmountIn} ${siloToken.symbol} for ${formattedAmountOut} ${targetToken.symbol}`,
      );

      await writeContractAsync({
        address: protocolAddress,
        abi: diamondABI,
        functionName: "advancedFarm",
        args: [quote?.encoded ?? []],
      });
    } catch (e) {
      console.error("Error submitting pipeline convert: ", e);
      return e;
    }
  };

  const isLoading = quoteQuery.isFetching || simulateQuery.isFetching || loading;

  const disabled =
    !quote ||
    isLoading ||
    !convertData ||
    isConfirming ||
    convertData?.amountOut.lte(0) ||
    maxConvertible?.lt(stringToNumber(amountIn));

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
        amount={quote?.totalAmountOut || TV.ZERO}
        siloToken={siloToken}
        targetToken={targetToken}
        prices={tokenPrices}
      />
      {isLoading ? (
        <div className="flex flex-col w-full h-[181px] items-center justify-center">
          <FrameAnimator size={64} />
        </div>
      ) : convertData ? (
        <OutputDisplay title="I receive">
          <OutputDisplay.Item label="Amount">
            <OutputDisplay.Value
              value={formatter.token(convertData.amountOut, targetToken)}
              token={targetToken}
              suffix={targetToken.symbol}
            />
          </OutputDisplay.Item>
          <OutputDisplay.Item label="Stalk">
            <OutputDisplay.Value
              value={formatter.twoDec(convertData.deltaStalk)}
              suffix="Stalk"
              delta={convertData.deltaStalk.toNumber()}
              token={STALK}
              showArrow
            />
          </OutputDisplay.Item>
          <OutputDisplay.Item label="Seed">
            <OutputDisplay.Value
              value={formatter.twoDec(convertData.deltaSeed)}
              suffix="Seed"
              delta={convertData.deltaSeed.toNumber()}
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
};

type PipeelineConvertDisplay = {
  deltaStalk: TV;
  deltaSeed: TV;
  amountOut: TV;
};

const usePipelineConvertResults = ({
  siloTokenData,
  siloToken,
  quote,
  results,
  targetStemTip,
}: Pick<PipelineConvertProps, "siloTokenData" | "siloToken"> & {
  quote: PipelineConvertQuote | undefined;
  results: PipelineConvertDepositResult<TV>[] | undefined;
  targetStemTip: TV | undefined;
}): PipeelineConvertDisplay | undefined => {
  const { targetToken } = useSiloConvertContext();

  return useMemo(() => {
    if (!quote || !results || !targetStemTip) return;

    let totalDeltaBaseStalk = TV.fromHuman("0", STALK.decimals);
    let totalDeltaGrownStalk = TV.fromHuman("0", STALK.decimals);
    let totalDeltaSeed = TV.fromHuman("0", SEEDS.decimals);

    const pickedCrates = quote.pickedCrates.crates;

    const sourceRewards = siloTokenData.get(siloToken)?.rewards;
    const targetRewards = siloTokenData.get(targetToken)?.rewards;

    if (pickedCrates.length !== results.length || !sourceRewards || !targetRewards) {
      return;
    }

    for (const [i, result] of results.entries()) {
      const deposit = pickedCrates[i];
      if (!deposit) continue;

      const toBDV = result.toBdv;
      const deltaStem = targetStemTip.sub(result.toStem);

      const baseStalkAfter = targetRewards.stalk.mul(toBDV) || TV.ZERO;
      const grownStalkAfter = TV.fromBlockchain(deltaStem.mul(result.toBdv).blockchainString, STALK.decimals);

      const deltaBaseStalk = baseStalkAfter.sub(deposit.stalk.base);
      const deltaGrownStalk = grownStalkAfter.sub(deposit.stalk.grown);

      totalDeltaBaseStalk = totalDeltaBaseStalk.add(deltaBaseStalk);
      totalDeltaGrownStalk = totalDeltaGrownStalk.add(deltaGrownStalk);

      const afterSeed = targetRewards.seeds.mul(toBDV);
      const deltaSeed = afterSeed.sub(deposit.seeds);
      totalDeltaSeed = totalDeltaSeed.add(deltaSeed);
    }

    const totalDeltaStalk = totalDeltaBaseStalk.add(totalDeltaGrownStalk);

    return {
      deltaGrownStalk: totalDeltaGrownStalk,
      deltaBaseStalk: totalDeltaBaseStalk,
      deltaStalk: totalDeltaStalk,
      deltaSeed: totalDeltaSeed,
      amountOut: quote.totalAmountOut,
    };
  }, [results, quote, targetStemTip, siloTokenData, siloToken, targetToken]);
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
  const protocolAddress = useProtocolAddress();

  const farmerDepositsQuery = useFarmerDepositedBalances();
  const farmerDeposits = farmerDepositsQuery.data;
  const { tokenPrices, pools, queryKeys: priceQueryKeys } = usePriceData();
  const farmerSilo = useFarmerSilo(); // Fix me: inefficient fetching...
  const { tokenData: siloTokenData } = useSiloData();
  const config = useConfig();

  const queryClient = useQueryClient();

  const sourceWell = useWell(siloToken);
  const targetWell = useWell(targetToken);

  const genConvert = useMemo(() => {
    if (!sourceWell || !targetWell) return;
    return new GenConvert(protocolAddress, sourceWell, targetWell, config);
  }, [protocolAddress, sourceWell, targetWell, config]);

  const onSuccess = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: farmerDepositsQuery.queryKey });
    for (const queryKey of priceQueryKeys) {
      queryClient.invalidateQueries({ queryKey });
    }
    for (const queryKey of farmerSilo.queryKeys) {
      queryClient.invalidateQueries({ queryKey });
    }
  }, [queryClient, farmerDepositsQuery.queryKey, priceQueryKeys, farmerSilo.queryKeys]);

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

  const bothLP = siloToken.isLP && targetToken.isLP;

  if (bothLP && sourceWell && targetWell && genConvert) {
    return (
      <PipelineConvert
        genConvert={genConvert}
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

  const displayAmount = useDebounceValue(formatter.token(amount, targetToken), 50);
  const displayUsd = useDebounceValue(formatter.usd(usd), 50);

  return (
    <div className="flex flex-col w-full py-4 gap-2">
      <Text variant="body-light" color="light">
        To
      </Text>
      <div className="flex flex-col w-full gap-1">
        <div className="flex flex-row items-center justify-between w-full">
          <div className="flex flex-col gap-1">
            <Text variant="h3">{displayAmount}</Text>
          </div>
          <SiloConvertTokenSelect siloToken={siloToken} />
        </div>
        <Text variant="sm-light" color="light">
          {displayUsd}
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

// interface UseFarmerPipelineConvertProps {
//   siloToken: Token;
//   targetToken: Token;
//   pools: ReturnType<typeof usePriceData>["pools"];
//   farmerDeposits: ReturnType<typeof useFarmerDepositedBalances>["data"];
//   sourceWell: PoolData;
//   targetWell: PoolData;
// }

// const emptyResult = {
//   amountsOut: [],
//   summedAmounts: [TV.ZERO, TV.ZERO],
// };

// const useFarmerPipelineConvertMax = (
//   siloToken: Token,
//   targetToken: Token,
//   pools: ReturnType<typeof usePriceData>["pools"],
//   farmerDeposits: ReturnType<typeof useFarmerDepositedBalances>["data"],
//   sourceWell: ReturnType<typeof useWell>,
//   targetWell: ReturnType<typeof useWell>,
// ) => {
//   const protocolAddress = useProtocolAddress();
//   const account = useAccount();
//   const tokenData = farmerDeposits.get(siloToken);
//   const convertibleAmount = tokenData?.convertibleAmount ?? TV.ZERO;

//   const removeOutQuery = useReadContract({
//     address: sourceWell?.pool.address,
//     abi: basinWellABI,
//     functionName: "getRemoveLiquidityOut",
//     args: [convertibleAmount.toBigInt()],
//     query: {
//       staleTime: 1000 * 60 * 2, // 2 mins
//       enabled: !!account.address && convertibleAmount.gt(0),
//     },
//   });

//   const st0 = sourceWell?.tokens?.[0];
//   const st1 = sourceWell?.tokens?.[1];

//   const tt0 = targetWell?.tokens?.[0];
//   const tt1 = targetWell?.tokens?.[1];

//   const sourceBefore0 = sourceWell?.balances?.[0]?.toBigInt();
//   const sourceBefore1 = sourceWell?.balances?.[1]?.toBigInt();

//   const targetBefore0 = targetWell?.balances?.[0]?.toBigInt();
//   const targetBefore1 = targetWell?.balances?.[1]?.toBigInt();

//   const removeOut0 = removeOutQuery.data?.[0];
//   const removeOut1 = removeOutQuery.data?.[1];

//   const otherQuery = useQuery({
//     queryKey: ["pipeline-convert-other", siloToken.address, targetToken.address, convertibleAmount.blockchainString],
//     queryFn: async () => {
//       return ZeroX.quote({
//         sellToken: sourceWell?.tokens[1].address ?? "0x",
//         buyToken: targetWell?.tokens[1].address ?? "0x",
//         sellAmount: removeOut1?.toString() ?? "0",
//       });
//     },
//     staleTime: 1000 * 60 * 2, // 5 mins
//     enabled:
//       !!account.address && !!removeOut1 && !!sourceWell?.tokens?.[1].address && !!targetWell?.tokens?.[1].address,
//   });

//   const otherTokenOut = TV.fromBlockchain(
//     BigInt(otherQuery.data?.[0]?.buyAmount ?? 0),
//     targetWell?.tokens[1].decimals ?? 0,
//   );

//   console.log("otherTokenOut: ", formatter.number(otherTokenOut));

//   const sourceAfter0 = sourceBefore0 && removeOut0 ? sourceBefore0 - removeOut0 : undefined;
//   const sourceAfter1 = sourceBefore1 && removeOut1 ? sourceBefore1 - removeOut1 : undefined;

//   const targetAfter0 = targetBefore0 && removeOut0 ? targetBefore0 + removeOut0 : undefined;
//   const targetAfter1 = targetBefore1 && otherTokenOut ? targetBefore1 + otherTokenOut.toBigInt() : undefined;

//   const calcSourceDeltaBQuery = useReadContract({
//     address: protocolAddress,
//     abi: diamondABI,
//     functionName: "calculateDeltaBFromReserves",
//     args: [sourceWell?.pool.address ?? "0x", [sourceAfter0 ?? 0n, sourceAfter1 ?? 0n], 0n],
//     query: {
//       staleTime: 1000 * 60 * 2, // 2 mins
//       enabled: !!account.address && bigIntGt(removeOut0) && bigIntGt(removeOut1) && !!sourceAfter0 && !!sourceAfter1,
//     },
//   });

//   const calcTargetDeltaBQuery = useReadContract({
//     address: protocolAddress,
//     abi: diamondABI,
//     functionName: "calculateDeltaBFromReserves",
//     args: [sourceWell?.pool.address ?? "0x", [targetAfter0 ?? 0n, targetAfter1 ?? 0n], 0n],
//     query: {
//       staleTime: 1000 * 60 * 2, // 2 mins
//       enabled: !!account.address && bigIntGt(removeOut0) && bigIntGt(removeOut1) && !!targetAfter0 && !!targetAfter1,
//     },
//   });

//   const sourceDeltaBDiff =
//     calcSourceDeltaBQuery?.data && sourceWell?.deltaB
//       ? calcSourceDeltaBQuery.data - sourceWell.deltaB.toBigInt()
//       : undefined;

//   const targetDeltaBDiff =
//     calcTargetDeltaBQuery?.data && targetWell?.deltaB
//       ? calcTargetDeltaBQuery.data - targetWell.deltaB.toBigInt()
//       : undefined;

//   console.log({
//     source: {
//       deltaBBefore: formatter.number(sourceWell?.deltaB?.toHuman()),
//       deltaBAfter: formatter.number((calcSourceDeltaBQuery.data || 0n) / BigInt(1e6)),
//       reservesB4: [
//         formatter.number((sourceBefore0 || 0n) / BigInt(10 ** (st0?.decimals || 0))),
//         formatter.number((sourceBefore1 || 0n) / BigInt(10 ** (st1?.decimals || 0))),
//       ],
//       reservesAfter: [
//         formatter.number((sourceAfter0 || 0n) / BigInt(10 ** (st0?.decimals || 0))),
//         formatter.number((sourceAfter1 || 0n) / BigInt(10 ** (st1?.decimals || 0))),
//       ],
//     },
//     target: {
//       deltaBBefore: formatter.number(targetWell?.deltaB?.toHuman()),
//       deltaBAfter: formatter.number((calcTargetDeltaBQuery.data || 0n) / BigInt(1e6)),
//       reservesB4: [
//         formatter.number((targetBefore0 || 0n) / BigInt(10 ** (tt0?.decimals || 0))),
//         formatter.number((targetBefore1 || 0n) / BigInt(10 ** (tt1?.decimals || 0))),
//       ],
//       reservesAfter: [
//         formatter.number((targetAfter0 || 0n) / BigInt(10 ** (tt0?.decimals || 0))),
//         formatter.number((targetAfter1 || 0n) / BigInt(10 ** (tt1?.decimals || 0))),
//       ],
//     },
//   });

//   // const calc = useMemo(() => {
//   //   if (!calcDeltaBQuery.data || !reservesBefore) return undefined;

//   //   const deltaBBefore = calcDeltaBQuery.data[0];
//   //   const deltaBAfter = calcDeltaBQuery.data[1];

//   //   const deltaB = deltaBBefore - deltaBAfter;

//   //   return deltaB;
//   // }, [calcDeltaBQuery.data, reservesBefore]);
// };
