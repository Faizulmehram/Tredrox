"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Marks [data-reveal] elements as revealed the first time they enter the
 * viewport. CSS in globals.css does the motion; this only flips the flag,
 * once per element, and never hides anything itself.
 *
 * Headings start fully clipped (clip-path), which an IntersectionObserver
 * reads as zero visible area, so a heading is watched through its parent.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-revealed])"));
    if (elements.length === 0) return;

    const byTarget = new Map<Element, HTMLElement[]>();
    for (const el of elements) {
      const target = el.dataset.reveal === "heading" ? (el.parentElement ?? el) : el;
      byTarget.set(target, [...(byTarget.get(target) ?? []), el]);
    }

    const reveal = (target: Element) => {
      for (const el of byTarget.get(target) ?? []) el.dataset.revealed = "";
      byTarget.delete(target);
      observer.unobserve(target);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) reveal(entry.target);
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );
    byTarget.forEach((_, target) => observer.observe(target));

    // Safety net: a fast jump (a far nav link while the page is busy) can carry
    // an element past the viewport between observer checks. Anything whose top
    // is already above the fold line is revealed on the next scroll frame.
    let frame = 0;
    const sweep = () => {
      frame = 0;
      const line = window.innerHeight * 0.9;
      byTarget.forEach((_, target) => {
        const rect = target.getBoundingClientRect();
        if (rect.top < line && (rect.width > 0 || rect.height > 0)) reveal(target);
      });
      if (byTarget.size === 0) window.removeEventListener("scroll", onScroll);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(sweep);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return null;
}
