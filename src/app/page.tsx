import Image from "next/image";
import Link from "next/link";
import { ArtDivider, ArtFlow, ArtRings } from "@/components/banners/art";
import { ArrowRightIcon, PlusIcon } from "@/components/icons";
import { JsonLd } from "@/components/json-ld";
import { SectionHeading } from "@/components/page-hero";
import { ProductGrid } from "@/components/product-card";
import { FAQS } from "@/content/pages";
import { BRAND, itemCount, THEME } from "@/lib/brand";
import { getHome, getStore } from "@/lib/catalog";
import { absoluteUrl, categoryPath, productPath } from "@/lib/urls";
import { Hero } from "@theme/hero";

// Fewer collections get wider tiles instead of one lonely card
const COLLECTION_GRID: Record<number, string> = {
  1: "grid-cols-1 sm:[&>li>a]:aspect-[21/8]",
  2: "grid-cols-2 sm:[&>li>a]:aspect-[16/9]",
  3: "grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-2 lg:grid-cols-4",
};

/** The story title with the theme's highlight word in the accent gradient */
function Highlighted({ title, word }: { title: string; word: string }) {
  const at = title.indexOf(word);
  if (at < 0) return <>{title}</>;
  return (
    <>
      {title.slice(0, at)}
      <span className="text-accent-gradient">{word}</span>
      {title.slice(at + word.length)}
    </>
  );
}

