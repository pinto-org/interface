import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import useFarmerDepositedBalances from "@/state/useFarmerDepositedBalances";
import { usePriceData } from "@/state/usePriceData";
import { useSiloData } from "@/state/useSiloData";
import useTokenData from "@/state/useTokenData";
import { TokenValue } from "@/classes/TokenValue";

function SiloTable() {
  const siloData = useSiloData();
  const farmerDeposits = useFarmerDepositedBalances().data;
  const BEAN = useTokenData().mainToken;
  const SILO_WHITELIST = useTokenData().whitelistedTokens;
  const priceData = usePriceData();

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>Silo Whitelist</CardTitle>
        <CardDescription>Earn yield by depositing whitelisted assets</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          {/* <TableCaption>Earn yield and participate in protocol governance by depositing whitelisted assets</TableCaption> */}
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Token</TableHead>
              <TableHead className="w-[150px]">Rewards</TableHead>
              <TableHead>Bean vAPY</TableHead>
              <TableHead>Stalk vAPY</TableHead>
              <TableHead>TVD</TableHead>
              <TableHead>Amount Deposited</TableHead>
              <TableHead className="text-right">Value Deposited</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {SILO_WHITELIST.map((token) => {
              const data = siloData.tokenData.get(token);
              const userData = farmerDeposits.get(token);
              return (
                <TableRow>
                  <TableCell className="font-medium">{token.name}</TableCell>
                  <TableCell>
                    <div>{data.rewards.stalk.mul(1000000).toHuman()} Stalk</div>
                    <div>{data.rewards.seeds.toHuman()} Seeds</div>
                  </TableCell>
                  <TableCell>{(data.yields.beanAPY * 100).toFixed(2)}%</TableCell>
                  <TableCell>{(data.yields.stalkAPY * 100).toFixed(2)}%</TableCell>
                  <TableCell>{`$${data.depositedBDV.mul(priceData.price).toHuman("short")}`}</TableCell>
                  <TableCell>{userData.amount.toHuman()}</TableCell>
                  <TableCell className="text-right">{`$${userData.currentBDV.mul(priceData.price).toHuman("short")}`}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default SiloTable;
