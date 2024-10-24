import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import useFarmerDepositedBalances from "@/state/useFarmerDepositedBalances";
import { Token } from "@/utils/types";
import depositIcon from "@/assets/protocol/Deposit.svg";
import { usePriceData } from "@/state/usePriceData";
import { TokenValue } from "@/classes/TokenValue";

interface DepositsTable {
  token: Token
};

function DepositsTable({token}: DepositsTable) {

  const farmerDeposits = useFarmerDepositedBalances().data;
  const tokenData = farmerDeposits.get(token);
  const priceData = usePriceData();

  return (

    <div className="border border-pinto-gray-2 rounded-[1rem] overflow-clip mt-2">
    <Table>
        <TableHeader>
            <TableRow className="bg-pinto-gray-1 hover:bg-pinto-gray-1 h-14">
              <TableHead className="text-black font-[400] text-[1rem] w-1/4 p-4">Deposit ID</TableHead>
              <TableHead className="text-black text-right font-[400] text-[1rem] w-1/4">Amount Deposited</TableHead>
              <TableHead className="text-black text-right font-[400] text-[1rem] w-1/4">Stalk</TableHead>
              <TableHead className="text-black text-right font-[400] text-[1rem] w-1/4 p-4">Seeds</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
        {!tokenData || tokenData.deposits.length === 0 ? (
          <TableRow className="bg-white hover:bg-white">
            <TableCell colSpan={4}>
              <div className="flex flex-row h-48 w-full items-center justify-center text-pinto-gray-4 font-[400] text-[1rem]">
                {`Your Deposits will appear here`}
              </div>
            </TableCell>
          </TableRow>
        ) : (
        tokenData.deposits.map((deposit) => {
                return (
                <TableRow className="h-[4.5rem] bg-white text-[1rem] hover:bg-pinto-green-1/50 hover:cursor-pointer">
                    <TableCell className="text-black font-[400]">
                      <div className="gap-1.5 pl-2 flex items-center">
                        <img src={depositIcon} />
                        {deposit.stem.toString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-black">
                      <div>{`${deposit.amount.toHuman('short')} ${token.name}`}</div>
                      <div className="text-pinto-gray-4">{`$${(deposit.amount || TokenValue.ZERO).mul(priceData.price).toHuman('short')}`}</div>
                    </TableCell>
                    <TableCell className="text-right text-black">
                        <div>{deposit.stalk.base.toHuman('short')}</div>
                        {deposit.stalk.grown.gt(0) &&
                          <div className="text-pinto-gray-4">
                            Claimable Grown Stalk: <span className="text-pinto-green-2">+{deposit.stalk.grown.toHuman('short')}</span>
                          </div>
                        }
                    </TableCell>
                    <TableCell className="text-right text-black p-4">
                        {deposit.seeds.toHuman('short')}
                    </TableCell>
                </TableRow>
                );
            })
        )}
        </TableBody>
    </Table>
</div>
  );
}

export default DepositsTable;
