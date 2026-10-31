// Read-only balances, deposit amounts, receipts and allowance assertions for the local UI run.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createPublicClient, http, erc20Abi, parseAbi, parseEventLogs } from 'viem';
import { base } from 'viem/chains';
const rpc = process.env.PINTO_QA_RPC; assert.equal(new URL(rpc).hostname, '127.0.0.1');
const client = createPublicClient({ chain: { ...base, id: 1337 }, transport: http(rpc) });
assert.equal(await client.getChainId(),1337);
const account='0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', diamond='0xd1a0d188e861ed9d15773a2f3574a2e94134ba8f', pipeline='0xb1bE0001f5a373b69b1E132b420e6D9687155e80', holder='0x0000000000001fF3684f28c67538d4D072C22734';
const tokens={PINTO:'0xb170000aeeFa790fa61D6e837d1035906839a3c8',USDC:'0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',cbETH:'0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22',cbBTC:'0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf'};
const abi=parseAbi(['function getTokenDepositsForAccount(address account,address token) view returns((address token,uint256[] depositIds,(uint128 amount,uint128 bdv)[] tokenDeposits))','function getInternalBalance(address account,address token) view returns(uint256)','function balanceOfStalk(address account) view returns(uint256)','event SiloPintoDepositsSwapped(address indexed account,address indexed well,address indexed tokenOut,uint256 pintoAmount,uint256 amountOut,uint8 mode)']);
const block=await client.getBlock();
const read=(address,abi,functionName,args)=>client.readContract({address,abi,functionName,args,blockNumber:block.number});
const state={block:String(block.number),hash:block.hash,timestamp:String(block.timestamp),balances:{},deposits:await read(diamond,abi,'getTokenDepositsForAccount',[account,tokens.PINTO]),stalk:await read(diamond,abi,'balanceOfStalk',[account])};
for(const [name,address]of Object.entries(tokens)) state.balances[name]={wallet:await read(address,erc20Abi,'balanceOf',[account]),internal:await read(diamond,abi,'getInternalBalance',[account,address]),pipeline:await read(address,erc20Abi,'balanceOf',[pipeline]),allowance:await read(address,erc20Abi,'allowance',[pipeline,holder])};
const stringify=v=>JSON.stringify(v,(_,v)=>typeof v==='bigint'?String(v):v,2);
if(process.argv[3]) {
 const before=JSON.parse(fs.readFileSync(process.argv[3],'utf8'));
 const receipt=await client.getTransactionReceipt({hash:process.argv[4]}); assert.equal(receipt.status,'success');
 const events=parseEventLogs({abi,logs:receipt.logs.filter(l=>l.address.toLowerCase()===diamond),eventName:'SiloPintoDepositsSwapped'});
 assert.equal(events.length,3);assert(events.every(e=>e.args.account.toLowerCase()===account.toLowerCase()));
 const withdrawn=events.reduce((n,e)=>n+e.args.pintoAmount,0n);
 const sum=d=>d.tokenDeposits.reduce((n,t)=>n+BigInt(t.amount),0n);
 assert.equal(sum(before.deposits)-sum(state.deposits),withdrawn);
 for(const name of Object.keys(tokens)) {
   assert.equal(state.balances[name].internal,BigInt(before.balances[name].internal));
   assert.equal(state.balances[name].pipeline,0n);
   // Only sold paired-token approvals are touched; unrelated Pinto/USDC approvals may predate this feature.
   if(name==='cbETH'||name==='cbBTC') assert.equal(state.balances[name].allowance,0n);
   if(name!=='USDC') assert.equal(state.balances[name].wallet,BigInt(before.balances[name].wallet));
 }
 state.verification={withdrawn,usdcReceived:state.balances.USDC.wallet-BigInt(before.balances.USDC.wallet),gasUsed:receipt.gasUsed,hash:receipt.transactionHash,allThreePools:true,internalBalancesPreserved:true,noPairedDust:true,pairedAllowancesCleared:true,events:events.map(e=>e.args)};
}
fs.writeFileSync(process.argv[2],stringify(state));
console.log(stringify(state.verification??{block:state.block,balances:state.balances}));
