import { useFarmerSilo } from "@/state/useFarmerSilo";
import useTokenData from "@/state/useTokenData";
import { parseRedemptionAmount } from "@/utils/siloRedemption";
import type { Token } from "@/utils/types";
import { useCallback, useState } from "react";
import RoutedRedemption from "./RoutedRedemption";
import Withdraw from "./Withdraw";
import WithdrawAs from "./WithdrawAs";

export default function UnifiedWithdrawal({
  siloToken,
  onBusyChange,
}: {
  siloToken: Token;
  onBusyChange: (busy: boolean) => void;
}) {
  const tokens = useTokenData();
  const farmer = useFarmerSilo();
  const [amount, setAmount] = useState("");
  const [output, setOutput] = useState(siloToken);
  const [busy, setBusy] = useState(false);
  const updateBusy = useCallback(
    (value: boolean) => {
      setBusy(value);
      onBusyChange(value);
    },
    [onBusyChange],
  );
  const outputs = [
    siloToken,
    ...tokens.preferredTokens.filter(
      (token) => !token.isNative && !token.isLP && token.address.toLowerCase() !== siloToken.address.toLowerCase(),
    ),
  ];
  const sameToken = output.address.toLowerCase() === siloToken.address.toLowerCase();
  let estimated: bigint | undefined;
  try {
    const parsed = parseRedemptionAmount(amount, siloToken.decimals);
    const deposit = farmer.deposits.get(siloToken);
    const available = (deposit?.unlockedAmount ?? deposit?.amount)?.toBigInt() ?? 0n;
    if (!farmer.depositsError && parsed > 0n && parsed <= available) estimated = parsed;
  } catch {
    /* Empty or invalid inputs do not have an estimate. */
  }
  const selectOutput = (token: Token) => {
    if (!busy) setOutput(token);
  };
  return sameToken ? (
    <Withdraw
      siloToken={siloToken}
      onBusyChange={updateBusy}
      unified={{
        amount,
        setAmount,
        output: (
          <WithdrawAs
            token={output}
            outputs={outputs}
            onChange={selectOutput}
            disabled={busy}
            estimated={estimated}
            sameToken
          />
        ),
      }}
    />
  ) : (
    <RoutedRedemption
      siloToken={siloToken}
      onBusyChange={updateBusy}
      unified={{ amount, setAmount, outputToken: output, outputs, onOutputChange: selectOutput }}
    />
  );
}
