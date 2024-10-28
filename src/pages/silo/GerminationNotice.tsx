import { DepositData } from "@/utils/types";

export default function GerminationNotice({ deposit }: { deposit: DepositData }) {
  return (
    <div className="bg-pinto-off-green/15 border border-pinto-off-green flex flex-col p-4 rounded-[1.25rem]">
      <span className="font-[400] text-[1.25rem] text-black">{`Deposit ${deposit.stem} is Germinating`}</span>
      <span className="font-[340] text-[1.25rem] text-pinto-gray-4">
        For two Seasons, this Deposit cannot be converted to a different token or earn yield.
      </span>
    </div>
  );
}
