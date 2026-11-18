/**
 * Site-wide configuration.
 *
 * Contact details and social links come from environment variables so nothing
 * is invented in code. Leave a variable empty and the matching link is hidden.
 * See `.env.example`.
 */

function clean(value: string | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function siteUrl(): string {
  const fromEnv = clean(process.env.NEXT_PUBLIC_SITE_URL);
  if (fromEnv) return fromEnv.replace(/\/+$/, "");
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return "http://localhost:3000";
}

export type SocialLink = { label: string; href: string };

const socials: SocialLink[] = [
  { label: "LinkedIn", href: clean(process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN) ?? "" },
  { label: "GitHub", href: clean(process.env.NEXT_PUBLIC_SOCIAL_GITHUB) ?? "" },
  { label: "X", href: clean(process.env.NEXT_PUBLIC_SOCIAL_X) ?? "" },
].filter((link) => link.href.length > 0);

export const siteConfig = {
  name: "Tredrox Systems",
  shortName: "Tredrox",
  url: siteUrl(),
  title: "Tredrox Systems | AI Engineering & Intelligent Software",
  description:
    "Tredrox Systems designs, builds and deploys AI agents, LLM integrations, SaaS platforms and business automation for startups and growing businesses.",
  tagline: "Intelligent engineering. Real-world impact.",
  contact: {
    email: clean(process.env.NEXT_PUBLIC_CONTACT_EMAIL),
    location: clean(process.env.NEXT_PUBLIC_CONTACT_LOCATION),
  },
  socials,
} as const;

/** Root-relative so the same links work from /privacy and /work/* pages. */
export const navItems = [
  { label: "Home", href: "/#home", id: "home" },
  { label: "Services", href: "/#services", id: "services" },
  { label: "Solutions", href: "/#solutions", id: "solutions" },
  { label: "Our Process", href: "/#process", id: "process" },
  { label: "Projects", href: "/#work", id: "work" },
  { label: "About", href: "/#about", id: "about" },
  { label: "Contact", href: "/#contact", id: "contact" },
] as const;
