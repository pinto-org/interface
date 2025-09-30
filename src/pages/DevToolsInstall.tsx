import { Col, Row } from "@/components/Container";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import PageContainer from "@/components/ui/PageContainer";
import { Separator } from "@/components/ui/Separator";
import { cn } from "@/utils/utils";
import { CheckIcon, CopyIcon } from "@radix-ui/react-icons";
import * as React from "react";
import { useNavigate } from "react-router-dom";

export default function DevToolsInstall() {
  const navigate = useNavigate();

  return (
    <PageContainer variant="md" className="!max-w-[700px]">
      <Col className="w-full gap-4 sm:gap-12">
        {/**
         * Back button
         */}
        <Button variant="outline" onClick={() => navigate(-1)} className="self-start">
          ← Back
        </Button>
        {/**
         * Title and subtitle
         */}
        <>
          <Col className="w-full gap-2">
            <div className="pinto-h2 sm:pinto-h1">Dev Environment Setup</div>
            <div className="pinto-sm sm:pinto-body-light text-pinto-light sm:text-pinto-light">
              Install the necessary tools to get started with the dev environment.
            </div>
            <div className="pinto-sm sm:pinto-body-light text-pinto-light sm:text-pinto-light">
              NOTE: These instructions are currently only for Mac OS users.
            </div>
          </Col>
          <Separator orientation="horizontal" className="bg-pinto-gray-2" />
        </>
        {/**
         * Homebrew
         */}
        <Section title="Install Homebrew">
          <InstallHomebrew />
        </Section>
        <Section title="Install Yarn">
          <InstallYarn />
        </Section>
        <Section title="Install Git">
          <InstallGit />
        </Section>
        <Section title="Clone Pinto Protocol Repository">
          <InstallProtocolRepo />
        </Section>
        <Section title="Initialize and install all tools">
          <InitializeTools />
        </Section>
        <Section title="Restart Terminal and Update Foundry">
          <RestartTerminalAndFoundry />
        </Section>
        <Section title="(Optional) Set Environment Variables">
          <SetEnvironmentVariables />
        </Section>
        <Section title="Start your Dev Environment">
          <StartDevEnvironment />
        </Section>
      </Col>
    </PageContainer>
  );
}

const Section = ({ children, title }: { children: React.ReactNode; title: string }) => (
  <>
    <Col className="w-full gap-4">
      <div className="pinto-lg text-pinto-primary font-medium">{title}</div>
      {children}
    </Col>
    <Separator orientation="horizontal" className="bg-pinto-gray-2" />
  </>
);

const InstallHomebrew = () => (
  <Col className="w-full gap-4">
    <Row className="w-full gap-4 justify-between">
      <div className="pinto-body">Check if homebrew is installed:</div>
      <CommandBlock command="brew --version" />
    </Row>
    <Col className="w-full gap-4">
      <div className="pinto-body">
        If not, install homebrew via this command or{" "}
        <a
          href="https://brew.sh/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-pinto-green-4 hover:underline cursor-pointer"
        >
          here
        </a>
        :
      </div>
      <CommandBlock command='/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"' />
    </Col>
  </Col>
);

const InstallYarn = () => (
  <Col className="w-full gap-4">
    <Row className="w-full gap-4 justify-between">
      <div className="pinto-body">Check if Yarn is installed:</div>
      <CommandBlock command="yarn --version" />
    </Row>
    <Row className="w-full gap-4 justify-between">
      <div className="pinto-body">If not, install Yarn via this command:</div>
      <CommandBlock command="brew install yarn" />
    </Row>
  </Col>
);

const InstallGit = () => (
  <Col className="w-full gap-4">
    <Row className="w-full gap-4 justify-between">
      <div className="pinto-body">Check if Git is installed:</div>
      <CommandBlock command="git --version" />
    </Row>
    <Row className="w-full gap-4 justify-between">
      <div className="pinto-body">
        If not, install Git via this command or{" "}
        <a
          href="https://git-scm.com/downloads"
          target="_blank"
          rel="noopener noreferrer"
          className="text-pinto-green-4 hover:underline cursor-pointer"
        >
          here
        </a>
        :
      </div>
      <CommandBlock command="brew install git" />
    </Row>
  </Col>
);

const InstallProtocolRepo = () => (
  <Col className="w-full gap-4">
    <div className="pinto-body">
      Clone to your home directory, or{" "}
      <a
        href="https://github.com/pinto-org/protocol"
        target="_blank"
        rel="noopener noreferrer"
        className="text-pinto-green-4 hover:underline cursor-pointer"
      >
        or view here
      </a>
    </div>

    <CommandBlock command="cd ~ && git clone https://github.com/pinto-org/protocol.git && cd protocol" />
  </Col>
);

const InitializeTools = () => (
  <Col className="w-full gap-4">
    <div className="pinto-body">
      Make Scripts Executable and install all required tools: (only need to do this once)
    </div>
    <CommandBlock command="cd ~/protocol && chmod +x scripts/misc/initialize-tools.sh && chmod +x scripts/misc/initialize-dev-mode-upgrade.sh &&  ./scripts/misc/initialize-tools.sh" />
  </Col>
);

const RestartTerminalAndFoundry = () => (
  <Col className="w-full gap-4">
    <div className="pinto-body">Close and restart your terminal, then run this command to update Foundry:</div>
    <CommandBlock command="foundryup" />
  </Col>
);

