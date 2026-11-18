"use client";

import { useRef, type ReactNode } from "react";
import { motion, useSpring } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

/**
 * Pulls its child a few pixels toward the pointer. Decorative, so it only runs
 * for a fine pointer and never under reduced motion. Spring keeps it
 * interruptible as the pointer moves in and out.
 */
export function Magnetic({ children, strength = 0.22 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();
  const x = useSpring(0, { stiffness: 220, damping: 18, mass: 0.6 });
  const y = useSpring(0, { stiffness: 220, damping: 18, mass: 0.6 });

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (reduce || event.pointerType !== "mouse" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((event.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((event.clientY - (rect.top + rect.height / 2)) * strength);
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      className="inline-flex"
      style={{ x, y }}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
    >
      {children}
    </motion.div>
  );
}
