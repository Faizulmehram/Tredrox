import { cn } from "@/lib/cn";

/**
 * The Tredrox mark: a T built from stacked plates. The wide top plate is the
 * platform; the narrow plates beneath are the layers that carry it. The hero's
 * glass object is the same form in 3D.
 */
export function Mark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("shrink-0", className)}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <defs>
        <linearGradient id="tdx-top" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#9bbaff" />
          <stop offset="1" stopColor="#2b63f5" />
        </linearGradient>
      </defs>
      <rect x="2" y="3" width="20" height="5.5" rx="1.6" fill="url(#tdx-top)" />
      <rect x="8.25" y="10.25" width="7.5" height="4.5" rx="1.3" fill="currentColor" opacity="0.92" />
      <rect x="8.25" y="16.5" width="7.5" height="4.5" rx="1.3" fill="currentColor" opacity="0.5" />
    </svg>
  );
}

export function Wordmark({ className, markClassName }: { className?: string; markClassName?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 text-fg", className)}>
      <Mark className={cn("size-6", markClassName)} />
      <span className="text-[1.0625rem] font-semibold tracking-[-0.02em]">Tredrox</span>
    </span>
  );
}
