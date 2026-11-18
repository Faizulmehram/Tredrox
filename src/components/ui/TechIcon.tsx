/* eslint-disable @next/next/no-img-element -- small local SVG logos; next/image adds nothing for vector files. */
import type { Tech } from "@/content/stack";
import { cn } from "@/lib/cn";

/** A technology's real logo in its own colours (CC0 artwork, see /public/icons/tech/icons-credits.json). */
export function TechLogo({ tech, size = 28, className }: { tech: Tech; size?: number; className?: string }) {
  return (
    <img
      src={`/icons/tech/${tech.icon}.svg`}
      alt=""
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      className={cn("object-contain", tech.ink && "invert", className)}
      style={{ width: size, height: size }}
    />
  );
}

/** A one-colour logo drawn in the current text colour (via CSS mask). */
export function TechMono({ tech, size = 22, className }: { tech: Tech; size?: number; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("inline-block shrink-0 bg-current", className)}
      style={{
        width: size,
        height: size,
        maskImage: `url(/icons/tech-mono/${tech.icon}.svg)`,
        WebkitMaskImage: `url(/icons/tech-mono/${tech.icon}.svg)`,
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
        maskSize: "contain",
        WebkitMaskSize: "contain",
      }}
    />
  );
}
