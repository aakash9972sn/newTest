// Cloudflare Workers AI endpoint (free tier)
window.TEST_CENTRE_AI_ENDPOINT =
  "https://aakash-test-ai.aakashinfinity72.workers.dev";

window.AAKASH_AI = {
  endpoint: window.TEST_CENTRE_AI_ENDPOINT,
  app: "study",
  title: "Your AI study partner",
  intro:
    "Plan your revision, choose a practice test or work through a difficult concept.",
  suggestions: [
    "Make a 7-day NEET revision plan",
    "How should I review a mock test?",
    "Help me choose a GATE practice test",
  ],
  privacy:
    "Normal questions use Cloudflare AI. If you press Search Google in chat, your typed question goes to Google Gemini for web grounding; Google sources appear in this chat. Active test responses are not shared. Review AI advice against your study material.",
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
