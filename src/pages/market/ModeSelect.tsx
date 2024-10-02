import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function ModeSelect() {
  const { mode, id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4">
      <Tabs
        defaultValue="buy"
        className="w-full"
        value={!mode ? "buy" : mode}
        onValueChange={(value) => navigate(`/podmarket/${value}`)}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="buy">
            <Link to="/podmarket/buy">Buy</Link>
          </TabsTrigger>
          <TabsTrigger value="sell">
            <Link to="/podmarket/sell">Sell</Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <Tabs
        defaultValue="order-list"
        className="w-full"
        value={!id ? "order-list" : "fill"}
        onValueChange={(value) =>
          value === "order-list" ? navigate(`/podmarket/${mode === "buy" ? "buy" : "sell"}`) : undefined
        }
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="order-list">
            <Link to={!mode || mode === "buy" ? "/podmarket/buy" : "/podmarket/sell"}>
              {!mode || mode === "buy" ? "Order" : "List"}
            </Link>
          </TabsTrigger>
          <TabsTrigger value="fill">Fill</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
