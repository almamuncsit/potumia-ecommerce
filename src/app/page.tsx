import Image from "next/image";
import Link from "next/link";
import { Drape, GoldDivider, GoldRings } from "@/components/banners/art";
import { HeroSlider } from "@/components/banners/hero-slider";
import { ArrowRightIcon, PlusIcon } from "@/components/icons";
import { JsonLd } from "@/components/json-ld";
import { SectionHeading } from "@/components/page-hero";
import { ProductGrid } from "@/components/product-card";
import { FAQS } from "@/content/pages";
import { BRAND } from "@/lib/brand";
import { getHome, getStore } from "@/lib/catalog";
import { absoluteUrl, categoryPath, productPath } from "@/lib/urls";

// Fewer collections get wider tiles instead of one lonely card
const COLLECTION_GRID: Record<number, string> = {
  1: "grid-cols-1 sm:[&>li>a]:aspect-[21/8]",
  2: "grid-cols-2 sm:[&>li>a]:aspect-[16/9]",
  3: "grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-2 lg:grid-cols-4",
};

const TICKER = ["New season collection", `${BRAND.policies.payment} nationwide`, `${BRAND.policies.exchangeDays}-day easy exchange`, "Quality checked", "Designed in Bangladesh"];

function Ticker() {
  const items = [...TICKER, ...TICKER];
  return (
    <div className="overflow-hidden border-y border-gold/25 bg-ink py-4 text-on-ink" aria-hidden="true">
      <div className="flex w-max animate-[ticker_38s_linear_infinite] gap-12 whitespace-nowrap">
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-12 text-[0.72rem] uppercase tracking-[0.3em]">
            {item}
            <span className="h-1.5 w-1.5 rotate-45 bg-gold" />
          </span>
        ))}
      </div>
      <style>{`@keyframes ticker { to { transform: translateX(-50%) } }`}</style>
    </div>
  );
}

