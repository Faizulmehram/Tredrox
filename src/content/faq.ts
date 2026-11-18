export type FaqItem = { question: string; answer: string };

/**
 * Review these answers before launch: they describe how Tredrox works and
 * should match what you commit to in proposals and contracts.
 */
export const faqs: FaqItem[] = [
  {
    question: "What kinds of projects do you take on?",
    answer:
      "AI agents and assistants, LLM features inside existing products, automation of business processes, SaaS platforms, APIs and integrations, and the backends behind them. Projects range from a focused first version to a full platform.",
  },
  {
    question: "We are not technical. Can we still work with you?",
    answer:
      "Yes. Discovery turns your goals into a written scope in plain language, and during the build you review working software rather than technical documents.",
  },
  {
    question: "Which AI models do you work with?",
    answer:
      "OpenAI, Claude and Gemini. We choose per task based on quality, speed, cost and data requirements, and design the system so a model can be swapped when that makes sense.",
  },
  {
    question: "Can you work with our existing product or codebase?",
    answer:
      "Yes. We can extend an existing application, add AI features to it or connect it to new services. Discovery starts with a review of what you already have.",
  },
  {
    question: "How do you handle data and privacy in AI projects?",
    answer:
      "We send models only the data a task needs, keep sensitive records inside your own infrastructure where required, and agree how data is handled with you before any build starts.",
  },
  {
    question: "What happens after launch?",
    answer:
      "That is the Scale phase: monitoring, performance work, fixes and the next round of features, for as long as the product needs it.",
  },
];
