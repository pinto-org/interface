import { Clipboard } from "@/classes/Clipboard";
import { TokenValue } from "@/classes/TokenValue";
import advancedPipe from "@/encoders/advancedPipe";
import erc20Approve from "@/encoders/erc20Approve";
import erc20Transfer from "@/encoders/erc20Transfer";
import shift from "@/encoders/shift";
import sync from "@/encoders/sync";
import transferToken from "@/encoders/transferToken";
import unwrapEth from "@/encoders/unwrapEth";
import wrapEth from "@/encoders/wrapEth";
import { beanstalkAddress, pipelineAddress } from "@/generated/contractHooks";
import use0x from "@/hooks/use0x";
import useWellAddLiquidity from "@/hooks/useWellAddLiquidity";
import useWellSwap from "@/hooks/useWellSwap";
import { PoolData, usePriceData } from "@/state/usePriceData";
import useTokenData from "@/state/useTokenData";
import { AdvancedFarmCall, AdvancedPipeCall, FarmFromMode, FarmToMode, Token } from "@/utils/types";
import { calculatePipeCallClipboardSlot } from "@/utils/utils";
import { zeroAddress } from "viem";
import { useAccount, useChainId } from "wagmi";

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

  const poolData = usePriceData();
  const well = tokenIn === mainToken || tokenOut === mainToken ? poolData.pools[0] : undefined;
  const wellData = well ? well.pool : undefined;

  const pipeline = pipelineAddress[chainId as keyof typeof pipelineAddress];
  const recipient = destination === FarmToMode.EXTERNAL ? account.address : pipeline;

  const wellOnlySwap = !well ? false : well.tokens.includes(tokenIn) && well.tokens.includes(tokenOut);
  const aggOnlySwap = !well ? true : !well.tokens.includes(tokenIn) && !well.tokens.includes(tokenOut);
  const wellSwapFirst = !wellOnlySwap && tokenIn === mainToken;
  const wellSwapLast = !wellOnlySwap && tokenOut === mainToken;

  const tokenMid =
    tokenOut.isLP && lpPool
      ? lpPool.tokens.find((token) => token !== mainToken)
      : well?.tokens.find((token) => token !== mainToken);

  const isWrapEth = tokenIn.isNative && tokenOut.isWrappedNative;
  const isUnwrapEth = tokenIn.isWrappedNative && tokenOut.isNative;

  const isStraightDeposit = lpPool?.tokens.includes(tokenIn) && tokenOut.isLP;

  const isWrapUnwrap = isWrapEth || isUnwrapEth;

  let wellIn: Token | undefined;
  let wellOut: Token | undefined;
  let aggIn: Token | undefined;
  let aggOut: Token | undefined;

  if (wellOnlySwap) {
    aggIn = undefined;
    aggOut = undefined;
    wellIn = tokenIn;
    wellOut = tokenOut;
  } else if (aggOnlySwap) {
    aggIn = tokenIn;
    aggOut = tokenOut.isNative ? wrappedNative : tokenOut.isLP ? tokenMid : tokenOut;
    wellIn = undefined;
    wellOut = undefined;
  } else if (wellSwapFirst) {
    wellIn = tokenIn;
    wellOut = tokenMid;
    aggIn = tokenMid;
    aggOut = tokenOut.isNative ? wrappedNative : tokenOut;
  } else if (wellSwapLast) {
    aggIn = tokenIn;
    aggOut = tokenMid;
    wellIn = tokenMid;
    wellOut = tokenOut;
  }
  const amountTV = TokenValue.fromHuman(amount || 0, mode === "exactInput" ? tokenIn.decimals : tokenOut.decimals);

  const wellQuote1 = useWellSwap(
    amountTV,
    wellIn,
    wellOut,
    wellData?.address,
    slippage,
    mode,
    disabled ||
      isStraightDeposit ||
      isWrapUnwrap ||
      !(!!amount && amount > 0 && !!wellIn && !!wellOut && (wellOnlySwap || wellSwapFirst)),
  );

  const zeroExQuote = use0x({
    buyToken: aggOut?.address || zeroAddress,
    sellToken: aggIn?.address || zeroAddress,
    buyAmount:
      mode === "exactOutput" ? (wellSwapFirst ? wellQuote1.amountOut.toBlockchain() : amountTV.toBlockchain()) : "",
    sellAmount:
      mode === "exactInput" ? (wellSwapFirst ? wellQuote1.amountOut.toBlockchain() : amountTV.toBlockchain()) : "",
    takerAddress: pipeline,
    slippagePercentage: (slippage / 100).toString(),
    skipValidation: "true",
    mode: mode,
    shouldSellEntireBalance: "true",
    enabled:
      !disabled ||
      isStraightDeposit ||
      isWrapUnwrap ||
      ((aggOnlySwap || wellSwapFirst || wellSwapLast) &&
        amountTV.gt(0) &&
        (wellSwapFirst ? wellQuote1.isLoading === false && wellQuote1.amountOut.gt(0) : true)),
  });
  const zeroX = zeroExQuote?.data?.[0];
  const zeroExQuoteResult = TokenValue.fromBlockchain(zeroX?.buyAmount || 0, aggOut?.decimals || 0);

  const wellAddLiqQuote = useWellAddLiquidity(
    lpPool,
    isStraightDeposit ? tokenIn : aggOut,
    isStraightDeposit ? TokenValue.fromHuman(amount, tokenIn.decimals) : zeroExQuoteResult,
    slippage,
    disabled || isWrapUnwrap || !lpPool,
  );

  const wellQuote2 = useWellSwap(
    zeroExQuoteResult,
    wellIn,
    wellOut,
    wellData?.address,
    slippage,
    mode,
    disabled ||
      isStraightDeposit ||
      isWrapUnwrap ||
      !(
        !!amount &&
        amount > 0 &&
        !!wellIn &&
        !!wellOut &&
        wellSwapLast &&
        zeroExQuoteResult.gt(0) &&
        zeroExQuote.status === "success" &&
        zeroExQuote.isPending === false &&
        zeroExQuote.fetchStatus === "idle"
      ),
  );

  const isLoading = wellQuote1.isLoading || zeroExQuote.isLoading || wellAddLiqQuote.isLoading || wellQuote2.isLoading;

  if (isWrapEth) {
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
  } else if (isUnwrapEth) {
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
  } else if (isStraightDeposit) {
    if (!lpPool || !tokenIn) return;
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
      lpPool.pool.address || zeroAddress,
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
      contractToApprove: wellData?.address,
      farmCalls: account.address ? farmCallData : undefined,
      pipeCalls: account.address ? pipeCalls : undefined,
      pipeOutputSlot: calculatePipeCallClipboardSlot(pipeCalls.length, 1),
      callData: account.address ? [...farmCallData, advPipeCallData] : undefined,
      isLoading: isLoading,
    };
  } else if (wellOnlySwap) {
    const farmCallData: AdvancedFarmCall[] = [];
    const transferToWell = transferToken(
      wellIn?.address || zeroAddress,
      wellData?.address || zeroAddress,
      amountTV,
      source,
      FarmToMode.EXTERNAL,
    ) as AdvancedFarmCall;
    farmCallData.push(transferToWell);

    const pipeCalls: AdvancedPipeCall[] = [];
    // slot 0 in pipeCall, copy the output to subsequent calls
    const wellShift = shift(
      wellOut?.address || zeroAddress,
      wellQuote1.amountOut,
      recipient || zeroAddress,
      wellData?.address || zeroAddress,
    ) as AdvancedPipeCall;
    pipeCalls.push(wellShift);

    if (recipient === pipeline) {
      // send it back to user's farm balance
      const approveTransfer = erc20Approve(
        beanstalkAddress[chainId as keyof typeof beanstalkAddress],
        wellQuote1.amountOut,
        wellOut?.address || zeroAddress,
        Clipboard.encodeSlot(0, 0, 1),
      ) as AdvancedPipeCall;
      pipeCalls.push(approveTransfer);

      const transferToBeanstalk = transferToken(
        wellOut?.address || zeroAddress,
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
      contractToApprove: wellData?.address,
      farmCalls: account.address ? farmCallData : undefined,
      pipeCalls: account.address ? pipeCalls : undefined,
      pipeOutputSlot: calculatePipeCallClipboardSlot(pipeCalls.length, 0),
      callData: account.address ? [...farmCallData, advPipeCallData] : undefined,
      isLoading: isLoading,
    };
  } else if (aggOnlySwap && zeroExQuote.data) {
    const farmCallData: AdvancedFarmCall[] = [];
    if (!aggIn?.isNative && zeroX?.allowanceTarget !== zeroAddress) {
      const transferToPipeline = transferToken(
        aggIn?.address || zeroAddress,
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
        aggIn?.address,
      ) as AdvancedPipeCall;
      pipeCalls.push(approveZeroEx);
    }
    // swap call, 0x already gives us encoded calldata, no need to use encodeFunctionData
    // slot 0 if no approval needed, 1 if needed, copy the output to subsequent calls
    pipeCalls.push({
      target: zeroX?.to || zeroAddress,
      callData: zeroX?.data || zeroAddress,
      clipboard: Clipboard.encode([], aggIn?.isNative ? amountTV.toBigInt() : undefined),
    });

    if (lpPool) {
      // slot 1 if no approval needed, 2 if needed
      const transferToWell = erc20Transfer(
        lpPool.pool.address,
        zeroExQuoteResult,
        aggOut?.address,
        Clipboard.encodeSlot(zeroX?.allowanceTarget !== zeroAddress ? 1 : 0, 0, 1),
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
        aggOut?.address || zeroAddress,
        Clipboard.encodeSlot(zeroX?.allowanceTarget !== zeroAddress ? 1 : 0, 0, 1),
      ) as AdvancedPipeCall;
      pipeCalls.push(approveTransfer);
      // slot 2 if no approval needed, 3 if needed
      const transferToBeanstalk = transferToken(
        aggOut?.address || zeroAddress,
        account.address || zeroAddress,
        zeroExQuoteResult,
        FarmFromMode.EXTERNAL,
        aggOut?.isWrappedNative && tokenOut.isNative ? FarmToMode.INTERNAL : destination,
        beanstalkAddress[chainId as keyof typeof beanstalkAddress],
        Clipboard.encodeSlot(zeroX?.allowanceTarget !== zeroAddress ? 1 : 0, 0, 2),
      ) as AdvancedPipeCall;
      pipeCalls.push(transferToBeanstalk);
    }

    const advPipeCallData = advancedPipe(
      pipeCalls,
      aggIn?.isNative ? amountTV : TokenValue.ZERO,
      aggIn?.isNative ? Clipboard.encode([], amountTV.toBigInt()) : undefined,
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
      contractToApprove: wellData?.address,
      farmCalls: account.address ? farmCallData : undefined,
      pipeCalls: account.address ? pipeCalls : undefined,
      pipeOutputSlot: lpPool
        ? zeroX?.allowanceTarget !== zeroAddress
          ? calculatePipeCallClipboardSlot(pipeCalls.length, 3)
          : calculatePipeCallClipboardSlot(pipeCalls.length, 2)
        : zeroX?.allowanceTarget !== zeroAddress
          ? calculatePipeCallClipboardSlot(pipeCalls.length, 1)
          : calculatePipeCallClipboardSlot(pipeCalls.length, 0),
      callData: account.address ? [...farmCallData, advPipeCallData, ...postPipeCalls] : undefined,
      isLoading: isLoading,
    };
  } else if (wellSwapFirst) {
    if (!wellIn || !wellData || !wellOut || !zeroExQuote.data) return;

    const farmCallData: AdvancedFarmCall[] = [];
    const transferToWell = transferToken(wellIn?.address, wellData?.address, amountTV, source, FarmToMode.EXTERNAL);
    farmCallData.push(transferToWell);

    const pipeCalls: AdvancedPipeCall[] = [];
    // slot 0 in pipeCall, copy into approval step
    const wellShift = shift(wellOut?.address, wellQuote1.amountOut, pipeline, wellData?.address) as AdvancedPipeCall;
    pipeCalls.push(wellShift);

    // slot 1 in pipeCall
    const approveZeroEx = erc20Approve(
      zeroX?.allowanceTarget || zeroAddress,
      wellQuote1.amountOut,
      aggIn?.address,
      Clipboard.encodeSlot(0, 0, 1), // copy slot 0 into approval step
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
      zeroExQuoteResult,
      aggOut?.address || zeroAddress,
      Clipboard.encodeSlot(2, 0, 1),
    ) as AdvancedPipeCall;
    pipeCalls.push(approveTransfer);

    // slot 4 in pipeCall
    const transferToBeanstalk = transferToken(
      aggOut?.address || zeroAddress,
      account.address || zeroAddress,
      zeroExQuoteResult,
      FarmFromMode.EXTERNAL,
      aggOut?.isWrappedNative && tokenOut.isNative ? FarmToMode.INTERNAL : destination,
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
      contractToApprove: wellData?.address,
      farmCalls: account.address ? farmCallData : undefined,
      pipeCalls: account.address ? pipeCalls : undefined,
      pipeOutputSlot: calculatePipeCallClipboardSlot(pipeCalls.length, 2),
      callData: account.address ? [...farmCallData, advPipeCallData, ...postPipeCalls] : undefined,
      isLoading: isLoading,
    };
  } else if (wellSwapLast) {
    if (!wellIn || !wellData || !wellOut || !zeroExQuote.data) return;
    const farmCallData: AdvancedFarmCall[] = [];
    if (!aggIn?.isNative && zeroX?.allowanceTarget !== zeroAddress) {
      const transferToPipeline = transferToken(
        aggIn?.address || zeroAddress,
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
        aggIn?.address,
      ) as AdvancedPipeCall;
      pipeCalls.push(approveZeroEx);
    }
    // swap call, 0x already gives us encoded calldata, no need to use encodeFunctionData
    // slot 0 if no approval needed, 1 if needed, copy the output to subsequent calls
    pipeCalls.push({
      target: zeroX?.to || zeroAddress,
      callData: zeroX?.data || zeroAddress,
      clipboard: Clipboard.encode([], aggIn?.isNative ? amountTV.toBigInt() : undefined),
    });

    // slot 1 if no approval needed, 2 if needed
    const transferToWell = erc20Transfer(
      wellData?.address,
      zeroExQuoteResult,
      aggOut?.address,
      Clipboard.encodeSlot(zeroX?.allowanceTarget !== zeroAddress ? 1 : 0, 0, 1),
    ) as AdvancedPipeCall;
    pipeCalls.push(transferToWell);

    // slot 2 if no approval needed, 3 if needed
    const wellShift = shift(
      wellOut?.address || zeroAddress,
      wellQuote2.amountOut.subSlippage(slippage),
      recipient || zeroAddress,
      wellData?.address,
    ) as AdvancedPipeCall;
    pipeCalls.push(wellShift);

    if (recipient === pipeline) {
      // send it back to user's farm balance
      const approveTransfer = erc20Approve(
        beanstalkAddress[chainId as keyof typeof beanstalkAddress],
        wellQuote2.amountOut,
        wellOut?.address || zeroAddress,
        Clipboard.encodeSlot(zeroX?.allowanceTarget !== zeroAddress ? 3 : 2, 0, 1),
      ) as AdvancedPipeCall;
      pipeCalls.push(approveTransfer);

      const transferToBeanstalk = transferToken(
        wellOut?.address || zeroAddress,
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
      aggIn?.isNative ? amountTV : TokenValue.ZERO,
      aggIn?.isNative ? Clipboard.encode([], amountTV.toBigInt()) : undefined,
    );
    return {
      output: wellQuote2.amountOut,
      mode: mode,
      contractToApprove: wellData?.address,
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
}
