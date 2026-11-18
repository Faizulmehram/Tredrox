"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { ArrowUpRight } from "lucide-react";
import { navItems } from "@/config/site";
import { Mark } from "@/components/brand/Wordmark";
import { cn } from "@/lib/cn";
import { HomeLink, handleHomeClick } from "./HomeLink";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

/** Names for the breadcrumb, including sections that have no nav item. */
const sectionNames: Record<string, string> = {
  ...Object.fromEntries(navItems.map((item) => [item.id, item.label])),
  why: "Why Tredrox",
  stack: "Technology",
  faq: "Questions",
};

/**
 * The section under the reading line (45% down the screen). Every section on
 * the page is watched, so sections without a nav item clear the link
 * highlight while the breadcrumb still names them.
 */
function useActiveSection() {
  // Empty until the observer reports, so pages without sections highlight nothing.
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("main > section[id]"));
    if (sections.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -54% 0px", threshold: 0 },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return active;
}

/**
 * A plain, exact bar on the page grid: wordmark with a breadcrumb that names
 * the section you are reading, text links with a drawn underline, and one
 * flat action. Transparent over the hero; a solid ground and a single
 * hairline once the page scrolls. No glass, no glow.
 */
export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useActiveSection();
  const pathname = usePathname();
  const reduce = usePrefersReducedMotion();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const crumb = active && active !== "home" ? sectionNames[active] : null;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    firstLinkRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    const onResize = () => {
      if (window.innerWidth >= 1024) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      root.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-300 ease-out",
          scrolled || open ? "border-line bg-ground/[0.92] backdrop-blur-md" : "border-transparent bg-transparent",
        )}
      >
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-[60] focus:rounded-md focus:bg-fg focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-ground"
        >
          Skip to content
        </a>

        <div className="wrap flex h-16 items-center justify-between gap-6">
          {/* Wordmark and breadcrumb */}
          <div className="flex min-w-0 items-center">
            <HomeLink
              className="flex shrink-0 items-center gap-2.5 rounded-md"
              aria-label="Tredrox Systems, back to top"
              onNavigate={() => setOpen(false)}
            >
              <Mark className="size-[22px] text-fg" />
              <span className="text-[1.0625rem] font-semibold tracking-[-0.025em] text-fg">Tredrox</span>
            </HomeLink>
            <span aria-live="polite" className="relative ml-3 hidden h-5 min-w-[9rem] overflow-hidden text-[0.875rem] xl:block">
              <AnimatePresence mode="popLayout" initial={false}>
                {crumb ? (
                  <motion.span
                    key={crumb}
                    className="absolute inset-y-0 left-0 flex items-center gap-3 whitespace-nowrap text-muted"
                    initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
                    animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
                    exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10 }}
                    transition={{ duration: 0.28, ease: EASE_OUT }}
                  >
                    <span aria-hidden className="text-faint">
                      /
                    </span>
                    {crumb}
                  </motion.span>
                ) : null}
              </AnimatePresence>
            </span>
          </div>

          {/* Primary links */}
          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-7 xl:gap-8">
              {navItems.map((item) => {
                const isActive = active === item.id;
                return (
                  <li key={item.id} className="relative">
                    <Link
                      href={item.href}
                      aria-current={isActive ? "true" : undefined}
                      onClick={item.id === "home" ? (event) => handleHomeClick(event, pathname) : undefined}
                      className={cn(
                        "group/link relative block whitespace-nowrap py-2 text-[0.875rem] tracking-[-0.005em] transition-colors duration-200",
                        isActive ? "text-fg" : "text-muted hover:text-fg",
                      )}
                    >
                      {item.label}
                      {/* Hover underline draws from the left. */}
                      <span
                        aria-hidden
                        className="absolute inset-x-0 bottom-1 h-px origin-left scale-x-0 bg-fg/40 transition-transform duration-300 ease-out group-hover/link:scale-x-100"
                      />
                    </Link>
                    {isActive ? (
                      <motion.span
                        layoutId="nav-active"
                        aria-hidden
                        className="absolute inset-x-0 bottom-1 h-px bg-fg"
                        transition={reduce ? { duration: 0 } : { duration: 0.35, ease: EASE_OUT }}
                      />
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Action */}
          <div className="flex items-center gap-3">
            <Link
              href="/#contact"
              className="group/cta inline-flex h-9 items-center gap-1.5 rounded-lg bg-cobalt px-3.5 text-[0.875rem] shadow-[0_1px_0_0_rgb(255_255_255/0.22)_inset] font-medium text-white transition-[background-color,transform] duration-200 ease-out hover:bg-[#3a70ff] active:scale-[0.97] max-sm:hidden"
            >
              Start a Project
              <ArrowUpRight
                aria-hidden
                className="size-4 transition-transform duration-200 ease-out group-hover/cta:-translate-y-px group-hover/cta:translate-x-px"
              />
            </Link>
            <button
              ref={menuButtonRef}
              type="button"
              className="relative inline-flex size-9 items-center justify-center rounded-lg border border-line-strong transition-colors duration-200 hover:bg-white/[0.05] lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((value) => !value)}
            >
              <span aria-hidden className="relative block h-3 w-4">
                <span
                  className={cn(
                    "absolute left-0 top-0 h-[1.5px] w-4 rounded-full bg-fg transition-transform duration-300 ease-out",
                    open && "translate-y-[5.25px] rotate-45",
                  )}
                />
                <span
                  className={cn(
                    "absolute bottom-0 left-0 h-[1.5px] w-4 rounded-full bg-fg transition-transform duration-300 ease-out",
                    open && "-translate-y-[5.25px] -rotate-45",
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Outside the header: a backdrop-filter there would trap this fixed panel inside the bar. */}
      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-menu"
            key="mobile-menu"
            className="fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto bg-ground lg:hidden"
            initial={reduce ? { opacity: 0 } : { opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, clipPath: "inset(0 0 0% 0)" }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.38, ease: [0.32, 0.72, 0, 1] }}
          >
            <nav aria-label="Mobile" className="wrap flex min-h-full flex-col justify-between gap-10 pb-10 pt-4">
              <ul className="flex flex-col">
                {navItems.map((item, index) => (
                  <li key={item.id} className="border-b border-line">
                    <Link
                      ref={index === 0 ? firstLinkRef : undefined}
                      href={item.href}
                      onClick={(event) => {
                        setOpen(false);
                        if (item.id === "home") handleHomeClick(event, pathname);
                      }}
                      aria-current={active === item.id ? "true" : undefined}
                      className={cn(
                        "flex items-center justify-between py-4 text-[1.75rem] font-medium tracking-[-0.03em]",
                        active === item.id ? "text-fg" : "text-fg-2",
                      )}
                    >
                      {item.label}
                      <ArrowUpRight
                        aria-hidden
                        className={cn("size-5", active === item.id ? "text-fg" : "text-faint")}
                      />
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href="/#contact"
                onClick={() => setOpen(false)}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-cobalt font-medium text-white transition-[background-color,transform] duration-200 ease-out hover:bg-[#3a70ff] active:scale-[0.98]"
              >
                Start a Project
                <ArrowUpRight aria-hidden className="size-4" />
              </Link>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
