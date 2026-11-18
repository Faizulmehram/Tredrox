export type Tech = {
  id: string;
  name: string;
  /** File name in /public/icons/tech and /public/icons/tech-mono. */
  icon: string;
  role: string;
  /** Mark is black in its own colours and needs inverting on the dark ground. */
  ink?: boolean;
};

export type StackGroup = {
  id: "frontend" | "backend" | "ai" | "infrastructure";
  label: string;
  summary: string;
  items: Tech[];
};

const tech = {
  react: { id: "react", name: "React", icon: "react", role: "Component-driven interfaces" },
  nextjs: { id: "nextjs", name: "Next.js", icon: "nextjs", role: "Fast, search-friendly web apps" },
  typescript: { id: "typescript", name: "TypeScript", icon: "typescript", role: "Typed from database to UI" },
  nodejs: { id: "nodejs", name: "Node.js", icon: "nodejs", role: "APIs and background workers" },
  postgres: { id: "postgres", name: "PostgreSQL", icon: "postgres", role: "Relational data you can rely on" },
  mongodb: { id: "mongodb", name: "MongoDB", icon: "mongodb", role: "Flexible document storage" },
  redis: { id: "redis", name: "Redis", icon: "redis", role: "Caching, queues and rate limits" },
  openai: { id: "openai", name: "OpenAI", icon: "openai", role: "GPT models and embeddings", ink: true },
  claude: { id: "claude", name: "Claude", icon: "claude", role: "Long-context reasoning and tool use" },
  gemini: { id: "gemini", name: "Gemini", icon: "gemini", role: "Multimodal and long-document work" },
  aws: { id: "aws", name: "AWS", icon: "aws", role: "Cloud hosting and managed services" },
  docker: { id: "docker", name: "Docker", icon: "docker", role: "One environment, laptop to production" },
  supabase: { id: "supabase", name: "Supabase", icon: "supabase", role: "Postgres, auth and storage, fast" },
} satisfies Record<string, Tech>;

/** Order used by the hero marquee (as listed in the brief). */
export const marqueeTech: Tech[] = [
  tech.react,
  tech.nextjs,
  tech.nodejs,
  tech.typescript,
  tech.postgres,
  tech.mongodb,
  tech.supabase,
  tech.redis,
  tech.openai,
  tech.claude,
  tech.gemini,
  tech.docker,
  tech.aws,
];

export const stackGroups: StackGroup[] = [
  {
    id: "frontend",
    label: "Frontend",
    summary: "What your users see and touch",
    items: [tech.react, tech.nextjs, tech.typescript],
  },
  {
    id: "backend",
    label: "Backend",
    summary: "Services, data and state",
    items: [tech.nodejs, tech.postgres, tech.mongodb, tech.redis],
  },
  {
    id: "ai",
    label: "AI & Intelligence",
    summary: "Models chosen per task",
    items: [tech.openai, tech.claude, tech.gemini],
  },
  {
    id: "infrastructure",
    label: "Infrastructure",
    summary: "Where it all runs",
    items: [tech.aws, tech.docker, tech.supabase],
  },
];
