import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { ProductGrid } from "@/components/product-card";
import { getHome, getStore } from "@/lib/catalog";
import { absoluteUrl, categoryPath, productPath } from "@/lib/urls";

export default async function HomePage() {
  const [store, home] = await Promise.all([getStore(), getHome()]);
  const featured = home.best_sellers.length ? home.best_sellers : home.new_arrivals;
  const newArrivals = home.new_arrivals.filter((p) => !featured.some((f) => f.id === p.id));

  return (
    <div className="space-y-12">
      <section className="rounded-2xl bg-brand-soft px-6 py-10 sm:px-10 sm:py-14">
        <h1 className="max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">{store.name}</h1>
        {store.description && <p className="mt-3 max-w-2xl text-lg text-muted">{store.description}</p>}
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/products" className="btn btn-primary">Shop all products</Link>
          {home.categories.length > 0 && <Link href="/categories" className="btn btn-outline">Browse categories</Link>}
        </div>
      </section>

      {home.categories.length > 0 && (
        <section aria-labelledby="categories-heading">
          <h2 id="categories-heading" className="text-xl font-semibold">Shop by category</h2>
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {home.categories.map((category) => (
              <li key={category.id}>
                <Link href={categoryPath(category)} className="block rounded-xl border border-line bg-card p-4 hover:border-brand">
                  <span className="block font-medium">{category.name}</span>
                  <span className="text-sm text-muted">{category.products} {category.products === 1 ? "product" : "products"}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {featured.length > 0 && (
        <section aria-labelledby="featured-heading">
          <div className="flex items-baseline justify-between gap-4">
            <h2 id="featured-heading" className="text-xl font-semibold">{home.best_sellers.length ? "Best sellers" : "Our products"}</h2>
            <Link href="/products?sort=popular" className="text-sm font-medium text-brand hover:underline">See all</Link>
          </div>
          <div className="mt-4">
            <ProductGrid products={featured} currency={store.currency} eager={4} />
          </div>
        </section>
      )}

      {newArrivals.length > 0 && (
        <section aria-labelledby="new-heading">
          <div className="flex items-baseline justify-between gap-4">
            <h2 id="new-heading" className="text-xl font-semibold">New arrivals</h2>
            <Link href="/products?sort=newest" className="text-sm font-medium text-brand hover:underline">See all</Link>
          </div>
          <div className="mt-4">
            <ProductGrid products={newArrivals} currency={store.currency} />
          </div>
        </section>
      )}

      {featured.length === 0 && (
        <p className="rounded-xl border border-dashed border-line p-10 text-center text-muted">Products are coming soon.</p>
      )}

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: `${store.name}: featured products`,
          itemListElement: featured.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: absoluteUrl(productPath(p)), name: p.name })),
        }}
      />
    </div>
  );
}
