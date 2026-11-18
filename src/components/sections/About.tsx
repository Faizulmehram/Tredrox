import { ArrowDownRight } from "lucide-react";
import { InView } from "@/components/ui/InView";
import { SystemFlowHorizontal, SystemFlowVertical } from "@/components/diagrams/SystemFlow";

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="relative py-28 lg:py-40">
      <div className="wrap grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <h2 id="about-title" data-reveal="heading" className="type-h2 text-fg">
            Technology should move your business forward.
          </h2>
          <div data-reveal style={{ ["--i" as string]: 2 }} className="type-lead mt-8 max-w-[34rem] space-y-5">
            <p>
              At Tredrox Systems, we combine software engineering and artificial intelligence to create digital
              solutions that solve meaningful business challenges.
            </p>
            <p>
              From intelligent automation to complex software platforms, we help businesses turn ideas into
              dependable, scalable products.
            </p>
          </div>
          <a
            href="#process"
            className="link-draw mt-9 inline-flex items-center gap-1.5 text-[0.9375rem] font-medium text-cobalt-soft hover:text-fg"
          >
            See how we work
            <ArrowDownRight aria-hidden className="size-4" />
          </a>
        </div>

        <InView className="relative isolate lg:col-span-7">
          <div aria-hidden className="light-pool -inset-x-12 -bottom-20 top-1/4" />
          <div data-reveal="object" className="panel relative overflow-hidden p-5 sm:p-8">
            <div aria-hidden className="blueprint absolute inset-0 opacity-60 [mask-image:radial-gradient(closest-side,#000,transparent)]" />
            <div className="relative hidden sm:block">
              <SystemFlowHorizontal />
            </div>
            <div className="relative mx-auto max-w-[360px] sm:hidden">
              <SystemFlowVertical />
            </div>
          </div>
        </InView>
      </div>
    </section>
  );
}
