import Link from "next/link";
import type { Currency, Product } from "@/lib/types";
import { productPath } from "@/lib/urls";
import { AddButton } from "../cart/add-button";
import { Money } from "../price";
import { StoreImage } from "../store-image";

/**
 * Product cards for the marketplace layout: white, bordered, with the saving,
 * real sales and stock numbers from the shop, and "Add to cart" on the card.
 */

export const discountOf = (p: Product) => (p.regular_price ? Math.round(((p.regular_price - p.price) / p.regular_price) * 100) : 0);

function Badges({ product }: { product: Product }) {
  const discount = discountOf(product);
  const fewLeft = product.in_stock && product.stock > 0 && product.stock <= 5;

  return (
    <span className="pointer-events-none absolute left-2.5 top-2.5 z-10 flex flex-col items-start gap-1">
      {discount > 0 && <span className="rounded-md bg-hot px-2 py-0.5 text-[0.7rem] font-bold text-white">−{discount}%</span>}
      {product.is_new && <span className="rounded-md bg-brand px-2 py-0.5 text-[0.7rem] font-bold text-white">New</span>}
      {!product.in_stock && <span className="rounded-md bg-text/80 px-2 py-0.5 text-[0.7rem] font-bold text-white">Sold out</span>}
      {fewLeft && <span className="rounded-md bg-card px-2 py-0.5 text-[0.7rem] font-bold text-sale ring-1 ring-sale/30">Only {product.stock} left</span>}
    </span>
  );
}

export function PriceLine({ product, currency, size = "md" }: { product: Product; currency: Currency; size?: "md" | "lg" }) {
  return (
    <span className="flex flex-wrap items-baseline gap-x-2">
      <span className={`font-bold ${size === "lg" ? "text-2xl" : "text-base"} ${product.regular_price ? "text-hot" : "text-brand-strong"}`}>
        <Money amount={product.price} currency={currency} />
      </span>
      {product.regular_price ? (
        <s className="text-sm text-muted">
          <span className="sr-only">Regular price </span>
          <Money amount={product.regular_price} currency={currency} />
        </s>
      ) : null}
    </span>
  );
}

export function MarketCard({ product, currency, priority = false }: { product: Product; currency: Currency; priority?: boolean }) {
  return (
    <article className="group relative flex h-full flex-col rounded-xl border border-line bg-card p-2.5 transition duration-300 hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-[0_14px_34px_-18px_rgb(15_23_42/0.35)] sm:p-3">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-surface">
        <StoreImage
          src={product.thumb ?? product.image}
          fallback={product.name}
          alt={product.name}
          fill
          sizes="(min-width: 1280px) 15rem, (min-width: 768px) 30vw, 50vw"
          className="object-cover transition duration-500 group-hover:scale-105"
          priority={priority}
        />
        <Badges product={product} />
      </div>
      <div className="flex flex-1 flex-col pt-3">
        {product.category && <p className="truncate text-xs text-muted">{product.category.name}</p>}
        <h3 className="mt-0.5 line-clamp-2 min-h-[2.6em] text-sm font-semibold leading-snug text-text">
          {/* The link covers the whole card; the cart button sits above it */}
          <Link href={productPath(product)} className="after:absolute after:inset-0 after:rounded-xl group-hover:text-brand-strong">
            {product.name}
          </Link>
        </h3>
        <div className="mt-2 flex items-end justify-between gap-2">
          <PriceLine product={product} currency={currency} />
          {(product.sold ?? 0) > 0 && <span className="shrink-0 pb-0.5 text-[0.7rem] text-muted">{product.sold} sold</span>}
        </div>
        <div className="mt-auto pt-3">
          <AddButton product={product} />
        </div>
      </div>
    </article>
  );
}

const COLUMNS = {
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-4 xl:grid-cols-5",
  6: "lg:grid-cols-6",
};

export function MarketGrid({ products, currency, eager = 0, columns = 5 }: { products: Product[]; currency: Currency; eager?: number; columns?: keyof typeof COLUMNS }) {
  return (
    <ul className={`grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 ${COLUMNS[columns]}`}>
      {products.map((product, i) => (
        <li key={product.id}>
          <MarketCard product={product} currency={currency} priority={i < eager} />
        </li>
      ))}
    </ul>
  );
}

