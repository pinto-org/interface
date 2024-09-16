import PlotsTable from "./field/PlotsTable";
import Harvest from "./field/actions/Harvest";
import Sow from "./field/actions/Sow";
import Transfer from "./field/actions/Transfer";

function Field() {
  return (
    <>
      <div className="flex flex-row flex-grow gap-4 justify-center">
        <Sow />
        <Transfer />
        <Harvest />
        <PlotsTable />
      </div>
    </>
  );
}

export default Field;
