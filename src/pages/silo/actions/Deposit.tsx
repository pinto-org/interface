import { TokenValue } from "@/classes/TokenValue";
import { ComboInputField } from "@/components/ComboInputField";
import SlippageButton from "@/components/SlippageButton";
import SmartSubmitButton from "@/components/SmartSubmitButton";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import deposit from "@/encoders/deposit";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import useSwapEstimate from "@/hooks/useSwapEstimate";
import { useFarmerBalances } from "@/state/useFarmerBalances";
import useFarmerDepositedBalances from "@/state/useFarmerDepositedBalances";
import { PoolData, usePriceData } from "@/state/usePriceData";
import useTokenData from "@/state/useTokenData";
import { stringEq } from "@/utils/string";
import { FarmFromMode, FarmToMode, Token } from "@/utils/types";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useWriteContract } from "wagmi";

function Deposit({ siloToken }: { siloToken: Token }) {
  // silo - deposit
  const diamondAddress = useProtocolAddress();
  const farmerBalances = useFarmerBalances();
  const depositedBalances = useFarmerDepositedBalances();

  const pools = usePriceData().pools;
  const mainToken = useTokenData().mainToken;

  const [amountIn, setAmountIn] = useState(0);
  const [tokenIn, setTokenIn] = useState(siloToken);
  const [balanceFrom, setBalanceFrom] = useState(FarmFromMode.INTERNAL_EXTERNAL);
  const [pool, setPool] = useState<PoolData | undefined>(undefined);
  const [slippage, setSlippage] = useState(0.5);

  const { writeContractAsync } = useWriteContract({
    mutation: {
      onSuccess: async () => {
        await farmerBalances.refetch();
        await depositedBalances.refetch();
        await qc.invalidateQueries({ queryKey: depositedBalances.queryKey });
        await qc.invalidateQueries({ queryKey: farmerBalances.queryKey });
        // setAmountIn(0);
      },
    },
  });
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

  const swapData = useSwapEstimate(
    tokenIn,
    siloToken,
    amountIn,
    slippage,
    "exactInput",
    balanceFrom,
    FarmToMode.INTERNAL,
    useSwap ? pool : undefined,
    !useSwap,
  );

  const onSubmit = async () => {
    const loadingToast = toast.loading("Submitting transaction...");
    try {
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

      const txn = await writeContractAsync({
        address: diamondAddress,
        abi: advFarmABI,
        functionName: "advancedFarm",
        args: [callData],
        value: value,
      });

      toast.dismiss(loadingToast);
      toast.success("Successfully deposited.");

      return txn;
    } catch (e: unknown) {
      console.error(e);
      toast.dismiss(loadingToast);
      toast.error(e instanceof Error ? e.message ?? "Transaction failed." : "Transaction failed.");
      if (e instanceof Error) {
        throw new Error(e.message ?? "Transaction failed.");
      } else {
        throw new Error("Transaction failed.");
      }
    }
  };

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
        <SmartSubmitButton token={tokenIn} amount={amountIn} submitFunction={onSubmit} submitButtonText="Deposit" />
      </div>
      <Button onClick={async () => await qc.invalidateQueries({ queryKey: depositedBalances.queryKey })}>
        invalidate depositedBalances
      </Button>
      <Button onClick={async () => await qc.invalidateQueries({ queryKey: farmerBalances.queryKey })}>
        invalidate farmerBalances
      </Button>
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
