import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { getBrands, getCategories, getProduct, getProducts, getStore } from "./catalog";
import { formatMoney } from "./money";
import { HAS_SIZE_GUIDE } from "@/content/pages";
import { THEME } from "./brand";
import { getShopBrand, type SiteBrand } from "./site";
import type { Product, Store } from "./types";
import { absoluteUrl, brandPath, categoryPath, productPath, siteUrl } from "./urls";

/**
 * Plain-text (Markdown) views of the store for AI assistants and LLM search,
 * following https://llmstxt.org: /llms.txt is the map, /llms-full.txt has
 * every product with its price, stock and description.
 */

const MAX_PAGES = 40; // 48 per page → up to 1,920 products

async function allProducts(): Promise<Product[]> {
  const first = await getProducts({ per_page: 48, sort: "name_asc" });
  const last = Math.min(first.meta.last_page, MAX_PAGES);
  const rest = await Promise.all(
    Array.from({ length: last - 1 }, (_, i) => getProducts({ per_page: 48, sort: "name_asc", page: i + 2 })),
  );
  return [first, ...rest].flatMap((page) => page.data);
}

const line = (text: string | null | undefined) => (text ?? "").replace(/\s+/g, " ").trim();

function header(store: Store, BRAND: SiteBrand): string[] {
  const contact = [store.phone && `Phone: ${store.phone}`, store.email && `Email: ${store.email}`, store.address && `Address: ${line(store.address)}`]
    .filter(Boolean)
    .join(" · ");

  const { payment, exchangeDays, deliveryDhaka, deliveryOutside } = BRAND.policies;
  const social = BRAND.socials.map((s) => `${s.label}: ${s.href}`).join(" · ");

  return [
    `# ${BRAND.name}`,
    "",
    `> ${BRAND.description}`,
    "",
    `${BRAND.name} (${siteUrl}) is an online store in ${BRAND.country}. Prices are in ${store.currency.code} (${store.currency.symbol}).`,
    "",
    "## Store policies",
    "",
    `- Payment: ${payment} only. Customers pay when the order arrives; nothing is paid online.`,
    `- Delivery: to every district of ${BRAND.country}. Inside Dhaka ${deliveryDhaka}, outside Dhaka ${deliveryOutside}. The delivery charge is confirmed by phone with each order.`,
    `- Exchange: within ${exchangeDays} days of delivery, unworn with tags attached. Damaged or wrong items are replaced free.`,
    `- Customer service: ${BRAND.hours.label}.`,
    contact ? `- Contact: ${contact}` : "",
    social ? `- Social: ${social}` : "",
  ].filter((l, i, all) => l !== "" || all[i - 1] !== "");
}

function productLine(p: Product, store: Store): string {
  const price = formatMoney(p.price, store.currency);
  const was = p.regular_price ? ` (was ${formatMoney(p.regular_price, store.currency)})` : "";
  const facts = [p.category?.name, p.brand?.name, p.in_stock ? "in stock" : "out of stock"].filter(Boolean).join(", ");
  return `- [${line(p.name)}](${absoluteUrl(productPath(p))}): ${price}${was}; ${facts}`;
}

export async function llmsTxt(): Promise<string> {
  "use cache";
  cacheLife("catalog");
  cacheTag("products", "categories", "brands", "store");

  const [store, categories, brands, products, BRAND] = await Promise.all([getStore(), getCategories(), getBrands(), allProducts(), getShopBrand()]);

  return [
    ...header(store, BRAND),
    "",
    "## Pages",
    "",
    `- [All products](${absoluteUrl("/products")}): every product with price and availability`,
    `- [${THEME.labels.collections}](${absoluteUrl("/categories")})`,
    `- [Brands](${absoluteUrl("/brands")})`,
    `- [About ${BRAND.name}](${absoluteUrl("/about")}): the brand and its promise`,
    `- [Shipping & delivery](${absoluteUrl("/shipping")})`,
    `- [Returns & exchange](${absoluteUrl("/returns")})`,
    ...(HAS_SIZE_GUIDE ? [`- [Size guide](${absoluteUrl("/size-guide")})`] : []),
    `- [FAQ](${absoluteUrl("/faq")})`,
    `- [Contact](${absoluteUrl("/contact")})`,
    `- [Full product details](${absoluteUrl("/llms-full.txt")}): this list with descriptions, in one file`,
    "",
    ...(categories.length
      ? [`## ${THEME.labels.collections}`, "", ...categories.map((c) => `- [${line(c.name)}](${absoluteUrl(categoryPath(c))}): ${c.products} ${c.products === 1 ? "product" : "products"}`), ""]
      : []),
    ...(brands.length ? ["## Brands", "", ...brands.map((b) => `- [${line(b.name)}](${absoluteUrl(brandPath(b))}): ${b.products} ${b.products === 1 ? "product" : "products"}`), ""] : []),
    "## Products",
    "",
    ...products.map((p) => productLine(p, store)),
    "",
  ].join("\n");
}

export async function llmsFullTxt(): Promise<string> {
  "use cache";
  cacheLife("catalog");
  cacheTag("products", "store");

  const [store, products, brand] = await Promise.all([getStore(), allProducts(), getShopBrand()]);
  const details = await Promise.all(products.map((p) => getProduct(p.id)));

  return [
    ...header(store, brand),
    "",
    "## Products",
    "",
    ...products.flatMap((p, i) => {
      const detail = details[i]?.product;
      return [
        `### ${line(p.name)}`,
        "",
        `- URL: ${absoluteUrl(productPath(p))}`,
        `- Price: ${formatMoney(p.price, store.currency)}${p.regular_price ? ` (regular ${formatMoney(p.regular_price, store.currency)})` : ""}`,
        `- Availability: ${p.in_stock ? "In stock" : "Out of stock"}`,
        ...(p.category ? [`- Category: ${p.category.name}`] : []),
        ...(p.brand ? [`- Brand: ${p.brand.name}`] : []),
        ...(p.sku ? [`- SKU: ${p.sku}`] : []),
        ...(p.unit ? [`- Sold by: ${p.unit}`] : []),
        ...(detail?.description ? ["", detail.description] : []),
        "",
      ];
    }),
  ].join("\n");
}
