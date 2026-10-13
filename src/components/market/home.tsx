import Link from "next/link";
import { LABELS } from "@/lib/brand";
import { getShopBrand, getContent, getHomeCopy, type SiteBrand } from "@/lib/site";
import type { Group, Home, Product, Store } from "@/lib/types";
import { absoluteUrl, categoryPath, productPath } from "@/lib/urls";
import { Hero } from "@theme/hero";
import { ArrowRightIcon, CashIcon, ExchangeIcon, PhoneIcon, PlusIcon, ShieldIcon, TruckIcon } from "../icons";
import { JsonLd } from "../json-ld";
import { StoreImage } from "../store-image";
import { DealCard, discountOf, ListCard, MarketGrid } from "./cards";

/**
 * The marketplace home page: hero with categories, promo tiles, store
 * promises, deals, categories, top sellers, collection banners and new
 * arrivals, then search-friendly copy and FAQs. Everything shown comes from
 * the shop's catalog; sections without data are left out.
 */

function Heading({ id, title, note, href, linkLabel = "View all" }: { id: string; title: string; note?: React.ReactNode; href?: string; linkLabel?: string }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-x-6 gap-y-2 border-b border-line pb-4">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <h2 id={id} className="font-display flex items-center gap-2 text-2xl text-text sm:text-[1.75rem]">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6 text-hot" fill="currentColor">
            <path d="M13 2 4.5 13.5H11L10 22l8.5-11.5H12L13 2Z" />
          </svg>
          {title}
        </h2>
        {note}
      </div>
      {href && (
        <Link href={href} className="flex items-center gap-1.5 rounded-lg border border-line bg-card px-3.5 py-1.5 text-sm font-semibold hover:border-brand hover:text-brand-strong">
          {linkLabel} <ArrowRightIcon className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

const TILE_TONES = ["bg-[#e6f6fd]", "bg-[#fdeef2]", "bg-[#efeafe]"];

/** Three category tiles under the hero */
function PromoTiles({ categories, deals }: { categories: Group[]; deals: Product[] }) {
  if (!categories.length) return null;

  return (
    <section
      aria-label={`Popular ${LABELS.collections.toLowerCase()}`}
      className="container-x flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto pt-5 [scrollbar-width:none] sm:grid sm:grid-cols-3 sm:gap-5 sm:overflow-visible [&::-webkit-scrollbar]:hidden"
    >
      {categories.map((c, i) => {
        const best = Math.max(0, ...deals.filter((d) => d.category?.id === c.id).map(discountOf));
        return (
          <Link key={c.id} href={categoryPath(c)} className={`group relative isolate flex min-h-36 w-[82%] shrink-0 snap-start items-center overflow-hidden rounded-2xl p-5 sm:min-h-44 sm:w-auto sm:p-6 ${TILE_TONES[i % TILE_TONES.length]}`}>
            <div className="relative z-10 max-w-[58%]">
              <p className="text-xs font-medium text-muted">{best ? `Save up to ${best}%` : `${c.products} ${LABELS.items}`}</p>
              <p className="font-display mt-1 text-xl leading-tight text-text sm:text-2xl">{c.name}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-brand-strong">
                Shop now <ArrowRightIcon className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
              </span>
            </div>
            <span className="absolute -right-4 top-1/2 h-36 w-36 -translate-y-1/2 overflow-hidden rounded-full border-4 border-white shadow-lg transition duration-500 group-hover:scale-105 sm:h-40 sm:w-40">
              <StoreImage src={c.image} alt="" fallback={c.name} fill sizes="10rem" className="object-cover" />
            </span>
          </Link>
        );
      })}
    </section>
  );
}

function Features({ policies }: { policies: SiteBrand["policies"] }) {
  const FEATURES = [
    { Icon: CashIcon, title: policies.payment, text: "Pay when it arrives" },
    { Icon: TruckIcon, title: "Fast delivery", text: `Dhaka: ${policies.deliveryDhaka}` },
    { Icon: ExchangeIcon, title: `${policies.exchangeDays}-day exchange`, text: "No-hassle returns" },
    { Icon: ShieldIcon, title: "Genuine products", text: "Checked before packing" },
    { Icon: PhoneIcon, title: "Real support", text: "Call or WhatsApp us" },
  ];

  return (
    <section aria-label="Why shop with us" className="container-x pt-8">
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {FEATURES.map(({ Icon, title, text }, i) => (
          <li key={title} className={`flex items-center gap-3 rounded-xl border border-line bg-card px-3 py-3 sm:px-4 sm:py-3.5 ${i === 4 ? "hidden lg:flex" : ""}`}>
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-soft text-brand-strong sm:h-11 sm:w-11">
              <Icon className="h-6 w-6" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-bold leading-tight text-text sm:truncate">{title}</span>
              <span className="block text-xs text-muted sm:truncate">{text}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Deals({ deals, store }: { deals: Product[]; store: Store }) {
  if (!deals.length) return null;
  const best = Math.max(0, ...deals.map(discountOf));
  const spotlight = deals.slice(0, 2);
  const rest = deals.slice(2);

  return (
    <section aria-labelledby="deals-heading" className="mt-12 bg-[#fff6ec] py-10 sm:py-12">
      <div className="container-x">
        <Heading
          id="deals-heading"
          title="Top deals"
          href="/products?on_sale=1"
          linkLabel="All deals"
          note={best > 0 && <span className="rounded-lg bg-hot px-2.5 py-1 text-sm font-bold text-white">Save up to {best}%</span>}
        />
        <ul className="grid gap-5 lg:grid-cols-2">
          {spotlight.map((p) => (
            <li key={p.id}>
              <DealCard product={p} currency={store.currency} />
            </li>
          ))}
        </ul>
        {rest.length > 0 && (
          <div className="mt-5">
            <MarketGrid products={rest} currency={store.currency} columns={6} />
          </div>
        )}
      </div>
    </section>
  );
}

function Categories({ categories }: { categories: Group[] }) {
  if (!categories.length) return null;

  return (
    <section aria-labelledby="categories-heading" className="container-x pt-12">
      <Heading id="categories-heading" title={`Shop by ${LABELS.collection.toLowerCase()}`} href="/categories" />
      <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4 lg:grid-cols-6">
        {categories.slice(0, 12).map((c) => (
          <li key={c.id}>
            <Link href={categoryPath(c)} className="group flex h-full flex-col items-center rounded-xl border border-line bg-card px-2 py-4 text-center transition hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-md sm:py-5">
              <span className="relative h-16 w-16 overflow-hidden rounded-full bg-surface ring-4 ring-surface transition group-hover:ring-brand-soft sm:h-20 sm:w-20">
                <StoreImage src={c.image} alt="" fallback={c.name} fallbackClassName="text-2xl" fill sizes="5rem" className="object-cover transition duration-500 group-hover:scale-110" />
              </span>
              <span className="mt-3 line-clamp-2 text-sm font-semibold leading-tight group-hover:text-brand-strong">{c.name}</span>
              <span className="mt-0.5 text-xs text-muted">
                {c.products} {c.products === 1 ? LABELS.item : LABELS.items}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function TopSelling({ products, store }: { products: Product[]; store: Store }) {
  if (!products.length) return null;

  return (
    <section aria-labelledby="top-heading" className="container-x pt-12">
      <Heading id="top-heading" title="Top selling" note={<span className="text-sm text-muted">Most ordered in the last 90 days</span>} href="/products?sort=popular" />
      <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {products.slice(0, 6).map((p, i) => (
          <li key={p.id}>
            <ListCard product={p} currency={store.currency} rank={i + 1} />
          </li>
        ))}
      </ul>
    </section>
  );
}

const BANNER_TONES = [
  { box: "bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] text-white", note: "text-indigo-100", btn: "bg-white text-brand-strong hover:bg-indigo-50" },
  { box: "bg-gradient-to-br from-[#fbbf24] to-[#f97316] text-slate-900", note: "text-slate-800", btn: "bg-slate-900 text-white hover:bg-slate-800" },
];

/** Two big banners for the largest categories */
function CollectionBanners({ categories, deals }: { categories: Group[]; deals: Product[] }) {
  if (categories.length < 2) return null;

  return (
    <section aria-label="Collections" className="container-x grid gap-5 pt-12 md:grid-cols-2">
      {categories.map((c, i) => {
        const tone = BANNER_TONES[i];
        const best = Math.max(0, ...deals.filter((d) => d.category?.id === c.id).map(discountOf));
        return (
          <Link key={c.id} href={categoryPath(c)} className={`group relative isolate flex min-h-56 items-center overflow-hidden rounded-2xl p-7 sm:min-h-64 sm:p-10 ${tone.box}`}>
            <span aria-hidden="true" className="absolute -right-16 -top-16 -z-10 h-72 w-72 rounded-full bg-white/15" />
            <div className="relative z-10 max-w-[55%]">
              <p className={`text-sm font-semibold ${tone.note}`}>Collection</p>
              <p className="font-display mt-1 text-3xl leading-tight sm:text-4xl">{c.name}</p>
              <p className={`mt-2 text-sm font-semibold sm:text-base ${tone.note}`}>{best ? `Up to ${best}% off` : `${c.products} ${LABELS.items} to choose from`}</p>
              <span className={`mt-5 inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold transition ${tone.btn}`}>
                Shop now <ArrowRightIcon className="h-4 w-4" />
              </span>
            </div>
            <span className="absolute bottom-0 right-0 top-0 w-[42%] overflow-hidden">
              <StoreImage src={c.image} alt="" fallback={c.name} fill sizes="(min-width: 768px) 22rem, 45vw" className="object-cover transition duration-700 [mask-image:linear-gradient(90deg,transparent,black_35%)] group-hover:scale-105" />
            </span>
          </Link>
        );
      })}
    </section>
  );
}

async function AboutAndFaq({ policies }: { policies: SiteBrand["policies"] }) {
  const [{ seo }, content] = await Promise.all([getHomeCopy(), getContent()]);
  const { payment, deliveryDhaka, deliveryOutside, exchangeDays } = policies;
  const faqs = content.faqs.flatMap((g) => g.items).slice(0, 4);

  return (
    <section aria-labelledby="about-shop-heading" className="container-x pt-14">
      <div className="grid gap-10 rounded-2xl border border-line bg-card p-6 sm:p-10 lg:grid-cols-2">
        <div>
          <p className="eyebrow text-hot">{seo.eyebrow}</p>
          <h2 id="about-shop-heading" className="font-display mt-2 text-2xl sm:text-3xl">{seo.title}</h2>
          <div className="prose-store mt-4">
            {seo.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <p>
              Every order is paid by <strong>{payment.toLowerCase()}</strong>, so you pay only when your parcel arrives. We deliver to every district: inside Dhaka in {deliveryDhaka} and outside
              Dhaka in {deliveryOutside}. If something isn&apos;t right, you can exchange it within {exchangeDays} days.
            </p>
          </div>
        </div>
        <div>
          <p className="eyebrow text-hot">Good to know</p>
          <h2 className="font-display mt-2 text-2xl sm:text-3xl">Questions, answered</h2>
          <div className="mt-4 divide-y divide-line">
            {faqs.map((faq) => (
              <details key={faq.q} className="group py-4">
                <summary className="flex items-center justify-between gap-6 font-semibold text-text">
                  {faq.q}
                  <PlusIcon className="h-4 w-4 shrink-0 text-brand-strong transition group-open:rotate-45" />
                </summary>
                <p className="mt-2 text-sm leading-relaxed text-muted">{faq.a}</p>
              </details>
            ))}
          </div>
          <Link href="/faq" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-strong hover:underline">
            All questions <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export async function MarketHome({ store, home }: { store: Store; home: Home }) {
  const brand = await getShopBrand();
  const { deals, best_sellers: bestSellers, new_arrivals: newArrivals, categories } = home;
  // Biggest categories with a photo lead the tiles and banners
  const pictured = [...categories].filter((c) => c.image).sort((a, b) => (b.products ?? 0) - (a.products ?? 0));
  const listed = [...bestSellers, ...newArrivals];

  return (
    <>
      <Hero featured={bestSellers.length ? bestSellers : newArrivals} deals={deals} newArrivals={newArrivals} categories={categories} currency={store.currency} phone={store.phone} />
      <PromoTiles categories={pictured.slice(2, 5)} deals={deals} />
      <Features policies={brand.policies} />
      <Deals deals={deals} store={store} />
      <Categories categories={categories} />
      <TopSelling products={bestSellers} store={store} />
      <CollectionBanners categories={pictured.slice(0, 2)} deals={deals} />

      {newArrivals.length > 0 && (
        <section aria-labelledby="new-heading" className="container-x pt-12">
          <Heading id="new-heading" title="New arrivals" note={<span className="text-sm text-muted">Fresh in this month</span>} href="/products?sort=newest" />
          <MarketGrid products={newArrivals} currency={store.currency} columns={4} />
        </section>
      )}

      {!listed.length && !deals.length && <p className="container-x pt-16 text-center text-muted">New {LABELS.items} are coming soon.</p>}

      <AboutAndFaq policies={brand.policies} />

      {listed.length > 0 && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: `${brand.name}: featured products`,
            itemListElement: listed.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: absoluteUrl(productPath(p)), name: p.name })),
          }}
        />
      )}
    </>
  );
}
