import AddressInputField from "@/components/AddressInputField";
import CheckmarkCircle from "@/components/CheckmarkCircle";
import PintoAssetTransferNotice from "@/components/PintoAssetTransferNotice";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/Table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/ToggleGroup";
import { useFarmerBeanstalkRepayment } from "@/state/useFarmerBeanstalkRepayment";
import { formatter } from "@/utils/format";
import { AnimatePresence, motion } from "framer-motion";
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
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

  const [selected, setSelected] = useState<string[]>(() => selectedIds.map((item) => item.id.toString()));

  useEffect(() => {
    const restored: string[] = [];
    for (const item of selectedIds) {
      if (fertilizerIds.includes(item.id)) {
        restored.push(item.id.toString());
      }
    }
    setSelected(restored);
  }, []);

  const handleSelection = useCallback(
    (value: string[]) => {
      setSelected(value);

      const items: FertilizerTransferItem[] = value
        .map((idStr) => {
          const id = BigInt(idStr);
          // For now, transfer the full balance (value=1 per ERC-1155 token unit)
          // The actual balance per ID would come from on-chain data
          return { id, value: 1n };
        })
        .filter((item) => fertilizerIds.includes(item.id));

      setSelectedIds(items);
    },
    [fertilizerIds, setSelectedIds],
  );

  const selectAll = useCallback(() => {
    const allIds = fertilizerIds.map((id) => id.toString());
    handleSelection(allIds);
  }, [fertilizerIds, handleSelection]);

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
          Select all Fertilizer
        </Button>
      </div>

      <motion.div variants={variants} initial="hidden" animate="visible" className="flex flex-col gap-4">
        <Label>Which Fertilizer IDs do you want to send?</Label>
        <ToggleGroup
          type="multiple"
          value={selected}
          onValueChange={handleSelection}
          className="flex flex-col w-auto h-auto justify-between gap-2"
        >
          <Table>
            <TableBody className="[&_tr:first-child]:border-t [&_tr:last-child]:border-b">
              {fertilizerIds.map((fertId) => (
                <ToggleGroupItem
                  value={fertId.toString()}
                  aria-label={`Select Fertilizer ID ${fertId.toString()}`}
                  key={`toggle_fert_${fertId.toString()}`}
                  asChild
                >
                  <TableRow className="h-[4.5rem] bg-transparent items-center hover:bg-pinto-green-1/50 hover:cursor-pointer">
                    <TableCell className="text-black font-[400] pr-0">
                      <div className="flex gap-1">
                        <CheckmarkCircle isSelected={selected.includes(fertId.toString())} />
                        <div className="flex items-center gap-1.5">
                          <div className="pinto-sm sm:pinto-body-light">
                            Fertilizer ID {formatter.number(Number(fertId))} — 1 bsFERT
                          </div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                </ToggleGroupItem>
              ))}
            </TableBody>
          </Table>
        </ToggleGroup>
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
