// QA ONLY: transfer one existing, already-harvestable Pod on the disposable child.
// Does not mint Pods, advance harvestability, deploy code or contact a public RPC.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { ethers } = require("../../../protocol/node_modules/ethers");

const rpc = "http://127.0.0.1:18569";
const diamond = "0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f";
const pinto = "0xb170000aeeFa790fa61D6e837d1035906839a3c8";
const source = "0x32548f83cadb8c5b91001f0ad9979b04fa75ceb4";
const recipient = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
const index = ethers.BigNumber.from("3120854575045");
const amount = ethers.BigNumber.from(1_000_000);
const expectedHead = "0x2fc791c615e65d4d02794bfa397b592b55fc66eb165efb021ef5003e97081ad2";

async function main(output) {
  assert.ok(output && path.isAbsolute(output) && !fs.existsSync(output), "fresh absolute evidence file required");
  assert.ok(!fs.existsSync(output + ".preflight.json"), "fresh preflight evidence file required");
  const provider = new ethers.providers.JsonRpcProvider({ url: rpc, timeout: 20_000 });
  assert.equal(await provider.send("eth_chainId", []), "0x539");
  assert.match(await provider.send("web3_clientVersion", []), /^anvil\//);
  const head = await provider.getBlock("latest");
  assert.equal(head.hash, expectedHead, "fixture is bound to the verified QA child head");
  assert.equal(head.number, 53179861);
  console.log("Verified disposable child head; checking existing plot and accounting");
  const raw = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../../../protocol/abi/Beanstalk.json"), "utf8"));
  const contract = new ethers.Contract(diamond, raw.abi || raw, provider);
  const token = new ethers.Contract(pinto, ["function balanceOf(address) view returns (uint256)"], provider);
  const sourcePods = await contract.plot(source, 0, index);
  const harvestable = await contract.harvestableIndex(0);
  const totalHarvested = await contract.totalHarvested(0);
  const totalHarvestable = await contract.totalHarvestable(0);
  assert.equal(sourcePods.toString(), "115929402");
  assert.ok(index.add(amount).lte(harvestable), "entire one-Pod input must already be harvestable");
  assert.equal((await contract.plot(recipient, 0, index)).toString(), "0");
  assert.equal(await contract.getPodListing(0, index), ethers.constants.HashZero, "do not cancel a source listing");
  const stem = await contract.stemTipForToken(pinto);
  const existingDeposit = await contract.getDeposit(recipient, pinto, stem);
  const deposits = await contract.getTokenDepositsForAccount(recipient, pinto);
  const recipientBefore = {
    walletPinto: (await token.balanceOf(recipient)).toString(),
    internalPinto: (await contract.getInternalBalance(recipient, pinto)).toString(),
    depositedPinto: deposits.tokenDeposits.reduce((sum, x) => sum.add(x.amount), ethers.BigNumber.from(0)).toString(),
    germinatingStalk: (await contract.balanceOfGerminatingStalk(recipient)).toString(),
    stem: stem.toString(), stemAmount: existingDeposit[0].toString(), stemBdv: existingDeposit[1].toString(),
  };
  console.log("Existing harvestability and recipient balances verified; simulating native plot transfer");
  const nativeBalance = await provider.getBalance(source);
  const signer = provider.getSigner(source);
  const args = [source, recipient, 0, index, 0, amount];
  await contract.connect(signer).callStatic.transferPlot(...args);
  const gas = await contract.connect(signer).estimateGas.transferPlot(...args);
  const gasLimit = gas.mul(130).div(100).add(50_000);
  const gasPrice = await provider.getGasPrice();
  assert.ok(gasLimit.lt(2_000_000), "bounded fixture gas");
  assert.ok(nativeBalance.gte(gasLimit.mul(gasPrice)), "source lacks local gas; do not silently fund it");
  assert.equal((await provider.getBlock("latest")).hash, head.hash, "child changed during preflight");
  console.log("Transfer simulation and local gas funding verified");
  // Retain the verified input state even if a later RPC response is lost. Never
  // automatically retry a timed-out send: reconcile the child and txpool first.
  fs.writeFileSync(output + ".preflight.json", JSON.stringify({
    noLiveWrites: true, rpc, chainId: 1337, source, recipient,
    beforeBlock: head.number, beforeHash: head.hash, sourcePods: sourcePods.toString(),
    index: index.toString(), transferredPods: amount.toString(),
    harvestableIndex: harvestable.toString(), totalHarvested: totalHarvested.toString(),
    totalHarvestable: totalHarvestable.toString(), recipientBefore,
    calldata: contract.interface.encodeFunctionData("transferPlot", args),
    gasLimit: gasLimit.toString(), gasPrice: gasPrice.toString(),
  }, null, 2) + "\n", { flag: "wx" });
  console.log("Creating local recovery snapshot");
  const snapshot = await provider.send("evm_snapshot", []);
  console.log("Local recovery snapshot: " + snapshot);
  let receipt;
  console.log("Impersonating local fixture source");
  await provider.send("anvil_impersonateAccount", [source]);
  try {
    console.log("Submitting local one-Pod fixture transfer");
    const tx = await contract.connect(signer).transferPlot(...args, { gasLimit, gasPrice });
    console.log("Local one-Pod fixture transfer: " + tx.hash);
    receipt = await tx.wait();
    assert.equal(receipt.status, 1);
  } finally {
    await provider.send("anvil_stopImpersonatingAccount", [source]);
    console.log("Stopped local fixture impersonation");
  }
  assert.equal((await contract.plot(recipient, 0, index)).toString(), amount.toString());
  assert.equal((await contract.plot(source, 0, index)).toString(), "0");
  assert.equal((await contract.plot(source, 0, index.add(amount))).toString(), sourcePods.sub(amount).toString());
  assert.equal((await contract.harvestableIndex(0)).toString(), harvestable.toString());
  assert.equal((await contract.totalHarvested(0)).toString(), totalHarvested.toString());
  assert.equal((await contract.totalHarvestable(0)).toString(), totalHarvestable.toString());
  assert.equal((await token.balanceOf(recipient)).toString(), recipientBefore.walletPinto);
  assert.equal((await contract.getInternalBalance(recipient, pinto)).toString(), recipientBefore.internalPinto);
  const report = {
    noLiveWrites: true, rpc, chainId: 1337, snapshot, source, recipient,
    beforeBlock: head.number, beforeHash: head.hash, sourcePods: sourcePods.toString(),
    index: index.toString(), transferredPods: amount.toString(),
    harvestableIndex: harvestable.toString(), totalHarvested: totalHarvested.toString(),
    totalHarvestable: totalHarvestable.toString(), recipientBefore,
    transaction: receipt.transactionHash, gas: receipt.gasUsed.toString(),
    block: receipt.blockNumber, blockHash: receipt.blockHash,
  };
  fs.writeFileSync(output, JSON.stringify(report, null, 2) + "\n", { flag: "wx" });
  console.log(JSON.stringify(report));
}

if (require.main === module) main(process.argv[2]).catch((error) => {
  console.error(error.reason || error.message);
  process.exitCode = 1;
});
