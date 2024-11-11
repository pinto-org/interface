import { TokenValue } from "@/classes/TokenValue";
import { ComboInputField } from "@/components/ComboInputField";
import SlippageButton from "@/components/SlippageButton";
import SmartSubmitButton from "@/components/SmartSubmitButton";
import { Label } from "@/components/ui/Label";
import deposit from "@/encoders/deposit";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import useSwapEstimate from "@/hooks/useSwapEstimate";
import useTransaction from "@/hooks/useTransaction";
import { useFarmerBalances } from "@/state/useFarmerBalances";
import useFarmerDepositedBalances from "@/state/useFarmerDepositedBalances";
import { PoolData, usePriceData } from "@/state/usePriceData";
import useTokenData from "@/state/useTokenData";
import { formatter } from "@/utils/format";
import { stringEq, stringToNumber } from "@/utils/string";
import { FarmFromMode, FarmToMode, Token } from "@/utils/types";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useAccount } from "wagmi";

function Deposit({ siloToken }: { siloToken: Token }) {
  // silo - deposit
  const diamondAddress = useProtocolAddress();
  const farmerBalances = useFarmerBalances();
  const depositedBalances = useFarmerDepositedBalances();
  const account = useAccount();

  const pools = usePriceData().pools;
  const mainToken = useTokenData().mainToken;

  const [amountIn, setAmountIn] = useState("0");
  const [tokenIn, setTokenIn] = useState(siloToken);
  const [balanceFrom, setBalanceFrom] = useState(FarmFromMode.INTERNAL_EXTERNAL);
  const [pool, setPool] = useState<PoolData | undefined>(undefined);
  const [slippage, setSlippage] = useState(0.5);

  const qc = useQueryClient();

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
    qc.invalidateQueries({ queryKey: depositedBalances.queryKey });
    qc.invalidateQueries({ queryKey: farmerBalances.queryKey });
  }, [qc, depositedBalances, farmerBalances]);

  const { isConfirming, writeContractAsync } = useTransaction({
    successMessage: "Deposit successful",
    successCallback: onSuccess,
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

  const onSubmit = async () => {
    try {
      if (!account.address) {
        throw new Error("No account connected");
      }
      const depositData = deposit(
        siloToken,
        useSwap ? swapData?.output : TokenValue.fromHuman(amountIn, tokenIn.decimals),
        useSwap ? FarmFromMode.INTERNAL : balanceFrom,
      );

      if (useSwap && swapData?.callData) {
        swapData?.callData.push(depositData);
      }

      const callData = useSwap && swapData?.callData ? swapData.callData : [depositData];
      const value = tokenIn.isNative ? TokenValue.fromHuman(amountIn, tokenIn.decimals).toBigInt() : 0n;

      const depositAmount = formatter.token(useSwap ? swapData?.output : amountIn, siloToken);

      const formattedAmountIn = formatter.token(amountIn, tokenIn);

      toast.loading(`Depositing ${formattedAmountIn} ${tokenIn.symbol} for ${depositAmount} ${siloToken.symbol}...`);

      return writeContractAsync({
        address: diamondAddress,
        abi: advFarmABI,
        functionName: "advancedFarm",
        args: [callData],
        value: value,
      });
    } catch (e: unknown) {
      console.error(e);
      toast.dismiss();
      toast.error(e instanceof Error ? e.message : "Transaction failed.");
      throw e;
    }
  };

  const disabled = !stringToNumber(amountIn) || !account.address || isConfirming;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="flex flex-row justify-between items-center">
          <Label>Amount and Token to use</Label>
          <SlippageButton slippage={slippage} setSlippage={setSlippage} />
        </div>
        <ComboInputField
          amount={amountIn}
          setAmount={setAmountIn}
          setToken={setTokenIn}
          setBalanceFrom={setBalanceFrom}
          selectedToken={tokenIn}
          balanceFrom={balanceFrom}
        />
      </div>
      <div className="flex flex-row gap-2">
        <SmartSubmitButton
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
