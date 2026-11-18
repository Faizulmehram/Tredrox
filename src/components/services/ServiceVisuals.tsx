"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import {
  BookCheck,
  Check,
  Database,
  FileSearch,
  Loader2,
  Lock,
  Mail,
  Network,
  PenLine,
  Search,
  ShieldCheck,
} from "lucide-react";
import type { ServiceVisual } from "@/content/services";
import { cn } from "@/lib/cn";

/* eslint-disable @next/next/no-img-element -- local SVG logos */

/* Shared bits ------------------------------------------------------------ */

function Frame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("relative flex h-full w-full items-center justify-center p-5 sm:p-7", className)}>
      {children}
    </div>
  );
}

function Logo({ name, size = 16, invert }: { name: string; size?: number; invert?: boolean }) {
  return (
    <img
      src={`/icons/tech/${name}.svg`}
      alt=""
      width={size}
      height={size}
      className={cn("object-contain", invert && "invert")}
      style={{ width: size, height: size }}
    />
  );
}

const card = "rounded-xl border border-white/10 bg-[#0d141e]/90";

/* 01 Agents -------------------------------------------------------------- */

const agentLanes = [
  { name: "Supervisor", icon: Network },
  { name: "Researcher", icon: Search },
  { name: "Writer", icon: PenLine },
  { name: "Reviewer", icon: ShieldCheck },
];

const agentMessages = [
  { from: 0, to: 1, text: "Find 2025 pricing data" },
  { from: 1, to: 0, text: "3 sources, cited" },
  { from: 0, to: 2, text: "Draft the summary" },
  { from: 2, to: 3, text: "Check the figures" },
  { from: 3, to: 0, text: "Approved" },
];

const ROW_GAP = 34;

/**
 * A live agent-run trace: four swimlanes, and the hand-offs between agents
 * drawn one after another as a run progresses, then held and replayed. The
 * agent that just received work lights up. Steps only while on screen; under
 * reduced motion the finished run is shown still.
 */
