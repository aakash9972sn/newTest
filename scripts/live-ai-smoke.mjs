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
assert.equal(health.generationVersion, 4,
  'Old Worker is deployed; deploy latest main-branch worker/src/index.js to Cloudflare.');


assert.equal(health.generationModel, '@cf/qwen/qwen3.8-27b', 'Unexpected test generation model');
console.log('Checking browser-style CORS preflight…');
const preflight = await fetch(worker, {
  method: 'OPTIONS',
  headers: {
    Origin: origin,
    'Access-Control-Request-Method': 'POST',
    'Access-Control-Request-Headers': 'content-type'
  },
  signal: AbortSignal.timeout(15000)
});
assert.equal(preflight.status, 204, 'CORS preflight failed');
assert.equal(preflight.headers.get('Access-Control-Allow-Origin'), origin,
  'Browser origin is not allowed');

console.log('Generating a realistic 5-question test in 2+3-question batches…');
const questions = [];
const prompts = ['Ohms law and resistors', 'Ohms law and resistors'];
for (const [part, count] of [2, 3].entries()) {
  let output;
  for (let attempt = 1; attempt <= 2; attempt++) {
    const payload = {
      action: 'generate', exam: 'gate', subject: 'gate-nt',
      difficulty: 'Easy', count, topic: prompts[part],
      avoid: questions.map((q) => q.q)
    };
    const res = await fetch(worker, {
      method: 'POST',
      headers: { Origin: origin, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(90000)
    });
    output = await responseJSON(res);
    if (res.ok) break;
    const cause = String(output.error || 'no details').slice(0, 180);
    if (res.status === 502 && attempt === 1) {
      console.log('Batch ' + (part + 1) + ' returned invalid AI output; retrying once.');
      continue;
    }
    throw new Error('Cloudflare generation failed HTTP ' + res.status + ': ' + cause);
  }
  assert.ok(Array.isArray(output.questions), 'AI response omitted questions');
  assert.equal(output.questions.length, count, 'AI returned wrong question count');
  for (const q of output.questions) {
    assert.ok(typeof q.q === 'string' && q.q.length >= 15, 'Invalid question');
    assert.ok(Array.isArray(q.o) && q.o.length === 4, 'Expected four options');
    assert.equal(new Set(q.o.map((s) => String(s).toLowerCase().trim())).size, 4,
      'Duplicate answer options');
    assert.ok(Number.isInteger(q.a) && q.a >= 0 && q.a <= 3, 'Invalid answer index');
    assert.ok(typeof q.e === 'string' && q.e.length >= 10, 'Missing solution');
    assert.ok(!questions.some((old) =>
      old.q.toLowerCase().trim() === q.q.toLowerCase().trim()), 'Repeated question');
  }
  questions.push(...output.questions);
  console.log('Batch ' + (part + 1) + ' passed (' + questions.length + '/5 questions).');
}
assert.equal(questions.length, 5);
console.log('PASS: live Cloudflare returned five usable, nonidentical question records.');
console.log('Caution: structural checks cannot independently verify all academic answer keys.');
