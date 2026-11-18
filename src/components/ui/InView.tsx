"use client";

import { useEffect, useRef, type ComponentProps } from "react";

/**
 * Marks itself data-inview="true|false" so CSS can run looping diagram
 * animations only while they are on screen, and pauses or resumes the SVG
 * (SMIL) animations inside it the same way. Also sets data-seen once, for
 * one-time reveals. No re-render: attributes are written directly.
 */
export function InView({ children, ...props }: ComponentProps<"div">) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const svgs = () => Array.from(el.querySelectorAll<SVGSVGElement>("svg[data-animated]"));

    // Set only after hydration, so without JavaScript nothing is ever hidden.
    el.dataset.inview = "false";
    svgs().forEach((svg) => svg.pauseAnimations());

    const observer = new IntersectionObserver(
      ([entry]) => {
        el.dataset.inview = entry.isIntersecting ? "true" : "false";
        if (entry.isIntersecting) el.dataset.seen = "true";
        svgs().forEach((svg) => {
          if (entry.isIntersecting && !reduce) svg.unpauseAnimations();
          else svg.pauseAnimations();
        });
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} {...props}>
      {children}
    </div>
  );
}
