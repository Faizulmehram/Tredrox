import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

/**
 * The visitor's reduced-motion preference, hydration-safe: the server and the
 * first client render both read `false`, then React re-renders with the real
 * value. (Reading the media query during the first client render, as some
 * hooks do, makes server and client HTML differ.)
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
