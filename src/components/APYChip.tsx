import { APYIcon } from "./Icons";

interface APYChip {
  apyValue: number;
  className?: [x: string];
}

export default function APYChip({ apyValue = 0 }: APYChip) {
  return (
    <div className="flex flex-shrink">
      <div
        className={`inline-flex items-center gap-1 px-1.5 py-1 bg-pinto-morning text-black font-[400] text-[1rem] border rounded-md border-pinto-morning-yellow-1`}
      >
        <APYIcon color="currentColor" width={"1.375rem"} height={"1.375rem"} />
        <span className="font-[500] text-[1.5rem]">{(apyValue * 100).toFixed(2)}% APY</span>
      </div>
    </div>
  );
}