export default async function HomePage() {
  const [store, home] = await Promise.all([getStore(), getHome()]);
  const featured = home.best_sellers.length ? home.best_sellers : home.new_arrivals;
  const newArrivals = home.new_arrivals.filter((p) => !featured.some((f) => f.id === p.id));
  const faqs = FAQS.flatMap((g) => g.items).slice(0, 4);

  return (
    <>
      <HeroSlider />
      <Ticker />

      {home.categories.length > 0 && (
        <section aria-labelledby="collections-heading" className="container-x pt-20 sm:pt-24">
          <SectionHeading id="collections-heading" eyebrow="Explore" title="Shop by collection" href="/categories" linkLabel="All collections" />
          <ul className={`grid gap-4 sm:gap-5 ${COLLECTION_GRID[Math.min(home.categories.length, 4)]}`}>
            {home.categories.slice(0, 8).map((category, i) => {
              const dark = i % 2 === 0;
              return (
                <li key={category.id}>
                  <Link
                    href={categoryPath(category)}
                    className={`group relative flex aspect-[4/5] flex-col justify-between overflow-hidden rounded-2xl p-5 transition duration-500 hover:-translate-y-1 sm:p-7 ${
                      dark ? "bg-ink text-on-ink" : "bg-sand text-text"
                    }`}
                  >
                    {dark ? (
                      <GoldRings id={`cat-${category.id}`} className="absolute -bottom-1/3 -right-1/3 h-[110%] w-auto opacity-60 transition duration-700 group-hover:scale-110" />
                    ) : (
                      <Drape id={`cat-${category.id}`} className="absolute inset-x-0 bottom-0 h-2/3 w-full opacity-80 transition duration-700 group-hover:scale-105" />
                    )}
                    <span className={`font-display relative text-5xl ${dark ? "text-gold/70" : "text-gold-deep/60"}`}>{String(i + 1).padStart(2, "0")}</span>
                    <span className="relative">
                      <span className="font-display block text-2xl font-medium leading-tight sm:text-3xl">{category.name}</span>
                      <span className={`mt-2 flex items-center gap-2 text-xs uppercase tracking-[0.18em] ${dark ? "text-on-ink-muted" : "text-muted"}`}>
                        {category.products} {category.products === 1 ? "piece" : "pieces"}
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
            eyebrow={home.best_sellers.length ? "Most loved" : "The collection"}
            title={home.best_sellers.length ? "Best sellers" : "Our pieces"}
            href="/products?sort=popular"
          />
          <ProductGrid products={featured} currency={store.currency} eager={4} />
        </section>
      )}

      {/* Editorial banners */}
      <section aria-label="Highlights" className="container-x grid gap-5 pt-20 sm:pt-24 lg:grid-cols-5">
        <Link href="/products?sort=newest" className="group relative isolate flex min-h-[22rem] overflow-hidden rounded-3xl bg-[radial-gradient(120%_120%_at_90%_10%,#2f2819,#0e0d0b_65%)] p-8 text-on-ink sm:p-12 lg:col-span-3">
          <GoldRings id="promo-new" className="absolute -right-24 -top-24 -z-10 h-[150%] w-auto opacity-80 transition duration-1000 group-hover:rotate-12" />
          <div className="mt-auto max-w-sm">
            <p className="eyebrow text-gold-light">Just landed</p>
            <h2 className="font-display mt-3 text-4xl font-medium leading-tight sm:text-5xl">New arrivals</h2>
            <p className="mt-3 text-on-ink-muted">Fresh pieces for the season ahead, added every week.</p>
            <span className="btn btn-gold mt-6">Shop new in <ArrowRightIcon className="h-4 w-4" /></span>
          </div>
        </Link>
        <Link href="/about" className="group relative isolate flex min-h-[22rem] overflow-hidden rounded-3xl bg-[#f1eadc] p-8 sm:p-12 lg:col-span-2">
          <Drape id="promo-story" className="absolute inset-0 -z-10 h-full w-full transition duration-1000 group-hover:scale-105" />
          <div className="max-w-xs">
            <p className="eyebrow text-gold-deep">The Evoke way</p>
            <h2 className="font-display mt-3 text-4xl font-medium leading-tight">Quality you can feel</h2>
            <p className="mt-3 text-muted">Considered fabrics, clean cuts, lasting wear.</p>
            <span className="link-line mt-5 inline-block text-xs font-medium uppercase tracking-[0.18em]">Our story</span>
          </div>
        </Link>
      </section>

      {newArrivals.length > 0 && (
        <section aria-labelledby="new-heading" className="container-x pt-20 sm:pt-24">
          <SectionHeading id="new-heading" eyebrow="Fresh in" title="New arrivals" href="/products?sort=newest" />
          <ProductGrid products={newArrivals} currency={store.currency} />
        </section>
      )}

      {featured.length === 0 && (
        <p className="container-x pt-20 text-center text-muted">Our new collection is coming soon.</p>
      )}

      {/* Brand story */}
      <section aria-labelledby="story-heading" className="mt-24 bg-ink text-on-ink">
        <div className="container-x grid items-center gap-12 py-20 md:grid-cols-2 lg:py-28">
          <div className="relative mx-auto aspect-square w-full max-w-md">
            <GoldRings id="story" className="absolute inset-0 h-full w-full" />
            <Image
              src={BRAND.logo.stacked.src}
              alt={`${BRAND.name} logo`}
              width={BRAND.logo.stacked.width}
              height={BRAND.logo.stacked.height}
              sizes="(min-width: 768px) 22rem, 70vw"
              className="absolute left-1/2 top-1/2 w-3/5 -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_20px_50px_rgba(198,162,90,0.3)]"
            />
          </div>
          <div className="max-w-lg">
            <p className="eyebrow text-gold-light">Our story</p>
            <h2 id="story-heading" className="font-display mt-3 text-4xl font-medium leading-tight sm:text-5xl">
              Fashion that <span className="text-gold-gradient italic">evokes</span> who you are
            </h2>
            <p className="mt-6 leading-relaxed text-on-ink-muted">
              Evoke is a Bangladeshi label built on a simple belief: everyday clothing deserves the care of an occasion piece. We choose fabrics for how they feel and last, and cut them into clean silhouettes you&apos;ll reach for again and again.
            </p>
            <GoldDivider className="mt-8 justify-start" />
            <Link href="/about" className="btn btn-ghost-light mt-8">Discover our story</Link>
          </div>
        </div>
      </section>

      {/* Search-friendly copy and common questions */}
      <section aria-labelledby="about-shop-heading" className="container-x grid gap-12 pt-20 sm:pt-24 lg:grid-cols-2">
        <div>
          <p className="eyebrow text-gold-deep">Shop online with Evoke</p>
          <h2 id="about-shop-heading" className="font-display mt-3 text-3xl font-medium sm:text-4xl">Premium fashion, delivered across Bangladesh</h2>
          <div className="prose-store mt-4">
            <p>
              Evoke is an online fashion store for refined, wearable clothing in Bangladesh. Browse our latest collection, find your size with our size guide, and order in a few taps.
            </p>
            <p>
              Every order is paid by <strong>{BRAND.policies.payment.toLowerCase()}</strong>, so you pay only when your parcel arrives. We deliver to every district: inside Dhaka in {BRAND.policies.deliveryDhaka} and outside Dhaka in {BRAND.policies.deliveryOutside}. If something isn&apos;t right, you can exchange it within {BRAND.policies.exchangeDays} days.
            </p>
            <p>
              Need help choosing? <Link href="/contact">Talk to us</Link> on the phone or WhatsApp. We&apos;re happy to help.
            </p>
          </div>
        </div>
        <div>
          <p className="eyebrow text-gold-deep">Good to know</p>
          <h2 className="font-display mt-3 text-3xl font-medium sm:text-4xl">Questions, answered</h2>
          <div className="mt-6 divide-y divide-line border-y border-line">
            {faqs.map((faq) => (
              <details key={faq.q} className="group py-5">
                <summary className="flex items-center justify-between gap-6 font-medium">
                  {faq.q}
                  <PlusIcon className="h-4 w-4 shrink-0 text-gold-deep transition group-open:rotate-45" />
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
