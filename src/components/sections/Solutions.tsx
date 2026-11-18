"use client";

import { useRef, useState, type CSSProperties, type ReactNode } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { solutionLayers, type SolutionLayer } from "@/content/solutions";
import { cn } from "@/lib/cn";

/*
  What we build, told as one product stack. On desktop the section holds the
  stack on screen while it scrolls: the plates come apart and each layer in
  turn names the products that live there. Phones, tablets and reduced motion
  get the same stack, already apart, with every layer listed.
*/

export function Solutions() {
  const reduce = usePrefersReducedMotion();
  return (
    <section id="solutions" aria-labelledby="solutions-title" className="relative">
      {reduce ? null : <PinnedSolutions />}
      <StaticSolutions className={reduce ? "" : "lg:hidden"} />
    </section>
  );
}

function Heading() {
  return (
    <>
      <h2 id="solutions-title" data-reveal="heading" className="type-h2 text-fg">
        What we build, layer by layer.
      </h2>
      <p data-reveal style={{ ["--i" as string]: 2 }} className="type-lead mt-6 max-w-[30rem]">
        Most products we ship combine four layers. Some projects need one of them, some need all four, built to
        work as one system.
      </p>
    </>
  );
}

/* Desktop, pinned ---------------------------------------------------------- */

function PinnedSolutions() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [active, setActive] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const next = Math.min(solutionLayers.length - 1, Math.max(0, Math.floor(value * solutionLayers.length * 0.999)));
    setActive((current) => (current === next ? current : next));
  });

  return (
    <div ref={ref} className="relative hidden h-[260vh] lg:block">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(45%_55%_at_68%_52%,rgba(43,99,245,0.12),transparent_70%)]" />
        <div className="wrap grid grid-cols-12 items-center gap-10">
          <div className="col-span-5">
            <Heading />
            <ol className="mt-12 border-t border-line">
              {solutionLayers.map((layer, index) => (
                <LayerRow key={layer.id} layer={layer} index={index} active={index === active} />
              ))}
            </ol>
          </div>
          <div className="col-span-7 flex h-[min(78svh,680px)] items-center justify-center">
            <StackScene progress={scrollYProgress} active={active} plateWidth={400} />
          </div>
        </div>
      </div>
    </div>
  );
}

function LayerRow({ layer, index, active }: { layer: SolutionLayer; index: number; active: boolean }) {
  return (
    <li
      aria-current={active ? "step" : undefined}
      className={cn(
        "grid grid-cols-[2rem_1fr] gap-x-4 border-b border-line py-4 transition-opacity duration-300 ease-out",
        active ? "opacity-100" : "opacity-45",
      )}
    >
      <span className={cn("type-code pt-1", active ? "text-cobalt-bright" : "text-faint")}>
        L{index + 1}
      </span>
      <div>
        <p className="text-[0.8125rem] text-muted">{layer.layer}</p>
        <p className="mt-0.5 text-[1.125rem] font-medium leading-snug tracking-[-0.02em] text-fg">
          {layer.products.join(" · ")}
        </p>
        <div
          className={cn(
            "grid transition-[grid-template-rows,opacity] duration-300 ease-out",
            active ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
          )}
        >
          <p className="overflow-hidden text-[0.9375rem] leading-relaxed text-fg-2">
            <span className="block pt-2">{layer.description}</span>
          </p>
        </div>
      </div>
    </li>
  );
}

/* Phones, tablets, reduced motion ------------------------------------------ */

