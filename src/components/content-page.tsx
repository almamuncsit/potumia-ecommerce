import type { Metadata } from "next";
import Link from "next/link";
import type { ContentPage } from "@/content/pages";
import { getStore } from "@/lib/catalog";
import { getShopBrand } from "@/lib/site";
import { HELP } from "@/lib/nav";
import { absoluteUrl } from "@/lib/urls";
import { PhoneIcon, WhatsAppIcon } from "./icons";
import { JsonLd } from "./json-ld";
import { PageHero } from "./page-hero";

export async function contentMetadata(page: ContentPage): Promise<Metadata> {
  const { name } = await getShopBrand();
  return {
    title: { absolute: `${page.metaTitle} | ${name}` },
    description: page.description,
    alternates: { canonical: `/${page.slug}` },
    openGraph: { title: page.metaTitle, description: page.description, url: `/${page.slug}` },
  };
}

/** Help card with the shop's phone and WhatsApp */
export async function HelpCard() {
  const [store, brand] = await Promise.all([getStore(), getShopBrand()]);
  const { whatsapp } = brand;

  return (
    <div className="rounded-2xl bg-ink p-6 text-on-ink">
      <p className="eyebrow text-accent-light">Need a hand?</p>
      <p className="font-display mt-2 text-2xl">We&apos;re here to help</p>
      <p className="mt-2 text-sm text-on-ink-muted">{brand.hours.label}</p>
      <div className="mt-5 space-y-2">
        {store.phone && (
          <a href={`tel:${store.phone}`} className="flex items-center gap-3 rounded-xl border border-white/15 px-4 py-3 text-sm hover:border-accent-light">
            <PhoneIcon className="h-4 w-4 text-accent" /> {store.phone}
          </a>
        )}
        {whatsapp && (
          <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl border border-white/15 px-4 py-3 text-sm hover:border-accent-light">
            <WhatsAppIcon className="h-4 w-4 text-accent" /> Chat on WhatsApp
          </a>
        )}
        <Link href="/contact" className="block px-1 pt-2 text-xs uppercase tracking-[0.18em] text-accent-light hover:underline">All contact options</Link>
      </div>
    </div>
  );
}

export function HelpNav({ current }: { current: string }) {
  const links = [...HELP, { href: "/about", label: "Our story" }, { href: "/privacy", label: "Privacy policy" }, { href: "/terms", label: "Terms & conditions" }];

  return (
    <nav aria-label="Help topics" className="rounded-2xl border border-line bg-card p-3">
      <ul>
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              aria-current={l.href === current ? "page" : undefined}
              className={`block rounded-xl px-3 py-2.5 text-sm ${l.href === current ? "bg-surface font-medium text-text" : "text-muted hover:bg-surface hover:text-text"}`}
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function ContentPageView({ page, children, pageType = "WebPage" }: { page: ContentPage; children?: React.ReactNode; pageType?: string }) {
  const path = `/${page.slug}`;

  return (
    <>
      <PageHero title={page.title} eyebrow={page.eyebrow} description={page.intro} crumbs={[{ name: page.title, href: path }]} art={page.eyebrow === "Legal" ? "lattice" : "rings"} />
      <div className="container-x grid gap-12 py-14 lg:grid-cols-[1fr_20rem] lg:py-20">
        <article className="prose-store max-w-3xl">
          {page.updated && (
            <p className="eyebrow !mt-0 text-muted">
              Last updated {new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${page.updated}T00:00:00Z`))}
            </p>
          )}
          {page.sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              {section.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
              {section.list && (
                <ul>
                  {section.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
          {children}
        </article>
        <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
          <HelpNav current={path} />
          <HelpCard />
        </aside>
      </div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": pageType,
          name: page.metaTitle,
          description: page.description,
          url: absoluteUrl(path),
          isPartOf: { "@id": absoluteUrl("/#website") },
          ...(page.updated ? { dateModified: page.updated } : {}),
        }}
      />
    </>
  );
}
