import Link from "next/link";
import { Carousel } from "@/components/banners/carousel";
import { ArrowRightIcon, CashIcon, ExchangeIcon, ShieldIcon, TruckIcon } from "@/components/icons";
import { Money } from "@/components/price";
import { StoreImage } from "@/components/store-image";
import type { Currency, Product } from "@/lib/types";
import { categoryPath, productPath } from "@/lib/urls";
import type { HeroProps } from "../types";
import { THEME } from "./config";

const { payment, deliveryDhaka, exchangeDays } = THEME.brand.policies;

/** Slide backgrounds: the Potumia gradient, deep navy, and violet → pink */
const TONES = {
  brand: "bg-[linear-gradient(120deg,#4338ca_0%,#5b3fe0_45%,#7c3aed_100%)]",
  navy: "bg-[radial-gradient(90%_120%_at_85%_20%,#312e81_0%,#0f172a_60%)]",
  berry: "bg-[linear-gradient(120deg,#6d28d9_0%,#a21caf_55%,#db2777_100%)]",
};

type SlideData = {
  tone: keyof typeof TONES;
  eyebrow: string;
  title: string;
  text: string;
  cta: string;
  href: string;
  products: Product[];
};

const discountOf = (p: Product) => (p.regular_price ? Math.round(((p.regular_price - p.price) / p.regular_price) * 100) : 0);

/** Three product photos, overlapping like prints on a table, with price tags */
function Collage({ products, currency, priority }: { products: Product[]; currency: Currency; priority: boolean }) {
  const [a, b, c] = products;
  const frame = "absolute overflow-hidden rounded-3xl bg-white/10 shadow-[0_24px_50px_-18px_rgb(0_0_0/0.55)] ring-4 ring-white/90 transition duration-700";

  const tag = (p: Product) => (
    <span className="absolute bottom-3 left-3 rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-900 shadow-md">
      <Money amount={p.price} currency={currency} />
      {discountOf(p) > 0 && <span className="ml-1.5 text-rose-600">−{discountOf(p)}%</span>}
    </span>
  );

  return (
    <div className="relative h-full w-full">
      {a && (
        <Link href={productPath(a)} tabIndex={-1} aria-hidden="true" className={`${frame} right-[18%] top-[6%] aspect-[4/5] w-[52%] -rotate-3 hover:rotate-0`}>
          <StoreImage src={a.image ?? a.thumb} alt="" fallback={a.name} fill sizes="(min-width: 1024px) 18rem, 40vw" className="object-cover" priority={priority} />
          {tag(a)}
        </Link>
      )}
      {b && (
        <Link href={productPath(b)} tabIndex={-1} aria-hidden="true" className={`${frame} bottom-[2%] right-[3%] aspect-square w-[34%] rotate-6 hover:rotate-0`}>
          <StoreImage src={b.thumb ?? b.image} alt="" fallback={b.name} fill sizes="12rem" className="object-cover" />
          {tag(b)}
        </Link>
      )}
      {c && (
        <Link href={productPath(c)} tabIndex={-1} aria-hidden="true" className={`${frame} bottom-[10%] left-[2%] hidden aspect-square w-[32%] -rotate-6 hover:rotate-0 sm:block`}>
          <StoreImage src={c.thumb ?? c.image} alt="" fallback={c.name} fill sizes="11rem" className="object-cover" />
          {tag(c)}
        </Link>
      )}
    </div>
  );
}

function Slide({ slide, currency, priority }: { slide: SlideData; currency: Currency; priority: boolean }) {
  return (
    <div className={`relative grid h-full grid-rows-[auto_1fr] overflow-hidden text-white md:grid-cols-[1.05fr_1fr] md:grid-rows-1 ${TONES[slide.tone]}`}>
      {/* Soft circles, as on the Potumia website */}
      <span aria-hidden="true" className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-sky-300/20 blur-2xl" />
      <span aria-hidden="true" className="absolute -right-16 -top-24 h-72 w-72 rounded-full bg-white/10" />

      <div className="relative z-10 flex flex-col justify-center px-6 pb-2 pt-8 sm:px-10 md:py-10 lg:px-12">
        <p className="inline-flex w-fit items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider ring-1 ring-white/25 backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-sky-300" aria-hidden="true" />
          {slide.eyebrow}
        </p>
        <h2 className="font-display mt-4 text-[2rem] leading-[1.05] sm:text-5xl lg:text-[3.4rem]">{slide.title}</h2>
        <p className="mt-3 max-w-md text-sm text-white/80 sm:text-base">{slide.text}</p>
        <div className="mt-6">
          <Link href={slide.href} className="btn btn-accent">
            {slide.cta} <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
      <div className="relative z-10 mb-14 min-h-[11rem] md:mb-16 md:min-h-0">
        <Collage products={slide.products} currency={currency} priority={priority} />
      </div>
    </div>
  );
}

