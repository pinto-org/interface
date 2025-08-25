import { useTractorConvertUpOrderbook } from "@/state/tractor/useTractorConvertUpOrders";

const empty = {};

export default function ConvertUpTractorOrderBook() {
  const k = useTractorConvertUpOrderbook(empty);

  return <div>asdf</div>;
}
