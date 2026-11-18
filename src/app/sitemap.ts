import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getCaseStudyProjects } from "@/content/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: siteConfig.url, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${siteConfig.url}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    ...getCaseStudyProjects().map((project) => ({
      url: `${siteConfig.url}/work/${project.slug}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
