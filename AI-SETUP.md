# One Cloudflare AI Worker for three websites

Configured endpoint: `https://aakash-test-ai.aakashinfinity72.workers.dev`.
The Worker supports:

- `assistant` with `app: shop`: Blunder catalogue, packs, budget and policy help.
- `assistant` with `app: portfolio`: published project Q&A and architecture explanations.
- `assistant` with `app: study`: revision planning, test selection and concept help.
- Existing `generate`: fresh test sets with duplicate-question checks.
- Existing `analysis` and `doubt`: completed-test analysis and solution explanations.

The assistant is opt-in, sends a question and public page context only, and keeps
conversation history in memory. No API key is exposed. The Test Centre's general
assistant is hidden during an active timed attempt; its result/solution coach
remains available afterward. AI never changes marking, stock, order totals or
payment state. Provider failures are shown honestly; no canned response is labelled
as a successful model response.

## Update the existing Worker

The older deployed Worker recognizes the test-specific actions. Adding its URL
to another page is insufficient for the new assistant routes. Publish the updated
`worker/src/index.js` to the existing `aakash-test-ai` Worker:

1. In Cloudflare Dashboard → Workers & Pages → **aakash-test-ai** → Edit code,
   replace the module with `worker/src/index.js`, then Deploy. Keep the existing
   `AI` Workers AI binding and `ALLOWED_ORIGIN=https://aakash9972sn.github.io`.
2. Alternatively, from the `worker` directory: `npx wrangler login` and
   `npx wrangler deploy`. No deployment credential belongs in frontend code.
3. Open `/health` on the Worker URL. It should report `assistantVersion: 2`,
   `apps: ["shop", "portfolio", "study"]` and `configured: true`.
4. On each website, open **Ask AI** and try a suggested question. The Worker must
   return a real model answer. Existing completed-test coach buttons still work.

This workspace has no Cloudflare deployment login/token and its network blocks
workers.dev, so the updated Worker has **not** been deployed or verified live here.
The source and browser integrations are tested with injected provider responses.
The existing model is retained; optionally set `AI_MODEL` to an available Workers
AI text model. Free allocations and supported models are controlled by Cloudflare;
AI is not promised to be unlimited or permanently free.

## Traffic and data

Only the configured exact browser origin is accepted. Payloads have a 32 KB bound,
questions/history are bounded and the Worker has an in-isolate per-IP throttle.
For public traffic, add the optional `AI_RATE_LIMITER` Cloudflare rate-limiting
binding (or Turnstile/auth appropriate to the site). In-memory limits reset across
isolates; Origin checks alone cannot prevent non-browser abuse. Set account usage
limits and monitor costs. No background model calls occur just from visiting a page.

Provider output is displayed with `textContent`, never executed as HTML. Shop
context excludes phone, email, delivery addresses and private order tokens. User
questions may still contain whatever the user types, so the UI asks them not to
share private details. Portfolio answers must distinguish proposed systems from
implemented work. Model suggestions remain advisory.

## Tests

```sh
node --test tests/ai-worker.test.mjs
```

Covers all three assistant contexts, legacy test routes, CORS, request limits,
invalid inputs, role filtering, provider failures and the capability endpoint.
The shared UI files are copied consistently across the three repositories;
change `ai-config.js` in each app for page-specific context and suggestions.

## Fresh AI-generated tests

On the home page, open **Generate fresh tests with AI**, select NEET or GATE, subject, optional chapter, difficulty, 5 or 10 questions, and 1–3 tests. Each AI generation makes a new saved test with a separate ID. Select a generated test card to use the existing timer, question palette, scoring and results.

- Existing fixed question-bank tests remain available and will still repeat on **Retake**. Choose **Generate AI tests** for fresh sets.
- Generated sets are saved **locally in that browser**, not synced across devices. Up to 30 generated test sets can be saved; delete older AI test cards to make room.
- Recent question stems are sent to the AI to discourage repeats, and the page rejects exact/near-duplicate stems against the locally saved history. Semantic uniqueness and answer correctness cannot be guaranteed.
- AI generation on the free tier is subject to model usage quotas and response quality; use 5-question tests if 10-question generation frequently fails.
- Opening `https://aakash-test-ai.aakashinfinity72.workers.dev/health` should show JSON with `ok: true`, `features`, and `aiBinding`. A true binding only confirms configuration, not successful AI inference.
- GitHub Pages users may need a full refresh (Ctrl+Shift+R) after a deployment to fetch new JavaScript and CSS.
