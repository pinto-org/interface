import { TokenValue } from "@/classes/TokenValue";
import AddressInputField from "@/components/AddressInputField";
import { ComboInputField } from "@/components/ComboInputField";
import DestinationBalanceSelect from "@/components/DestinationBalanceSelect";
import { MinusIcon } from "@/components/Icons";
import MultiTokenSelectWithBalances from "@/components/MultiTokenSelectWithBalances";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { useFarmerBalances } from "@/state/useFarmerBalances";
import { FarmFromMode, FarmToMode, Token } from "@/utils/types";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from "react";
import AllFarmBalances from "../../FarmBalancesList";

interface StepOneProps {
  transferData: { token: Token; amount: string }[];
  setTransferData: Dispatch<
    SetStateAction<
      {
        token: Token;
        amount: string;
      }[]
    >
  >;
  destination: string | undefined;
  setDestination: Dispatch<SetStateAction<string | undefined>>;
  balanceTo: FarmToMode;
  setBalanceTo: Dispatch<SetStateAction<FarmToMode>>;
  usingMax: boolean;
  setUsingMax: Dispatch<SetStateAction<boolean>>;
}

const variants = {
  hidden: {
    opacity: 0,
    transition: {
      opacity: { duration: 0.2 },
    },
  },
  visible: {
    opacity: 1,
    transition: {
      opacity: { duration: 0.2 },
    },
  },
  exit: {
    opacity: 0,
    transition: {
      opacity: { duration: 0.2 },
    },
  },
};

