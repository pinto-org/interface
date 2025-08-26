import { useTractorConvertUpOrderbook } from "@/state/tractor/useTractorConvertUpOrders";

const empty = {};

export default function ConvertUpTractorOrders() {
  const { data } = useTractorConvertUpOrderbook(empty);

  console.log("data: ", data);

  return (
    <div className="w-full relative">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <ConvertUpTractorOrdersHeader />
        </table>
      </div>
    </div>
  );
}

const ConvertUpTractorOrdersHeader = () => (
  <thead>
    <tr className="border-b border-pinto-gray-3/20">
      <th className="px-2 py-1 text-left text-xs font-light text-pinto-gray-4">Blueprint Hash</th>
      <th className="px-2 py-1 text-left text-xs font-light text-pinto-gray-4">Min Capacity (PDV)</th>
      <th className="px-2 py-1 text-left text-xs font-light text-pinto-gray-4">Grown Stalk Bonus Per PDV</th>
      <th className="px-2 py-1 text-left text-xs font-light text-pinto-gray-4">Convert Amount (PDV)</th>
      <th className="px-2 py-1 text-left text-xs font-light text-pinto-gray-4">Min Price</th>
      <th className="px-2 py-1 text-left text-xs font-light text-pinto-gray-4">Max Price</th>
      <th className="px-2 py-1 text-left text-xs font-light text-pinto-gray-4">Operator Tip</th>
      <th className="px-2 py-1 text-left text-xs font-light text-pinto-gray-4">Operator Tip</th>
    </tr>
  </thead>
);
