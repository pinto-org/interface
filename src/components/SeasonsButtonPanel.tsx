import { useSunData } from "@/state/useSunData";
import { Card, CardContent, CardHeader } from "./ui/Card"
import sunIcon from "@/assets/protocol/Sun.png";
import pintoIcon from "@/assets/tokens/Pinto.png";
import { Separator } from "./ui/Separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/Table";

export default function SeasonsButtonPanel({isOpen = false}: {isOpen: boolean}) {

    const sunData = useSunData();

    return (
        <Card className={`absolute top-[5rem] transition-all ${isOpen ? 'left-[1.5rem]' : '-left-[100%]'} w-[60rem] overflow-clip max-h-[calc(100vh-9rem)] z-[51]`}>
            <CardHeader>
                <div className="flex flex-col gap-1 mb-2">
                    <div className="font-[400] text-[1.25rem] text-black inline-flex gap-2 items-center">
                        <img src={sunIcon} className={"w-6 h-6"} />
                        Season {sunData.current.toHuman()}
                    </div>
                    <div className="font-[300] text-[1rem] text-pinto-gray-4">
                        Seasons are how Pinto keeps time. Each Season is about 1 hour.
                    </div>
                    <div className="font-[300] text-[1rem] text-pinto-gray-4">
                        Pinto adjusts the supply and various incentives every Season to facilitate price stability.
                    </div>
                </div>
                <Separator className="w-[60rem] -ml-4" />
            </CardHeader>
            <CardContent className="px-0">
            <Table>
                <TableHeader className="[&_tr]:border-0">
                    <TableRow className="h-14 border-0">
                        <TableHead className="text-black font-[400] text-[1rem] w-1/4 p-4">Season</TableHead>
                        <TableHead className="text-black text-right font-[400] text-[1rem] w-1/4">Pinto Supply</TableHead>
                        <TableHead className="text-black text-right font-[400] text-[1rem] w-1/4">Silo Adjustments</TableHead>
                        <TableHead className="text-black text-right font-[400] text-[1rem] w-1/4 p-4">Field Adjustments</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow className="h-[4.5rem] bg-white hover:bg-white">
                        <TableCell className="text-black font-[400] text-[1rem] p-4 inline-flex items-center gap-1.5">
                            25000
                        </TableCell>
                        <TableCell className="text-right">
                            <div className="flex flex-col items-end">
                                <div className="inline-flex gap-1 text-[1rem]">
                                    <span>+</span>
                                    <img src={pintoIcon} className="w-4 h-4" />
                                    <span>{10000}</span>
                                </div>
                                <span className="text-[0.875rem] font-[300] text-pinto-gray-4">New Pinto</span>
                            </div>
                        </TableCell>
                        <TableCell className="text-black font-[400] text-[1rem] text-right">
                            -
                        </TableCell>
                        <TableCell className="text-black font-[400] text-[1rem] text-right p-4">
                            <div className="flex flex-row gap-4 justify-end">
                                <div className="flex flex-col">
                                    +100
                                    <span className="text-[0.875rem] font-[300] text-pinto-gray-4">
                                        New Pinto
                                    </span>
                                </div>
                                <div className="flex flex-col">
                                    62% -3%
                                    <span className="text-[0.875rem] font-[300] text-pinto-gray-4">
                                        Temperature
                                    </span>
                                </div>
                            </div>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            </CardContent>
        </Card>
    )
}