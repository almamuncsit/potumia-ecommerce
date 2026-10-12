import Link from "next/link";
import { ArrowRightIcon, ChevronDownIcon } from "@/components/icons";
import { Slider } from "@/components/market/slider";
import { Money } from "@/components/price";
import { StoreImage } from "@/components/store-image";
import type { Currency, Group, Product } from "@/lib/types";
import { categoryPath, productPath } from "@/lib/urls";
import type { HeroProps } from "../types";
import { THEME } from "./config";

const { brand, labels } = THEME;

type Slide = {
  key: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  text: string;
  cta: string;
  href: string;
  /** Background and decoration colours */
  tone: "amber" | "indigo" | "sky" | "rose";
  image: string | null;
  imageAlt: string;
  /** Product shown with its price, when the slide is about one product */
  product?: Product;
};

const TONES: Record<Slide["tone"], { bg: string; blob: string; eyebrow: string }> = {
  amber: { bg: "bg-[#fff4e6]", blob: "bg-orange-200/60", eyebrow: "text-orange-600" },
  indigo: { bg: "bg-[#eef0ff]", blob: "bg-indigo-200/60", eyebrow: "text-indigo-600" },
  sky: { bg: "bg-[#e6f6fd]", blob: "bg-sky-200/70", eyebrow: "text-sky-700" },
  rose: { bg: "bg-[#fdeef2]", blob: "bg-rose-200/60", eyebrow: "text-rose-600" },
};

// For a product with variations: the biggest saving among them
const discountOf = (p: Product) =>
  p.has_variants ? p.max_discount ?? 0 : p.regular_price ? Math.round(((p.regular_price - p.price) / p.regular_price) * 100) : 0;

/** Slides from the shop's own data: the best deal, what's new, the biggest categories */
function slidesFor({ deals = [], newArrivals = [], categories = [], featured }: HeroProps): Slide[] {
  const slides: Slide[] = [];
  const best = Math.max(0, ...deals.map(discountOf));

  if (deals.length && best > 0) {
    const lead = deals[0];
    const names = [...new Set(deals.map((d) => d.category?.name).filter(Boolean))].slice(0, 2);
    slides.push({
      key: "deals",
      eyebrow: "Hot right now",
      title: `Sale up to ${best}% off`,
      subtitle: names.length ? `on ${names.join(" & ")}` : undefined,
      text: `${deals.length} ${deals.length === 1 ? labels.item : labels.items} at lower prices. Order now and pay cash when it arrives.`,
      cta: "Shop deals",
      href: "/products?on_sale=1",
      tone: "amber",
      image: lead.image ?? lead.thumb,
      imageAlt: lead.name,
      product: lead,
    });
  }

  const fresh = newArrivals[0] ?? featured[0];
  if (fresh) {
    slides.push({
      key: "new",
      eyebrow: "Just arrived",
      title: "New arrivals",
      subtitle: "fresh stock every week",
      text: `Be the first to get the latest ${labels.items}, like ${fresh.name}.`,
      cta: "See what's new",
      href: "/products?sort=newest",
      tone: "indigo",
      image: fresh.image ?? fresh.thumb,
      imageAlt: fresh.name,
      product: fresh,
    });
  }

  const tones: Slide["tone"][] = ["sky", "rose"];
  [...categories]
    .filter((c) => c.image)
    .sort((a, b) => (b.products ?? 0) - (a.products ?? 0))
    .slice(0, 2)
    .forEach((c, i) =>
      slides.push({
        key: `cat-${c.id}`,
        eyebrow: `${c.products} ${c.products === 1 ? labels.item : labels.items}`,
        title: c.name,
        subtitle: "top picks, fair prices",
        text: c.description || `Shop ${c.name.toLowerCase()} online with ${brand.policies.payment.toLowerCase()} across ${brand.country}.`,
        cta: `Shop ${c.name}`,
        href: categoryPath(c),
        tone: tones[i],
        image: c.image ?? null,
        imageAlt: c.name,
      }),
    );

  if (!slides.length) {
    slides.push({
      key: "brand",
      eyebrow: brand.policies.payment,
      title: brand.name,
      subtitle: "everyday shopping, made simple",
      text: brand.description,
      cta: "Start shopping",
      href: "/products",
      tone: "indigo",
      image: null,
      imageAlt: "",
    });
  }

  return slides;
}

