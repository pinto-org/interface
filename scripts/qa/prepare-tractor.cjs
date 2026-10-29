// Local Anvil fixture only. No private credentials, no production deployments.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const protocol = path.resolve(__dirname, "../../../protocol");
const { ethers } = require(path.join(protocol, "node_modules/ethers"));
const { link } = require(path.join(protocol, "scripts/ordered-deposits/upgrade"));
const { expectedRuntime } = require(path.join(protocol, "scripts/tractor/deploy-redemption-helpers-anvil"));
const { assertLocalUrl } = require(path.join(protocol, "scripts/ordered-deposits/rehearse-anvil"));
const provider = new ethers.providers.JsonRpcProvider(assertLocalUrl(process.argv[4] || "http://127.0.0.1:18569"));
const diamond = "0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f";
const donor = "0xa0AA5f404664A175Cd84e29B36840556f1C888E4";
const mnemonic = "test test test test test test test test test test test junk";
async function main() {
  assert.match(await provider.send("web3_clientVersion", []), /^anvil\//);
  assert.equal((await provider.getNetwork()).chainId, 1337);
  assert.ok(process.argv[2], "Pass parent helper manifest");
  assert.ok(process.argv[3], "Pass a new output JSON path");
  assert.ok(!fs.existsSync(process.argv[3]), "Preserve existing fixture evidence");
  const manifest = JSON.parse(fs.readFileSync(process.argv[2]));
  assert.equal(manifest.complete, true);
  const deployments = Object.fromEntries(manifest.deployments.map((d) => [d.name, d.address]));
  for (const d of manifest.deployments) assert.equal(ethers.utils.keccak256(await provider.getCode(d.address)), d.codeHash);
  const wallet = ethers.Wallet.fromMnemonic(mnemonic).connect(provider);
  // The public Anvil address can inherit an EIP-7702 delegation from Base.
  // This fixture explicitly tests a plain EOA; smart-wallet coverage is separate.
  const inheritedPublisherCode = await provider.getCode(wallet.address);
  if (inheritedPublisherCode !== "0x") await provider.send("anvil_setCode", [wallet.address, "0x"]);
  const bean = new ethers.Contract(diamond, require(path.join(protocol, "abi/Beanstalk.json")), provider);
  const owner = await bean.owner();
  const pinto = await bean.getBeanToken();
  const links = {};
  const hre = require(path.join(protocol, "node_modules/hardhat"));
  for (const [name, address] of Object.entries(deployments)) {
    const artifact = await hre.artifacts.readArtifact(name);
    links[`${artifact.sourceName}:${name}`] = address;
  }
  const report = { noLiveWrites: true, chainId: 1337, startBlock: await provider.getBlockNumber(), publisher: wallet.address, inheritedPublisherCode, publisherMode: "EOA", deployments, transactions: [] };
  const sharedImmutables = { beanstalk: diamond, beanToken: pinto, tractorHelpers: deployments.TractorHelpers, siloHelpers: deployments.SiloHelpers };
  for (const [name, args, immutables] of [
    ["ConvertUpBlueprint", [diamond, owner, deployments.TractorHelpers, deployments.SiloHelpers, deployments.BeanstalkPrice], { ...sharedImmutables, beanstalkPrice: deployments.BeanstalkPrice }],
    ["SowBlueprint", [diamond, owner, deployments.TractorHelpers, deployments.SiloHelpers], sharedImmutables],
  ]) {
    const artifact = await hre.artifacts.readArtifact(name);
    const factory = new ethers.ContractFactory(artifact.abi, link(artifact.bytecode, artifact.linkReferences, links), wallet);
    const contract = await factory.deploy(...args, { gasLimit: 16_777_216 });
    const receipt = await contract.deployTransaction.wait();
    const code = await provider.getCode(contract.address);
    assert.ok(ethers.utils.arrayify(code).length <= 24_576);
    const build = await hre.artifacts.getBuildInfo(`${artifact.sourceName}:${name}`);
    assert.equal(code.toLowerCase(), expectedRuntime(artifact, build, links, immutables, contract.address));
    deployments[name] = contract.address;
    report.transactions.push({ name, hash: receipt.transactionHash, gas: receipt.gasUsed.toString(), runtimeBytes: ethers.utils.arrayify(code).length });
  }
  // Transfer a small portion of existing mature deposits; do not fabricate histories.
  await provider.send("anvil_impersonateAccount", [donor]);
  const donorBean = bean.connect(provider.getSigner(donor));
  const tokens = await bean["getDepositsForAccount(address)"](donor);
  const calls = [];
  for (const row of tokens) {
    const germinatingStem = await bean.getGerminatingStem(row.token);
    const isPinto = row.token.toLowerCase() === pinto.toLowerCase();
    for (let i = 0; i < row.depositIds.length; i++) {
      const stem = row.depositIds[i].mask(96).fromTwos(96);
      if (stem.gte(germinatingStem)) continue;
      let amount = row.tokenDeposits[i].amount.div(4);
      if (isPinto) {
        const lock = await bean.getAutoConvertOutputLock(donor, stem);
        if (lock[0].gt(0)) continue;
      }
      if (amount.isZero()) continue;
      calls.push(bean.interface.encodeFunctionData("transferDeposit", [donor, wallet.address, row.token, stem, amount]));
    }
  }
  assert.ok(calls.length > 0);
  const receipt = await (await donorBean.farm(calls, { gasLimit: 16_777_216 })).wait();
  report.transactions.push({ name: "fund mature deposits", hash: receipt.transactionHash, gas: receipt.gasUsed.toString() });
  report.endBlock = await provider.getBlockNumber();
  fs.writeFileSync(process.argv[3], JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
}
main().catch(e => { console.error(e.reason || e.message); process.exitCode = 1; });
