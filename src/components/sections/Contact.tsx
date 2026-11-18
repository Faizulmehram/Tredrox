import { Mail, MapPin } from "lucide-react";
import { nextSteps } from "@/content/contact";
import { siteConfig } from "@/config/site";
import { ContactForm } from "@/components/contact/ContactForm";

export function Contact() {
  const { email, location } = siteConfig.contact;

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative isolate overflow-hidden py-28 lg:py-36">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(50%_45%_at_25%_40%,rgba(43,99,245,0.14),transparent_70%)]" />
      </div>

      <div className="wrap grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <h2 id="contact-title" data-reveal="heading" className="type-h2 text-fg">
            Have an idea worth engineering?
          </h2>
          <p data-reveal style={{ ["--i" as string]: 2 }} className="type-lead mt-6 max-w-[30rem]">
            Let&rsquo;s turn your next big idea into something intelligent, scalable, and real.
          </p>

          <ol className="mt-12 space-y-6">
            {nextSteps.map((step, index) => (
              <li key={step.title} data-reveal style={{ ["--i" as string]: index + 3 }} className="grid grid-cols-[2.25rem_1fr] gap-x-3">
                <span
                  aria-hidden
                  className="flex size-7 items-center justify-center rounded-full border border-line-strong text-[0.75rem] tabular-nums text-muted"
                >
                  {index + 1}
                </span>
                <div>
                  <p className="text-[1rem] font-medium text-fg">{step.title}</p>
                  <p className="mt-1 text-[0.9375rem] leading-relaxed text-muted">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>

          {email || location ? (
            <ul className="mt-12 space-y-3 border-t border-line pt-6 text-[0.9375rem]">
              {email ? (
                <li>
                  <a href={`mailto:${email}`} className="inline-flex items-center gap-2.5 text-fg-2 hover:text-fg">
                    <Mail aria-hidden className="size-4 text-cobalt-soft" />
                    <span className="link-draw">{email}</span>
                  </a>
                </li>
              ) : null}
              {location ? (
                <li className="inline-flex items-center gap-2.5 text-fg-2">
                  <MapPin aria-hidden className="size-4 text-cobalt-soft" />
                  {location}
                </li>
              ) : null}
            </ul>
          ) : null}
        </div>

        <div data-reveal="object" className="relative isolate lg:col-span-7">
          <div aria-hidden className="light-pool -inset-x-10 -bottom-16 top-1/3" />
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
