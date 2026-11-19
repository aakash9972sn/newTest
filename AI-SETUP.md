# Free AI integration (Cloudflare Workers AI)

The existing test runner and marking are unchanged. AI appears on the **results** screen only; it can analyze wrong answers and explain a submitted question. AI-generated text is advisory, not the marking key.

## Activate (free plan)
1. Create a free Cloudflare account, install Node.js, and from this repository run `cd worker && npx wrangler login`.
2. Run `npx wrangler deploy` from the `worker` directory. The `[ai]` binding connects Cloudflare Workers AI. Accept the free subdomain when prompted.
3. Copy the Worker HTTPS URL displayed after deployment into `ai-config.js`, e.g. `window.TEST_CENTRE_AI_ENDPOINT = "https://aakash-test-ai.YOUR-SUBDOMAIN.workers.dev";`.
4. Commit `ai-config.js`, deploy GitHub Pages, open a test's result screen, and click **Analyze my test** or **Ask AI to explain**.

The API runs on the Worker; no OpenAI/Gemini API key or billing is required for usage within Cloudflare's free allocations. Model availability and limits may change. If you expect public traffic, add a Cloudflare Rate Limiting binding or Turnstile server verification to prevent quota exhaustion. A browser Origin check alone is **not** abuse prevention; this is a starter, not a production-authenticated API.

**Important:** The Worker is not deployed by this pull request. AI controls remain hidden until you set a live HTTPS Worker endpoint in `ai-config.js`.

## Fresh AI-generated tests

On the home page, open **Generate fresh tests with AI**, select NEET or GATE, subject, optional chapter, difficulty, 5 or 10 questions, and 1–3 tests. Each AI generation makes a new saved test with a separate ID. Select a generated test card to use the existing timer, question palette, scoring and results.

- Existing fixed question-bank tests remain available and will still repeat on **Retake**. Choose **Generate AI tests** for fresh sets.
- Generated sets are saved **locally in that browser**, not synced across devices. Up to 30 generated test sets can be saved; delete older AI test cards to make room.
- Recent question stems are sent to the AI to discourage repeats, and the page rejects exact/near-duplicate stems against the locally saved history. Semantic uniqueness and answer correctness cannot be guaranteed.
- AI generation on the free tier is subject to model usage quotas and response quality; use 5-question tests if 10-question generation frequently fails.
- Opening `https://aakash-test-ai.aakashinfinity72.workers.dev/health` should show JSON with `ok: true`, `features`, and `aiBinding`. A true binding only confirms configuration, not successful AI inference.
- GitHub Pages users may need a full refresh (Ctrl+Shift+R) after a deployment to fetch new JavaScript and CSS.
