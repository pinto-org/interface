import { mockAddressAtom } from "@/Web3Provider";
import { morningFieldDevModeAtom } from "@/state/protocol/field/field.atoms";
import { getMorningResult, getNowRounded } from "@/state/protocol/sun";
import { morningAtom, seasonAtom, sunQueryKeysAtom } from "@/state/protocol/sun/sun.atoms";
import { useFieldQueryKeys, useInvalidateField } from "@/state/useFieldData";
import { usePriceData } from "@/state/usePriceData";
import { useInvalidateSun, useSeasonQueryKeys } from "@/state/useSunData";
import useTokenData from "@/state/useTokenData";
import { isDev } from "@/utils/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import { http, PublicClient, createPublicClient, isAddress } from "viem";
import { hardhat } from "viem/chains";
import { useAccount, useBlockNumber, useChainId } from "wagmi";
import MorningCard from "./MorningCard";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { Input } from "./ui/Input";
import Text from "./ui/Text";

type ServerStatus = "running" | "not-running" | "checking";

// this extended type declaration is to fix the fact that hardhat_mine is not one of the offical types
type ExtendedPublicClient = PublicClient & {
  request(args: { method: "hardhat_mine"; params: string[] }): Promise<void>;
};

const publicClient = createPublicClient({
  chain: hardhat,
  transport: http(),
});

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
  const chainId = useChainId();

  const { lpTokens } = useTokenData();

  const [serverStatus, setServerStatus] = useState<ServerStatus>("checking");

  const [approvalAddress, setApprovalAddress] = useState(address || "");

  const [singleSidedAddress, setSingleSidedAddress] = useState(address || "");
  const [singleSidedAmounts, setSingleSidedAmounts] = useState("");

  const priceData = usePriceData();

  const hasZeroPrices = (() => {
    if (priceData.loading) return false;
    if (priceData.pools.length === 0) {
      return true;
    }
    const result = priceData.pools.some((pool) => pool.price?.eq(0));
    return result;
  })();

  const [selectedPercent, setSelectedPercent] = useState<number>(10);

  const [blockSkipAmount, setBlockSkipAmount] = useState("6"); // default to 6 blocks because the morning auction updates every 6 blocks (12 seconds on eth, 2 seconds on base, 12/2 = 6)

  const [mockAddress, setMockAddress] = useAtom(mockAddressAtom);

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

  const skipBlocks = async (_numBlocks?: number) => {
    try {
      const blocks = _numBlocks ?? parseInt(blockSkipAmount);
      if (Number.isNaN(blocks)) {
        toast.error("Please enter a valid number of blocks");
        return;
      }

      // hardhat_mine is not one of the offical types, so casting to any
      await (publicClient as ExtendedPublicClient).request({
        method: "hardhat_mine",
        params: [`0x${blocks.toString(16)}`],
      });

      toast.success(`Skipped ${blocks} blocks`);
    } catch (error) {
      console.error("Failed to skip blocks:", error);
      toast.error("Failed to skip blocks. Make sure you are connected to an Anvil/Hardhat node.");
    }
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
        {chainId !== 1337 && (
          <div className="text-pinto-red-2 text-xl mb-4 p-4 border border-pinto-red-2 rounded-lg">
            You are on chainId: {chainId}. Connect to localhost:1337
          </div>
        )}
        {hasZeroPrices && (
          <div className="text-pinto-red-2 text-xl mb-4 p-4 border border-pinto-red-2 rounded-lg">
            Price is zero, likely due to oracle timeout. Try clicking the Update Oracle Timeouts button.
          </div>
        )}

        {/* Basic Actions */}
        <Card className="p-6">
          <h2 className="text-2xl mb-4">Basic Actions</h2>
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-4">
              <Button onClick={() => executeTask("callSunrise")} disabled={loading === "callSunrise"}>
                Call Sunrise
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
              <Button onClick={() => executeTask("updateOracleTimeouts")} disabled={loading === "updateOracleTimeouts"}>
                Update Oracle Timeouts
              </Button>
            </div>
            <div className="flex gap-2 items-center">
              <Input
                placeholder="# Blocks to skip"
                value={blockSkipAmount}
                onChange={(e) => setBlockSkipAmount(e.target.value)}
                className="w-32"
              />
              <Button onClick={() => skipBlocks()}>Skip Blocks</Button>
            </div>
          </div>
        </Card>

        {/* Mock Address */}
        <Card className="p-6">
          <h2 className="text-2xl mb-4">Mock Configuration</h2>
          <div className="flex flex-col gap-4">
            <div className="text-sm text-gray-500">Configure the mock wallet address for local development</div>
            <div className="flex gap-2">
              <Input
                placeholder="Mock Wallet Address"
                value={mockAddress}
                onChange={(e) => {
                  const newAddress = e.target.value as `0x${string}`;
                  setMockAddress(newAddress); // Always update the input
                  if (isAddress(newAddress)) {
                    localStorage.setItem("mockAddress", newAddress);
                  }
                }}
                className={`flex-1 ${mockAddress && !isAddress(mockAddress) ? "border-pinto-red-2" : ""}`}
              />
            </div>
            <div className="text-right h-4 text-sm text-pinto-gray-4">
              {isAddress(mockAddress) ? "Valid Address" : "Invalid Address"}
            </div>
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
              onChange={(e) => setTokenBalance((prev) => ({ ...prev, receiver: e.target.value }))}
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
              onClick={() => executeTask("getTokens", tokenBalance)}
              disabled={
                !tokenBalance.receiver || !tokenBalance.amount || !tokenBalance.token || loading === "getTokens"
              }
            >
              Get Tokens
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
                onClick={() =>
                  executeTask("approveTokens", {
                    account: approvalAddress,
                  })
                }
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
        <MorningAuctionDev executeTask={executeTask} skipBlocks={skipBlocks} />
      </div>
    </div>
  );
}

