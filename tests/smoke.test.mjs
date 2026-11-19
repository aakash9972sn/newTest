import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { webcrypto } from 'node:crypto';
import vm from 'node:vm';

if (!globalThis.crypto) globalThis.crypto = webcrypto;

const repoRoot = new URL('../', import.meta.url);
const workerSource = await readFile(new URL('worker/src/index.js', repoRoot), 'utf8');
const worker = (await import('data:text/javascript;base64,' +
  Buffer.from(workerSource).toString('base64'))).default;
const generatorSource = await readFile(new URL('ai-generator.js', repoRoot), 'utf8');
const html = await readFile(new URL('index.html', repoRoot), 'utf8');

const ORIGIN = 'https://aakash9972sn.github.io';
let counter = 0;

function request(payload, origin = ORIGIN) {
  return new Request('https://test-worker.example/', {
    method: 'POST',
    headers: {
      Origin: origin,
      'Content-Type': 'application/json',
      'CF-Connecting-IP': 'test-suite-' + (++counter)
    },
    body: JSON.stringify(payload)
  });
}
const payload = (count = 2) => ({
  action: 'generate', exam: 'gate', subject: 'gate-nt',
  difficulty: 'Medium', count, avoid: []
});

function questions(n) {
  return Array.from({ length: n }, (_, i) => ({
    q: 'A resistor of ' + (i + 7) + ' ohms carries 2 A. What voltage is across it?',
    o: ['1 V', String(2 * (i + 7)) + ' V', '8 V', '9 V'],
    a: 1,
    e: "The voltage equals resistance multiplied by current (Ohm's law).",
    t: 'Basic circuits'
  }));
}
function envWith(handler) { return { AI: { run: handler } }; }

test('health endpoint advertises AI generation without invoking the model', async () => {
  const response = await worker.fetch(new Request('https://test-worker.example/health'), { AI: {} });
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.ok, true);
  assert.equal(body.generationVersion, 3);
  assert.ok(body.features.includes('generate'));
});

test('CORS rejects unauthorized origins', async () => {
  const response = await worker.fetch(request(payload(), 'https://not-our-site.example'), envWith(async () => {}));
  assert.equal(response.status, 403);
});

test('invalid exam subject pair never calls the model', async () => {
  let called = false;
  const response = await worker.fetch(
    request({ ...payload(), subject: 'not-a-subject' }),
    envWith(async () => { called = true; })
  );
  assert.equal(response.status, 400);
  assert.equal(called, false);
});

for (const count of [2, 3]) {
  test('generator accepts ' + count + ' correct MCQs in Gemma JSON mode', async () => {
    const response = await worker.fetch(request(payload(count)),
      envWith(async (model, options) => {
        assert.match(model, /^@cf\//);
        assert.equal(options.response_format.type, 'json_object');
        assert.equal(options.chat_template_kwargs.enable_thinking, false);
        return { response: JSON.stringify({ questions: questions(count) }) };
      }));
    assert.equal(response.status, 200);
    const body = await response.json();
    assert.equal(body.questions.length, count);
  });
}

test('rejects duplicated or malformed questions before publishing', async () => {
  const repeated = [questions(2)[0], questions(2)[0]];
  const response = await worker.fetch(request(payload()),
    envWith(async () => ({ response: { questions: repeated } })));
  assert.equal(response.status, 502);
});

test('preserves the existing Codex assistant endpoint', async () => {
  const response = await worker.fetch(request({
    action: 'assistant', app: 'study', question: 'Explain inductance',
    history: [], context: {}
  }), envWith(async () => ({ response: 'Inductance opposes changes in current.' })));
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.match(body.answer, /Inductance/);
});

test('frontend safely ignores damaged local question sets', () => {
  const validTest = {
    id: 'ai-sample-1234', examId: 'gate', subjectId: 'gate-nt',
    test: { title: 'Generated test', duration: 8, questions: questions(2) }
  };
  let raw = JSON.stringify([validTest, { id: 'ai-corrupted' }]);
  const sandbox = {
    window: {}, localStorage: {
      getItem: () => raw,
      setItem: (_, value) => { raw = value; }
    },
    Set, Date, Number, String, Array, JSON, RegExp, Math
  };
  vm.runInNewContext(generatorSource, sandbox, { filename: 'ai-generator.js' });
  const saved = sandbox.window.TestCentreAIGenerator.loadSaved();
  assert.equal(saved.length, 1);
  assert.equal(saved[0].id, validTest.id);
  assert.equal(sandbox.window.TestCentreAIGenerator.removeSaved(validTest.id), true);
  assert.equal(sandbox.window.TestCentreAIGenerator.loadSaved().length, 0);
});

test('site loads generator before exam engine and retains shared assistant', () => {
  assert.ok(html.indexOf('ai-generator.js') < html.indexOf('app.js'));
  assert.match(html, /id="ai-generator"/);
  assert.match(html, /ai-assistant\.js/);
  assert.match(generatorSource, /ai-gen-progress/);
  assert.match(generatorSource, /Generation cancelled/);
});
