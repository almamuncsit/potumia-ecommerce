import Link from "next/link";
import { LABELS } from "@/lib/brand";
import { getBrands, getCategories, getProducts, getStore } from "@/lib/catalog";
import type { Group, ProductFilters } from "@/lib/types";
import { ChevronDownIcon } from "./icons";
import { Pagination } from "./pagination";
import { ProductGrid } from "./product-card";

export type SearchParams = Record<string, string | string[] | undefined>;

const SORTS = [
  ["newest", "Newest"],
  ["popular", "Best selling"],
  ["price_asc", "Price: low to high"],
  ["price_desc", "Price: high to low"],
  ["name_asc", "Name: A–Z"],
] as const;

const one = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value)?.trim() || undefined;
const num = (value: string | string[] | undefined) => {
  const n = Number(one(value));
  return Number.isFinite(n) && n > 0 ? n : undefined;
};

/** URL query → API filters (anything unknown is ignored) */
export function parseFilters(sp: SearchParams): ProductFilters {
  const sort = one(sp.sort);
  return {
    q: one(sp.q)?.slice(0, 100),
    category: num(sp.category),
    brand: num(sp.brand),
    min_price: num(sp.min_price),
    max_price: num(sp.max_price),
    in_stock: one(sp.in_stock) === "1" || undefined,
    sort: SORTS.some(([key]) => key === sort) ? (sort as ProductFilters["sort"]) : undefined,
    page: num(sp.page),
  };
}

/** Any filter beyond plain paging makes a page we keep out of search indexes */
export const isFiltered = (f: ProductFilters) =>
  Boolean(f.q || f.category || f.brand || f.min_price || f.max_price || f.in_stock || f.sort);

function toQuery(filters: ProductFilters, fixed: ProductFilters = {}) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value === undefined || value === false || key in fixed) continue;
    query.set(key, value === true ? "1" : String(value));
  }
  return query;
}

type FilterOptions = {
  filters: ProductFilters;
  basePath: string;
  categories: Group[];
  brands: Group[];
  currencySymbol: string;
  idPrefix: string;
};

