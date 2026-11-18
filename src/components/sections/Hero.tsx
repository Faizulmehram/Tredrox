import { ButtonLink } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/Magnetic";
import { HeroVisual } from "@/components/hero/HeroVisual";
import { TechMarquee } from "@/components/hero/TechMarquee";
import { siteConfig } from "@/config/site";

export function Hero() {
  return (
    <section
      id="home"
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden pt-16"
    >
      {/* Ground: the cobalt light falls from above onto the object. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ground" />
      </div>

      <div className="wrap relative flex flex-1 flex-col">
        <div className="relative grid flex-1 grid-cols-1 items-center gap-y-6 py-10 lg:grid-cols-12 lg:py-0">
          {/*
            Object: its own column on the right on desktop, clear of the headline
            (the longest line ends before it starts at every desktop width);
            under the copy on phones.
          */}
          <HeroVisual className="order-2 -mx-[clamp(20px,4vw,48px)] aspect-[1/0.92] max-h-[440px] sm:max-h-[520px] lg:absolute lg:inset-y-0 lg:right-[-5%] lg:order-none lg:mx-0 lg:aspect-auto lg:max-h-none lg:w-[64%] lg:[--object-shift:0.17]" />

          <div className="relative z-10 order-1 lg:order-none lg:col-span-8 lg:col-start-1">
            <h1 id="hero-title" className="type-display max-w-[13ch] text-fg lg:max-w-none">
              <span className="enter-line" style={{ ["--d" as string]: "80ms" }}>
                Engineering the
              </span>
              <span className="enter-line" style={{ ["--d" as string]: "180ms" }}>
                intelligence behind
              </span>
              <span className="enter-line" style={{ ["--d" as string]: "260ms" }}>
                what&rsquo;s next.
              </span>
            </h1>

            <p
              className="enter-soft type-lead mt-7 max-w-[34rem] sm:mt-8"
              style={{ ["--d" as string]: "420ms" }}
            >
              We turn ambitious ideas into intelligent software: AI agents, SaaS platforms and business
              automation, designed, built and deployed for startups and growing businesses.
            </p>

            <div
              className="enter-soft mt-9 flex flex-wrap items-center gap-3"
              style={{ ["--d" as string]: "520ms" }}
            >
              <Magnetic>
                <ButtonLink href="#contact" size="lg" arrow>
                  Start a Project
                </ButtonLink>
              </Magnetic>
              <ButtonLink href="#services" size="lg" variant="secondary">
                See What We Build
              </ButtonLink>
            </div>
          </div>

          {/* The brand line, set as an annotation on the object rather than a label over the headline. */}
          <p
            className="enter-fade pointer-events-none absolute right-0 top-8 z-10 hidden max-w-[15rem] text-right text-[0.8125rem] leading-snug text-muted lg:block"
            style={{ ["--d" as string]: "900ms" }}
          >
            <span className="mb-2 ml-auto block h-px w-10 bg-cobalt-bright/70" />
            {siteConfig.tagline.split(". ").map((line, i, all) => (
              <span key={line} className="block">
                {i < all.length - 1 ? `${line}.` : line}
              </span>
            ))}
          </p>
        </div>

        {/* Bottom band: the technology strip, inside the first screen. */}
        <div className="enter-fade relative border-t border-line py-5" style={{ ["--d" as string]: "700ms" }}>
          <TechMarquee />
        </div>
      </div>
    </section>
  );
}
