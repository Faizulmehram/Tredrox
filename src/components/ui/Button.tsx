import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const base =
  "group/btn relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium tracking-[-0.01em] " +
  "transition-[transform,background-color,border-color,color,box-shadow] duration-200 ease-out active:scale-[0.97] active:duration-100 " +
  "disabled:pointer-events-none disabled:opacity-60 focus-visible:outline-offset-4";

const variants: Record<Variant, string> = {
  primary:
    "bg-cobalt text-white shadow-[0_1px_0_0_rgb(255_255_255/0.22)_inset,0_1px_2px_rgb(0_0_0/0.4)] " +
    "hover:bg-[#3a70ff]",
  secondary:
    "border border-line-strong bg-white/[0.03] text-fg backdrop-blur-sm hover:border-white/25 hover:bg-white/[0.07]",
  ghost: "text-fg-2 hover:text-fg",
};

const sizes: Record<Size, string> = {
  md: "h-10 px-4.5 text-[0.9375rem]",
  lg: "h-12 px-6 text-base",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
  children: ReactNode;
  className?: string;
};

function Arrow() {
  return (
    <ArrowUpRight
      aria-hidden
      className="size-[1.05em] transition-transform duration-200 ease-out group-hover/btn:-translate-y-px group-hover/btn:translate-x-px"
      strokeWidth={2}
    />
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  arrow,
  className,
  children,
  ...props
}: CommonProps & Omit<ComponentProps<typeof Link>, "className" | "children">) {
  return (
    <Link className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
      {arrow ? <Arrow /> : null}
    </Link>
  );
}

export function Button({
  variant = "primary",
  size = "md",
  arrow,
  className,
  children,
  type = "button",
  ...props
}: CommonProps & Omit<ComponentProps<"button">, "className" | "children">) {
  return (
    <button type={type} className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
      {arrow ? <Arrow /> : null}
    </button>
  );
}
