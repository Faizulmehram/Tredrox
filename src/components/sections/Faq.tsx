import { Plus } from "lucide-react";
import { faqs } from "@/content/faq";

/** Native disclosure widgets: keyboard and screen-reader support with no JavaScript. */
export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="relative py-28 lg:py-36">
      <div className="wrap grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <h2 id="faq-title" data-reveal="heading" className="type-h2 text-fg">
            Questions we often hear.
          </h2>
          <p data-reveal style={{ ["--i" as string]: 2 }} className="type-lead mt-6 max-w-[26rem]">
            Something else on your mind? Ask it in the form below and we will answer it on our first call.
          </p>
        </div>
        <div className="lg:col-span-7 lg:col-start-6">
          <ul data-reveal="object" className="border-t border-line">
            {faqs.map((item) => (
              <li key={item.question} className="border-b border-line">
                <details className="faq group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-left text-[1.125rem] font-medium tracking-[-0.015em] text-fg-2 transition-colors duration-200 hover:text-fg group-open:text-fg [&::-webkit-details-marker]:hidden">
                    {item.question}
                    <Plus
                      aria-hidden
                      className="size-5 shrink-0 text-muted transition-transform duration-300 ease-out group-open:rotate-45"
                    />
                  </summary>
                  <p className="max-w-[40rem] pb-7 pr-10 text-[0.9875rem] leading-relaxed text-fg-2">{item.answer}</p>
                </details>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
