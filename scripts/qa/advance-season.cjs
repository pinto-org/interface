// Disposable child only: advance real Sunrise without changing protocol state by cheatcode.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const protocol = path.resolve(__dirname, "../../../protocol");
const { ethers } = require(path.join(protocol, "node_modules/ethers"));
const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:18569");
provider.pollingInterval = 100;
const diamond = "0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f";

async function main() {
  assert.match(await provider.send("web3_clientVersion", []), /^anvil\//);
  assert.equal((await provider.getNetwork()).chainId, 1337);
  const destination = process.argv[2];
  assert.ok(destination && !fs.existsSync(destination), "Pass a new report path; preserve existing evidence");
  const hours = Number(process.argv[3] ?? 1);
  assert.ok(Number.isInteger(hours) && hours >= 1 && hours <= 30);
  const signer = ethers.Wallet.fromMnemonic("test test test test test test test test test test test junk").connect(provider);
  const baseAbi = require(path.join(protocol, "abi/Beanstalk.json"));
  const libArtifact = require(path.join(protocol, "artifacts/contracts/libraries/Convert/LibAutoConvertSunrise.sol/LibAutoConvertSunrise.json"));
  const abi = [...new Map([...baseAbi, ...libArtifact.abi].map((item) => [JSON.stringify(item), item])).values()];
  const bean = new ethers.Contract(diamond, abi, signer);
  const report = { noLiveWrites: true, rpc: "http://127.0.0.1:18569", startBlock: await provider.getBlockNumber(), checkpoint: await provider.send("evm_snapshot", []), hours: [] };
  const stringify = (value) => JSON.stringify(value, (key, v) => v?.type === "BigNumber" ? ethers.BigNumber.from(v).toString() : v, 2);
  for (let i = 0; i < hours; ++i) {
    const before = await bean.time();
    const block = await provider.getBlock("latest");
    const next = Math.max(Number(before.timestamp) + 3600, Number(before.start) + Number(before.period) * (Number(before.current) + 1), block.timestamp + 1);
    await provider.send("evm_setNextBlockTimestamp", [next]);
    const receipt = await (await bean.sunrise({ gasLimit: 16_777_216 })).wait();
    const after = await bean.time();
    const events = receipt.logs.filter((log) => log.address.toLowerCase() === diamond.toLowerCase()).flatMap((log) => {
      try { const event = bean.interface.parseLog(log); return [{ name: event.name, args: Object.fromEntries(Object.entries(event.args).filter(([key]) => !/^\d+$/.test(key))) }]; }
      catch { return []; }
    });
    assert.equal(Number(after.current), Number(before.current) + 1);
    const result = { beforeSeason: before.current, season: after.current, timestamp: next, block: receipt.blockNumber, hash: receipt.transactionHash, gas: receipt.gasUsed, events };
    report.hours.push(result);
    fs.writeFileSync(destination, stringify(report));
    console.log(stringify(result));
  }
}
main().catch((error) => { console.error(error.reason || error.message); process.exitCode = 1; });
