import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section className="relative isolate flex min-h-[80svh] items-center overflow-hidden pt-16">
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(50%_50%_at_30%_45%,rgba(43,99,245,0.14),transparent_70%)]" />
      <div className="wrap">
        <p className="type-code text-cobalt-bright">404</p>
        <h1 className="type-h2 mt-4 max-w-[18ch] text-fg">This page is not part of the system.</h1>
        <p className="type-lead mt-6 max-w-[32rem]">
          The link may be old or mistyped. Everything we do is on the home page, and the contact form is one click
          away.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href="/" size="lg">
            Go to the home page
          </ButtonLink>
          <ButtonLink href="/#contact" size="lg" variant="secondary" arrow>
            Start a Project
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
