import { Clipboard } from "@/classes/Clipboard";
import { TokenValue } from "@/classes/TokenValue";
import { ComboInputField } from "@/components/ComboInputField";
import SiloOutputDisplay from "@/components/SiloOutputDisplay";
import SlippageButton from "@/components/SlippageButton";
import SmartSubmitButton from "@/components/SmartSubmitButton";
import Text from "@/components/ui/Text";
import deposit from "@/encoders/deposit";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { usePreferredInputToken } from "@/hooks/usePreferredInputToken";
import useSwapEstimate from "@/hooks/useSwapEstimate";
import useTransaction from "@/hooks/useTransaction";
import { useFarmerBalances } from "@/state/useFarmerBalances";
import useFarmerDepositedBalances from "@/state/useFarmerDepositedBalances";
import { PoolData, usePriceData } from "@/state/usePriceData";
import { useSiloData } from "@/state/useSiloData";
import useTokenData from "@/state/useTokenData";
import { stringEq, stringToNumber } from "@/utils/string";
import { tokensEqual } from "@/utils/token";
import { FarmFromMode, FarmToMode, Token } from "@/utils/types";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useAccount } from "wagmi";

const useFilterTokens = (siloToken: Token, balances: ReturnType<typeof useFarmerBalances>["balances"]) => {
  return useMemo(() => {
    const set = new Set<Token>();

    [...balances.keys()].forEach((token) => {
      if (token.isLP && !tokensEqual(token, siloToken)) {
        set.add(token);
      }
    });

    return set;
  }, [siloToken, balances]);
};

