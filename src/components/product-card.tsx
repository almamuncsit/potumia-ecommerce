import Link from "next/link";
import { THEME } from "@/lib/brand";
import { productPath } from "@/lib/urls";
import type { Currency, Product } from "@/lib/types";
import { MarketGrid } from "./market/cards";
import { Price } from "./price";
import { StoreImage } from "./store-image";

export function ProductCard({ product, currency, priority = false }: { product: Product; currency: Currency; priority?: boolean }) {
  const image = product.image ?? product.thumb;
  const discount = product.regular_price ? Math.round(((product.regular_price - product.price) / product.regular_price) * 100) : 0;

  return (
    <article className="group relative flex flex-col">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-surface">
        <StoreImage
          src={image}
          fallback={product.name}
          alt={product.name}
          fill
          sizes="(min-width: 1280px) 19rem, (min-width: 768px) 30vw, 50vw"
          className="object-cover transition duration-700 ease-out group-hover:scale-[1.05]"
          priority={priority}
        />
        <span className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {discount > 0 && <span className="rounded-full bg-ink px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-[0.14em] text-accent-light">−{discount}%</span>}
          {!product.in_stock && <span className="rounded-full bg-card/90 px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-[0.14em] text-text">Sold out</span>}
        </span>
        <span aria-hidden="true" className="absolute inset-x-3 bottom-3 translate-y-3 rounded-full bg-card/95 py-2.5 text-center text-[0.7rem] font-medium uppercase tracking-[0.18em] opacity-0 shadow-lg backdrop-blur transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          View details
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1 pt-4">
        {product.category && <p className="eyebrow text-[0.62rem] text-muted">{product.category.name}</p>}
        <h3 className="line-clamp-2 text-[0.95rem] leading-snug">
          {/* The link covers the whole card, so one link per product */}
          <Link href={productPath(product)} className="after:absolute after:inset-0 after:rounded-2xl group-hover:text-accent-strong">
            {product.name}
          </Link>
        </h3>
        <div className="mt-1">
          <Price price={product.price} regular={product.regular_price} currency={currency} />
        </div>
      </div>
    </article>
  );
}

export function ProductGrid({ products, currency, eager = 0, columns = 4 }: { products: Product[]; currency: Currency; eager?: number; columns?: 3 | 4 }) {
  // Marketplace cards are smaller, so one more fits per row
  if (THEME.ui.layout === "marketplace") return <MarketGrid products={products} currency={currency} eager={eager} columns={columns === 3 ? 4 : 5} />;

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
