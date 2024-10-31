import sunIcon from "@/assets/protocol/Sun.png";
import pintoIcon from "@/assets/tokens/PINTO.png";
import { TokenValue } from "@/classes/TokenValue";
import useFieldSnapshots from "@/state/useFieldSnapshots";
import useSiloSnapshots from "@/state/useSiloSnapshots";
import { useSunData } from "@/state/useSunData";
import { ExternalLinkIcon } from "../../Icons";
import TooltipSimple from "../../TooltipSimple";
import { Button } from "../../ui/Button";
import { Card, CardContent, CardHeader } from "../../ui/Card";
import { Separator } from "../../ui/Separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/Table";

export default function SeasonsButtonPanel({ isOpen = false }: { isOpen: boolean }) {
  const sunData = useSunData();
  const fieldSnapshots = useFieldSnapshots();
  const siloSnapshots = useSiloSnapshots();

  return (
    <Card
      className={`absolute top-[5rem] transition-all ${isOpen ? "left-[1.5rem]" : "-left-[60rem]"} w-[60rem] overflow-clip h-[calc(100vh-6rem)] z-[51]`}
    >
      <CardHeader>
        <div className="flex flex-row justify-between">
          <div className="flex flex-col gap-1 mb-2">
            <div className="font-[400] text-[1.25rem] text-black inline-flex gap-2 items-center">
              <img src={sunIcon} className={"w-6 h-6"} />
              Season {sunData.current}
            </div>
            <div className="font-[300] text-[1rem] text-pinto-gray-4">
              Seasons are how Pinto keeps time. Each Season is about 1 hour.
            </div>
            <div className="font-[300] text-[1rem] text-pinto-gray-4">
              Pinto adjusts the supply and various incentives every Season to facilitate price stability.
            </div>
          </div>
          <Button asChild variant={"outline"} className="rounded-full hover:cursor-pointer self-center h-[2.625rem]">
            <a
              href={`/explorer`}
              target={"_blank"}
              rel="noreferrer"
              className="text-pinto-gray-5 hover:cursor-pointer transition-all gap-2"
            >
              View more data
              <ExternalLinkIcon color="currentColor" width={16} height={16} />
            </a>
          </Button>
        </div>
        <Separator className="w-[60rem] -ml-4" />
      </CardHeader>
      <CardContent className="px-0">
        <Table>
          <TableHeader className="[&_tr]:border-0">
            <TableRow className="h-14 border-0">
              <TableHead className="text-black font-[400] text-[1rem] w-[15%] p-4">Season</TableHead>
              <TableHead className="text-black text-right font-[400] text-[1rem] w-[25%]">Pinto Supply</TableHead>
              <TableHead className="text-black text-right font-[400] text-[1rem] w-[25%]">Silo Adjustments</TableHead>
              <TableHead className="text-black text-right font-[400] text-[1rem] w-[35%] p-4" colSpan={2}>
                Field Adjustments
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fieldSnapshots?.map((snapshot, i) => {
              const mints = siloSnapshots
                ? snapshot.season === siloSnapshots[i]?.season
                  ? siloSnapshots[i]?.deltaBeanMints
                  : TokenValue.ZERO
                : TokenValue.ZERO;
              return (
                <TableRow key={`${snapshot.season}_${i}`} className="h-[4.5rem] bg-white hover:bg-white border-0">
                  <TableCell className="text-black font-[400] text-[1rem] pl-4 items-center">
                    {snapshot.season}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-col items-end">
                      <div
                        className={`inline-flex gap-1 text-[1rem] items-center ${mints.gt(0) ? "text-pinto-green-2" : ""}`}
                      >
                        {mints.gt(0) && <span>+</span>}
                        <img src={pintoIcon} className="w-4 h-4" />
                        <span>{Number(mints.toHuman()).toFixed(0)}</span>
                      </div>
                      <span className="text-[0.875rem] font-[300] text-pinto-gray-4">New Pinto</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-black font-[400] text-[1rem] text-right">-</TableCell>
                  <TableCell className="text-black font-[400] text-[1rem] text-right pr-4">
                    <div className="flex flex-row gap-4 justify-end">
                      <div className="flex flex-col w-[60%]">
                        {`${snapshot.deltaSoil.gt(0) ? "+ " : snapshot.deltaSoil.lt(0) ? "- " : ""}${Number(snapshot.deltaSoil.abs().toHuman()).toFixed(0)}`}
                        <span className="text-[0.875rem] font-[300] text-pinto-gray-4 inline-flex gap-0.5 items-center justify-end">
                          New Soil
                          <TooltipSimple
                            variant="gray"
                            content={
                              <>
                                <div className="text-left">
                                  Soil is the total number of Pinto that can be lent (Sown).
                                </div>
                                <div className="text-left text-pinto-gray-4">
                                  When the Pinto price is less than $1, the amount of Soil issued is set to the amount
                                  of excess Pinto.
                                </div>
                              </>
                            }
                          />
                        </span>
                      </div>
                      <div className="flex flex-col w-[50%]">
                        <span className="inline-flex gap-2 justify-end">
                          {`${snapshot.temperature.toFixed(0)}% `}
                          <span className="text-pinto-gray-4">
                            {`(${snapshot.deltaTemperature > 0 ? "+" : snapshot.deltaTemperature < 0 ? "-" : ""}${snapshot.deltaTemperature.toFixed(0)}%)`}
                          </span>
                        </span>
                        <span className="text-[0.875rem] font-[300] text-pinto-gray-4 inline-flex gap-0.5 items-center justify-end">
                          Max Temperature
                          <TooltipSimple
                            variant="gray"
                            content={
                              <>
                                <div className="text-left">
                                  Temperature is the interest rate for lending (Sowing) Pinto .
                                </div>
                                <div className="text-left text-pinto-gray-4">
                                  Sown Pinto are burned, reducing the Pinto supply.
                                </div>
                              </>
                            }
                          />
                        </span>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
