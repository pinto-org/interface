import AddressInputField from "@/components/AddressInputField";
import FertilizerCard from "@/components/FertilizerCard";
import PintoAssetTransferNotice from "@/components/PintoAssetTransferNotice";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { useFarmerBeanstalkRepayment } from "@/state/useFarmerBeanstalkRepayment";
import { formatter } from "@/utils/format";
import { AnimatePresence, motion } from "framer-motion";
import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { type FertilizerTransferItem } from "../TransferBeanstalkFertilizer";

interface StepOneProps {
  selectedIds: FertilizerTransferItem[];
  setSelectedIds: Dispatch<SetStateAction<FertilizerTransferItem[]>>;
  destination: string | undefined;
  setDestination: Dispatch<SetStateAction<string | undefined>>;
  transferNotice: boolean;
  setTransferNotice: Dispatch<SetStateAction<boolean>>;
}

const variants = {
  hidden: {
    opacity: 0,
    transition: { opacity: { duration: 0.2 } },
  },
  visible: {
    opacity: 1,
    transition: { opacity: { duration: 0.2 } },
  },
  exit: {
    opacity: 0,
    transition: { opacity: { duration: 0.2 } },
  },
};

export default function StepOne({
  selectedIds,
  setSelectedIds,
  destination,
  setDestination,
  transferNotice,
  setTransferNotice,
}: StepOneProps) {
  const repayment = useFarmerBeanstalkRepayment();
  const fertilizerIds = repayment.fertilizer.fertilizerIds;
  const perIdData = repayment.fertilizer.perIdData;

  // Get actual balance per fertilizer ID from on-chain data
  const getFertilizerBalance = useCallback(
    (fertId: bigint): bigint => {
      return perIdData.get(fertId.toString())?.balance ?? 0n;
    },
    [perIdData],
  );

  // Local state for amount inputs per fertilizer ID
  const [amounts, setAmounts] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const item of selectedIds) {
      initial[item.id.toString()] = item.value.toString();
    }
    return initial;
  });

  // Track which fertilizers are selected (have amount > 0)
  const [selected, setSelected] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    for (const item of selectedIds) {
      if (item.value > 0n) {
        initial.add(item.id.toString());
      }
    }
    return initial;
  });

  const toggleSelection = useCallback(
    (fertId: bigint) => {
      const idStr = fertId.toString();
      const balance = getFertilizerBalance(fertId);
      setSelected((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(idStr)) {
          newSet.delete(idStr);
          // Clear amount when deselecting
          setAmounts((prevAmounts) => ({ ...prevAmounts, [idStr]: "" }));
          setSelectedIds((prev) => prev.filter((item) => item.id !== fertId));
        } else {
          newSet.add(idStr);
          // Set default amount to full balance when selecting
          const defaultAmount = balance > 0n ? balance : 1n;
          setAmounts((prevAmounts) => ({ ...prevAmounts, [idStr]: defaultAmount.toString() }));
          setSelectedIds((prev) => [...prev, { id: fertId, value: defaultAmount }]);
        }
        return newSet;
      });
    },
    [setSelectedIds, getFertilizerBalance],
  );

  const handleAmountChange = useCallback(
    (fertId: bigint, value: string, maxBalance: bigint) => {
      const idStr = fertId.toString();

      // Validate against max balance
      let numValue = value === "" ? 0n : BigInt(Math.max(0, Math.floor(Number(value))));
      if (numValue > maxBalance) {
        numValue = maxBalance;
      }

      const displayValue = numValue === 0n ? "" : numValue.toString();
      setAmounts((prev) => ({ ...prev, [idStr]: displayValue }));

      // Update selectedIds with the new amount
      setSelectedIds((prev) => {
        const existing = prev.find((item) => item.id === fertId);
        if (numValue === 0n) {
          // Remove if amount is 0
          setSelected((prevSelected) => {
            const newSet = new Set(prevSelected);
            newSet.delete(idStr);
            return newSet;
          });
          return prev.filter((item) => item.id !== fertId);
        }
        // Auto-select if amount is entered
        setSelected((prevSelected) => new Set(prevSelected).add(idStr));
        if (existing) {
          // Update existing
          return prev.map((item) => (item.id === fertId ? { ...item, value: numValue } : item));
        }
        // Add new
        return [...prev, { id: fertId, value: numValue }];
      });
    },
    [setSelectedIds],
  );

  const selectAll = useCallback(() => {
    const newAmounts: Record<string, string> = {};
    const newSelectedIds: FertilizerTransferItem[] = [];
    const newSelected = new Set<string>();

    for (const fertId of fertilizerIds) {
      const idStr = fertId.toString();
      const balance = getFertilizerBalance(fertId);
      const amount = balance > 0n ? balance : 1n;
      newAmounts[idStr] = amount.toString();
      newSelectedIds.push({ id: fertId, value: amount });
      newSelected.add(idStr);
    }

    setAmounts(newAmounts);
    setSelectedIds(newSelectedIds);
    setSelected(newSelected);
  }, [fertilizerIds, setSelectedIds, getFertilizerBalance]);

  if (fertilizerIds.length === 0) {
    return (
      <div className="flex flex-col gap-4 items-center py-8">
        <div className="pinto-sm text-pinto-light">No Beanstalk Repayment Fertilizer found.</div>
      </div>
    );
  }

  return (
    <motion.div className="flex flex-col gap-6">
      <div className="flex flex-row justify-end -mt-[3.5rem] sm:-mt-[5rem]">
        <Button
          className="font-[340] sm:pr-0 text-[1rem] sm:text-[1.25rem] text-pinto-green-4 bg-transparent hover:underline hover:bg-transparent"
          onClick={selectAll}
        >
          Select all
        </Button>
      </div>

      <motion.div variants={variants} initial="hidden" animate="visible" className="flex flex-col gap-4">
        <Label>Select Fertilizer to send:</Label>
        <div className="flex flex-col gap-3">
          {fertilizerIds.map((fertId) => {
            const idStr = fertId.toString();
            const amount = amounts[idStr] || "";
            const isSelected = selected.has(idStr);
            const detail = perIdData.get(idStr);
            const maxBalance = detail?.balance ?? 0n;
            // Format sprouts: raw value is balance * remainingBpf (no decimals on balance, 6 decimals on bpf)
            const sproutsRaw = detail?.sprouts ?? 0n;
            const sprouts = formatter.number(Number(sproutsRaw) / 1e6);
            const humidity = detail?.humidity !== undefined ? `${formatter.number(detail.humidity)}%` : "—";

            return (
              <FertilizerCard
                key={`fert_${idStr}`}
                fertId={fertId}
                amount={amount}
                isSelected={isSelected}
                maxBalance={maxBalance}
                sprouts={sprouts}
                humidity={humidity}
                onToggleSelection={toggleSelection}
                onAmountChange={handleAmountChange}
              />
            );
          })}
        </div>
      </motion.div>

      <motion.div variants={variants} initial="hidden" animate="visible" className="flex flex-col gap-2">
        <Label>Send to</Label>
        <AddressInputField value={destination} setValue={setDestination} />
        <AnimatePresence>
          {destination && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <PintoAssetTransferNotice
                transferNotice={transferNotice}
                setTransferNotice={setTransferNotice}
                variant="walletBalance"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
