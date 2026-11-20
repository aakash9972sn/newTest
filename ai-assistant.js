/* Shared assistant UI. Public page context only; conversations stay in memory. */
(() => {
  "use strict";
  const config = window.AAKASH_AI;
  if (!config?.endpoint) return;
  const assetBase = new URL(".", document.currentScript.src);
  const spark = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M12 1v22M1 12h22M4 4l16 16M4 20 20 4"/></svg>';
  const arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg>';
  const host = document.createElement("aakash-assistant");
  const root = host.attachShadow({ mode: "open" });
  root.innerHTML = `<link rel="stylesheet" href="${new URL("ai-assistant.css?v=20261120-gemini2", assetBase)}"><button class="launcher" aria-haspopup="dialog" aria-label="Open Aakash Gemini assistant"><span aria-hidden="true">${spark}</span> Ask Gemini</button><dialog aria-labelledby="assistant-title"><header><div class="mark" aria-hidden="true">${spark}</div><div><span class="eyebrow">GOOGLE GEMINI · STUDY ASSISTANT</span><h2 id="assistant-title"></h2></div><button class="close" aria-label="Close AI assistant">×</button></header><div class="conversation"><div class="welcome"><span class="spark" aria-hidden="true">${spark}</span><h3>What’s on your mind?</h3><p></p><div class="suggestions"></div></div><div class="messages" role="log" aria-label="Conversation" aria-live="polite"></div></div><div class="status" role="status"></div><form><label class="sr-only" for="ai-question">Your question</label><textarea id="ai-question" rows="2" maxlength="700" placeholder="Ask in English or Hindi…" required></textarea><button class="send" aria-label="Send question">${arrow}</button></form><footer><span>AI can make mistakes. Check the source details.</span><button type="button" class="clear">Clear chat</button></footer><p class="privacy"></p></dialog>`;
  document.body.appendChild(host);
  const $ = (s) => root.querySelector(s),
    dialog = $("dialog"),
    input = $("textarea"),
    status = $(".status"),
    messages = $(".messages");
  $("#assistant-title").textContent = config.title || "Aakash Assistant";
  $(".welcome p").textContent = config.intro || "Ask about this page.";
  $(".privacy").textContent =
    config.privacy ||
    "Your question and public page context are sent to Google Gemini when you ask. Do not include private details.";
  let history = [],
    busy = false,
    controller,
    sequence = 0,
    lastQuestion = "";
  // Search uses Gemini's Google Search grounding via the hosted Google Gemini backend.
  // Results and cited source links render INSIDE the existing chat dialog.
  const google = document.createElement("button");
  google.type = "button";
  google.className = "google-search";
  google.textContent = "Search Google in chat";
  google.title = "Search with Google grounding inside this chat; citations are shown when provided.";
  $("footer").insertBefore(google, $(".clear"));
  google.addEventListener("click", searchGoogle);

  function renderSearchSources(message, data) {
    if (data.googleGrounded !== true) {
      const warning = document.createElement("small");
      warning.className = "google-grounding-note";
      warning.textContent = "Google did not confirm a web search for this reply. Treat it as an unverified AI answer.";
      message.appendChild(warning);
    }
    const items = Array.isArray(data.sources) ? data.sources : [];
    if (items.length) {
      const group = document.createElement("div");
      group.className = "google-citations";
      const label = document.createElement("strong");
      label.textContent = "Google-grounded sources";
      group.appendChild(label);
      for (const item of items.slice(0, 6)) {
        let url;
        try { url = new URL(item.url); } catch (_) { continue; }
        if (url.protocol !== "https:") continue;
        const a = document.createElement("a");
        a.href = url.href;
        a.textContent = String(item.title || url.hostname).slice(0, 130);
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        group.appendChild(a);
      }
      message.appendChild(group);
    }
    // Render Google's supplied search-suggestion markup unmodified in a
    // sandboxed frame. The frame cannot execute scripts in the host page.
    if (typeof data.suggestionHtml === "string" && data.suggestionHtml) {
      const frame = document.createElement("iframe");
      frame.className = "google-suggestions";
      frame.title = "Google Search suggestions";
      frame.setAttribute("sandbox", "allow-popups allow-popups-to-escape-sandbox");
      frame.setAttribute("referrerpolicy", "no-referrer");
      frame.srcdoc = data.suggestionHtml.slice(0, 15000);
      message.appendChild(frame);
    }
  }

  async function searchGoogle() {
    const previous = [...history].reverse().find((m) => m.role === "user");
    const question = input.value.trim() || (previous && previous.content) || lastQuestion;
    if (busy || !permitted()) return;
    if (!question || question.length < 2) {
      status.textContent = "Type a question to search Google inside the chat.";
      input.focus();
      return;
    }
    busy = true;
    const id = ++sequence;
    controller = new AbortController();
    $(".send").disabled = true;
    google.disabled = true;
    status.textContent = "Searching Google and preparing an answer…";
    $(".welcome").hidden = true;
    if (question !== lastQuestion) bubble(question, "user");
    lastQuestion = question;
    input.value = "";
    try {
      let streamingMessage=null;
      const data = await window.HostedAI.request(
        {action:"google_search",question:question.slice(0,700)},
        AbortSignal.any([controller.signal,AbortSignal.timeout(65000)]),
        (partial)=>{
          if(id!==sequence || !partial)return;
          if(!streamingMessage)streamingMessage=bubble("","assistant");
          streamingMessage.querySelector("p").textContent=partial;
          $(".conversation").scrollTop=$(".conversation").scrollHeight;
        }
      );
      if (!data || typeof data.answer !== "string" || !data.answer.trim())
        throw new Error("Google Search returned no answer.");
      if (id !== sequence) return;
      const answer = data.answer.slice(0, 8000);
      const message = streamingMessage || bubble(answer, "assistant");
      message.querySelector("p").textContent=answer;
      renderSearchSources(message, data);
      history.push({ role: "user", content: question },
                   { role: "assistant", content: answer });
      history = history.slice(-6);
      lastQuestion = "";
      status.textContent = "";
    } catch (error) {
      if (id !== sequence) return;
      status.textContent = error?.name === "TimeoutError"
        ? "Google Search did not respond in time. Try again."
        : error?.message || "Google Search is unavailable.";
      input.value = question;
    } finally {
      if (id === sequence) {
        busy = false;
        $(".send").disabled = false;
        google.disabled = false;
        input.focus();
      }
    }
  }

  for (const question of config.suggestions || []) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = question;
    button.addEventListener("click", () => {
      input.value = question;
      submit();
    });
    $(".suggestions").appendChild(button);
  }
  function permitted() {
    return !config.isAllowed || config.isAllowed();
  }
  function open(question) {
    if (!permitted()) return;
    if (!dialog.open) dialog.showModal();
    if (question) input.value = question;
    input.focus();
    // Backend is already configured for Gemini; do not test obsolete Worker secrets.
    google.textContent = "Search Google in chat";
  }
  function cancel() {
    sequence++;
    controller?.abort();
    controller = null;
    busy = false;
    $(".send").disabled = false;
    google.disabled = false;
    $(".send").innerHTML = arrow;
    status.textContent = "";
  }
  $(".launcher").addEventListener("click", () => open());
  $(".close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("close", () => {
    cancel();
    $(".launcher").focus({ preventScroll: true });
  });
  $(".clear").addEventListener("click", () => {
    cancel();
    history = [];
    lastQuestion = "";
    messages.replaceChildren();
    $(".welcome").hidden = false;
    input.value = "";
    input.focus();
  });
  function bubble(text, role) {
    const div = document.createElement("div");
    div.className = "message " + role;
    const label = document.createElement("b");
    label.textContent = role === "user" ? "You" : config.title || "Assistant";
    const content = document.createElement("p");
    content.textContent = text;
    div.append(label, content);
    messages.appendChild(div);
    $(".conversation").scrollTop = $(".conversation").scrollHeight;
    return div;
  }
  async function submit() {
    const question = input.value.trim();
    if (busy || question.length < 2 || !permitted()) return;
    if (question.length > 700) {
      status.textContent = "Keep your question under 700 characters.";
      return;
    }
    const context = config.context?.();
    if (!context) {
      status.textContent = "The page is still loading. Try again in a moment.";
      return;
    }
    busy = true;
    const id = ++sequence;
    controller = new AbortController();
    $(".send").disabled = true;
    $(".send").textContent = "…";
    status.textContent = "Gemini is preparing your answer…";
    $(".welcome").hidden = true;
    if (question !== lastQuestion) bubble(question, "user");
    lastQuestion = question;
    input.value = "";
    try {
      let streamingMessage=null;
      const data = await window.HostedAI.request({
        action: "assistant",
        app: config.app,
        question,
        context,
        history: history.slice(-6).map((m)=>({
          role:m.role,content:m.content.slice(0,1200)
        }))
      },AbortSignal.any([controller.signal,AbortSignal.timeout(65000)]),(partial)=>{
        if(id!==sequence || !partial)return;
        if(!streamingMessage)streamingMessage=bubble("","assistant");
        streamingMessage.querySelector("p").textContent=partial;
        $(".conversation").scrollTop=$(".conversation").scrollHeight;
      });
      if (!data || typeof data.answer !== "string" || !data.answer.trim())
        throw new Error("Gemini did not return an answer. Please retry.");
      if (id !== sequence) return;
      const answer = data.answer.slice(0, 8000);
      const message = streamingMessage || bubble(answer, "assistant");
      message.querySelector("p").textContent=answer;
      history.push(
        { role: "user", content: question },
        { role: "assistant", content: answer },
      );
      history = history.slice(-6);
      lastQuestion = "";
      status.textContent = "";
    } catch (error) {
      if (id !== sequence) return;
      status.textContent =
        error.name === "TimeoutError" || error.name === "AbortError"
          ? "The answer took too long. Please try again."
          : error.message || "AI is unavailable. Try again.";
      input.value = question;
    } finally {
      if (id === sequence) {
        busy = false;
        $(".send").disabled = false;
        $(".send").innerHTML = arrow;
        input.focus();
      }
    }
  }
  $("form").addEventListener("submit", (event) => {
    event.preventDefault();
    submit();
  });
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey && !event.isComposing) {
      event.preventDefault();
      submit();
    }
  });
  function availability() {
    host.hidden = !permitted();
    if (host.hidden && dialog.open) dialog.close();
  }
  window.addEventListener("hashchange", availability);
  availability();
  window.AakashAssistant = Object.freeze({ open });
})();