const MorningAuctionDev = ({
  executeTask,
  skipBlocks,
}: {
  executeTask: (task: string, params?: Record<string, any>) => Promise<void>;
  skipBlocks: (numBlocks?: number) => Promise<void>;
}) => {
  const blockQuery = useBlockNumber({
    query: {
      refetchInterval: 20_000,
      refetchIntervalInBackground: false,
      refetchOnMount: true,
    },
  });
  const [blocknum, setBlocknum] = useState<number>(Number(blockQuery.data) || 0);

  useEffect(() => {
    if (blockQuery.data) {
      setBlocknum(Number(blockQuery.data));
    }
  }, [blockQuery.data]);

  const [sun, setSun] = useAtom(seasonAtom);
  const fieldQueryKeys = useFieldQueryKeys();
  const seasonQueryKeys = useSeasonQueryKeys();
  const invalidateSun = useInvalidateSun();
  const invalidateField = useInvalidateField();
  const [morning, setMorning] = useAtom(morningAtom);
  const [freezeMorningTasks, setFreezeMorningTasks] = useAtom(morningFieldDevModeAtom);
  const [isInitializing, setIsInitializing] = useState(false);
  const queryClient = useQueryClient();

  const deltaBlocks = Math.max(blocknum - sun.sunriseBlock, 0);

  const infos = [
    { label: "Current block", value: blockQuery.data?.toString() },
    { label: "Sunrise block", value: sun.sunriseBlock?.toString() },
    { label: "Delta blocks", value: blockQuery.data ? Number(blockQuery.data) - sun.sunriseBlock : 0 },
    { label: "morning index (0-24)", value: !morning.isMorning ? "N/A" : morning.index },
  ];

  const tryFetchSeason = async () => {
    try {
      const time: any = await queryClient.fetchQuery({ queryKey: seasonQueryKeys.season });
      const now = getNowRounded();
      const struct = {
        current: time.current,
        lastSopStart: time.lastSop,
        lastSopEnd: time.lastSopSeason,
        rainStart: time.rainStart,
        raining: time.raining,
        sunriseBlock: Number(time.sunriseBlock),
        abovePeg: time.abovePeg,
        start: Number(time.start),
        period: Number(time.period),
        timestamp: now,
      };
      console.log("data", struct);
      return struct;
    } catch (e) {
      console.log("error fetching season", e);
      return undefined;
    }
  };

  const waitForSeasonChange = async (currSeason: number, maxAttempts = 4): Promise<typeof sun | undefined> => {
    for (let i = 0; i < maxAttempts; i++) {
      console.log(`Attempt ${i + 1} to fetch new season...`);
      const newData = await tryFetchSeason();

      if (newData && newData.current !== currSeason) {
        console.log("Season changed:", newData.current);
        return newData;
      }

      if (i < maxAttempts - 1) {
        // Don't wait on the last attempt
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
    return undefined;
  };

  const handleFWDSeasonAndInitMorning = async (freeze?: boolean) => {
    const currSeason = sun.current;
    if (isInitializing) return;

    try {
      setIsInitializing(true);
      toast.loading("initializing morning...");

      setFreezeMorningTasks((draft) => {
        draft.freeze = freeze || false;
      });

      executeTask("callSunrise");

      const struct = await waitForSeasonChange(currSeason);
      if (!struct) {
        toast.error("Season did not change after maximum attempts");
        return;
      }

      // Wait for invalidation calls to complete
      await invalidateField("all");

      console.log("waiting for 2 seconds...");
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log("done waiting");
      // Do the initialization directly here instead of relying on the useEffect
      const morningResult = getMorningResult({
        timestamp: struct.timestamp,
        blockNumber: struct.sunriseBlock,
      });

      console.log("struct", struct);
      console.log("morningResult", morningResult);
      setSun(struct);
      setMorning(morningResult);
      await blockQuery.refetch();
      console.log("morning initialized...");

      toast.dismiss();
      toast.success("initialized morning");
    } catch (error) {
      console.error("Error initializing morning:", error);
      toast.dismiss();
      toast.error("Failed to initialize morning");
    } finally {
      setIsInitializing(false);
    }
  };

  const handleIncrementIndex = async () => {
    const toSkip = 12 - Math.floor(deltaBlocks % 12);
    console.log("[handleIncrementIndex]: toSkip", toSkip);
    await skipBlocks(toSkip);
    invalidateField("all");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const d = await blockQuery.refetch();
    if (d.data) {
      setBlocknum(Number(d.data));
    }
    setMorning((draft) => {
      draft.index += 1;
      if (draft.index === 25) {
        draft.isMorning = false;
      }
    });
  };

  return (
    <MorningCard className="p-6 w-full justify-start">
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl">Morning Auction</h2>
        {morning.isMorning && (
          <div className="flex flex-col gap-2">
            {infos.map((info) => {
              return (
                <div className="flex flex-row gap-2" key={info.label}>
                  <div className="pinto-sm text-pinto-secondary w-[200px]">{info.label}:</div>
                  <div className="pinto-sm-thin text-pinto-secondary">{info.value}</div>
                </div>
              );
            })}
          </div>
        )}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="pinto-sm-thin text-pinto-secondary">
              Call sunrise & start the morning. Disables UI timers & all auto fetches
            </div>
            <Button onClick={() => handleFWDSeasonAndInitMorning(true)} disabled={isInitializing}>
              {isInitializing ? "Initializing..." : "Sunrise & Start Morning"}
            </Button>
          </div>
          <div className="flex flex-col gap-2">
            <div className="pinto-sm-thin text-pinto-secondary">Call sunrise & start the morning. Key UI Only mode</div>
            <Button onClick={() => handleFWDSeasonAndInitMorning(false)} disabled={isInitializing}>
              {isInitializing ? "Initializing..." : "Start Morning UI only mode"}
            </Button>
          </div>
          <div className="flex flex-col gap-2">
            <div className="pinto-sm-thin text-pinto-secondary">
              Increment morning index by 1 (12 blocks). Still WIP.
            </div>
            <Button onClick={handleIncrementIndex}>Increment index</Button>
          </div>
        </div>
      </div>
    </MorningCard>
  );
};