export default function StepOne({
  transferData,
  setTransferData,
  destination,
  setDestination,
  balanceTo,
  setBalanceTo,
  usingMax,
  setUsingMax,
}: StepOneProps) {
  // Get available tokens and balances
  const { balances } = useFarmerBalances();
  const [selectedTokens, setSelectedTokens] = useState<Token[]>([]);

  const tokenAndBalanceMap = useMemo(() => {
    const map = new Map<Token, TokenValue>();
    for (const [token, balance] of balances) {
      if (balance.internal.gt(0)) {
        map.set(token, balance.internal);
      }
    }
    return map;
  }, [balances]);

  const availableTokens = useMemo(() => [...tokenAndBalanceMap.keys()], [tokenAndBalanceMap]);
  const numberOfValidTokens = availableTokens.length;

  // Initialize if no data is present
  useEffect(() => {
    if (transferData.length === 0 && availableTokens.length > 0) {
      const firstToken = availableTokens[0];
      const firstBalance = tokenAndBalanceMap.get(firstToken);
      if (firstBalance) {
        setTransferData([{ token: firstToken, amount: firstBalance.toHuman() }]);
      }
    }
  }, [availableTokens, tokenAndBalanceMap]);

  const handleMaxToggle = useCallback(() => {
    if (!usingMax) {
      // Switching to max mode - set all tokens
      const allTokensData = availableTokens.map((token) => ({
        token,
        amount: tokenAndBalanceMap.get(token)?.toHuman() || "0",
      }));
      setTransferData(allTokensData);
    }
    setUsingMax(!usingMax);
  }, [usingMax, availableTokens, tokenAndBalanceMap, setTransferData, setUsingMax]);

  // Handlers
  const handleAmountChange = useCallback(
    (index: number) => (newAmount: string) => {
      setTransferData((prev) => prev.map((item, i) => (i === index ? { ...item, amount: newAmount } : item)));
    },
    [setTransferData],
  );

  const handleTokenChange = useCallback(
    (index: number) => (newToken: Token) => {
      setTransferData((prev) => {
        // Check for duplicates
        const isDuplicate = prev.some(
          (item, i) => i !== index && item.token.address.toLowerCase() === newToken.address.toLowerCase(),
        );

        if (isDuplicate) {
          // Remove duplicate entry
          return prev.filter((_, i) => i !== index);
        }

        // Update token and set default balance
        const balance = tokenAndBalanceMap.get(newToken)?.toHuman() || "0";
        return prev.map((item, i) => (i === index ? { ...item, token: newToken, amount: balance } : item));
      });
    },
    [tokenAndBalanceMap, setTransferData],
  );

  const handleRemoveLastItem = useCallback(() => {
    setTransferData((prev) => prev.slice(0, -1));
  }, [setTransferData]);

  const handleAddToken = useCallback(
    (tokens: Token[]) => {
      setTransferData((prev) => {
        const newTokens = tokens.filter(
          (token) => !prev.some((item) => item.token.address.toLowerCase() === token.address.toLowerCase()),
        );

        const newData = newTokens.map((token) => ({
          token,
          amount: tokenAndBalanceMap.get(token)?.toHuman() || "0",
        }));

        return [...prev, ...newData];
      });
    },
    [tokenAndBalanceMap, setTransferData],
  );

  useEffect(() => {
    handleAddToken(selectedTokens);
  }, [handleAddToken, selectedTokens]);

  return (
    <motion.div className="flex flex-col gap-6">
      <motion.div className="flex flex-row justify-end -mb-6 sm:mb-0 sm:-mt-[5rem]">
        <Button
          className="font-[340] text-[1rem] sm:text-[1.25rem] text-pinto-green-4 bg-transparent hover:underline hover:bg-transparent"
          onClick={handleMaxToggle}
        >
          {!usingMax ? "Send all Farm Balance tokens" : "Send only some of my Farm Balance"}
        </Button>
      </motion.div>

      <AnimatePresence mode="popLayout">
        {usingMax ? (
          <motion.div
            key="max-balance"
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex flex-col gap-2"
          >
            <Label>Amounts and tokens in my Farm Balance to send</Label>
            <AllFarmBalances />
          </motion.div>
        ) : (
          <motion.div
            key="transfer-inputs"
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex flex-col gap-4"
          >
            <AnimatePresence mode="popLayout">
              {transferData.map((tokenData, index) => (
                <motion.div
                  key={`farmbalancetransfer_${tokenData.token.address}`}
                  variants={variants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="w-full"
                >
                  <ComboInputField
                    amount={tokenData.amount}
                    setAmount={handleAmountChange(index)}
                    setToken={handleTokenChange(index)}
                    selectedToken={tokenData.token}
                    balanceFrom={FarmFromMode.INTERNAL}
                    tokenAndBalanceMap={tokenAndBalanceMap}
                  />
                </motion.div>
              ))}
            </AnimatePresence>

            <motion.div variants={variants} initial="hidden" animate="visible" className="flex flex-row gap-4">
              {transferData.length > 1 && (
                <Button
                  variant="outline"
                  className="font-[340] text-[1rem] sm:text-[1.25rem] bg-white leading-[1.1rem] sm:leading-[1.375rem] h-10 sm:h-12 px-4 rounded-full text-black w-auto gap-2"
                  onClick={handleRemoveLastItem}
                >
                  <MinusIcon color="currentColor" /> {`Remove ${transferData[transferData.length - 1].token.symbol}`}
                </Button>
              )}
              {numberOfValidTokens > 1 && numberOfValidTokens !== transferData.length && (
                <div className="flex">
                  <MultiTokenSelectWithBalances
                    setTokens={setSelectedTokens}
                    selectedTokens={transferData.map((data) => data.token)}
                    tokenAndBalanceMap={tokenAndBalanceMap}
                    customTitle="Select token(s) in your Farm Balance to send"
                  />
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div variants={variants} initial="hidden" animate="visible" className="flex flex-col gap-2">
        <Label>Send tokens to</Label>
        <AddressInputField value={destination} setValue={setDestination} />
      </motion.div>

      <motion.div variants={variants} initial="hidden" animate="visible" className="flex flex-col gap-4 items-start">
        <Label>I want to send these tokens to the recipient's:</Label>
        <DestinationBalanceSelect balanceTo={balanceTo} setBalanceTo={setBalanceTo} variant="transferFlow" />
      </motion.div>
    </motion.div>
  );
}
