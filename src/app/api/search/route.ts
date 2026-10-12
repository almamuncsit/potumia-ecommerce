import { getProducts, getStore } from "@/lib/catalog";
import { formatMoney } from "@/lib/money";
import { productPath } from "@/lib/urls";

/**
 * Search-as-you-type suggestions for the search box: up to 6 products with
 * photo and price. Uses the same cached catalog reads as the pages.
 */
export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get("q")?.trim().slice(0, 100) ?? "";
  if (q.length < 2) return Response.json({ results: [], total: 0 });

  const [store, page] = await Promise.all([getStore(), getProducts({ q, per_page: 6 })]);

  return Response.json(
    {
      total: page.meta.total,
      results: page.data.map((p) => ({
        id: p.id,
        name: p.name,
        href: productPath(p),
        image: p.thumb ?? p.image,
        category: p.category?.name ?? null,
        price: formatMoney(p.price, store.currency),
        regular: p.regular_price ? formatMoney(p.regular_price, store.currency) : null,
        inStock: p.in_stock,
      })),
    },
    { headers: { "Cache-Control": "private, max-age=60" } },
  );
}