function StaticSolutions({ className }: { className?: string }) {
  return (
    <div className={cn("py-28", className)}>
      <div className="wrap grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Heading />
        </div>
        <div className="flex justify-center overflow-x-clip lg:col-span-7">
          <div className="flex h-[min(96vw,460px)] w-full items-center justify-center">
            <StackScene active={-1} plateWidth={220} still />
          </div>
        </div>
        <ol className="grid grid-cols-1 gap-x-10 border-t border-line sm:grid-cols-2 lg:col-span-12 lg:grid-cols-4">
          {solutionLayers.map((layer, index) => (
            <li key={layer.id} className="border-b border-line py-5 sm:pr-4">
              <span className="type-code text-cobalt-bright">L{index + 1}</span>
              <p className="mt-2 text-[0.8125rem] text-muted">{layer.layer}</p>
              <p className="mt-0.5 text-[1.0625rem] font-medium leading-snug tracking-[-0.02em] text-fg">
                {layer.products.join(" · ")}
              </p>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-fg-2">{layer.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/* The stack ----------------------------------------------------------------- */

function StackScene({
  progress,
  active,
  plateWidth,
  still,
}: {
  progress?: MotionValue<number>;
  active: number;
  plateWidth: number;
  still?: boolean;
}) {
  const height = plateWidth * 0.66;
  return (
    <div
      aria-hidden
      className="relative [perspective:1800px]"
      style={{ width: plateWidth * 1.45, height: plateWidth * 1.45 } as CSSProperties}
    >
      <div className="absolute inset-0 [transform-style:preserve-3d] [transform:rotateX(57deg)_rotateZ(-38deg)]">
        {solutionLayers.map((layer, index) => (
          <Plate
            key={layer.id}
            index={index}
            total={solutionLayers.length}
            progress={progress}
            still={still}
            active={active === index}
            dim={active >= 0 && active !== index}
            width={plateWidth}
            height={height}
            label={layer.layer}
          >
            <PlateArt id={layer.id} />
          </Plate>
        ))}
      </div>
    </div>
  );
}

function Plate({
  index,
  total,
  progress,
  still,
  active,
  dim,
  width,
  height,
  label,
  children,
}: {
  index: number;
  total: number;
  progress?: MotionValue<number>;
  still?: boolean;
  active: boolean;
  dim: boolean;
  width: number;
  height: number;
  label: string;
  children: ReactNode;
}) {
  // Plate 0 is the top layer. Collapsed: 14px apart. Exploded: ~0.32 * width apart.
  const fromTop = index - (total - 1) / 2;
  const collapsed = -fromTop * 14;
  const exploded = -fromTop * width * 0.32;
  const fallback = useTransform(() => exploded);
  const z = useTransform(progress ?? fallback, (p) => {
    if (still || !progress) return exploded;
    const t = Math.min(1, p / 0.35);
    const eased = 1 - Math.pow(1 - t, 3);
    return collapsed + (exploded - collapsed) * eased;
  });
  const transform = useTransform(z, (value) => `translate(-50%, -50%) translateZ(${value}px)`);

  return (
    <motion.div
      className={cn(
        "absolute left-1/2 top-1/2 rounded-[18px] border transition-[border-color,opacity,box-shadow] duration-300 ease-out",
        active
          ? "border-cobalt-bright/80 shadow-[0_0_0_1px_rgba(77,134,255,0.35),0_40px_80px_-30px_rgba(43,99,245,0.55)]"
          : "border-white/14",
        dim ? "opacity-55" : "opacity-100",
      )}
      style={{
        width,
        height,
        transform,
        background:
          "linear-gradient(140deg, rgba(38,52,78,0.97), rgba(16,24,36,0.97) 38%, rgba(11,17,25,0.98))",
      }}
    >
      <span className="absolute left-4 top-3 text-[11px] font-medium tracking-[0.02em] text-cobalt-soft">{label}</span>
      <div className="absolute inset-x-4 bottom-4 top-9">{children}</div>
    </motion.div>
  );
}

/* Real micro-content drawn on each plate. Decorative (the list carries the words), but never skeleton bars. */
function PlateArt({ id }: { id: SolutionLayer["id"] }) {
  const surface = "rounded-md border border-white/[0.08] bg-white/[0.04]";
  if (id === "interface") {
    const rows = [
      { order: "#4821", items: "3 items", status: "Shipped", live: true },
      { order: "#4822", items: "1 item", status: "Packing" },
      { order: "#4823", items: "5 items", status: "Paid" },
    ];
    return (
      <div className="flex h-full flex-col gap-1.5 text-[9px] leading-none">
        <div className="flex items-center justify-between">
          <div className="flex gap-2 text-white/45">
            <span className="text-white/90">Orders</span>
            <span>Customers</span>
            <span>Reports</span>
          </div>
          <span className="rounded bg-cobalt px-1.5 py-1 text-white">New order</span>
        </div>
        <div className={cn(surface, "flex flex-1 flex-col justify-around px-2")}>
          {rows.map((row) => (
            <div key={row.order} className="flex items-center justify-between text-white/70">
              <span className="text-white/90">{row.order}</span>
              <span>{row.items}</span>
              <span className={cn("rounded-full px-1.5 py-0.5", row.live ? "bg-mint/15 text-mint" : "bg-white/10")}>
                {row.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (id === "intelligence") {
    return (
      <div className="flex h-full flex-col justify-center gap-1.5 text-[9px] leading-snug">
        <div className="ml-auto rounded-lg rounded-br-sm bg-cobalt px-2 py-1 text-white">Which invoices are overdue?</div>
        <div className={cn(surface, "w-[82%] rounded-lg rounded-bl-sm px-2 py-1.5 text-white/80")}>
          Three, all due before Friday. I can send reminders now.
          <span className="mt-1 block text-cobalt-soft">Source: billing database</span>
        </div>
        <div className="flex gap-1.5">
          <span className="rounded-full border border-cobalt-bright/60 px-1.5 py-0.5 text-cobalt-soft">Send reminders</span>
          <span className="rounded-full border border-white/15 px-1.5 py-0.5 text-white/50">Show list</span>
        </div>
      </div>
    );
  }
  if (id === "workflow") {
    const steps = [
      { label: "Invoice in", state: "done" },
      { label: "Extract", state: "done" },
      { label: "Approve", state: "running" },
      { label: "Post to ERP", state: "queued" },
    ];
    return (
      <div className="flex h-full items-center gap-1 text-[9px] leading-tight">
        {steps.map((step, i) => (
          <div key={step.label} className="flex flex-1 items-center gap-1">
            <div
              className={cn(
                "flex h-12 flex-1 flex-col justify-center rounded-md border px-1.5",
                step.state === "done" && "border-white/15 bg-white/[0.05] text-white/80",
                step.state === "running" && "border-cobalt-bright/70 bg-cobalt/20 text-white",
                step.state === "queued" && "border-white/10 text-white/40",
              )}
            >
              <span>{step.label}</span>
              <span className={cn("mt-1", step.state === "running" ? "text-mint" : "text-white/40")}>
                {step.state === "done" ? "Done" : step.state === "running" ? "Running" : "Queued"}
              </span>
            </div>
            {i < steps.length - 1 ? <div className="h-px w-1.5 bg-white/30" /> : null}
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="grid h-full grid-cols-3 grid-rows-2 gap-1.5 text-[9px]">
      {["CRM", "ERP", "Payments", "Email", "Warehouse", "Sign-in"].map((name, i) => (
        <div
          key={name}
          className={cn(
            "flex flex-col items-center justify-center gap-1 rounded-md border",
            i === 2 ? "border-cobalt-bright/60 bg-cobalt/15 text-cobalt-soft" : "border-white/12 bg-white/[0.05] text-white/70",
          )}
        >
          <span className="font-medium">{name}</span>
          <span className="flex items-center gap-1 text-white/40">
            <span className={cn("size-1 rounded-full", i === 2 ? "bg-mint" : "bg-white/40")} />
            {i === 2 ? "Syncing" : "Connected"}
          </span>
        </div>
      ))}
    </div>
  );
}
