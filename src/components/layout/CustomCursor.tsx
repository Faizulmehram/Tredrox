"use client";

import { useEffect, useRef } from "react";

const INTERACTIVE = 'a, button, [role="button"], [role="tab"], [role="option"], summary, label, select, [data-cursor="hover"]';
const TEXT_ENTRY =
  'input:not([type="checkbox"]):not([type="radio"]):not([type="submit"]):not([type="button"]), textarea, [contenteditable="true"]';

/**
 * A precise pointer: a dot that tracks the mouse exactly and a thin ring that
 * follows on a short lag. Over anything clickable the ring opens and the dot
 * steps aside; pressing tightens the ring; over text fields both hide so the
 * native caret takes over. Mouse only (never touch or pen), and off entirely
 * under reduced motion. Positions are written straight to the DOM in one
 * rAF loop that stops as soon as the ring settles.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduce.matches) return;

    const root = document.documentElement;
    root.classList.add("has-cursor");

    let x = -100;
    let y = -100;
    let rx = x;
    let ry = y;
    let frame = 0;
    let shown = false;

    const place = () => {
      dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
    };

    const loop = () => {
      rx += (x - rx) * 0.22;
      ry += (y - ry) * 0.22;
      place();
      frame = Math.abs(x - rx) > 0.1 || Math.abs(y - ry) > 0.1 ? requestAnimationFrame(loop) : 0;
    };

    const setState = (target: EventTarget | null) => {
      const el = target instanceof Element ? target : null;
      const state = el?.closest(TEXT_ENTRY) ? "text" : el?.closest(INTERACTIVE) ? "link" : "";
      if (ring.dataset.state !== state) {
        ring.dataset.state = state;
        dot.dataset.state = state;
      }
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      x = event.clientX;
      y = event.clientY;
      if (!shown) {
        rx = x;
        ry = y;
        shown = true;
        root.dataset.cursor = "on";
      }
      setState(event.target);
      if (!frame) frame = requestAnimationFrame(loop);
    };
    const onDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse") ring.dataset.press = "";
    };
    const onUp = () => {
      delete ring.dataset.press;
    };
    const onLeave = (event: PointerEvent) => {
      if (event.relatedTarget) return;
      shown = false;
      root.dataset.cursor = "off";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("pointerout", onLeave);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerout", onLeave);
      root.classList.remove("has-cursor");
      delete root.dataset.cursor;
    };
  }, []);

  return (
    <>
      <div ref={ringRef} aria-hidden className="cursor-ring">
        <span />
      </div>
      <div ref={dotRef} aria-hidden className="cursor-dot">
        <span />
      </div>
    </>
  );
}
