import fs from 'node:fs';import assert from 'node:assert/strict';import {createPublicClient,http,parseAbi,encodeFunctionData} from 'viem';
const dir=process.argv[2],c=createPublicClient({transport:http('http://127.0.0.1:18626',{timeout:180000,retryCount:0})});assert.equal(await c.getChainId(),1337);
const r=JSON.parse(fs.readFileSync(dir+'/aligned-route.json'));
const tx={address:'0xd1a0d188e861ed9d15773a2f3574a2e94134ba8f',account:'0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',abi:parseAbi(['function advancedFarm((bytes callData,bytes clipboard)[] data) payable returns(bytes[])']),functionName:'advancedFarm',args:[r.calls]};
const report={phase:'simulate',noLiveWrites:true};
try{await c.simulateContract(tx);report.phase='estimate';report.estimatedGas=String(await c.estimateContractGas(tx));report.phase='passed';}catch(e){report.error=e.shortMessage??e.message;const trace=await c.request({method:'debug_traceCall',params:[{from:tx.account,to:tx.address,data:encodeFunctionData(tx)},'latest',{tracer:'callTracer'}]});fs.writeFileSync(dir+'/full-preflight-trace.json',JSON.stringify(trace));report.root={error:trace.error,output:trace.output};}
fs.writeFileSync(dir+'/preflight.json',JSON.stringify(report,null,2));console.log(report);
