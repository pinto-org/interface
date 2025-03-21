import { Separator } from "@radix-ui/react-separator";

export const DeltaDemandChart = () => {
    const lowerBound = 15000;
    const upperBound = 15000;
    const secondLowerBound = 24000;
    const secondUpperBound = 24000;
    return (
        <div className="w-[600px] bg-white rounded-md p-6 border border-pinto-gray-2">
            <span>Demand for Soil is increasing</span>
            <div className="flex text-sm mt-2 gap-1 items-center">
                <div className="rounded-full w-3 h-3 bg-pinto-green-4" />
                <span>Season 998</span>
                <span className="text-pinto-gray-4">(33% Temp)</span>
                <span>-</span>
                <span className="text-pinto-gray-4">Amount Sown:</span>
                <span>
                    {lowerBound}/{upperBound}
                </span>
                <span className="text-pinto-gray-4">(100%)</span>
            </div>
            <div className="flex text-sm mt-2 gap-1 items-center">
                <div className="rounded-full w-3 h-3 bg-pinto-morning-yellow-1" />
                <span>Season 999</span>
                <span className="text-pinto-gray-4">(32% Temp)</span>
                <span>-</span>
                <span className="text-pinto-gray-4">Amount Sown:</span>
                <span>
                    {secondLowerBound}/{secondUpperBound}
                </span>
                <span className="text-pinto-gray-4">(100%)</span>
            </div>
            <div className="w-full h-[200px] bg-pinto-gray-1 rounded-md mt-2">Super Slick Chart here</div>
            <Separator className="my-4" />
            <div className="flex flex-col">
                <span className="text-base">Demand for Soil</span>
                <span className="text-xl">Increasing</span>
                <span className="text-base mt-4 text-pinto-gray-4">Soil - 1 Sown a Season 998: XX:20</span>
                <span className="text-base text-pinto-gray-4">Soil - 1 Sown a Season 997: XX:25</span>
            </div>
        </div>
    );
};