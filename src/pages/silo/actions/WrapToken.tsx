import { TV } from "@/classes/TokenValue";
import { ComboInputField } from "@/components/ComboInputField";
import DestinationBalanceSelect from "@/components/DestinationBalanceSelect";
import MobileActionBar from "@/components/MobileActionBar";
import SmartSubmitButton from "@/components/SmartSubmitButton";
import IconImage from "@/components/ui/IconImage";
import { Label } from "@/components/ui/Label";
import Warning from "@/components/ui/Warning";
import { siloedPintoABI } from "@/constants/abi/siloedPintoABI";
import { S_MAIN_TOKEN } from "@/constants/tokens";
import useTransaction from "@/hooks/useTransaction";
import { useFarmerBalances } from "@/state/useFarmerBalances";
import useFarmerDepositAllowance from "@/state/useFarmerDepositAllowance";
import { useFarmerSiloNew } from "@/state/useFarmerSiloNew";
import { useSiloWrappedTokenToUSD } from "@/state/useSiloWrappedTokenData";
import useTokenData from "@/state/useTokenData";
import { useChainConstant } from "@/utils/chain";
import { extractStemsAndAmountsFromCrates, sortAndPickCrates } from "@/utils/convert";
import { tryExtractErrorMessage } from "@/utils/error";
import { formatter } from "@/utils/format";
import { isValidAddress } from "@/utils/string";
import { tokensEqual } from "@/utils/token";
import { FarmToMode, Token } from "@/utils/types";
import { noop } from "@/utils/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { useAccount, useReadContract } from "wagmi";

