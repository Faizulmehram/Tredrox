/**
 * Portfolio data.
 *
 * To publish a project, add an object to `projects` below. Nothing else needs
 * to change: the Selected Work section, the project page at /work/<slug> and
 * the sitemap all read from this array.
 *
 * Images: put files in /public/work/<slug>/ and reference them as
 * "/work/<slug>/cover.jpg". Any aspect ratio works; set `width` and `height`
 * to the real pixel size so the layout never shifts while it loads.
 */

export type ProjectImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** "cover" crops to the frame (photos, screenshots); "contain" keeps the whole image (device mockups on transparent PNG). */
  fit?: "cover" | "contain";
};

export type ProjectArtwork = "layers" | "network" | "flow" | "terminal";

export type CaseStudy = {
  challenge: string;
  solution: string;
  /** Only real, client-approved outcomes. Leave out if you have none yet. */
  outcome?: string;
  gallery?: ProjectImage[];
};

export type Project = {
  slug: string;
  title: string;
  category: string;
  /** One or two sentences, shown on the card. */
  summary: string;
  tags: string[];
  /** Real image; when omitted the card shows abstract artwork instead. */
  image?: ProjectImage;
  artwork?: ProjectArtwork;
  /** "feature" spans the full row; "wide" and "narrow" pair up (7 + 5 columns). */
  size?: "feature" | "wide" | "narrow";
  /** Add a case study to enable the "View case study" link and the /work/<slug> page. */
  caseStudy?: CaseStudy;
  /** Optional external link (live product, app store page). */
  externalUrl?: string;
  year?: string;
  /** Marks sample entries; never set this on a real project. */
  sample?: boolean;
};

// ---------------------------------------------------------------------------
// Real projects. Empty until case studies are approved for publication.
// ---------------------------------------------------------------------------
export const projects: Project[] = [
  // {
  //   slug: "acme-support-assistant",
  //   title: "Acme Support Assistant",
  //   category: "AI assistant",
  //   summary: "A support assistant that answers from Acme's help centre and order system, and hands complex cases to an agent.",
  //   tags: ["Next.js", "Claude", "PostgreSQL"],
  //   image: { src: "/work/acme-support-assistant/cover.jpg", alt: "Acme support assistant answering an order question", width: 2400, height: 1500 },
  //   size: "feature",
  //   caseStudy: { challenge: "...", solution: "..." },
  //   year: "2026",
  // },
];

// ---------------------------------------------------------------------------
// Sample entries to preview the filled layout. They render only while
// `projects` is empty AND SHOW_SAMPLE_PROJECTS is true, and every card is
// badged "Sample". Keep this false on the live site.
// ---------------------------------------------------------------------------
export const SHOW_SAMPLE_PROJECTS = false;

export const sampleProjects: Project[] = [
  {
    slug: "sample-operations-platform",
    title: "Operations platform",
    category: "AI-powered business platform",
    summary:
      "Sample slot. A feature project spans the full row; replace with a real cover image and summary.",
    tags: ["Next.js", "PostgreSQL", "Claude"],
    artwork: "layers",
    size: "feature",
    sample: true,
  },
  {
    slug: "sample-workflow-system",
    title: "Workflow system",
    category: "Business process automation",
    summary: "Sample slot in the wide position. Any image ratio fits the frame.",
    tags: ["Node.js", "Redis", "OpenAI"],
    artwork: "flow",
    size: "wide",
    sample: true,
  },
  {
    slug: "sample-assistant",
    title: "Knowledge assistant",
    category: "AI assistant",
    summary: "Sample slot in the narrow position, paired with the wide card beside it.",
    tags: ["TypeScript", "Gemini"],
    artwork: "terminal",
    size: "narrow",
    sample: true,
  },
];

export function getPublishedProjects(): Project[] {
  if (projects.length > 0) return projects;
  return SHOW_SAMPLE_PROJECTS ? sampleProjects : [];
}

export function getCaseStudyProjects(): Project[] {
  return projects.filter((project) => project.caseStudy);
}

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
