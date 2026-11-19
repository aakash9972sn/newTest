import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../worker/src/index.js';

let ip = 0;
function request(body, origin = 'https://aakash9972sn.github.io') {
  return new Request('https://ai.example.test/', {
    method: 'POST',
    headers: {
      Origin: origin, 'Content-Type': 'application/json',
      'CF-Connecting-IP': 'google-test-' + (++ip)
    },
    body: JSON.stringify(body)
  });
}
const query = { action: 'google_search', question: 'Recent science discoveries about DNA' };

test('google_search requires a private Google API key, never exposes it', async () => {
  const res = await worker.fetch(request(query), { AI: { run: async () => {} } });
  assert.equal(res.status, 503);
  const data = await res.json();
  assert.equal(data.code, 'GOOGLE_NOT_CONFIGURED');
  assert.ok(!JSON.stringify(data).includes('fake-secret'));
});

test('grounded answer returns sources inside chat and forwards Google search tool', async () => {
  const before = globalThis.fetch;
  let upstream;
  globalThis.fetch = async (url, init) => {
    upstream = { url, init };
    return new Response(JSON.stringify({candidates: [{
      content: {parts: [{text: 'DNA research shows important new findings.'}]},
      groundingMetadata: {
        webSearchQueries: ['latest DNA discoveries'],
        groundingChunks: [{web: {title: 'Science source', uri: 'https://example.org/dna'}}],
        searchEntryPoint: {renderedContent: '<style>.x{color:blue}</style><div>Google Search</div>'}
      }
    }]}), { status: 200, headers: {'Content-Type': 'application/json'} });
  };
  try {
    const response = await worker.fetch(request(query), {
      AI: {run: async()=>{throw Error('must not call Cloudflare AI');}},
      GEMINI_API_KEY: 'test-secret'
    });
    const body = await response.json();
    assert.equal(response.status, 200);
    assert.equal(body.googleGrounded, true);
    assert.equal(body.sources.length, 1);
    assert.equal(body.sources[0].url, 'https://example.org/dna');
    assert.match(body.suggestionHtml, /Google Search/);
    assert.equal(upstream.init.headers['x-goog-api-key'], 'test-secret');
    assert.ok(upstream.url.includes('gemini-2.5-flash-lite:generateContent'));
    const posted = JSON.parse(upstream.init.body);
    assert.deepEqual(posted.tools, [{google_search:{}}]);
    assert.ok(!JSON.stringify(body).includes('test-secret'));
  } finally { globalThis.fetch = before; }
});

test('Google grounding rate limits are clear and do not leak provider response', async () => {
  const before = globalThis.fetch;
  globalThis.fetch = async () => new Response('{"error":"secret details"}', { status: 429 });
  try {
    const response = await worker.fetch(request(query), {
      AI: {}, GEMINI_API_KEY: 'test-secret'
    });
    const data = await response.json();
    assert.equal(response.status, 429);
    assert.equal(data.code, 'GOOGLE_QUOTA');
    assert.ok(!JSON.stringify(data).includes('secret details'));
  } finally { globalThis.fetch = before; }
});

test('untrusted origins cannot use Google grounding', async () => {
  const response = await worker.fetch(request(query, 'https://attack.example'), {
    AI: {}, GEMINI_API_KEY: 'test-secret'
  });
  assert.equal(response.status, 403);
});

test('health exposes whether Google is configured, never the key', async () => {
  const response = await worker.fetch(new Request('https://ai.example.test/health'), {
    AI:{},GEMINI_API_KEY:'test-secret'
  });
  const data = await response.json();
  assert.equal(data.googleSearchConfigured,true);
  assert.ok(!JSON.stringify(data).includes('test-secret'));
});
