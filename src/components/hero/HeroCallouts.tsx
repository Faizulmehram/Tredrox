"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

export type AnchorUpdate = (points: Array<{ x: number; y: number }>) => void;

const agentSteps = [
  "Reading the customer's request",
  "Looking up the order history",
  "Drafting a reply with sources",
  "Waiting for a person to approve",
];

const toolCalls = [
  { call: "search_customers()", result: "3 matches" },
  { call: "get_invoice()", result: "found" },
  { call: "create_ticket()", result: "created" },
];

/** Steps through `length` states every 3.2s while the hero is on screen. */
function useCycle(ref: RefObject<HTMLElement | null>, length: number, offset: number, still: boolean) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (still || !el) return;
    let timer: number | undefined;
    const observer = new IntersectionObserver(([entry]) => {
      window.clearInterval(timer);
      if (entry.isIntersecting) timer = window.setInterval(() => setIndex((i) => (i + 1) % length), 3200);
    });
    const start = window.setTimeout(() => observer.observe(el), offset);
    return () => {
      window.clearTimeout(start);
      window.clearInterval(timer);
      observer.disconnect();
    };
  }, [ref, length, offset, still]);
  return index;
}

/**
 * Engineering-drawing callouts pinned to the processor: a ring on the part, a
 * hairline leader and two lines of type. No boxes. Positions arrive every
 * frame from the 3D scene (anchors projected to the screen) and are written
 * straight to the DOM, so the leaders stay attached while the board moves.
 */
export function HeroCallouts({ updateRef }: { updateRef: RefObject<AnchorUpdate | null> }) {
  const reduce = usePrefersReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const labelA = useRef<HTMLDivElement>(null);
  const labelB = useRef<HTMLDivElement>(null);
  const lineA = useRef<SVGPolylineElement>(null);
  const lineB = useRef<SVGPolylineElement>(null);
  const ringA = useRef<SVGCircleElement>(null);
  const ringB = useRef<SVGCircleElement>(null);
  const agentIndex = useCycle(rootRef, agentSteps.length, 0, reduce);
  const toolIndex = useCycle(rootRef, toolCalls.length, 1600, reduce);

  useEffect(() => {
    /**
     * Places one callout: the label sits off the anchor in the preferred
     * direction and flips to the other side whenever it would leave the box;
     * the leader runs from the ring to the label's near corner, then
     * underlines the label.
     */
    const place = (
      anchor: { x: number; y: number },
      label: HTMLDivElement,
      line: SVGPolylineElement,
      ring: SVGCircleElement,
      prefer: { right: boolean; up: boolean },
      bounds: { w: number; h: number },
    ) => {
      const w = label.offsetWidth;
      const h = label.offsetHeight;
      const dx = 32;
      const dy = 56;
      const margin = 12;
      let right = prefer.right;
      let up = prefer.up;
      if (right && anchor.x + dx + w > bounds.w - margin) right = false;
      else if (!right && anchor.x - dx - w < margin) right = true;
      if (up && anchor.y - dy - h < margin) up = false;
      else if (!up && anchor.y + dy + h > bounds.h - margin) up = true;

      // Label edge nearest the anchor, clamped so the label never leaves the box.
      let near = right ? anchor.x + dx : anchor.x - dx;
      if (right) near = Math.min(near, bounds.w - margin - w);
      else near = Math.max(near, margin + w);
      const far = right ? near + w : near - w;
      const rule = up ? anchor.y - dy : anchor.y + dy; // underline y
      const top = up ? rule - h - 4 : rule + 6;
      label.style.transform = `translate3d(${Math.min(near, far)}px, ${top}px, 0)`;
      label.style.textAlign = right ? "left" : "right";
      line.setAttribute("points", `${anchor.x},${anchor.y} ${near},${rule} ${far},${rule}`);
      ring.setAttribute("cx", String(anchor.x));
      ring.setAttribute("cy", String(anchor.y));
    };

    updateRef.current = (points) => {
      const root = rootRef.current;
      if (!root || points.length < 2) return;
      root.dataset.ready = "";
      const bounds = { w: root.clientWidth, h: root.clientHeight };
      if (labelA.current && lineA.current && ringA.current) {
        place(points[0], labelA.current, lineA.current, ringA.current, { right: true, up: true }, bounds);
      }
      if (labelB.current && lineB.current && ringB.current) {
        place(points[1], labelB.current, lineB.current, ringB.current, { right: false, up: false }, bounds);
      }
    };
    return () => {
      updateRef.current = null;
    };
  }, [updateRef]);

  const shadow = "[text-shadow:0_1px_10px_rgba(5,8,13,0.95),0_0_2px_rgba(5,8,13,0.9)]";
  const tool = toolCalls[toolIndex];

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 data-[ready]:opacity-100 max-sm:hidden"
    >
      <svg className="absolute inset-0 size-full overflow-visible">
        <polyline ref={lineA} fill="none" stroke="rgb(237 242 247 / 0.32)" strokeWidth={1} />
        <circle ref={ringA} r={4} fill="#05080d" stroke="rgb(237 242 247 / 0.75)" strokeWidth={1.2} />
        <polyline ref={lineB} fill="none" stroke="rgb(237 242 247 / 0.32)" strokeWidth={1} className="max-lg:hidden" />
        <circle ref={ringB} r={4} fill="#05080d" stroke="rgb(237 242 247 / 0.75)" strokeWidth={1.2} className="max-lg:hidden" />
      </svg>

      <div ref={labelA} className={`absolute left-0 top-0 whitespace-nowrap ${shadow}`}>
        <p className="text-[0.6875rem] tabular-nums tracking-[0.01em] text-muted">
          Agent run <span className="text-faint">·</span> step {agentIndex + 1} of {agentSteps.length}
        </p>
        <p className="mt-1 text-[0.8125rem] font-medium text-fg">{agentSteps[agentIndex]}</p>
      </div>

      <div ref={labelB} className={`absolute left-0 top-0 whitespace-nowrap max-lg:hidden ${shadow}`}>
        <p className="text-[0.6875rem] tracking-[0.01em] text-muted">
          MCP <span className="text-faint">·</span> crm-tools
        </p>
        <p className="type-code mt-1 text-[0.75rem]">
          <span className="text-fg-2">{tool.call}</span>
          <span className="text-faint"> → </span>
          <span className="text-mint">{tool.result}</span>
        </p>
      </div>
    </div>
  );
}
