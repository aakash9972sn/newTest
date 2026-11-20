// Hosted Gemini backend; no private keys in the browser
window.TEST_CENTRE_AI_ENDPOINT =
  "https://ais-pre-wdyrf6yb4psuwizvqpn4hw-374223411049.asia-northeast1.run.app";

window.AAKASH_AI = {
  endpoint: window.TEST_CENTRE_AI_ENDPOINT,
  app: "study",
  title: "Aakash Gemini",
  intro:
    "Your Gemini-powered study companion. Ask concepts, plan revision or search Google with sources, right here.",
  suggestions: [
    "Explain a difficult NEET concept",
    "Find recent GATE ECE exam updates",
    "Help me choose a GATE practice test",
  ],
  privacy:
    "Questions go to Google Gemini through the hosted backend. Search Google adds web grounding. Active test responses are not shared. Review AI advice against your study material.",
  isAllowed: () => !location.hash.startsWith("#/t/"),
  context: () => ({
    exams: (window.EXAM_DATA || []).map((exam) => ({
      name: exam.name,
      subjects: exam.subjects.map((subject) => ({
        name: subject.name,
        tests: subject.tests.map((test) => ({
          title: test.title,
          duration: test.duration,
          level: test.level,
        })),
      })),
    })),
  }),
};
