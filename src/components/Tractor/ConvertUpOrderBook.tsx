import { useTractorConvertUpOrderbook } from "@/state/tractor/useTractorConvertUpOrders";

const empty = {};

export default function ConvertUpOrderBook() {
  const k = useTractorConvertUpOrderbook(empty);

  return <div>asdf</div>;
}
