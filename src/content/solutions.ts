export type SolutionLayer = {
  id: "interface" | "intelligence" | "workflow" | "integration";
  layer: string;
  products: string[];
  description: string;
};

/**
 * What we build, told as the layers of one product stack (top to bottom).
 * Every product type from the brief appears exactly once.
 */
export const solutionLayers: SolutionLayer[] = [
  {
    id: "interface",
    layer: "Interface",
    products: ["Scalable web applications", "Custom SaaS applications"],
    description:
      "Fast, accessible front ends and complete SaaS products that your customers log into every day.",
  },
  {
    id: "intelligence",
    layer: "Intelligence",
    products: ["AI-powered business platforms", "AI assistants and chatbots"],
    description:
      "Models that read, reason and respond inside your product, grounded in your own data.",
  },
  {
    id: "workflow",
    layer: "Workflow",
    products: ["Intelligent workflow systems", "Internal business tools"],
    description:
      "Automations and internal tools that take the repetitive work off your team's plate.",
  },
  {
    id: "integration",
    layer: "Integration",
    products: ["Enterprise integrations"],
    description:
      "Connections to the CRM, ERP and payment systems your business already runs on.",
  },
];
