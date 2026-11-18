import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Section heading. A heading made of two sentences sets the second in the
 * muted tone: contrast from tone, never gradient text.
 */
export function SectionHeading({
  id,
  title,
  muted,
  intro,
  className,
  titleClassName,
}: {
  id: string;
  title: string;
  muted?: string;
  intro?: ReactNode;
  className?: string;
  titleClassName?: string;
}) {
  return (
    <div className={className}>
      <h2 id={id} data-reveal="heading" className={cn("type-h2 text-fg", titleClassName)}>
        {title}
        {muted ? (
          <>
            {" "}
            <span className="text-faint">{muted}</span>
          </>
        ) : null}
      </h2>
      {intro ? (
        <div data-reveal style={{ ["--i" as string]: 2 }} className="type-lead mt-6 max-w-[38rem]">
          {intro}
        </div>
      ) : null}
    </div>
  );
}
