import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { connect, disconnect, getAccount, watchAccount } from "@wagmi/core";
import App from "../../src/App";
import { HelmetProvider } from "react-helmet-async";
import Providers from "../../src/Providers";
import config, { qaAccount, qaOperator, qaObserver, qaState, qaReadControls, selectQaAccount, selectQaReportedChain } from "./wallet";
import "../../src/index.css";

function QAControls() {
  const [, update] = useState(0);
  const [error, setError] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => {
    const refresh = () => update((value) => value + 1);
    const unwatch = watchAccount(config, { onChange: refresh });
    window.addEventListener("qa-wallet-update", refresh);
    return () => { unwatch(); window.removeEventListener("qa-wallet-update", refresh); };
  }, []);
  return <aside style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 99999, padding: 8, background: "#fff3cd", fontSize: 12 }}>
    <strong>LOCAL FORK QA — no real funds / no extension wallet. Tractor orders and Pod Market orders/listings are NEW local entries only, after block 53178878; not production subgraph coverage. Convert bonus/capacity charts show only actual local fork observations since that block, not full historical data.</strong>{" "}
    <button onClick={() => setCollapsed((value) => !value)}>{collapsed ? "Expand QA controls" : "Collapse QA controls"}</button>{" "}
    {!collapsed && <>
    <button onClick={() => void connect(config, { connector: config.connectors[0] }).catch((e) => setError(e.message))}>Connect QA wallet</button>{" | "}
    <button onClick={() => void disconnect(config)}>Disconnect QA wallet</button>{" | "}
    <button onClick={() => selectQaAccount(qaAccount)}>Use QA publisher</button>{" | "}
    <button onClick={() => selectQaAccount(qaOperator)}>Use QA operator</button>{" | "}
    <button onClick={() => selectQaAccount(qaObserver)}>Use fork depositor</button>{" | "}
    <button onClick={() => { qaState.rejectNext = true; update((value) => value + 1); }}>Reject next transaction</button>
    {" | "}<button onClick={() => selectQaReportedChain(1338)}>Simulate wrong wallet network</button>
    {" | "}<button onClick={() => selectQaReportedChain(1337)}>Restore wallet network</button>
    <div>
      <button onClick={() => qaReadControls.setDepositFailure(true)}>Fail deposit RPC reads</button>{" | "}
      <button onClick={() => qaReadControls.setDepositFailure(false)}>Restore deposit RPC reads</button>{" | "}
      <button disabled={qaReadControls.state.estimatePending} onClick={() => qaReadControls.armEstimateHold()}>Hold next exit estimate</button>{" | "}
      <button onClick={() => qaReadControls.releaseEstimate()}>Release exit estimate</button>
      <span> · read failures: {qaReadControls.state.failedReads} · failing: {String(qaReadControls.state.failDepositReads)} · estimate: {qaReadControls.state.estimatePending ? "held" : qaReadControls.state.holdNextEstimate ? "armed" : "normal"}</span>
    </div>
    <div>{getAccount(config).status}: {qaState.account} · wallet chain {qaState.reportedChainId} (RPC fixed to local 1337) · submitted {qaState.sends.length} · reject next: {String(qaState.rejectNext)}</div>
    <details><summary>Local transaction receipts ({qaState.sends.length})</summary>
      {qaState.sends.map(({ hash }) => <div key={hash}>Local transaction: {hash}</div>)}
    </details>
    {error && <p role="alert">{error}</p>}
    </>}
  </aside>;
}
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode><Providers><HelmetProvider><App /><QAControls /></HelmetProvider></Providers></React.StrictMode>,
);
