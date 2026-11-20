import assert from 'node:assert/strict';
const base='https://ais-pre-wdyrf6yb4psuwizvqpn4hw-374223411049.asia-northeast1.run.app';
const response=await fetch(base+'/api/health',{signal:AbortSignal.timeout(20000)});
assert.equal(response.status,200);
const health=await response.json();assert.equal(health.ok,true);assert.equal(health.configured,true);assert.equal(health.provider,'google-gemini');
console.log('Hosted backend is configured. Health alone does not verify inference.');
