"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronDown } from "lucide-react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { cn } from "@/lib/cn";

export type SelectOption = { value: string; label: string };

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

/**
 * A select drawn in the site's own material (the native popup is painted by
 * the operating system and cannot be styled). A button opens a listbox:
 * arrow keys, Home/End, Enter/Space to choose, Escape to close, letters to
 * jump; clicking outside closes it. ARIA: button + listbox + options.
 */
export function Select({
  id,
  name,
  value,
  options,
  placeholder,
  onChange,
  onBlur,
  className,
  ...aria
}: {
  id: string;
  name: string;
  value: string;
  options: readonly SelectOption[];
  placeholder: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  className?: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
  "aria-required"?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const typeahead = useRef({ text: "", timer: 0 });
  const reduce = usePrefersReducedMotion();
  const listId = useId();
  const selected = options.find((option) => option.value === value);

  function openList(index?: number) {
    const current = options.findIndex((option) => option.value === value);
    setActive(index ?? (current >= 0 ? current : 0));
    setOpen(true);
  }

  function close(focusButton = true) {
    setOpen(false);
    if (focusButton) buttonRef.current?.focus();
  }

  function choose(index: number) {
    const option = options[index];
    if (!option) return;
    onChange(option.value);
    close();
  }

  // Focus the list when it opens, keep the active option in view.
  useEffect(() => {
    if (open) listRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  // Clicking anywhere else closes it.
  useEffect(() => {
    if (!open) return;
    const onDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) close(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  function jumpTo(key: string) {
    const state = typeahead.current;
    window.clearTimeout(state.timer);
    state.text += key.toLowerCase();
    state.timer = window.setTimeout(() => (state.text = ""), 600);
    const start = open ? active + 1 : 0;
    const ordered = [...options.slice(start), ...options.slice(0, start)];
    const match = ordered.find((option) => option.label.toLowerCase().startsWith(state.text));
    return match ? options.indexOf(match) : -1;
  }

  function onButtonKey(event: KeyboardEvent<HTMLButtonElement>) {
    if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
      event.preventDefault();
      openList(event.key === "ArrowUp" ? options.length - 1 : undefined);
    } else if (event.key.length === 1 && /\S/.test(event.key)) {
      const index = jumpTo(event.key);
      if (index >= 0) onChange(options[index].value);
    }
  }

  function onListKey(event: KeyboardEvent<HTMLUListElement>) {
    const last = options.length - 1;
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActive((i) => Math.min(last, i + 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        setActive((i) => Math.max(0, i - 1));
        break;
      case "Home":
        event.preventDefault();
        setActive(0);
        break;
      case "End":
        event.preventDefault();
        setActive(last);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        choose(active);
        break;
      case "Escape":
        event.preventDefault();
        close();
        break;
      case "Tab":
        close(false);
        break;
      default:
        if (event.key.length === 1 && /\S/.test(event.key)) {
          const index = jumpTo(event.key);
          if (index >= 0) setActive(index);
        }
    }
  }

  return (
    <div
      ref={rootRef}
      className="relative"
      onBlur={(event) => {
        if (!rootRef.current?.contains(event.relatedTarget as Node)) {
          if (open) setOpen(false);
          onBlur?.();
        }
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        id={id}
        name={name}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        {...aria}
        onClick={() => (open ? close() : openList())}
        onKeyDown={onButtonKey}
        className={cn("flex items-center justify-between text-left", className, open && "border-cobalt-bright bg-white/[0.05]")}
      >
        <span className={cn("truncate", selected && selected.value !== "" ? "text-fg" : "text-faint")}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          aria-hidden
          className={cn("ml-3 size-4 shrink-0 text-muted transition-transform duration-200 ease-out", open && "rotate-180")}
        />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.ul
            ref={listRef}
            id={listId}
            role="listbox"
            tabIndex={-1}
            aria-labelledby={id}
            aria-activedescendant={`${listId}-${active}`}
            onKeyDown={onListKey}
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: -4 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.98, y: -2, transition: { duration: 0.12 } }}
            transition={{ duration: 0.18, ease: EASE_OUT }}
            style={{ transformOrigin: "top center" }}
            className="absolute left-0 right-0 top-[calc(100%+6px)] z-30 max-h-72 overflow-y-auto overscroll-contain rounded-xl border border-line-strong bg-[#0c131d] p-1.5 shadow-[0_24px_48px_-16px_rgba(0,0,0,0.85),0_0_0_1px_rgba(0,0,0,0.4)] outline-none"
          >
            {options.map((option, index) => {
              const isSelected = option.value === value;
              const isActive = index === active;
              return (
                <li
                  key={option.label}
                  id={`${listId}-${index}`}
                  data-index={index}
                  role="option"
                  aria-selected={isSelected}
                  onPointerMove={() => setActive(index)}
                  onClick={() => choose(index)}
                  className={cn(
                    "flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-[0.9375rem] transition-colors duration-100",
                    isActive ? "bg-white/[0.06] text-fg" : "text-fg-2",
                    option.value === "" && !isActive && "text-muted",
                  )}
                >
                  <span className="truncate">{option.label}</span>
                  {isSelected ? <Check aria-hidden className="size-4 shrink-0 text-cobalt-bright" strokeWidth={2.25} /> : null}
                </li>
              );
            })}
          </motion.ul>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
