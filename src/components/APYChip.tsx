import apyIcon from "@/assets/protocol/APY.svg";

interface APYChip {
    apyValue: number,
    className?: [x: string]
}

export default function APYChip({ apyValue = 0, className }: APYChip) {
    return (
        <div className="flex flex-shrink">
            <div className={`inline-flex items-center gap-1 px-1.5 py-1 bg-pinto-morning text-pinto-green font-[400] text-[1rem] 
                [border-radius:10px]
                [border:1px_solid] 
                [border-image-source:linear-gradient(90deg,#E9E7E0_0%,#FEE18C_52.5%,#F1F88C_100%)] ${className}`}>
                <img src={apyIcon} className="w-8 h-8" />
                <span className="font-[500] text-[1.5rem]">{(apyValue * 100).toFixed(2)}% APY</span>
            </div>
        </div>
    );
};