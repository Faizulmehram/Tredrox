export const projectTypes = [
  "AI agents or multi-agent system",
  "Generative AI or LLM integration",
  "AI chatbot or assistant",
  "SaaS or full-stack application",
  "Business process automation",
  "API or third-party integration",
  "MCP server or AI tool integration",
  "Backend or database architecture",
  "Not sure yet",
] as const;

/** Edit freely: the ranges are shown as-is and sent with the enquiry. */
export const budgetRanges = [
  "Under $10k",
  "$10k to $25k",
  "$25k to $50k",
  "$50k to $100k",
  "Over $100k",
  "Not sure yet",
] as const;

export const nextSteps = [
  { title: "We read your brief", text: "Someone who builds this kind of system reads it, not a sales script." },
  { title: "A call about the problem", text: "We ask about the work, the users and the constraints, then suggest an approach." },
  { title: "A written proposal", text: "Scope, timeline and cost in one document you can share internally." },
] as const;
