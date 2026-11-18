"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import type { HeroSceneHandle } from "./heroScene";
import { HeroCallouts, type AnchorUpdate } from "./HeroCallouts";

function webglAvailable(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * The hero object. A CSS rendition of the stack paints with the page; the
 * WebGL glass version loads after the first paint and crossfades in.
 */
export function HeroVisual({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const anchorUpdate = useRef<AnchorUpdate | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas || !webglAvailable()) return;

    let handle: HeroSceneHandle | null = null;
    let cancelled = false;
    const reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const lowPower = window.matchMedia("(max-width: 767px)").matches || (navigator.hardwareConcurrency ?? 8) <= 4;

    const boot = async () => {
      const { createHeroScene } = await import("./heroScene");
      if (cancelled) return;
      handle = createHeroScene({
        canvas,
        container,
        still: reduceQuery.matches,
        lowPower,
        onFirstFrame: () => !cancelled && setReady(true),
        // Over the chip, the custom cursor treats the canvas as clickable.
        onAnchors: (points) => anchorUpdate.current?.(points),
        onHoverChange: (hovering) => {
          if (hovering) container.dataset.cursor = "hover";
          else delete container.dataset.cursor;
        },
      });
    };

    const hasIdle = typeof window.requestIdleCallback === "function";
    const idleId = hasIdle
      ? window.requestIdleCallback(() => void boot(), { timeout: 1200 })
      : window.setTimeout(() => void boot(), 200);
    const cancelIdle = (id: number) => (hasIdle ? window.cancelIdleCallback(id) : window.clearTimeout(id));

    const hero = container.closest("section") ?? container;

    const onPointerMove = (event: PointerEvent) => {
      if (!handle || event.pointerType !== "mouse") return;
      const rect = container.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
      const inside = x > -1 && x < 1 && y > -1 && y < 1;
      handle.setPointer(Math.max(-1, Math.min(1, x)), Math.max(-1, Math.min(1, y)), inside);
    };
    const onPointerLeave = () => handle?.setPointer(0, 0, false);
    // A click on the object sends a ripple and a burst of data.
    const onPointerDown = (event: PointerEvent) => {
      if (event.button === 0) handle?.pulse();
    };

    const onScroll = () => {
      if (!handle) return;
      const rect = hero.getBoundingClientRect();
      handle.setScroll(-rect.top / Math.max(rect.height, 1));
    };

    const visibility = new IntersectionObserver(([entry]) => handle?.setActive(entry.isIntersecting), {
      rootMargin: "80px 0px",
    });
    visibility.observe(container);

    hero.addEventListener("pointermove", onPointerMove as EventListener, { passive: true });
    hero.addEventListener("pointerleave", onPointerLeave);
    container.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelled = true;
      cancelIdle(idleId);
      visibility.disconnect();
      hero.removeEventListener("pointermove", onPointerMove as EventListener);
      hero.removeEventListener("pointerleave", onPointerLeave);
      container.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("scroll", onScroll);
      handle?.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Static rendition: paints immediately and stays when WebGL is unavailable. */}
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 flex items-center justify-center transition-opacity duration-700 ease-out",
          ready ? "opacity-0" : "opacity-100",
        )}
      >
        <StaticChip />
      </div>
      <canvas
        ref={canvasRef}
        aria-hidden
        className={cn(
          // The scene draws its own backdrop; the mask fades its edges into the page.
          "absolute inset-0 size-full transition-opacity duration-1000 ease-out [mask-image:radial-gradient(ellipse_50%_50%_at_50%_48%,#000_60%,transparent_100%)] lg:[mask-image:radial-gradient(ellipse_42%_56%_at_67%_48%,#000_62%,transparent_100%)]",
          ready ? "opacity-100" : "opacity-0",
        )}
      />
      <HeroCallouts updateRef={anchorUpdate} />
    </div>
  );
}

/** The processor drawn with CSS 3D transforms: board, package, die of cores. */
function StaticChip() {
  return (
    <div className="relative aspect-square w-[min(78%,520px)] lg:translate-x-[22%] lg:scale-[0.85]">
      <div className="absolute inset-[18%] rounded-full bg-[radial-gradient(closest-side,rgba(77,134,255,0.35),transparent)] blur-2xl" />
      <div className="absolute inset-0 [perspective:1600px]">
        <div className="absolute inset-0 [transform-style:preserve-3d] [transform:rotateX(50deg)_rotateZ(-45deg)]">
          <div className="absolute inset-[6%] rounded-[24px] bg-[radial-gradient(closest-side,rgba(78,118,210,0.18),transparent)]" />
          <div className="absolute inset-[30%] rounded-[14px] border border-white/15 bg-[#0c1424] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.9)] [transform:translateZ(18px)]">
            <div className="absolute inset-[14%] grid grid-cols-6 gap-[6%] rounded-md border border-cobalt-soft/50 bg-[#081226] p-[7%]">
              {Array.from({ length: 36 }, (_, i) => (
                <span
                  key={i}
                  className="rounded-[2px]"
                  style={{ background: `rgba(77,134,255,${[0.25, 0.7, 0.4, 0.9, 0.3, 0.55][i % 6]})` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
