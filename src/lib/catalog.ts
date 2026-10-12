import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { api, ApiError } from "./api";
import type { CatalogIndex, Group, Home, ProductDetail, ProductFilters, ProductPage, Product, Store } from "./types";

/**
 * Catalog reads, cached on the server so pages are prerendered and the API is
 * called once per few minutes, not once per visitor. Tags let a future
 * webhook from the inventory app refresh them right away (revalidateTag).
 */

export async function getStore(): Promise<Store> {
  "use cache";
  cacheLife("store");
  cacheTag("store");
  return (await api<{ data: Store }>("")).data;
}

export async function getHome(): Promise<Home> {
  "use cache";
  cacheLife("catalog");
  cacheTag("products", "categories");
  const data = (await api<{ data: Partial<Home> }>("/home")).data;
  // Defaults keep the page working with an older API (or an older cached reply)
  return { best_sellers: [], new_arrivals: [], deals: [], categories: [], ...data };
}

export async function getProducts(filters: ProductFilters = {}): Promise<ProductPage> {
  "use cache";
  cacheLife("catalog");
  cacheTag("products");
  return api<ProductPage>("/products", { query: filters });
}

/** A product and related products, or null when it isn't sold online */
export async function getProduct(id: number): Promise<{ product: ProductDetail; related: Product[] } | null> {
  "use cache";
  cacheLife("catalog");
  cacheTag("products", `product:${id}`);
  try {
    const res = await api<{ data: ProductDetail; related: Product[] }>(`/products/${id}`);
    return { product: res.data, related: res.related };
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export async function getCategories(): Promise<Group[]> {
  "use cache";
  cacheLife("catalog");
  cacheTag("categories");
  return (await api<{ data: Group[] }>("/categories")).data;
}

export async function getBrands(): Promise<Group[]> {
  "use cache";
  cacheLife("catalog");
  cacheTag("brands");
  return (await api<{ data: Group[] }>("/brands")).data;
}

/** Every product / category / brand (sitemap, llms.txt, static params) */
export async function getIndex(): Promise<CatalogIndex> {
  "use cache";
  cacheLife("catalog");
  cacheTag("products", "categories", "brands");
  return (await api<{ data: CatalogIndex }>("/index")).data;
}

export async function getCategory(id: number): Promise<Group | null> {
  return (await getCategories()).find((c) => c.id === id) ?? null;
}

export async function getBrand(id: number): Promise<Group | null> {
  return (await getBrands()).find((b) => b.id === id) ?? null;
}
