import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/content/projects";
import { InView } from "@/components/ui/InView";
import { ProjectArtwork } from "./ProjectArtwork";
import { cn } from "@/lib/cn";

const frameAspect: Record<NonNullable<Project["size"]>, string> = {
  feature: "aspect-[16/10] md:aspect-[21/9]",
  wide: "aspect-[16/11]",
  // Same rendered height as a wide card beside it (7 + 5 columns).
  narrow: "aspect-[16/11] md:aspect-[25/24]",
};

const sizes: Record<NonNullable<Project["size"]>, string> = {
  feature: "(min-width: 1360px) 1264px, 100vw",
  wide: "(min-width: 1024px) 58vw, 100vw",
  narrow: "(min-width: 1024px) 40vw, 100vw",
};

export function ProjectCard({ project, priority }: { project: Project; priority?: boolean }) {
  const size = project.size ?? "wide";
  const href = project.caseStudy ? `/work/${project.slug}` : project.externalUrl;
  const external = !project.caseStudy && Boolean(project.externalUrl);

  const media = (
    <InView className="relative overflow-hidden rounded-[var(--radius-panel)]">
      <div className={cn("reveal-clip relative overflow-hidden rounded-[var(--radius-panel)] border border-line", frameAspect[size])}>
        <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.03]">
          {project.image ? (
            <Image
              src={project.image.src}
              alt={project.image.alt}
              fill
              sizes={sizes[size]}
              priority={priority}
              className={cn(project.image.fit === "contain" ? "object-contain p-[6%]" : "object-cover")}
            />
          ) : (
            <ProjectArtwork kind={project.artwork ?? "layers"} />
          )}
        </div>
        {project.sample ? (
          <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-ground/70 px-2.5 py-1 text-[0.75rem] text-fg-2 backdrop-blur">
            Sample
          </span>
        ) : null}
      </div>
    </InView>
  );

  const body = (
    <div className="mt-5 grid grid-cols-1 gap-x-8 gap-y-3 md:grid-cols-[1fr_auto]">
      <div>
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="type-h3 text-fg">{project.title}</h3>
          <p className="text-[0.875rem] text-muted">
            {project.category}
            {project.year ? ` · ${project.year}` : ""}
          </p>
        </div>
        <p className="mt-2 max-w-[44rem] text-[0.9375rem] leading-relaxed text-fg-2">{project.summary}</p>
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <li key={tag} className="rounded-full border border-line px-2.5 py-0.5 text-[0.75rem] text-muted">
              {tag}
            </li>
          ))}
        </ul>
      </div>
      {href ? (
        <span className="inline-flex items-center gap-1.5 self-start text-[0.9375rem] font-medium text-cobalt-soft transition-colors duration-200 group-hover:text-fg">
          {project.caseStudy ? "Read the case study" : "Visit the product"}
          <ArrowUpRight
            aria-hidden
            className="size-4 transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </span>
      ) : null}
    </div>
  );

  const className = "group flex flex-col";

  if (href) {
    return (
      <Link
        href={href}
        className={cn(className, "rounded-[var(--radius-panel)]")}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {media}
        {body}
      </Link>
    );
  }
  return (
    <article className={className}>
      {media}
      {body}
    </article>
  );
}
