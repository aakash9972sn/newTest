# Hosted Gemini + Firebase integration

All browser AI requests use `https://ais-pre-wdyrf6yb4psuwizvqpn4hw-374223411049.asia-northeast1.run.app`. No Gemini API key belongs in these repositories. `hosted-ai.js` translates app requests to streaming chat, study MCQs, study doubt and shop assistant endpoints. It handles stream framing, cancellation, failures and the MCQ field conversion. `HostedAI.post(name, payload)` exposes the other supplied REST capabilities; `HostedAI.liveVoiceURL(persona, context)` builds the supplied WebSocket URL. Microphone, TTS, media and live voice interfaces have not been added by this migration.

`firebase-account.js` initializes the supplied Firebase web app and named Firestore database on sign-in (or when restoring a previously opted-in session). The Firebase web API key is public client configuration, not a Gemini credential. Google sign-in requires `aakash9972sn.github.io` in Firebase Authentication authorized domains. Firebase Security Rules must enforce `request.auth.uid == uid` under `/users/{uid}` and its subcollections; this repository cannot inspect or deploy the hosted project's rules.

The account bar supports sign-in/out, page bookmarks and viewing saved data. Test Centre saves completed attempts; Perfect Guess saves its best score; Blunder copies confirmed order summaries without private access tokens or addresses. Cloud records are personal history only: the existing merchant server remains authoritative for orders and payment. These AI endpoints do not provision a checkout or payment backend. Local gameplay/tests continue when Firebase is unavailable.

Existing Cloudflare Worker source in newTest is historical and is no longer called by the websites. Do not configure a Worker key for this integration. The hosted backend owns model selection and credentials.

Local contract tests use simulated API replies. This execution environment blocks the supplied run.app hostname, so live model responses, Firebase login, deployed Firestore rules and account persistence require verification in a browser with access. No claim of live verification is made from mocked tests.

## Firebase Google login — verified live failure (20 November 2026)

A real headless Chromium session opened the deployed website and clicked **Account → Continue with Google**. Firebase returned `auth/unauthorized-domain`. The SDK downloaded and initialized correctly; this is a Firebase project authorization setting, **not** a missing browser library. The front-end now displays this diagnosis and permits retrying initialization.

**Project:** `gen-lang-client-0580718541`.

The Firebase project owner must:

1. Open [Firebase Console](https://console.firebase.google.com/), select the project.
2. Go to **Authentication → Settings → Authorized domains**.
3. Add `aakash9972sn.github.io` (hostname only; no `https://` or `/newTest/` path).
4. In **Authentication → Sign-in method**, confirm **Google** is enabled.
5. Refresh the site, retry **Account → Continue with Google**, then verify actual successful sign-in and cloud saving.

Adding the hostname requires Firebase project administrative access. Updating GitHub source alone cannot authorize it. If the project is controlled by another account, the owner must make the setting change or authorize you. In production, Firestore security rules must also be configured to prevent users reading other users' data.

The Gemini chat has new branding and progressive text output; **streaming client tests use mocked backend responses**, not a guarantee that live Gemini inference is enabled.
