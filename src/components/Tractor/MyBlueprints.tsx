import { Card } from "@/components/ui/Card";
import { TractorRequisitionsTable } from "./TractorRequisitionsTable";

export default function MyBlueprints() {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Your Published Requisitions</h2>
      <TractorRequisitionsTable />
    </Card>
  );
}
