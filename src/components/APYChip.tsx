import apyIcon from "@/assets/protocol/APY.svg";

export default function APYChip(apyValue: string | number, className?: string) {
    return (
        <div className={`inline-flex gap-1 px-1.5 py-1 bg-pinto-green-2 text-pinto-green font-[400] text-[1rem] rounded-[0.65em] ${className}`}>
            <img src={apyIcon} />
            {(Number(apyValue || 0) * 100).toFixed(2)}% APY
        </div>
    );
};