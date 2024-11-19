import { Clipboard } from "@/classes/Clipboard";
import { TokenValue } from "@/classes/TokenValue";
import { WSOL_TOKEN } from "@/constants/tokens";
import advancedPipe from "@/encoders/advancedPipe";
import erc20Approve from "@/encoders/erc20Approve";
import erc20Transfer from "@/encoders/erc20Transfer";
import shift from "@/encoders/shift";
import sync from "@/encoders/sync";
import transferToken from "@/encoders/transferToken";
import unwrapEth from "@/encoders/unwrapEth";
import wrapEth from "@/encoders/wrapEth";
import {
  beanstalkAddress,
  pipelineAddress,
  useReadBeanstalkPrice_GetSwapDataBeanInAll,
  useReadBeanstalkPrice_GetSwapDataUsdInAll,
} from "@/generated/contractHooks";
import use0x from "@/hooks/use0x";
import useWellAddLiquidity from "@/hooks/useWellAddLiquidity";
import useWellSwap from "@/hooks/useWellSwap";
import { PoolData, usePriceData } from "@/state/usePriceData";
import useTokenData from "@/state/useTokenData";
import { useChainConstant } from "@/utils/chain";
import { stringEq } from "@/utils/string";
import { getTokenIndex, tokensEqual } from "@/utils/token";
import { AddressMap, AdvancedFarmCall, AdvancedPipeCall, FarmFromMode, FarmToMode, Token } from "@/utils/types";
import { calculatePipeCallClipboardSlot } from "@/utils/utils";
import { useMemo } from "react";
import { Address, zeroAddress } from "viem";
import { useAccount, useChainId } from "wagmi";
import { useLPTokenToNonPintoUnderlyingMap, useTokenMap } from "./pinto/useTokenMap";

const sharedQueryOptions = {
  refetchOnMount: true,
  refetchOnWindowFocus: true,
  refetchIntervalInBackground: false,
} as const;

interface WellsConfig {
  well2Well?: {
    from: PoolData;
    to: PoolData;
  };
  well?: PoolData;
}

/**
 *
 * B.W = Best Well
 *
 * PINTO -> X
 *  -> PINTO -> X via (B.W)
 *  -> PINTO -> Y via (B.W) -> X via (0x)
 *
 * X -> PINTO
 * -> X -> PINTO (via B.W)
 * -> X -> Y via (0x) -> PINTO via (B.W)
 *
 * WSOL -> Non-Pinto
 *  -> WSOL -> PINTO via (PINTO:WSOL Well) -> Non-P via (PINTO:Non-Pinto Well)
 *
 * Non-Pinto -> WSOL
 *  -> Non-Pinto -> PINTO via (PINTO:Non-Pinto Well) -> WSOL via (PINTO:WSOL Well)
 */

type ContractSwapData = {
  well: Address;
  token: Address;
  usdValue: bigint;
  amountOut: bigint;
};

interface SwapTokenConfig {
  wellIn: Token | undefined;
  wellOut: Token | undefined;
  aggIn: Token | undefined;
  aggOut: Token | undefined;
  well2In: Token | undefined;
  well2Out: Token | undefined;
}

type SwapPathType = "well2Well" | "wellOnly" | "aggOnly" | "wellSwapFirst" | "wellSwapLast";

function useSwapExceptions(tokenIn: Token, tokenOut: Token) {
  const wsol = useChainConstant(WSOL_TOKEN);
  const wsolIn = tokensEqual(tokenIn, wsol);
  const wsolOut = tokensEqual(tokenOut, wsol);

  const isExceptionWell2Well = (wsolIn || wsolOut) && !tokenIn.isMain && !tokenOut.isMain;
  const isExceptionWellOnly = (wsolIn && tokenOut.isMain) || (tokenIn.isMain && wsolOut);

  return {
    isExceptionWell2Well,
    isExceptionWellOnly,
    isException: isExceptionWell2Well || isExceptionWellOnly,
  };
}

