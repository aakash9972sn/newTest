# Test Centre engineering notes

## Components

- `data.js`: existing curated question banks (unchanged by AI).
- `app.js`: exam runner, timer, local progress and marking.
- `ai-generator.js`: optional AI set creation, browser storage, retry, cancellation and output validation.
- `ai-coach.js` + `ai-assistant.js`: optional post-test review through the existing shared assistant.
- `worker/src/index.js`: Cloudflare Worker backend. The same Worker serves the study assistant and Codex's other apps; preserve existing actions.

## Quality gates

`node --test tests/*.test.mjs`

The test suite mocks AI inference and covers valid output, duplicate prevention, invalid input, existing Codex AI, CORS, health and local persistence. CI runs for PRs and merges. These are **not** live model tests; the real Cloudflare binding and deployed version must be checked separately.

## Live acceptance checklist

1. `/health` reports `ok: true`, `aiBinding: true`, `generationVersion: 3`.
2. Generate one 5-question GATE test and one 5-question NEET test on the deployed site.
3. Confirm different test IDs and no duplicate stems within the saved sets; finish both and check scores/solutions.
4. Open the shared Codex `Ask AI` assistant and ask a question; verify it still responds.
5. Submit a test and click `Open AI analysis`; verify assistant opens with a prepared prompt.
6. During another generation, click `Cancel` and confirm UI recovers without saving an incomplete set.
7. On mobile, check navigation, forms, results, and the AI controls.
8. Test quota exhaustion, failed model output and network outages. The user should see an error—not endless loading.

## Limitations and risk decisions

- Cloudflare Workers AI free quota is finite. Neither arbitrary test volume nor 100% unique model-generated questions can be promised.
- Model-generated answer keys are not authoritative. The website marks them as AI-generated; serious exam prep needs manual review or a verified question bank.
- Tests, progress, and generated questions are local to each browser, not synced between devices.
- A CORS Origin check alone is not authentication. For large public usage, configure Cloudflare rate limiting/Turnstile.
- No paid backend or AI plan is provisioned by this repository.