/** The filter form (a GET form: works without JavaScript and every result is a shareable URL) */
function FilterForm({ filters, basePath, categories, brands, currencySymbol, idPrefix }: FilterOptions) {
  const label = "eyebrow block text-[0.65rem] text-muted";

  return (
    <form action={basePath} className="space-y-6 text-sm">
      <div className="space-y-2">
        <label htmlFor={`${idPrefix}-q`} className={label}>Search</label>
        <input id={`${idPrefix}-q`} name="q" type="search" defaultValue={filters.q} placeholder="Product name" className="field" />
      </div>
      {categories.length > 0 && (
        <div className="space-y-2">
          <label htmlFor={`${idPrefix}-category`} className={label}>{LABELS.collection}</label>
          <select id={`${idPrefix}-category`} name="category" defaultValue={filters.category ?? ""} className="field">
            <option value="">All {LABELS.collections.toLowerCase()}</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      )}
      {brands.length > 0 && (
        <div className="space-y-2">
          <label htmlFor={`${idPrefix}-brand`} className={label}>Brand</label>
          <select id={`${idPrefix}-brand`} name="brand" defaultValue={filters.brand ?? ""} className="field">
            <option value="">All brands</option>
            {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>
      )}
      <fieldset className="space-y-2">
        <legend className={label}>Price ({currencySymbol})</legend>
        <div className="flex items-center gap-2">
          <input name="min_price" type="number" min="0" inputMode="decimal" placeholder="Min" defaultValue={filters.min_price} className="field" aria-label="Minimum price" />
          <span aria-hidden="true" className="text-muted">–</span>
          <input name="max_price" type="number" min="0" inputMode="decimal" placeholder="Max" defaultValue={filters.max_price} className="field" aria-label="Maximum price" />
        </div>
      </fieldset>
      <label className="flex cursor-pointer items-center gap-3">
        <input name="in_stock" type="checkbox" value="1" defaultChecked={filters.in_stock} className="h-4 w-4 accent-[var(--accent-strong)]" />
        In stock only
      </label>
      <div className="space-y-2">
        <label htmlFor={`${idPrefix}-sort`} className={label}>Sort by</label>
        <select id={`${idPrefix}-sort`} name="sort" defaultValue={filters.sort ?? "newest"} className="field">
          {SORTS.map(([key, text]) => <option key={key} value={key}>{text}</option>)}
        </select>
      </div>
      <div className="flex gap-2 pt-1">
        <button type="submit" className="btn btn-primary flex-1">Apply</button>
        {isFiltered(filters) && <Link href={basePath} className="btn btn-outline">Clear</Link>}
      </div>
    </form>
  );
}

/**
 * Filters and the matching products. `fixed` filters belong to the page (a
 * category or brand page) and aren't offered as choices.
 */
export async function Listing({ filters, basePath, fixed = {} }: { filters: ProductFilters; basePath: string; fixed?: ProductFilters }) {
  const [store, results, categories, brands] = await Promise.all([
    getStore(),
    getProducts({ ...filters, ...fixed, per_page: 24 }),
    fixed.category ? Promise.resolve([] as Group[]) : getCategories(),
    fixed.brand ? Promise.resolve([] as Group[]) : getBrands(),
  ]);
  const pageHref = (page: number) => {
    const query = toQuery({ ...filters, page: page > 1 ? page : undefined }, fixed);
    return query.size ? `${basePath}?${query}` : basePath;
  };
  const options = { filters, basePath, categories, brands, currencySymbol: store.currency.symbol };
  const sortLabel = SORTS.find(([key]) => key === (filters.sort ?? "newest"))?.[1];

  return (
    <div className="grid gap-10 lg:grid-cols-[16rem_1fr]">
      <aside className="hidden lg:block">
        <div className="sticky top-28 rounded-2xl border border-line bg-card p-6">
          <h2 className="font-display mb-6 text-2xl">Refine</h2>
          <FilterForm {...options} idPrefix="filter" />
        </div>
      </aside>

      <section aria-label="Products">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
          <p className="text-sm text-muted" role="status">
            <span className="font-medium text-text">{results.meta.total}</span> {results.meta.total === 1 ? LABELS.item : LABELS.items}
            {filters.q ? <> for “<span className="text-text">{filters.q}</span>”</> : null}
          </p>
          <p className="hidden text-sm text-muted lg:block">Sorted by {sortLabel?.toLowerCase()}</p>
          <details className="group w-full lg:hidden">
            <summary className="btn btn-outline w-full">
              Filter & sort <ChevronDownIcon className="h-4 w-4 transition group-open:rotate-180" />
            </summary>
            <div className="mt-4 rounded-2xl border border-line bg-card p-5">
              <FilterForm {...options} idPrefix="filter-m" />
            </div>
          </details>
        </div>

        {results.data.length ? (
          <ProductGrid products={results.data} currency={store.currency} eager={4} columns={3} />
        ) : (
          <div className="rounded-3xl border border-dashed border-line px-6 py-16 text-center">
            <p className="font-display text-3xl">Nothing matches, yet</p>
            <p className="mt-2 text-muted">Try another search, or clear the filters to see everything.</p>
            <Link href={basePath} className="btn btn-primary mt-6">See all {LABELS.items}</Link>
          </div>
        )}
        <Pagination meta={results.meta} href={pageHref} />
      </section>
    </div>
  );
}

export function ListingSkeleton() {
  return (
    <div className="grid gap-10 lg:grid-cols-[16rem_1fr]" aria-busy="true" aria-label="Loading products">
      <div className="hidden h-[32rem] animate-pulse rounded-2xl bg-surface lg:block" />
      <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <li key={i} className="space-y-3">
            <div className="aspect-[4/5] animate-pulse rounded-2xl bg-surface" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-surface" />
          </li>
        ))}
      </ul>
    </div>
  );
}
