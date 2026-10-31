// Replay the actual UI transaction on the disposable comparison fork, then prove
// that failing only its final minimum-output check rolls back all token/deposit state.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createPublicClient,createWalletClient,http,parseAbi,erc20Abi,decodeFunctionData,encodeFunctionData} from 'viem';
import {base} from 'viem/chains';
const chain={...base,id:1337},rpc=process.env.PINTO_QA_ATOMICITY_RPC??'http://127.0.0.1:18621';
assert(['http://127.0.0.1:18621','http://127.0.0.1:18628'].includes(rpc));
const client=createPublicClient({chain,transport:http(rpc)}),ui=createPublicClient({chain,transport:http(process.env.PINTO_QA_SOURCE_RPC??'http://127.0.0.1:18620')});
assert.equal(await client.getChainId(),1337);assert.match(await client.request({method:'web3_clientVersion'}),/^anvil\//);
const hash=process.env.PINTO_QA_UI_HASH??'0xa6c37baa80cabb092749aa6dd3f62a069ed401d0cb9577c8bb62d69af7d7fe95';
const tx=await ui.getTransaction({hash}),block=await ui.getBlock({blockNumber:tx.blockNumber});
const account='0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',diamond='0xd1a0d188e861ed9d15773a2f3574a2e94134ba8f',pipeline='0xb1bE0001f5a373b69b1E132b420e6D9687155e80',holder='0x0000000000001fF3684f28c67538d4D072C22734';
assert.equal(tx.from.toLowerCase(),account.toLowerCase());assert.equal(tx.to.toLowerCase(),diamond);
const wallet=createWalletClient({chain,account,transport:http(rpc)});
const abi=parseAbi(['function advancedFarm((bytes callData,bytes clipboard)[] data) payable returns(bytes[])','function advancedPipe((address target,bytes callData,bytes clipboard)[] pipes,uint256 value) payable returns(bytes[])','function gte(uint256 a,uint256 b) pure returns(bool)','function check(bool condition) pure','function getTokenDepositsForAccount(address account,address token) view returns((address token,uint256[] depositIds,(uint128 amount,uint128 bdv)[] tokenDeposits))','function getInternalBalance(address account,address token) view returns(uint256)','function balanceOfStalk(address account) view returns(uint256)']);
const tokens=['0xb170000aeeFa790fa61D6e837d1035906839a3c8','0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913','0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22','0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf'];
const read=(address,abi,functionName,args)=>client.readContract({address,abi,functionName,args});
async function state(){const balances=[];for(const t of tokens)balances.push({wallet:await read(t,erc20Abi,'balanceOf',[account]),internal:await read(diamond,abi,'getInternalBalance',[account,t]),pipeline:await read(t,erc20Abi,'balanceOf',[pipeline]),allowance:await read(t,erc20Abi,'allowance',[pipeline,holder])});return {balances,deposits:await read(diamond,abi,'getTokenDepositsForAccount',[account,tokens[0]]),stalk:await read(diamond,abi,'balanceOfStalk',[account])};}
const farm=decodeFunctionData({abi,data:tx.input});assert.equal(farm.functionName,'advancedFarm');
const calls=farm.args[0].map(c=>({...c}));const settlement=decodeFunctionData({abi,data:calls.at(-1).callData});assert.equal(settlement.functionName,'advancedPipe');
let changed=0;const pipes=settlement.args[0].map(c=>{if(c.callData.slice(0,10)===encodeFunctionData({abi,functionName:'gte',args:[0n,0n]}).slice(0,10)){changed++;return {...c,callData:encodeFunctionData({abi,functionName:'gte',args:[0n,2n**255n]})};}return c;});assert.equal(changed,1);
calls.at(-1).callData=encodeFunctionData({abi,functionName:'advancedPipe',args:[pipes,0n]});
const badData=encodeFunctionData({abi,functionName:'advancedFarm',args:[calls]});
const reports=[];
for(const [name,data] of [['exact-UI-replay',tx.input],['impossible-final-minimum',badData]]){
 const snapshot=await client.request({method:'evm_snapshot'});
 try{
  const head=await client.getBlock();assert(head.timestamp<block.timestamp);
  if(head.timestamp<block.timestamp-1n){await client.request({method:'evm_setNextBlockTimestamp',params:[Number(block.timestamp)-1]});await client.request({method:'evm_mine'});}
  const before=await state();
  await client.request({method:'evm_setNextBlockTimestamp',params:[Number(block.timestamp)]});
  const sent=await wallet.sendTransaction({to:diamond,data,gas:tx.gas});const receipt=await client.waitForTransactionReceipt({hash:sent});
  const after=await state();
  if(name==='exact-UI-replay'){assert.equal(receipt.status,'success');assert.equal(after.balances[1].wallet-before.balances[1].wallet,BigInt(process.env.PINTO_QA_EXPECTED_RECEIVED??'165114801'));}
  else {assert.equal(receipt.status,'reverted');assert.deepEqual(after,before);assert(receipt.gasUsed<tx.gas);
   const trace=await client.request({method:'debug_traceTransaction',params:[sent,{tracer:'callTracer'}]});
   const failed=[];const walk=f=>{if(f.error)failed.push(f);for(const x of f.calls??[])walk(x);};walk(trace);
   const last=failed.at(-1);assert.equal(last.to.toLowerCase(),'0x5a5a5af07d8a389472adc1e60aa71bac89fcff8b');
   assert.equal(last.input,encodeFunctionData({abi,functionName:'check',args:[false]}));
   fs.writeFileSync(process.argv[2]+'.trace.json',JSON.stringify(trace));
  }
  reports.push({name,hash:sent,status:receipt.status,gasUsed:String(receipt.gasUsed),tokenDepositAndAllowanceStateRolledBack:name==='impossible-final-minimum'});
 }finally{assert.equal(await client.request({method:'evm_revert',params:[snapshot]}),true);}
}
fs.writeFileSync(process.argv[2],JSON.stringify({noLiveWrites:true,rpc,sourceUiHash:hash,reports},null,2));console.log(JSON.stringify(reports,null,2));
