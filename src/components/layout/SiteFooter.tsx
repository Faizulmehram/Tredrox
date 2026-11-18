import Link from "next/link";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import { services } from "@/content/services";
import { Mark } from "@/components/brand/Wordmark";
import { FooterWordmark } from "./FooterWordmark";
import { HomeLink } from "./HomeLink";

const companyLinks = [
  { label: "About", href: "/#about" },
  { label: "Our process", href: "/#process" },
  { label: "Projects", href: "/#work" },
  { label: "Questions", href: "/#faq" },
  { label: "Contact", href: "/#contact" },
];

const linkClass = "link-draw text-[0.9375rem] text-fg-2 transition-colors duration-200 hover:text-fg";

function Column({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-[0.8125rem] text-faint">{title}</h2>
      <ul className="mt-5 space-y-3">{children}</ul>
    </div>
  );
}

/**
 * Brand and the one action on the left; three short link columns on the
 * right (company, services by short name, more); the engraved wordmark; a
 * single legal line.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();
  const { email, location } = siteConfig.contact;

  return (
    <footer className="relative isolate overflow-hidden border-t border-line">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[70%] bg-[radial-gradient(55%_80%_at_50%_100%,rgba(43,99,245,0.14),transparent_70%)]"
      />

      <div className="wrap pt-20 lg:pt-24">
        <div className="grid grid-cols-2 gap-x-8 gap-y-14 md:grid-cols-12 md:gap-x-10">
          {/* Brand and the one action */}
          <div className="col-span-2 md:col-span-5">
            <HomeLink className="inline-flex items-center gap-2.5 rounded-md text-fg" aria-label="Tredrox Systems, back to top">
              <Mark className="size-7" />
              <span className="text-[1.125rem] font-semibold tracking-[-0.02em]">Tredrox Systems</span>
            </HomeLink>
            <p className="mt-5 max-w-[25rem] text-[0.9375rem] leading-relaxed text-muted">
              We design, build and deploy intelligent software, AI products and business automation for startups and
              growing businesses.
            </p>
            <Link
              href="/#contact"
              className="group/cta mt-9 inline-flex items-center gap-2 text-[1.125rem] font-medium tracking-[-0.015em] text-fg"
            >
              <span className="link-draw">Start a project</span>
              <ArrowUpRight
                aria-hidden
                className="size-5 text-cobalt-soft transition-transform duration-200 ease-out group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5"
              />
            </Link>
            {email || location ? (
              <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[0.9375rem] text-muted">
                {email ? (
                  <a href={`mailto:${email}`} className="link-draw hover:text-fg">
                    {email}
                  </a>
                ) : null}
                {location ? <span>{location}</span> : null}
              </p>
            ) : null}
          </div>

          <nav aria-label="Footer" className="md:col-span-2 md:col-start-7">
            <Column title="Company">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </Column>
          </nav>

          <div className="md:col-span-2">
            <Column title="Services">
              {services.map((service) => (
                <li key={service.id}>
                  <Link href="/#services" className={linkClass}>
                    {service.navLabel}
                  </Link>
                </li>
              ))}
            </Column>
          </div>

          <div className="col-span-2 md:col-span-2">
            <Column title="More">
              <li>
                <Link href="/privacy" className={linkClass}>
                  Privacy notice
                </Link>
              </li>
              {siteConfig.socials.map((social) => (
                <li key={social.label}>
                  <a href={social.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    {social.label}
                  </a>
                </li>
              ))}
              <li>
                <HomeLink className={`${linkClass} inline-flex items-center gap-1.5`}>
                  Back to top
                  <ArrowUp aria-hidden className="size-3.5" />
                </HomeLink>
              </li>
            </Column>
          </div>
        </div>

        {/* The closing wordmark, engraved, with a travelling light. */}
        <FooterWordmark />

        <div className="flex flex-col gap-2 border-t border-line py-7 text-[0.8125rem] text-faint md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <p>Product names and logos are trademarks of their owners.</p>
        </div>
      </div>
    </footer>
  );
}