const SetEnvironmentVariables = () => {
  const [blockNumber, setBlockNumber] = React.useState("");
  const [rpcUrl, setRpcUrl] = React.useState("");
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchLatestBlock = async () => {
      try {
        const apiKey = import.meta.env.VITE_ALCHEMY_API_KEY;
        if (!apiKey) {
          setLoading(false);
          return;
        }

        const rpc = `https://base-mainnet.g.alchemy.com/v2/${apiKey}`;
        const response = await fetch(rpc, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jsonrpc: "2.0",
            method: "eth_blockNumber",
            params: [],
            id: 1,
          }),
        });

        const data = await response.json();
        if (data.result) {
          const blockNum = parseInt(data.result, 16);
          setBlockNumber(blockNum.toString());
        }
      } catch (error) {
        console.error("Failed to fetch block number:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestBlock();
  }, []);

  const exportCommand = React.useMemo(() => {
    const commands = [];
    if (rpcUrl) {
      commands.push(`export BASE_RPC="${rpcUrl}"`);
    }
    if (blockNumber) {
      commands.push(`export FORK_BLOCK_NUMBER=${blockNumber}`);
    }
    return commands.length > 0 ? commands : ["# Enter values above to generate export commands"];
  }, [blockNumber, rpcUrl]);

  return (
    <Col className="w-full gap-4">
      <div className="pinto-body">
        Set these environment variables to cache your RPC endpoint and fork block number for faster Anvil node startup:
      </div>
      <Col className="w-full gap-2">
        <label className="pinto-body-sm text-pinto-secondary">Base RPC URL (optional):</label>
        <input
          type="text"
          value={rpcUrl}
          onChange={(e) => setRpcUrl(e.target.value)}
          placeholder="https://base-mainnet.g.alchemy.com/v2/YOUR_API_KEY"
          className="w-full px-3 py-2 rounded-md border border-pinto-gray-2 bg-pinto-off-white text-pinto-dark pinto-body focus:outline-none focus:ring-2 focus:ring-pinto-green-4"
        />
      </Col>
      <Col className="w-full gap-2">
        <label className="pinto-body-sm text-pinto-secondary">
          Latest Block Number {loading ? "(fetching...)" : "(auto-fetched)"}:
        </label>
        <input
          type="text"
          value={blockNumber}
          onChange={(e) => setBlockNumber(e.target.value)}
          placeholder={loading ? "Fetching latest block..." : "Enter block number"}
          className="w-full px-3 py-2 rounded-md border border-pinto-gray-2 bg-pinto-off-white text-pinto-dark pinto-body focus:outline-none focus:ring-2 focus:ring-pinto-green-4"
        />
      </Col>
      <CommandBlock command={exportCommand} />
      <div className="pinto-body-sm text-pinto-light italic">
        Note: Setting these variables caches them internally for fast startup on the Anvil node, avoiding the need to
        fetch the latest block on every restart.
      </div>
    </Col>
  );
};

const StartDevEnvironment = () => {
  const getURL = () => {
    const apiKey = import.meta.env.VITE_ALCHEMY_API_KEY;
    if (!apiKey) {
      return "";
    }
    return `https://base-mainnet.g.alchemy.com/v2/${apiKey}`;
  };

  return (
    <Col className="w-full gap-4">
      <div className="pinto-body">Start the dev environment:</div>
      <CommandBlock command={`cd ~/protocol && yarn && ./scripts/misc/initialize-dev-mode-upgrade.sh`} />
    </Col>
  );
};

// https://base-mainnet.g.alchemy.com/v2/gQJ37HEhkokRX7QRHBH5GVXfd-la1ocE

type CommandBlockProps = {
  command: string | string[];
  prompt?: string;
  className?: string;
};

export function CommandBlock({ command, prompt = "$", className }: CommandBlockProps) {
  const [copied, setCopied] = React.useState(false);
  const code = Array.isArray(command) ? command.join("\n") : command;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // handle error (toast, console.error, etc.)
    }
  };

  return (
    <div
      className={cn(
        "group relative rounded-lg border border-pinto-gray-2 bg-pinto-off-white text-pinto-dark shadow-sm ring-1 ring-pinto-gray-1/20",
        className,
      )}
    >
      {/* Code block */}
      <pre className="overflow-x-auto px-4 py-3 pr-16 text-pinto-body leading-6">
        <code className="font-mono text-pinto-secondary">
          {code.split("\n").map((line, i) => (
            <div key={i} className="whitespace-pre">
              <span className="select-none text-pinto-primary">{prompt} </span>
              {line}
            </div>
          ))}
        </code>
      </pre>

      {/* Copy button */}
      <button
        type="button"
        onClick={copy}
        className={cn(
          "absolute right-2 top-2 inline-flex items-center gap-1 rounded-sm px-2 py-1",
          "text-xsfont-medium transition-all focus:outline-none opacity-0 group-hover:opacity-100",
          copied
            ? "bg-pinto-gray-1 text-pinto-green-4 ring-1 ring-pinto-gray-2"
            : "bg-pinto-gray-1 text-pinto-dark ring-1 ring-pinto-gray-2",
        )}
      >
        {copied ? <CheckIcon className="h-5 w-5" /> : <CopyIcon className="h-5 w-5" />}
      </button>
    </div>
  );
}
