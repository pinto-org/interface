// Rebase actual locally executed setup state changes onto the 0x quote's Base block.
// Reject any changed protocol storage precondition; never seed swap-token balances.
import fs from 'node:fs';import assert from 'node:assert/strict';import {createServer} from 'vite';
import {createPublicClient,http,parseAbi,toHex,keccak256} from 'viem';
const dir=process.argv[2],rpc='http://127.0.0.1:18626';
const c=createPublicClient({transport:http(rpc,{timeout:180000,retryCount:0})});
const req=(method,params=[])=>c.request({method,params});
assert.equal(await c.getChainId(),1337);assert.match(await req('web3_clientVersion'),/^anvil\//);
const stringify=v=>JSON.stringify(v,(_,v)=>typeof v==='bigint'?String(v):v,2);
const release=JSON.parse(fs.readFileSync(dir+'/release-replay.json'));
const prep=JSON.parse(fs.readFileSync(dir+'/fixture.json'));
const existingPatch=fs.existsSync(dir+'/setup-state-patch.json');
const patch=existingPatch?JSON.parse(fs.readFileSync(dir+'/setup-state-patch.json')):{},zero='0x'+'0'.repeat(64);
for(const {hash} of (existingPatch?[]:[...release.rows,{hash:prep.qaPreparation.hash}])){
 const d=await req('debug_traceTransaction',[hash,{tracer:'prestateTracer',tracerConfig:{diffMode:true}}]);
 for(const address of new Set([...Object.keys(d.pre),...Object.keys(d.post)])){
  if(address==='0x0000000000000000000000000000000000000000')continue;
  const p=patch[address]??={storage:{},before:{}};const pre=d.pre[address]??{},post=d.post[address]??{};
  if(post.code)p.code=post.code;
  for(const slot of new Set([...Object.keys(pre.storage??{}),...Object.keys(post.storage??{})])){
   p.before[slot]??=pre.storage?.[slot]??zero;p.storage[slot]=post.storage?.[slot]??zero;
  }
 }
}
fs.writeFileSync(dir+'/setup-state-patch.json',stringify(patch));console.log('Captured actual setup state changes',Object.keys(patch).length);
const account='0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',diamond='0xd1a0d188e861ed9d15773a2f3574a2e94134ba8f',pinto='0xb170000aeeFa790fa61D6e837d1035906839a3c8',usdc='0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
process.env.VITE_BASE_ENDPOINT='pinto.money';const s=await createServer({server:{middlewareMode:true},appType:'custom'});
try{
 const {readRoutePools,quoteRoute,buildRoute,routeABI}=await s.ssrLoadModule('/src/lib/redemption/route.ts');
 const wells=await c.readContract({address:diamond,abi:parseAbi(['function getWhitelistedWellLpTokens() view returns(address[])']),functionName:'getWhitelistedWellLpTokens'});
 wells.sort((a,b)=>Number(b.toLowerCase()==='0x3e1133ac082716ddc3114bbefeed8b1731ea9cb1')-Number(a.toLowerCase()==='0x3e1133ac082716ddc3114bbefeed8b1731ea9cb1'));
 const pools=await readRoutePools(c,{account,diamond,pinto,wells,kind:'pinto'});
 const records=[];const originalFetch=globalThis.fetch;
 globalThis.fetch=async(input,init)=>{const response=await originalFetch(input,init);if(String(input).startsWith('https://0x.pinto.money/'))records.push({url:String(input),response:await response.clone().json()});return response;};
 const route=await quoteRoute(c,pools,100000000000n,usdc,1337,50);globalThis.fetch=originalFetch;
 fs.writeFileSync(dir+'/quote-records.json',stringify(records));
 const forkBlock=Math.max(...records.map(r=>Number(r.response.blockNumber)));
 await req('anvil_reset',[{forking:{jsonRpcUrl:'https://mainnet.base.org',blockNumber:forkBlock}}]);
 const mismatches=[];let checked=0;
 for(const [address,p]of Object.entries(patch))for(const [slot,value]of Object.entries(p.before)){
  const actual=await c.getStorageAt({address,slot});checked++;if(BigInt(actual??'0x0')!==BigInt(value))mismatches.push({address,slot,expected:value,actual});
 }
 fs.writeFileSync(dir+'/rebase-preconditions.json',stringify({forkBlock,checked,mismatches}));assert.equal(mismatches.length,0,'Base changed a setup storage precondition; do not apply stale setup effects');
 for(const [address,p]of Object.entries(patch)){if(p.code)await req('anvil_setCode',[address,p.code]);for(const [slot,value]of Object.entries(p.storage))await req('anvil_setStorageAt',[address,slot,value]);}
 await req('anvil_setCode',[account,'0x']);await req('anvil_setBalance',[account,'0x56bc75e2d63100000']);await req('anvil_setBlockTimestampInterval',[1]);
 for(const d of release.rows)if(d.address&&d.codeHash)assert.equal(keccak256(await c.getCode({address:d.address})),d.codeHash,d.name);
 const alignedPools=await readRoutePools(c,{account,diamond,pinto,wells,kind:'pinto'});
 globalThis.fetch=async(input,init)=>{if(String(input).startsWith('https://0x.pinto.money/')){const match=records.find(r=>r.url===String(input));assert(match,'Quote inputs changed');return new Response(JSON.stringify(match.response),{status:200,headers:{'content-type':'application/json'}});}return originalFetch(input,init);};
 const aligned=await quoteRoute(c,alignedPools,100000000000n,usdc,1337,50);globalThis.fetch=originalFetch;
 fs.writeFileSync(dir+'/aligned-route.json',stringify({forkBlock,expected:aligned.expected,minimum:aligned.minimum,deadline:aligned.deadline,calls:buildRoute(aligned)}));
 const fixture={...prep,startBlock:forkBlock,scope:'Actual release and deposit-transfer state diffs, with every storage precondition checked, replayed at the recorded 0x quote block; no swap balance seeding'};
 fs.writeFileSync(dir+'/fixture-aligned.json',stringify(fixture));
 console.log(stringify({forkBlock,storagePreconditionsChecked:checked,expected:aligned.expected,minimum:aligned.minimum,snapshot:await req('evm_snapshot')}));
}finally{await s.close();}
