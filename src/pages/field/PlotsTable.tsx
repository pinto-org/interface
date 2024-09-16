import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { useFarmerField } from "@/state/useFarmerField";
import { useFieldData } from "@/state/useFieldData";

function PlotsTable() {
  const farmerField = useFarmerField();
  const fieldData = useFieldData();

  const rowsPerPage = 5;
  const totalRows = farmerField.plots?.length || 0;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const [currentPage, setCurrentPage] = useState(1);
  const newestEventOnPage = rowsPerPage * currentPage - rowsPerPage;
  const oldestEventOnPage = rowsPerPage * currentPage - 1;

  return (
    <Card className="h-fit w-full">
      <CardHeader>
        <CardTitle>Plots</CardTitle>
        <CardDescription>Your plots will appear here</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          {/* <TableCaption>Your deposits will appear here</TableCaption> */}
          <TableHeader>
            <TableRow>
              <TableHead>Place In Line</TableHead>
              <TableHead className="text-right">Number of Pods</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {farmerField.plots.map((plot: any, i: number) => {
              if (i >= newestEventOnPage && i <= oldestEventOnPage)
                return (
                  <TableRow>
                    <TableCell>
                      {plot.index.lte(fieldData.harvestableIndex)
                        ? "Harvestable"
                        : Number(plot.index.toHuman()).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      {Number(
                        (plot.index.lte(fieldData.harvestableIndex)
                          ? plot.pods.sub(fieldData.harvestableIndex.sub(plot.index))
                          : plot.pods
                        ).toHuman(),
                      ).toFixed(2)}
                    </TableCell>
                  </TableRow>
                );
            })}
          </TableBody>
        </Table>
        {totalPages > 1 && (
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <div className="text-xs">{`${currentPage} of ${totalPages}`}</div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default PlotsTable;