function AgentsVisual() {
  const reduce = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (reduce || !el) return;
    let timer: number | undefined;
    // Steps 1..5 draw the messages; 6..7 hold the finished run; 0 clears it.
    const tick = () => setStep((s) => (s >= agentMessages.length + 2 ? 0 : s + 1));
    const observer = new IntersectionObserver(([entry]) => {
      window.clearInterval(timer);
      if (entry.isIntersecting) timer = window.setInterval(tick, 950);
    });
    observer.observe(el);
    return () => {
      window.clearInterval(timer);
      observer.disconnect();
    };
  }, [reduce]);

  const shown = reduce ? agentMessages.length : Math.min(step, agentMessages.length);
  const done = shown === agentMessages.length;
  const receiver = shown > 0 && !done ? agentMessages[shown - 1].to : -1;

  return (
    <Frame>
      <div ref={ref} className={cn(card, "w-full max-w-[520px] overflow-hidden")}>
        <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-2.5 text-[0.75rem]">
          <span className="text-fg-2">
            Agent run <span className="text-faint">· Market summary</span>
          </span>
          <span className="inline-flex items-center gap-1.5 text-muted">
            {done ? (
              <>
                <Check aria-hidden className="size-3.5 text-cobalt-bright" strokeWidth={2.5} /> Completed
              </>
            ) : (
              <>
                <span className="live-dot" /> Running
              </>
            )}
          </span>
        </div>

        <div className="px-2 pb-4 pt-3.5">
          <div className="grid grid-cols-4">
            {agentLanes.map((lane, i) => {
              const Icon = lane.icon;
              const lit = i === receiver || (done && i === 0);
              return (
                <div key={lane.name} className="flex flex-col items-center gap-1.5">
                  <span
                    className={cn(
                      "flex size-8 items-center justify-center rounded-lg border transition-[border-color,background-color,box-shadow,color] duration-300",
                      lit
                        ? "border-cobalt-bright/80 bg-cobalt/20 text-cobalt-soft shadow-[0_0_18px_-2px_rgba(43,99,245,0.7)]"
                        : "border-white/12 bg-white/[0.03] text-muted",
                    )}
                  >
                    <Icon aria-hidden className="size-4" strokeWidth={1.75} />
                  </span>
                  <span className={cn("text-[0.6875rem] transition-colors duration-300", lit ? "text-fg" : "text-muted")}>
                    {lane.name}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="relative mt-2" style={{ height: ROW_GAP * agentMessages.length + 14 }}>
            {/* Lifelines */}
            {agentLanes.map((lane, i) => (
              <span
                key={lane.name}
                aria-hidden
                className="absolute bottom-0 top-0 w-px bg-[repeating-linear-gradient(to_bottom,rgb(237_242_247/0.12)_0_3px,transparent_3px_7px)]"
                style={{ left: `${(i + 0.5) * 25}%` }}
              />
            ))}

            {/* Messages */}
            {agentMessages.map((message, i) => {
              const visible = i < shown;
              const left = Math.min(message.from, message.to);
              const span = Math.abs(message.to - message.from);
              const rightward = message.to > message.from;
              const last = i === agentMessages.length - 1;
              return (
                <div
                  key={message.text}
                  className="absolute h-px"
                  style={{ left: `${(left + 0.5) * 25}%`, width: `${span * 25}%`, top: 22 + i * ROW_GAP }}
                >
                  <span
                    className={cn(
                      "absolute inset-0 transition-transform duration-500 ease-out",
                      rightward ? "origin-left" : "origin-right",
                      last
                        ? "bg-gradient-to-r from-cobalt-bright to-cobalt-soft"
                        : rightward
                          ? "bg-gradient-to-r from-cobalt-bright/40 to-cobalt-bright"
                          : "bg-gradient-to-l from-cobalt-bright/40 to-cobalt-bright",
                    )}
                    style={{ transform: `scaleX(${visible ? 1 : 0})` }}
                  />
                  {/* Sender dot and arrowhead */}
                  <span
                    className={cn(
                      "absolute top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-cobalt-bright transition-opacity duration-300",
                      rightward ? "-left-[3px]" : "-right-[3px]",
                      visible ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <span
                    className={cn(
                      "absolute top-1/2 size-[7px] -translate-y-1/2 rotate-45 border-cobalt-soft transition-opacity duration-300",
                      rightward ? "-right-[1px] border-r-[1.5px] border-t-[1.5px]" : "-left-[1px] border-b-[1.5px] border-l-[1.5px]",
                      visible ? "opacity-100 delay-300" : "opacity-0",
                    )}
                  />
                  <span
                    className={cn(
                      "absolute bottom-1.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border px-1.5 py-0.5 text-[0.625rem] leading-none transition-[opacity,transform] duration-300",
                      last ? "border-cobalt-bright/50 bg-cobalt/20 text-fg" : "border-white/10 bg-[#0d1520] text-fg-2",
                      visible ? "translate-y-0 opacity-100 delay-200" : "translate-y-1 opacity-0",
                    )}
                  >
                    {message.text}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Frame>
  );
}

/* 02 LLM integration ----------------------------------------------------- */

function LlmVisual() {
  return (
    <Frame>
      <div className="grid w-full max-w-[520px] grid-cols-1 gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
        <div className={cn(card, "p-3.5")}>
          <p className="text-[0.6875rem] text-muted">Incoming email</p>
          <p className="mt-1.5 text-[0.8125rem] leading-snug text-fg-2">
            &ldquo;Can you move our delivery to Friday and add 20 more units to the order?&rdquo;
          </p>
        </div>
        <div className="flex items-center justify-center gap-1.5 sm:flex-col">
          <span className="rounded-full border border-cobalt-bright/50 bg-cobalt/15 p-1.5">
            <Logo name="claude" size={16} />
          </span>
          <span className="rounded-full border border-white/10 p-1.5 opacity-50">
            <Logo name="openai" size={16} invert />
          </span>
          <span className="rounded-full border border-white/10 p-1.5 opacity-50">
            <Logo name="gemini" size={16} />
          </span>
        </div>
        <pre className={cn(card, "type-code overflow-hidden p-3.5 text-fg-2")}>
          <span className="text-faint">{"{"}</span>
          {"\n  "}
          <span className="text-cobalt-soft">&quot;intent&quot;</span>: <span className="text-fg">&quot;change_order&quot;</span>,
          {"\n  "}
          <span className="text-cobalt-soft">&quot;delivery&quot;</span>: <span className="text-fg">&quot;friday&quot;</span>,
          {"\n  "}
          <span className="text-cobalt-soft">&quot;add_units&quot;</span>: <span className="text-fg">20</span>,
          {"\n  "}
          <span className="text-cobalt-soft">&quot;needs_review&quot;</span>: <span className="text-fg">false</span>
          {"\n"}
          <span className="text-faint">{"}"}</span>
        </pre>
      </div>
    </Frame>
  );
}

/* 03 Assistant ------------------------------------------------------------ */

function AssistantVisual() {
  return (
    <Frame>
      <div className="flex w-full max-w-[400px] flex-col gap-2.5">
        <div className="ml-auto max-w-[78%] rounded-2xl rounded-br-md bg-cobalt px-3.5 py-2 text-[0.8125rem] text-white">
          Where is my order 4821?
        </div>
        <div className={cn(card, "max-w-[88%] rounded-2xl rounded-bl-md px-3.5 py-2.5")}>
          <p className="text-[0.8125rem] leading-snug text-fg-2">
            It shipped yesterday and should arrive on Thursday. Shall I email you the tracking link?
          </p>
          <p className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-white/[0.05] px-2 py-1 text-[0.6875rem] text-muted">
            <Database aria-hidden className="size-3" /> From your orders database
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-cobalt-bright/50 px-3 py-1 text-[0.75rem] text-cobalt-soft">
            Email the tracking link
          </span>
          <span className="rounded-full border border-white/12 px-3 py-1 text-[0.75rem] text-muted">
            Talk to a person
          </span>
        </div>
        <div className="mt-1 flex items-center gap-1.5 pl-1" aria-hidden>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="loop size-1.5 rounded-full bg-muted motion-safe:animate-pulse"
              style={{ animationDelay: `${i * 180}ms` }}
            />
          ))}
        </div>
      </div>
    </Frame>
  );
}

/* 04 SaaS ---------------------------------------------------------------- */

function SaasVisual() {
  const rows = [
    { month: "November", amount: "Seats 18", status: "Paid" },
    { month: "October", amount: "Seats 16", status: "Paid" },
    { month: "September", amount: "Seats 12", status: "Paid" },
  ];
  return (
    <Frame>
      <div className={cn(card, "w-full max-w-[520px] overflow-hidden")}>
        <div className="flex items-center gap-2 border-b border-white/[0.08] px-3 py-2">
          <span className="flex gap-1">
            <span className="size-2 rounded-full bg-white/15" />
            <span className="size-2 rounded-full bg-white/15" />
            <span className="size-2 rounded-full bg-white/15" />
          </span>
          <span className="ml-2 flex-1 truncate rounded-md bg-white/[0.04] px-2 py-0.5 text-[0.6875rem] text-faint">
            app.yourproduct.com/settings/billing
          </span>
        </div>
        <div className="grid grid-cols-[7.5rem_1fr]">
          <ul className="space-y-1 border-r border-white/[0.06] p-2.5 text-[0.75rem] text-muted">
            {["Overview", "Projects", "Team", "Billing", "API keys"].map((item) => (
              <li
                key={item}
                className={cn("rounded-md px-2 py-1", item === "Billing" && "bg-white/[0.06] text-fg")}
              >
                {item}
              </li>
            ))}
          </ul>
          <div className="p-3.5">
            <div className="flex items-center justify-between">
              <p className="text-[0.8125rem] font-medium text-fg">Billing</p>
              <span className="rounded-md bg-cobalt px-2 py-0.5 text-[0.6875rem] text-white">Change plan</span>
            </div>
            <div className="mt-3 rounded-lg border border-white/[0.08] p-2.5">
              <p className="text-[0.6875rem] text-muted">Current plan</p>
              <p className="text-[0.8125rem] text-fg">Team, billed monthly</p>
            </div>
            <ul className="mt-3 divide-y divide-white/[0.06] text-[0.75rem]">
              {rows.map((row) => (
                <li key={row.month} className="flex items-center justify-between py-1.5">
                  <span className="text-fg-2">{row.month}</span>
                  <span className="text-muted">{row.amount}</span>
                  <span className="rounded-full bg-cobalt/15 px-2 py-0.5 text-[0.6875rem] text-cobalt-soft">{row.status}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Frame>
  );
}

/* 05 Automation ---------------------------------------------------------- */

const automationSteps = [
  { icon: Mail, label: "New invoice arrives by email" },
  { icon: FileSearch, label: "AI extracts supplier, lines and totals" },
  { icon: Search, label: "Matched to the purchase order" },
  { icon: ShieldCheck, label: "Approved automatically under the limit" },
  { icon: BookCheck, label: "Posted to accounting" },
];

function AutomationVisual() {
  const reduce = usePrefersReducedMotion();
  const [step, setStep] = useState(0);
  // Under reduced motion the run is shown finished instead of stepping through.
  const current = reduce ? automationSteps.length : step;

  useEffect(() => {
    if (reduce) return;
    const timer = window.setInterval(
      () => setStep((value) => (value >= automationSteps.length + 1 ? 0 : value + 1)),
      1100,
    );
    return () => window.clearInterval(timer);
  }, [reduce]);

  return (
    <Frame>
      <ol className="w-full max-w-[400px] space-y-2">
        {automationSteps.map((step, i) => {
          const Icon = step.icon;
          const done = i < current;
          const running = i === current;
          return (
            <li
              key={step.label}
              className={cn(
                card,
                "flex items-center gap-3 px-3 py-2.5 transition-[border-color,opacity] duration-300",
                running ? "border-cobalt-bright/60" : "",
                !done && !running ? "opacity-55" : "opacity-100",
              )}
            >
              <Icon aria-hidden className="size-4 shrink-0 text-cobalt-soft" strokeWidth={1.75} />
              <span className="flex-1 text-[0.8125rem] text-fg-2">{step.label}</span>
              <span className="flex size-5 items-center justify-center">
                {done ? (
                  <Check aria-hidden className="size-4 text-cobalt-bright" strokeWidth={2.25} />
                ) : running ? (
                  <Loader2 aria-hidden className="size-4 animate-spin text-mint" />
                ) : (
                  <span className="size-1.5 rounded-full bg-white/20" />
                )}
              </span>
            </li>
          );
        })}
      </ol>
    </Frame>
  );
}

/* 06 API & integrations -------------------------------------------------- */

function ApiVisual() {
  const endpoints = [
    { method: "POST", path: "/v1/orders", status: "201" },
    { method: "GET", path: "/v1/orders/{id}", status: "200" },
    { method: "POST", path: "/webhooks/payments", status: "200" },
  ];
  const connectors = [
    { name: "Payments", state: "Connected" },
    { name: "CRM", state: "Connected" },
    { name: "ERP", state: "Syncing" },
    { name: "Email", state: "Connected" },
  ];
  return (
    <Frame>
      <div className="w-full max-w-[460px] space-y-3">
        <ul className={cn(card, "type-code divide-y divide-white/[0.06]")}>
          {endpoints.map((e) => (
            <li key={e.path} className="flex items-center gap-3 px-3.5 py-2.5">
              <span className={cn("w-10 font-semibold", e.method === "GET" ? "text-fg" : "text-cobalt-soft")}>
                {e.method}
              </span>
              <span className="flex-1 truncate text-fg-2">{e.path}</span>
              <span className="text-faint">{e.status}</span>
            </li>
          ))}
        </ul>
        <ul className="grid grid-cols-2 gap-2">
          {connectors.map((c) => (
            <li key={c.name} className={cn(card, "flex items-center justify-between px-3 py-2 text-[0.75rem]")}>
              <span className="text-fg-2">{c.name}</span>
              <span className="inline-flex items-center gap-1.5 text-muted">
                <span className={cn("size-1.5 rounded-full", c.state === "Syncing" ? "bg-mint" : "bg-cobalt-bright")} />
                {c.state}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Frame>
  );
}

/* 07 MCP ----------------------------------------------------------------- */

function McpVisual() {
  const tools = [
    { name: "search_customers", args: "query", scope: "read" },
    { name: "get_invoice", args: "id", scope: "read" },
    { name: "create_ticket", args: "subject, body", scope: "write" },
  ];
  return (
    <Frame>
      <div className="grid w-full max-w-[520px] grid-cols-1 items-center gap-3 sm:grid-cols-[auto_1fr]">
        <div className={cn(card, "flex items-center gap-2.5 px-3.5 py-3 sm:flex-col sm:px-4 sm:py-4")}>
          <Logo name="claude" size={22} />
          <div className="sm:text-center">
            <p className="text-[0.8125rem] text-fg">AI client</p>
            <p className="text-[0.6875rem] text-muted">Claude or your agent</p>
          </div>
        </div>
        <div className={cn(card, "overflow-hidden")}>
          <div className="flex items-center justify-between border-b border-white/[0.08] px-3.5 py-2">
            <span className="type-code text-fg">crm-tools</span>
            <span className="inline-flex items-center gap-1.5 text-[0.6875rem] text-muted">
              <span className="live-dot" /> MCP server
            </span>
          </div>
          <ul className="type-code divide-y divide-white/[0.06]">
            {tools.map((tool) => (
              <li key={tool.name} className="flex items-center justify-between gap-2 px-3.5 py-2">
                <span className="truncate text-fg-2">
                  <span className="text-cobalt-soft">{tool.name}</span>
                  <span className="text-faint">({tool.args})</span>
                </span>
                <span
                  className={cn(
                    "rounded px-1.5 py-0.5 text-[0.625rem]",
                    tool.scope === "write" ? "bg-cobalt/20 text-cobalt-soft" : "bg-white/[0.06] text-muted",
                  )}
                >
                  {tool.scope}
                </span>
              </li>
            ))}
          </ul>
          <p className="flex items-center gap-1.5 border-t border-white/[0.08] px-3.5 py-2 text-[0.6875rem] text-muted">
            <Lock aria-hidden className="size-3" /> Write tools ask a person first
          </p>
        </div>
      </div>
    </Frame>
  );
}

/* 08 Backend ------------------------------------------------------------- */

function BackendVisual() {
  // Relations drawn as connectors into the gaps: organizations -> users,
  // organizations -> projects, projects -> events.
  const right = "after:absolute after:left-full after:top-1/2 after:h-px after:w-8 after:bg-cobalt-bright/55 sm:after:w-10";
  const down = "before:absolute before:left-1/2 before:top-full before:h-8 before:w-px before:bg-cobalt-bright/55 sm:before:h-10";
  const tables = [
    { name: "organizations", cols: ["id", "name", "plan"], links: cn(right, down) },
    { name: "users", cols: ["id", "org_id", "email"], links: "" },
    { name: "projects", cols: ["id", "org_id", "status"], links: right },
    { name: "events", cols: ["id", "project_id", "type"], links: "" },
  ];
  return (
    <Frame>
      <div className="relative w-full max-w-[460px]">
        <div className="relative grid grid-cols-2 gap-8 sm:gap-10">
          {tables.map((t) => (
            <div key={t.name} className={cn(card, "relative", t.links)}>
              <p className="type-code flex items-center justify-between rounded-t-xl border-b border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-fg">
                {t.name}
              </p>
              <ul className="type-code px-3 py-1.5 text-muted">
                {t.cols.map((col) => (
                  <li key={col} className={cn(col.endsWith("id") && col !== "id" && "text-cobalt-soft")}>
                    {col}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-2 text-[0.75rem] text-muted">
          <span className={cn(card, "inline-flex items-center gap-1.5 px-2.5 py-1")}>
            <Logo name="postgres" size={14} /> PostgreSQL
          </span>
          <span className={cn(card, "inline-flex items-center gap-1.5 px-2.5 py-1")}>
            <Logo name="redis" size={14} /> Redis cache
          </span>
        </div>
      </div>
    </Frame>
  );
}

export const serviceVisuals: Record<ServiceVisual, () => ReactNode> = {
  agents: AgentsVisual,
  llm: LlmVisual,
  assistant: AssistantVisual,
  saas: SaasVisual,
  automation: AutomationVisual,
  api: ApiVisual,
  mcp: McpVisual,
  backend: BackendVisual,
};
