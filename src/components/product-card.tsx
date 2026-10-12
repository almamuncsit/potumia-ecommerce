import Link from "next/link";
import { productPath } from "@/lib/urls";
import type { Currency, Product } from "@/lib/types";
import { QuickAdd } from "./cart/quick-add";
import { Price } from "./price";
import { StoreImage } from "./store-image";

/** Honest signals only: real discounts, real stock, real sales */
function Badges({ product }: { product: Product }) {
  const discount = product.regular_price ? Math.round(((product.regular_price - product.price) / product.regular_price) * 100) : 0;
  const lowStock = product.in_stock && product.stock <= 5;

  return (
    <span className="pointer-events-none absolute left-3 top-3 z-10 flex flex-col items-start gap-1.5">
      {discount > 0 && <span className="rounded-full bg-sale px-2.5 py-1 text-[0.68rem] font-semibold text-white shadow-sm">−{discount}%</span>}
      {product.is_new && !discount && <span className="rounded-full bg-accent-strong px-2.5 py-1 text-[0.68rem] font-semibold text-white shadow-sm">New</span>}
      {!product.in_stock && <span className="rounded-full bg-card/95 px-2.5 py-1 text-[0.68rem] font-semibold text-text shadow-sm">Sold out</span>}
      {lowStock && <span className="rounded-full bg-card/95 px-2.5 py-1 text-[0.68rem] font-semibold text-sale shadow-sm">Only {Math.floor(product.stock)} left</span>}
    </span>
  );
}

export function ProductCard({ product, currency, priority = false }: { product: Product; currency: Currency; priority?: boolean }) {
  const image = product.thumb ?? product.image;

  return (
    <article className="group relative flex h-full flex-col">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-surface">
        <StoreImage
          src={image}
          fallback={product.name}
          alt={product.name}
          fill
          sizes="(min-width: 1280px) 19rem, (min-width: 768px) 30vw, 50vw"
          className={`object-cover transition duration-700 ease-out group-hover:scale-[1.06] ${product.in_stock ? "" : "opacity-60 grayscale-[30%]"}`}
          priority={priority}
        />
        <Badges product={product} />
        <span className="absolute bottom-3 right-3 z-20 translate-y-0 transition duration-300 sm:translate-y-2 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 sm:group-focus-within:translate-y-0 sm:group-focus-within:opacity-100">
          <QuickAdd product={product} />
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1 pt-3.5">
        {product.category && <p className="eyebrow text-[0.62rem] text-muted">{product.category.name}</p>}
        <h3 className="line-clamp-2 text-[0.95rem] leading-snug">
          {/* The link covers the whole card, so one link per product */}
          <Link href={productPath(product)} className="after:absolute after:inset-0 after:rounded-2xl group-hover:text-accent-strong">
            {product.name}
          </Link>
        </h3>
        <div className="mt-auto flex flex-wrap items-baseline justify-between gap-x-2 pt-1">
          <Price price={product.price} regular={product.regular_price} currency={currency} />
          {product.sold > 0 && <span className="text-xs text-muted">{product.sold} sold</span>}
        </div>
      </div>
    </article>
  );
}

export function ProductGrid({ products, currency, eager = 0, columns = 4 }: { products: Product[]; currency: Currency; eager?: number; columns?: 3 | 4 }) {
  return (
    <ul className={`grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 ${columns === 4 ? "lg:grid-cols-4" : ""}`}>
      {products.map((product, i) => (
        <li key={product.id}>
          <ProductCard product={product} currency={currency} priority={i < eager} />
        </li>
      ))}
    </ul>
  );
}
