import { useState } from "react";
import TokenSelectDepositedBalances from "@/components/TokenSelectDepositedBalances";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { FormLabel } from "@/components/ui/Form";
import { Label } from "@/components/ui/Label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import useFarmerDepositedBalances from "@/state/useFarmerDepositedBalances";
import useTokenData from "@/state/useTokenData";

function DepositsTable() {
  const farmerDeposits = useFarmerDepositedBalances().data;
  const BEAN = useTokenData().mainToken;
  const [token, setToken] = useState(BEAN);
  const tokenData = farmerDeposits.get(token);

  const rowsPerPage = 5;
  const totalRows = tokenData?.deposits?.length || 0;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const [currentPage, setCurrentPage] = useState(1);
  const newestEventOnPage = rowsPerPage * currentPage - rowsPerPage;
  const oldestEventOnPage = rowsPerPage * currentPage - 1;

  return (
    <Card className="h-fit w-[450px]">
      <CardHeader>
        <CardTitle>Deposits</CardTitle>
        <CardDescription>Your deposits will appear here</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-row grow justify-between mb-4">
          <Label className="content-center">Whitelisted Asset</Label>
          <TokenSelectDepositedBalances setToken={setToken} selectedToken={token} />
        </div>
        <Table>
          {/* <TableCaption>Your deposits will appear here</TableCaption> */}
          <TableHeader>
            <TableRow>
              <TableHead>Amount</TableHead>
              <TableHead>Total Stalk</TableHead>
              <TableHead className="text-right">Grown Stalk</TableHead>
              <TableHead className="text-right">Seeds</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tokenData.deposits.map((deposit: any, i: number) => {
              if (i >= newestEventOnPage && i <= oldestEventOnPage)
                return (
                  <TableRow>
                    <TableCell>{Number(deposit.amount.toHuman()).toFixed(2)}</TableCell>
                    <TableCell>{Number(deposit.stalk.total.toHuman()).toFixed(2)}</TableCell>
                    <TableCell className="text-right">{Number(deposit.stalk.grown.toHuman()).toFixed(2)}</TableCell>
                    <TableCell className="text-right">{Number(deposit.seeds.toHuman()).toFixed(2)}</TableCell>
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

export default DepositsTable;
