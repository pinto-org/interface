import { Table, TableBody, TableCell, TableRow } from "./ui/Table";
import { useFarmerField } from "@/state/useFarmerField";
import podIcon from "@/assets/protocol/Pod.png";
import plotIcon from "@/assets/protocol/Plot.svg";
import { useFieldData } from "@/state/useFieldData";

export default function PlotsTable() {

    const farmerField = useFarmerField();
    const fieldData = useFieldData();

    return (
        <Table>
        <TableBody className="[&_tr:first-child]:border-t [&_tr:last-child]:border-b">
            {farmerField.plots.map((plot) => {
                return (
                  <TableRow
                    className="h-[4.5rem] bg-transparent hover:bg-transparent items-center"
                    key={`plotTable${plot.id}`}
                  >
                    <TableCell className="pl-0">
                      <div className="text-black font-[400] text-[1rem] inline-flex items-center gap-1.5 ml-[-2]">
                        <img src={plotIcon} className="h-6 w-6" />
                        <div>Plot {plot.id}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-0">
                      <div className="text-black font-[400] text-[1rem] inline-flex items-center gap-1.5">
                        <img src={podIcon} className="h-6 w-6" />
                        {plot.pods.toHuman("short")}
                        {" Pods"}
                        <span className="text-pinto-gray-4">at</span>
                        {plot.index.sub(fieldData.harvestableIndex).toHuman("short")}
                        {" in the Pod Line"}
                      </div>
                    </TableCell>
                  </TableRow>
                );
            })}
        </TableBody>
    </Table>
    )
}