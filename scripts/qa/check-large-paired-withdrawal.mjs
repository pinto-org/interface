// Local-only isolation test for the fee-exempt legs, without downstream 0x execution.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createServer} from 'vite';
import {createPublicClient,createWalletClient,http,encodeFunctionData,erc20Abi,parseAbi} from 'viem';
import {base} from 'viem/chains';
const rpc='http://127.0.0.1:18622',chain={...base,id:1337},account='0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',diamond='0xd1a0d188e861ed9d15773a2f3574a2e94134ba8f',pinto='0xb170000aeeFa790fa61D6e837d1035906839a3c8';
const c=createPublicClient({chain,transport:http(rpc)}),w=createWalletClient({chain,account,transport:http(rpc)});
assert.equal(await c.getChainId(),1337);assert.match(await c.request({method:'web3_clientVersion'}),/^anvil\//);
process.env.VITE_BASE_ENDPOINT='pinto.money';const server=await createServer({server:{middlewareMode:true},appType:'custom'});
const snapshot=await c.request({method:'evm_snapshot'});
try{
 const {readRoutePools,splitByReserves,partitionSelection,routeABI}=await server.ssrLoadModule('/src/lib/redemption/route.ts');
 const {selectRedemptionDeposits,quoteRedemption,redemptionWriteFunction}=await server.ssrLoadModule('/src/utils/siloRedemption.ts');
 const {autoConvertABI}=await server.ssrLoadModule('/src/constants/abi/autoConvertABI.ts');
 const wells=await c.readContract({address:diamond,abi:parseAbi(['function getWhitelistedWellLpTokens() view returns(address[])']),functionName:'getWhitelistedWellLpTokens'});
 const pools=await readRoutePools(c,{account,diamond,pinto,wells,kind:'pinto'});
 const selected=partitionSelection(selectRedemptionDeposits(pools[0].snapshot.deposits,100000000000n),splitByReserves(100000000000n,pools.map(p=>p.weight)));
 const legs=[];for(let i=0;i<pools.length;i++){const p=pools[i],s=selected[i];legs.push({well:p.snapshot.well,token:p.snapshot.outputToken,pinto:s.amount,expected:await quoteRedemption(c,p.snapshot,s),before:await c.readContract({address:p.snapshot.outputToken,abi:erc20Abi,functionName:'balanceOf',args:[account]}),selection:s});}
 const calls=legs.map(l=>({callData:encodeFunctionData({abi:autoConvertABI,functionName:redemptionWriteFunction('pinto'),args:[l.well,l.selection.stems,l.selection.amounts,l.expected*9950n/10000n,pools[0].snapshot.timestamp+120n,0]}),clipboard:`0x${'0'.repeat(64)}`}));
 const args={address:diamond,abi:routeABI,functionName:'advancedFarm',args:[calls]};await c.simulateContract({...args,account});const estimate=await c.estimateContractGas({...args,account});const gas=estimate*130n/100n+50000n;assert(gas<=16777216n);
 const hash=await w.writeContract({...args,gas}),receipt=await c.waitForTransactionReceipt({hash});assert.equal(receipt.status,'success');
 for(const l of legs){l.received=(await c.readContract({address:l.token,abi:erc20Abi,functionName:'balanceOf',args:[account]}))-l.before;assert.equal(l.received,l.expected);delete l.selection;delete l.before;}
 const report={noLiveWrites:true,status:'passed',scope:'All three fee-free Pinto legs only; no 0x swaps',pinto:'100000',hash,gasUsed:receipt.gasUsed,legs};
 const json=JSON.stringify(report,(_,v)=>typeof v==='bigint'?String(v):v,2);fs.writeFileSync(process.argv[2],json);console.log(json);
}finally{assert.equal(await c.request({method:'evm_revert',params:[snapshot]}),true);await server.close();}
