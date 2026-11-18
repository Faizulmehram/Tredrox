import { Check, Minus } from "lucide-react";
import { principles } from "@/content/why";

const intro =
  "Launch day is when a product starts earning its keep. These are the decisions that decide what happens after it.";

/**
 * A side-by-side comparison rather than a grid of value cards: each principle
 * is shown against the way a launch-only build tends to treat it. On desktop
 * the heading sits inside the comparison frame, over its own two columns,
 * with the lit Tredrox column beside it.
 */
export function Why() {
  return (
    <section id="why" aria-labelledby="why-title" className="relative py-28 lg:py-36">
      <div className="wrap">
        {/* Phones: heading above, one principle at a time with both answers labelled. */}
        <div className="md:hidden">
          <h2 data-reveal="heading" className="type-h2 text-fg">
            Built for more than just the launch.
          </h2>
          <p data-reveal style={{ ["--i" as string]: 2 }} className="type-lead mt-6">{intro}</p>
          <ul className="mt-12 space-y-3">
            {principles.map((item) => (
              <li key={item.title} data-reveal className="panel p-5">
                <h3 className="text-[1.0625rem] font-medium tracking-[-0.015em] text-fg">{item.title}</h3>
                <p className="mt-4 text-[0.75rem] text-faint">Built for launch day</p>
                <p className="mt-1 flex gap-3 text-[0.9375rem] leading-relaxed text-faint">
                  <Minus aria-hidden className="mt-1 size-4 shrink-0" />
                  {item.launchOnly}
                </p>
                <p className="mt-3 text-[0.75rem] text-cobalt-soft">Built with Tredrox</p>
                <p className="mt-1 flex gap-3 text-[0.9375rem] leading-relaxed text-fg-2">
                  <Check aria-hidden className="mt-1 size-4 shrink-0 text-cobalt-bright" strokeWidth={2.25} />
                  {item.tredrox}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Tablet and desktop: the heading lives inside the comparison. */}
        <div data-reveal="object" className="relative hidden overflow-hidden rounded-[var(--radius-frame)] border border-line md:block">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 w-[38%] bg-[radial-gradient(90%_45%_at_50%_0%,rgba(43,99,245,0.22),transparent_75%)]"
          />
          <div className="relative grid grid-cols-[62%_38%] border-b border-line">
            <div className="px-7 pb-10 pt-12 lg:px-10 lg:pt-14">
              <h2 id="why-title" data-reveal="heading" className="type-h2 max-w-[14ch] text-fg">
                Built for more than just the launch.
              </h2>
            </div>
            {/* The lit column opens with the reason it exists. */}
            <div className="flex items-end border-l border-cobalt-bright/25 px-7 pb-10">
              <p data-reveal style={{ ["--i" as string]: 2 }} className="type-lead text-fg-2">{intro}</p>
            </div>
          </div>
          <table className="relative w-full border-collapse text-left">
            <caption className="sr-only">
              Built for more than just the launch: how Tredrox handles six engineering principles compared with a
              launch-only build
            </caption>
            <thead>
              <tr className="border-b border-line">
                <th scope="col" className="w-[26%] px-7 py-4 text-[0.8125rem] font-normal text-faint lg:px-10">
                  Principle
                </th>
                <th scope="col" className="w-[36%] bg-white/[0.012] px-7 py-4 text-[0.8125rem] font-normal text-faint">
                  Built for launch day
                </th>
                <th scope="col" className="w-[38%] border-l border-cobalt-bright/25 px-7 py-4 text-[0.8125rem] font-normal text-cobalt-soft">
                  Built with Tredrox
                </th>
              </tr>
            </thead>
            <tbody>
              {principles.map((item) => (
                <tr
                  key={item.title}
                  className="group border-b border-line transition-colors duration-200 last:border-b-0 hover:bg-white/[0.02]"
                >
                  <th scope="row" className="px-7 py-5 align-top text-[1.0625rem] font-medium tracking-[-0.015em] text-fg lg:px-10">
                    {item.title}
                  </th>
                  <td className="bg-white/[0.012] px-7 py-5 align-top">
                    <span className="flex gap-3 text-[0.9375rem] leading-relaxed text-faint">
                      <Minus aria-hidden className="mt-1 size-4 shrink-0" />
                      {item.launchOnly}
                    </span>
                  </td>
                  <td className="border-l border-cobalt-bright/25 px-7 py-5 align-top">
                    <span className="flex gap-3 text-[0.9375rem] leading-relaxed text-fg-2 transition-colors duration-200 group-hover:text-fg">
                      <Check aria-hidden className="mt-1 size-4 shrink-0 text-cobalt-bright" strokeWidth={2.25} />
                      {item.tredrox}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
