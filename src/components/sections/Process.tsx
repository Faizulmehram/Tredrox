"use client";

import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { processSteps } from "@/content/process";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/cn";

/**
 * Four steps on one connected line. The line fills as the section scrolls
 * through the viewport and each step lights as the line reaches it.
 */
export function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 55%"] });
  const fill = useTransform(scrollYProgress, [0, 1], [0, 1]);
  // A point of light rides the head of the line while it is drawing.
  const headAlong = useTransform(fill, (v) => `${v * 100}%`);
  const headOpacity = useTransform(fill, [0, 0.03, 0.97, 1], [0, 1, 1, 0]);
  const [reached, setReached] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const next = Math.min(processSteps.length, Math.floor(value * processSteps.length + 0.35));
    setReached((current) => (current === next ? current : next));
  });

  const lit = (index: number) => reduce || reached > index;

  return (
    <section id="process" aria-labelledby="process-title" className="relative py-28 lg:py-36">
      <div className="wrap">
        <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-12">
          <SectionHeading
            id="process-title"
            title="From ambitious idea to intelligent product."
            className="lg:col-span-8"
          />
          <p data-reveal style={{ ["--i" as string]: 2 }} className="type-lead max-w-[28rem] lg:col-span-4">
            Four stages, each ending with something you can hold: a document, a plan, working software, a live
            product.
          </p>
        </div>

        <div ref={ref} className="relative mt-16 lg:mt-20">
          {/* Horizontal track (desktop) */}
          <div aria-hidden className="absolute left-0 right-0 top-[11px] hidden h-px bg-line lg:block">
            <motion.div
              className="h-full origin-left bg-gradient-to-r from-cobalt-bright via-cobalt-bright to-mint"
              style={{ scaleX: reduce ? 1 : fill }}
            />
            {reduce ? null : (
              <motion.span
                className="absolute -top-[3.5px] size-2 -translate-x-1/2 rounded-full bg-[#dbe6ff] shadow-[0_0_16px_5px_rgba(77,134,255,0.7)]"
                style={{ left: headAlong, opacity: headOpacity }}
              />
            )}
          </div>
          {/* Vertical track (phones, tablets) */}
          <div aria-hidden className="absolute bottom-0 left-[11px] top-0 w-px bg-line lg:hidden">
            <motion.div
              className="h-full w-full origin-top bg-gradient-to-b from-cobalt-bright to-mint"
              style={{ scaleY: reduce ? 1 : fill }}
            />
            {reduce ? null : (
              <motion.span
                className="absolute -left-[3.5px] size-2 -translate-y-1/2 rounded-full bg-[#dbe6ff] shadow-[0_0_16px_5px_rgba(77,134,255,0.7)]"
                style={{ top: headAlong, opacity: headOpacity }}
              />
            )}
          </div>

          <ol className="grid grid-cols-1 gap-12 lg:grid-cols-4 lg:gap-8">
            {processSteps.map((step, index) => (
              <li key={step.number} data-reveal style={{ ["--i" as string]: index + 1 }} className="relative pl-12 lg:pl-0 lg:pt-14">
                <span
                  aria-hidden
                  className={cn(
                    "absolute left-0 top-0 flex size-[23px] items-center justify-center rounded-full border transition-[border-color,background-color,box-shadow] duration-500 ease-out",
                    lit(index)
                      ? "border-cobalt-bright bg-cobalt/25 shadow-[0_0_0_6px_rgba(43,99,245,0.12)]"
                      : "border-line-strong bg-ground",
                  )}
                >
                  <span
                    className={cn(
                      "size-[7px] rounded-full transition-colors duration-500",
                      lit(index) ? (index === processSteps.length - 1 ? "bg-mint" : "bg-cobalt-bright") : "bg-white/25",
                    )}
                  />
                </span>
                <p className="type-code text-cobalt-bright">{step.number}</p>
                <h3 className="mt-2 text-[clamp(1.75rem,2.6vw,2.25rem)] font-medium leading-none tracking-[-0.035em] text-fg">
                  {step.title}
                </h3>
                <p className="mt-4 max-w-[22rem] text-[0.9875rem] leading-relaxed text-fg-2 lg:min-h-[4.9em]">
                  {step.summary}
                </p>
                <div className="mt-6 border-t border-line pt-4">
                  <p className="text-[0.8125rem] text-faint">You get</p>
                  <ul className="mt-2 space-y-1.5">
                    {step.deliverables.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-[0.9375rem] text-fg-2">
                        <span aria-hidden className="mt-[0.6em] h-px w-3 shrink-0 bg-cobalt-bright" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
