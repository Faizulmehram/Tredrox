export type ProcessStep = {
  number: string;
  title: string;
  summary: string;
  deliverables: string[];
};

export const processSteps: ProcessStep[] = [
  {
    number: "01",
    title: "Discover",
    summary: "Understand the business, its requirements and the challenges in the way.",
    deliverables: ["Goals and constraints in writing", "Prioritised scope", "Risks and open questions"],
  },
  {
    number: "02",
    title: "Architect",
    summary: "Design the technical foundation and the architecture of the solution.",
    deliverables: ["Architecture and data model", "Technology choices, with reasons", "Milestone plan"],
  },
  {
    number: "03",
    title: "Engineer",
    summary: "Build, integrate, test and refine the product with you in the loop.",
    deliverables: ["Working builds to review", "Automated tests", "Staging environment"],
  },
  {
    number: "04",
    title: "Scale",
    summary: "Deploy, optimise and support the product as it grows.",
    deliverables: ["Production deployment", "Monitoring and alerts", "Roadmap for the next version"],
  },
];
