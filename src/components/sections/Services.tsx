"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { ArrowRight, Check, Plus } from "lucide-react";
import { services } from "@/content/services";
import { serviceVisuals } from "@/components/services/ServiceVisuals";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InView } from "@/components/ui/InView";
import { cn } from "@/lib/cn";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

export function Services() {
  return (
    <section id="services" aria-labelledby="services-title" className="relative py-28 lg:py-36">
      <div className="wrap">
        <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-12">
          <SectionHeading
            id="services-title"
            title="Intelligent solutions."
            muted="Engineered to scale."
            className="lg:col-span-7"
          />
          <p data-reveal style={{ ["--i" as string]: 2 }} className="type-lead max-w-[30rem] lg:col-span-4 lg:col-start-9">
            Eight capabilities from one engineering team. Pick one to see the kind of system it produces.
          </p>
        </div>

        <ServiceExplorer />
        <ServiceAccordion />
      </div>
    </section>
  );
}

/* Desktop: an index of services beside one live module. ------------------- */

function ServiceExplorer() {
  const [active, setActive] = useState(0);
  const reduce = usePrefersReducedMotion();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const hoverTimer = useRef<number | undefined>(undefined);
  const service = services[active];
  const Visual = serviceVisuals[service.visual];

  function select(index: number, focus = false) {
    setActive(index);
    if (focus) tabRefs.current[index]?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const last = services.length - 1;
    const keys: Record<string, number> = {
      ArrowDown: index === last ? 0 : index + 1,
      ArrowUp: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    };
    if (event.key in keys) {
      event.preventDefault();
      select(keys[event.key], true);
    }
  }

  // Hover intent: crossing several rows on the way to the panel should not
  // flip the panel through every service.
  function onHover(index: number) {
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setActive(index), 90);
  }

  return (
    <div data-reveal="object" className="mt-16 hidden grid-cols-12 gap-10 lg:grid">
      <div
        role="tablist"
        aria-orientation="vertical"
        aria-label="Services"
        className="col-span-5 flex flex-col border-t border-line"
        onPointerLeave={() => window.clearTimeout(hoverTimer.current)}
      >
        {services.map((item, index) => {
          const selected = index === active;
          return (
            <button
              key={item.id}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              id={`service-tab-${item.id}`}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls="service-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => select(index)}
              onPointerEnter={(event) => event.pointerType === "mouse" && onHover(index)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={cn(
                "group relative flex items-center gap-5 border-b border-line py-[1.05rem] pl-3 pr-3 text-left transition-[background-color,color] duration-300 focus-visible:outline-offset-[-2px]",
                selected
                  ? "bg-[linear-gradient(90deg,rgba(43,99,245,0.12),rgba(43,99,245,0.03)_45%,transparent_80%)] text-fg"
                  : "text-muted hover:bg-white/[0.02] hover:text-fg-2",
              )}
            >
              <span
                className={cn(
                  "type-code w-6 shrink-0 tabular-nums transition-colors duration-200",
                  selected ? "text-cobalt-bright" : "text-faint",
                )}
              >
                {item.number}
              </span>
              <span className="flex-1 text-[1.1875rem] font-medium leading-snug tracking-[-0.02em]">{item.title}</span>
              <ArrowRight
                aria-hidden
                className={cn(
                  "size-4 shrink-0 transition-[opacity,transform] duration-200 ease-out",
                  selected ? "translate-x-0 opacity-100 text-cobalt-bright" : "-translate-x-1 opacity-0",
                )}
              />
              {selected ? (
                <motion.span
                  layoutId="service-active"
                  aria-hidden
                  className="absolute inset-x-0 bottom-[-1px] h-px bg-cobalt-bright"
                  transition={reduce ? { duration: 0 } : { duration: 0.3, ease: EASE_OUT }}
                />
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="relative isolate col-span-7">
        <div aria-hidden className="light-pool -inset-x-10 -bottom-16 top-1/4" />
        <div
          id="service-panel"
          role="tabpanel"
          aria-labelledby={`service-tab-${service.id}`}
          className="panel sticky top-24 overflow-hidden"
        >
          <InView className="relative h-[22rem] overflow-hidden border-b border-line">
            <div aria-hidden className="blueprint absolute inset-0 opacity-70 [mask-image:radial-gradient(70%_70%_at_50%_50%,#000,transparent)]" />
            <div aria-hidden className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(50%_100%_at_50%_0%,rgba(43,99,245,0.16),transparent)]" />
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={service.id}
                className="absolute inset-0"
                initial={reduce ? { opacity: 0 } : { opacity: 0, filter: "blur(6px)", scale: 0.985 }}
                animate={reduce ? { opacity: 1 } : { opacity: 1, filter: "blur(0px)", scale: 1 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, filter: "blur(6px)", scale: 1.01 }}
                transition={{ duration: 0.26, ease: EASE_OUT }}
              >
                <Visual />
              </motion.div>
            </AnimatePresence>
          </InView>
          <div className="relative min-h-[13.5rem] p-7">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={service.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: EASE_OUT }}
              >
                <h3 className="type-h3 text-fg">{service.title}</h3>
                <p className="mt-3 max-w-[36rem] text-[0.9875rem] leading-relaxed text-fg-2">{service.description}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {service.builds.map((build) => (
                    <li
                      key={build}
                      className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1 text-[0.8125rem] text-fg-2"
                    >
                      <Check aria-hidden className="size-3.5 text-cobalt-bright" strokeWidth={2.25} />
                      {build}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Phones and tablets: the same modules as an accordion. ------------------- */

function ServiceAccordion() {
  const [open, setOpen] = useState<number | null>(0);
  const reduce = usePrefersReducedMotion();

  return (
    <ul data-reveal="object" className="mt-12 border-t border-line lg:hidden">
      {services.map((item, index) => {
        const expanded = open === index;
        const Visual = serviceVisuals[item.visual];
        return (
          <li key={item.id} className="border-b border-line">
            <h3>
              <button
                type="button"
                aria-expanded={expanded}
                aria-controls={`service-body-${item.id}`}
                id={`service-head-${item.id}`}
                onClick={() => setOpen(expanded ? null : index)}
                className="flex w-full items-center gap-4 py-5 text-left"
              >
                <span className={cn("type-code w-6 shrink-0", expanded ? "text-cobalt-bright" : "text-faint")}>
                  {item.number}
                </span>
                <span
                  className={cn(
                    "flex-1 text-[1.125rem] font-medium leading-snug tracking-[-0.02em]",
                    expanded ? "text-fg" : "text-fg-2",
                  )}
                >
                  {item.title}
                </span>
                <Plus
                  aria-hidden
                  className={cn(
                    "size-5 shrink-0 text-muted transition-transform duration-300 ease-out",
                    expanded && "rotate-45",
                  )}
                />
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {expanded ? (
                <motion.div
                  id={`service-body-${item.id}`}
                  role="region"
                  aria-labelledby={`service-head-${item.id}`}
                  initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  animate={reduce ? { opacity: 1 } : { height: "auto", opacity: 1 }}
                  exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.32, ease: EASE_OUT }}
                  className="overflow-hidden"
                >
                  <div className="pb-7 pl-10">
                    <p className="text-[0.9875rem] leading-relaxed text-fg-2">{item.description}</p>
                    <ul className="mt-4 space-y-1.5">
                      {item.builds.map((build) => (
                        <li key={build} className="flex items-center gap-2 text-[0.875rem] text-fg-2">
                          <Check aria-hidden className="size-3.5 shrink-0 text-cobalt-bright" strokeWidth={2.25} />
                          {build}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <InView className="panel relative mb-7 overflow-hidden">
                    <div aria-hidden className="blueprint absolute inset-0 opacity-60" />
                    <div className="relative min-h-[17rem]">
                      <Visual />
                    </div>
                  </InView>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
