import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import { PrivacyToc } from "./PrivacyToc";

export const metadata: Metadata = {
  title: "Privacy notice",
  description: "How Tredrox Systems collects, uses and protects the personal information you share through this website.",
  alternates: { canonical: "/privacy" },
};

/*
  A plain-language privacy notice for a marketing site with a contact form.
  It is a solid starting point, not legal advice: have it reviewed against the
  laws that apply to your business (for example UK/EU GDPR or CCPA) before
  launch, and update it if you add analytics, cookies or other processing.
  Change LAST_UPDATED whenever the content changes.
*/
const LAST_UPDATED = "18 November 2026";

type Section = { id: string; title: string; body: React.ReactNode };

export default function PrivacyPage() {
  const { email } = siteConfig.contact;
  const contactLine = email ? (
    <>
      by email at{" "}
      <a href={`mailto:${email}`} className="text-fg underline decoration-cobalt-soft/50 underline-offset-4 hover:decoration-fg">
        {email}
      </a>
    </>
  ) : (
    <>
      through the{" "}
      <Link href="/#contact" className="text-fg underline decoration-cobalt-soft/50 underline-offset-4 hover:decoration-fg">
        contact form
      </Link>{" "}
      on our website
    </>
  );

  const sections: Section[] = [
    {
      id: "who-we-are",
      title: "Who we are",
      body: (
        <p>
          Tredrox Systems (&ldquo;Tredrox&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) designs and builds software, AI
          products and business automation. We are responsible for the personal information described in this notice.
          You can reach us about anything in it {contactLine}.
        </p>
      ),
    },
    {
      id: "what-we-collect",
      title: "What we collect",
      body: (
        <>
          <p>
            <strong>Information you give us.</strong> When you use the contact form we receive your full name, work
            email, company (if you add it), the type of project, an optional budget range and your project description.
            If we then correspond or work together, we also keep the messages and documents you send us.
          </p>
          <p>
            <strong>Information collected automatically.</strong> Like most websites, our hosting provider may record
            standard technical data such as your IP address, browser type, the pages requested and the time of the
            request. This is used to keep the site secure and working.
          </p>
          <p>
            We do not use advertising or analytics cookies, and we do not track you across other websites.
          </p>
        </>
      ),
    },
    {
      id: "how-we-use-it",
      title: "How we use it",
      body: (
        <ul>
          <li>To reply to your enquiry and arrange a first conversation.</li>
          <li>To prepare a proposal or estimate when you ask for one.</li>
          <li>To deliver and support a project if you become a client.</li>
          <li>To keep this website secure and to prevent abuse of the contact form.</li>
        </ul>
      ),
    },
    {
      id: "legal-bases",
      title: "Legal bases",
      body: (
        <>
          <p>Where data protection laws such as the UK or EU GDPR apply, we rely on:</p>
          <ul>
            <li>
              <strong>Steps before a contract</strong>, when you ask us about a project or a proposal.
            </li>
            <li>
              <strong>Legitimate interests</strong>, in answering enquiries, running our business and keeping the site
              secure, balanced against your rights.
            </li>
            <li>
              <strong>Legal obligations</strong>, where we must keep certain records, for example for tax and accounting.
            </li>
            <li>
              <strong>Consent</strong>, where the law requires it. You can withdraw consent at any time.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "sharing",
      title: "Who we share it with",
      body: (
        <>
          <p>
            We do not sell your personal information. We share it only with service providers that help us run this
            website and our business, and only as far as they need it:
          </p>
          <ul>
            <li>an email delivery provider, which carries contact form messages to our inbox;</li>
            <li>our website hosting provider;</li>
            <li>professional advisers, or authorities where the law requires it.</li>
          </ul>
          <p>These providers may only use the information to provide their service to us.</p>
        </>
      ),
    },
    {
      id: "transfers",
      title: "International transfers",
      body: (
        <p>
          Some of our providers may process information outside the country where you live. Where the law requires it,
          we rely on recognised safeguards for those transfers, such as standard contractual clauses.
        </p>
      ),
    },
    {
      id: "retention",
      title: "How long we keep it",
      body: (
        <p>
          We keep enquiry details only as long as we need them to respond and follow up, and we regularly delete
          enquiries that do not lead to a project. Client records are kept for the length of our work together and
          afterwards for as long as legal, tax or accounting rules require.
        </p>
      ),
    },
    {
      id: "security",
      title: "How we protect it",
      body: (
        <p>
          The website is served over an encrypted connection, access to enquiries is limited to the people who need it,
          and we choose providers with appropriate security practices. No system is perfectly secure, so please do not
          send highly sensitive information through the contact form.
        </p>
      ),
    },
    {
      id: "your-rights",
      title: "Your rights",
      body: (
        <>
          <p>Depending on where you live, you may have the right to:</p>
          <ul>
            <li>see the personal information we hold about you;</li>
            <li>correct it, or ask us to delete it;</li>
            <li>object to or restrict how we use it;</li>
            <li>receive a copy in a portable format;</li>
            <li>withdraw consent you have given;</li>
            <li>complain to your local data protection authority.</li>
          </ul>
          <p>To use any of these rights, contact us {contactLine}. We will reply within the time the law allows.</p>
        </>
      ),
    },
    {
      id: "cookies",
      title: "Cookies",
      body: (
        <p>
          This website does not set cookies for analytics or advertising. If that changes, we will update this notice
          and ask for your consent where the law requires it.
        </p>
      ),
    },
    {
      id: "children",
      title: "Children",
      body: (
        <p>
          Our website and services are meant for businesses. They are not directed at children, and we do not knowingly
          collect information from anyone under 16.
        </p>
      ),
    },
    {
      id: "changes",
      title: "Changes to this notice",
      body: (
        <p>
          We may update this notice from time to time. The date at the top shows when it last changed. If we make a
          significant change, we will make it clear on this page.
        </p>
      ),
    },
  ];

  return (
    <article className="pb-28 pt-28 lg:pb-36 lg:pt-36">
      <div className="wrap">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[0.9375rem] text-muted transition-colors duration-200 hover:text-fg"
        >
          <ArrowLeft aria-hidden className="size-4" /> Back to the home page
        </Link>

        <header className="mt-10 grid grid-cols-1 gap-6 border-b border-line pb-12 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="lg:col-span-7">
            <h1 className="type-h2 text-fg">Privacy notice</h1>
            <p className="type-lead mt-6 max-w-[38rem]">
              How we collect, use and protect the personal information you share with us through this website, in plain
              language.
            </p>
          </div>
          <dl className="grid grid-cols-2 gap-6 text-[0.875rem] lg:col-span-4 lg:col-start-9">
            <div>
              <dt className="text-faint">Last updated</dt>
              <dd className="mt-1 text-fg-2">{LAST_UPDATED}</dd>
            </div>
            <div>
              <dt className="text-faint">Applies to</dt>
              <dd className="mt-1 text-fg-2">This website and enquiries</dd>
            </div>
          </dl>
        </header>

        <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Contents: sticky beside the text on desktop. */}
          <div className="lg:col-span-3">
            <PrivacyToc sections={sections.map(({ id, title }) => ({ id, title }))} />
          </div>

          <div className="lg:col-span-8 lg:col-start-5">
            <div className="space-y-14">
              {sections.map((section, index) => (
                <section key={section.id} id={section.id} data-anchor className="scroll-mt-28">
                  <h2 className="flex items-baseline gap-4 text-[1.375rem] font-medium tracking-[-0.02em] text-fg">
                    <span className="type-code text-[0.8125rem] text-cobalt-soft">{String(index + 1).padStart(2, "0")}</span>
                    {section.title}
                  </h2>
                  <div className="mt-4 max-w-[44rem] space-y-4 pl-0 text-[1rem] leading-relaxed text-fg-2 sm:pl-9 [&_li]:relative [&_li]:pl-5 [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:top-[0.7em] [&_li]:before:h-px [&_li]:before:w-2.5 [&_li]:before:bg-cobalt-bright [&_strong]:font-medium [&_strong]:text-fg [&_ul]:space-y-2">
                    {section.body}
                  </div>
                </section>
              ))}
            </div>

            <div className="mt-20 flex flex-col gap-6 border-t border-line pt-10 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-[28rem] text-[0.9375rem] text-muted">
                Questions about this notice or your information? We are happy to help.
              </p>
              <Link
                href="/#contact"
                className="group inline-flex h-11 items-center gap-2 self-start rounded-lg bg-cobalt px-5 text-[0.9375rem] font-medium text-white shadow-[0_1px_0_0_rgb(255_255_255/0.22)_inset] transition-[background-color,transform] duration-200 ease-out hover:bg-[#3a70ff] active:scale-[0.97] sm:self-auto"
              >
                Contact us
                <ArrowUpRight
                  aria-hidden
                  className="size-4 transition-transform duration-200 ease-out group-hover:-translate-y-px group-hover:translate-x-px"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
