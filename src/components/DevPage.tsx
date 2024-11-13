import useTokenData from "@/state/useTokenData";
import { isDev } from "@/utils/utils";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import { useAccount } from "wagmi";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { Input } from "./ui/Input";
import { usePriceData } from "@/state/usePriceData";

interface TaskResponse {
  success: boolean;
  message: string;
  data?: any;
}

type ServerStatus = "running" | "not-running" | "checking";

export default function DevPage() {
  const { address } = useAccount();
  const [loading, setLoading] = useState<string | null>(null);
  // Separate state for Minting section
  const [mintAddress, setMintAddress] = useState(address || "");
  const [mintAmount, setMintAmount] = useState("");
  const [usdcAddress, setUsdcAddress] = useState(address || "");
  // Separate state for Liquidity Management section
  const [wellAddress, setWellAddress] = useState("");
  const [wellAmounts, setWellAmounts] = useState("");
  const [receiverAddress, setReceiverAddress] = useState(address || "");
  const [tokenBalance, setTokenBalance] = useState({
    receiver: address || "",
    amount: "",
    token: "",
  });

  const { lpTokens } = useTokenData();

  const [serverStatus, setServerStatus] = useState<ServerStatus>("checking");

  const [approvalAddress, setApprovalAddress] = useState(address || "");

  const [singleSidedAddress, setSingleSidedAddress] = useState(address || "");
  const [singleSidedAmounts, setSingleSidedAmounts] = useState("");

  const priceData = usePriceData();
  const tokenData = useTokenData();

  const [selectedPercent, setSelectedPercent] = useState<number>(10);

  useEffect(() => {
    const checkServer = async () => {
      try {
        const response = await fetch("http://localhost:3002/execute-task", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ task: "ping" }),
        });
        setServerStatus("running");
      } catch (error) {
        setServerStatus("not-running");
      }
    };

    checkServer();
  }, []);

  // Update addresses when account changes
  useEffect(() => {
    setMintAddress(address || "");
    setUsdcAddress(address || "");
    setTokenBalance((prev) => ({ ...prev, receiver: address || "" }));
    setReceiverAddress(address || "");
  }, [address]);

  if (!isDev()) {
    return <Navigate to="/" replace />;
  }

  const executeTask = async (taskName: string, params?: Record<string, any>): Promise<void> => {
    setLoading(taskName);
    try {
      // Merge the provided params with the default network param
      const taskParams = {
        network: "localhost",
        ...params, // This allows overriding network if needed
      };

      const response = await fetch("http://localhost:3002/execute-task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ task: taskName, params: taskParams }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Task ${taskName} completed successfully`);
        console.log(data.data); // Log additional data if available
      } else {
        toast.error(`Task ${taskName} failed: ${data.message}`);
      }
    } catch (error) {
      console.error("Failed to execute task:", error);
      // Check if the error is due to server not running
      if (error instanceof TypeError && error.message.includes("fetch")) {
        toast.error("Server not running, from protocol dir run `yarn hardhat-server`");
      } else {
        toast.error(`Failed to execute ${taskName}`);
      }
    } finally {
      setLoading(null);
    }
  };

  const getWellsList = () => {
    // Import tokens from your token data

    // Filter for LP tokens which are the wells
    return lpTokens.map((token) => ({
      name: token.name,
      address: token.address,
    }));
  };

  const calculatePercentAmounts = (percent: number) => {
    console.log("priceData", priceData.pools);
    const tokenOrder = ["WETH", "cbETH", "cbBTC", "USDC", "WSOL"];
    const amounts = tokenOrder.map((symbol) => {
      const pool = priceData.pools.find((p) => p.tokens.some((token) => token.symbol === symbol));

      if (!pool) {
        console.log("pool for token not found:", symbol);
        return "0";
      }

      const tokenIndex = pool.tokens.findIndex((token) => token.symbol === symbol);
      if (tokenIndex === -1) return "0";

      const percentAmount = pool.balances[tokenIndex].mul(percent / 100);
      console.log(`calculated ${percent}%:`, percentAmount.toHuman(), " for token ", symbol);
      return percentAmount.toHuman();
    });

    setSingleSidedAmounts(amounts.join(","));
    setSelectedPercent(percent);
  };

  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="flex flex-col gap-6 w-[80%] mb-20">
        <h1 className="font-[300] text-[3.5rem] text-black">Development Page</h1>
        {serverStatus === "not-running" && (
          <div className="text-pinto-red-2 text-xl mb-4 p-4 border border-pinto-red-2 rounded-lg">
            Server not running. Please run `yarn hardhat-server` from the protocol directory.
          </div>
        )}

        {/* Simple Actions */}
        <Card className="p-6">
          <h2 className="text-2xl mb-4">Basic Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Button onClick={() => executeTask("callSunrise")} disabled={loading === "callSunrise"}>
              Sunrise
            </Button>
            <Button
              onClick={async () => {
                await executeTask("callSunrise");
                await executeTask("callSunrise");
              }}
              disabled={loading === "callSunrise"}
            >
              Double Sunrise
            </Button>
            <Button onClick={() => executeTask("skipMorningAuction")} disabled={loading === "skipMorningAuction"}>
              Skip Morning Auction
            </Button>
            <Button onClick={() => executeTask("megaDeploy")} disabled={loading === "megaDeploy"}>
              Mega Deploy
            </Button>
            <Button onClick={() => executeTask("forceFlood")} disabled={loading === "forceFlood"}>
              Force Flood
            </Button>
          </div>
        </Card>

        {/* Minting Actions */}
        <Card className="p-6">
          <h2 className="text-2xl mb-4">Minting</h2>
          <div className="flex flex-col gap-4">
            {/* ETH Minting */}
            <div className="flex flex-col gap-2">
              <Input
                placeholder="ETH Receiver Address"
                value={mintAddress}
                onChange={(e) => setMintAddress(e.target.value)}
              />
              <Button
                onClick={() => executeTask("mintEth", { account: mintAddress })}
                disabled={!mintAddress || loading === "mintEth"}
              >
                Mint ETH
              </Button>
            </div>

            {/* USDC Minting */}
            <div className="flex flex-col gap-2">
              <Input
                placeholder="USDC Receiver Address"
                value={usdcAddress}
                onChange={(e) => setUsdcAddress(e.target.value)}
              />
              <div className="flex gap-2">
                <Input
                  placeholder="Amount"
                  value={mintAmount}
                  onChange={(e) => setMintAmount(e.target.value)}
                  className="max-w-[200px]"
                />
                <Button
                  onClick={() =>
                    executeTask("mintUsdc", {
                      account: usdcAddress,
                      amount: mintAmount,
                    })
                  }
                  disabled={!usdcAddress || !mintAmount || loading === "mintUsdc"}
                >
                  Mint USDC
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Token Balance Management */}
        <Card className="p-6">
          <h2 className="text-2xl mb-4">Token Balance Management</h2>
          <div className="text-sm text-gray-500 mb-4">
            Available tokens: PINTO, WETH, USDC, cbBTC, cbETH, wstETH. You can use either token symbols or addresses.
          </div>
          <div className="flex flex-col gap-2">
            <Input
              placeholder="Receiver Address"
              value={tokenBalance.receiver}
              onChange={(e) =>
                setTokenBalance((prev) => ({
                  ...prev,
                  receiver: e.target.value,
                }))
              }
            />
            <Input
              placeholder="Amount"
              value={tokenBalance.amount}
              onChange={(e) => setTokenBalance((prev) => ({ ...prev, amount: e.target.value }))}
            />
            <Input
              placeholder="Token Address or Name"
              value={tokenBalance.token}
              onChange={(e) => setTokenBalance((prev) => ({ ...prev, token: e.target.value }))}
            />
            <Button
              onClick={() => executeTask("setTokenBalance", tokenBalance)}
              disabled={
                !tokenBalance.receiver || !tokenBalance.amount || !tokenBalance.token || loading === "setTokenBalance"
              }
            >
              Set Token Balance
            </Button>
          </div>
        </Card>

        {/* Liquidity Actions */}
        <Card className="p-6">
          <h2 className="text-2xl mb-4">Liquidity Management</h2>
          <div className="flex flex-col gap-4">
            <div className="text-sm text-gray-500 mb-4">
              <div className="font-medium mb-2">Available Wells:</div>
              {getWellsList().map((well) => (
                <div key={well.address} className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs">{well.address}</span>
                  <span className="text-xs">({well.name})</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              <Input placeholder="Well Address" value={wellAddress} onChange={(e) => setWellAddress(e.target.value)} />
              <Input
                placeholder="Amounts (comma-separated)"
                value={wellAmounts}
                onChange={(e) => setWellAmounts(e.target.value)}
              />
              <Input
                placeholder="Receiver Address"
                value={receiverAddress}
                onChange={(e) => setReceiverAddress(e.target.value)}
              />
              <div className="flex gap-2">
                <Button
                  onClick={() =>
                    executeTask("addLiquidity", {
                      well: wellAddress,
                      amounts: wellAmounts,
                      receiver: receiverAddress,
                    })
                  }
                  disabled={!wellAddress || !wellAmounts || !receiverAddress || loading === "addLiquidity"}
                >
                  Add Liquidity
                </Button>
                <Button
                  onClick={() =>
                    executeTask("addLiquidityToAllWells", {
                      receiver: receiverAddress,
                    })
                  }
                  disabled={!receiverAddress || loading === "addLiquidityToAllWells"}
                >
                  Add Liquidity To All Wells
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Token Approvals */}
        <Card className="p-6">
          <h2 className="text-2xl mb-4">Token Approvals</h2>
          <div className="flex flex-col gap-4">
            <div className="text-sm text-gray-500">
              Approves all non-PINTO tokens for whitelisted wells using the specified account.
            </div>
            <div className="flex flex-col gap-2">
              <Input
                placeholder="Account Address"
                value={approvalAddress}
                onChange={(e) => setApprovalAddress(e.target.value)}
              />
              <Button
                onClick={() => executeTask("approveTokens", { account: approvalAddress })}
                disabled={!approvalAddress || loading === "approveTokens"}
              >
                Approve All Tokens
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl mb-4">Single-Sided Deposits</h2>
          <div className="flex flex-col gap-4">
            <div className="text-sm text-gray-500">
              Deposits non-PINTO tokens into wells and then into beanstalk. Enter amounts in order:
              WETH,cbETH,cbBTC,USDC,WSOL
            </div>
            <div className="flex flex-col gap-2">
              <Input
                placeholder="Account Address"
                value={singleSidedAddress}
                onChange={(e) => setSingleSidedAddress(e.target.value)}
              />
              <div className="flex gap-2">
                <Input
                  placeholder="Amounts (comma-separated)"
                  value={singleSidedAmounts}
                  onChange={(e) => setSingleSidedAmounts(e.target.value)}
                  className="flex-1"
                />
                <div className="flex gap-1">
                  {[1, 5, 10, 50, 100].map((percent) => (
                    <Button
                      key={percent}
                      onClick={() => calculatePercentAmounts(percent)}
                      variant={selectedPercent === percent ? "default" : "outline"}
                      className="px-3"
                    >
                      {percent}%
                    </Button>
                  ))}
                </div>
              </div>
              <Button
                onClick={() =>
                  executeTask("singleSidedDeposits", {
                    account: singleSidedAddress,
                    amounts: singleSidedAmounts,
                  })
                }
                disabled={!singleSidedAddress || !singleSidedAmounts || loading === "singleSidedDeposits"}
              >
                Execute Single-Sided Deposits
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
