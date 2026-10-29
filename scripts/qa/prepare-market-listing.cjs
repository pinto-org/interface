// QA ONLY: move 200 existing mid-line Pods to the publisher on the disposable child.
// No deployment, minting, live RPC, funding, listing cancellation or automatic retry.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { ethers } = require("../../../protocol/node_modules/ethers");

async function main(output) {
  assert.ok(output && path.isAbsolute(output) && !fs.existsSync(output) &&
    !fs.existsSync(output + ".preflight.json"), "fresh absolute evidence files required");
  const rpc = "http://127.0.0.1:18569";
  const provider = new ethers.providers.JsonRpcProvider({ url: rpc, timeout: 20_000 });
  assert.equal(await provider.send("eth_chainId", []), "0x539");
  assert.match(await provider.send("web3_clientVersion", []), /^anvil\//);
  const head = await provider.getBlock("latest");
  assert.equal(head.number, 53179863);
  assert.equal(head.hash, "0x51e9f2dbbbcd4f722c055947ff0c32328b297cbf1c8a71937ff322f4aa211082");
  const raw = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../../../protocol/abi/Beanstalk.json"), "utf8"));
  const d = new ethers.Contract("0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f", raw.abi || raw, provider);
  const source = "0x32548f83cadb8c5b91001f0ad9979b04fa75ceb4";
  const recipient = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
  const index = ethers.BigNumber.from("17861597363077");
  const amount = ethers.BigNumber.from("200000000");
  const sourcePods = await d.plot(source, 0, index);
  assert.equal(sourcePods.toString(), "419006982");
  assert.equal((await d.plot(recipient, 0, index)).toString(), "0");
  assert.equal(await d.getPodListing(0, index), ethers.constants.HashZero, "do not cancel an existing listing");
  const globalBefore = {};
  for (const name of ["podIndex", "harvestableIndex", "totalPods", "totalHarvested", "totalHarvestable"])
    globalBefore[name] = (await d[name](0)).toString();
  const line = ethers.BigNumber.from(globalBefore.podIndex).sub(globalBefore.harvestableIndex);
  const place = index.sub(globalBefore.harvestableIndex);
  assert.ok(place.gt(line.div(20)) && place.add(amount).lt(line.mul(9).div(10)), "require an unharvested mid-line plot");
  const recipientPlotsBefore = await d.getPlotsFromAccount(recipient, 0);
  const total = (plots) => plots.reduce((sum, x) => sum.add(x.pods), ethers.BigNumber.from(0));
  const recipientPodsBefore = total(recipientPlotsBefore);
  const signer = provider.getSigner(source);
  const args = [source, recipient, 0, index, 0, amount];
  await d.connect(signer).callStatic.transferPlot(...args);
  const gasLimit = (await d.connect(signer).estimateGas.transferPlot(...args)).mul(130).div(100).add(50_000);
  const gasPrice = await provider.getGasPrice();
  assert.ok(gasLimit.lt(2_000_000), "bounded fixture gas");
  assert.ok((await provider.getBalance(source)).gte(gasLimit.mul(gasPrice)), "do not silently fund source");
  assert.equal((await provider.getBlock("latest")).hash, head.hash, "child changed during preflight");
  const preflight = { noLiveWrites: true, rpc, chainId: 1337, beforeBlock: head.number, beforeHash: head.hash,
    source, recipient, index: index.toString(), transferredPods: amount.toString(), sourcePods: sourcePods.toString(),
    recipientPodsBefore: recipientPodsBefore.toString(), globalBefore,
    calldata: d.interface.encodeFunctionData("transferPlot", args), gasLimit: gasLimit.toString(), gasPrice: gasPrice.toString() };
  fs.writeFileSync(output + ".preflight.json", JSON.stringify(preflight, null, 2) + "\n", { flag: "wx" });
  console.log("Verified fixture; creating local recovery snapshot");
  const snapshot = await provider.send("evm_snapshot", []);
  console.log("Snapshot: " + snapshot);
  let receipt;
  await provider.send("anvil_impersonateAccount", [source]);
  try {
    console.log("Submitting one local plot transfer");
    const tx = await d.connect(signer).transferPlot(...args, { gasLimit, gasPrice });
    console.log("Local fixture transaction: " + tx.hash);
    receipt = await tx.wait();
    assert.equal(receipt.status, 1);
  } finally {
    await provider.send("anvil_stopImpersonatingAccount", [source]);
  }
  assert.equal((await d.plot(recipient, 0, index)).toString(), amount.toString());
  assert.equal((await d.plot(source, 0, index)).toString(), "0");
  assert.equal((await d.plot(source, 0, index.add(amount))).toString(), sourcePods.sub(amount).toString());
  assert.equal(total(await d.getPlotsFromAccount(recipient, 0)).toString(), recipientPodsBefore.add(amount).toString());
  for (const [name, value] of Object.entries(globalBefore)) assert.equal((await d[name](0)).toString(), value);
  const report = { ...preflight, snapshot, transaction: receipt.transactionHash, gas: receipt.gasUsed.toString(),
    block: receipt.blockNumber, blockHash: receipt.blockHash };
  fs.writeFileSync(output, JSON.stringify(report, null, 2) + "\n", { flag: "wx" });
  console.log(JSON.stringify(report));
}
if (require.main === module) main(process.argv[2]).catch(error => {
  console.error(error.reason || error.message);
  process.exitCode = 1;
});
