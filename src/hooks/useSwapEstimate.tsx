import { useAccount, useChainId } from "wagmi";
import { AdvancedPipeCall, FarmFromMode, FarmToMode, Token } from "@/utils/types";
import { TokenValue } from "@/classes/TokenValue";
import useTokenData from "@/state/useTokenData";
import { PoolData, usePriceData } from "@/state/usePriceData";
import use0x from "@/hooks/use0x";
import { zeroAddress } from "viem";
import { Clipboard } from "@/classes/Clipboard";
import { beanstalkAddress, pipelineAddress } from "@/generated/contractHooks";
import transferToken from "@/encoders/transferToken";
import shift from "@/encoders/shift";
import erc20Approve from "@/encoders/erc20Approve";
import advancedPipe from "@/encoders/advancedPipe";
import useWellSwap from "@/hooks/useWellSwap";
import erc20Transfer from "@/encoders/erc20Transfer";
import useWellAddLiquidity from "@/hooks/useWellAddLiquidity";
import sync from "@/encoders/sync";
import unwrapEth from "@/encoders/unwrapEth";

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
    const well = (tokenIn === mainToken || tokenOut === mainToken) ? poolData.pools[0] : undefined;
    const wellData = well ? well.pool : undefined;
    
    const pipeline = pipelineAddress[chainId];
    const recipient = destination === FarmToMode.EXTERNAL ? account.address : pipeline;

    const wellOnlySwap = !well ? false : well.tokens.includes(tokenIn) && well.tokens.includes(tokenOut);
    const aggOnlySwap = !well ? true : !well.tokens.includes(tokenIn) && !well.tokens.includes(tokenOut);
    const wellSwapFirst = !wellOnlySwap && tokenIn === mainToken;
    const wellSwapLast = !wellOnlySwap && tokenOut === mainToken;

    const tokenMid = wellOnlySwap ? undefined : well?.tokens.find((token) => token !== mainToken);

    let wellIn
    let wellOut
    let aggIn
    let aggOut

    if (wellOnlySwap) {
        aggIn = undefined
        aggOut = undefined
        wellIn = tokenIn
        wellOut = tokenOut
    } else if (aggOnlySwap) {
        aggIn = tokenIn
        aggOut = tokenOut.isNative ? wrappedNative : tokenOut
        wellIn = undefined
        wellOut = undefined 
    } else if (wellSwapFirst) {
        wellIn = tokenIn
        wellOut = tokenMid
        aggIn = tokenMid
        aggOut = tokenOut.isNative ? wrappedNative : tokenOut
    } else if (wellSwapLast) {
        aggIn = tokenIn
        aggOut = tokenMid
        wellIn = tokenMid
        wellOut = tokenOut
    }
    const amountTV = TokenValue.fromHuman(amount || 0, mode === "exactInput" ? tokenIn.decimals : tokenOut.decimals);

    const wellQuote1 = useWellSwap(
        amountTV,
        wellIn,
        wellOut,
        wellData?.address,
        slippage,
        mode,
        disabled || !(!!amount && amount > 0 && !!wellIn && !!wellOut && (wellOnlySwap || wellSwapFirst))
    );

    const zeroExQuote = use0x({
        buyToken: aggOut?.address || zeroAddress,
        sellToken: aggIn?.address || zeroAddress,
        buyAmount: mode === "exactOutput" ? wellSwapFirst ? wellQuote1.amountOut.toBlockchain() : amountTV.toBlockchain() : '',
        sellAmount: mode === "exactInput" ? wellSwapFirst ? wellQuote1.amountOut.toBlockchain() : amountTV.toBlockchain() : '',
        takerAddress: pipeline,
        slippagePercentage: (slippage / 100).toString(),
        skipValidation: "true",
        mode: mode,
        shouldSellEntireBalance: "true",
        enabled: !disabled || ((aggOnlySwap || wellSwapFirst || wellSwapLast) && 
            amountTV.gt(0) &&
            (wellSwapFirst ? (wellQuote1.isLoading === false && 
            wellQuote1.amountOut.gt(0)) : true))
    });
    const zeroExQuoteResult = TokenValue.fromBlockchain(zeroExQuote?.data?.buyAmount || 0, aggOut?.decimals || 0);

    const wellAddLiqQuote = useWellAddLiquidity(
     lpPool,
     aggOut,
     zeroExQuoteResult,
     slippage,
     disabled || !lpPool
    );

    const wellQuote2 = useWellSwap(
        zeroExQuoteResult,
        wellIn,
        wellOut,
        wellData?.address,
        slippage,
        mode,
        disabled || !(!!amount && amount > 0 && !!wellIn && !!wellOut && wellSwapLast &&
          (
            zeroExQuoteResult.gt(0) && 
            zeroExQuote.status === 'success' && 
            zeroExQuote.isPending === false &&
            zeroExQuote.fetchStatus === 'idle')
        )
    );

    const isLoading = wellQuote1.isLoading || zeroExQuote.isLoading || wellAddLiqQuote.isLoading || wellQuote2.isLoading;

    // TRANSFER TO PIPELINE (ETH TRANSFER HAPPENS ON ADVANCEDPIPE VALUE)
    // ADVANCEDPIPE
    //// DO THIS STUFF INSIDE ADVANCEDPIPE
    //// TRANSFER BACK TO BEANSTALK IF NECESSARY
    if (wellOnlySwap) {

        const farmCallData = [];
        const transferToWell = transferToken(
            wellIn?.address || zeroAddress,
            wellData?.address || zeroAddress,
            amountTV,
            source,
            FarmToMode.EXTERNAL
        );
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
                beanstalkAddress[chainId],
                wellQuote1.amountOut,
                wellOut?.address || zeroAddress,
                Clipboard.encodeSlot(0, 0, 1)
            ) as AdvancedPipeCall; 
            pipeCalls.push(approveTransfer);

            const transferToBeanstalk = transferToken(
                wellOut?.address || zeroAddress,
                account?.address || zeroAddress,
                wellQuote1.amountOut,
                FarmFromMode.EXTERNAL,
                FarmToMode.INTERNAL,
                beanstalkAddress[chainId],
                Clipboard.encodeSlot(0, 0, 2)
            ) as AdvancedPipeCall;
            pipeCalls.push(transferToBeanstalk);
        }; 
        const advPipeCallData = advancedPipe(
            pipeCalls,
            TokenValue.ZERO
        );
        return ({
            output: wellQuote1.amountOut,
            mode: mode,
            contractToApprove: wellData?.address,
            farmCalls: account.address ? farmCallData : undefined,
            pipeCalls: account.address ? pipeCalls : undefined,
            callData: account.address ? [
                ...farmCallData,
                advPipeCallData
            ] : undefined,
            isLoading: isLoading
        });
    } else if (aggOnlySwap && zeroExQuote.data) {
        const farmCallData = [];
        if (!aggIn?.isNative && zeroExQuote.data?.allowanceTarget !== zeroAddress) {
            const transferToPipeline = transferToken(
                aggIn?.address || zeroAddress,
                pipelineAddress[chainId],
                amountTV,
                source,
                FarmToMode.EXTERNAL
            );
            farmCallData.push(transferToPipeline);
        };

        const pipeCalls: AdvancedPipeCall[] = [];
        const needApproval = zeroExQuote.data?.allowanceTarget && zeroExQuote.data?.allowanceTarget !== zeroAddress;
        if (needApproval) {
            const approveZeroEx = erc20Approve(
                zeroExQuote.data?.allowanceTarget || zeroAddress,
                zeroExQuoteResult,
                aggIn?.address
            ) as AdvancedPipeCall;
            pipeCalls.push(approveZeroEx);
        };
        // swap call, 0x already gives us encoded calldata, no need to use encodeFunctionData
        // slot 0 if no approval needed, 1 if needed, copy the output to subsequent calls
        pipeCalls.push({
            target: zeroExQuote.data?.to || zeroAddress,
            callData: zeroExQuote.data?.data || zeroAddress,
            clipboard: Clipboard.encode([], aggIn?.isNative ? amountTV.toBigInt() : undefined)
        });

        if (lpPool) {
            // slot 1 if no approval needed, 2 if needed
            const transferToWell = erc20Transfer(
                lpPool.pool.address,
                zeroExQuoteResult,
                aggOut?.address,
                Clipboard.encodeSlot(zeroExQuote.data?.allowanceTarget !== zeroAddress ? 1 : 0, 0, 1)
            ) as AdvancedPipeCall;
            pipeCalls.push(transferToWell);
            // slot 2 if no approval needed, 3 if needed, copy output to subsequent calls
            const wellSync = sync(
                pipelineAddress[chainId],
                wellAddLiqQuote.amountOut.subSlippage(slippage),
                lpPool.pool.address || zeroAddress
            ) as AdvancedPipeCall;
            pipeCalls.push(wellSync);
            // slot 3 if no approval needed, 4 if needed
            const approveTransfer = erc20Approve(
                beanstalkAddress[chainId],
                wellAddLiqQuote.amountOut.subSlippage(slippage),
                lpPool.pool.address || zeroAddress,
                Clipboard.encodeSlot(zeroExQuote.data?.allowanceTarget !== zeroAddress ? 3 : 2, 0, 1)
            ) as AdvancedPipeCall;
            pipeCalls.push(approveTransfer);
            // slot 4 if no approval needed, 5 if needed, copy output to subsequent calls
            const transferToBeanstalk = transferToken(
                lpPool.pool.address || zeroAddress,
                account.address || zeroAddress,
                wellAddLiqQuote.amountOut.subSlippage(slippage),
                FarmFromMode.EXTERNAL,
                FarmToMode.INTERNAL,
                beanstalkAddress[chainId],
                Clipboard.encodeSlot(zeroExQuote.data.allowanceTarget !== zeroAddress ? 3 : 2, 0, 2)
            ) as AdvancedPipeCall;
            pipeCalls.push(transferToBeanstalk);
        } else {
            // slot 1 if no approval needed, 2 if needed
            const approveTransfer = erc20Approve(
                beanstalkAddress[chainId],
                zeroExQuoteResult,
                aggOut?.address || zeroAddress,
                Clipboard.encodeSlot(zeroExQuote.data.allowanceTarget !== zeroAddress ? 1 : 0, 0, 1)
            ) as AdvancedPipeCall;
            pipeCalls.push(approveTransfer);
            // slot 2 if no approval needed, 3 if needed, copy output to subsequent calls
            const transferToBeanstalk = transferToken(
                aggOut?.address || zeroAddress,
                account.address || zeroAddress,
                zeroExQuoteResult,
                FarmFromMode.EXTERNAL,
                (aggOut?.isWrappedNative && tokenOut.isNative) ? FarmToMode.INTERNAL : destination,
                beanstalkAddress[chainId],
                Clipboard.encodeSlot(zeroExQuote.data.allowanceTarget !== zeroAddress ? 1 : 0, 0, 2)
            ) as AdvancedPipeCall;
            pipeCalls.push(transferToBeanstalk);
        };
        
        const advPipeCallData = advancedPipe(
            pipeCalls,
            aggIn?.isNative ? amountTV : TokenValue.ZERO,
            aggIn?.isNative ? Clipboard.encode([], amountTV.toBigInt()) : undefined
        );
        const postPipeCalls = [];
        if (tokenOut.isNative) {
            const unwrap = unwrapEth(
                zeroExQuoteResult,
                FarmFromMode.INTERNAL,
                Clipboard.encodeSlot((0 + farmCallData.length), 9, 0)  
            );
            postPipeCalls.push(unwrap);
        };

        return ({
            output: lpPool ? wellAddLiqQuote.amountOut : zeroExQuoteResult,
            mode: mode,
            contractToApprove: wellData?.address,
            farmCalls: account.address ? farmCallData : undefined,
            pipeCalls: account.address ? pipeCalls : undefined,
            callData: account.address ? [
                ...farmCallData,
                advPipeCallData,
                ...postPipeCalls
            ] : undefined,
            isLoading: isLoading
        });
    } else if (wellSwapFirst) {

        if (!wellIn || !wellData || !wellOut || !zeroExQuote.data) return

        const farmCallData = [];
        const transferToWell = transferToken(
            wellIn?.address,
            wellData?.address,
            amountTV,
            source,
            FarmToMode.EXTERNAL
        );
        farmCallData.push(transferToWell);

        const pipeCalls: AdvancedPipeCall[] = [];
        // slot 0 in pipeCall, copy into approval step
        const wellShift = shift(
            wellOut?.address,
            wellQuote1.amountOut,
            pipeline,
            wellData?.address,
        ) as AdvancedPipeCall;
        pipeCalls.push(wellShift);

        // slot 1 in pipeCall
        const approveZeroEx = erc20Approve(
            zeroExQuote.data?.allowanceTarget || zeroAddress,
            zeroExQuoteResult,
            aggIn?.address,
            Clipboard.encodeSlot(0, 0, 1) // copy slot 0 into approval step
        ) as AdvancedPipeCall;
        pipeCalls.push(approveZeroEx);

        // swap call, 0x already gives us encoded calldata, no need to use encodeFunctionData
        // slot 2 in pipeCall
        pipeCalls.push({
            target: zeroExQuote.data?.to || zeroAddress,
            callData: zeroExQuote.data?.data || zeroAddress,
            clipboard: Clipboard.encode([])
        });

        // slot 3 in pipeCall
        const approveTransfer = erc20Approve(
            beanstalkAddress[chainId],
            zeroExQuoteResult,
            aggOut?.address || zeroAddress,
            Clipboard.encodeSlot(2, 0, 1)
        ) as AdvancedPipeCall;
        pipeCalls.push(approveTransfer);

        // slot 4 in pipeCall
        const transferToBeanstalk = transferToken(
            aggOut?.address || zeroAddress,
            account.address || zeroAddress,
            zeroExQuoteResult,
            FarmFromMode.EXTERNAL,
            (aggOut?.isWrappedNative && tokenOut.isNative) ? FarmToMode.INTERNAL : destination,
            beanstalkAddress[chainId],
            Clipboard.encodeSlot(2, 0, 2)
        ) as AdvancedPipeCall;
        pipeCalls.push(transferToBeanstalk);

        const advPipeCallData = advancedPipe(
            pipeCalls,
            TokenValue.ZERO
        );

        const postPipeCalls = [];
        if (tokenOut.isNative) {
            const unwrap = unwrapEth(
                zeroExQuoteResult,
                FarmFromMode.INTERNAL,
                Clipboard.encodeSlot((0 + farmCallData.length), 12, 0)  
            );
            postPipeCalls.push(unwrap);
        };
        
        return ({
            output: zeroExQuoteResult,
            mode: mode,
            contractToApprove: wellData?.address,
            farmCalls: account.address ? farmCallData : undefined,
            pipeCalls: account.address ? pipeCalls : undefined,
            callData: account.address ? [
                ...farmCallData,
                advPipeCallData,
                ...postPipeCalls
            ] : undefined,
            isLoading: isLoading
        })
    } else if (wellSwapLast) {

        if (!wellIn || !wellData || !wellOut || !zeroExQuote.data) return

        const farmCallData = [];
        if (!aggIn?.isNative && zeroExQuote.data?.allowanceTarget !== zeroAddress) {
            const transferToPipeline = transferToken(
                aggIn?.address || zeroAddress,
                pipelineAddress[chainId],
                amountTV,
                source,
                FarmToMode.EXTERNAL
            );
            farmCallData.push(transferToPipeline);
        };

        const pipeCalls: AdvancedPipeCall[] = [];
        if (zeroExQuote.data?.allowanceTarget && zeroExQuote.data?.allowanceTarget !== zeroAddress) {
            const approveZeroEx = erc20Approve(
                zeroExQuote.data?.allowanceTarget || zeroAddress,
                zeroExQuoteResult,
                aggIn?.address
            ) as AdvancedPipeCall;
            pipeCalls.push(approveZeroEx);
        };
        // swap call, 0x already gives us encoded calldata, no need to use encodeFunctionData
        // slot 0 if no approval needed, 1 if needed, copy the output to subsequent calls
        pipeCalls.push({
            target: zeroExQuote.data?.to || zeroAddress,
            callData: zeroExQuote.data?.data || zeroAddress,
            clipboard: Clipboard.encode([], aggIn?.isNative ? amountTV.toBigInt() : undefined)
        });

        // slot 1 if no approval needed, 2 if needed
        const transferToWell = erc20Transfer(
            wellData?.address,
            zeroExQuoteResult,
            aggOut?.address,
            Clipboard.encodeSlot(zeroExQuote.data?.allowanceTarget !== zeroAddress ? 1 : 0, 0, 1)
        ) as AdvancedPipeCall;
        pipeCalls.push(transferToWell);

        // slot 2 if no approval needed, 3 if needed
        const wellShift = shift(
            wellOut?.address || zeroAddress,
            TokenValue.ZERO, //INVESTIGATE THIS
            recipient || zeroAddress,
            wellData?.address,
        ) as AdvancedPipeCall;
        pipeCalls.push(wellShift);

        if (recipient === pipeline) {
            // send it back to user's farm balance
            const approveTransfer = erc20Approve(
                beanstalkAddress[chainId],
                wellQuote2.amountOut,
                wellOut?.address || zeroAddress,
                Clipboard.encodeSlot(zeroExQuote.data.allowanceTarget !== zeroAddress ? 3 : 2, 0, 1)
            ) as AdvancedPipeCall; 
            pipeCalls.push(approveTransfer);

            const transferToBeanstalk = transferToken(
                wellOut?.address || zeroAddress,
                account.address || zeroAddress,
                wellQuote2.amountOut,
                FarmFromMode.EXTERNAL,
                FarmToMode.INTERNAL,
                beanstalkAddress[chainId],
                Clipboard.encodeSlot(zeroExQuote.data.allowanceTarget !== zeroAddress ? 3 : 2, 0, 2)
            ) as AdvancedPipeCall;
            pipeCalls.push(transferToBeanstalk);
        };
        
        const advPipeCallData = advancedPipe(
            pipeCalls,
            aggIn?.isNative ? amountTV : TokenValue.ZERO,
            aggIn?.isNative ? Clipboard.encode([], amountTV.toBigInt()) : undefined
        );
        return ({
            output: wellQuote2.amountOut,
            mode: mode,
            contractToApprove: wellData?.address,
            farmCalls: account.address ? farmCallData : undefined,
            pipeCalls: account.address ? pipeCalls : undefined,
            callData: account.address ? [
                ...farmCallData,
                advPipeCallData
            ] : undefined,
            isLoading: isLoading
        });
    };
};