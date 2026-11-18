import { stackGroups, type StackGroup } from "@/content/stack";
import { TechLogo } from "@/components/ui/TechIcon";
import { InView } from "@/components/ui/InView";
import { cn } from "@/lib/cn";

/**
 * The stack drawn as the path a request takes: from the interface, through
 * the backend, to the models, on one continuous route; the infrastructure is
 * the floor every station stands on. Desktop runs left to right, phones top
 * to bottom.
 */
export function Stack() {
  const [frontend, backend, ai, infrastructure] = stackGroups;
  const route = [frontend, backend, ai];

  return (
    <section id="stack" aria-labelledby="stack-title" className="relative py-28 lg:py-36">
      <div className="wrap">
        <div className="mx-auto max-w-[44rem] text-center">
          <h2 id="stack-title" data-reveal="heading" className="type-h2 text-fg">
            The stack behind every build.
          </h2>
          <p data-reveal style={{ ["--i" as string]: 2 }} className="type-lead mx-auto mt-6 max-w-[34rem]">
            Proven, well-supported technology, laid out the way a request travels through a system we build.
          </p>
        </div>

        <InView className="relative isolate mt-16 lg:mt-20">
          <div aria-hidden className="light-pool inset-x-[15%] -top-10 h-[70%]" />
          {/* Desktop route ------------------------------------------------- */}
          <div data-reveal="object" className="relative hidden lg:block">
            <div aria-hidden className="absolute left-[calc(100%/6)] right-[calc(100%/6)] top-[15px] h-[2px] bg-gradient-to-r from-cobalt-bright/80 via-cobalt-bright/60 to-cobalt-bright/90">
              <span className="loop absolute inset-0 motion-safe:animate-[packet_3.2s_linear_infinite]">
                <span className="absolute -top-[3px] left-0 h-2 w-8 -translate-x-full rounded-full bg-[linear-gradient(90deg,transparent,#cfe0ff)] shadow-[0_0_14px_3px_rgba(77,134,255,0.6)]" />
              </span>
            </div>
            <ol className="grid grid-cols-3 gap-10">
              {route.map((group, index) => (
                <Station key={group.id} group={group} index={index} lit={group.id === "ai"} />
              ))}
            </ol>
            {/* Drops from every station to the floor */}
            <div aria-hidden className="grid h-16 grid-cols-3 gap-10">
              {route.map((group) => (
                <div key={group.id} className="flex justify-center">
                  <span className="h-full w-px bg-[repeating-linear-gradient(to_bottom,rgb(111_157_255/0.55)_0_5px,transparent_5px_10px)]" />
                </div>
              ))}
            </div>
          </div>

          {/* Phone and tablet route ---------------------------------------- */}
          <ol data-reveal="object" className="relative border-l-2 border-cobalt-bright/60 pl-8 lg:hidden">
            {route.map((group, index) => (
              <li key={group.id} className="relative pb-12">
                <span
                  aria-hidden
                  className="type-code absolute -left-[calc(2rem+15px)] top-0 flex size-7 items-center justify-center rounded-full border-2 border-cobalt-bright bg-ground text-[0.6875rem] text-cobalt-soft"
                >
                  {index + 1}
                </span>
                <StationBody group={group} />
              </li>
            ))}
          </ol>

          {/* The floor -------------------------------------------------------- */}
          <Floor group={infrastructure} />
        </InView>
      </div>
    </section>
  );
}

function Station({ group, index, lit }: { group: StackGroup; index: number; lit: boolean }) {
  return (
    <li className="relative flex flex-col items-center text-center">
      <span
        aria-hidden
        className={cn(
          "station-ring type-code relative z-10 flex size-8 items-center justify-center rounded-full border-2 bg-ground text-[0.75rem]",
          lit
            ? "border-cobalt-soft text-fg shadow-[0_0_0_6px_rgba(43,99,245,0.18)]"
            : "border-cobalt-bright text-cobalt-soft",
        )}
        style={{ animationDelay: `${[0, 1.6, 3.15][index] ?? 0}s` }}
      >
        {index + 1}
      </span>
      <div className="mt-7 w-full max-w-[22rem]">
        <StationBody group={group} centered />
      </div>
    </li>
  );
}

function StationBody({ group, centered }: { group: StackGroup; centered?: boolean }) {
  return (
    <>
      <h3 className="text-[1.375rem] font-medium tracking-[-0.025em] text-fg">{group.label}</h3>
      <p className="mt-1 text-[0.9375rem] text-muted">{group.summary}</p>
      <ul className={cn("mt-6 space-y-3.5", centered && "mx-auto w-fit text-left")}>
        {group.items.map((tech) => (
          <li key={tech.id} className="flex items-center gap-3.5">
            <TechLogo tech={tech} size={26} className="shrink-0" />
            <span>
              <span className="block text-[0.9875rem] font-medium leading-tight text-fg">{tech.name}</span>
              <span className="block text-[0.8125rem] leading-snug text-muted">{tech.role}</span>
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}

function Floor({ group }: { group: StackGroup }) {
  return (
    <div data-reveal="object" style={{ ["--i" as string]: 2 }} className="relative rounded-[var(--radius-panel)] border border-line bg-[linear-gradient(180deg,rgba(43,99,245,0.07),rgba(11,17,25,0.6))]">
      <div aria-hidden className="absolute inset-x-6 -top-px h-px bg-gradient-to-r from-transparent via-cobalt-bright/70 to-transparent" />
      <div className="grid grid-cols-1 gap-6 p-6 sm:p-8 lg:grid-cols-[15rem_1fr] lg:items-center lg:gap-10">
        <div>
          <h3 className="text-[1.375rem] font-medium tracking-[-0.025em] text-fg">{group.label}</h3>
          <p className="mt-1 text-[0.9375rem] text-muted">{group.summary}</p>
        </div>
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {group.items.map((tech) => (
            <li key={tech.id} className="flex items-center gap-3.5">
              <TechLogo tech={tech} size={28} className="shrink-0" />
              <span>
                <span className="block text-[0.9875rem] font-medium leading-tight text-fg">{tech.name}</span>
                <span className="block text-[0.8125rem] leading-snug text-muted">{tech.role}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
