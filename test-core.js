/* Pure attempt validation, timing and scoring shared by the UI and regression tests. */
(function (root) {
  'use strict';
  const bound = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
  const remaining = (deadline, now = Date.now()) => Math.max(0, Math.ceil((deadline - now) / 1000));
  function progress(raw, questions, total, now = Date.now()) {
    if (!raw || !Array.isArray(raw.responses) || raw.responses.length !== questions.length) return null;
    let timeLeft = Number.isFinite(raw.timeLeft) ? bound(Math.ceil(raw.timeLeft), 0, total) : total;
    if (Number.isFinite(raw.deadline)) timeLeft = Math.min(timeLeft, remaining(raw.deadline, now));
    return {
      responses: questions.map((q, i) => Number.isInteger(raw.responses[i]) && raw.responses[i] >= 0 && raw.responses[i] < q.o.length ? raw.responses[i] : null),
      marked: questions.map((_, i) => Array.isArray(raw.marked) && raw.marked[i] === true),
      visited: questions.map((_, i) => Array.isArray(raw.visited) && raw.visited[i] === true),
      current: Number.isInteger(raw.current) ? bound(raw.current, 0, questions.length - 1) : 0,
      timeLeft
    };
  }
  function state(q, response) {
    return q.unscored ? 'excluded' : response == null ? 'skipped' : response === q.a ? 'correct' : 'wrong';
  }
  function score(questions, responses, marking) {
    const out = { correct: 0, wrong: 0, unattempted: 0, excluded: 0, topics: {} };
    questions.forEach((q, i) => {
      const status = state(q, responses[i]);
      if (status === 'excluded') { out.excluded++; return; }
      const topic = q.t || 'General';
      if (!Object.prototype.hasOwnProperty.call(out.topics, topic)) Object.defineProperty(out.topics, topic, {value:{correct:0,wrong:0,unattempted:0,total:0},enumerable:true});
      const key = status === 'skipped' ? 'unattempted' : status;
      out[key]++; out.topics[topic][key]++; out.topics[topic].total++;
    });
    out.score = Math.round((out.correct * marking.correct - out.wrong * marking.wrong) * 100) / 100;
    out.total = (questions.length - out.excluded) * marking.correct;
    out.accuracy = out.correct + out.wrong ? Math.round(out.correct / (out.correct + out.wrong) * 100) : 0;
    return out;
  }
  const api = { remaining, progress, state, score };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.TestCentreCore = api;
})(typeof window !== 'undefined' ? window : this);
