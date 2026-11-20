/* Post-test bridge to the existing Aakash Assistant.
   Reuses the working shared AI chat: no second model call or duplicate backend.
   The result/answer prompts are prepared after submission only. */
(function () {
  'use strict';

  const truncate = (value, max) => String(value == null ? '' : value).slice(0, max);
  const esc = (value) => String(value).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[c]);

  function openAssistant(prompt, output) {
    if (window.AakashAssistant && typeof window.AakashAssistant.open === 'function') {
      window.AakashAssistant.open(prompt.slice(0, 700));
      if (output) {
        output.hidden = false;
        output.textContent = 'Question prepared in the AI Assistant. Press Send there to get a response.';
      }
    } else {
      if (output) {
        output.hidden = false;
        output.textContent = 'AI Assistant is not loaded yet. Refresh the page and retry.';
      }
    }
  }

  function analysisPrompt(result) {
    const topics = Object.entries(result.topics || {})
      .map(([name, t]) => ({ name, wrong: Number(t.wrong) || 0, skipped: Number(t.unattempted) || 0,
        correct: Number(t.correct) || 0 }))
      .sort((a, b) => (b.wrong * 2 + b.skipped) - (a.wrong * 2 + a.skipped));
    const weak = topics.slice(0, 6).map((t) =>
      truncate(t.name, 35) + ' (' + t.correct + ' right, ' + t.wrong +
      ' wrong, ' + t.skipped + ' skipped)').join('; ');
    return [
      'Analyze my COMPLETED ' + truncate(result.exam, 24) + ' ' +
        truncate(result.subject, 40) + ' test. Use only the numbers below.',
      'Score: ' + result.score + '/' + result.total + '.',
      'Accuracy: ' + result.accuracy + '%.',
      'Correct ' + result.correct + ', wrong ' + result.wrong +
        ', skipped ' + result.unattempted + '.',
      'Weak topics: ' + (weak || 'not available') + '.',
      'Give my top 3 priorities and a short, practical revision plan.',
      'Do not invent timing data.'
    ].join(' ').slice(0, 700);
  }

  function questionPrompt(q, selected, exam, subject) {
    const selectedLabel = Number.isInteger(selected) && q.o[selected] ?
      q.o[selected] : 'Skipped';
    return [
      'Explain this COMPLETED ' + truncate(exam, 20) + ' ' +
        truncate(subject, 30) + ' MCQ. Double-check the given answer key.',
      'Q: ' + truncate(q.q, 210),
      'A: ' + truncate(q.o[0], 55),
      'B: ' + truncate(q.o[1], 55),
      'C: ' + truncate(q.o[2], 55),
      'D: ' + truncate(q.o[3], 55),
      'My answer: ' + truncate(selectedLabel, 65) + '.',
      'Stored key: ' + truncate(q.o[q.a], 65) + '.',
      'Explain why, and flag any mistake in the stored key.'
    ].join(' ').slice(0, 700);
  }

  function mount(result) {
    const host = document.querySelector('#result-body');
    if (!host) return;
    const previous = host.querySelector('#ai-study-coach');
    if (previous) previous.remove();

    const panel = document.createElement('section');
    panel.className = 'ai-study-coach';
    panel.id = 'ai-study-coach';
    panel.innerHTML =
      '<div class="ai-coach-title"><h3>AI Result Review</h3>' +
      '<span>Uses your existing AI Assistant</span></div>' +
      '<p>Review the score and weak topics in the AI Assistant already on this site. ' +
      'Your test answers are not sent automatically; you choose when to ask. ' +
      'AI advice can contain errors.</p>' +
      '<button type="button" class="btn btn-primary" id="ai-analyze">Open AI analysis</button>' +
      '<div class="ai-coach-output" id="ai-analysis-output" hidden aria-live="polite"></div>';
    host.appendChild(panel);

    const button = panel.querySelector('#ai-analyze');
    const output = panel.querySelector('#ai-analysis-output');
    button.addEventListener('click', () => openAssistant(analysisPrompt(result), output));
  }

  function mountSolutions(result, questions) {
    const cards = document.querySelectorAll('#solution-list details[data-ai-qindex]');
    cards.forEach((card) => {
      const i = Number(card.dataset.aiQindex);
      const q = questions[i];
      const body = card.querySelector('.sol-body');
      if (!q || !body || !Array.isArray(q.o) || q.o.length !== 4 ||
          card.querySelector('.ai-doubt-control')) return;

      const box = document.createElement('div');
      box.className = 'ai-doubt-control';
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'btn-ai-doubt';
      button.textContent = 'Explain with AI Assistant';
      const status = document.createElement('div');
      status.className = 'ai-coach-output';
      status.hidden = true;
      status.setAttribute('aria-live', 'polite');
      box.appendChild(button);
      box.appendChild(status);
      body.appendChild(box);

      button.addEventListener('click', async () => {
        button.disabled = true; status.hidden = false; status.textContent = 'Preparing explanation…';
        try {
          const data = await window.HostedAI.request({action:'doubt',question:{exam:result.exam,subject:result.subject,question:q.q,options:q.o,correctIndex:q.a,selectedIndex:result.responses[i]??null,userDoubt:q.unscored ? 'This question has a disputed source key and is excluded from scoring. Do not treat correctIndex as authoritative. Explain the ambiguity and assess each option. Source note: '+q.sourceAnswer : 'Explain the solution step by step and check the supplied answer key.'}},AbortSignal.timeout(60000));
          if(typeof data.answer!=='string'||!data.answer.trim())throw new Error('No explanation returned.');
          status.textContent=data.answer;
        } catch(error){status.textContent=error.message||'Explanation unavailable. Please retry.';}
        finally {button.disabled=false;}
      });
    });
  }

  window.TestCentreAI = { mount, mountSolutions };
})();
