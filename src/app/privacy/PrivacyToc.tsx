"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { cn } from "@/lib/cn";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

/**
 * Contents for the privacy notice that follows the reader: the section under
 * the reading line (30% down the screen) is lit, with a cobalt bar on its
 * edge that slides from item to item. At the very bottom of the page the last
 * section is lit even if it is too short to reach the reading line.
 */
export function PrivacyToc({ sections }: { sections: Array<{ id: string; title: string }> }) {
  const [active, setActive] = useState(sections[0]?.id ?? "");
  const reduce = usePrefersReducedMotion();

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const line = window.innerHeight * 0.3;
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      let current = sections[0]?.id ?? "";
      for (const { id } of sections) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      if (atBottom) current = sections[sections.length - 1]?.id ?? current;
      setActive((previous) => (previous === current ? previous : current));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [sections]);

  return (
    <nav aria-label="On this page" className="lg:sticky lg:top-28">
      <p className="text-[0.8125rem] text-faint">On this page</p>
      <ol className="relative mt-4 space-y-1 border-l border-line">
        {sections.map((section, index) => {
          const isActive = section.id === active;
          return (
            <li key={section.id} className="relative">
              {isActive ? (
                <motion.span
                  layoutId="privacy-toc-active"
                  aria-hidden
                  className="absolute -left-px inset-y-0 w-[2px] rounded-full bg-cobalt-bright shadow-[0_0_10px_1px_rgba(77,134,255,0.75)]"
                  transition={reduce ? { duration: 0 } : { duration: 0.35, ease: EASE_OUT }}
                />
              ) : null}
              <a
                href={`#${section.id}`}
                aria-current={isActive ? "location" : undefined}
                onClick={() => setActive(section.id)}
                className={cn(
                  "flex gap-3 rounded-r-md py-1.5 pl-4 pr-2 text-[0.875rem] transition-[color,background-color] duration-200",
                  isActive
                    ? "bg-[linear-gradient(90deg,rgba(43,99,245,0.12),transparent_85%)] text-fg"
                    : "text-muted hover:text-fg",
                )}
              >
                <span
                  className={cn(
                    "type-code w-5 shrink-0 transition-colors duration-200",
                    isActive ? "text-cobalt-soft" : "text-faint",
                  )}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                {section.title}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
