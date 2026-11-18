export type Principle = {
  title: string;
  /** How a launch-only build tends to handle it. */
  launchOnly: string;
  /** How Tredrox handles it. */
  tredrox: string;
};

export const principles: Principle[] = [
  {
    title: "Business-first engineering",
    launchOnly: "Features chosen because they are possible.",
    tredrox: "Features chosen because they move a number your business tracks.",
  },
  {
    title: "Scalable architecture",
    launchOnly: "Fine for the demo, rewritten at the first growth spurt.",
    tredrox: "Data model and infrastructure sized for where you plan to be.",
  },
  {
    title: "Practical AI",
    launchOnly: "AI added because everyone is adding it.",
    tredrox: "AI where it removes real work, with checks and a fallback when it is unsure.",
  },
  {
    title: "Reliable delivery",
    launchOnly: "One big reveal at the end of the project.",
    tredrox: "Working increments you can test throughout the build.",
  },
  {
    title: "Modern technology",
    launchOnly: "Whatever the team happened to know.",
    tredrox: "Current, well-supported tools: TypeScript, PostgreSQL, Docker and AWS.",
  },
  {
    title: "Long-term technical thinking",
    launchOnly: "Handover is the finish line.",
    tredrox: "Documented, tested code your own team can run and extend.",
  },
];
