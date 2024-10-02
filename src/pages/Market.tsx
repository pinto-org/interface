import { Card } from "@/components/ui/Card";
import { useLocation, useParams } from "react-router-dom";
import { FarmerActivityTable } from "./market/FarmerActivityTable";
import ModeSelect from "./market/ModeSelect";
import { PodListingsTable } from "./market/PodListingsTable";
import { PodOrdersTable } from "./market/PodOrdersTable";
import TableSelect from "./market/TableSelect";
import CreateListing from "./market/actions/CreateListing";
import CreateOrder from "./market/actions/CreateOrder";
import FillListing from "./market/actions/FillListing";
import FillOrder from "./market/actions/FillOrder";

export function Market() {
  const location = useLocation();
  const { mode, id } = useParams();
  const currentSelection = location.search;

  return (
    <>
      <div className="flex flex-row gap-4">
        <div className="flex flex-col flex-grow gap-4 self-start">
          <TableSelect />
          <div className="flex flex-row flex-grow gap-4">
            {(currentSelection === "?view=listings" || !currentSelection) && <PodListingsTable />}
            {currentSelection === "?view=orders" && <PodOrdersTable />}
            {currentSelection === "?view=activity" && <FarmerActivityTable />}
          </div>
        </div>
        <div className="flex flex-col gap-4 self-start w-[540px]">
          <Card className="p-4">
            <ModeSelect />
            {(mode === "buy" || !mode) && !id && <CreateOrder />}
            {mode === "buy" && id && <FillListing />}
            {mode === "sell" && !id && <CreateListing />}
            {mode === "sell" && id && <FillOrder />}
          </Card>
        </div>
      </div>
    </>
  );
}