function SlideView({ slide, currency, first }: { slide: Slide; currency: Currency; first: boolean }) {
  const tone = TONES[slide.tone];
  const discount = slide.product ? discountOf(slide.product) : 0;

  return (
    <div className={`relative isolate grid h-full items-center gap-6 overflow-hidden px-6 pb-12 pt-6 sm:grid-cols-[1.1fr_0.9fr] sm:px-10 sm:py-10 lg:px-14 ${tone.bg}`}>
      {/* Soft shapes behind the photo */}
      <span aria-hidden="true" className={`absolute -right-20 -top-24 -z-10 h-80 w-80 rounded-full ${tone.blob}`} />
      <span aria-hidden="true" className={`absolute -bottom-28 right-1/3 -z-10 h-56 w-56 rounded-full ${tone.blob} opacity-60`} />

      <div className="order-2 sm:order-1">
        <p className={`text-sm font-semibold uppercase tracking-wider ${tone.eyebrow}`}>{slide.eyebrow}</p>
        <p className="font-display mt-2 text-[2rem] leading-[1.05] text-text sm:text-[2.6rem] lg:text-[3.2rem]">{slide.title}</p>
        {slide.subtitle && <p className="font-display mt-1 text-xl text-text/70 sm:text-2xl">{slide.subtitle}</p>}
        <p className="mt-3 line-clamp-2 max-w-md text-sm leading-relaxed text-muted sm:text-base">{slide.text}</p>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Link href={slide.href} className="btn btn-primary">
            {slide.cta} <ArrowRightIcon className="h-4 w-4" />
          </Link>
          {slide.product && (
            <Link href={productPath(slide.product)} className="text-sm font-semibold text-text underline-offset-4 hover:underline">
              View {labels.item}
            </Link>
          )}
        </div>
      </div>

      <div className="relative order-1 mx-auto aspect-square w-48 sm:order-2 sm:w-full sm:max-w-[19rem] lg:max-w-[21rem]">
        <div className="absolute inset-0 rotate-3 overflow-hidden rounded-[2rem] border-[6px] border-white bg-white shadow-[0_30px_60px_-30px_rgb(15_23_42/0.55)]">
          <StoreImage src={slide.image} alt={slide.imageAlt} fallback={slide.title} fill sizes="(min-width: 1024px) 21rem, (min-width: 640px) 40vw, 12rem" className="object-cover" priority={first} />
        </div>
        {slide.product && (
          <span className="absolute -right-3 -top-3 grid h-20 w-20 place-items-center rounded-full bg-brand text-center text-white shadow-lg ring-4 ring-white sm:h-24 sm:w-24">
            <span className="leading-tight">
              {discount > 0 && <span className="block text-[0.65rem] font-semibold uppercase">−{discount}%</span>}
              <span className="block text-sm font-bold sm:text-base">
                <Money amount={slide.product.price} currency={currency} />
              </span>
            </span>
          </span>
        )}
      </div>
    </div>
  );
}

/** Category list beside the slides (large screens) */
function CategoryPanel({ categories }: { categories: Group[] }) {
  return (
    <nav aria-labelledby="hero-categories" className="hidden overflow-hidden rounded-2xl border border-line bg-card lg:flex lg:flex-col">
      <h2 id="hero-categories" className="border-b border-line px-5 py-4 text-base font-bold text-text">
        {labels.collections}
      </h2>
      <ul className="flex-1 py-2">
        {categories.slice(0, 9).map((c) => (
          <li key={c.id}>
            <Link href={categoryPath(c)} className="group flex items-center gap-3 px-5 py-2 text-sm hover:bg-brand-soft hover:text-brand-strong">
              <span className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full bg-surface ring-1 ring-line">
                <StoreImage src={c.image} alt="" fallback={c.name} fallbackClassName="text-xs" fill sizes="1.75rem" className="object-cover" />
              </span>
              <span className="flex-1 truncate">{c.name}</span>
              <span className="rounded-md bg-surface px-1.5 py-0.5 text-[0.7rem] text-muted group-hover:bg-card">{c.products}</span>
            </Link>
          </li>
        ))}
      </ul>
      {categories.length > 9 && (
        <Link href="/categories" className="flex items-center gap-1 border-t border-line px-5 py-3 text-sm font-semibold text-hot hover:text-sale">
          See all {categories.length} <ChevronDownIcon className="h-4 w-4 -rotate-90" />
        </Link>
      )}
    </nav>
  );
}

/**
 * Potumia's home hero, as a shop front: the category list beside sliding
 * banners built from the shop's own deals, new arrivals and categories.
 */
export function Hero(props: HeroProps) {
  const slides = slidesFor(props);
  const categories = props.categories ?? [];

  return (
    <section className="container-x pt-4 sm:pt-6">
      <h1 className="sr-only">
        {brand.name}: {brand.tagline}
      </h1>
      <div className={`grid gap-5 ${categories.length ? "lg:grid-cols-[16rem_1fr]" : ""}`}>
        {categories.length > 0 && <CategoryPanel categories={categories} />}
        <div className="min-h-[26rem] lg:min-h-[28rem]">
          <Slider label="Featured offers" slides={slides.map((slide, i) => <SlideView key={slide.key} slide={slide} currency={props.currency} first={i === 0} />)} />
        </div>
      </div>
      {/* Phones and tablets: categories as a swipeable row of photos */}
      {categories.length > 0 && (
        <nav aria-label={labels.collections} className="-mx-4 mt-4 overflow-x-auto px-4 [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:hidden [&::-webkit-scrollbar]:hidden">
          <ul className="flex gap-4">
            {categories.map((c) => (
              <li key={c.id} className="w-16 shrink-0">
                <Link href={categoryPath(c)} className="flex flex-col items-center gap-1.5 text-center">
                  <span className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-card bg-surface shadow-sm ring-1 ring-line">
                    <StoreImage src={c.image} alt="" fallback={c.name} fallbackClassName="text-xl" fill sizes="4rem" className="object-cover" />
                  </span>
                  <span className="line-clamp-2 text-[0.7rem] font-medium leading-tight">{c.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </section>
  );
}
