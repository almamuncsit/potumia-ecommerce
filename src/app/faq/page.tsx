import type { Metadata } from "next";
import { HelpCard, HelpNav } from "@/components/content-page";
import { PlusIcon } from "@/components/icons";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { getShopBrand, getContent } from "@/lib/site";
import { absoluteUrl } from "@/lib/urls";

export async function generateMetadata(): Promise<Metadata> {
  const { name } = await getShopBrand();
  const description = `Answers about ordering from ${name}: cash on delivery, delivery times across Bangladesh, exchanges, sizing and tracking your order.`;

  return {
    title: { absolute: `FAQ: Orders, Delivery & Exchanges | ${name}` },
    description,
    alternates: { canonical: "/faq" },
    openGraph: { title: "Frequently asked questions", description, url: "/faq" },
  };
}

export default async function FaqPage() {
  const FAQS = (await getContent()).faqs;

  return (
    <>
      <PageHero
        title="Frequently asked questions"
        eyebrow="Help"
        description="Everything about ordering, delivery, payment and exchanges. Can't find your answer? We're a call away."
        crumbs={[{ name: "FAQ", href: "/faq" }]}
      />
      <div className="container-x grid gap-12 py-14 lg:grid-cols-[1fr_20rem] lg:py-20">
        <div className="max-w-3xl space-y-12">
          {FAQS.map((group, gi) => (
            <section key={group.group} aria-labelledby={`faq-${gi}`}>
              <h2 id={`faq-${gi}`} className="font-display text-3xl font-medium">{group.group}</h2>
              <div className="mt-4 divide-y divide-line border-y border-line">
                {group.items.map((faq) => (
                  <details key={faq.q} className="group py-5">
                    <summary className="flex items-center justify-between gap-6 text-[1.02rem] font-medium">
                      <h3>{faq.q}</h3>
                      <PlusIcon className="h-4 w-4 shrink-0 text-accent-strong transition group-open:rotate-45" />
                    </summary>
                    <p className="mt-3 leading-relaxed text-muted">{faq.a}</p>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>
        <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
          <HelpNav current="/faq" />
          <HelpCard />
        </aside>
      </div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          url: absoluteUrl("/faq"),
          mainEntity: FAQS.flatMap((g) => g.items).map((faq) => ({
            "@type": "Question",
            name: faq.q,
            acceptedAnswer: { "@type": "Answer", text: faq.a },
          })),
        }}
      />
    </>
  );
}
