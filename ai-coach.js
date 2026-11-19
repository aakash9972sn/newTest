/* AI Study Coach — opt-in after results, powered by a separately deployed free Cloudflare Worker.
   No credentials are kept in the browser. The coach is hidden until ai-config.js is set. */
(function () {
  'use strict';

  function endpoint() {
    return typeof window.TEST_CENTRE_AI_ENDPOINT === 'string'
      ? window.TEST_CENTRE_AI_ENDPOINT.trim() : '';
  }

  async function requestAI(action, payload, button, output) {
    if (!endpoint()) return;
    button.disabled = true;
    output.textContent = 'AI is preparing your explanation…';
    output.hidden = false;
    try {
      const response = await fetch(endpoint(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: action, ...payload })
      });
      let data;
      try { data = await response.json(); } catch (_) { data = null; }
      if (!response.ok) {
        throw new Error((data && data.error) || (
          response.status === 429 ? 'Too many requests. Try again later.' : 'AI is temporarily unavailable.'
        ));
      }
      output.textContent = String((data && data.answer) || 'No answer was returned.');
    } catch (error) {
      output.textContent = error && error.message ? error.message : 'Could not connect to AI.';
    } finally {
      button.disabled = false;
    }
  }

  function mount(result, questions) {
    if (!endpoint()) return;
    const host = document.querySelector('#result-body');
    if (!host) return;
    const old = host.querySelector('#ai-study-coach');
    if (old) old.remove();

    const panel = document.createElement('section');
    panel.className = 'ai-study-coach';
    panel.id = 'ai-study-coach';
    panel.innerHTML =
      '<div class="ai-coach-title"><h3>AI Study Coach</h3><span>Free-tier powered</span></div>' +
      '<p>Get a personalized revision plan based on this completed test. ' +
      'AI may make mistakes; check the verified solutions.</p>' +
      '<button type="button" class="btn btn-primary" id="ai-analyze">Analyze my test</button>' +
      '<div class="ai-coach-output" id="ai-analysis-output" hidden aria-live="polite"></div>';
    host.appendChild(panel);

    const button = panel.querySelector('#ai-analyze');
    const output = panel.querySelector('#ai-analysis-output');
    button.addEventListener('click', function () {
      const review = questions.map(function (q, i) {
        const chosen = result.responses[i];
        if (chosen === q.a) return null;
        return {
          topic: q.t || 'General',
          question: String(q.q || '').slice(0, 260),
          selected: chosen == null ? 'Skipped' : String(q.o[chosen] || 'Unknown').slice(0, 120),
          answer: String(q.o[q.a] || '').slice(0, 120)
        };
      }).filter(Boolean).slice(0, 8);
      const stats = {
        exam: result.exam, subject: result.subject,
        correct: result.correct, wrong: result.wrong, skipped: result.unattempted,
        accuracy: result.accuracy, timeUsedSeconds: result.timeUsed,
        topics: result.topics, review: review
      };
      requestAI('analysis', { stats: stats }, button, output);
    });
  }

  function mountSolutions(result, questions) {
    if (!endpoint()) return;
    const cards = document.querySelectorAll('#solution-list details[data-ai-qindex]');
    cards.forEach(function (card) {
      const i = Number(card.dataset.aiQindex);
      const q = questions[i];
      if (!q || card.querySelector('.ai-doubt-control')) return;
      const body = card.querySelector('.sol-body');
      if (!body) return;

      const box = document.createElement('div');
      box.className = 'ai-doubt-control';
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'btn-ai-doubt';
      button.textContent = 'Ask AI to explain';
      const output = document.createElement('div');
      output.className = 'ai-coach-output';
      output.hidden = true;
      output.setAttribute('aria-live', 'polite');
      box.appendChild(button);
      box.appendChild(output);
      body.appendChild(box);

      button.addEventListener('click', function () {
        const chosen = result.responses[i];
        requestAI('doubt', {
          question: {
            exam: result.exam, subject: result.subject, topic: q.t || 'General',
            text: String(q.q || '').slice(0, 650),
            options: q.o,
            correctIndex: q.a,
            selectedIndex: chosen == null ? null : chosen,
            verifiedExplanation: String(q.e || '').slice(0, 1000)
          }
        }, button, output);
      });
    });
  }

  window.TestCentreAI = { mount: mount, mountSolutions: mountSolutions };
})();
