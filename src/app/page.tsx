import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Services } from "@/components/sections/Services";
import { Solutions } from "@/components/sections/Solutions";
import { Projects } from "@/components/sections/Projects";
import { Why } from "@/components/sections/Why";
import { Process } from "@/components/sections/Process";
import { Stack } from "@/components/sections/Stack";
import { Faq } from "@/components/sections/Faq";
import { Contact } from "@/components/sections/Contact";
import { siteConfig } from "@/config/site";
import { services } from "@/content/services";
import { faqs } from "@/content/faq";

function StructuredData() {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/icon.svg`,
    description: siteConfig.description,
    knowsAbout: services.map((service) => service.title),
    ...(siteConfig.contact.email ? { email: siteConfig.contact.email } : {}),
    ...(siteConfig.socials.length ? { sameAs: siteConfig.socials.map((social) => social.href) } : {}),
  };
  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
  const json = (data: unknown) => JSON.stringify(data).replace(/</g, "\\u003c");
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json(organization) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json(faqPage) }} />
    </>
  );
}

export default function HomePage() {
  return (
    <>
      <StructuredData />
      <Hero />
      <About />
      <Services />
      <Solutions />
      <Projects />
      <Why />
      <Process />
      <Stack />
      <Faq />
      <Contact />
    </>
  );
}
