# Google Search **inside** Aakash AI Assistant

This integration answers a question **inside the existing chat** using Google Search grounding through **Gemini 2.5 Flash-Lite**. Unlike the old Google shortcut, it does not open a new tab by default. It can return a grounded answer with source links and Google's search-suggestion widget.

## One-time setup (required)

1. Open **[Google AI Studio](https://aistudio.google.com/apikey)**, sign in, create a Gemini Developer API key for an eligible free-tier project.
2. In your Cloudflare dashboard go to **Workers & Pages → aakash-test-ai → Settings → Variables and Secrets**.
3. Add a **Secret**, name exactly `GEMINI_API_KEY`, and paste the key as its private value. **Never add this key to GitHub, ai-config.js, browser JavaScript or chat messages.**
4. Save the binding and deploy/apply changes if the Cloudflare dashboard requires it. Existing Workers AI binding `AI` remains unchanged.
5. Open `https://aakash-test-ai.aakashinfinity72.workers.dev/health`. It should show `"googleSearchConfigured":true` (only a boolean; it never reveals your key).
6. Refresh the website, open **Ask AI**, type a question, then click **Search Google in chat**. The grounded response and cited sources appear in the same dialogue.

## Architecture

- The browser sends the user-entered query to your Cloudflare Worker as `{action:"google_search", question:"..."}`.
- The Worker calls `gemini-2.5-flash-lite:generateContent` with the `google_search` tool, using a secret Cloudflare environment binding.
- Only returned answer, source titles/HTTPS URLs, and Google's search-suggestion markup are passed to the page. The search-suggestion markup is isolated inside a sandboxed iframe.
- The existing **regular chat** remains on its original Workers AI model, with the same Codex UI and context.
- **Question generation** also remains unchanged.
- When the key is missing or invalid, an explicit setup error is shown *inside* the chat. No fake Google results are generated.

## Quotas, privacy and accuracy

Google's published Gemini 2.5 Flash-Lite pricing currently describes a limited free tier for Google Search grounding (subject to usage/rate limits and regional/project eligibility). Confirm current terms in [official pricing](https://ai.google.dev/gemini-api/docs/pricing). **Do not enable billing without an explicit decision**. If the model or free quota becomes unavailable, the Google button returns a clear error; existing Cloudflare AI chat remains usable.

When you press Search Google in chat, the typed query is sent via your Cloudflare Worker to Google. Normal AI chat does not send that query to Google. Search-grounded answers may still contain errors; citations are not automatic proof of correctness.

## Verification

`node --test tests/*.test.mjs`

For a true live check, the private `GEMINI_API_KEY` secret must be configured first. Mock tests cannot prove that Google Search grounding was used live.
