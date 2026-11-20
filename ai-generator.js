/* AI Test Generator — uses the hosted Google Gemini API.
   Generated MCQ sets are stored locally on this device, separate from built-in tests. */
(function () {
  'use strict';

  const STORAGE_KEY = 'tclab.ai.generated.v1';
  const MAX_SAVED = 30;
  const asText = (v) => String(v == null ? '' : v);
  const normalize = (v) => asText(v).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  const tokenSet = (v) => new Set(normalize(v).split(' ').filter((w) => w.length > 3));
  const similar = (a, b) => {
    if (normalize(a) === normalize(b)) return true;
    const x = tokenSet(a), y = tokenSet(b);
    if (x.size < 4 || y.size < 4) return false;
    let intersect = 0;
    x.forEach((s) => { if (y.has(s)) intersect++; });
    return intersect / Math.max(x.size, y.size) >= 0.84;
  };

  function validQuestion(q) {
    return q && typeof q.q === 'string' && q.q.trim().length >= 15 &&
      q.q.length <= 900 && Array.isArray(q.o) && q.o.length === 4 &&
      q.o.every((v) => typeof v === 'string' && v.trim().length && v.length <= 250) &&
      new Set(q.o.map(normalize)).size === 4 &&
      Number.isInteger(q.a) && q.a >= 0 && q.a <= 3 &&
      typeof q.e === 'string' && q.e.trim().length >= 10 && q.e.length <= 1300 &&
      typeof q.t === 'string' && q.t.trim().length >= 2 && q.t.length <= 100;
  }

  function validTest(t) {
    return t && typeof t.id === 'string' && /^ai-[a-z0-9-]+$/.test(t.id) &&
      typeof t.examId === 'string' && typeof t.subjectId === 'string' &&
      t.test && typeof t.test.title === 'string' && t.test.title.length <= 160 &&
      Number.isFinite(t.test.duration) && t.test.duration > 0 && t.test.duration <= 120 &&
      Array.isArray(t.test.questions) && t.test.questions.length >= 1 &&
      t.test.questions.length <= 10 && t.test.questions.every(validQuestion);
  }

  function loadSaved() {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return Array.isArray(data) ? data.filter(validTest).slice(0, MAX_SAVED) : [];
    } catch (_) { return []; }
  }

  function writeSaved(items) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); return true; }
    catch (_) { return false; }
  }

  function removeSaved(id) {
    return writeSaved(loadSaved().filter((t) => t.id !== id));
  }

  function endpoint() {
    return typeof window.TEST_CENTRE_AI_ENDPOINT === 'string' ?
      window.TEST_CENTRE_AI_ENDPOINT.trim() : '';
  }

  function makeHistory(examId, subjectId, topic) {
    const recent = loadSaved().filter((item) => item.examId === examId &&
      item.subjectId === subjectId &&
      (!topic || normalize(item.topic) === normalize(topic)));
    const previous = recent.flatMap((item) => item.test.questions.map((q) => q.q));
    const other = loadSaved().filter((item) => item.examId === examId &&
      item.subjectId === subjectId && (!topic || normalize(item.topic) !== normalize(topic)))
      .flatMap((item) => item.test.questions.map((q) => q.q)).slice(-12);
    const fixed = ((window.QUESTION_BANKS || {})[subjectId] || [])
      .slice(0, 6).map((q) => q.q);
    return previous.concat(other, fixed).slice(-35);
  }

  function validateGenerated(raw, count, history) {
    if (!raw || !Array.isArray(raw.questions) || raw.questions.length !== count) {
      throw new Error('AI did not return a complete question set. Please try again.');
    }
    const accepted = [];
    for (const q of raw.questions) {
      if (!validQuestion(q)) throw new Error('AI produced an invalid MCQ. Please generate again.');
      if (history.concat(accepted.map((x) => x.q)).some((p) => similar(q.q, p))) {
        throw new Error('AI repeated a question. Please generate again for a fresh set.');
      }
      accepted.push({
        q: q.q.trim(), o: q.o.map((v) => v.trim()), a: q.a,
        e: q.e.trim(), t: q.t.trim()
      });
    }
    return accepted;
  }


  async function fetchWithDeadline(url, options, ms, externalSignal) {
    const controller = new AbortController();
    let timedOut = false;
    const relayAbort = () => controller.abort();
    if (externalSignal?.aborted) throw new Error('Generation cancelled.');
    externalSignal?.addEventListener('abort', relayAbort, { once: true });
    const timer = setTimeout(() => { timedOut = true; controller.abort(); }, ms);
    try {
      const response = await window.HostedAI.transport(url, { ...options, signal: controller.signal });
      const body = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error((body && body.error) ||
          ('AI server returned HTTP ' + response.status + '. Check the AI service.'));
      }
      return body;
    } catch (error) {
      if (error && error.name === 'AbortError') {
        if (externalSignal?.aborted && !timedOut) throw new Error('Generation cancelled.');
        throw new Error('AI did not respond within ' + Math.round(ms / 1000) +
          ' seconds. Try again or check your connection.');
      }
      if (error instanceof TypeError) {
        throw new Error('Cannot reach the AI service. Check your connection and retry.');
      }
      throw error;
    } finally {
      clearTimeout(timer);
      externalSignal?.removeEventListener('abort', relayAbort);
    }
  }

  async function checkBackend(signal) {
    const workerUrl = endpoint();
    const healthUrl = workerUrl.replace(/\/$/, '') + '/health';
    const health = await fetchWithDeadline(healthUrl, {method:'GET'}, 10000, signal);
    if (!health?.ok || !health.configured) throw new Error('The hosted AI service is not configured yet.');
  }

  function mount(exams, register, refresh) {
    exams = exams.filter(exam => exam.aiSupported !== false);
    const host = document.querySelector('#ai-generator');
    if (!host || host.dataset.ready) return;
    host.dataset.ready = '1';
    host.innerHTML =
      '<div class="ai-gen-intro"><span class="ai-gen-kicker">✦ GOOGLE GEMINI · AI PRACTICE</span>' +
      '<h2>Generate fresh tests with AI</h2>' +
      '<p>Choose an exam, subject and chapter. Every new set is saved on this device. ' +
      'AI-generated answers can be wrong—verify important solutions.</p></div>' +
      '<form class="ai-gen-form" id="ai-gen-form">' +
      '<label>Exam<select id="ai-gen-exam" required></select></label>' +
      '<label>Subject<select id="ai-gen-subject" required></select></label>' +
      '<label>Chapter / topic<input id="ai-gen-topic" maxlength="80" placeholder="e.g. Rotational Motion (optional)"></label>' +
      '<label>Difficulty<select id="ai-gen-level"><option value="Mixed">Mixed</option>' +
      '<option value="Easy">Easy</option><option value="Medium">Medium</option><option value="Hard">Hard</option></select></label>' +
      '<label>Questions per test<select id="ai-gen-count"><option value="5">5</option><option value="10">10</option></select></label>' +
      '<label>Number of tests<select id="ai-gen-batch"><option value="1">1 test</option>' +
      '<option value="2">2 different tests</option><option value="3">3 different tests</option></select></label>' +
      '<button type="submit" class="btn btn-primary" id="ai-gen-submit">Generate AI tests</button>' +
      '</form>' +
      '<button type="button" class="ai-gen-diagnostic" id="ai-gen-diagnostic">Check Gemini connection (2 questions)</button>' +
      '<div class="ai-gen-job" id="ai-gen-job" hidden>' +
      '<div class="ai-gen-job-line"><span id="ai-gen-progress-label">Preparing…</span>' +
      '<button type="button" class="ai-gen-cancel" id="ai-gen-cancel">Cancel</button></div>' +
      '<progress id="ai-gen-progress" value="0" max="5"></progress></div>' +
      '<p class="ai-gen-status" id="ai-gen-status" role="status" aria-live="polite"></p>';

    const form = host.querySelector('#ai-gen-form');
    const examSelect = host.querySelector('#ai-gen-exam');
    const subjectSelect = host.querySelector('#ai-gen-subject');
    const topicInput = host.querySelector('#ai-gen-topic');
    const levelSelect = host.querySelector('#ai-gen-level');
    const countSelect = host.querySelector('#ai-gen-count');
    const batchSelect = host.querySelector('#ai-gen-batch');
    const button = host.querySelector('#ai-gen-submit');
    const status = host.querySelector('#ai-gen-status');
    const progressWrap = host.querySelector('#ai-gen-job');
    const progress = host.querySelector('#ai-gen-progress');
    const progressLabel = host.querySelector('#ai-gen-progress-label');
    const cancel = host.querySelector('#ai-gen-cancel');
    const controls = Array.from(form.querySelectorAll('input, select'));
    let activeController = null;
    const diagnostic = host.querySelector('#ai-gen-diagnostic');
    diagnostic.addEventListener('click', async () => {
      if (activeController) return;
      diagnostic.disabled = true;
      status.dataset.state = 'progress';
      status.textContent = 'Testing live AI inference with 2 questions…';
      try {
        await checkBackend();
        const exam = exams.find((e) => e.id === examSelect.value);
        const subject = exam?.subjects.find((s) => s.id === subjectSelect.value);
        if (!subject) throw new Error('Choose a valid subject first.');
        const started = Date.now();
        const answer = await fetchWithDeadline(endpoint(), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'generate', exam: exam.id, subject: subject.id,
            topic: topicInput.value.trim(), difficulty: levelSelect.value,
            count: 2, avoid: []
          })
        }, 45000);
        validateGenerated(answer, 2, []);
        status.dataset.state = 'success';
        status.textContent = 'Live AI generated 2 valid-format questions in ' +
          Math.round((Date.now() - started) / 1000) +
          's. Now try Generate AI tests. This does not verify academic answer accuracy.';
      } catch (error) {
        status.dataset.state = 'error';
        status.textContent = 'AI diagnostic failed: ' + (error?.message || 'Unknown error');
      } finally {
        diagnostic.disabled = false;
      }
    });
    cancel.addEventListener('click', () => {
      if (!activeController) return;
      cancel.disabled = true;
      progressLabel.textContent = 'Cancelling…';
      activeController.abort();
    });

    exams.forEach((exam) => examSelect.add(new Option(exam.name, exam.id)));
    function syncSubjects() {
      subjectSelect.replaceChildren();
      const exam = exams.find((e) => e.id === examSelect.value);
      if (exam) exam.subjects.forEach((s) => subjectSelect.add(new Option(s.name, s.id)));
    }
    examSelect.addEventListener('change', syncSubjects);
    syncSubjects();

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!endpoint()) { status.textContent = 'AI endpoint is not configured.'; return; }
      const exam = exams.find((e) => e.id === examSelect.value);
      const subject = exam && exam.subjects.find((s) => s.id === subjectSelect.value);
      if (!subject) { status.textContent = 'Select a valid exam and subject.'; return; }
      const topic = topicInput.value.trim();
      const difficulty = levelSelect.value;
      const count = Number(countSelect.value);
      const batch = Number(batchSelect.value);
      const saved = loadSaved();
      if (saved.length + batch > MAX_SAVED) {
        status.textContent = 'You have reached the 30-test local storage limit. Delete an older AI test first.';
        return;
      }
      status.dataset.state = 'progress';
      button.disabled = true;
      button.textContent = 'Generating…';
      controls.forEach((input) => { input.disabled = true; });
      const controller = new AbortController();
      activeController = controller;
      cancel.disabled = false;
      progressWrap.hidden = false;
      progress.max = batch * count;
      progress.value = 0;
      progressLabel.textContent = '0 / ' + (batch * count) + ' questions';
      let created = 0;
      try {
        status.textContent = 'Checking Google Gemini connection…';
        await checkBackend(controller.signal);
        for (let n = 0; n < batch; n++) {
          const questions = [];
          const chunks = count === 10 ? [3, 3, 2, 2] : [2, 3];
          for (let c = 0; c < chunks.length; c++) {
            status.textContent = 'Generating test ' + (n + 1) + ' of ' + batch +
              ', question batch ' + (c + 1) + ' of ' + chunks.length +
              '… ' + questions.length + '/' + count + ' questions prepared.';
            const allPrevious = loadSaved().filter((x) =>
              x.examId === exam.id && x.subjectId === subject.id
            ).flatMap((x) => x.test.questions.map((q) => q.q));
            const history = makeHistory(exam.id, subject.id, topic)
              .concat(questions.map((q) => q.q));
            let chunkQuestions;
            for (let attempt = 1; attempt <= 2; attempt++) {
              if (controller.signal.aborted) throw new Error('Generation cancelled.');
              try {
                const body = await fetchWithDeadline(endpoint(), {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                action: 'generate', exam: exam.id, subject: subject.id,
                topic: topic, difficulty: difficulty, count: chunks[c],
                avoid: history, batchIndex: n * chunks.length + c
              })
                }, 45000, controller.signal);
                chunkQuestions = validateGenerated(body, chunks[c], allPrevious.concat(history));
                break;
              } catch (error) {
                const recoverable = /invalid|incomplete|repeated|JSON|question set/i.test(error.message || '');
                if (attempt === 2 || !recoverable || controller.signal.aborted) throw error;
                status.textContent = 'AI returned an incomplete batch. Retrying this batch once…';
              }
            }
            questions.push(...chunkQuestions);
            progress.value = (n * count) + questions.length;
            progressLabel.textContent = progress.value + ' / ' + (batch * count) + ' questions prepared';
          }
          const title = 'AI · ' + (topic || subject.name) + ' · ' + difficulty + ' · ' +
            new Date().toLocaleDateString() + ' #' + (loadSaved().length + 1);
          const id = 'ai-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
          const item = {
            id: id, examId: exam.id, subjectId: subject.id, topic: topic,
            createdAt: Date.now(),
            test: {
              id: id, title: title, level: 'AI-generated · check answers',
              duration: Math.ceil(count * (exam.id === 'neet' ? 1.5 : 2)),
              marking: exam.id === 'neet' ? { correct: 4, wrong: 1 } : { correct: 1, wrong: 1 / 3 },
              questions: questions, generated: true
            }
          };
          if (!writeSaved(loadSaved().concat(item))) {
            throw new Error('Could not save tests. Please free browser storage and retry.');
          }
          register(item);
          created++;
          refresh();
        }
        status.dataset.state = 'success';
        status.textContent = '✓ ' + created + ' unique AI test' + (created === 1 ? '' : 's') +
          ' created! Find them in the test cards below. Generate again for another set.';
      } catch (error) {
        const prefix = created ? created + ' completed test(s) saved. ' : '';
        status.textContent = prefix + (error?.message || 'Could not generate tests.');
        status.dataset.state = 'error';
      } finally {
        activeController = null;
        progressWrap.hidden = true;
        controls.forEach((input) => { input.disabled = false; });
        button.disabled = false;
        button.textContent = 'Generate AI tests';
      }
    });
  }

  window.TestCentreAIGenerator = { loadSaved, mount, removeSaved };
})();