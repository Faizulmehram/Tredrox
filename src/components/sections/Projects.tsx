import { ArrowUpRight, Crosshair, Layers, TrendingUp, Workflow } from "lucide-react";
import { getPublishedProjects, type Project } from "@/content/projects";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

const span: Record<NonNullable<Project["size"]>, string> = {
  feature: "md:col-span-12",
  wide: "md:col-span-7",
  narrow: "md:col-span-5",
};

export function Projects() {
  const projects = getPublishedProjects();

  return (
    <section id="work" aria-labelledby="work-title" className="relative py-28 lg:py-36">
      <div className="wrap">
        <SectionHeading
          id="work-title"
          title="Selected work. Built with purpose."
          titleClassName="max-w-[16ch]"
          intro="A look at the products, platforms and intelligent systems we bring to life."
        />

        {projects.length > 0 ? (
          <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-12">
            {projects.map((project, index) => (
              <div key={project.slug} className={cn(span[project.size ?? "wide"])}>
                <ProjectCard project={project} priority={index === 0} />
              </div>
            ))}
          </div>
        ) : (
          <EmptyWork />
        )}
      </div>
    </section>
  );
}

const caseStudyAnatomy = [
  { icon: Crosshair, title: "The challenge", text: "What was slowing the business down, and why it mattered." },
  { icon: Workflow, title: "The system we built", text: "Architecture, integrations and the decisions behind them." },
  { icon: Layers, title: "The stack", text: "The tools we used and why they fit the problem." },
  { icon: TrendingUp, title: "The outcome", text: "Results the client has approved us to share." },
];

/**
 * Shown until the first case study is published: the message and the way to
 * see relevant work now come first; below it, the frame every case study
 * will fill, described rather than faked.
 */
function EmptyWork() {
  return (
    <div className="mt-14">
      <div data-reveal className="grid grid-cols-1 gap-8 border-t border-line pt-10 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <h3 className="text-[clamp(1.625rem,2.4vw,2.25rem)] font-medium leading-[1.12] tracking-[-0.03em] text-fg">
            Case studies are being written up.
          </h3>
          <p className="mt-4 max-w-[36rem] text-[1rem] leading-relaxed text-fg-2">
            Detailed write-ups of recent builds will appear here. Until then, we are happy to walk you through work
            that is relevant to your project on a short call.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4 lg:col-span-5 lg:justify-end">
          <ButtonLink href="#contact" arrow>
            Ask about recent work
          </ButtonLink>
          <a
            href="#process"
            className="link-draw inline-flex items-center gap-1 text-[0.9375rem] text-muted hover:text-fg"
          >
            How we work
            <ArrowUpRight aria-hidden className="size-4" />
          </a>
        </div>
      </div>

      <div data-reveal="object" style={{ ["--i" as string]: 1 }} className="panel relative isolate mt-12 overflow-hidden p-6 sm:p-10">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-56 bg-[radial-gradient(55%_100%_at_50%_0%,rgba(43,99,245,0.16),transparent)]" />
        <h4 className="text-[1.125rem] font-medium tracking-[-0.02em] text-fg-2">Every case study covers</h4>
        <ul className="mt-6 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
          {caseStudyAnatomy.map((item) => (
            <li key={item.title}>
              <span className="flex size-11 items-center justify-center rounded-xl border border-cobalt-bright/35 bg-cobalt/10 text-cobalt-soft shadow-[0_0_24px_-6px_rgba(43,99,245,0.6)]">
                <item.icon aria-hidden className="size-5" strokeWidth={1.75} />
              </span>
              <p className="mt-5 text-[1.0625rem] font-medium tracking-[-0.015em] text-fg">{item.title}</p>
              <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-muted">{item.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
