// Destructive only to the explicitly selected disposable comparison child: resets its own snapshots.
// Compares actual receipts from identical initial pool/deposit state, with live 0x quotes.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createServer } from 'vite';
import { createPublicClient, createWalletClient, http, parseAbi, parseUnits, encodeFunctionData, erc20Abi } from 'viem';
import { base } from 'viem/chains';
const rpc = process.env.PINTO_QA_RPC;
assert.equal(new URL(rpc).hostname, '127.0.0.1');
assert(['18621', '18622', '18626', '18628'].includes(new URL(rpc).port), 'This script is restricted to the disposable comparison children');
const chain = { ...base, id:1337 }, transport=http(rpc,{timeout:30_000});
const client=createPublicClient({chain,transport});
assert.equal(await client.getChainId(),1337);assert.match(await client.request({method:'web3_clientVersion'}),/^anvil\//);
const account='0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', diamond='0xd1a0d188e861ed9d15773a2f3574a2e94134ba8f', pinto='0xb170000aeeFa790fa61D6e837d1035906839a3c8', usdc='0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', usdcWell='0x3e1133aC082716DDC3114bbEFEeD8B1731eA9cb1', pipeline='0xb1bE0001f5a373b69b1E132b420e6D9687155e80';
const wallet=createWalletClient({chain,transport,account});
const abi=parseAbi(['function getWhitelistedWellLpTokens() view returns(address[])','function getSwapOut(address from,address to,uint256 amount) view returns(uint256)','function swapFeeBps() view returns(uint256)','function withdrawDeposits(address token,int96[] stems,uint256[] amounts,uint8 mode)','function swapFrom(address from,address to,uint256 amount,uint256 min,address recipient,uint256 deadline) returns(uint256)']);
const wells=await client.readContract({address:diamond,abi,functionName:'getWhitelistedWellLpTokens'});
const initial=await client.getBlock();const reports=[];
process.env.VITE_BASE_ENDPOINT='pinto.money';
const server=await createServer({server:{middlewareMode:true},appType:'custom'});
const stringify=v=>JSON.stringify(v,(_,v)=>typeof v==='bigint'?String(v):v,2);
try {
 const {readRoutePools,quoteRoute,buildRoute,routeABI}=await server.ssrLoadModule('/src/lib/redemption/route.ts');
 const {selectRedemptionDeposits,redemptionWriteFunction}=await server.ssrLoadModule('/src/utils/siloRedemption.ts');
 const {autoConvertABI}=await server.ssrLoadModule('/src/constants/abi/autoConvertABI.ts');
 const empty=`0x${'0'.repeat(64)}`;
 for(const amountHuman of (process.env.PINTO_QA_AMOUNTS??'50,500,5000').split(',')) for(const kind of (process.env.PINTO_QA_KINDS??'direct-fee-exempt-USDC,ordinary-withdraw-and-swap-USDC,multi-pool-0x').split(',')) {
   const checkpoint=await client.request({method:'evm_snapshot'});
   const report={amountPinto:amountHuman,kind,startBlock:String((await client.getBlock()).number)};
   let traceTransaction;
   try {
     // Live RFQ quotes can be invalid on a historical fork clock. Advance time only; pool state is restored for every route.
     if (process.env.PINTO_QA_PRESERVE_CLOCK !== '1') {
     const clock = await client.getBlock();
     await client.request({method:'evm_setNextBlockTimestamp',params:[Math.max(Number(clock.timestamp)+1,Math.floor(Date.now()/1000))]});
     await client.request({method:'evm_mine'});
     }
     const amount=parseUnits(amountHuman,6);
     const pools=await readRoutePools(client,{account,diamond,pinto,wells,kind:'pinto'});
     const before=await client.readContract({address:usdc,abi:erc20Abi,functionName:'balanceOf',args:[account]});
     let calls, expected, minimum, directTransaction;
     if(kind==='ordinary-withdraw-and-swap-USDC') {
       const selected=selectRedemptionDeposits(pools[0].snapshot.deposits,amount);
       expected=await client.readContract({address:usdcWell,abi,functionName:'getSwapOut',args:[pinto,usdc,amount]}); minimum=expected*9950n/10000n;
       const encode=(abi,functionName,args)=>encodeFunctionData({abi,functionName,args});
       const pipeCalls=[
         {target:pinto,callData:encode(erc20Abi,'approve',[usdcWell,0n]),clipboard:empty},
         {target:pinto,callData:encode(erc20Abi,'approve',[usdcWell,amount]),clipboard:empty},
         {target:usdcWell,callData:encode(abi,'swapFrom',[pinto,usdc,amount,minimum,account,pools[0].snapshot.timestamp+120n]),clipboard:empty},
         {target:pinto,callData:encode(erc20Abi,'approve',[usdcWell,0n]),clipboard:empty},
       ];
       calls=[{callData:encode(abi,'withdrawDeposits',[pinto,selected.stems,selected.amounts,1]),clipboard:empty},
         {callData:encode(routeABI,'transferToken',[pinto,pipeline,amount,1,0]),clipboard:empty},
         {callData:encode(routeABI,'advancedPipe',[pipeCalls,0n]),clipboard:empty}];
     } else {
       const route=await quoteRoute(client,kind==='multi-pool-0x'?pools:pools.filter(p=>p.snapshot.well.toLowerCase()===usdcWell.toLowerCase()),amount,usdc,1337,50);
       calls=buildRoute(route);expected=route.expected;minimum=route.minimum;
       if(kind==='direct-fee-exempt-USDC') {
         const leg=route.legs[0];
         minimum=expected*9950n/10000n;
         directTransaction={address:diamond,abi:autoConvertABI,functionName:redemptionWriteFunction(leg.snapshot.kind),args:[leg.snapshot.well,leg.selection.stems,leg.selection.amounts,minimum,route.deadline,0]};
       }
       report.sources=route.legs.map(l=>({well:l.snapshot.well,amount:String(l.selection.amount),sources:l.swap?.sources??['direct']}));
     }
     report.expected=expected;report.minimum=minimum;
     const args=directTransaction??{address:diamond,abi:routeABI,functionName:'advancedFarm',args:[calls]};
     traceTransaction={from:account,to:diamond,data:encodeFunctionData(args)};
     await client.simulateContract({...args,account});
     const estimate=await client.estimateContractGas({...args,account});
     const gas=estimate*130n/100n+50_000n;
     report.estimatedGas=estimate;
     assert(gas<=16_777_216n,'Route exceeds the UI transaction gas limit');
     const hash=await wallet.writeContract({...args,gas});
     const receipt=await client.waitForTransactionReceipt({hash});assert.equal(receipt.status,'success');
     const after=await client.readContract({address:usdc,abi:erc20Abi,functionName:'balanceOf',args:[account]});
     report.received=after-before;report.hash=hash;report.gasUsed=receipt.gasUsed;
     report.realizedSlippageBps=Number(expected-report.received)/Number(expected)*10000;
     assert(report.received>=minimum); report.status='passed';
   } catch(error) {
     report.status='failed';report.error=error.shortMessage??error.message;
     if(traceTransaction && process.env.PINTO_QA_TRACE==='1') {
       try {
         const trace=await client.request({method:'debug_traceCall',params:[traceTransaction,'latest',{tracer:'callTracer'}]});
         const failures=[];
         const walk=(f,depth=0)=>{if(f.error)failures.push({depth,to:f.to,selector:f.input?.slice(0,10),error:f.error,output:f.output,revertReason:f.revertReason});for(const c of f.calls??[])walk(c,depth+1);};walk(trace);report.failures=failures;
       }catch(traceError){report.traceError=traceError.shortMessage??traceError.message;}
     }
   }
   finally {assert.equal(await client.request({method:'evm_revert',params:[checkpoint]}),true);}
   reports.push(report);console.log(stringify(report));
   fs.writeFileSync(process.argv[2],stringify({noLiveWrites:true,rpc,initialBlock:String(initial.number),initialHash:initial.hash,feeBps:await client.readContract({address:usdcWell,abi,functionName:'swapFeeBps'}),reports}));
 }
} finally {await server.close();}