export default async function HomePage() {
  const [store, home] = await Promise.all([getStore(), getHome()]);
  const featured = home.best_sellers.length ? home.best_sellers : home.new_arrivals;
  const newArrivals = home.new_arrivals.filter((p) => !featured.some((f) => f.id === p.id));
  const faqs = FAQS.flatMap((g) => g.items).slice(0, 4);
  const { collections, promoPrimary, promoSecondary, story, seo } = THEME.home;
  const { payment, deliveryDhaka, deliveryOutside, exchangeDays } = BRAND.policies;

  return (
    <>
      <Hero featured={featured} currency={store.currency} phone={store.phone} />

      {home.categories.length > 0 && (
        <section aria-labelledby="collections-heading" className="container-x pt-20 sm:pt-24">
          <SectionHeading id="collections-heading" eyebrow={collections.eyebrow} title={collections.title} href="/categories" linkLabel={`All ${THEME.labels.collections.toLowerCase()}`} />
          <ul className={`grid gap-4 sm:gap-5 ${COLLECTION_GRID[Math.min(home.categories.length, 4)]}`}>
            {home.categories.slice(0, 8).map((category, i) => {
              const dark = i % 2 === 0;
              return (
                <li key={category.id}>
                  <Link
                    href={categoryPath(category)}
                    className={`group relative flex aspect-[4/5] flex-col justify-between overflow-hidden rounded-2xl p-5 transition duration-500 hover:-translate-y-1 sm:p-7 ${
                      dark ? "surface-ink" : "bg-sand text-text"
                    }`}
                  >
                    {dark ? (
                      <ArtRings id={`cat-${category.id}`} className="absolute -bottom-1/3 -right-1/3 h-[110%] w-auto opacity-60 transition duration-700 group-hover:scale-110" />
                    ) : (
                      <ArtFlow id={`cat-${category.id}`} className="absolute inset-x-0 bottom-0 h-2/3 w-full opacity-80 transition duration-700 group-hover:scale-105" />
                    )}
                    <span className={`font-display relative text-5xl lining-nums ${dark ? "text-accent-light/80" : "text-accent-strong/60"}`}>{String(i + 1).padStart(2, "0")}</span>
                    <span className="relative">
                      <span className="font-display block text-2xl leading-tight sm:text-3xl">{category.name}</span>
                      <span className={`mt-2 flex items-center gap-2 text-xs uppercase tracking-[0.18em] ${dark ? "text-on-ink-muted" : "text-muted"}`}>
                        {itemCount(category.products)}
                        <ArrowRightIcon className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {featured.length > 0 && (
        <section aria-labelledby="featured-heading" className="container-x pt-20 sm:pt-24">
          <SectionHeading
            id="featured-heading"
            eyebrow={home.best_sellers.length ? "Most loved" : `Shop ${BRAND.name}`}
            title={home.best_sellers.length ? "Best sellers" : `Our ${THEME.labels.items}`}
            href="/products?sort=popular"
          />
          <ProductGrid products={featured} currency={store.currency} eager={4} />
        </section>
      )}

      {/* Editorial banners */}
      <section aria-label="Highlights" className="container-x grid gap-5 pt-20 sm:pt-24 lg:grid-cols-5">
        <Link href={promoPrimary.href} className="surface-ink group relative isolate flex min-h-[22rem] overflow-hidden rounded-3xl p-8 sm:p-12 lg:col-span-3">
          <ArtRings id="promo-new" className="absolute -right-24 -top-24 -z-10 h-[150%] w-auto opacity-80 transition duration-1000 group-hover:rotate-12" />
          <div className="mt-auto max-w-sm">
            <p className="eyebrow text-accent-light">{promoPrimary.eyebrow}</p>
            <h2 className="font-display mt-3 text-4xl leading-tight sm:text-5xl">{promoPrimary.title}</h2>
            <p className="mt-3 text-on-ink-muted">{promoPrimary.text}</p>
            <span className="btn btn-accent mt-6">
              {promoPrimary.cta} <ArrowRightIcon className="h-4 w-4" />
            </span>
          </div>
        </Link>
        <Link href={promoSecondary.href} className="surface-soft group relative isolate flex min-h-[22rem] overflow-hidden rounded-3xl p-8 sm:p-12 lg:col-span-2">
          <ArtFlow id="promo-story" className="absolute inset-0 -z-10 h-full w-full transition duration-1000 group-hover:scale-105" />
          <div className="max-w-xs">
            <p className="eyebrow text-accent-strong">{promoSecondary.eyebrow}</p>
            <h2 className="font-display mt-3 text-4xl leading-tight">{promoSecondary.title}</h2>
            <p className="mt-3 text-muted">{promoSecondary.text}</p>
            <span className="link-line mt-5 inline-block text-xs font-medium uppercase tracking-[0.18em]">{promoSecondary.cta}</span>
          </div>
        </Link>
      </section>

      {newArrivals.length > 0 && (
        <section aria-labelledby="new-heading" className="container-x pt-20 sm:pt-24">
          <SectionHeading id="new-heading" eyebrow="Fresh in" title="New arrivals" href="/products?sort=newest" />
          <ProductGrid products={newArrivals} currency={store.currency} />
        </section>
      )}

      {featured.length === 0 && <p className="container-x pt-20 text-center text-muted">New {THEME.labels.items} are coming soon.</p>}

      {/* Brand story */}
      <section aria-labelledby="story-heading" className="surface-ink mt-24">
        <div className="container-x grid items-center gap-12 py-20 md:grid-cols-2 lg:py-28">
          <div className="relative mx-auto aspect-square w-full max-w-md">
            <ArtRings id="story" className="absolute inset-0 h-full w-full" />
            <Image
              src={BRAND.logo.feature.src}
              alt={`${BRAND.name} logo`}
              width={BRAND.logo.feature.width}
              height={BRAND.logo.feature.height}
              sizes="(min-width: 768px) 22rem, 70vw"
              className="absolute left-1/2 top-1/2 w-3/5 -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_20px_50px_rgba(0,0,0,0.25)]"
            />
          </div>
          <div className="max-w-lg">
            <p className="eyebrow text-accent-light">{story.eyebrow}</p>
            <h2 id="story-heading" className="font-display mt-3 text-4xl leading-tight sm:text-5xl">
              <Highlighted title={story.title} word={story.highlight} />
            </h2>
            <p className="mt-6 leading-relaxed text-on-ink-muted">{story.text}</p>
            <ArtDivider className="mt-8 justify-start" />
            <Link href="/about" className="btn btn-ghost-light mt-8">{story.cta}</Link>
          </div>
        </div>
      </section>

      {/* Search-friendly copy and common questions */}
      <section aria-labelledby="about-shop-heading" className="container-x grid gap-12 pt-20 sm:pt-24 lg:grid-cols-2">
        <div>
          <p className="eyebrow text-accent-strong">{seo.eyebrow}</p>
          <h2 id="about-shop-heading" className="font-display mt-3 text-3xl sm:text-4xl">{seo.title}</h2>
          <div className="prose-store mt-4">
            {seo.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <p>
              Every order is paid by <strong>{payment.toLowerCase()}</strong>, so you pay only when your parcel arrives. We deliver to every district: inside Dhaka in {deliveryDhaka} and
              outside Dhaka in {deliveryOutside}. If something isn&apos;t right, you can exchange it within {exchangeDays} days.
            </p>
            <p>
              Need help choosing? <Link href="/contact">Talk to us</Link> on the phone or WhatsApp. We&apos;re happy to help.
            </p>
          </div>
        </div>
        <div>
          <p className="eyebrow text-accent-strong">Good to know</p>
          <h2 className="font-display mt-3 text-3xl sm:text-4xl">Questions, answered</h2>
          <div className="mt-6 divide-y divide-line border-y border-line">
            {faqs.map((faq) => (
              <details key={faq.q} className="group py-5">
                <summary className="flex items-center justify-between gap-6 font-medium">
                  {faq.q}
                  <PlusIcon className="h-4 w-4 shrink-0 text-accent-strong transition group-open:rotate-45" />
                </summary>
                <p className="mt-3 leading-relaxed text-muted">{faq.a}</p>
              </details>
            ))}
          </div>
          <Link href="/faq" className="link-line mt-6 inline-block text-xs font-medium uppercase tracking-[0.18em]">All questions</Link>
        </div>
      </section>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: `${BRAND.name}: featured products`,
          itemListElement: featured.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: absoluteUrl(productPath(p)), name: p.name })),
        }}
      />
    </>
  );
}
