"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";

/** Scroll to the top of the home page instead of following "/#home" (see HomeLink). */
export function handleHomeClick(event: MouseEvent<HTMLAnchorElement>, pathname: string) {
  if (pathname !== "/") return;
  event.preventDefault();
  // An open phone menu locks page scroll; release it before scrolling.
  document.documentElement.style.overflow = "";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  window.history.replaceState(null, "", "/");
  if (event.detail > 0) event.currentTarget.blur();
}

/**
 * A link back to the top of the home page. On the home page it scrolls to the
 * top itself (a hash link to "#home" does nothing once the address already
 * ends in #home), cleans the hash out of the address bar, and drops the focus
 * ring after a mouse click (keyboard focus keeps it). Elsewhere it navigates
 * home normally.
 */
export function HomeLink({
  children,
  className,
  onNavigate,
  ...props
}: {
  children: ReactNode;
  className?: string;
  onNavigate?: () => void;
  "aria-label"?: string;
  "aria-current"?: "true" | undefined;
}) {
  const pathname = usePathname();

  return (
    <Link
      href="/#home"
      className={className}
      {...props}
      onClick={(event) => {
        onNavigate?.();
        handleHomeClick(event, pathname);
      }}
    >
      {children}
    </Link>
  );
}
