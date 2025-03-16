import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Label } from "@/components/ui/Label";
import { useFarmerSilo } from "@/state/useFarmerSilo";

function SiloBalances() {
  const farmerData = useFarmerSilo();

  return (
    <Card className="h-fit w-[300px]">
      <CardHeader>
        <CardTitle>Silo Balance</CardTitle>
        <CardDescription>Your current Silo position</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-row justify-between">
          <Label>Deposits Value</Label>
          <div>${farmerData.depositsUSD.toHuman("short")}</div>
        </div>
        <div className="flex flex-row justify-between">
          <Label>Stalk</Label>
          <div>{farmerData.activeStalkBalance.toHuman("short")}</div>
        </div>
        <div className="flex flex-row justify-between">
          <Label>Seeds</Label>
          <div>{farmerData.activeSeedsBalance.toHuman("short")}</div>
        </div>
      </CardContent>
    </Card>
  );
}

export default SiloBalances;