export default function WrapToken({ siloToken }: { siloToken: Token }) {
  const farmerDeposits = useFarmerSiloNew();
  const contractSilo = useFarmerSiloNew(siloToken.address);
  const farmerBalances = useFarmerBalances();
  const { mainToken } = useTokenData();
  const { address: account } = useAccount();
  const sMainToken = useChainConstant(S_MAIN_TOKEN);
  const qc = useQueryClient();

  const [amountIn, setAmountIn] = useState<string>("0");
  const [inputError, setInputError] = useState<boolean>(false);
  const [mode, setMode] = useState<FarmToMode>(FarmToMode.EXTERNAL);

  const deposits = farmerDeposits.deposits.get(mainToken);

  const isSMainToken = tokensEqual(siloToken, sMainToken);

  const {
    allowance,
    setAllowance,
    queryKey: allowanceQueryKey,
    loading: allowanceLoading,
    confirming: allowanceConfirming,
  } = useFarmerDepositAllowance();

  const amountInTV = TV.fromHuman(amountIn, mainToken.decimals);

  const needsAllowanceIncrease = !allowanceLoading && amountInTV.gt(allowance ?? 0n);

  const quote = useReadContract({
    address: siloToken.address,
    abi: siloedPintoABI,
    functionName: "previewDeposit",
    args: [amountInTV.toBigInt()],
    query: {
      enabled: !!amountInTV.gt(0),
      select: (data) => {
        return TV.fromBigInt(data, siloToken.decimals);
      },
    },
  });

  const onSuccess = useCallback(() => {
    setAmountIn("0");
    const keys = [
      allowanceQueryKey,
      ...farmerDeposits.queryKeys,
      ...farmerBalances.queryKeys,
      ...contractSilo.queryKeys,
    ];
    keys.forEach((key) => qc.invalidateQueries({ queryKey: key }));
  }, [allowanceQueryKey, farmerDeposits.queryKeys, farmerBalances.queryKeys, contractSilo.queryKeys]);

  const { isConfirming, writeWithEstimateGas, submitting, setSubmitting } = useTransaction({
    successMessage: "Wrap successful",
    errorMessage: "Wrap failed",
    successCallback: onSuccess,
  });

  const handleWrap = useCallback(async () => {
    try {
      if (!isValidAddress(account)) {
        throw new Error("Signer required");
      }
      if (!deposits || !deposits.deposits.length) {
        throw new Error("No deposits found");
      }

      const amount = TV.fromHuman(amountIn, mainToken.decimals);

      if (amount.lte(0)) {
        throw new Error("Invalid amount");
      }

      setSubmitting(true);

      const picked = sortAndPickCrates("wrap", amount, deposits.deposits);

      const extracted = extractStemsAndAmountsFromCrates(picked.crates);

      toast.loading("Wrapping...");

      return writeWithEstimateGas({
        address: siloToken.address,
        abi: siloedPintoABI,
        functionName: "depositFromSilo",
        args: [extracted.stems, extracted.amounts, account, Number(mode)],
      });
    } catch (e: any) {
      console.error(e);
      const errorMessage = tryExtractErrorMessage(e, "Failed to wrap token.");
      toast.error(errorMessage);
      throw e;
    } finally {
      setSubmitting(false);
    }
  }, [amountIn, siloToken.decimals, deposits, mode, account]);

  const handleButtonSubmit = useCallback(async () => {
    if (needsAllowanceIncrease) {
      return setAllowance(amountInTV);
    }

    return handleWrap();
  }, [amountInTV, needsAllowanceIncrease, setAllowance, handleWrap]);

  const amountOutUSD = useSiloWrappedTokenToUSD(quote.data);

  // Tokens other than main token are not supported
  if (!isSMainToken) {
    return null;
  }

  const confirming = allowanceConfirming || isConfirming || submitting;

  const isValidAmount = amountInTV.gt(0);

  const inputDisabled = !deposits?.convertibleAmount;

  const buttonDisabled = !account || inputDisabled || submitting || isConfirming || !isValidAmount || confirming;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col">
        <Label variant="section" expanded>
          Amount of Deposited Pinto to use
        </Label>
        <ComboInputField
          amount={amountIn}
          setAmount={setAmountIn}
          setToken={noop}
          tokenNameOverride="DEP. PINTO"
          error={inputError}
          setError={setInputError}
          selectedToken={mainToken}
          customMaxAmount={deposits?.amount}
          disabled={inputDisabled}
          disableButton
          disableInput={inputDisabled}
          altText="Deposited Balance:"
          altTextMobile="Deposited:"
        />
      </div>
      <div className="flex flex-row w-full justify-between items-center">
        <div className="pinto-sm sm:pinto-body-light sm:text-pinto-light text-pinto-light">I receive</div>
        <div className="flex flex-col gap-1 text-right">
          <div className="pinto-h3 flex flex-row gap-2 items-center whitespace-nowrap self-end">
            <IconImage src={siloToken.logoURI} size={6} />
            <span>
              {formatter.token(quote.data ?? 0n, siloToken)} {siloToken.symbol}
            </span>
          </div>
          <div className="pinto-sm-light text-pinto-light">{formatter.usd(amountOutUSD.totalUSD)}</div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="h-10 pinto-sm sm:pinto-body-light sm:text-pinto-light text-pinto-light">
          Receive {siloToken.symbol} to my
        </div>
        <DestinationBalanceSelect setBalanceTo={setMode} balanceTo={mode} />
      </div>
      <Warning variant="info">
        <div className="pinto-sm-light text-pinto-light">
          Unwrapping sPinto in the future will result in receiving Stalk and Seed associated with the{" "}
          <span className="text-pinto-primary font-medium">most recently wrapped Pinto.</span>
        </div>
      </Warning>
      <div className="flex-row gap-2 hidden sm:flex">
        <SmartSubmitButton
          submitFunction={handleButtonSubmit}
          disabled={buttonDisabled}
          submitButtonText={needsAllowanceIncrease ? "Approve" : "Wrap"}
          variant="gradient"
          size="xxl"
        />
      </div>
      <MobileActionBar>
        <SmartSubmitButton
          submitFunction={handleButtonSubmit}
          disabled={buttonDisabled}
          submitButtonText={needsAllowanceIncrease ? "Approve" : "Wrap"}
          variant="gradient"
          className="h-full"
          size="xxl"
        />
      </MobileActionBar>
    </div>
  );
}
