"use client";

import { useEffect, useRef } from "react";

/**
 * The closing wordmark, engraved: a faint fill and a hairline outline that a
 * point of cobalt light travels across. The light follows a fine pointer and
 * drifts slowly on its own otherwise; it only animates while on screen, and
 * sits still (centred) under reduced motion.
 */
export function FooterWordmark() {
  const svgRef = useRef<SVGSVGElement>(null);
  const lightRef = useRef<SVGRadialGradientElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    const light = lightRef.current;
    if (!svg || !light) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const pos = { x: 600, y: 60 };
    const target = { x: 600, y: 60 };
    let pointerActive = false;
    let frame = 0;
    let visible = false;
    const start = performance.now();

    const tick = (now: number) => {
      if (!pointerActive) {
        const t = (now - start) / 1000;
        target.x = 600 + Math.sin(t * 0.35) * 420;
        target.y = 110 + Math.cos(t * 0.5) * 70;
      }
      pos.x += (target.x - pos.x) * 0.08;
      pos.y += (target.y - pos.y) * 0.08;
      light.setAttribute("cx", pos.x.toFixed(1));
      light.setAttribute("cy", pos.y.toFixed(1));
      if (visible) frame = requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const rect = svg.getBoundingClientRect();
      pointerActive = true;
      target.x = ((event.clientX - rect.left) / rect.width) * 1200;
      target.y = ((event.clientY - rect.top) / rect.height) * 250;
    };
    const onLeave = () => {
      pointerActive = false;
    };

    const footer = svg.closest("footer") ?? svg;
    footer.addEventListener("pointermove", onMove as EventListener);
    footer.addEventListener("pointerleave", onLeave);

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(frame);
      if (visible) frame = requestAnimationFrame(tick);
    });
    observer.observe(svg);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      footer.removeEventListener("pointermove", onMove as EventListener);
      footer.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 1200 250"
      aria-hidden
      className="pointer-events-none mt-16 block h-auto w-full select-none"
    >
      <defs>
        <radialGradient ref={lightRef} id="wordmark-light" gradientUnits="userSpaceOnUse" cx="600" cy="60" r="340">
          <stop offset="0" stopColor="rgba(190,212,255,0.95)" />
          <stop offset="0.35" stopColor="rgba(77,134,255,0.55)" />
          <stop offset="1" stopColor="rgba(155,186,255,0.14)" />
        </radialGradient>
      </defs>
      <text
        x="600"
        y="232"
        textAnchor="middle"
        fontSize="300"
        fontWeight="600"
        letterSpacing="-12"
        fill="rgba(237,242,247,0.035)"
        stroke="url(#wordmark-light)"
        strokeWidth="1.4"
        style={{ fontFamily: "var(--font-geist), sans-serif" }}
      >
        Tredrox
      </text>
    </svg>
  );
}