/** Small side-by-side card for "top selling" lists */
export function ListCard({ product, currency, rank }: { product: Product; currency: Currency; rank?: number }) {
  return (
    <article className="group relative flex h-full gap-4 rounded-xl border border-line bg-card p-3 transition hover:border-brand/30 hover:shadow-md">
      <div className="relative aspect-square w-24 shrink-0 overflow-hidden rounded-lg bg-surface sm:w-28">
        <StoreImage src={product.thumb ?? product.image} fallback={product.name} fallbackClassName="text-3xl" alt={product.name} fill sizes="7rem" className="object-cover transition duration-500 group-hover:scale-105" />
        {rank && <span className="absolute left-1.5 top-1.5 grid h-6 min-w-6 place-items-center rounded-md bg-text px-1 text-xs font-bold text-white">#{rank}</span>}
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center">
        {product.category && <p className="truncate text-xs text-muted">{product.category.name}</p>}
        <h3 className="mt-0.5 line-clamp-2 text-sm font-semibold leading-snug">
          <Link href={productPath(product)} className="after:absolute after:inset-0 after:rounded-xl group-hover:text-brand-strong">
            {product.name}
          </Link>
        </h3>
        <div className="mt-2">
          <PriceLine product={product} currency={currency} />
        </div>
        {(product.sold ?? 0) > 0 && <p className="mt-1 text-xs font-medium text-ok">{product.sold} sold recently</p>}
      </div>
    </article>
  );
}

/**
 * A large deal card: photo, saving, and how much of the stock has gone
 * (sold in the last 90 days against what's left), from the shop's numbers.
 */
export function DealCard({ product, currency }: { product: Product; currency: Currency }) {
  const discount = discountOf(product);
  const sold = product.sold ?? 0;
  const total = sold + product.stock;
  const share = total > 0 ? Math.round((sold / total) * 100) : 0;

  return (
    <article className="group relative grid h-full grid-cols-[40%_1fr] overflow-hidden rounded-2xl border-2 border-brand/15 bg-card transition hover:border-brand/40 sm:grid-cols-[0.95fr_1fr]">
      <div className="relative min-h-48 overflow-hidden bg-surface sm:min-h-64">
        <StoreImage src={product.image ?? product.thumb} fallback={product.name} alt={product.name} fill sizes="(min-width: 1024px) 18rem, 90vw" className="object-cover transition duration-700 group-hover:scale-105" />
        {/* Corner ribbon */}
        <span aria-hidden="true" className="absolute -left-10 top-5 w-36 -rotate-45 bg-brand py-1 text-center text-[0.65rem] font-bold uppercase tracking-wider text-white shadow">
          Top deal
        </span>
      </div>
      <div className="flex min-w-0 flex-col justify-center gap-2.5 p-4 sm:gap-3 sm:p-6">
        <p className="text-xs font-medium text-muted">
          {[product.category?.name, product.brand?.name].filter(Boolean).join(" · ")}
        </p>
        <h3 className="font-display line-clamp-2 text-base leading-tight sm:text-xl">
          <Link href={productPath(product)} className="after:absolute after:inset-0 group-hover:text-brand-strong">
            {product.name}
          </Link>
        </h3>
        <div className="flex flex-wrap items-center gap-3">
          <PriceLine product={product} currency={currency} size="lg" />
          {discount > 0 && <span className="hidden rounded-md bg-hot/10 px-2 py-1 text-xs font-bold text-hot sm:inline">Save {discount}%</span>}
        </div>
        {/* How much has gone; with no sales yet there is nothing to show but the stock */}
        <div>
          {sold > 0 && (
            <div className="mb-1.5 h-2 overflow-hidden rounded-full bg-surface" aria-hidden="true">
              <div className="h-full rounded-full bg-gradient-to-r from-hot to-amber-400" style={{ width: `${Math.max(share, 6)}%` }} />
            </div>
          )}
          <p className="flex justify-between text-xs text-muted">
            <span>
              {product.stock <= 10 ? "Only " : "Available: "}
              <strong className="text-text">{product.stock}</strong>
              {product.stock <= 10 ? " left" : ""}
            </span>
            {sold > 0 && (
              <span>
                Sold: <strong className="text-text">{sold}</strong>
              </span>
            )}
          </p>
        </div>
        <div className="w-full sm:max-w-48">
          <AddButton product={product} />
        </div>
      </div>
    </article>
  );
}
