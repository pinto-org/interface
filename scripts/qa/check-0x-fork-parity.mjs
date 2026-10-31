// Disposable fresh-fork test of production-encoded 0x swaps and settlement.
// No protocol upgrade or transaction is broadcast to Base. The paired inputs are
// seeded only locally; this isolates the swap portion, not the full withdrawal.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {spawn} from 'node:child_process';
import {createServer} from 'vite';
import {createPublicClient,createWalletClient,http,erc20Abi,encodeFunctionData,decodeFunctionResult,toHex} from 'viem';
import {base} from 'viem/chains';
const dir=process.argv[2];assert(dir);fs.mkdirSync(dir,{recursive:true});
const account='0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',diamond='0xd1a0d188e861ed9d15773a2f3574a2e94134ba8f',pipeline='0xb1bE0001f5a373b69b1E132b420e6D9687155e80',pinto='0xb170000aeeFa790fa61D6e837d1035906839a3c8',usdc='0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
const inputs=[{token:'0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22',well:'0x3e111115A82dF6190e36ADf0d552880663A4dBF1',amount:437299342395882052n},{token:'0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf',well:'0x3e11226fe3d85142B734ABCe6e58918d5828d1b4',amount:1419393n}];
const stringify=v=>JSON.stringify(v,(_,v)=>typeof v==='bigint'?String(v):v,2);
process.env.VITE_BASE_ENDPOINT='pinto.money';
const server=await createServer({server:{middlewareMode:true},appType:'custom'});
const reports=[];
try{
 const {validateRoutedSwap,buildRoute,routeABI,ALLOWANCE_HOLDER}=await server.ssrLoadModule('/src/lib/redemption/route.ts');
 const live=createPublicClient({chain:base,transport:http('https://mainnet.base.org',{timeout:30000,retryCount:1})});
 const quotes=process.env.PINTO_QA_QUOTES?JSON.parse(fs.readFileSync(process.env.PINTO_QA_QUOTES,'utf8')):[];if(!quotes.length)for(const input of inputs){const params=new URLSearchParams({chainId:'8453',sellToken:input.token,buyToken:usdc,sellAmount:String(input.amount),taker:pipeline,txOrigin:account,recipient:pipeline,sellEntireBalance:process.env.PINTO_QA_SELL_ENTIRE_BALANCE??'true',slippageBps:'25',excludedSources:'Pinto'});const r=await fetch('https://0x.pinto.money/swap/allowance-holder/quote/?'+params,{signal:AbortSignal.timeout(30000)});assert(r.ok,`0x status ${r.status}`);const q=await r.json();validateRoutedSwap(q,input.token,usdc,input.amount,25);quotes.push(q);}
 fs.writeFileSync(dir+'/quotes.json',stringify(quotes));
 const quoteBlocks=quotes.map(q=>BigInt(q.blockNumber));const forkBlock=quoteBlocks.reduce((a,b)=>a>b?a:b);
 const block=await live.getBlock({blockNumber:forkBlock});
 const legs=inputs.map((input,i)=>({snapshot:{kind:'pinto',well:input.well,pinto,outputToken:input.token},selection:{stems:[0n],amounts:[1n],amount:1n},minimum:1n,swap:validateRoutedSwap(quotes[i],input.token,usdc,input.amount,25)}));
 const expected=legs.reduce((n,l)=>n+l.swap.buyAmount,0n),minimum=legs.reduce((n,l)=>n+l.swap.minimum,0n);
 const encoded=buildRoute({chainId:8453,account,diamond,buyToken:usdc,fetchedAt:Date.now(),deadline:block.timestamp+120n,legs,expected,minimum});
 // Keep the exact production swap calls, zero-dust checks, allowance reset, and
 // final minimum / sweep. Omit cleanup and withdrawal because inputs are seeded.
 const pipeSelector=encodeFunctionData({abi:routeABI,functionName:'advancedPipe',args:[[],0n]}).slice(0,10);
 const calls=encoded.filter(call=>call.callData.slice(0,10)===pipeSelector).slice(1);
 fs.writeFileSync(dir+'/swap-batch.json',stringify({forkBlock,quoteBlocks,timestamp:block.timestamp,expected,minimum,calls}));
 for(const chainId of (process.env.PINTO_QA_CHAIN_IDS??'8453,1337').split(',').map(Number)){
  assert([8453,1337].includes(chainId));
  const port=chainId===8453?18624:18625,rpc=`http://127.0.0.1:${port}`;
  const log=fs.openSync(dir+`/anvil-${chainId}.log`,'w');
  const child=spawn('anvil',['--fork-url','https://mainnet.base.org','--fork-block-number',String(forkBlock),'--chain-id',String(chainId),'--port',String(port),'--host','127.0.0.1','--gas-limit','60000000','--silent'],{stdio:['ignore',log,log]});
  const chain={...base,id:chainId},client=createPublicClient({chain,transport:http(rpc,{timeout:180000,retryCount:0})}),wallet=createWalletClient({chain,account,transport:http(rpc,{timeout:180000,retryCount:0})});
  const report={sellEntireBalance:process.env.PINTO_QA_SELL_ENTIRE_BALANCE??'true',chainId,rpc,forkBlock:String(forkBlock),expected:String(expected),minimum:String(minimum),sources:quotes.map(q=>q.route?.fills?.map(f=>f.source)),noLiveWrites:true};
  const req=(method,params=[])=>client.request({method,params});
  try{
   for(let i=0;;i++){try{assert.match(await req('web3_clientVersion'),/^anvil\//);break;}catch(e){if(i>=50||child.exitCode!==null)throw e;await new Promise(r=>setTimeout(r,100));}}
   assert.equal(await client.getChainId(),chainId);
   await req('anvil_setCode',[account,'0x']);await req('anvil_setBalance',[account,'0x56bc75e2d63100000']);
   let timestamp=block.timestamp;
   // Seed balances without mining setup blocks: some quoted venues use
   // block-sensitive prices. Probe SLOAD slots with ephemeral eth_call overrides,
   // accepting only a slot proven to control this exact balanceOf result.
   report.balanceSeedMode='local storage override, no setup blocks mined';
   report.seedSlots=[];
   for(const input of inputs){
    const data=encodeFunctionData({abi:erc20Abi,functionName:'balanceOf',args:[pipeline]});
    const trace=await req('debug_traceCall',[{to:input.token,data},'latest',{}]);
    const slots=[...new Set(trace.structLogs.filter(l=>l.op==='SLOAD').map(l=>'0x'+l.stack.at(-1).replace(/^0x/,'').padStart(64,'0')))];
    let matched;
    for(const slot of slots){try{
      const result=await req('eth_call',[{to:input.token,data},'latest',{[input.token]:{stateDiff:{[slot]:toHex(input.amount,{size:32})}}}]);
      if(decodeFunctionResult({abi:erc20Abi,functionName:'balanceOf',data:result})===input.amount){matched=slot;break;}
    }catch{}}
    assert(matched,'Could not identify the exact ERC20 balance slot');
    await req('anvil_setStorageAt',[input.token,matched,toHex(input.amount,{size:32})]);
    assert.equal(await client.readContract({address:input.token,abi:erc20Abi,functionName:'balanceOf',args:[pipeline]}),input.amount);
    report.seedSlots.push({token:input.token,slot:matched,amount:String(input.amount)});
   }
   const read=(address,functionName,args)=>client.readContract({address,abi:erc20Abi,functionName,args});
   const before=await read(usdc,'balanceOf',[account]);
   const args={address:diamond,abi:routeABI,functionName:'advancedFarm',args:[calls]};
   report.phase='simulate';
   await client.simulateContract({...args,account});report.simulationPassed=true;
   report.phase='estimate';
   const gas=process.env.PINTO_QA_GAS?BigInt(process.env.PINTO_QA_GAS):(await client.estimateContractGas({...args,account}))*130n/100n+50000n;assert(gas<=16777216n);
   report.gasLimit=String(gas);report.phase='simulate-exact-gas';
   await client.simulateContract({...args,account,gas});report.exactGasSimulationPassed=true;
   report.phase='send';
   await req('evm_setNextBlockTimestamp',[Number(++timestamp)]);
   const hash=await wallet.writeContract({...args,gas});const receipt=await client.waitForTransactionReceipt({hash});assert.equal(receipt.status,'success');
   const received=await read(usdc,'balanceOf',[account])-before;assert(received>=minimum);
   for(const input of inputs){assert.equal(await read(input.token,'balanceOf',[pipeline]),0n);assert.equal(await read(input.token,'allowance',[pipeline,ALLOWANCE_HOLDER]),0n);}
   report.phase='verified';report.status='passed';report.received=String(received);report.gasUsed=String(receipt.gasUsed);report.hash=hash;report.noDustAndAllowancesCleared=true;
  }catch(e){report.status='failed';report.error=e.shortMessage??e.message;
   try{const trace=await req('debug_traceCall',[{from:account,to:diamond,data:encodeFunctionData({abi:routeABI,functionName:'advancedFarm',args:[calls]})},'latest',{tracer:'callTracer'}]);fs.writeFileSync(dir+`/trace-${chainId}.json`,stringify(trace));report.traceRoot={error:trace.error,gasUsed:trace.gasUsed,output:trace.output?.slice(0,138)};const failures=[];const walk=(f,d=0)=>{if(f.error)failures.push({depth:d,to:f.to,selector:f.input?.slice(0,10),error:f.error,output:f.output,revertReason:f.revertReason});for(const c of f.calls??[])walk(c,d+1);};walk(trace);report.failures=failures;}catch(e){report.traceError=e.shortMessage??e.message;}
  }finally{child.kill('SIGTERM');fs.closeSync(log);}
  reports.push(report);console.log(stringify(report));fs.writeFileSync(dir+'/results.json',stringify({scope:'0x swaps and production-encoded settlement for the paired outputs of 100k Pinto; withdrawals seeded locally, not full end-to-end',reports}));
 }
}finally{await server.close();}
