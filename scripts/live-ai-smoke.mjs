/* One live inference probe, run manually or once when this workflow changes.
   No private tokens. Cloudflare's free-tier allocation is consumed by the sample. */
import assert from 'node:assert/strict';

const worker = process.env.TEST_CENTRE_WORKER_URL ||
  'https://aakash-test-ai.aakashinfinity72.workers.dev';
const origin = 'https://aakash9972sn.github.io';

async function responseJSON(res) {
  const raw = await res.text();
  let data;
  try { data = JSON.parse(raw); }
  catch { throw new Error('Expected JSON, got HTTP ' + res.status + ': ' + raw.slice(0, 150)); }
  return data;
}

console.log('Checking deployed Cloudflare Worker health…');
const healthRes = await fetch(worker.replace(/\/$/, '') + '/health', {
  signal: AbortSignal.timeout(15000)
});
const health = await responseJSON(healthRes);
console.log('Health status:', healthRes.status,
  'AI binding:', !!health.aiBinding,
  'generation version:', health.generationVersion ?? 'missing');
assert.equal(healthRes.status, 200, 'Cloudflare health endpoint is unavailable');
assert.equal(health.ok, true);
assert.equal(health.aiBinding, true, 'Workers AI binding is missing');
assert.equal(health.generationVersion, 3,
  'Old Worker is deployed; deploy latest main-branch worker/src/index.js to Cloudflare.');

console.log('Sending one live 2-question AI generation request…');
const request = {
  action: 'generate',
  exam: 'gate',
  subject: 'gate-nt',
  difficulty: 'Easy',
  count: 2,
  topic: 'Ohms law and resistors',
  avoid: []
};
const res = await fetch(worker, {
  method: 'POST',
  headers: { Origin: origin, 'Content-Type': 'application/json' },
  body: JSON.stringify(request),
  signal: AbortSignal.timeout(90000)
});
const output = await responseJSON(res);
if (!res.ok) {
  throw new Error('Live AI generated HTTP ' + res.status +
    ': ' + String(output.error || 'No error detail').slice(0, 200));
}
assert.ok(Array.isArray(output.questions), 'AI response omitted questions array');
assert.equal(output.questions.length, 2, 'AI response did not contain 2 questions');
for (const [i, q] of output.questions.entries()) {
  assert.equal(typeof q.q, 'string', 'Missing question statement ' + i);
  assert.ok(q.q.length >= 15, 'Question statement too short');
  assert.ok(Array.isArray(q.o) && q.o.length === 4, 'Expected 4 options');
  assert.ok(Number.isInteger(q.a) && q.a >= 0 && q.a < 4, 'Invalid answer index');
  assert.ok(typeof q.e === 'string' && q.e.length >= 10, 'Missing explanation');
}
console.log('PASS: real Cloudflare inference returned 2 well-formed MCQs.');
console.log('Note: Structural checks do not prove the answer key is academically correct.');
