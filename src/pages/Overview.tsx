import { TokenValue } from "@/classes/TokenValue";
import { useFarmerField } from "@/state/useFarmerField";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { useFieldData } from "@/state/useFieldData";
import { useSiloData } from "@/state/useSiloData";
import stalkIcon from "@/assets/protocol/Stalk-variant.png";
import seedIcon from "@/assets/protocol/Seed-variant.png";
import podIcon from "@/assets/protocol/Pod-variant.png";

export default function Overview() {

    const farmerSilo = useFarmerSilo();
    const farmerField = useFarmerField();

    const siloData = useSiloData();
    const fieldData = useFieldData();

    const siloPct = siloData.totalStalk.gt(0) ? farmerSilo.activeStalkBalance.div(siloData.totalStalk).mul(100) : TokenValue.ZERO;
    const stalkPerSeason = farmerSilo.activeSeedsBalance.div(10000);

    const placesInLine = farmerField.plots.map((plot) => plot.index.sub(fieldData.harvestableIndex)).sort((a,b) => a.sub(b));

    return (
        <div className="flex flex-col pt-64 gap-24">
            <div className="flex flex-col items-center">
                <div className="text-[1.25rem] text-pinto-gray-5 font-[400]">My deposited value</div>
                <div className="text-[3.5rem] text-black leading-tight font-[400]">${farmerSilo.depositsUSD.toHuman('short')}</div>
                <div className="text-[1.25rem] text-pinto-gray-4 font-[300] leading-none">{farmerSilo.depositsBDV.toHuman('short')} PDV</div>
            </div>
            <div className="flex flex-row justify-center gap-16">
                <div className="flex flex-col items-center w-72">
                    <div className="text-[1.25rem] text-pinto-gray-5 font-[400]">My Stalk</div>
                    <div className="flex flex-row gap-2 items-center">
                        <img src={stalkIcon} className={"h-9 w-9 drop-shadow-md"}/>
                        <div className="text-[2rem] text-black leading-tight font-[400]">{farmerSilo.activeStalkBalance.toHuman('short')}</div>
                    </div>
                    <div className="text-[1.25rem] text-pinto-gray-4 font-[300] leading-none">{siloPct.toHuman('short')}% of Stalk supply</div>
                </div>
                <div className="flex flex-col items-center w-72">
                    <div className="text-[1.25rem] text-pinto-gray-5 font-[400]">My Seeds</div>
                    <div className="flex flex-row gap-2 items-center">
                        <img src={seedIcon} className={"h-9 w-9 drop-shadow-md]"}/> 
                        <div className="text-[2rem] text-black leading-tight font-[400]">{farmerSilo.activeSeedsBalance.toHuman('short')}</div>
                    </div>
                    <div className="text-[1.25rem] text-pinto-gray-4 font-[300] leading-none">+{stalkPerSeason.toHuman('short')} Grown Stalk per Season</div>
                </div>
                <div className="flex flex-col items-center w-72">
                    <div className="text-[1.25rem] text-pinto-gray-5 font-[400]">My Pods</div>
                    <div className="flex flex-row gap-2 items-center">
                        <img src={podIcon} className={"h-8 w-8 drop-shadow-md"} />
                        <div className="text-[2rem] text-black leading-tight font-[400]">{farmerField.totalPods.toHuman('short')}</div>
                    </div>
                    <div className="text-[1.25rem] text-pinto-gray-4 font-[300] text-nowrap leading-none">next position in line: {placesInLine[0]?.toHuman('short') || 0}</div>
                </div>
            </div>
        </div>
    )
}