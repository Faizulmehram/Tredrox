import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getCaseStudyProjects, getProject } from "@/content/projects";
import { ProjectArtwork } from "@/components/projects/ProjectArtwork";
import { ButtonLink } from "@/components/ui/Button";

/*
  Case-study template. A page is generated for every project in
  src/content/projects.ts that has a `caseStudy`. Unknown slugs return 404.
*/

export const dynamicParams = false;

export function generateStaticParams() {
  // Next.js needs at least one entry to export the route; the placeholder 404s.
  const projects = getCaseStudyProjects();
  return projects.length > 0 ? projects.map((project) => ({ slug: project.slug })) : [{ slug: "_" }];
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project?.caseStudy) return { title: "Case study not found", robots: { index: false } };
  return {
    title: `${project.title}: ${project.category}`,
    description: project.summary,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: project.image ? { images: [{ url: project.image.src, alt: project.image.alt }] } : undefined,
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project?.caseStudy) notFound();
  const { caseStudy } = project;

  const sections = [
    { title: "The challenge", body: caseStudy.challenge },
    { title: "What we built", body: caseStudy.solution },
    ...(caseStudy.outcome ? [{ title: "The outcome", body: caseStudy.outcome }] : []),
  ];

  return (
    <article className="pb-28 pt-32 lg:pt-40">
      <div className="wrap">
        <Link
          href="/#work"
          className="inline-flex items-center gap-2 text-[0.9375rem] text-muted transition-colors duration-200 hover:text-fg"
        >
          <ArrowLeft aria-hidden className="size-4" /> All work
        </Link>
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <p className="text-[0.9375rem] text-muted">
              {project.category}
              {project.year ? ` · ${project.year}` : ""}
            </p>
            <h1 className="type-display mt-3 text-fg">{project.title}</h1>
          </div>
          <div className="lg:col-span-4 lg:self-end">
            <p className="type-lead">{project.summary}</p>
            <ul className="mt-5 flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <li key={tag} className="rounded-full border border-line px-2.5 py-0.5 text-[0.8125rem] text-muted">
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="relative mt-14 aspect-[16/9] overflow-hidden rounded-[var(--radius-frame)] border border-line">
          {project.image ? (
            <Image
              src={project.image.src}
              alt={project.image.alt}
              fill
              priority
              sizes="(min-width: 1360px) 1264px, 100vw"
              className={project.image.fit === "contain" ? "object-contain p-[5%]" : "object-cover"}
            />
          ) : (
            <ProjectArtwork kind={project.artwork ?? "layers"} />
          )}
        </div>

        <div className="mx-auto mt-20 max-w-[46rem] space-y-14">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="type-h3 text-fg">{section.title}</h2>
              <p className="mt-4 whitespace-pre-line text-[1.0625rem] leading-relaxed text-fg-2">{section.body}</p>
            </section>
          ))}
        </div>

        {caseStudy.gallery?.length ? (
          <div className="mt-20 grid grid-cols-1 gap-6 md:grid-cols-2">
            {caseStudy.gallery.map((image) => (
              <div key={image.src} className="relative overflow-hidden rounded-[var(--radius-panel)] border border-line">
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="h-auto w-full"
                />
              </div>
            ))}
          </div>
        ) : null}

        <div className="mt-24 flex flex-wrap items-center gap-4 border-t border-line pt-10">
          <ButtonLink href="/#contact" size="lg" arrow>
            Start a Project
          </ButtonLink>
          {project.externalUrl ? (
            <a
              href={project.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[0.9375rem] text-muted hover:text-fg"
            >
              Visit the product <ArrowUpRight aria-hidden className="size-4" />
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
