"use client";

import { useState } from "react";
import { Pause, Play } from "lucide-react";
import { marqueeTech } from "@/content/stack";
import { TechMono } from "@/components/ui/TechIcon";
import { cn } from "@/lib/cn";

/**
 * The technology strip. Moves slowly, stops on hover, and has a pause control
 * (anything that moves longer than five seconds needs one). Under reduced
 * motion it is a static, wrapping row.
 */
export function TechMarquee() {
  const [paused, setPaused] = useState(false);

  const row = (hidden: boolean) => (
    <ul
      aria-hidden={hidden || undefined}
      className="flex shrink-0 items-center gap-x-10 pr-10 motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-4 motion-reduce:pr-0 sm:gap-x-14 sm:pr-14"
    >
      {marqueeTech.map((tech) => (
        <li
          key={tech.id}
          className="flex items-center gap-2.5 text-muted transition-colors duration-200 hover:text-fg"
        >
          <TechMono tech={tech} size={20} />
          <span className="text-[0.9375rem] font-medium tracking-[-0.01em]">{tech.name}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="flex items-center gap-6">
      <div
        className="group/marquee relative min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)] motion-reduce:[mask-image:none]"
      >
        <h2 className="sr-only">Technologies we build with</h2>
        <div
          className={cn(
            "flex w-max animate-marquee group-hover/marquee:[animation-play-state:paused] motion-reduce:w-full motion-reduce:animate-none",
            paused && "[animation-play-state:paused]",
          )}
        >
          {row(false)}
          <div className="contents motion-reduce:hidden">{row(true)}</div>
        </div>
      </div>
      <button
        type="button"
        onClick={() => setPaused((value) => !value)}
        aria-pressed={paused}
        aria-label={paused ? "Play technology strip" : "Pause technology strip"}
        className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-line text-muted transition-colors duration-200 hover:border-line-strong hover:text-fg motion-reduce:hidden"
      >
        {paused ? <Play aria-hidden className="size-3.5" /> : <Pause aria-hidden className="size-3.5" />}
      </button>
    </div>
  );
}
