export type ServiceVisual =
  | "agents"
  | "llm"
  | "assistant"
  | "saas"
  | "automation"
  | "api"
  | "mcp"
  | "backend";

export type Service = {
  id: string;
  number: string;
  title: string;
  /** Short name for compact lists (footer). */
  navLabel: string;
  /** One line for compact lists. */
  short: string;
  /** The business problem it solves, 1-2 sentences. */
  description: string;
  /** Typical things we build under this capability. */
  builds: string[];
  visual: ServiceVisual;
};

export const services: Service[] = [
  {
    id: "ai-agents",
    number: "01",
    title: "AI Agents & Multi-Agent Systems",
    navLabel: "AI agents",
    short: "Agents that plan, use tools and hand off work",
    description:
      "Agents that plan, call your tools and hand work to each other, so multi-step jobs like research, triage and reporting run without someone pushing every step.",
    builds: [
      "Research and reporting agents",
      "Support triage with human approval",
      "Agent teams with a supervisor",
    ],
    visual: "agents",
  },
  {
    id: "generative-ai",
    number: "02",
    title: "Generative AI & LLM Integration",
    navLabel: "LLM integration",
    short: "Language models wired into your product and data",
    description:
      "Language models connected to your product and data, with structured outputs, evaluations and cost controls, so AI features behave predictably in production.",
    builds: [
      "Document extraction to structured data",
      "Retrieval over your knowledge base",
      "Model routing across OpenAI, Claude and Gemini",
    ],
    visual: "llm",
  },
  {
    id: "ai-assistants",
    number: "03",
    title: "AI Chatbots & Intelligent Assistants",
    navLabel: "AI assistants",
    short: "Assistants that answer from your data and act",
    description:
      "Assistants that answer from your real data, take actions like booking or updating records, and hand over to a person when they should.",
    builds: [
      "Customer support assistants",
      "Internal knowledge assistants",
      "Sales and onboarding copilots",
    ],
    visual: "assistant",
  },
  {
    id: "saas",
    number: "04",
    title: "SaaS & Full-Stack Development",
    navLabel: "SaaS development",
    short: "Complete products, from first screen to billing",
    description:
      "Complete products from first screen to billing: sign-in, teams, payments, dashboards and the admin tools you need to run the business behind them.",
    builds: [
      "Multi-tenant SaaS platforms",
      "Customer portals",
      "First versions built to grow past version one",
    ],
    visual: "saas",
  },
  {
    id: "automation",
    number: "05",
    title: "Business Process Automation",
    navLabel: "Process automation",
    short: "Repetitive work between tools, automated",
    description:
      "The repetitive work between your tools, such as copying data, chasing approvals and sending updates, turned into workflows that run on their own and report back.",
    builds: [
      "Invoice and document processing",
      "Lead routing and CRM updates",
      "Approval flows with audit trails",
    ],
    visual: "automation",
  },
  {
    id: "integrations",
    number: "06",
    title: "API & Third-Party Integrations",
    navLabel: "APIs & integrations",
    short: "Documented APIs and reliable connections",
    description:
      "Clean, documented APIs and dependable connections to the services you already use, with retries, webhooks and monitoring built in from day one.",
    builds: [
      "Public and partner APIs",
      "Payment, CRM and ERP integrations",
      "Webhook and event pipelines",
    ],
    visual: "api",
  },
  {
    id: "mcp",
    number: "07",
    title: "MCP Servers & AI Tool Integrations",
    navLabel: "MCP servers",
    short: "Give AI assistants safe access to your systems",
    description:
      "Model Context Protocol servers that give AI assistants permissioned access to your systems, so Claude or your own agents can look things up and take action safely.",
    builds: [
      "MCP servers for internal tools",
      "Scoped data access for AI clients",
      "Tool catalogues for agent platforms",
    ],
    visual: "mcp",
  },
  {
    id: "backend",
    number: "08",
    title: "Backend Engineering & Database Architecture",
    navLabel: "Backend & databases",
    short: "Data models and services built for next year's load",
    description:
      "Data models, services and infrastructure designed for the load you expect next year, with caching, queues and backups planned from the start.",
    builds: [
      "PostgreSQL and MongoDB schema design",
      "Caching and job queues with Redis",
      "Migrations off legacy systems",
    ],
    visual: "backend",
  },
];