function Deposit({ siloToken }: { siloToken: Token }) {
  const diamondAddress = useProtocolAddress();
  const farmerBalances = useFarmerBalances();
  const depositedBalances = useFarmerDepositedBalances();
  const filterTokens = useFilterTokens(siloToken, farmerBalances.balances);

  // console.log("config", config);
  const account = useAccount();

  const { preferredToken, loading: preferredLoading } = usePreferredInputToken({
    filterLP: true,
    token: siloToken,
  });

  const pools = usePriceData().pools;
  const tokenData = useTokenData();
  const mainToken = tokenData.mainToken;

  const siloData = useSiloData();

  const [didSetPreferred, setDidSetPreferred] = useState(false);
  const [amountIn, setAmountIn] = useState("0");
  const [tokenIn, setTokenIn] = useState(preferredToken);
  const [balanceFrom, setBalanceFrom] = useState(FarmFromMode.INTERNAL_EXTERNAL);
  const [pool, setPool] = useState<PoolData | undefined>(undefined);
  const [slippage, setSlippage] = useState(0.5);
  const qc = useQueryClient();

  useEffect(() => {
    // If we are still calculating the preferred token, set the token to the preferred token once it's been set.
    if (preferredLoading) return;
    if (preferredToken && !didSetPreferred) {
      setTokenIn(preferredToken);
      setDidSetPreferred(true);
    }
  }, [preferredToken, preferredLoading, didSetPreferred]);

  const useSwap = !(tokenIn.address.toLowerCase() === siloToken.address.toLowerCase());

  useEffect(() => {
    if (stringEq(siloToken.address, mainToken.address)) {
      setPool(undefined);
    } else {
      for (const pool of pools) {
        if (stringEq(pool.pool?.address, siloToken.address)) {
          setPool(pool);
          break;
        }
      }
    }
  }, [mainToken, pools, siloToken]);

  const onSuccess = useCallback(() => {
    setAmountIn("0");
    const allQueryKeys = [depositedBalances.queryKey, ...farmerBalances.queryKeys];
    allQueryKeys.forEach((query) => qc.invalidateQueries({ queryKey: query }));
  }, [qc, depositedBalances, farmerBalances]);

  const { isConfirming, writeWithEstimateGas, submitting, setSubmitting } = useTransaction({
    successCallback: onSuccess,
    successMessage: "Deposit successful",
    errorMessage: "Deposit failed",
  });

  const swapData = useSwapEstimate(
    tokenIn,
    siloToken,
    Number(amountIn),
    slippage,
    "exactInput",
    balanceFrom,
    FarmToMode.INTERNAL,
    useSwap ? pool : undefined,
    !useSwap,
  );

  const depositOutput = useMemo(() => {
    const sData = siloData.tokenData.get(siloToken);
    if (stringToNumber(amountIn) <= 0 || !sData) return undefined;
    if (tokensEqual(siloToken, tokenIn)) {
      const amount = TokenValue.fromHuman(amountIn, siloToken.decimals);

      return {
        amount,
        stalkGain: amount.mul(sData.rewards.stalk).mul(sData.tokenBDV),
        seedGain: amount.mul(sData.rewards.seeds).mul(sData.tokenBDV),
      };
    } else if (swapData?.output.gt(0)) {
      return {
        amount: swapData.output,
        stalkGain: swapData.output.mul(sData.rewards.stalk).mul(sData.tokenBDV),
        seedGain: swapData.output.mul(sData.rewards.seeds).mul(sData.tokenBDV),
      };
    }

    return undefined;
  }, [siloData, swapData?.output, siloToken, tokenIn, amountIn]);

  const onSubmit = useCallback(async () => {
    try {
      if (!account.address) {
        throw new Error("No account connected");
      }
      setSubmitting(true);
      const depositData = deposit(
        siloToken,
        useSwap ? swapData?.output : TokenValue.fromHuman(amountIn, tokenIn.decimals),
        useSwap ? FarmFromMode.INTERNAL : balanceFrom,
        swapData?.pipeOutputSlot && swapData.farmCalls
          ? Clipboard.encodeSlot(swapData.farmCalls.length || 0, swapData.pipeOutputSlot, 1)
          : undefined,
      );

      if (useSwap && swapData?.callData) {
        swapData?.callData.push(depositData);
      }

      const callData = useSwap && swapData?.callData ? swapData.callData : [depositData];
      const value = tokenIn.isNative ? TokenValue.fromHuman(amountIn, tokenIn.decimals).toBigInt() : 0n;

      toast.loading(`Depositing...`);

      return writeWithEstimateGas({
        address: diamondAddress,
        abi: advFarmABI,
        functionName: "advancedFarm",
        args: [callData],
        value: value,
      });
    } catch (e: unknown) {
      console.error(e);
      setSubmitting(false);
      toast.dismiss();
      toast.error("Deposit failed");
      throw e;
    } finally {
      setSubmitting(false);
    }
  }, [
    writeWithEstimateGas,
    setSubmitting,
    account.address,
    diamondAddress,
    siloToken,
    tokenIn,
    amountIn,
    balanceFrom,
    swapData,
    useSwap,
  ]);

  const disabled = !stringToNumber(amountIn) || !account.address || submitting || isConfirming;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="flex flex-row justify-between items-center">
          <Text variant="body-light" color="light">
            Amount and token to use
          </Text>
          <SlippageButton slippage={slippage} setSlippage={setSlippage} />
        </div>
        <ComboInputField
          amount={amountIn}
          setAmount={setAmountIn}
          setToken={setTokenIn}
          setBalanceFrom={setBalanceFrom}
          selectedToken={tokenIn}
          balanceFrom={balanceFrom}
          tokenSelectLoading={!didSetPreferred || preferredLoading}
          filterTokens={filterTokens}
        />

        {depositOutput && (
          <div className="mt-6">
            <SiloOutputDisplay
              amount={depositOutput.amount}
              token={siloToken}
              stalk={depositOutput.stalkGain}
              seeds={depositOutput.seedGain}
            />
          </div>
        )}
      </div>
      <div className="flex flex-row gap-2">
        <SmartSubmitButton
          variant="gradient"
          size="xxl"
          token={tokenIn}
          disabled={disabled}
          amount={amountIn}
          submitFunction={onSubmit}
          submitButtonText="Deposit"
        />
      </div>
    </div>
  );
}

export default Deposit;

const advFarmABI = [
  {
    type: "function",
    inputs: [
      {
        name: "data",
        internalType: "struct AdvancedFarmCall[]",
        type: "tuple[]",
        components: [
          { name: "callData", internalType: "bytes", type: "bytes" },
          { name: "clipboard", internalType: "bytes", type: "bytes" },
        ],
      },
    ],
    name: "advancedFarm",
    outputs: [{ name: "results", internalType: "bytes[]", type: "bytes[]" }],
    stateMutability: "payable",
  },
] as const;