/** A photo tile beside the carousel (new arrivals, best sellers) */
function Tile({ product, eyebrow, title, href }: { product?: Product; eyebrow: string; title: string; href: string }) {
  return (
    <Link href={href} className="group relative isolate flex min-h-[10rem] flex-1 overflow-hidden rounded-3xl bg-slate-900 p-5 text-white">
      {product && (
        <StoreImage
          src={product.image ?? product.thumb}
          alt=""
          fallback={product.name}
          fill
          sizes="(min-width: 1024px) 20rem, 50vw"
          className="-z-10 object-cover transition duration-700 group-hover:scale-105"
        />
      )}
      <span aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />
      <span className="mt-auto">
        <span className="block text-xs font-semibold uppercase tracking-wider text-sky-200">{eyebrow}</span>
        <span className="font-display mt-1 flex items-center gap-2 text-xl sm:text-2xl">
          {title} <ArrowRightIcon className="h-5 w-5 transition group-hover:translate-x-1" />
        </span>
      </span>
    </Link>
  );
}

/** The slides, built from the store's own catalog: today's deals, then the biggest categories */
function slidesFor({ deals, featured, newArrivals, categories }: HeroProps): SlideData[] {
  const withImage = (list: Product[]) => list.filter((p) => p.image || p.thumb);
  const pool = withImage([...deals, ...featured, ...newArrivals]).filter((p, i, all) => all.findIndex((q) => q.id === p.id) === i);
  const slides: SlideData[] = [];

  const dealList = withImage(deals);
  if (dealList.length) {
    const best = Math.max(...dealList.map(discountOf));
    const names = Array.from(new Set(dealList.map((p) => p.category?.name).filter(Boolean))).slice(0, 2);
    slides.push({
      tone: "brand",
      eyebrow: "Today's deals",
      title: `Up to ${best}% off`,
      text: `${names.length ? `On ${names.join(", ")} and more. ` : ""}${payment} anywhere in Bangladesh.`,
      cta: "Shop deals",
      href: "/products?on_sale=1",
      products: dealList.slice(0, 3),
    });
  }

  const tones: (keyof typeof TONES)[] = ["navy", "berry"];
  const ranked = [...categories].filter((c) => (c.products ?? 0) > 0).sort((a, b) => (b.products ?? 0) - (a.products ?? 0));
  for (const category of ranked) {
    if (slides.length >= 3) break;
    const products = pool.filter((p) => p.category?.id === category.id).slice(0, 3);
    if (products.length < 2) continue;
    slides.push({
      tone: tones[slides.length % 2],
      eyebrow: "Just landed",
      title: `Fresh picks in ${category.name}`,
      text: `${category.products} ${category.products === 1 ? THEME.labels.item : THEME.labels.items} ready to ship. Delivered in ${deliveryDhaka} inside Dhaka.`,
      cta: `Shop ${category.name}`,
      href: categoryPath(category),
      products,
    });
  }

  if (!slides.length) {
    slides.push({
      tone: "brand",
      eyebrow: `${payment} · Easy exchange`,
      title: "Everything you need, delivered to your door",
      text: "Shop everyday products at fair prices and pay in cash when your parcel arrives.",
      cta: "Shop now",
      href: "/products",
      products: pool.slice(0, 3),
    });
  }
  return slides;
}

const PROMISES = [
  { Icon: CashIcon, title: payment, text: "Pay when it arrives" },
  { Icon: TruckIcon, title: "Fast delivery", text: `${deliveryDhaka} inside Dhaka` },
  { Icon: ExchangeIcon, title: `${exchangeDays}-day exchange`, text: "No-hassle returns" },
  { Icon: ShieldIcon, title: "Genuine products", text: "Checked before packing" },
];

/**
 * Potumia's home top: a colourful carousel of real deals and categories with
 * product photo collages, "New arrivals" and "Best sellers" photo tiles beside
 * it, and the store's promises underneath.
 */
export function Hero(props: HeroProps) {
  const slides = slidesFor(props);
  const newest = props.newArrivals.find((p) => p.image || p.thumb);
  const favourite = props.featured.find((p) => (p.image || p.thumb) && p.id !== newest?.id);

  return (
    <section aria-labelledby="home-title" className="surface-soft border-b border-line">
      <h1 id="home-title" className="sr-only">
        {THEME.brand.name}: {THEME.brand.tagline}
      </h1>
      <div className="container-x grid gap-4 pt-5 sm:gap-5 sm:pt-6 lg:grid-cols-[1fr_19rem]">
        <Carousel label="Featured" className="h-[30rem] rounded-3xl shadow-[0_24px_48px_-24px_rgb(49_46_129/0.6)] sm:h-[27rem] lg:h-[29rem]">
          {slides.map((slide, i) => (
            <Slide key={slide.title} slide={slide} currency={props.currency} priority={i === 0} />
          ))}
        </Carousel>
        <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-1 lg:grid-rows-2">
          <Tile product={newest} eyebrow="Just in" title="New arrivals" href="/products?sort=newest" />
          <Tile product={favourite} eyebrow="Customer favourites" title="Best sellers" href="/products?sort=popular" />
        </div>
      </div>
      <ul className="container-x grid grid-cols-2 gap-4 py-6 lg:grid-cols-4">
        {PROMISES.map(({ Icon, title, text }) => (
          <li key={title} className="flex items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-card text-accent-strong shadow-sm ring-1 ring-line">
              <Icon className="h-5 w-5" />
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-semibold text-text">{title}</span>
              <span className="text-xs text-muted">{text}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