export default function useSwapEstimate(
  tokenIn: Token,
  tokenOut: Token,
  amount: number,
  slippage: number,
  mode: "exactInput" | "exactOutput",
  source: FarmFromMode,
  destination: FarmToMode,
  lpPool?: PoolData,
  disabled?: boolean,
) {
  const chainId = useChainId();
  const account = useAccount();
  const tokenData = useTokenData();
  const mainToken = tokenData.mainToken;
  const wrappedNative = tokenData.wrappedNativeToken;
  const tokenMap = useTokenMap();
  const underlying2LP = useLPTokenToNonPintoUnderlyingMap("underlying2LP");
  const poolData = usePriceData();
  const wsol = useChainConstant(WSOL_TOKEN);

  // We handle these exceptions separately
  const { isExceptionWell2Well, isExceptionWellOnly, isException } = useSwapExceptions(tokenIn, tokenOut);

  const wells = useMemo(() => {
    return poolData.pools.reduce<AddressMap<PoolData>>((prev, curr) => {
      prev[getTokenIndex(curr.pool)] = curr;
      return prev;
    }, {});
  }, [poolData.pools]);

  const baseQueryEnabled = !disabled && !!account.address && amount > 0 && !isException;

  const beanIn = (tokenIn.isMain && TokenValue.fromHuman(amount, mainToken.decimals).toBigInt()) || 0n;
  const beanInQuery = useReadBeanstalkPrice_GetSwapDataBeanInAll({
    args: [beanIn],
    query: {
      ...sharedQueryOptions,
      enabled: baseQueryEnabled && beanIn > 0n && tokenIn.isMain && !isException,
    },
  });

  const usdIn =
    (!tokenIn.isMain && poolData.tokenPrices.get(tokenIn)?.instant.mul(amount).reDecimal(6).toBigInt()) || 0n;
  const usdInQuery = useReadBeanstalkPrice_GetSwapDataUsdInAll({
    args: [usdIn],
    query: {
      enabled: baseQueryEnabled && !tokenIn.isMain && usdIn > 0n && !isException,
      ...sharedQueryOptions,
    },
  });

  const { beanInResults, usdInResults } = useMemo(() => {
    const selectQuery = (data: readonly ContractSwapData[] | undefined, key: "amountOut" | "usdValue") => {
      const mapped = [...(data || [])].map((d) => {
        const token = tokenMap[getTokenIndex(d.token)];
        return {
          well: wells[getTokenIndex(d.well)],
          token,
          usdValue: TokenValue.fromBlockchain(d.usdValue, 6),
          amountOut: TokenValue.fromBlockchain(
            d.amountOut,
            // when the query is getSwapDataBeanInAll, the amountOut is in BEAN decimals
            // when the query is getSwapDataUsdInAll, the amountOut is in the token decimals
            key === "amountOut" ? mainToken.decimals : token.decimals,
          ),
        };
      });
      return mapped.sort((a, b) => Number(b[key].sub(a[key]).toNumber()));
    };

    const beanIn = selectQuery(beanInQuery.data, "usdValue") ?? [];
    const usdIn = selectQuery(usdInQuery.data, "amountOut") ?? [];

    return {
      beanInResults: beanIn.filter((entry) => !tokensEqual(entry.token, wsol)),
      usdInResults: usdIn.filter((entry) => !tokensEqual(entry.token, wsol)),
    };
  }, [beanInQuery?.data, usdInQuery?.data, wells, tokenMap, mainToken]);

  const { well, well2Well } = useMemo(() => {
    const config: WellsConfig = {
      well2Well: undefined,
      well: undefined,
    };

    if (isExceptionWell2Well) {
      const tknFrom = tokenIn.isNative ? wrappedNative : tokenIn;
      const tokenTo = tokenOut.isNative ? wrappedNative : tokenOut;
      const well1LP = isExceptionWell2Well ? underlying2LP[getTokenIndex(tknFrom)] : undefined;
      const well2LP = isExceptionWell2Well ? underlying2LP[getTokenIndex(tokenTo)] : undefined;
      const from = well1LP ? wells[getTokenIndex(well1LP)] : undefined;
      const to = well2LP ? wells[getTokenIndex(well2LP)] : undefined;

      if (from && to) {
        config.well2Well = { from, to };
      }
    } else if (isExceptionWellOnly) {
      // we know that one of the tokens is a non-pinto token
      const nonPintoUnderlying = tokenIn.isMain ? tokenOut : tokenIn;
      const wellLP = underlying2LP[getTokenIndex(nonPintoUnderlying)];

      config.well = wellLP ? wells[getTokenIndex(wellLP)] : undefined;
    } else {
      const mainInWell = tokenIn.isMain ? beanInResults?.[0]?.well : undefined;
      const mainOutWell = tokenOut.isMain ? usdInResults?.[0]?.well : undefined;

      config.well = mainInWell || mainOutWell;
    }

    return config;
  }, [
    isExceptionWell2Well,
    isExceptionWellOnly,
    wells,
    wrappedNative,
    underlying2LP,
    beanInResults,
    usdInResults,
    tokenIn,
    tokenOut,
  ]);

  // ---------- PATH CONFIGURATION ----------
  // only one of these will be true

  const pathType: SwapPathType | undefined = useMemo(() => {
    // WellSwap(tokenIn -> token X) ===> WellSwap(token X -> tokenOut)
    if (!!well2Well) return "well2Well";

    // WellSwap(tokenIn -> tokenOut) Either the swap is only through the recommended well OR via a hardcoded well due to an exception
    if (well?.tokens.includes(tokenIn) && well?.tokens.includes(tokenOut)) {
      return "wellOnly";
    }

    // 0xSwap(tokenIn -> tokenOut)
    if (!well?.tokens.includes(tokenIn) && !well?.tokens.includes(tokenOut)) {
      return "aggOnly";
    }

    if (tokenIn === mainToken && !well2Well) return "wellSwapFirst";
    if (tokenOut === mainToken && !well2Well) return "wellSwapLast";

    return undefined;
  }, [well2Well, well, tokenOut, tokenIn, mainToken]);

  const pipeline = pipelineAddress[chainId as keyof typeof pipelineAddress];
  const recipient = destination === FarmToMode.EXTERNAL ? account.address : pipeline;

  // the Through token for multi-hop swaps
  const tokenMid = useMemo(() => {
    if (tokenOut.isLP && lpPool) {
      return lpPool.tokens.find((token) => token !== mainToken);
    }
    if (isExceptionWellOnly) return undefined;
    if (pathType === "well2Well") return mainToken;
    return well?.tokens.find((token) => token !== mainToken);
  }, [tokenOut, lpPool, mainToken, isExceptionWellOnly, pathType, well]);

  // ONLY ETH -> WETH
  const isWrapEth = tokenIn.isNative && tokenOut.isWrappedNative;
  const isUnwrapEth = tokenIn.isWrappedNative && tokenOut.isNative;

  const isWrapping = tokenIn.isNative && tokenMid?.isWrappedNative;
  const isStraightDeposit = lpPool?.tokens.includes(tokenIn) && tokenOut.isLP;
  const isWrapUnwrap = isWrapEth || isUnwrapEth;

  const swapConfig = useMemo(() => {
    const config: SwapTokenConfig = {
      wellIn: undefined,
      wellOut: undefined,
      aggIn: undefined,
      aggOut: undefined,
      well2In: undefined,
      well2Out: undefined,
    };

    if (pathType === "wellOnly") {
      config.wellIn = tokenIn;
      config.wellOut = tokenOut;
    } else if (pathType === "aggOnly") {
      config.aggIn = tokenIn;
      config.aggOut = tokenOut.isNative ? wrappedNative : tokenOut.isLP ? tokenMid : tokenOut;
    } else if (pathType === "wellSwapFirst") {
      config.wellIn = tokenIn;
      config.wellOut = tokenMid;
      config.aggIn = tokenMid;
      config.aggOut = tokenOut.isNative ? wrappedNative : tokenOut;
    } else if (pathType === "wellSwapLast") {
      config.aggIn = tokenIn;
      config.aggOut = tokenMid;
      config.wellIn = tokenMid;
      config.wellOut = tokenOut;
    } else if (pathType === "well2Well") {
      config.wellIn = tokenIn.isNative ? wrappedNative : tokenIn;
      config.wellOut = tokenMid;
      config.well2In = tokenMid;
      config.well2Out = tokenOut.isNative ? wrappedNative : tokenOut;
    }

    return config;
  }, [pathType, tokenIn, tokenOut, tokenMid, wrappedNative]);

  const amountTV = TokenValue.fromHuman(amount || 0, mode === "exactInput" ? tokenIn.decimals : tokenOut.decimals);

  const isValidAmount = !!amount && amount > 0;

  const wellQuote1ValidTypes = new Set<SwapPathType>(["wellOnly", "wellSwapFirst", "well2Well"]);
  const wellQuote1Well = pathType === "well2Well" ? well2Well?.from : well;

  const wellQuote1Enabled = () => {
    if (!Boolean(pathType && wellQuote1ValidTypes.has(pathType))) return false;
    if (isStraightDeposit || isWrapUnwrap || isWrapping) return false;
    return wellQuote1Well && swapConfig.wellIn && swapConfig.wellOut && isValidAmount;
  };

  const wellQuote1 = useWellSwap(
    amountTV,
    swapConfig.wellIn,
    swapConfig.wellOut,
    wellQuote1Well?.pool?.address,
    slippage,
    mode,
    disabled || !wellQuote1Enabled(),
  );

  const validZeroExTypes = new Set<SwapPathType>(["aggOnly", "wellSwapFirst", "wellSwapLast"]);

  const getZeroXEnabled = () => {
    if (!Boolean(pathType && validZeroExTypes.has(pathType) && swapConfig.aggIn && swapConfig.aggOut)) return false;
    if (isWrapUnwrap || isStraightDeposit || isWrapping) return false;
    return pathType !== "wellSwapFirst" ? isValidAmount : wellQuote1.amountOut.gt(0) && !wellQuote1.isLoading;
  };

  const zeroExQuote = use0x({
    buyToken: swapConfig.aggOut?.address || zeroAddress,
    sellToken: swapConfig.aggIn?.address || zeroAddress,
    buyAmount:
      mode === "exactOutput"
        ? pathType === "wellSwapFirst"
          ? wellQuote1.amountOut.toBlockchain()
          : amountTV.toBlockchain()
        : "",
    sellAmount:
      mode === "exactInput"
        ? pathType === "wellSwapFirst"
          ? wellQuote1.amountOut.toBlockchain()
          : amountTV.toBlockchain()
        : "",
    takerAddress: pipeline,
    slippagePercentage: (slippage / 100).toString(),
    skipValidation: "true",
    mode: mode,
    shouldSellEntireBalance: "true",
    enabled: !disabled && getZeroXEnabled(),
  });
  const zeroX = zeroExQuote?.data?.[0];
  const zeroExQuoteResult = TokenValue.fromBlockchain(zeroX?.buyAmount || 0, swapConfig?.aggOut?.decimals || 0);

  const wellAddLiqQuote = useWellAddLiquidity(
    lpPool,
    isStraightDeposit ? tokenIn : swapConfig.aggOut,
    isStraightDeposit || (isWrapping && tokenOut.isLP)
      ? TokenValue.fromHuman(amount, tokenIn.decimals)
      : zeroExQuoteResult,
    slippage,
    disabled || isWrapUnwrap || !lpPool,
  );

  const validWellQuote2Types = new Set<SwapPathType>(["well2Well", "wellSwapLast"]);
  const wellQuote2Well = pathType === "well2Well" ? well2Well?.to : well;
  const wellQuote2Enabled = () => {
    if (!Boolean(pathType && validWellQuote2Types.has(pathType))) return false;
    if (isStraightDeposit || isWrapUnwrap) return false;
    if (pathType === "wellSwapLast") {
      const zeroXReady =
        zeroExQuoteResult.gt(0) &&
        zeroExQuote.status === "success" &&
        zeroExQuote.isPending === false &&
        zeroExQuote.fetchStatus === "idle";
      return swapConfig.wellIn && swapConfig.wellOut && zeroXReady && isValidAmount;
    }
    // well2Well
    return swapConfig.well2In && swapConfig.well2Out && !wellQuote1.isLoading && wellQuote1.amountOut.gt(0);
  };

  const wellQuote2 = useWellSwap(
    pathType === "well2Well" ? wellQuote1.amountOut : zeroExQuoteResult,
    pathType === "well2Well" ? swapConfig.well2In : swapConfig.wellIn,
    pathType === "well2Well" ? swapConfig.well2Out : swapConfig.wellOut,
    wellQuote2Well?.pool?.address,
    slippage,
    mode,
    disabled || !wellQuote2Enabled(),
  );

  const isLoading = wellQuote1.isLoading || zeroExQuote.isLoading || wellAddLiqQuote.isLoading || wellQuote2.isLoading;

  // ---------- ONLY ETH -> WETH ----------

  const wrapEthResult = useMemo(() => {
    if (!isWrapEth) return undefined;
    const wrapEthCall = wrapEth(amountTV, destination);
    return {
      output: amountTV,
      mode: mode,
      contractToApprove: beanstalkAddress[chainId as keyof typeof beanstalkAddress],
      farmCalls: account.address ? wrapEthCall : undefined,
      pipeCalls: undefined,
      pipeOutputSlot: undefined,
      callData: account.address ? [wrapEthCall] : undefined,
      isLoading: false,
    };
  }, [isWrapEth, amountTV, destination, mode, account.address, chainId]);

  // ---------- ONLY WETH -> ETH ----------
  const unwrapEthResult = useMemo(() => {
    if (!isUnwrapEth) return undefined;
    const unwrapEthCall = unwrapEth(amountTV, source);
    return {
      output: amountTV,
      mode: mode,
      contractToApprove: beanstalkAddress[chainId as keyof typeof beanstalkAddress],
      farmCalls: account.address ? unwrapEthCall : undefined,
      pipeCalls: undefined,
      pipeOutputSlot: undefined,
      callData: account.address ? [unwrapEthCall] : undefined,
      isLoading: false,
    };
  }, [isUnwrapEth, amountTV, source, mode, account.address, chainId]);

  // ---------- TOKEN -> LP ----------
  // biome-ignore format: keep unformatted for readability
  const straightDepositResult = useMemo(() => {
    if (!lpPool || !tokenIn || disabled || !account.address) return;
    const farmCallData: AdvancedFarmCall[] = [];
    const transferToPipeline = transferToken(
      tokenIn.address,
      pipelineAddress[chainId as keyof typeof pipelineAddress],
      amountTV,
      source,
      FarmToMode.EXTERNAL,
    );
    farmCallData.push(transferToPipeline);

    const pipeCalls: AdvancedPipeCall[] = [];
    // slot 0
    const transferToWell = erc20Transfer(lpPool.pool.address, amountTV, tokenIn.address) as AdvancedPipeCall;
    pipeCalls.push(transferToWell);
    // slot 1, copy output to subsequent calls
    const wellSync = sync(
      pipelineAddress[chainId as keyof typeof pipelineAddress],
      wellAddLiqQuote.amountOut.subSlippage(slippage),
      lpPool.pool.address,
    ) as AdvancedPipeCall;
    pipeCalls.push(wellSync);
    // slot 2
    const approveTransfer = erc20Approve(
      beanstalkAddress[chainId as keyof typeof beanstalkAddress],
      wellAddLiqQuote.amountOut.subSlippage(slippage),
      lpPool.pool.address,
      Clipboard.encodeSlot(1, 0, 1),
    ) as AdvancedPipeCall;
    pipeCalls.push(approveTransfer);
    // slot 3
    const transferToBeanstalk = transferToken(
      lpPool.pool.address,
      account.address,
      wellAddLiqQuote.amountOut.subSlippage(slippage),
      FarmFromMode.EXTERNAL,
      FarmToMode.INTERNAL,
      beanstalkAddress[chainId as keyof typeof beanstalkAddress],
      Clipboard.encodeSlot(1, 0, 2),
    ) as AdvancedPipeCall;
    pipeCalls.push(transferToBeanstalk);

    const advPipeCallData = advancedPipe(pipeCalls, TokenValue.ZERO);
    return {
      output: wellAddLiqQuote.amountOut,
      mode: mode,
      contractToApprove: well?.pool.address,
      farmCalls: account.address ? farmCallData : undefined,
      pipeCalls: account.address ? pipeCalls : undefined,
      pipeOutputSlot: calculatePipeCallClipboardSlot(pipeCalls.length, 1),
      callData: account.address ? [...farmCallData, advPipeCallData] : undefined,
      isLoading: isLoading,
    };
  }, [lpPool, tokenIn, disabled, account.address, chainId, amountTV, source, wellAddLiqQuote, slippage, mode, isLoading, well]);

  // ---------- WELL ONLY SWAP ----------
  // biome-ignore format: keep unformatted for readability
  const wellOnlySwap = useMemo(() => {
    if (pathType !== "wellOnly") return undefined;

    const farmCallData: AdvancedFarmCall[] = [];
    const transferToWell = transferToken(
      swapConfig.wellIn?.address || zeroAddress,
      well?.pool.address || zeroAddress,
      amountTV,
      source,
      FarmToMode.EXTERNAL,
    ) as AdvancedFarmCall;
    farmCallData.push(transferToWell);

    const pipeCalls: AdvancedPipeCall[] = [];
    // slot 0 in pipeCall, copy the output to subsequent calls
    const wellShift = shift(
      swapConfig.wellOut?.address || zeroAddress,
      wellQuote1.amountOut,
      recipient || zeroAddress,
      well?.pool.address || zeroAddress,
    ) as AdvancedPipeCall;
    pipeCalls.push(wellShift);

    if (recipient === pipeline) {
      // send it back to user's farm balance
      const approveTransfer = erc20Approve(
        beanstalkAddress[chainId as keyof typeof beanstalkAddress],
        wellQuote1.amountOut,
        swapConfig.wellOut?.address || zeroAddress,
        Clipboard.encodeSlot(0, 0, 1),
      ) as AdvancedPipeCall;
      pipeCalls.push(approveTransfer);

      const transferToBeanstalk = transferToken(
        swapConfig.wellOut?.address || zeroAddress,
        account?.address || zeroAddress,
        wellQuote1.amountOut,
        FarmFromMode.EXTERNAL,
        FarmToMode.INTERNAL,
        beanstalkAddress[chainId as keyof typeof beanstalkAddress],
        Clipboard.encodeSlot(0, 0, 2),
      ) as AdvancedPipeCall;
      pipeCalls.push(transferToBeanstalk);
    }
    const advPipeCallData = advancedPipe(pipeCalls, TokenValue.ZERO);
    return {
      output: wellQuote1.amountOut,
      mode: mode,
      contractToApprove: well?.pool.address,
      farmCalls: account.address ? farmCallData : undefined,
      pipeCalls: account.address ? pipeCalls : undefined,
      pipeOutputSlot: calculatePipeCallClipboardSlot(pipeCalls.length, 0),
      callData: account.address ? [...farmCallData, advPipeCallData] : undefined,
      isLoading: isLoading,
    };
  }, [pathType, swapConfig, wellQuote1, recipient, pipeline, account.address, chainId, amountTV, source, mode, isLoading, well]);

  // ---------- AGGREGATOR ONLY SWAP ----------
  // biome-ignore format: keep unformatted for readability
  const aggOnlySwap = useMemo(() => {
    if (pathType !== "aggOnly" || !zeroExQuote.data) return undefined;

    const farmCallData: AdvancedFarmCall[] = [];
    if (!swapConfig.aggIn?.isNative && zeroX?.allowanceTarget !== zeroAddress) {
      const transferToPipeline = transferToken(
        swapConfig.aggIn?.address || zeroAddress,
        pipelineAddress[chainId as keyof typeof pipelineAddress],
        amountTV,
        source,
        FarmToMode.EXTERNAL,
      );
      farmCallData.push(transferToPipeline);
    }

    const pipeCalls: AdvancedPipeCall[] = [];
    const needApproval = zeroX?.allowanceTarget && zeroX.allowanceTarget !== zeroAddress;
    if (needApproval) {
      const approveZeroEx = erc20Approve(
        zeroX?.allowanceTarget || zeroAddress,
        amountTV,
        swapConfig.aggIn?.address || zeroAddress,
      ) as AdvancedPipeCall;
      pipeCalls.push(approveZeroEx);
    }
    // swap call, 0x already gives us encoded calldata, no need to use encodeFunctionData
    // slot 0 if no approval needed, 1 if needed, copy the output to subsequent calls
    pipeCalls.push({
      target: zeroX?.to || zeroAddress,
      callData: zeroX?.data || zeroAddress,
      clipboard: Clipboard.encode([], swapConfig.aggIn?.isNative ? amountTV.toBigInt() : undefined),
    });

    if (lpPool) {
      // slot 1 if no approval needed, 2 if needed
      const transferToWell = erc20Transfer(
        lpPool.pool.address,
        zeroExQuoteResult,
        swapConfig.aggOut?.address || zeroAddress,
        isWrapping ? undefined : Clipboard.encodeSlot(zeroX?.allowanceTarget !== zeroAddress ? 1 : 0, 0, 1),
      ) as AdvancedPipeCall;
      pipeCalls.push(transferToWell);
      // slot 2 if no approval needed, 3 if needed, copy output to subsequent calls
      const wellSync = sync(
        pipelineAddress[chainId as keyof typeof pipelineAddress],
        wellAddLiqQuote.amountOut.subSlippage(slippage),
        lpPool.pool.address || zeroAddress,
      ) as AdvancedPipeCall;
      pipeCalls.push(wellSync);
      // slot 3 if no approval needed, 4 if needed
      const approveTransfer = erc20Approve(
        beanstalkAddress[chainId as keyof typeof beanstalkAddress],
        wellAddLiqQuote.amountOut.subSlippage(slippage),
        lpPool.pool.address || zeroAddress,
        Clipboard.encodeSlot(zeroX?.allowanceTarget !== zeroAddress ? 3 : 2, 0, 1),
      ) as AdvancedPipeCall;
      pipeCalls.push(approveTransfer);
      // slot 4 if no approval needed, 5 if needed
      const transferToBeanstalk = transferToken(
        lpPool.pool.address || zeroAddress,
        account.address || zeroAddress,
        wellAddLiqQuote.amountOut.subSlippage(slippage),
        FarmFromMode.EXTERNAL,
        FarmToMode.INTERNAL,
        beanstalkAddress[chainId as keyof typeof beanstalkAddress],
        Clipboard.encodeSlot(zeroX?.allowanceTarget !== zeroAddress ? 3 : 2, 0, 2),
      ) as AdvancedPipeCall;
      pipeCalls.push(transferToBeanstalk);
    } else {
      // slot 1 if no approval needed, 2 if needed
      const approveTransfer = erc20Approve(
        beanstalkAddress[chainId as keyof typeof beanstalkAddress],
        zeroExQuoteResult,
        swapConfig.aggOut?.address || zeroAddress,
        Clipboard.encodeSlot(zeroX?.allowanceTarget !== zeroAddress ? 1 : 0, 0, 1),
      ) as AdvancedPipeCall;
      pipeCalls.push(approveTransfer);
      // slot 2 if no approval needed, 3 if needed
      const transferToBeanstalk = transferToken(
        swapConfig.aggOut?.address || zeroAddress,
        account.address || zeroAddress,
        zeroExQuoteResult,
        FarmFromMode.EXTERNAL,
        swapConfig.aggOut?.isWrappedNative && tokenOut.isNative ? FarmToMode.INTERNAL : destination,
        beanstalkAddress[chainId as keyof typeof beanstalkAddress],
        Clipboard.encodeSlot(zeroX?.allowanceTarget !== zeroAddress ? 1 : 0, 0, 2),
      ) as AdvancedPipeCall;
      pipeCalls.push(transferToBeanstalk);
    }

    const advPipeCallData = advancedPipe(
      pipeCalls,
      swapConfig.aggIn?.isNative ? amountTV : TokenValue.ZERO,
      swapConfig.aggIn?.isNative ? Clipboard.encode([], amountTV.toBigInt()) : undefined,
    );
    const postPipeCalls: { callData: `0x${string}`; clipboard: `0x${string}` }[] = [];

    if (tokenOut.isNative) {
      const unwrap = unwrapEth(
        zeroExQuoteResult,
        FarmFromMode.INTERNAL,
        Clipboard.encodeSlot(0 + farmCallData.length, 9, 0),
      );
      postPipeCalls.push(unwrap);
    }

    return {
      output: lpPool ? wellAddLiqQuote.amountOut : zeroExQuoteResult,
      mode: mode,
      contractToApprove: well?.pool.address,
      farmCalls: account.address ? farmCallData : undefined,
      pipeCalls: account.address ? pipeCalls : undefined,
      pipeOutputSlot: lpPool
        ? zeroX?.allowanceTarget !== zeroAddress
          ? calculatePipeCallClipboardSlot(pipeCalls.length, 3) - (isWrapping ? 1 : 0)
          : calculatePipeCallClipboardSlot(pipeCalls.length, 2) - (isWrapping ? 1 : 0)
        : zeroX?.allowanceTarget !== zeroAddress
          ? calculatePipeCallClipboardSlot(pipeCalls.length, 1)
          : calculatePipeCallClipboardSlot(pipeCalls.length, 0),
      callData: account.address ? [...farmCallData, advPipeCallData, ...postPipeCalls] : undefined,
      isLoading: isLoading,
    };
  }, [pathType, swapConfig, zeroExQuote, zeroExQuoteResult, lpPool, wellAddLiqQuote, isLoading, mode, account.address, amountTV, chainId, destination, isWrapping, slippage, source, tokenOut.isNative, well, zeroX?.allowanceTarget, zeroX?.data, zeroX?.to]);

  // ---------- WELL SWAP FIRST ----------
  // biome-ignore format: keep unformatted for readability
  const wellSwapFirstSwap = useMemo(() => {
    if (pathType !== "wellSwapFirst") return undefined;

    if (!swapConfig.wellIn || !well?.pool || !swapConfig.wellOut || !zeroExQuote.data) return;

    const farmCallData: AdvancedFarmCall[] = [];
    const transferToWell = transferToken(
      swapConfig.wellIn?.address,
      well?.pool.address,
      amountTV,
      source,
      FarmToMode.EXTERNAL,
    );
    farmCallData.push(transferToWell);

    const pipeCalls: AdvancedPipeCall[] = [];
    // slot 0 in pipeCall, copy into approval step
    const wellShift = shift(
      swapConfig.wellOut?.address,
      wellQuote1.amountOut.subSlippage(slippage),
      // TokenValue.ZERO,
      pipeline,
      well?.pool.address,
    ) as AdvancedPipeCall;
    pipeCalls.push(wellShift);

    // slot 1 in pipeCall
    const approveZeroEx = erc20Approve(
      zeroX?.allowanceTarget || zeroAddress,
      TokenValue.MAX_UINT256, // set max approval for 0x
      swapConfig.aggIn?.address,
    ) as AdvancedPipeCall;
    pipeCalls.push(approveZeroEx);

    // swap call, 0x already gives us encoded calldata, no need to use encodeFunctionData
    // slot 2 in pipeCall
    pipeCalls.push({
      target: zeroX?.to || zeroAddress,
      callData: zeroX?.data || zeroAddress,
      clipboard: Clipboard.encode([]),
    });

    // slot 3 in pipeCall
    const approveTransfer = erc20Approve(
      beanstalkAddress[chainId as keyof typeof beanstalkAddress],
      TokenValue.MAX_UINT256, // set max approval for beanstalk
      swapConfig.aggOut?.address || zeroAddress,
    ) as AdvancedPipeCall;
    pipeCalls.push(approveTransfer);

    // slot 4 in pipeCall
    const transferToBeanstalk = transferToken(
      swapConfig.aggOut?.address || zeroAddress,
      account.address || zeroAddress,
      zeroExQuoteResult,
      FarmFromMode.EXTERNAL,
      swapConfig.aggOut?.isWrappedNative && tokenOut.isNative ? FarmToMode.INTERNAL : destination,
      beanstalkAddress[chainId as keyof typeof beanstalkAddress],
      Clipboard.encodeSlot(2, 0, 2),
    ) as AdvancedPipeCall;
    pipeCalls.push(transferToBeanstalk);

    const advPipeCallData = advancedPipe(pipeCalls, TokenValue.ZERO);

    const postPipeCalls: { callData: `0x${string}`; clipboard: `0x${string}` }[] = [];
    if (tokenOut.isNative) {
      const unwrap = unwrapEth(
        zeroExQuoteResult,
        FarmFromMode.INTERNAL,
        Clipboard.encodeSlot(0 + farmCallData.length, calculatePipeCallClipboardSlot(pipeCalls.length, 2), 0),
      );
      postPipeCalls.push(unwrap);
    }

    return {
      output: zeroExQuoteResult,
      mode: mode,
      contractToApprove: well?.pool.address,
      farmCalls: account.address ? farmCallData : undefined,
      pipeCalls: account.address ? pipeCalls : undefined,
      pipeOutputSlot: calculatePipeCallClipboardSlot(pipeCalls.length, 2),
      callData: account.address ? [...farmCallData, advPipeCallData, ...postPipeCalls] : undefined,
      isLoading: isLoading,
    };
  }, [pathType, swapConfig, wellQuote1, zeroExQuote, account.address, amountTV, chainId, destination, isLoading, well, mode, pipeline, zeroX?.allowanceTarget, zeroX?.data, zeroX?.to, source, tokenOut.isNative, zeroExQuoteResult]);

  // biome-ignore format: keep unformatted for readability
  const wellSwapLastSwap = useMemo(() => {
    if (pathType !== "wellSwapLast") return undefined;

    if (!swapConfig.wellIn || !well?.pool || !swapConfig.wellOut || !zeroExQuote.data) return;
    const farmCallData: AdvancedFarmCall[] = [];

    if (!swapConfig.aggIn?.isNative && zeroX?.allowanceTarget !== zeroAddress) {
      const transferToPipeline = transferToken(
        swapConfig.aggIn?.address || zeroAddress,
        pipelineAddress[chainId as keyof typeof pipelineAddress],
        amountTV,
        source,
        FarmToMode.EXTERNAL,
      );
      farmCallData.push(transferToPipeline);
    }

    const pipeCalls: AdvancedPipeCall[] = [];
    if (zeroX?.allowanceTarget && zeroX.allowanceTarget !== zeroAddress) {
      const approveZeroEx = erc20Approve(
        zeroX?.allowanceTarget || zeroAddress,
        amountTV,
        swapConfig.aggIn?.address,
      ) as AdvancedPipeCall;
      pipeCalls.push(approveZeroEx);
    }
    // swap call, 0x already gives us encoded calldata, no need to use encodeFunctionData
    // slot 0 if no approval needed, 1 if needed, copy the output to subsequent calls
    pipeCalls.push({
      target: zeroX?.to || zeroAddress,
      callData: zeroX?.data || zeroAddress,
      clipboard: Clipboard.encode([], swapConfig.aggIn?.isNative ? amountTV.toBigInt() : undefined),
    });

    // slot 1 if no approval needed, 2 if needed
    const transferToWell = erc20Transfer(
      well?.pool.address,
      zeroExQuoteResult,
      swapConfig.aggOut?.address || zeroAddress,
      isWrapping ? undefined : Clipboard.encodeSlot(zeroX?.allowanceTarget !== zeroAddress ? 1 : 0, 0, 1),
    ) as AdvancedPipeCall;
    pipeCalls.push(transferToWell);

    // slot 2 if no approval needed, 3 if needed
    const wellShift = shift(
      swapConfig.wellOut?.address || zeroAddress,
      wellQuote2.amountOut.subSlippage(slippage),
      // TokenValue.ZERO,
      recipient || zeroAddress,
      well?.pool.address || zeroAddress,
    ) as AdvancedPipeCall;
    pipeCalls.push(wellShift);

    if (recipient === pipeline) {
      // send it back to user's farm balance
      const approveTransfer = erc20Approve(
        beanstalkAddress[chainId as keyof typeof beanstalkAddress],
        wellQuote2.amountOut,
        swapConfig.wellOut?.address || zeroAddress,
        Clipboard.encodeSlot(zeroX?.allowanceTarget !== zeroAddress ? 3 : 2, 0, 1),
      ) as AdvancedPipeCall;
      pipeCalls.push(approveTransfer);

      const transferToBeanstalk = transferToken(
        swapConfig.wellOut?.address || zeroAddress,
        account.address || zeroAddress,
        wellQuote2.amountOut,
        FarmFromMode.EXTERNAL,
        FarmToMode.INTERNAL,
        beanstalkAddress[chainId as keyof typeof beanstalkAddress],
        Clipboard.encodeSlot(zeroX?.allowanceTarget !== zeroAddress ? 3 : 2, 0, 2),
      ) as AdvancedPipeCall;
      pipeCalls.push(transferToBeanstalk);
    }

    const advPipeCallData = advancedPipe(
      pipeCalls,
      swapConfig.aggIn?.isNative ? amountTV : TokenValue.ZERO,
      swapConfig.aggIn?.isNative ? Clipboard.encode([], amountTV.toBigInt()) : undefined,
    );
    return {
      output: wellQuote2.amountOut,
      mode: mode,
      contractToApprove: well?.pool.address,
      farmCalls: account.address ? farmCallData : undefined,
      pipeCalls: account.address ? pipeCalls : undefined,
      pipeOutputSlot:
        zeroX?.allowanceTarget !== zeroAddress
          ? calculatePipeCallClipboardSlot(pipeCalls.length, 3)
          : calculatePipeCallClipboardSlot(pipeCalls.length, 2),
      callData: account.address ? [...farmCallData, advPipeCallData] : undefined,
      isLoading: isLoading,
    };
  }
  , [pathType, swapConfig, wellQuote2?.amountOut, zeroExQuote.data, account.address, amountTV, chainId, isWrapping, slippage, source, zeroExQuoteResult, well, mode, pipeline, isLoading, recipient, zeroX?.allowanceTarget, zeroX?.data, zeroX?.to]);

  // -------------------- WELL2WELL SWAP --------------------
  // biome-ignore format: keep unformatted for readability
  const well2WellSwap = useMemo(() => {
    if (pathType !== "well2Well" || !account.address) return undefined;
    if (!swapConfig.wellIn || !well2Well || !swapConfig.wellOut || !swapConfig.well2In || !swapConfig.well2Out) return;

    const farmCallData: AdvancedFarmCall[] = [];
    const pipeCalls: AdvancedPipeCall[] = [];

    const fromWell = well2Well.from.pool;
    const toWell = well2Well.to.pool;
    const from = tokenIn.isNative && source === FarmFromMode.EXTERNAL ? FarmFromMode.INTERNAL : source;

    if (tokenIn.isNative) {
      const wrapETH = wrapEth(amountTV, FarmToMode.INTERNAL);
      farmCallData.push(wrapETH);
    }

    // transfer user's token to well1
    const transferToWell = transferToken(
      swapConfig.wellIn.address,
      fromWell.address,
      amountTV,
      from,
      FarmToMode.EXTERNAL,
    ) as AdvancedFarmCall;
    farmCallData.push(transferToWell);

    // shift well1 output to well2
    const well1Shift = shift(
      swapConfig.wellOut.address,
      wellQuote1.amountOut.subSlippage(slippage),
      toWell.address,
      fromWell.address,
    ) as AdvancedPipeCall;
    pipeCalls.push(well1Shift);

    // if tokenOut is ETH & recipient is set to user's address, send back to pipeline instead.
    const rericipient = tokenOut.isNative && stringEq(recipient, account.address) ? pipeline : recipient;

    const well2Shift = shift(
      swapConfig.well2Out.address,
      wellQuote2.amountOut.subSlippage(slippage),
      rericipient || zeroAddress, // send back to pipeline
      toWell.address,
    ) as AdvancedPipeCall;
    pipeCalls.push(well2Shift);

    if (rericipient === pipeline) {
      const approveTransfer = erc20Approve(
        beanstalkAddress[chainId as keyof typeof beanstalkAddress],
        wellQuote2.amountOut,
        swapConfig.well2Out?.address || zeroAddress,
        Clipboard.encodeSlot(1, 0, 1), // copy from the WellShift2
      ) as AdvancedPipeCall;

      pipeCalls.push(approveTransfer);

      const transferToBeanstalk = transferToken(
        swapConfig.well2Out.address,
        account.address,
        wellQuote2.amountOut.subSlippage(slippage),
        FarmFromMode.EXTERNAL,
        tokenOut.isNative ? FarmToMode.INTERNAL : destination,
        beanstalkAddress[chainId as keyof typeof beanstalkAddress],
        Clipboard.encodeSlot(1, 0, 2), // 2 is index of amount
      ) as AdvancedPipeCall;
      pipeCalls.push(transferToBeanstalk);
    }

    const advPipeCallData = advancedPipe(pipeCalls, TokenValue.ZERO);

    farmCallData.push(advPipeCallData);

    if (tokenOut.isNative) {
      const unwrap = unwrapEth(
        wellQuote2.amountOut.subSlippage(slippage),
        FarmFromMode.INTERNAL,
        Clipboard.encodeSlot(1, calculatePipeCallClipboardSlot(pipeCalls.length, 1), 0),
      );
      farmCallData.push(unwrap);
    }

    return {
      output: wellQuote2.amountOut,
      mode,
      contractToApprove: beanstalkAddress[chainId as keyof typeof beanstalkAddress],
      farmCalls: farmCallData,
      pipeCalls: pipeCalls,
      pipeOutputSlot: undefined,
      callData: farmCallData,
      isLoading: isLoading,
    };
  }, [mode, chainId, destination, account.address, pathType, swapConfig, well2Well, isLoading, amountTV, tokenIn.isNative, tokenOut.isNative, wellQuote1.amountOut, wellQuote2.amountOut, slippage, recipient, source, pipeline]);

  // ONLY ETH -> WETH
  if (isWrapEth && wrapEthResult) {
    return wrapEthResult;
  }
  // ONLY ETH -> WETH
  else if (isUnwrapEth && unwrapEthResult) {
    return unwrapEthResult;
  }
  // STRAIGHT TOKEN -> LP -> SILO:TOKEN
  else if (isStraightDeposit && straightDepositResult) {
    return straightDepositResult;
  }
  // WELL ONLY SWAP
  else if (pathType === "wellOnly" && wellOnlySwap) {
    return wellOnlySwap;
  }
  // AGGREGATOR ONLY SWAP
  else if (pathType === "aggOnly" && aggOnlySwap) {
    return aggOnlySwap;
  }
  // WELL SWAP FIRST
  else if (pathType === "wellSwapFirst" && wellSwapFirstSwap) {
    return wellSwapFirstSwap;
  }
  // WELL SWAP LAST
  else if (pathType === "wellSwapLast" && wellSwapLastSwap) {
    return wellSwapLastSwap;
  }
  // WELL2WELL SWAP
  else if (pathType === "well2Well" && well2WellSwap) {
    return well2WellSwap;
  }

  return undefined;
}
